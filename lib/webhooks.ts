import "server-only";
import { createHmac } from "node:crypto";
import { sendLarkCard } from "@/lib/lark";
import type { PaidTx } from "@/lib/notify";
import { isGlobalOrder, recordPaidHook, type Order } from "@/lib/orders";
import { GLOBAL, SITE, formatMoney } from "@/lib/site";

/**
 * Webhook GỬI ĐI tới hệ thống của bạn (n8n / Make / Zapier / server riêng) để gửi email cho khách.
 *
 *  WEBHOOK_ORDER_CREATED_URL  — khách vừa đăng ký (đã tạo đơn, CHƯA thanh toán)
 *  WEBHOOK_ORDER_PAID_URL     — khách đã thanh toán thành công
 *  WEBHOOK_SECRET             — (khuyến nghị) khoá ký HMAC-SHA256 để bên nhận xác minh
 *
 * Mỗi request là POST JSON, kèm header:
 *  X-Webhook-Event      order.created | order.paid
 *  X-Webhook-Id         "<mã đơn>:<event>" — cố định giữa các lần thử lại, dùng để chống xử lý trùng
 *  X-Webhook-Timestamp  unix giây
 *  X-Webhook-Signature  sha256=<hex>  = HMAC_SHA256(secret, `${timestamp}.${body}`)  (chỉ có khi đặt WEBHOOK_SECRET)
 * Bên nhận trả mã 2xx = thành công. Lỗi/timeout: thử lại tối đa 3 lần (0s, 2s, 5s).
 */

type Kind = "created" | "paid";

const URLS: Record<Kind, string | undefined> = {
  created: process.env.WEBHOOK_ORDER_CREATED_URL || undefined,
  paid: process.env.WEBHOOK_ORDER_PAID_URL || undefined,
};
const EVENT: Record<Kind, string> = { created: "order.created", paid: "order.paid" };
const RETRY_DELAYS_MS = [0, 2000, 5000];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function buildPayload(kind: Kind, order: Order, tx?: PaidTx) {
  const global = isGlobalOrder(order);
  // Đơn VND: số tiền là đồng (như trước đây). Đơn USD: số tiền theo đô la (79 = $79), không phải cent, cho dễ dùng trong email.
  const major = (minor: number) => (global ? minor / 100 : minor);
  const base = SITE.url.replace(/\/$/, "");
  return {
    event: EVENT[kind],
    id: `${order.code}:${EVENT[kind]}`,
    occurredAt: new Date().toISOString(),
    // market: "vn" = trang tiếng Việt (SePay, VND) · "global" = trang /global (PayPal, USD)
    market: global ? "global" : "vn",
    product: { name: SITE.productName, price: global ? GLOBAL.priceUsd : SITE.price, currency: order.currency },
    order: {
      code: order.code,
      amount: major(order.amount),
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt,
      paidVia: order.paidVia ?? null, // sepay | paypal | manual
      ...(kind === "paid" ? { paidAt: order.paidAt ?? null, paidAmount: major(order.paidAmount || order.amount) } : {}),
    },
    customer: {
      name: order.name,
      phone: order.phone,
      email: order.email,
      github: order.github,
      note: order.note,
      country: order.country ?? null,
      marketingOptIn: order.marketingOptIn,
    },
    // Link tiện dùng khi soạn email
    links: {
      site: global ? `${base}${GLOBAL.path}` : SITE.url,
      guide: global ? `${base}${GLOBAL.path}#setup` : `${base}/#huong-dan`,
      booking: SITE.bookingUrl || null,
    },
    ...(kind === "paid"
      ? {
          githubInvite: order.invite?.status ?? null, // invited | already | error | skipped
          transaction: tx
            ? { id: String(tx.id), reference: tx.reference ?? null, gateway: tx.gateway ?? null, time: tx.time ?? null, content: tx.content ?? null }
            : null,
        }
      : {}),
  };
}

async function recordPaid(code: string, state: { ok: boolean; at: string; attempts: number; error?: string }) {
  await recordPaidHook(code, state);
}

/** Gửi một sự kiện. Không bao giờ throw. Chỉ nên gọi trong `after()` để không chặn phản hồi. */
export async function deliverOrderEvent(kind: Kind, order: Order, tx?: PaidTx): Promise<void> {
  const url = URLS[kind];
  if (!url) return;

  const body = JSON.stringify(buildPayload(kind, order, tx));
  const secret = process.env.WEBHOOK_SECRET;
  let lastError = "";
  let attempts = 0;

  for (const delay of RETRY_DELAYS_MS) {
    if (delay) await sleep(delay);
    attempts++;
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "nextgency-webhook/1.0",
          "X-Webhook-Event": EVENT[kind],
          "X-Webhook-Id": `${order.code}:${EVENT[kind]}`,
          "X-Webhook-Timestamp": timestamp,
          ...(secret
            ? { "X-Webhook-Signature": "sha256=" + createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex") }
            : {}),
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        if (kind === "paid") await recordPaid(order.code, { ok: true, at: new Date().toISOString(), attempts }).catch(() => {});
        return;
      }
      lastError = `HTTP ${res.status}`;
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  console.error(`[webhook ${EVENT[kind]}] ${order.code} thất bại sau ${attempts} lần: ${lastError}`);
  // Với "đã thanh toán", báo Lark để bạn gửi email tay cho khách.
  if (kind === "paid") {
    await recordPaid(order.code, { ok: false, at: new Date().toISOString(), attempts, error: lastError }).catch(() => {});
    await sendLarkCard({
      title: "⚠️ Gửi webhook 'đã thanh toán' THẤT BẠI",
      tone: "orange",
      fields: [
        { label: "Mã đơn", value: order.code },
        { label: "Số tiền", value: formatMoney(order.amount, order.currency, "vi") },
        { label: "Khách hàng", value: order.name },
        { label: "Email", value: order.email },
        { label: "Lỗi", value: `${lastError} (đã thử ${attempts} lần)`, short: false },
      ],
      footer: "Hệ thống nhận webhook không phản hồi 2xx — hãy gửi email/onboarding cho khách thủ công và kiểm tra WEBHOOK_ORDER_PAID_URL.",
    }).catch(() => {});
  }
}
