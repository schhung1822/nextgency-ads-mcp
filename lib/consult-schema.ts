import { z } from "zod";
import { ADS_RUNNER_OPTIONS, AD_BUDGET_OPTIONS, BUSINESS_OPTIONS, nameField, phoneField } from "@/lib/order-schema";

type Options = ReadonlyArray<{ value: string; label: string }>;

const valuesOf = (options: Options) => options.map((o) => o.value) as [string, ...string[]];

/** Chữ hiển thị của một lựa chọn (để ghi vào thông báo Lark thay cho slug). */
export const labelOf = (options: Options, value: string) => options.find((o) => o.value === value)?.label ?? value;

/**
 * Form đăng ký tư vấn ở trang /auto-ads-ai — dùng chung cho form (client) và API (server).
 * Khác form đặt hàng: không có bước thanh toán, không tạo đơn; gửi xong là báo về Lark để đội ngũ liên hệ.
 */
export const consultInputSchema = z.object({
  name: nameField,
  phone: phoneField,
  // Không bắt buộc; có nhập thì phải đúng định dạng.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120, "Email quá dài")
    .refine((v) => !v || z.email().safeParse(v).success, "Email chưa đúng định dạng")
    .optional()
    .default(""),
  business: z.enum(valuesOf(BUSINESS_OPTIONS), "Vui lòng chọn lĩnh vực"),
  adsRunner: z.enum(valuesOf(ADS_RUNNER_OPTIONS), "Vui lòng chọn một mục"),
  adBudget: z.enum(valuesOf(AD_BUDGET_OPTIONS), "Vui lòng chọn một mức"),
  // honeypot — người thật không thấy ô này
  website: z.string().max(0).optional().default(""),
});

export type ConsultInput = z.input<typeof consultInputSchema>;
export type ConsultData = z.output<typeof consultInputSchema>;
