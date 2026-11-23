import { after, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { getOrderByPaypalOrderId, isPersistent, rateLimit } from "@/lib/orders";
import { capturePaypalOrder, isPaypalOrderId, normalizeCapture, paypalConfigured } from "@/lib/paypal";
import { settlePaypalCapture } from "@/lib/paypal-payments";

const noStore = { "Cache-Control": "no-store" };

/**
 * Bước 2 của thanh toán PayPal (trang /global): sau khi khách duyệt trên PayPal, nút PayPal gọi route này trong `onApprove`.
 * Server capture đơn PayPal rồi mới ghi nhận "đã thanh toán". Trả về (HTTP 200 cho mọi kết quả nghiệp vụ):
 *   { status: "paid" | "processing" | "declined", code }   — hoặc 4xx/5xx { status: "error", error } khi lỗi hệ thống.
 * Nếu bước ghi DB lỗi sau khi PayPal đã thu tiền, webhook PAYMENT.CAPTURE.COMPLETED sẽ ghi nhận lại (xem ../webhook).
 */
export async function POST(request: Request) {
  if (!paypalConfigured || !isPersistent) {
    return NextResponse.json({ status: "error", error: "Checkout is not available right now." }, { status: 503, headers: noStore });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await rateLimit(`ppcapture:${ip}`, 30, 600))) {
    return NextResponse.json({ status: "error", error: "Too many attempts. Please wait a few minutes." }, { status: 429, headers: noStore });
  }

  const body = (await request.json().catch(() => null)) as { orderID?: unknown } | null;
  const paypalOrderId = body?.orderID;
  if (!isPaypalOrderId(paypalOrderId)) {
    return NextResponse.json({ status: "error", error: "Invalid request." }, { status: 400, headers: noStore });
  }

  // Chỉ capture những đơn PayPal do chính hệ thống này tạo.
  let order;
  try {
    order = await getOrderByPaypalOrderId(paypalOrderId);
  } catch (e) {
    console.error("[paypal/capture] lỗi DB khi tra đơn", paypalOrderId, e);
    return NextResponse.json({ status: "error", error: "We couldn't check your order. Please try again." }, { status: 503, headers: noStore });
  }
  if (!order) {
    return NextResponse.json({ status: "error", error: "We couldn't find this order." }, { status: 404, headers: noStore });
  }

  // Đã thanh toán trước đó (khách bấm lại / tải lại trang) → trả kết quả, bảo đảm hậu thanh toán đã chạy.
  if (order.status === "paid") {
    if (order.fulfillState !== "done") after(() => fulfillOrder(order.code));
    return NextResponse.json({ status: "paid", code: order.code }, { headers: noStore });
  }

  try {
    const captured = await capturePaypalOrder(paypalOrderId);
    if (captured.kind === "declined") {
      return NextResponse.json({ status: "declined", code: order.code }, { headers: noStore });
    }
    if (captured.kind === "error") {
      console.error("[paypal/capture]", order.code, captured.message);
      return NextResponse.json(
        { status: "error", code: order.code, error: "PayPal couldn't complete this payment. You have not been charged unless PayPal tells you otherwise." },
        { status: 502, headers: noStore },
      );
    }

    const cap = normalizeCapture(captured.order);
    // Đối chiếu: capture phải thuộc đúng đơn của chúng ta (custom_id do server đặt lúc tạo đơn).
    if (!cap || (cap.customId && cap.customId !== order.code)) {
      console.error("[paypal/capture] capture không khớp đơn", order.code, cap?.customId);
      return NextResponse.json(
        { status: "error", code: order.code, error: "We couldn't verify this payment automatically. If you were charged, email us with your order code." },
        { status: 502, headers: noStore },
      );
    }

    const settled = await settlePaypalCapture(order, cap);
    return NextResponse.json({ status: settled.status, code: order.code }, { headers: noStore });
  } catch (e) {
    // PayPal có thể đã thu tiền nhưng ta chưa ghi được → webhook sẽ ghi nhận lại. Báo khách đừng trả lần nữa.
    console.error("[paypal/capture] lỗi khi capture/ghi nhận", order.code, e);
    return NextResponse.json(
      {
        status: "error",
        code: order.code,
        error: "We couldn't confirm your payment automatically. Please don't pay again — if PayPal charged you, we'll confirm your order by email shortly.",
      },
      { status: 500, headers: noStore },
    );
  }
}
