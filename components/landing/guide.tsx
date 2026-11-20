import {
  BotIcon,
  CheckIcon,
  ExternalLinkIcon,
  GlobeIcon,
  GitBranchIcon,
  QrCodeIcon,
  ServerIcon,
} from "lucide-react";
import { AnimatedHeading } from "@/components/landing/fx";
import { Reveal } from "@/components/landing/reveal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HAS_AFFILIATE, RESOURCES, type Resource } from "@/lib/resources";
import { LEGAL } from "@/lib/site";
import { cn } from "@/lib/utils";

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="grid gap-4">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-4">
          <span className="bg-brand-button mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white">{i + 1}</span>
          <span className="text-[15px] leading-relaxed text-navy/90">{t}</span>
        </li>
      ))}
    </ol>
  );
}

function Checks({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-navy/90">
          <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-iris">
            <CheckIcon className="size-3.5" strokeWidth={3} />
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Tip({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <p
      className={cn(
        "rounded-xl border p-3.5 text-sm leading-relaxed",
        tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-900" : "border-iris/20 bg-secondary/60 text-secondary-foreground",
      )}
    >
      {children}
    </p>
  );
}

function Links({ title, items }: { title: string; items: readonly Resource[] }) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold text-navy">{title}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {items.map((r) => (
          <li key={r.name}>
            <a
              href={r.href}
              target="_blank"
              rel={r.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
              className="group flex h-full items-start justify-between gap-3 rounded-xl border bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-iris/40 hover:shadow-md hover:shadow-iris/10"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 font-semibold text-navy">
                  {r.name}
                  {r.affiliate && <Badge variant="secondary" className="h-4.5 px-1.5 text-[10px] text-iris">Liên kết giới thiệu</Badge>}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{r.note}</span>
              </span>
              <ExternalLinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-iris" aria-hidden />
              <span className="sr-only">(mở trong tab mới)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TABS = [
  { v: "order", label: "Cách đặt hàng", icon: QrCodeIcon },
  { v: "github", label: "Chuẩn bị GitHub", icon: GitBranchIcon },
  { v: "vps", label: "Chuẩn bị VPS", icon: ServerIcon },
  { v: "domain", label: "Tên miền", icon: GlobeIcon },
  { v: "ai", label: "AI & công cụ", icon: BotIcon },
];

export function Guide() {
  return (
    <section id="huong-dan" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-4xl text-center sm:mb-14">
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Hướng dẫn</p>
          <AnimatedHeading title="Đặt hàng và chuẩn bị" accent="trước khi cài đặt" />
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Chuẩn bị sẵn những thứ dưới đây, buổi setup sẽ nhanh và suôn sẻ hơn. Bạn có thể vừa mua vừa chuẩn bị song song.
          </p>
        </Reveal>

        <Reveal>
          <Tabs defaultValue="order" className="gap-5">
            <TabsList className="h-auto! w-full flex-wrap justify-start gap-1.5 rounded-2xl border bg-white p-1.5 sm:justify-center">
              {TABS.map((t) => (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="h-auto! flex-none gap-2 rounded-xl px-3.5 py-2 text-sm text-muted-foreground data-active:bg-iris! data-active:text-white! data-active:shadow-md data-active:shadow-iris/30"
                >
                  <t.icon /> {t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur sm:p-8">
              <TabsContent value="order" className="grid gap-6">
                <Steps
                  items={[
                    <>Bấm <b>Mua ngay</b>, điền họ tên, số điện thoại/Zalo, email và <b>tên tài khoản GitHub</b> (username, không phải email). Repo sẽ được mời đúng vào tài khoản này.</>,
                    <>Tích xác nhận đã đọc Điều khoản sử dụng và Chính sách thanh toán &amp; hoàn tiền, rồi bấm <b>Tiếp tục thanh toán</b>.</>,
                    <>Quét mã QR bằng app ngân hàng. Số tiền và nội dung chuyển khoản (mã đơn) đã được điền sẵn — <b>đừng sửa nội dung</b>.</>,
                    <>Hệ thống tự xác nhận khi nhận được tiền và báo <b>Thanh toán thành công</b>. Hãy giữ lại mã đơn.</>,
                    <>Hệ thống tự động gửi lời mời vào repo cho tài khoản GitHub của bạn (hãy chấp nhận lời mời trong email/thông báo GitHub). Màn hình thành công có checklist chuẩn bị; tích đủ là mở được lịch để bạn tự chọn khung giờ hỗ trợ setup ({LEGAL.workHours}).</>,
                  ]}
                />
                <Tip>
                  Lỡ đóng cửa sổ thanh toán? Bấm <b>Mua ngay</b> lần nữa để mở lại mã QR đang chờ (trong cùng phiên trình duyệt). Mã đơn giữ hiệu lực {LEGAL.orderValidDays} ngày. Chuyển thiếu, thừa hoặc sai nội dung? Xem <a href="/policies/chinh-sach-thanh-toan" className="font-semibold text-iris underline underline-offset-4">Chính sách thanh toán</a>.
                </Tip>
              </TabsContent>

              <TabsContent value="github" className="grid gap-6">
                <Steps
                  items={[
                    <>Tạo tài khoản GitHub (miễn phí) và xác minh email.</>,
                    <>Khuyến nghị <b>tạo tài khoản riêng cho máy chủ</b> (ví dụ <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">congty-ads-server</code>). Token loại classic cần quyền <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">repo</code> — quyền này đọc/ghi mọi repo của chính tài khoản đó, nên đừng dùng tài khoản đang chứa dự án quan trọng.</>,
                    <>Khai báo đúng tên tài khoản này khi đặt hàng, rồi chấp nhận lời mời vào repo khi nhận được.</>,
                    <>Tạo 1 token (Tokens classic): tích <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">repo</code> và <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">read:packages</code>, chọn hạn 1 năm, bấm Generate rồi <b>sao chép ngay</b> (GitHub chỉ hiện một lần).</>,
                  ]}
                />
                <Tip tone="warn">Cất token trong trình quản lý mật khẩu. Không gửi token cho bất kỳ ai, kể cả khi nhờ hỗ trợ, và không dán vào chat/email.</Tip>
                <Links title="Liên kết hữu ích" items={RESOURCES.github} />
              </TabsContent>

              <TabsContent value="vps" className="grid gap-6">
                <Checks
                  items={[
                    <>Hệ điều hành <b>Ubuntu 24.04</b> (khuyến nghị) hoặc Debian 12.</>,
                    <>Cấu hình tối thiểu <b>1 vCPU, 2 GB RAM, 20 GB ổ cứng</b>. Nên chọn vùng máy chủ gần Việt Nam để truy cập nhanh hơn.</>,
                    <>Nhà cung cấp sẽ gửi cho bạn <b>địa chỉ IP, tên đăng nhập và mật khẩu</b> (hoặc khóa SSH) của VPS.</>,
                    <>Máy của bạn là Windows 10/11 hoặc macOS để kết nối bằng lệnh <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">ssh root@IP_VPS</code> (PowerShell / Terminal).</>,
                    <>Nếu trỏ tên miền thẳng về IP, cần mở cổng 80 và 443; nếu dùng Cloudflare Tunnel thì không cần mở cổng nào.</>,
                  ]}
                />
                <Tip>Không gửi mật khẩu root cho người khác qua chat. Khi cần hỗ trợ từ xa, hãy làm theo mục “Hỗ trợ từ xa và an toàn truy cập” trong <a href="/policies/chinh-sach-ho-tro" className="font-semibold text-iris underline underline-offset-4">Chính sách hỗ trợ</a>.</Tip>
                <div className="grid gap-6 lg:grid-cols-2">
                  <Links title="VPS nước ngoài" items={RESOURCES.vpsIntl} />
                  <Links title="VPS trong nước" items={RESOURCES.vpsVn} />
                </div>
              </TabsContent>

              <TabsContent value="domain" className="grid gap-6">
                <Checks
                  items={[
                    <>Cần <b>1 tên miền</b> (ví dụ <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">congty.vn</code>). Phần mềm chạy ở tên miền con, ví dụ <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">mcp.congty.vn</code>.</>,
                    <>Nên đặt tên miền con bắt đầu bằng <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">mcp.</code>; tránh bắt đầu bằng <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">ads.</code> vì một số trình chặn quảng cáo/diệt virus có thể chặn mất giao diện.</>,
                    <>Cách 1: tạo bản ghi <b>A</b> trỏ tên miền con về IP VPS (nếu dùng Cloudflare, để đám mây <b>xám — DNS only</b>).</>,
                    <>Cách 2: dùng <b>Cloudflare Tunnel</b> — tên miền phải đang được quản lý trên Cloudflare, không cần mở cổng trên VPS.</>,
                  ]}
                />
                <Links title="Nơi đăng ký tên miền" items={RESOURCES.domain} />
              </TabsContent>

              <TabsContent value="ai" className="grid gap-6">
                <Checks
                  items={[
                    <>Chọn ít nhất <b>1 ứng dụng AI</b> bạn sẽ dùng: Claude, ChatGPT hoặc Gemini (Gemini CLI/Enterprise; Gemini web cá nhân chưa được hỗ trợ). Kiểm tra gói của bạn có cho phép kết nối MCP/connector tùy chỉnh.</>,
                    <>Có quyền quản trị/phân tích phù hợp trên các <b>tài khoản quảng cáo</b> cần kết nối (Meta, TikTok, Google, OpenAI Ads).</>,
                    <><b>Tùy chọn:</b> tài khoản Apify để nghiên cứu thị trường (chi phí phát sinh riêng trên Apify) và một bot Telegram để nhận thông báo.</>,
                  ]}
                />
                <div className="grid gap-6 lg:grid-cols-2">
                  <Links title="Ứng dụng AI" items={RESOURCES.ai} />
                  <Links title="Công cụ bổ sung" items={RESOURCES.tools} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Reveal>

        {HAS_AFFILIATE && (
          <p className="mx-auto mt-6 max-w-[960px] text-center text-xs leading-relaxed text-muted-foreground">
            Các liên kết có nhãn “Liên kết giới thiệu” là liên kết affiliate: Nextgency có thể nhận hoa hồng khi bạn đăng ký qua đó. Bạn hoàn toàn có thể dùng nhà cung cấp khác đáp ứng yêu cầu kỹ thuật.
          </p>
        )}
      </div>
    </section>
  );
}
