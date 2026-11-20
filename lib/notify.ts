import "server-only";
import { sendLarkCard, type LarkField } from "@/lib/lark";
import type { InviteResult } from "@/lib/github";
import type { Order } from "@/lib/store";
import { formatVnd } from "@/lib/site";

const vnTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });

function customerFields(order: Order): LarkField[] {
  return [
    { label: "Khách hàng", value: order.name },
    { label: "Số điện thoại", value: order.phone },
    { label: "Email", value: order.email },
    { label: "GitHub (mời vào repo)", value: order.github },
    ...(order.note ? [{ label: "Ghi chú", value: order.note, short: false }] : []),
  ];
}

export type PaidTx = {
  id: string | number;
  amount: number;
  content?: string;
  reference?: string;
  gateway?: string;
  time?: string;
};

function inviteField(invite?: InviteResult): LarkField {
  switch (invite?.status) {
    case "invited":
      return { label: "Mời GitHub", value: "✅ Đã gửi lời mời (quyền đọc) — chờ khách Accept" };
    case "already":
      return { label: "Mời GitHub", value: "ℹ️ Tài khoản đã có quyền truy cập repo" };
    case "error":
      return { label: "Mời GitHub", value: `❌ LỖI — cần mời tay. ${invite.message ?? ""}`, short: false };
    default:
      return { label: "Mời GitHub", value: "⏭️ Chưa bật tự động — cần mời tay", short: false };
  }
}

/** Đã nhận đủ tiền. Trả về lỗi nếu gửi Lark thất bại để webhook báo SePay gọi lại. */
export async function notifyPaid(order: Order, tx: PaidTx, extra?: string) {
  const needManual = order.invite?.status === "error" || order.invite?.status === "skipped" || !order.invite;
  return sendLarkCard({
    title: needManual ? "✅ Thanh toán thành công — CẦN MỜI GITHUB TAY" : "✅ Thanh toán thành công — Ads MCP Simple",
    tone: needManual ? "orange" : "green",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Đã nhận", value: formatVnd(order.paidAmount ?? tx.amount) },
      ...customerFields(order),
      inviteField(order.invite),
      { label: "Ngân hàng", value: tx.gateway ?? "—" },
      { label: "Mã giao dịch", value: String(tx.reference || tx.id) },
      { label: "Thời gian GD", value: tx.time ?? vnTime(new Date().toISOString()) },
      { label: "Nội dung CK", value: tx.content ?? "—", short: false },
    ],
    footer:
      extra ??
      (needManual
        ? "Việc cần làm: mời tài khoản GitHub của khách vào repo (quyền Read), rồi liên hệ khách."
        : "Khách đã được gửi hướng dẫn chuẩn bị và link đặt lịch setup trên màn hình thanh toán."),
  });
}

export async function notifyUnderpaid(order: Order, tx: PaidTx) {
  return sendLarkCard({
    title: "⚠️ Khách chuyển THIẾU tiền — Ads MCP Simple",
    tone: "orange",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Cần thanh toán", value: formatVnd(order.amount) },
      { label: "Đã nhận (cộng dồn)", value: formatVnd(order.paidAmount ?? tx.amount) },
      { label: "Còn thiếu", value: formatVnd(Math.max(order.amount - (order.paidAmount ?? tx.amount), 0)) },
      ...customerFields(order),
      { label: "Nội dung CK", value: tx.content ?? "—", short: false },
    ],
    footer: "Liên hệ khách để chuyển bù phần còn thiếu — đơn chưa được xác nhận.",
  });
}

/** Tiền vào cho đơn đã thanh toán đủ trước đó. */
export async function notifyDuplicate(order: Order, tx: PaidTx) {
  return sendLarkCard({
    title: "⚠️ Nhận thêm tiền cho đơn đã thanh toán",
    tone: "orange",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Khoản vừa nhận", value: formatVnd(tx.amount) },
      { label: "Khách hàng", value: order.name },
      { label: "Số điện thoại", value: order.phone },
      { label: "Nội dung CK", value: tx.content ?? "—", short: false },
    ],
    footer: "Có thể khách chuyển 2 lần — cần kiểm tra và hoàn tiền nếu đúng.",
  });
}

/** Có mã đơn trong nội dung CK nhưng không tra được đơn (chưa cấu hình Redis / đơn hết hạn). */
export async function notifyUnmatched(codes: string[], tx: PaidTx) {
  return sendLarkCard({
    title: "💰 Nhận chuyển khoản — chưa tra được đơn",
    tone: "blue",
    fields: [
      { label: "Mã trong nội dung", value: codes.join(", ") },
      { label: "Số tiền", value: formatVnd(tx.amount) },
      { label: "Ngân hàng", value: tx.gateway ?? "—" },
      { label: "Mã giao dịch", value: String(tx.reference || tx.id) },
      { label: "Nội dung CK", value: tx.content ?? "—", short: false },
    ],
    footer: "Không tìm thấy đơn tương ứng (có thể đơn đã hết hạn 7 ngày hoặc mã bị sửa) — cần đối soát thủ công.",
  });
}
