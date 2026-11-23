import "server-only";
import type { PaypalCaptureInfo } from "@/lib/orders";
import { SITE } from "@/lib/site";

/**
 * PayPal Orders v2 (Standard Checkout) — chỉ chạy phía server.
 *
 *  NEXT_PUBLIC_PAYPAL_CLIENT_ID  Client ID của app REST (dùng cả ở trình duyệt để tải nút PayPal)
 *  PAYPAL_CLIENT_SECRET          Secret của app REST (bí mật)
 *  PAYPAL_ENV                    "sandbox" (mặc định) hoặc "live"
 *  PAYPAL_WEBHOOK_ID             ID webhook trong PayPal Developer → dùng để xác minh chữ ký webhook
 *
 * Luồng: trình duyệt bấm nút PayPal → server tạo đơn (createPaypalOrder) → khách duyệt thanh toán trên PayPal →
 * server capture (capturePaypalOrder) rồi mới ghi nhận "đã thanh toán". Giá luôn do server đặt.
 */

const LIVE = (process.env.PAYPAL_ENV ?? "sandbox").trim().toLowerCase() === "live";
const API = LIVE ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
const CLIENT_ID = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "").trim();
const CLIENT_SECRET = (process.env.PAYPAL_CLIENT_SECRET ?? "").trim();

export const paypalConfigured = Boolean(CLIENT_ID && CLIENT_SECRET);
export const paypalEnv: "live" | "sandbox" = LIVE ? "live" : "sandbox";

type RequestResult<T> = { ok: boolean; status: number; data: T };

const g = globalThis as unknown as { __ppToken?: { value: string; exp: number } };

async function accessToken(): Promise<string> {
  const cached = g.__ppToken;
  if (cached && cached.exp > Date.now() + 60_000) return cached.value;

  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(`PayPal OAuth ${res.status}: ${json.error_description ?? "không lấy được access token (kiểm tra Client ID / Secret / PAYPAL_ENV)"}`);
  }
  g.__ppToken = { value: json.access_token, exp: Date.now() + (json.expires_in ?? 300) * 1000 };
  return json.access_token;
}

/** Gọi PayPal REST. Không throw khi PayPal trả 4xx/5xx — để nơi gọi đọc mã lỗi; chỉ throw khi không gọi được. */
async function request<T = Record<string, unknown>>(
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<RequestResult<T>> {
  const token = await accessToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

/* ------------------------------------------------------------------ kiểu dữ liệu */

type Money = { currency_code: string; value: string };
type RawCapture = {
  id: string;
  status: string;
  amount?: Money;
  custom_id?: string;
  invoice_id?: string;
  create_time?: string;
};
export type RawPaypalOrder = {
  id: string;
  status: string;
  payer?: { email_address?: string };
  purchase_units?: {
    reference_id?: string;
    custom_id?: string;
    invoice_id?: string;
    amount?: Money;
    payments?: { captures?: RawCapture[] };
  }[];
};
type PaypalError = { name?: string; message?: string; details?: { issue?: string; description?: string }[] };

const issueOf = (e: PaypalError) => e.details?.[0]?.issue ?? e.name ?? "UNKNOWN";
const errorText = (e: PaypalError) => `${issueOf(e)}: ${e.details?.[0]?.description ?? e.message ?? ""}`.trim();

const toMinor = (value: string | undefined) => Math.round(Number(value ?? "0") * 100);

/** Lấy capture đầu tiên của đơn PayPal và quy về dạng dùng chung với phần ghi sổ. */
export function normalizeCapture(order: RawPaypalOrder): (PaypalCaptureInfo & { customId?: string; invoiceId?: string }) | null {
  const pu = order.purchase_units?.[0];
  const cap = pu?.payments?.captures?.[0];
  if (!pu || !cap || !cap.amount) return null;
  return {
    captureId: cap.id,
    paypalOrderId: order.id,
    status: cap.status,
    currency: cap.amount.currency_code,
    amountMinor: toMinor(cap.amount.value),
    payerEmail: order.payer?.email_address,
    time: cap.create_time,
    raw: order,
    customId: pu.custom_id ?? cap.custom_id,
    invoiceId: pu.invoice_id ?? cap.invoice_id,
  };
}

/* ------------------------------------------------------------------ nghiệp vụ */

/** Tạo đơn PayPal (intent CAPTURE) cho sản phẩm số. Trả về ID đơn PayPal để nút PayPal ở trình duyệt mở cửa sổ thanh toán. */
export async function createPaypalOrder(o: { code: string; amountMinor: number; currency: "USD"; description: string }): Promise<{ id: string }> {
  const value = (o.amountMinor / 100).toFixed(2);
  const money = { currency_code: o.currency, value };
  const r = await request<{ id?: string } & PaypalError>(
    "POST",
    "/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: o.code,
          custom_id: o.code,
          invoice_id: o.code,
          description: o.description.slice(0, 127),
          amount: { ...money, breakdown: { item_total: money } },
          items: [{ name: SITE.productName, sku: "ads-mcp-simple", quantity: "1", category: "DIGITAL_GOODS", unit_amount: money }],
        },
      ],
      // Sản phẩm số: không cần địa chỉ giao hàng; nút trên PayPal ghi "Pay Now".
      application_context: { brand_name: "Nextgency", shipping_preference: "NO_SHIPPING", user_action: "PAY_NOW" },
    },
    { "PayPal-Request-Id": `create-${o.code}`, Prefer: "return=minimal" },
  );
  if (!r.ok || !r.data.id) throw new Error(`PayPal tạo đơn lỗi ${r.status}: ${errorText(r.data)}`);
  return { id: r.data.id };
}

