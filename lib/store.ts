import "server-only";

/**
 * Lưu đơn hàng. Ưu tiên Upstash Redis (Vercel Marketplace → "Upstash for Redis"),
 * tự đọc KV_REST_API_URL / KV_REST_API_TOKEN (hoặc UPSTASH_REDIS_REST_*).
 *
 * Không có Redis:
 *  - dev: dùng bộ nhớ tạm trong process (chỉ để chạy thử)
 *  - production: KHÔNG lưu được → webhook vẫn gửi thông báo Lark từ dữ liệu giao dịch,
 *    còn thông tin khách được gửi ngay lúc tạo đơn (xem lib/notify).
 */

import type { InviteResult } from "@/lib/github";

export type OrderStatus = "pending" | "paid" | "underpaid";

export type Order = {
  code: string;
  name: string;
  phone: string;
  email: string;
  github: string;
  note: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  /** Thời điểm khách xác nhận đã đọc Điều khoản & Chính sách thanh toán */
  consentAt?: string;
  /** Kết quả tự động mời GitHub sau khi thanh toán */
  invite?: InviteResult;
  /** Trạng thái gửi webhook 'đã thanh toán' tới hệ thống của chủ shop */
  hooks?: { paid?: { ok: boolean; at: string; attempts: number; error?: string } };
  paidAt?: string;
  paidAmount?: number;
  transactionId?: string;
};

const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const PENDING_TTL = 60 * 60 * 24 * 7; // 7 ngày
const PAID_TTL = 60 * 60 * 24 * 180; // 180 ngày

export const isPersistent = Boolean(REDIS_URL && REDIS_TOKEN);
const useMemory = !isPersistent && process.env.NODE_ENV !== "production";

async function redis<T = unknown>(command: (string | number)[]): Promise<T | null> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { result?: T; error?: string };
  if (json.error) throw new Error(`Redis: ${json.error}`);
  return json.result ?? null;
}

// ---- bộ nhớ tạm cho dev ----
const g = globalThis as unknown as { __ngMem?: Map<string, { value: string; expires: number }> };
const mem = (g.__ngMem ??= new Map<string, { value: string; expires: number }>());
function memGet(key: string) {
  const hit = mem.get(key);
  if (!hit) return null;
  if (hit.expires < Date.now()) {
    mem.delete(key);
    return null;
  }
  return hit.value;
}
function memSet(key: string, value: string, ttl: number) {
  mem.set(key, { value, expires: Date.now() + ttl * 1000 });
}

async function get(key: string): Promise<string | null> {
  if (isPersistent) return redis<string>(["GET", key]);
  return useMemory ? memGet(key) : null;
}

async function set(key: string, value: string, ttl: number): Promise<void> {
  if (isPersistent) await redis(["SET", key, value, "EX", ttl]);
  else if (useMemory) memSet(key, value, ttl);
}

/** SET NX — trả true nếu key chưa tồn tại và đã được tạo. */
async function setNx(key: string, value: string, ttl: number): Promise<boolean> {
  if (isPersistent) return (await redis<string>(["SET", key, value, "EX", ttl, "NX"])) === "OK";
  if (useMemory) {
    if (memGet(key)) return false;
    memSet(key, value, ttl);
    return true;
  }
  return true; // không có store: không thể chống trùng, coi như mới
}

const orderKey = (code: string) => `order:${code}`;

export async function saveOrder(order: Order): Promise<void> {
  await set(orderKey(order.code), JSON.stringify(order), order.status === "paid" ? PAID_TTL : PENDING_TTL);
}

export async function createOrderIfFree(order: Order): Promise<boolean> {
  return setNx(orderKey(order.code), JSON.stringify(order), PENDING_TTL);
}

export async function getOrder(code: string): Promise<Order | null> {
  const raw = await get(orderKey(code));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

/** Mỗi giao dịch SePay (id) chỉ được xử lý một lần — SePay có thể gọi lại webhook. */
export async function claimTransaction(id: string | number): Promise<boolean> {
  return setNx(`tx:${id}`, "1", PAID_TTL);
}

/** Nhả khoá giao dịch khi xử lý lỗi, để SePay gọi lại webhook thì còn xử lý được. */
export async function releaseTransaction(id: string | number): Promise<void> {
  if (isPersistent) await redis(["DEL", `tx:${id}`]);
  else if (useMemory) mem.delete(`tx:${id}`);
}

/** Giới hạn tần suất đơn giản. Không có store thì bỏ qua. */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (isPersistent) {
    const count = await redis<number>(["INCR", `rl:${key}`]);
    if (count === 1) await redis(["EXPIRE", `rl:${key}`, windowSec]);
    return (count ?? 0) <= limit;
  }
  if (useMemory) {
    const k = `rl:${key}`;
    const current = Number(memGet(k) ?? 0) + 1;
    memSet(k, String(current), windowSec);
    return current <= limit;
  }
  return true;
}
