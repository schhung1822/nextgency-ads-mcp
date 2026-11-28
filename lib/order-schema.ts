import { z } from "zod";

// Lựa chọn của 3 câu hỏi riêng cho đăng ký tư vấn Ads MCP (plan "ads-mcp") — dùng chung cho form (client,
// để hiển thị option) và API (server, để kiểm tra giá trị hợp lệ). Value là slug lưu trong DB, label là chữ hiển thị.
export const BUSINESS_OPTIONS = [
  { value: "spa-tham-my", label: "Spa, thẩm mỹ, phòng khám" },
  { value: "fnb", label: "Nhà hàng, cà phê, F&B" },
  { value: "ban-le", label: "Shop bán lẻ, thời trang" },
  { value: "giao-duc", label: "Giáo dục, đào tạo" },
  { value: "dich-vu", label: "Dịch vụ khác" },
  { value: "khac", label: "Lĩnh vực khác" },
] as const;

export const ADS_RUNNER_OPTIONS = [
  { value: "tu-chay", label: "Tự chạy" },
  { value: "nhan-su", label: "Có nhân sự chạy" },
  { value: "thue-ngoai", label: "Thuê agency hoặc freelancer" },
  { value: "chua-chay", label: "Chưa chạy quảng cáo" },
] as const;

export const AD_BUDGET_OPTIONS = [
  { value: "duoi-5tr", label: "Dưới 5 triệu" },
  { value: "5-15tr", label: "5 - 15 triệu" },
  { value: "15-50tr", label: "15 - 50 triệu" },
  { value: "tren-50tr", label: "Trên 50 triệu" },
] as const;

const businessValues = BUSINESS_OPTIONS.map((o) => o.value) as [string, ...string[]];
const adsRunnerValues = ADS_RUNNER_OPTIONS.map((o) => o.value) as [string, ...string[]];
const adBudgetValues = AD_BUDGET_OPTIONS.map((o) => o.value) as [string, ...string[]];

// Họ tên và số điện thoại — dùng chung cho form đặt hàng và form đăng ký tư vấn (lib/consult-schema.ts).
export const nameField = z.string().trim().min(2, "Vui lòng nhập họ tên").max(80, "Họ tên quá dài");
export const phoneField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s.\-()]/g, ""))
  // Số Việt Nam (0… / 84… / +84…) hoặc số quốc tế dạng +mã nước (khách từ trang /en). Tối đa 16 ký tự, vừa cột VARCHAR(20).
  .pipe(z.string().regex(/^(?:(?:\+?84|0)\d{9}|\+[1-9]\d{7,14})$/, "Số điện thoại chưa đúng (VD: 0901234567, số nước ngoài dạng +65…)"));

// Dùng chung cho form (client) và API (server).
export const orderInputSchema = z
  .object({
    name: nameField,
    phone: phoneField,
    // Bắt buộc ở trang chủ (plan "default"); không bắt buộc ở đăng ký tư vấn Ads MCP (plan "ads-mcp") —
    // kiểm tra cụ thể ở superRefine bên dưới. Có nhập thì luôn phải đúng định dạng.
    email: z.string().trim().toLowerCase().max(120).optional().default(""),
    // Không bắt buộc: khách không rành kỹ thuật có thể bỏ trống, Nextgency hỗ trợ tạo/mời sau khi thanh toán.
    // Để trống => lưu chuỗi rỗng "".
    github: z
      .string()
      .trim()
      .transform((v) => v.replace(/^https?:\/\/github\.com\//i, "").replace(/^@/, "").replace(/\/+$/, ""))
      .pipe(
        z
          .string()
          .regex(/^(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))?$/, "Tên tài khoản GitHub chưa đúng (VD: nextgency) — hoặc để trống nếu bạn chưa có"),
      )
      .optional()
      .default(""),
    note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").optional().default(""),
    // 3 câu hỏi riêng cho đăng ký tư vấn Ads MCP — bắt buộc khi plan "ads-mcp" (kiểm tra ở superRefine).
    business: z.union([z.literal(""), z.enum(businessValues)]).optional().default(""),
    adsRunner: z.union([z.literal(""), z.enum(adsRunnerValues)]).optional().default(""),
    adBudget: z.union([z.literal(""), z.enum(adBudgetValues)]).optional().default(""),
    // Đã đọc & đồng ý Điều khoản + Chính sách thanh toán (bắt buộc)
    consent: z.literal(true, "Vui lòng xác nhận đã đọc và đồng ý để tiếp tục"),
    // honeypot — người thật không thấy ô này
    website: z.string().max(0).optional().default(""),
    // Chọn gói để server tính đúng giá (xem lib/site.ts) — không phải giá do client gửi lên.
    plan: z.enum(["default", "ads-mcp"]).optional().default("default"),
  })
  .superRefine((data, ctx) => {
    if (data.email && !z.email().safeParse(data.email).success) {
      ctx.addIssue({ path: ["email"], code: "custom", message: "Email chưa đúng định dạng" });
    }
    if (data.plan === "ads-mcp") {
      if (!data.business) ctx.addIssue({ path: ["business"], code: "custom", message: "Vui lòng chọn lĩnh vực" });
      if (!data.adsRunner) ctx.addIssue({ path: ["adsRunner"], code: "custom", message: "Vui lòng chọn một mục" });
      if (!data.adBudget) ctx.addIssue({ path: ["adBudget"], code: "custom", message: "Vui lòng chọn một mức" });
    } else if (!data.email) {
      ctx.addIssue({ path: ["email"], code: "custom", message: "Vui lòng nhập email" });
    }
  });

export type OrderInput = z.input<typeof orderInputSchema>;
export type OrderData = z.output<typeof orderInputSchema>;
