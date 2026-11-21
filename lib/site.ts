/**
 * Cấu hình hiển thị của landing page. Sửa giá / liên hệ ở đây.
 * Các giá trị NEXT_PUBLIC_* có thể đặt trong biến môi trường Vercel.
 */
export const SITE = {
  name: "Nextgency",
  productName: "Ads MCP Simple",
  tagline: "Đội quảng cáo AI cho chủ doanh nghiệp và người chạy Ads",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nextgency.vn",
  // Giá bán (VND). Server luôn dùng giá này để tạo đơn — client không gửi giá lên.
  price: 1_999_000,
  // Để trống = không hiển thị giá gạch ngang. Chỉ đặt khi bạn thực sự có giá niêm yết cao hơn.
  compareAtPrice: null as number | null,
  // Link đặt lịch hỗ trợ setup (Cal.com / Lark Calendar / Google appointment). Để trống = ẩn nút.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  contact: {
    zalo: process.env.NEXT_PUBLIC_CONTACT_ZALO ?? "",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    // Fanpage để khách nhắn tin khi cần hỗ trợ thêm.
    fanpage: process.env.NEXT_PUBLIC_CONTACT_FANPAGE || "https://web.facebook.com/nextgency",
  },
} as const;

/** Link mở Zalo của Nextgency (NEXT_PUBLIC_CONTACT_ZALO có thể là link zalo.me hoặc số điện thoại). Trống = chưa cấu hình. */
export function zaloHref(): string {
  const z = SITE.contact.zalo.trim();
  if (!z) return "";
  if (/^https?:\/\//i.test(z)) return z;
  const digits = z.replace(/\D/g, "");
  return digits ? `https://zalo.me/${digits}` : "";
}

/** Thông tin dùng trong các trang chính sách. Chỉnh cho đúng với thực tế của Nextgency. */
export const LEGAL = {
  updated: "21 tháng 11, 2026",
  operator: process.env.NEXT_PUBLIC_LEGAL_NAME || "Nextgency",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? "",
  taxId: process.env.NEXT_PUBLIC_LEGAL_TAX_ID ?? "",
  workHours: "9h - 18h các ngày trong tuần (T7, CN nghỉ)",
  // Thời hạn hỗ trợ kể từ ngày thanh toán được xác nhận, và thời gian phản hồi ban đầu.
  supportMonths: 3,
  firstResponse: "03 ngày làm việc",
  // Đơn chưa thanh toán được giữ tối đa bao lâu (chỉ để hiển thị trong trang chính sách; đơn chưa thanh toán vẫn nằm trong DB cho tới khi bạn xóa/hủy).
  orderValidDays: 7,
} as const;

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

export const POLICIES = [
  { href: "/terms", label: "Điều khoản sử dụng" },
  { href: "/privacy", label: "Chính sách quyền riêng tư" },
  { href: "/policies/chinh-sach-thanh-toan", label: "Chính sách thanh toán & hoàn tiền" },
  { href: "/policies/chinh-sach-ho-tro", label: "Chính sách hỗ trợ" },
] as const;
