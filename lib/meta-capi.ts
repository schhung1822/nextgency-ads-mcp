import "server-only";
import { createHash } from "node:crypto";
import { META_PIXEL_ID } from "./tracking";

/**
 * Gửi sự kiện từ MÁY CHỦ tới Meta Conversions API (Dataset).
 *
 *  NEXT_PUBLIC_META_PIXEL_ID   ID Dataset (cũng là ID Pixel)
 *  META_CAPI_ACCESS_TOKEN      Token Conversions API: Events Manager → Dataset → Settings → Conversions API → Generate access token
 *  META_CAPI_TEST_EVENT_CODE   (tuỳ chọn) mã "Test events" để xem sự kiện ngay trong Events Manager, khi chạy thật thì để trống
 *  META_GRAPH_VERSION          (tuỳ chọn) mặc định v23.0
 *  META_GRAPH_URL              chỉ đổi khi test với Meta giả lập
 *
 * Thiếu ID hoặc token → toàn bộ chức năng này tự tắt (không báo lỗi). Không bao giờ throw.
 * Email / SĐT / họ tên được băm SHA-256 trước khi gửi, đúng yêu cầu của Meta.
 */

const TOKEN = process.env.META_CAPI_ACCESS_TOKEN?.trim() ?? "";
const VERSION = /^v\d+\.\d+$/.test(process.env.META_GRAPH_VERSION ?? "") ? process.env.META_GRAPH_VERSION! : "v23.0";
const GRAPH_URL = (process.env.META_GRAPH_URL || "https://graph.facebook.com").replace(/\/$/, "");
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE?.trim() ?? "";

export const metaCapiConfigured = Boolean(META_PIXEL_ID && TOKEN);

export type MetaEventName = "CompleteRegistration" | "Purchase";

export type MetaUser = {
  email?: string;
  phone?: string;
  name?: string;
  externalId?: string;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type MetaEvent = {
  name: MetaEventName;
  /** Phải trùng event_id mà Pixel trình duyệt gửi để Meta gộp, không đếm đôi. */
  eventId: string;
  /** Unix giây. Meta chỉ nhận sự kiện trong vòng 7 ngày. */
  eventTime?: number;
  sourceUrl: string;
  user: MetaUser;
  custom?: Record<string, unknown>;
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/** SĐT Việt Nam → chỉ chữ số, đầu số quốc gia 84 (0901234567 → 84901234567). */
export function normalizePhone(raw: string): string | undefined {
  let d = raw.replace(/\D/g, "");
  if (!d) return undefined;
  if (d.startsWith("0")) d = "84" + d.slice(1);
  return d;
}

/** Tên người Việt: tên gọi là từ cuối, họ là từ đầu. Chữ thường, bỏ dấu câu (giữ dấu tiếng Việt). */
export function splitName(full: string): { fn?: string; ln?: string } {
  const parts = full
    .toLowerCase()
    .replace(/[^\p{L}\s'-]/gu, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  return { fn: parts[parts.length - 1], ln: parts[0] };
}

export function buildUserData(u: MetaUser): Record<string, unknown> {
  const email = u.email?.trim().toLowerCase();
  const phone = u.phone ? normalizePhone(u.phone) : undefined;
  const { fn, ln } = u.name ? splitName(u.name) : {};
  return {
    ...(email ? { em: [sha256(email)] } : {}),
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(fn ? { fn: [sha256(fn)] } : {}),
    ...(ln ? { ln: [sha256(ln)] } : {}),
    country: [sha256("vn")],
    ...(u.externalId ? { external_id: [sha256(u.externalId)] } : {}),
    // Các trường dưới đây KHÔNG băm.
    ...(u.ip ? { client_ip_address: u.ip } : {}),
    ...(u.userAgent ? { client_user_agent: u.userAgent } : {}),
    ...(u.fbp ? { fbp: u.fbp } : {}),
    ...(u.fbc ? { fbc: u.fbc } : {}),
  };
}

export function buildPayload(e: MetaEvent, now = Math.floor(Date.now() / 1000)) {
  // Sự kiện gửi trễ (vd. cron chạy lại) vẫn dùng đúng thời điểm thật, nhưng không quá hạn 7 ngày của Meta.
  const time = Math.min(now, Math.max(e.eventTime ?? now, now - 6 * 86_400));
  return {
    data: [
      {
        event_name: e.name,
        event_time: time,
        event_id: e.eventId,
        event_source_url: e.sourceUrl,
        action_source: "website",
        user_data: buildUserData(e.user),
        ...(e.custom ? { custom_data: e.custom } : {}),
      },
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {}),
  };
}

export async function sendMetaEvent(e: MetaEvent): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!metaCapiConfigured) return { ok: false, skipped: true };
  try {
    const res = await fetch(`${GRAPH_URL}/${VERSION}/${META_PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Token đặt trong body (không đặt trên URL) để không lọt vào log truy cập.
      body: JSON.stringify({ ...buildPayload(e), access_token: TOKEN }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) return { ok: true };
    let detail = "";
    try {
      const body = (await res.json()) as { error?: { message?: string; code?: number } };
      detail = [body.error?.code, body.error?.message].filter(Boolean).join(" — ");
    } catch {
      /* không có body */
    }
    const error = `HTTP ${res.status}${detail ? `: ${detail}` : ""}`.slice(0, 300);
    console.error(`[meta-capi] ${e.name} ${e.eventId} thất bại: ${error}`);
    return { ok: false, error };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[meta-capi] ${e.name} ${e.eventId} lỗi kết nối: ${error}`);
    return { ok: false, error };
  }
}
