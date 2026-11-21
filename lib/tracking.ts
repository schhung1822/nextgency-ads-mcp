/**
 * Cấu hình đo lường dùng chung cho trình duyệt và máy chủ (không import gì phía server ở đây).
 *
 *  NEXT_PUBLIC_GTM_ID         Google Tag Manager container (mặc định GTM-55BSJ6HH). Đặt rỗng = tắt GTM.
 *  NEXT_PUBLIC_META_PIXEL_ID  ID Dataset / Pixel của Meta. Trống = tắt Pixel + Conversions API.
 *  META_CAPI_ACCESS_TOKEN     (chỉ server) token Conversions API của Dataset đó.
 *
 * Giá trị NEXT_PUBLIC_* được nhúng lúc build → đổi xong phải build/deploy lại.
 */

// Chỉ nhận đúng định dạng vì các ID này được đưa vào script inline.
const GTM_RE = /^GTM-[A-Z0-9]{4,12}$/;
const PIXEL_RE = /^\d{8,20}$/;

const gtm = (process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-55BSJ6HH").trim();
const pixel = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();

export const GTM_ID = GTM_RE.test(gtm) ? gtm : "";
export const META_PIXEL_ID = PIXEL_RE.test(pixel) ? pixel : "";

/**
 * event_id của từng sự kiện, gắn với mã đơn. Trình duyệt (Pixel) và máy chủ (Conversions API)
 * gửi CÙNG event_id + tên sự kiện nên Meta tự gộp thành một, không đếm đôi.
 */
export const registrationEventId = (code: string) => `reg_${code}`;
export const purchaseEventId = (code: string) => `purchase_${code}`;

/** Định danh trình duyệt do Meta Pixel tạo (cookie _fbp / _fbc) — giúp Meta khớp sự kiện với quảng cáo. */
export type MetaBrowserIds = { fbp?: string; fbc?: string };

const FBP_RE = /^fb\.\d\.\d{10,13}\.\d{1,20}$/;
const FBC_RE = /^fb\.\d\.\d{10,13}\.[\w-]{1,300}$/;

/** Lọc dữ liệu do client gửi lên: sai định dạng thì bỏ (không tin client). */
export function sanitizeMetaIds(input: unknown): MetaBrowserIds {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const fbp = typeof o.fbp === "string" && FBP_RE.test(o.fbp) ? o.fbp : undefined;
  const fbc = typeof o.fbc === "string" && FBC_RE.test(o.fbc) ? o.fbc : undefined;
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
}
