/**
 * Đẩy sự kiện từ trình duyệt tới Google Tag Manager (dataLayer) và Meta Pixel (fbq).
 * Chỉ gọi từ client component. Mọi hàm đều "best effort": thiếu script / bị chặn quảng cáo thì bỏ qua, không bao giờ throw.
 *
 * Sự kiện:
 *  • Hoàn tất đăng ký  → dataLayer `complete_registration`  | Meta `CompleteRegistration`
 *  • Hoàn tất thanh toán → dataLayer `purchase` (chuẩn GA4 ecommerce) | Meta `Purchase`
 * Máy chủ gửi thêm cùng sự kiện qua Meta Conversions API với cùng event_id để không mất sự kiện khi khách đóng trang.
 */
import { SITE } from "@/lib/site";
import { purchaseEventId, registrationEventId, type MetaBrowserIds } from "@/lib/tracking";

type TrackWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  fbq?: (...args: unknown[]) => void;
};

const ITEM = { item_id: "ads-mcp-simple", item_name: SITE.productName };
const sent = new Set<string>(); // chống gửi lặp trong cùng một lần mở trang

function once(key: string): boolean {
  if (sent.has(key)) return false;
  sent.add(key);
  try {
    if (sessionStorage.getItem(`ng-tracked:${key}`)) return false;
    sessionStorage.setItem(`ng-tracked:${key}`, "1");
  } catch {
    /* sessionStorage bị chặn — vẫn còn chốt trong bộ nhớ */
  }
  return true;
}

function toDataLayer(payload: Record<string, unknown>) {
  try {
    const w = window as TrackWindow;
    (w.dataLayer = w.dataLayer || []).push(payload);
  } catch {
    /* bỏ qua */
  }
}

function toMeta(event: string, params: Record<string, unknown>, eventID: string) {
  try {
    (window as TrackWindow).fbq?.("track", event, params, { eventID });
  } catch {
    /* bỏ qua */
  }
}

/** Khách điền xong biểu mẫu và đơn đã được tạo (chưa thanh toán). */
export function trackRegistrationComplete(orderCode: string) {
  if (!once(`reg:${orderCode}`)) return;
  const eventId = registrationEventId(orderCode);
  toDataLayer({
    event: "complete_registration",
    event_id: eventId,
    order_code: orderCode,
    content_name: SITE.productName,
  });
  toMeta("CompleteRegistration", { content_name: SITE.productName, status: true }, eventId);
}

/** Hệ thống đã nhận đủ tiền cho đơn. `amount` tính theo đơn vị chính của tiền tệ (VND: đồng, USD: đô la). */
export function trackPurchaseComplete(orderCode: string, amount: number, currency: "VND" | "USD" = "VND") {
  if (!once(`purchase:${orderCode}`)) return;
  const eventId = purchaseEventId(orderCode);
  toDataLayer({ ecommerce: null }); // xoá ecommerce cũ trước khi đẩy cái mới (khuyến nghị của GA4)
  toDataLayer({
    event: "purchase",
    event_id: eventId,
    ecommerce: {
      transaction_id: orderCode,
      value: amount,
      currency,
      items: [{ ...ITEM, price: amount, quantity: 1 }],
    },
  });
  toMeta(
    "Purchase",
    { value: amount, currency, content_name: SITE.productName, content_type: "product", content_ids: [ITEM.item_id] },
    eventId,
  );
}

function readCookie(name: string): string | undefined {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Lấy _fbp / _fbc để gửi kèm đơn hàng — máy chủ dùng chúng khi báo Purchase qua Conversions API
 * (lúc đó không còn trình duyệt của khách). Chưa có cookie _fbc mà URL có ?fbclid thì tự dựng theo chuẩn của Meta.
 */
export function getMetaBrowserIds(): MetaBrowserIds {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc) {
    try {
      const clickId = new URLSearchParams(location.search).get("fbclid");
      if (clickId) fbc = `fb.1.${Date.now()}.${clickId}`;
    } catch {
      /* bỏ qua */
    }
  }
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
}
