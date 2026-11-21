import "server-only";
import { sendLarkCard, type LarkField } from "@/lib/lark";
import type { InviteResult } from "@/lib/github";
import type { Order } from "@/lib/orders";
import { formatVnd } from "@/lib/site";

const vnTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });

function customerFields(order: Order): LarkField[] {
  return [
    { label: "Khách hàng", value: order.name },
    { label: "Số điện thoại", value: order.phone },
    { label: "Email", value: order.email },
    { label: "GitHub (mời vào repo)", value: order.github || "— (khách chưa cung cấp)" },
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

function inviteField(invite: InviteResult | undefined, hasGithub: boolean): LarkField {
  if (!hasGithub) {
    return { label: "Mời GitHub", value: "⏭️ Khách chưa có/không điền GitHub — hướng dẫn tạo tài khoản rồi mời sau", short: false };
  }
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
export async function notifyPaid(order: Order, tx?: PaidTx, extra?: string) {
  const hasGithub = Boolean(order.github);
  const needManual = hasGithub && (order.invite?.status === "error" || order.invite?.status === "skipped" || !order.invite);
  return sendLarkCard({
    title: !hasGithub
      ? "✅ Thanh toán thành công — LIÊN HỆ KHÁCH QUA ZALO (chưa có GitHub)"
      : needManual
        ? "✅ Thanh toán thành công — CẦN MỜI GITHUB TAY"
        : "✅ Thanh toán thành công — Ads MCP Simple",
    tone: needManual || !hasGithub ? "orange" : "green",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Đã nhận", value: formatVnd(order.paidAmount || order.amount) },
      ...customerFields(order),
      inviteField(order.invite, hasGithub),
      ...(order.paidVia === "manual" || !tx
        ? [
            { label: "Hình thức", value: "🛠️ Admin xác nhận thủ công" },
            ...(order.adminNote ? [{ label: "Ghi chú admin", value: order.adminNote }] : []),
          ]
        : []),
      ...(tx
        ? [
            { label: "Ngân hàng", value: tx.gateway ?? "—" },
            { label: "Mã giao dịch", value: String(tx.reference || tx.id) },
            { label: "Thời gian GD", value: tx.time ?? vnTime(new Date().toISOString()) },
            { label: "Nội dung CK", value: tx.content ?? "—", short: false },
          ]
        : []),
    ],
    footer:
      extra ??
      (!hasGithub
        ? `Khách đã được thông báo sẽ có người liên hệ qua Zalo (${order.phone}). Việc cần làm: liên hệ khách, hướng dẫn tạo tài khoản GitHub rồi mời vào repo (quyền Read) và hẹn lịch setup.`
        : needManual
          ? `Việc cần làm: mời tài khoản GitHub của khách vào repo (quyền Read), rồi liên hệ khách qua Zalo (${order.phone}).`
          : `Khách đã được thông báo sẽ có người liên hệ qua Zalo (${order.phone}) — hãy liên hệ khách để hẹn lịch setup.`),
  });
}

export async function notifyUnderpaid(order: Order, tx: PaidTx) {
  return sendLarkCard({
    title: "⚠️ Khách chuyển THIẾU tiền — Ads MCP Simple",
    tone: "orange",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Cần thanh toán", value: formatVnd(order.amount) },
      { label: "Đã nhận (cộng dồn)", value: formatVnd(order.paidAmount) },
      { label: "Còn thiếu", value: formatVnd(Math.max(order.amount - order.paidAmount, 0)) },
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

/** Có tiền vào nhưng không gắn được vào đơn nào (sai mã) hoặc đơn đã bị hủy. */
export async function notifyUnmatched(codes: string[], tx: PaidTx, reason?: string) {
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
    footer: reason ?? "Không tìm thấy đơn tương ứng (mã đơn bị sửa/sai) — cần đối soát thủ công.",
  });
}
