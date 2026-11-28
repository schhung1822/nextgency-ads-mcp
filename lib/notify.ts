import "server-only";
import { sendLarkCard, type LarkField, type LarkTone } from "@/lib/lark";
import type { InviteResult } from "@/lib/github";
import { isGlobalOrder, type Order } from "@/lib/orders";
import { formatMoney, formatVnd } from "@/lib/site";

const vnTime = (iso: string) =>
  new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour12: false });

/** Số tiền của đơn theo đúng loại tiền (VND hoặc USD). */
const money = (order: Order, minor: number = order.amount) => formatMoney(minor, order.currency, "vi");

function customerFields(order: Order): LarkField[] {
  return [
    { label: "Khách hàng", value: order.name },
    // Khách quốc tế không có số Zalo — liên hệ qua email.
    ...(order.phone ? [{ label: "Số điện thoại", value: order.phone }] : []),
    { label: "Email", value: order.email },
    ...(order.country ? [{ label: "Quốc gia", value: order.country }] : []),
    { label: "GitHub (mời vào repo)", value: order.github || "— (khách chưa cung cấp)" },
    ...(order.note ? [{ label: "Ghi chú", value: order.note, short: false }] : []),
  ];
}

export type ConsultLead = {
  /** Mã tham chiếu của lượt đăng ký (không phải mã đơn — chưa có đơn, chưa thanh toán). */
  ref: string;
  name: string;
  phone: string;
  email: string;
  // Chữ hiển thị của các lựa chọn (không phải slug).
  business: string;
  adsRunner: string;
  adBudget: string;
};

/**
 * Khách vừa gửi form đăng ký tư vấn ở trang /auto-ads-ai (chưa thanh toán) — báo để đội ngũ liên hệ.
 * Đây là nơi duy nhất nhận thông tin khách, nên bên gọi phải báo lỗi cho khách nếu gửi thất bại.
 */
export async function notifyConsult(lead: ConsultLead) {
  return sendLarkCard({
    title: "🔔 Đăng ký tư vấn mới — Auto Ads AI",
    tone: "blue",
    fields: [
      { label: "Khách hàng", value: lead.name },
      { label: "Số điện thoại / Zalo", value: lead.phone },
      ...(lead.email ? [{ label: "Email", value: lead.email }] : []),
      { label: "Lĩnh vực", value: lead.business },
      { label: "Quảng cáo đang do ai chạy", value: lead.adsRunner },
      { label: "Tiền quảng cáo mỗi tháng", value: lead.adBudget },
      { label: "Thời gian đăng ký", value: vnTime(new Date().toISOString()) },
      { label: "Mã đăng ký", value: lead.ref },
    ],
    footer: `Khách đăng ký tư vấn ở trang /auto-ads-ai, CHƯA thanh toán. Việc cần làm: liên hệ khách qua Zalo/điện thoại (${lead.phone}) trong 24 giờ để tư vấn.`,
  });
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
  const global = isGlobalOrder(order);
  // Khách quốc tế liên hệ qua email (không có Zalo); khách trong nước qua Zalo.
  const channel = global ? `email (${order.email})` : `Zalo (${order.phone})`;
  const tag = global ? "[GLOBAL · PayPal] " : "";
  return sendLarkCard({
    title: !hasGithub
      ? `✅ ${tag}Thanh toán thành công — LIÊN HỆ KHÁCH QUA ${global ? "EMAIL" : "ZALO"} (chưa có GitHub)`
      : needManual
        ? `✅ ${tag}Thanh toán thành công — CẦN MỜI GITHUB TAY`
        : `✅ ${tag}Thanh toán thành công — Ads MCP Simple`,
    tone: needManual || !hasGithub ? "orange" : "green",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Đã nhận", value: money(order, order.paidAmount || order.amount) },
      ...customerFields(order),
      inviteField(order.invite, hasGithub),
      ...(order.paidVia === "manual" || !tx
        ? [
            { label: "Hình thức", value: "🛠️ Admin xác nhận thủ công" },
            ...(order.adminNote ? [{ label: "Ghi chú admin", value: order.adminNote }] : []),
          ]
        : []),
      ...(tx
        ? global
          ? [
              { label: "Cổng thanh toán", value: "PayPal" },
              { label: "Mã giao dịch (capture)", value: String(tx.reference || tx.id) },
              { label: "Thời gian GD", value: tx.time ?? "—" },
              { label: "Email PayPal", value: tx.content ?? order.payerEmail ?? "—" },
            ]
          : [
              { label: "Ngân hàng", value: tx.gateway ?? "—" },
              { label: "Mã giao dịch", value: String(tx.reference || tx.id) },
              { label: "Thời gian GD", value: tx.time ?? vnTime(new Date().toISOString()) },
              { label: "Nội dung CK", value: tx.content ?? "—", short: false },
            ]
        : []),
      ...(global ? [{ label: "Đồng ý email giới thiệu", value: order.marketingOptIn ? "Có" : "Không" }] : []),
    ],
    footer:
      extra ??
      (!hasGithub
        ? `Khách đã được thông báo sẽ có người liên hệ qua ${global ? "email" : "Zalo"} (${global ? order.email : order.phone}). Việc cần làm: liên hệ khách, hướng dẫn tạo tài khoản GitHub rồi mời vào repo (quyền Read) và hẹn lịch setup.`
        : needManual
          ? `Việc cần làm: mời tài khoản GitHub của khách vào repo (quyền Read), rồi liên hệ khách qua ${channel}.`
          : `Khách đã được thông báo sẽ có người liên hệ qua ${channel} — hãy liên hệ khách để hẹn lịch setup.`),
  });
}

/** Sự cố / việc cần người xử lý với đơn PayPal (sai số tiền, tiền thừa, hoàn tiền, tranh chấp…). */
export async function notifyPaypalIssue(opts: {
  title: string;
  tone?: LarkTone;
  order?: Order | null;
  fields?: LarkField[];
  footer: string;
}) {
  const o = opts.order;
  return sendLarkCard({
    title: opts.title,
    tone: opts.tone ?? "orange",
    fields: [
      ...(o ? [{ label: "Mã đơn", value: o.code }, { label: "Số tiền đơn", value: money(o) }, ...customerFields(o)] : []),
      ...(opts.fields ?? []),
    ],
    footer: opts.footer,
  });
}

export async function notifyUnderpaid(order: Order, tx: PaidTx) {
  return sendLarkCard({
    title: "⚠️ Khách chuyển THIẾU tiền — Ads MCP Simple",
    tone: "orange",
    fields: [
      { label: "Mã đơn", value: order.code },
      { label: "Cần thanh toán", value: money(order) },
      { label: "Đã nhận (cộng dồn)", value: money(order, order.paidAmount) },
      { label: "Còn thiếu", value: money(order, Math.max(order.amount - order.paidAmount, 0)) },
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