export type CaptureResult =
  | { kind: "ok"; order: RawPaypalOrder }
  | { kind: "declined"; issue: string } // thẻ/nguồn tiền bị từ chối — khách có thể thử lại bằng nguồn tiền khác
  | { kind: "error"; message: string };

/** Capture một đơn PayPal đã được khách duyệt. Gọi lại nhiều lần an toàn (PayPal-Request-Id + xử lý ORDER_ALREADY_CAPTURED). */
export async function capturePaypalOrder(paypalOrderId: string): Promise<CaptureResult> {
  const id = encodeURIComponent(paypalOrderId);
  const r = await request<RawPaypalOrder & PaypalError>("POST", `/v2/checkout/orders/${id}/capture`, {}, {
    "PayPal-Request-Id": `capture-${paypalOrderId}`,
    Prefer: "return=representation",
  });
  if (r.ok) return { kind: "ok", order: r.data };

  const issue = issueOf(r.data);
  if (issue === "ORDER_ALREADY_CAPTURED") {
    const again = await getPaypalOrder(paypalOrderId);
    return again ? { kind: "ok", order: again } : { kind: "error", message: "ORDER_ALREADY_CAPTURED nhưng không đọc lại được đơn" };
  }
  if (issue === "INSTRUMENT_DECLINED" || issue === "PAYER_ACTION_REQUIRED") return { kind: "declined", issue };
  return { kind: "error", message: `PayPal capture lỗi ${r.status}: ${errorText(r.data)}` };
}

export async function getPaypalOrder(paypalOrderId: string): Promise<RawPaypalOrder | null> {
  const r = await request<RawPaypalOrder>("GET", `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`);
  return r.ok ? r.data : null;
}

/** Xác minh chữ ký webhook bằng API của PayPal. Thiếu PAYPAL_WEBHOOK_ID = không xác minh được = từ chối. */
export async function verifyPaypalWebhook(headers: Headers, rawEvent: string): Promise<boolean> {
  const webhookId = (process.env.PAYPAL_WEBHOOK_ID ?? "").trim();
  if (!webhookId) return false;
  const h = (name: string) => headers.get(name) ?? "";
  try {
    // PayPal yêu cầu `webhook_event` được gửi lại nguyên văn. Chèn raw JSON trực tiếp thay vì parse rồi
    // JSON.stringify lại, vì thay đổi định dạng có thể làm bước xác minh chữ ký thất bại.
    const body = `{"auth_algo":${JSON.stringify(h("paypal-auth-algo"))},"cert_url":${JSON.stringify(h("paypal-cert-url"))},"transmission_id":${JSON.stringify(h("paypal-transmission-id"))},"transmission_sig":${JSON.stringify(h("paypal-transmission-sig"))},"transmission_time":${JSON.stringify(h("paypal-transmission-time"))},"webhook_id":${JSON.stringify(webhookId)},"webhook_event":${rawEvent}}`;
    const token = await accessToken();
    const res = await fetch(`${API}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const data = (await res.json().catch(() => ({}))) as { verification_status?: string };
    return res.ok && data.verification_status === "SUCCESS";
  } catch (e) {
    console.error("[paypal webhook] không xác minh được chữ ký", e);
    return false;
  }
}

/** ID đơn PayPal do PayPal sinh ra: chỉ gồm chữ/số, 10–30 ký tự. Kiểm tra trước khi đưa vào URL. */
export const isPaypalOrderId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9]{10,30}$/.test(v);
