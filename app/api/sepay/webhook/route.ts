import { after, NextResponse } from "next/server";
import {
  extractCandidateCodes,
  verifyWebhookAuth,
  type SepayWebhookPayload,
} from "@/lib/sepay";
import { inviteToRepo } from "@/lib/github";
import { formatVnd } from "@/lib/site";
import { deliverOrderEvent } from "@/lib/webhooks";
import { claimTransaction, getOrder, releaseTransaction, saveOrder } from "@/lib/store";
import {
  notifyDuplicate,
  notifyPaid,
  notifyUnderpaid,
  notifyUnmatched,
  type PaidTx,
} from "@/lib/notify";

const ok = () => NextResponse.json({ success: true });

/**
 * Webhook SePay: https://<domain>/api/sepay/webhook
 * Cấu hình trong SePay → Tích hợp WebHooks → Kiểu chứng thực "API Key"
 * (SePay gửi header `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>`).
 * Trả 200 + {"success": true} để SePay không gọi lại; trả 5xx khi muốn SePay thử lại.
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

  const txId = payload.id;
  if (txId == null) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  // SePay có thể gọi lại cùng một giao dịch → chỉ xử lý một lần.
  if (!(await claimTransaction(txId))) return ok();

  const tx: PaidTx = {
    id: txId,
    amount,
    content: payload.content ?? payload.description,
    reference: payload.referenceCode,
    gateway: payload.gateway,
    time: payload.transactionDate,
  };

  try {
    let order = null;
    for (const code of codes) {
      order = await getOrder(code);
      if (order) break;
    }

    if (!order) {
      const res = await notifyUnmatched(codes, tx);
      if (!res.ok) throw new Error(res.error);
      return ok();
    }

    // Giao dịch này đã được áp vào đơn ở lần gọi trước (nhưng gửi Lark lỗi) → không cộng lại tiền.
    const alreadyApplied = order.transactionId === String(txId);

    if (order.status === "paid" && !alreadyApplied) {
      const res = await notifyDuplicate(order, tx);
      if (!res.ok) throw new Error(res.error);
      return ok();
    }

    const received = alreadyApplied ? (order.paidAmount ?? amount) : (order.paidAmount ?? 0) + amount;
    // Đủ tiền → tự mời khách vào repo GitHub (chưa mời hoặc lần trước lỗi thì thử lại).
    let invite = order.invite;
    if (received >= order.amount && (!invite || invite.status === "error")) {
      invite = await inviteToRepo(order.github);
    }

    const updated = {
      ...order,
      invite,
      paidAmount: received,
      transactionId: String(txId),
      ...(received >= order.amount
        ? { status: "paid" as const, paidAt: order.paidAt ?? new Date().toISOString() }
        : { status: "underpaid" as const }),
    };
    if (!alreadyApplied || invite !== order.invite) await saveOrder(updated);

    const res =
      updated.status === "paid"
        ? await notifyPaid(
            updated,
            tx,
            received > order.amount
              ? `Khách chuyển dư ${formatVnd(received - order.amount)} — cần kiểm tra và hoàn lại phần dư nếu đúng.`
              : undefined,
          )
        : await notifyUnderpaid(updated, tx);
    if (!res.ok) throw new Error(res.error);

    // Gửi webhook "đã thanh toán" tới hệ thống email của chủ shop (chạy nền, có thử lại).
    // Bỏ qua nếu lần trước đã gửi thành công (SePay có thể gọi lại webhook).
    if (updated.status === "paid" && !updated.hooks?.paid?.ok) {
      const paidOrder = updated;
      after(() => deliverOrderEvent("paid", paidOrder, tx));
    }
    return ok();
  } catch (e) {
    console.error("[sepay webhook]", txId, e);
    await releaseTransaction(txId).catch(() => {});
    return NextResponse.json({ success: false, message: "Processing failed" }, { status: 500 });
  }
}
