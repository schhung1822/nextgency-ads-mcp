import "server-only";
import { after } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { notifyPaypalIssue } from "@/lib/notify";
import { applyPaypalCapture, type Order, type PaypalCaptureInfo } from "@/lib/orders";
import { formatMoney } from "@/lib/site";

/** Gửi Lark kiểu "cảnh báo" — lỗi Lark không được làm hỏng việc ghi nhận tiền. */
export async function safeNotify(p: Promise<{ ok: boolean; error?: string }>, label: string) {
  try {
    const r = await p;
    if (!r.ok) console.error(`[paypal] Lark ${label}:`, r.error);
  } catch (e) {
    console.error(`[paypal] Lark ${label}:`, e);
  }
}

export type SettleResult = { status: "paid" | "processing" };

/**
 * Ghi nhận một lần capture PayPal vào đơn, dùng chung cho route capture (khách vừa duyệt thanh toán) và
 * webhook PAYMENT.CAPTURE.COMPLETED (phòng khi khách đóng trang hoặc DB lỗi giữa chừng).
 *
 *  • paid       → đơn chuyển "paid", các bước hậu thanh toán (mời GitHub, Lark, webhook email, Meta) chạy nền
 *  • processing → tiền chưa chắc chắn (PENDING) hoặc cần người kiểm tra (sai số tiền, đơn đã hủy…) — đã báo Lark
 * An toàn khi gọi lặp lại / song song: sổ giao dịch chống trùng theo mã capture.
 */
export async function settlePaypalCapture(order: Order, cap: PaypalCaptureInfo): Promise<SettleResult> {
  const money = (minor: number, currency: string) => (currency === "USD" || currency === "VND" ? formatMoney(minor, currency, "vi") : `${minor / 100} ${currency}`);
  const captureFields = [
    { label: "Mã capture PayPal", value: cap.captureId },
    { label: "Số tiền PayPal", value: money(cap.amountMinor, cap.currency) },
    ...(cap.payerEmail ? [{ label: "Email PayPal", value: cap.payerEmail }] : []),
  ];

  if (cap.status !== "COMPLETED") {
    await safeNotify(
      notifyPaypalIssue({
        title: "⏳ PayPal: thanh toán đang chờ xử lý (PENDING)",
        tone: "blue",
        order,
        fields: [...captureFields, { label: "Trạng thái", value: cap.status }],
        footer: "PayPal chưa chốt giao dịch này nên chưa cấp quyền. Khi PayPal chuyển sang COMPLETED, webhook sẽ tự xác nhận đơn; nếu bị từ chối thì không có tiền về.",
      }),
      "pending",
    );
    return { status: "processing" };
  }

  const result = await applyPaypalCapture(order.code, cap);
  switch (result.outcome) {
    case "paid":
      after(() => fulfillOrder(order.code));
      return { status: "paid" };
    case "duplicate":
      // Đã ghi sổ trước đó (khách bấm lại / webhook đến trước) — bảo đảm hậu thanh toán đã chạy rồi trả kết quả.
      if (result.order.status === "paid") {
        after(() => fulfillOrder(order.code));
        return { status: "paid" };
      }
      return { status: "processing" };
    case "extra":
      await safeNotify(
        notifyPaypalIssue({
          title: "⚠️ PayPal: nhận thêm tiền cho đơn đã thanh toán",
          order: result.order,
          fields: captureFields,
          footer: "Đơn này đã thanh toán trước đó — có thể khách trả 2 lần. Kiểm tra trong PayPal và hoàn lại khoản dư nếu đúng.",
        }),
        "extra",
      );
      return { status: "paid" };
    case "mismatch":
      await safeNotify(
        notifyPaypalIssue({
          title: "🚨 PayPal: số tiền / loại tiền KHÔNG khớp đơn",
          order: result.order,
          fields: captureFields,
          footer: "PayPal đã thu tiền nhưng không khớp đơn nên hệ thống KHÔNG tự cấp quyền. Kiểm tra giao dịch; nếu hợp lệ thì xác nhận tay qua API admin (status=paid), nếu không thì hoàn tiền trong PayPal.",
        }),
        "mismatch",
      );
      return { status: "processing" };
    case "cancelled":
      await safeNotify(
        notifyPaypalIssue({
          title: "⚠️ PayPal: tiền vào đơn đã bị HỦY",
          order: result.order,
          fields: captureFields,
          footer: "Đơn này đã hủy nhưng PayPal vẫn thu tiền — cần đối soát và hoàn tiền (hoặc xác nhận tay) cho khách.",
        }),
        "cancelled",
      );
      return { status: "processing" };
  }
}
