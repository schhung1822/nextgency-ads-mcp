import { NextResponse } from "next/server";
import { notifyPaypalIssue } from "@/lib/notify";
import { getOrder, getOrderByCaptureId, getOrderByPaypalOrderId, isPersistent, type Order } from "@/lib/orders";
import { verifyPaypalWebhook } from "@/lib/paypal";
import { safeNotify, settlePaypalCapture } from "@/lib/paypal-payments";

/** Webhook PayPal — cấu hình trong PayPal Developer → My Apps → (app của bạn) → Webhooks: https://<domain>/api/paypal/webhook */

type Link = { rel?: string; href?: string };
type Resource = {
  id?: string;
  status?: string;
  amount?: { currency_code?: string; value?: string };
  custom_id?: string;
  invoice_id?: string;
  create_time?: string;
  links?: Link[];
  supplementary_data?: { related_ids?: { order_id?: string } };
  // CUSTOMER.DISPUTE.*
  dispute_id?: string;
  reason?: string;
  disputed_transactions?: { seller_transaction_id?: string; gross_amount?: { currency_code?: string; value?: string } }[];
  dispute_amount?: { currency_code?: string; value?: string };
};
type PaypalEvent = { id?: string; event_type?: string; summary?: string; resource?: Resource };

const ok = () => NextResponse.json({ success: true });

const amountText = (a?: { currency_code?: string; value?: string }) => (a?.value ? `${a.value} ${a.currency_code ?? ""}`.trim() : "—");

/** Mã capture gốc nằm trong link rel="up" của sự kiện hoàn tiền: .../v2/payments/captures/<id>. */
function captureIdFromLinks(r: Resource): string | undefined {
  const href = r.links?.find((l) => l.rel === "up")?.href ?? "";
  return /\/captures\/([A-Za-z0-9]+)/.exec(href)?.[1];
}

/** Tìm đơn của chúng ta từ một sự kiện PayPal (custom_id/invoice_id do server đặt = mã đơn; hoặc tra theo mã capture/đơn PayPal). */
async function findOrder(ev: PaypalEvent): Promise<Order | null> {
  const r = ev.resource ?? {};
  const code = (r.custom_id ?? r.invoice_id ?? "").toUpperCase();
  if (/^[A-Z0-9]{6,20}$/.test(code)) {
    const o = await getOrder(code);
    if (o) return o;
  }
  const captureIds = [r.id, captureIdFromLinks(r), r.disputed_transactions?.[0]?.seller_transaction_id].filter((v): v is string => Boolean(v));
  for (const id of captureIds) {
    const o = await getOrderByCaptureId(id);
    if (o) return o;
  }
  const orderId = r.supplementary_data?.related_ids?.order_id;
  return orderId ? getOrderByPaypalOrderId(orderId) : null;
}

export async function POST(request: Request) {
  if (!isPersistent) return NextResponse.json({ success: false, message: "Database not configured" }, { status: 503 });

  const raw = await request.text();
  let event: PaypalEvent;
  try {
    event = JSON.parse(raw) as PaypalEvent;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  // Chỉ tin sự kiện có chữ ký hợp lệ của PayPal.
  if (!(await verifyPaypalWebhook(request.headers, raw))) {
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 });
  }

  const type = event.event_type ?? "";
  const r = event.resource ?? {};

  try {
    switch (type) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const order = await findOrder(event);
        if (!order || !r.id || !r.amount?.value || !r.amount.currency_code) {
          await safeNotify(
            notifyPaypalIssue({
              title: "💰 PayPal: nhận tiền nhưng chưa tra được đơn",
              tone: "blue",
              fields: [
                { label: "Mã capture", value: r.id ?? "—" },
                { label: "Số tiền", value: amountText(r.amount) },
                { label: "custom_id / invoice_id", value: r.custom_id ?? r.invoice_id ?? "—" },
              ],
              footer: "Không tìm thấy đơn tương ứng trong hệ thống — kiểm tra giao dịch trong PayPal và đối soát thủ công.",
            }),
            "unmatched",
          );
          return ok();
        }
        await settlePaypalCapture(order, {
          captureId: r.id,
          paypalOrderId: r.supplementary_data?.related_ids?.order_id ?? order.paypalOrderId,
          status: r.status ?? "COMPLETED",
          currency: r.amount.currency_code,
          amountMinor: Math.round(Number(r.amount.value) * 100),
          time: r.create_time,
          raw: event,
        });
        return ok();
      }

      case "PAYMENT.CAPTURE.REFUNDED":
      case "PAYMENT.CAPTURE.REVERSED":
      case "PAYMENT.CAPTURE.DENIED":
      case "CUSTOMER.DISPUTE.CREATED":
      case "CUSTOMER.DISPUTE.RESOLVED": {
        const order = await findOrder(event);
        const dispute = type.startsWith("CUSTOMER.DISPUTE");
        await safeNotify(
          notifyPaypalIssue({
            title: `🚨 PayPal: ${event.summary || type}`,
            tone: "red",
            order,
            fields: [
              { label: "Sự kiện", value: type },
              ...(dispute ? [{ label: "Mã tranh chấp", value: r.dispute_id ?? "—" }, { label: "Lý do", value: r.reason ?? "—" }] : []),
              { label: "Số tiền", value: amountText(r.amount ?? r.dispute_amount ?? r.disputed_transactions?.[0]?.gross_amount) },
              { label: "Trạng thái", value: r.status ?? "—" },
              ...(order ? [] : [{ label: "Đơn", value: "Không tra được đơn — xem trong PayPal" }]),
            ],
            footer:
              type === "CUSTOMER.DISPUTE.CREATED"
                ? "Khách mở tranh chấp. Vào PayPal để phản hồi đúng hạn (đính kèm bằng chứng: đơn, lời mời GitHub, email). Cân nhắc thu hồi quyền truy cập repo nếu hoàn tiền."
                : "Giao dịch bị hoàn/đảo/từ chối. Nếu tiền đã hoàn cho khách, hãy thu hồi quyền truy cập repo GitHub của họ và cập nhật đơn (API admin → cancelled).",
          }),
          "issue",
        );
        return ok();
      }

      default:
        return ok(); // sự kiện khác: bỏ qua
    }
  } catch (e) {
    // Trả 5xx để PayPal gửi lại (PayPal thử lại nhiều lần trong 3 ngày). Ghi sổ capture chống trùng nên gửi lại an toàn.
    console.error("[paypal webhook] xử lý lỗi", event.id, type, e);
    return NextResponse.json({ success: false, message: "Processing failed" }, { status: 500 });
  }
}
