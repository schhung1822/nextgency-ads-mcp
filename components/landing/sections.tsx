import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BellRingIcon,
  BotIcon,
  CheckIcon,
  HeadsetIcon,
  KeyRoundIcon,
  LayersIcon,
  LifeBuoyIcon,
  LockKeyholeIcon,
  RocketIcon,
  ServerIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TerminalIcon,
  XIcon,
} from "lucide-react";
import { BuyStarButton } from "@/components/checkout/checkout";
import { AnimatedHeading, HeroAurora, HeroTitle, PlatformMarquee, PlatformRotator, ShinyBadgeText, Stat } from "@/components/landing/fx";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { Reveal } from "@/components/landing/reveal";
import { Vnd } from "@/components/landing/vnd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { POLICIES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ helpers */

function SectionHead({
  eyebrow,
  title,
  accent,
  description,
  dark,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: React.ReactNode;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-10 max-w-4xl sm:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <Reveal>
          <p className={cn("mb-3 font-archivo text-xs font-semibold tracking-[0.2em] uppercase", dark ? "text-sky" : "text-iris")}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <AnimatedHeading title={title} accent={accent} dark={dark} align={align} />
      {description && (
        <Reveal delay={150}>
          <p className={cn("mt-4 text-pretty text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-muted-foreground")}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}

function Tick({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full", dark ? "bg-white/15 text-sky" : "bg-secondary text-iris")}>
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

/* --------------------------------------------------------------------- hero */

export function Hero() {
  return (
    <section id="top" className="bg-brand-hero relative isolate overflow-hidden pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
      <HeroAurora />
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <Reveal>
            <Badge className="mb-6 h-7 gap-2 border border-white/20 bg-white/10 px-3 text-xs text-white backdrop-blur">
              <SparklesIcon className="text-sky" /> <ShinyBadgeText>Dự án GitHub · MCP 2026 · Tự host</ShinyBadgeText>
            </Badge>
            <HeroTitle />
            <PlatformRotator />
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
              <strong className="font-semibold text-white">{SITE.productName}</strong> kết nối AI với Meta Ads, TikTok Ads, Google Ads, OpenAI Ads và dữ liệu thị trường qua Apify.
              Hỏi báo cáo, thao tác quảng cáo, nghiên cứu sản phẩm và đối thủ bằng tiếng Việt — ngay trong Claude, ChatGPT hoặc Gemini.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-7 grid max-w-xl gap-3 text-sm text-white/85 sm:text-base">
              <Tick dark>Một link MCP cho Meta, TikTok, Google, OpenAI Ads và Apify — số liệu quảng cáo cùng dữ liệu thị trường</Tick>
              <Tick dark>Nghiên cứu sản phẩm, giá, đánh giá, quảng cáo đối thủ trên sàn TMĐT, mạng xã hội, Google và website</Tick>
              <Tick dark>Tự host trên VPS của bạn, phân quyền đội ngũ, token mã hóa, trần chi phí tùy chỉnh</Tick>
            </ul>
          </Reveal>

          <Reveal delay={200} className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BuyStarButton className="text-base font-semibold">
              Mua ngay · <Vnd amount={SITE.price} />
              <ArrowRightIcon className="size-4" />
            </BuyStarButton>
            <a href="#tinh-nang" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-white/25 bg-white/5 px-6 text-base text-white hover:bg-white/15 hover:text-white")}>
              Xem tính năng
            </a>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Thanh toán QR, xác nhận tự động</span>
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Kèm Nextgency hỗ trợ setup</span>
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Sở hữu trọn đời · cập nhật miễn phí</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <ChatMock />
        </Reveal>
      </Container>
    </section>
  );
}

function ChatMock() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-violet/30 blur-3xl" aria-hidden />
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-ink/70 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="ml-2 font-archivo text-xs text-white/50">Claude · Ads MCP Simple</span>
          <span className="ml-auto text-[10px] tracking-wider text-white/40 uppercase">Minh hoạ</span>
        </div>
        <div className="grid gap-4 p-4 text-sm">
          <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-sm bg-iris/90 px-4 py-3 text-white">
            Phân tích CPA các chiến dịch Meta tuần qua, xem đối thủ đang chạy thông điệp gì và đọc đánh giá sản phẩm cùng phân khúc. Đề xuất 3 hướng quảng cáo mới. <em>Chưa thay đổi quảng cáo.</em>
          </div>
          <div className="grid gap-2">
            {[
              ["Meta Ads", "Đọc số liệu chiến dịch, nhóm quảng cáo"],
              ["Apify", "Quảng cáo đối thủ — Thư viện quảng cáo Facebook"],
              ["Apify", "Đánh giá sản phẩm cùng phân khúc trên sàn"],
            ].map(([src, text]) => (
              <div key={text} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/75">
                <span className="grid size-5 place-items-center rounded-md bg-sky/20 text-sky"><CheckIcon className="size-3" strokeWidth={3} /></span>
                <span><b className="font-semibold text-white">{src}</b> · {text}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3 text-white/85">
            Đã tổng hợp xong. Dưới đây là <b className="text-white">3 hướng quảng cáo mới</b>, mỗi hướng kèm căn cứ từ số liệu của bạn và tín hiệu thị trường. Mình chưa thay đổi gì trên tài khoản quảng cáo.
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- stats */

export function Stats() {
  return (
    <section aria-label="Con số nổi bật" className="relative z-10 border-b bg-white">
      <Container className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {[
          { stat: <Stat to={4} />, title: "Nền tảng quảng cáo", sub: "Meta, TikTok, Google, OpenAI" },
          { stat: <Stat to={5} suffix="+" />, title: "Client AI", sub: "Claude, ChatGPT, Gemini + CLI" },
          { stat: <Stat to={1} />, title: "Skill độc quyền", sub: "Phân tích Meta Ads thị trường VN" },
          { stat: <Stat text="AES-256" />, title: "Mã hóa token", sub: "Nằm trên VPS của bạn" },
        ].map((it, i) => (
          <Reveal key={it.title} delay={i * 80} className="px-2 py-8 text-center">
            {it.stat}
            <div className="mt-1 text-sm font-semibold text-navy">{it.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{it.sub}</div>
          </Reveal>
        ))}
      </Container>
      <div className="border-t py-5">
        <PlatformMarquee />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- audience */

export function Audience() {
  const fit = [
    "Người chạy quảng cáo Meta, TikTok, Google Ads, OpenAI Ads quản lý nhiều tài khoản",
    "Agency muốn cho nhân viên dùng AI thao tác quảng cáo mà không phải đưa token gốc",
    "Chủ shop chốt đơn qua inbox, Zalo, điện thoại, muốn AI phân tích quảng cáo Meta",
    "Đội marketing 2–20 người cần phân quyền, trần ngân sách và nhật ký minh bạch",
    "Người muốn nhận thông báo và báo cáo quảng cáo định kỳ qua Telegram",
    "Đội marketing và chủ shop cần nghiên cứu sản phẩm, đối thủ, giá, nội dung từ dữ liệu công khai qua Apify",
    "Người muốn tự host trên VPS bằng script cài nhanh, có video hướng dẫn để làm theo",
  ];
  const notFit = [
    "Người cần lịch tự động chạy độc lập trong Ads MCP Simple mà không cấu hình ứng dụng AI hoặc công cụ tự động hóa",
    "Người muốn đăng bài, sửa bài Fanpage: phần Fanpage chỉ đọc",
    "Người chưa đủ khả năng đọc hiểu tài liệu để biết sản phẩm có phù hợp với mình hay không",
  ];
  return (
    <section className="bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow="Dành cho ai" title="Sản phẩm này dành cho bạn nếu…" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Card className="h-full p-2 ring-iris/15">
              <CardContent className="p-4 sm:p-6">
                <ul className="grid gap-4 text-[15px] leading-relaxed text-navy/90">
                  {fit.map((t) => <Tick key={t}>{t}</Tick>)}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={120}>
            <Card className="self-start border-0 bg-navy p-2 text-white ring-white/10">
              <CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 text-lg font-semibold">Không dành cho</h3>
                <ul className="grid gap-4 text-[15px] leading-relaxed text-white/80">
                  {notFit.map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-red-500/20 text-red-300"><XIcon className="size-3.5" strokeWidth={3} /></span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- features */

export function Features() {
  const items = [
    { icon: LayersIcon, title: "Một link, nhiều nền tảng, nhiều tài khoản", body: "Kết nối và phân quyền các tài khoản quảng cáo, Fanpage; kết hợp số liệu doanh nghiệp với dữ liệu thị trường qua Apify. Hỏi số liệu và thao tác bằng tiếng Việt." },
    { icon: BarChart3Icon, title: "Skill độc quyền phân tích Meta Ads VN", body: "Hỗ trợ chẩn đoán nguyên nhân chi phí tăng và đề xuất scale, dừng hoặc thử nghiệm — thiết kế cho tài khoản chốt đơn qua inbox, Zalo, điện thoại." },
    { icon: BellRingIcon, title: "Thông báo qua Telegram", body: "Nhận tin khi quảng cáo có thay đổi và báo cáo do AI gửi theo yêu cầu hoặc theo lịch đã cấu hình." },
    { icon: TerminalIcon, title: "Tự host đơn giản: copy & paste", body: "Dùng script cài nhanh để triển khai lên VPS của bạn, có video hướng dẫn mở sau khi kích hoạt sản phẩm." },
    { icon: KeyRoundIcon, title: "Giao việc mà không lộ token", body: "Phân quyền Admin và Nhân viên, hỗ trợ xác thực 2 lớp, token mã hóa AES-256-GCM, ghi nhật ký từng lệnh AI." },
    { icon: SlidersHorizontalIcon, title: "Tùy chỉnh bảo vệ theo nhu cầu", body: "Bật xác nhận 2 bước, trần ngân sách, giá thầu và giới hạn thao tác trong chế độ Tùy chỉnh nâng cao. Chế độ Cơ bản không áp dụng các mức trần này." },
  ];
  return (
    <section id="tinh-nang" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Vì sao chọn Ads MCP Simple"
          title="Mọi thứ để AI làm việc với quảng cáo của bạn" accent="gọn trong một link"
          description="Ads MCP Simple cung cấp công cụ cho AI trong phạm vi tài khoản và quyền bạn cho phép; Skill hướng dẫn AI cách phân tích và thực hiện quy trình của doanh nghiệp."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90} className="h-full">
              <SpotlightCard theme="light" className="group h-full rounded-2xl border bg-card p-5 transition-transform duration-300 hover:-translate-y-1">
                <span className="bg-brand-button mb-4 grid size-11 place-items-center rounded-xl text-white shadow-md shadow-iris/30">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-lg leading-snug font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{f.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center text-sm text-muted-foreground">
          Hoạt động với <b className="text-navy">Claude, ChatGPT, Claude Code, Gemini CLI, Gemini Enterprise</b> · Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- apify */

export function Apify() {
  const sources = [
    { v: "shop", label: "Shopee · TikTok Shop · Lazada", body: "Tìm sản phẩm, so sánh giá, đọc thông tin và đánh giá để tìm nhu cầu, điểm khách hàng chưa hài lòng và góc nội dung mới." },
    { v: "tiktok", label: "TikTok", body: "Tìm video theo từ khóa, hashtag hoặc kênh; phân tích bình luận; tham khảo quảng cáo nổi bật từ TikTok Creative Center." },
    { v: "fb", label: "Facebook", body: "Nghiên cứu bài viết, thông tin Trang và bình luận công khai; xem quảng cáo đối thủ trong Thư viện quảng cáo Facebook." },
    { v: "ig", label: "Instagram · YouTube", body: "Nghiên cứu tài khoản, kênh và nội dung công khai theo các tác vụ được hỗ trợ." },
    { v: "google", label: "Google & website", body: "Nghiên cứu Google Search, địa điểm và đánh giá Google Maps, quảng cáo trên Google Ads Transparency Center và nội dung website." },
  ];
  const extras = [
    { icon: ShieldCheckIcon, title: "Xoay vòng token theo credit", body: "Mỗi MCP dùng kho gồm token dùng chung công ty và token cá nhân của chủ MCP. Hệ thống ưu tiên tài khoản còn nhiều credit và tự thử tài khoản khác khi hết credit hoặc gặp lỗi phù hợp lúc bắt đầu chạy." },
    { icon: LockKeyholeIcon, title: "Kiểm soát chi phí & bảo mật", body: "Trần chi phí mỗi lần chạy Apify (mặc định 1 USD/lần, áp dụng cả chế độ Cơ bản); trần theo ngày trong chế độ Tùy chỉnh nâng cao (mặc định 10 USD/ngày, 0 là không giới hạn). Token mã hóa AES-256-GCM, AI không nhận được token." },
    { icon: RocketIcon, title: "Kết hợp Skill & lịch định kỳ", body: "Dùng Skill riêng để quy định tiêu chí chọn sản phẩm, cách phân tích đối thủ, mẫu báo cáo. Khi ứng dụng AI hoặc công cụ tự động hóa hỗ trợ gọi MCP theo lịch, giao quy trình nghiên cứu hằng tuần và gửi báo cáo vào Telegram." },
  ];
  return (
    <section id="apify" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container>
        <SectionHead
          dark
          eyebrow="Mới từ phiên bản 1.1.x"
          title="AI quảng cáo hiểu thêm" accent="thị trường"
          description="Số liệu quảng cáo cho bạn biết doanh nghiệp đang chạy thế nào. Với Apify, AI có thêm dữ liệu bên ngoài để tìm hiểu khách hàng quan tâm gì, đối thủ truyền thông ra sao và sản phẩm nào đáng nghiên cứu."
        />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Reveal>
            <Tabs defaultValue="shop" className="gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:p-6">
              <p className="text-sm font-semibold text-white">Nghiên cứu sản phẩm, đối thủ và nội dung</p>
              <TabsList className="h-auto! w-full flex-wrap justify-start gap-1.5 bg-transparent p-0">
                {sources.map((s) => (
                  <TabsTrigger key={s.v} value={s.v} className="h-auto! flex-none rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white data-active:border-transparent data-active:bg-white! data-active:text-navy!">
                    {s.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sources.map((s) => (
                <TabsContent key={s.v} value={s.v} className="min-h-24 text-[15px] leading-relaxed text-white/80">
                  {s.body}
                </TabsContent>
              ))}
            </Tabs>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-white/15 bg-ink/60 p-5 sm:p-6">
              <p className="text-sm font-semibold text-white">Số liệu doanh nghiệp + dữ liệu thị trường trong cùng một MCP</p>
              <p className="mt-2 text-sm text-white/65">Không cần tách riêng cuộc trò chuyện phân tích quảng cáo và nghiên cứu thị trường. Chỉ cần giao việc:</p>
              <blockquote className="mt-4 rounded-xl border-l-4 border-violet bg-white/5 p-4 text-[15px] leading-relaxed text-white/90 italic">
                “Phân tích CPA các chiến dịch Meta tuần qua, xem đối thủ đang chạy thông điệp gì và đọc đánh giá sản phẩm cùng phân khúc. Đề xuất 3 hướng quảng cáo mới, giải thích căn cứ cho từng hướng. Chưa thay đổi quảng cáo.”
              </blockquote>
              <p className="mt-4 text-sm text-white/65">
                Bạn cũng có thể tạo <b className="text-white">MCP chỉ dùng Apify</b> cho công việc nghiên cứu, chưa cần kết nối tài khoản quảng cáo (từ bản 1.1.1).
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {extras.map((e, i) => (
            <Reveal key={e.title} delay={i * 90}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-5">
                <e.icon className="mb-3 size-6 text-sky" />
                <h3 className="text-base font-semibold">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{e.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <p className="mx-auto max-w-[960px] rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-xs leading-relaxed text-amber-100/90 sm:text-sm">
            <b>Lưu ý về Apify:</b> chi phí sử dụng phát sinh riêng trên tài khoản Apify của token được chọn, không nằm trong giá mua. Trần chi phí không bao gồm phí proxy.
            Dữ liệu phụ thuộc website nguồn và Actor bên thứ ba; riêng Shopee có thể trả thiếu dữ liệu, kết quả rỗng hoặc dữ liệu mẫu ở một số Actor/gói Free.
            Chỉ thu thập dữ liệu công khai và sử dụng tài khoản Apify hợp lệ theo điều khoản dịch vụ.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- skill */

export function SkillSection() {
  const points = [
    "Kiểm tra theo dõi chuyển đổi có đáng tin trước khi kết luận.",
    "Tìm nguyên nhân gốc ở cấp chiến dịch, nhóm quảng cáo, quảng cáo.",
    "Xử lý Breakdown Effect và chi phí biên.",
    "Đề xuất scale, dừng hoặc thử nghiệm dưới dạng giả thuyết kiểm chứng được.",
  ];
  return (
    <section id="skill" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Skill độc quyền</p>
          <AnimatedHeading title="Skill phân tích quảng cáo Meta" accent="cho thị trường Việt Nam" align="left" className="lg:text-4xl" />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Skill do noti.vn phát triển, chỉ người kích hoạt Ads MCP Simple mới được cấp quyền sử dụng. Skill chạy với dữ liệu từ Ads MCP Simple hoặc file Excel/CSV xuất từ Ads Manager, thiết kế cho tài khoản chốt đơn qua inbox, Zalo, điện thoại, sàn TMĐT — nơi ROAS trên tài khoản thường không đáng tin.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Có thể kết hợp với Skill riêng của doanh nghiệp để đưa tiêu chí sản phẩm, biên lợi nhuận và cách đọc dữ liệu thị trường vào quy trình phân tích.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Card className="p-2 ring-iris/20">
            <CardHeader className="p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-lg font-semibold text-navy">Skill giúp AI làm gì?</CardTitle>
              <CardDescription>Quy trình chẩn đoán trước khi đề xuất hành động</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 sm:pt-2">
              <ol className="grid gap-4">
                {points.map((p, i) => (
                  <li key={p} className="flex items-start gap-4">
                    <span className="bg-brand-button grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white">{i + 1}</span>
                    <span className="pt-1 text-[15px] leading-relaxed text-navy/90">{p}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- setup */

export function Setup() {
  const steps = [
    { icon: ServerIcon, title: "Chuẩn bị", body: "VPS Ubuntu 24.04 hoặc Debian 12, tên miền con và tài khoản GitHub được cấp quyền vào repo." },
    { icon: TerminalIcon, title: "Chạy script cài nhanh", body: "Làm theo video, sao chép và dán lệnh chạy script cài đặt, rồi điền thông tin được yêu cầu." },
    { icon: BotIcon, title: "Kết nối", body: "Kết nối tài khoản quảng cáo và công cụ AI; thêm token Apify nếu cần nghiên cứu dữ liệu thị trường." },
    { icon: LifeBuoyIcon, title: "Vận hành", body: "Cập nhật ngay trong web, tự sao lưu hằng ngày, tự quay về bản cũ nếu lỗi. Có hướng dẫn khôi phục và xử lý lỗi thường gặp." },
  ];
  return (
    <section id="cai-dat" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Cài đặt & hỗ trợ"
          title="Cài nhanh bằng script" accent="và có Nextgency đồng hành setup"
          description="Quy trình triển khai đã được đơn giản hoá: copy & paste lệnh cài đặt, điền một số thông tin để triển khai trên VPS của bạn. Video hướng dẫn được mở sau khi kích hoạt sản phẩm."
        />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <li className="relative h-full rounded-2xl border bg-card p-5">
                <span className="absolute top-4 right-4 font-archivo text-4xl font-black text-iris/10">0{i + 1}</span>
                <span className="mb-4 grid size-10 place-items-center rounded-xl bg-secondary text-iris"><s.icon className="size-5" /></span>
                <h3 className="font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-8">
          <div className="bg-brand-hero relative isolate overflow-hidden rounded-3xl p-6 text-white sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <Badge className="mb-4 h-6 border border-white/20 bg-white/10 text-white"><HeadsetIcon /> Gói của Nextgency</Badge>
                <h3 className="text-balance text-2xl font-bold sm:text-3xl">Không rành kỹ thuật? Nextgency hỗ trợ setup cho bạn</h3>
                <p className="mt-3 text-white/70">
                  Bạn không phải tự mày mò từng bước. Đội ngũ Nextgency đồng hành để Ads MCP Simple chạy được trên hạ tầng của chính bạn.
                </p>
              </div>
              <ul className="grid gap-3 text-sm text-white/90 sm:text-base">
                <Tick dark>Hỗ trợ cài đặt lên VPS và cấu hình tên miền</Tick>
                <Tick dark>Hỗ trợ kết nối tài khoản Meta, TikTok, Google, OpenAI Ads</Tick>
                <Tick dark>Hỗ trợ kết nối Claude / ChatGPT / Gemini và Telegram</Tick>
                <Tick dark>Hướng dẫn cách hỏi và giao việc cho AI hiệu quả</Tick>
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ includes */

export function Includes() {
  const get = [
    "Quyền truy cập repo GitHub riêng của Noti: bộ cài Docker Compose, script cài nhanh và hướng dẫn self-host tiếng Việt.",
    "Video hướng dẫn cài đặt, được xem sau khi kích hoạt sản phẩm.",
    "Skill độc quyền phân tích quảng cáo Meta cho thị trường Việt Nam.",
    "Cập nhật ngay trong web, tự sao lưu hằng ngày, tự quay về bản cũ nếu lỗi.",
    "Nextgency hỗ trợ setup cho bạn (xem gói hỗ trợ ở trên).",
  ];
  const supported = [
    "Hỏi số liệu và thao tác quảng cáo Meta, TikTok, Google Ads, OpenAI Ads qua AI theo quyền đã cấp và khả năng API của từng loại chiến dịch.",
    "Nghiên cứu sản phẩm, giá, đánh giá, đối thủ và nội dung công khai qua Apify.",
    "Nhận thông báo Telegram khi có thay đổi; yêu cầu AI gửi báo cáo vào kênh đã kết nối.",
    "Kết hợp ứng dụng AI hoặc công cụ tự động hóa hỗ trợ gọi MCP theo lịch.",
    "Xem Fanpage, bài viết và chỉ số Trang bằng kết nối Meta (chỉ đọc).",
    "Giao quyền cho nhân viên, agency và truy vết bằng nhật ký.",
  ];
  const limits = [
    "Lịch chạy do ứng dụng AI hoặc công cụ tự động hóa thực hiện; cần cấu hình lịch, quyền và nội dung công việc phù hợp.",
    "TikTok GMV Max: hỗ trợ xem và phân tích; mặc định chỉ xem. Thay đổi cần quản trị viên cấp quyền riêng và luôn xác nhận 2 bước. Chiến dịch GMV Max tạo mới hoặc sao chép chạy ngay, không tạo ở trạng thái tạm dừng.",
    "Với các loại quảng cáo hỗ trợ tạo mới thông thường, bản tạo mới được đặt ở trạng thái tạm dừng. Khả năng xem, sửa, tạo và sao chép phụ thuộc nền tảng; chẳng hạn chiến dịch Google Ads Video chỉ hỗ trợ xem qua API trong phạm vi tài liệu hiện tại.",
    "Không đăng hay sửa bài Fanpage qua kết nối Meta, không quản lý thanh toán quảng cáo.",
    "Apify không lấy được dữ liệu cần đăng nhập như nhóm kín, tài khoản riêng tư hay tin nhắn. Dữ liệu thị trường là dữ liệu bên thứ ba, cần kiểm tra trước khi ra quyết định.",
  ];
  return (
    <section id="nhan-duoc" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow="Quyền lợi" title="Bạn nhận được gì khi mua?" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full p-2 ring-iris/20">
              <CardContent className="p-4 sm:p-6">
                <ul className="grid gap-4 text-[15px] leading-relaxed text-navy/90">{get.map((t) => <Tick key={t}>{t}</Tick>)}</ul>
                <p className="mt-6 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  Bạn tự chuẩn bị VPS, tên miền, tài khoản AI phù hợp và tài khoản Apify nếu sử dụng. Các chi phí dịch vụ bên ngoài phát sinh riêng.
                </p>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={120}>
            <Accordion defaultValue={["supported"]} className="h-full rounded-2xl border bg-card px-5">
              <AccordionItem value="supported">
                <AccordionTrigger className="py-4 text-base font-semibold text-navy">Công việc được hỗ trợ</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-2.5 pb-3 text-sm leading-relaxed text-muted-foreground">
                    {supported.map((t) => <Tick key={t}>{t}</Tick>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="limits">
                <AccordionTrigger className="py-4 text-base font-semibold text-navy">Phạm vi và giới hạn cần biết</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-2.5 pb-3 text-sm leading-relaxed text-muted-foreground">
                    {limits.map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Thông tin tính năng được đối chiếu với mã nguồn và tài liệu Ads MCP Simple 1.1.1 ngày 15/10/2026.
        </p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ pricing */

export function Pricing() {
  const includes = [
    "Ads MCP Simple — sở hữu trọn đời, cập nhật miễn phí",
    "Repo GitHub riêng: Docker Compose, script cài nhanh, hướng dẫn tiếng Việt",
    "Video hướng dẫn cài đặt + Skill phân tích Meta Ads VN",
    "Nextgency hỗ trợ setup cho bạn",
    "Kích hoạt sau khi thanh toán, xác nhận tự động",
  ];
  return (
    <section id="mua" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container>
        <SectionHead dark eyebrow="Bắt đầu ngay" title={`Sở hữu ${SITE.productName}`} accent="kèm hỗ trợ setup" description="Một lần thanh toán. Không phí hàng tháng cho phần mềm." />
        <Reveal>
          <div className="mx-auto max-w-[960px] overflow-hidden rounded-3xl border border-white/20 bg-white text-navy shadow-2xl shadow-black/30">
            <div className="grid sm:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center gap-2 bg-secondary p-8 text-center sm:p-10">
                <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Trọn bộ</p>
                {SITE.compareAtPrice && <p className="text-lg text-muted-foreground line-through"><Vnd amount={SITE.compareAtPrice} /></p>}
                <p className="text-brand-gradient-dark text-5xl font-black tracking-tight sm:text-6xl"><Vnd amount={SITE.price} /></p>
                <p className="text-sm text-muted-foreground">Đã gồm hỗ trợ setup</p>
                <div className="mt-5 flex justify-center">
                  <BuyStarButton className="w-full text-base font-semibold">
                    Mua ngay
                    <ArrowRightIcon className="size-4" />
                  </BuyStarButton>
                </div>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheckIcon className="size-3.5 text-azure" /> Thanh toán QR · xác nhận tự động</p>
              </div>
              <div className="p-8 sm:p-10">
                <ul className="grid gap-3.5 text-[15px]">{includes.map((t) => <Tick key={t}>{t}</Tick>)}</ul>
              </div>
            </div>
            <div className="grid gap-3 border-t bg-muted/60 p-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2 sm:p-8">
              <p><b className="text-navy">Chú ý quan trọng.</b> Đọc thật kỹ thông tin để xem bạn có phù hợp với nội dung này hay không. Mọi thông tin đã có sẵn trong phần mô tả. Hãy có trách nhiệm với đồng tiền của bạn.</p>
              <p><b className="text-navy">Lưu ý khi mua dự án GitHub.</b> Dự án GitHub không hoàn tiền vì sau khi được thêm vào repo, người mua đã xem và clone được toàn bộ mã nguồn. Cần có tài khoản GitHub — bạn cung cấp tên tài khoản khi đặt mua để nhận lời mời vào repo. Xem <Link href="/policies/chinh-sach-thanh-toan" className="font-semibold text-iris underline underline-offset-4">Chính sách thanh toán &amp; hoàn tiền</Link> và <Link href="/terms" className="font-semibold text-iris underline underline-offset-4">Điều khoản sử dụng</Link>.</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- faq */

const FAQ = [
  { q: "Ads MCP Simple là gì và dùng để làm gì?", a: "Ads MCP Simple là phần mềm MCP quản lý quảng cáo tự host do Noti (noti.vn) phát triển. Bạn dùng Claude, ChatGPT hoặc ứng dụng Gemini được hỗ trợ để hỏi số liệu và thao tác Meta Ads, TikTok Ads, Google Ads, OpenAI Ads bằng tiếng Việt. Từ bản 1.1.x, sản phẩm tích hợp Apify để kết hợp dữ liệu quảng cáo với nghiên cứu sản phẩm, đối thủ và thị trường." },
  { q: "Apify dùng để làm gì? Có thể dùng riêng để nghiên cứu không?", a: "Apify giúp AI thu thập dữ liệu công khai để nghiên cứu sản phẩm, giá, đánh giá, quảng cáo và nội dung đối thủ — nguồn gồm Shopee, TikTok Shop, Lazada, TikTok, Facebook, Instagram, YouTube, Google và website theo danh mục tác vụ được hỗ trợ. Từ bản 1.1.1, bạn có thể tạo MCP chỉ dùng Apify khi kho có token sử dụng được, chưa cần kết nối tài khoản quảng cáo." },
  { q: "Hỗ trợ những nền tảng quảng cáo và AI nào?", a: "Nền tảng quảng cáo: Meta Ads (Facebook, Instagram), TikTok Ads (gồm GMV Max theo quyền riêng), Google Ads (gồm báo cáo YouTube) và OpenAI Ads. Apify cung cấp dữ liệu thị trường công khai, Telegram nhận thông báo. Phía AI hỗ trợ Claude, ChatGPT, Claude Code, Gemini CLI và Gemini Enterprise; Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại." },
  { q: "Tôi cần chuẩn bị gì trước khi mua?", a: "Một tài khoản GitHub (để được mời vào repo), một VPS Ubuntu 24.04 hoặc Debian 12 cùng tên miền con, tài khoản của ứng dụng AI bạn muốn dùng, và tài khoản Apify nếu cần nghiên cứu thị trường. Chi phí VPS, tên miền, AI và Apify phát sinh riêng, không nằm trong giá mua." },
  { q: "Gói hỗ trợ setup của Nextgency gồm những gì?", a: "Nextgency đồng hành cùng bạn trong quá trình đưa Ads MCP Simple vào hoạt động: cài lên VPS, kết nối tài khoản quảng cáo, kết nối ứng dụng AI và Telegram, hướng dẫn cách giao việc cho AI. Sau khi thanh toán, đội ngũ sẽ liên hệ để thống nhất lịch làm việc." },
  { q: "Thanh toán như thế nào và bao lâu thì được xác nhận?", a: "Bạn điền thông tin, hệ thống tạo mã QR chuyển khoản với số tiền và nội dung điền sẵn. Chỉ cần quét bằng app ngân hàng; giao dịch được ghi nhận tự động qua SePay và trang sẽ báo thành công ngay khi nhận được tiền. Vui lòng không sửa nội dung chuyển khoản." },
  { q: "Tôi có được hoàn tiền không?", a: "Dự án GitHub không hoàn tiền vì sau khi được thêm vào repo, người mua đã xem và clone được toàn bộ mã nguồn. Vì vậy hãy đọc kỹ phần “Dành cho ai”, “Phạm vi và giới hạn” trước khi mua, hoặc liên hệ Nextgency nếu còn băn khoăn." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container className="max-w-[960px]">
        <SectionHead eyebrow="FAQ" title="Câu hỏi thường gặp" />
        <Reveal>
          <Accordion className="rounded-2xl border bg-card px-5 sm:px-6">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="py-4 text-base font-semibold text-navy">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/* -------------------------------------------------------------- final + foot */

export function FinalCta() {
  return (
    <section className="bg-brand-soft py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[960px] text-center">
          <AnimatedHeading title="Sẵn sàng để AI làm việc" accent="cùng đội quảng cáo của bạn?" />
          <p className="mt-4 text-muted-foreground">Một lần thanh toán <Vnd amount={SITE.price} /> — có Nextgency đồng hành setup.</p>
          <div className="mt-8 flex justify-center">
            <BuyStarButton className="text-base font-semibold">
              Mua ngay <ArrowRightIcon className="size-4" />
            </BuyStarButton>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Footer() {
  const { zalo, phone, email } = SITE.contact;
  return (
    <footer className="bg-ink py-12 text-white/70">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-7 w-auto" />
            <p className="mt-4 text-sm leading-relaxed">Nextgency — giải pháp Digital Marketing, AI và tự động hóa cho doanh nghiệp.</p>
          </div>
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-white">Liên hệ</p>
            {zalo && <p>Zalo: {zalo}</p>}
            {phone && <p>Hotline: {phone}</p>}
            {email && <p>Email: {email}</p>}
            <a href={SITE.url} className="hover:text-white">{SITE.url.replace(/^https?:\/\//, "")}</a>
          </div>
        </div>
        <nav aria-label="Chính sách" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
          {POLICIES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-white">{p.label}</Link>
          ))}
        </nav>
        <div className="mt-6 text-xs leading-relaxed text-white/50">
          <p>© 2026 Nextgency. Ads MCP Simple là phần mềm do Noti (noti.vn) phát triển.</p>
          <p className="mt-1">Meta, TikTok, Google, OpenAI, Claude, ChatGPT, Gemini, Apify, Telegram là thương hiệu của các chủ sở hữu tương ứng; trang này không phải trang chính thức của các bên đó.</p>
        </div>
      </Container>
    </footer>
  );
}
