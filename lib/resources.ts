/**
 * Kênh giới thiệu trong mục "Hướng dẫn đặt hàng & chuẩn bị".
 *
 * CÁCH GẮN LINK AFFILIATE: thay `href` bằng link affiliate của bạn và đặt `affiliate: true`.
 * Mục nào có `affiliate: true` sẽ tự có nhãn "Liên kết giới thiệu" + rel="sponsored",
 * và dòng công khai hoa hồng sẽ tự hiện trong mục hướng dẫn. Mặc định là link chính thức của nhà cung cấp.
 * `note` hiển thị ở trang tiếng Việt, `noteEn` ở trang tiếng Anh (/en).
 */
export type Resource = {
  name: string;
  nameEn?: string;
  note: string;
  noteEn: string;
  href: string;
  affiliate?: boolean;
};

export const RESOURCES = {
  github: [
    { name: "Đăng ký tài khoản GitHub", nameEn: "Create a GitHub account", note: "Miễn phí — cần xác minh email", noteEn: "Free — email verification required", href: "https://github.com/signup" },
    { name: "Tạo Personal Access Token (classic)", nameEn: "Create a Personal Access Token (classic)", note: "Tích repo + read:packages", noteEn: "Tick repo + read:packages", href: "https://github.com/settings/tokens/new" },
  ],
  vpsIntl: [
    { name: "Vultr", note: "Nhà cung cấp quốc tế · thanh toán thẻ quốc tế", noteEn: "International · pay by card", href: "https://www.vultr.com/" },
    { name: "DigitalOcean", note: "Nhà cung cấp quốc tế · giao diện dễ dùng", noteEn: "International · easy dashboard", href: "https://www.digitalocean.com/" },
    { name: "Hetzner Cloud", note: "Nhà cung cấp quốc tế · tính phí theo giờ", noteEn: "International · hourly billing", href: "https://www.hetzner.com/cloud" },
    { name: "Hostinger VPS", note: "Nhà cung cấp quốc tế · có giao diện tiếng Việt", noteEn: "International · multilingual dashboard", href: "https://www.hostinger.com/vps-hosting" },
  ],
  vpsVn: [
    { name: "Vietnix", note: "Nhà cung cấp trong nước", noteEn: "Vietnam-based provider", href: "https://vietnix.vn/" },
    { name: "AZDIGI", note: "Nhà cung cấp trong nước", noteEn: "Vietnam-based provider", href: "https://azdigi.com/" },
    { name: "BKNS", note: "Nhà cung cấp trong nước", noteEn: "Vietnam-based provider", href: "https://bkns.vn/" },
    { name: "Viettel IDC", note: "Nhà cung cấp trong nước", noteEn: "Vietnam-based provider", href: "https://viettelidc.com.vn/" },
  ],
  domain: [
    { name: "Cloudflare Registrar", note: "Cần nếu dùng Cloudflare Tunnel", noteEn: "Needed if you use Cloudflare Tunnel", href: "https://www.cloudflare.com/products/registrar/" },
    { name: "Namecheap", note: "Quốc tế · quản lý DNS dễ", noteEn: "International · simple DNS management", href: "https://www.namecheap.com/" },
    { name: "Mắt Bão", note: "Trong nước · tên miền .vn", noteEn: "Vietnam · .vn domains", href: "https://www.matbao.net/" },
    { name: "PA Vietnam", note: "Trong nước · tên miền .vn", noteEn: "Vietnam · .vn domains", href: "https://www.pavietnam.vn/" },
  ],
  ai: [
    { name: "Claude", note: "Ứng dụng AI của Anthropic", noteEn: "AI assistant by Anthropic", href: "https://claude.ai/" },
    { name: "ChatGPT", note: "Ứng dụng AI của OpenAI", noteEn: "AI assistant by OpenAI", href: "https://chatgpt.com/" },
    { name: "Gemini", note: "Dùng qua Gemini CLI / Gemini Enterprise", noteEn: "Via Gemini CLI / Gemini Enterprise", href: "https://gemini.google.com/" },
  ],
  tools: [
    { name: "Apify", note: "Tùy chọn · nghiên cứu thị trường (chi phí riêng)", noteEn: "Optional · market research (billed separately)", href: "https://apify.com/" },
    { name: "Telegram — @BotFather", note: "Tùy chọn · tạo bot nhận thông báo", noteEn: "Optional · create a bot for alerts", href: "https://t.me/BotFather" },
  ],
} satisfies Record<string, Resource[]>;

export type ResourceKey = keyof typeof RESOURCES;

export const HAS_AFFILIATE = Object.values(RESOURCES).some((list) =>
  (list as Resource[]).some((r) => r.affiliate),
);
