import { z } from "zod";
import { COUNTRY_CODES } from "@/lib/countries";

/**
 * Dữ liệu đơn hàng của trang quốc tế (/global) — dùng chung cho form (client) và API (server).
 * Thông báo lỗi bằng tiếng Anh vì trang này chỉ có tiếng Anh.
 */
export const globalOrderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "That name is too long"),
  email: z.string().trim().toLowerCase().max(120, "That email is too long").pipe(z.email("Please enter a valid email address")),
  country: z.enum(COUNTRY_CODES, "Please choose your country"),
  // Không bắt buộc. Để trống => lưu chuỗi rỗng "" (đội ngũ sẽ hướng dẫn tạo tài khoản và cấp quyền sau).
  github: z
    .string()
    .trim()
    .transform((v) => v.replace(/^https?:\/\/github\.com\//i, "").replace(/^@/, "").replace(/\/+$/, ""))
    .pipe(
      z
        .string()
        .regex(/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))?$/, "That doesn't look like a GitHub username (for example: nextgency). Leave it blank if you don't have one."),
    )
    .optional()
    .default(""),
  note: z.string().trim().max(500, "Notes can be up to 500 characters").optional().default(""),
  // Bắt buộc: đã đọc Điều khoản + Chính sách thanh toán & hoàn tiền + Quyền riêng tư.
  consentTerms: z.literal(true, "Please agree to the Terms and policies to continue"),
  // Bắt buộc: đồng ý giao nội dung số ngay và hiểu rằng sẽ mất quyền hủy/hoàn tiền sau khi được cấp quyền truy cập
  // (điều kiện để bỏ quyền rút lui 14 ngày theo luật EU/UK đối với nội dung số).
  consentDigital: z.literal(true, "Please confirm this to continue"),
  // Tuỳ chọn: nhận email giới thiệu sản phẩm. Mặc định không đồng ý.
  marketingOptIn: z.boolean().optional().default(false),
  // Khách đã chấp nhận cookie đo lường/quảng cáo trên trình duyệt hay chưa (quyết định có gửi Conversions API hay không).
  trackConsent: z.boolean().optional().default(false),
  // honeypot — người thật không thấy ô này
  website: z.string().max(0).optional().default(""),
});

export type GlobalOrderInput = z.input<typeof globalOrderSchema>;
export type GlobalOrderData = z.output<typeof globalOrderSchema>;
