import "server-only";
import { inviteToRepo } from "@/lib/github";
import { notifyPaid, type PaidTx } from "@/lib/notify";
import {
  claimFulfillment,
  finishFulfillment,
  getLatestTransaction,
  getOrder,
  markLarkNotified,
  releaseFulfillment,
  setInvite,
} from "@/lib/orders";
import { formatVnd } from "@/lib/site";
import { deliverOrderEvent } from "@/lib/webhooks";

export type FulfillResult = "done" | "skipped" | "retry";

/**
 * Chạy các bước SAU KHI ĐƠN ĐÃ THANH TOÁN, bất kể đơn thành "paid" bằng cách nào
 * (SePay tự động, admin đổi tay trong DB, hay API admin):
 *   1. mời khách vào repo GitHub (đúng 1 lần)
 *   2. gửi thẻ Lark "thanh toán thành công"
 *   3. gửi webhook `order.paid` tới hệ thống email của bạn
 *
 * An toàn khi gọi nhiều lần / song song: chỉ 1 tiến trình giành được khoá (claimFulfillment),
 * và mỗi bước ghi dấu hoàn thành vào DB nên không làm lại. Bước Lark lỗi → trả "retry" để cron chạy lại.
 */
export async function fulfillOrder(code: string): Promise<FulfillResult> {
  try {
    if (!(await claimFulfillment(code))) return "skipped";
  } catch (e) {
    console.error("[fulfill] claim lỗi", code, e);
    return "retry";
  }

  try {
    let order = await getOrder(code);
    if (!order || order.status !== "paid") {
      await releaseFulfillment(code);
      return "skipped";
    }
    const tx: PaidTx | undefined = await getLatestTransaction(code);

    // 1) Mời GitHub (chỉ khi chưa từng chạy; lỗi thì để Lark báo mời tay, không tự thử lại liên tục)
    if (!order.invite) {
      const invite = await inviteToRepo(order.github);
      await setInvite(code, invite);
      order = { ...order, invite };
    }

    // 2) Lark
    if (!order.larkNotifiedAt) {
      const extra =
        order.paidAmount > order.amount
          ? `Khách chuyển dư ${formatVnd(order.paidAmount - order.amount)} — cần kiểm tra và hoàn lại phần dư nếu đúng.`
          : undefined;
      const res = await notifyPaid(order, tx, extra);
      if (!res.ok) {
        console.error("[fulfill] Lark lỗi", code, res.error);
        await releaseFulfillment(code);
        return "retry";
      }
      await markLarkNotified(code);
    }

    // 3) Webhook gửi đi (tự thử lại + báo Lark khi thất bại hẳn; không tự gửi lại nếu đã có kết quả)
    if (!order.hooks?.paid) {
      await deliverOrderEvent("paid", order, tx);
    }

    await finishFulfillment(code);
    return "done";
  } catch (e) {
    console.error("[fulfill] lỗi", code, e);
    await releaseFulfillment(code).catch(() => {});
    return "retry";
  }
}
