import { after, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { notifyDuplicate, notifyUnderpaid, notifyUnmatched, type PaidTx } from "@/lib/notify";
import { applySepayPayment, findOrderByCodes, isGlobalOrder, recordUnmatchedTransaction } from "@/lib/orders";
import { extractCandidateCodes, verifyWebhookAuth, type SepayWebhookPayload } from "@/lib/sepay";

const ok = () => NextResponse.json({ success: true });

/** Gửi Lark kiểu "cảnh báo" — lỗi Lark không được làm hỏng việc ghi nhận tiền. */
async function safe(p: Promise<{ ok: boolean; error?: string }>, label: string) {
  try {
    const r = await p;
    if (!r.ok) console.error(`[sepay webhook] Lark ${label}:`, r.error);
  } catch (e) {
    console.error(`[sepay webhook] Lark ${label}:`, e);
  }
}

/**
 * Webhook SePay: https://<domain>/api/sepay/webhook
 * Cấu hình trong SePay → Tích hợp WebHooks → Kiểu chứng thực "API Key"
 * (SePay gửi header `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`).
 *
 * Việc DUY NHẤT webhook này làm đồng bộ là ghi nhận tiền vào MySQL (1 transaction, chống trùng theo id giao dịch).
 * Các bước tiếp theo (mời GitHub, Lark, webhook email) do fulfillOrder() chạy nền và tự thử lại qua cron.
 * Trả 5xx chỉ khi KHÔNG ghi được vào DB → SePay sẽ gọi lại.
 */
export async function POST(request: Request) {
  if (!verifyWebhookAuth(request.headers.get("authorization"))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: SepayWebhookPayload;
  try {
    payload = (await request.json()) as SepayWebhookPayload;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  // Chỉ quan tâm tiền vào.
  if (payload.transferType !== "in") return ok();
  const amount = Number(payload.transferAmount);
  if (!Number.isFinite(amount) || amount <= 0) return ok();

  const codes = extractCandidateCodes(payload);
  if (codes.length === 0) return ok(); // giao dịch không liên quan tới đơn nào

  if (payload.id == null) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  const tx: PaidTx = {
    id: payload.id,
    amount,
    content: payload.content ?? payload.description,
    reference: payload.referenceCode,
    gateway: payload.gateway,
    time: payload.transactionDate,
  };

  try {
    const order = await findOrderByCodes(codes);

    if (!order) {
      // Ghi sổ để không xử lý lại khi SePay gọi lại; chỉ báo Lark ở lần đầu.
      if (await recordUnmatchedTransaction(payload)) await safe(notifyUnmatched(codes, tx), "unmatched");
      return ok();
    }

    // Đơn quốc tế thanh toán bằng PayPal (USD) — không nhận chuyển khoản VND vào đơn này.
    if (isGlobalOrder(order)) {
      if (await recordUnmatchedTransaction(payload)) {
        await safe(
          notifyUnmatched(codes, tx, `Tiền VND vào đơn quốc tế ${order.code} (thanh toán bằng PayPal) — cần đối soát/hoàn tiền thủ công.`),
          "global-order",
        );
      }
      return ok();
    }

    const result = await applySepayPayment(order.code, payload);
    switch (result.outcome) {
      case "duplicate":
        return ok();
      case "paid":
        after(() => fulfillOrder(order.code));
        return ok();
      case "underpaid":
        await safe(notifyUnderpaid(result.order, tx), "underpaid");
        return ok();
      case "extra":
        await safe(notifyDuplicate(result.order, tx), "extra");
        return ok();
      case "cancelled":
        await safe(
          notifyUnmatched(codes, tx, `Tiền vào đơn ${order.code} đã bị HỦY — cần đối soát/hoàn tiền thủ công.`),
          "cancelled",
        );
        return ok();
    }
  } catch (e) {
    console.error("[sepay webhook] không ghi nhận được vào DB", payload.id, e);
    return NextResponse.json({ success: false, message: "Processing failed" }, { status: 500 });
  }
}
