import { z } from "zod";

// Dùng chung cho form (client) và API (server).
export const orderInputSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80, "Họ tên quá dài"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s.\-()]/g, ""))
    .pipe(z.string().regex(/^(?:\+?84|0)\d{9}$/, "Số điện thoại chưa đúng (VD: 0901234567)")),
  email: z.string().trim().toLowerCase().max(120).pipe(z.email("Email chưa đúng định dạng")),
  github: z
    .string()
    .trim()
    .transform((v) => v.replace(/^https?:\/\/github\.com\//i, "").replace(/^@/, "").replace(/\/+$/, ""))
    .pipe(
      z
        .string()
        .regex(/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/, "Tên tài khoản GitHub chưa đúng (VD: nextgency)"),
    ),
  note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").optional().default(""),
  // Đã đọc & đồng ý Điều khoản + Chính sách thanh toán (bắt buộc)
  consent: z.literal(true, "Vui lòng xác nhận đã đọc và đồng ý để tiếp tục"),
  // honeypot — người thật không thấy ô này
  website: z.string().max(0).optional().default(""),
});

export type OrderInput = z.input<typeof orderInputSchema>;
export type OrderData = z.output<typeof orderInputSchema>;
