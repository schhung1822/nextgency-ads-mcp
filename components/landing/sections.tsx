import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BellRingIcon,
  CheckIcon,
  ClapperboardIcon,
  HandshakeIcon,
  HeadsetIcon,
  KeyRoundIcon,
  LayersIcon,
  LockKeyholeIcon,
  MegaphoneIcon,
  MessageSquareTextIcon,
  RocketIcon,
  ScanSearchIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StoreIcon,
  TerminalIcon,
  UserRoundIcon,
  UsersRoundIcon,
  UtensilsIcon,
  WalletIcon,
  XIcon,
  BotIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { BuyStarButton } from "@/components/checkout/checkout";
import { AnimatedHeading, HeroAurora, HeroTitle, PlatformMarquee, ShinyBadgeText, Stat } from "@/components/landing/fx";
import { HeroChat } from "@/components/landing/hero-chat";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { Reveal } from "@/components/landing/reveal";
import { Vnd } from "@/components/landing/vnd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LEGAL, POLICIES, SITE, zaloHref } from "@/lib/site";
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
      <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <Reveal>
            <Badge className="mb-6 h-7 gap-2 border border-white/20 bg-white/10 px-3 text-xs text-white backdrop-blur">
              <SparklesIcon className="text-sky" /> <ShinyBadgeText>MCP không còn là chuyện của dân công nghệ</ShinyBadgeText>
            </Badge>
            <HeroTitle />
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
              <strong className="font-semibold text-white">MCP biến AI thành một đội chạy quảng cáo</strong> cho bạn trên Facebook, TikTok, Google.
              Bạn hỏi bằng tiếng Việt — đội AI xem số liệu, chỉ ra video nào ra khách, chỗ nào đang phí tiền, rồi góp ý lại cho bạn và thao tác giúp khi bạn đồng ý.
            </p>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
              <b className="font-semibold text-white/85">{SITE.productName}</b> là bộ cài sẵn để bạn có đội AI này, kèm Nextgency hỗ trợ cài đặt — bạn không cần biết kỹ thuật.
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BuyStarButton className="text-base font-semibold">
              Mua ngay · <Vnd amount={SITE.price} />
              <ArrowRightIcon className="size-4" />
            </BuyStarButton>
            <a href="#mcp-la-gi" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-white/25 bg-white/5 px-6 text-base text-white hover:bg-white/15 hover:text-white")}>
              Hiểu MCP trong 30 giây
            </a>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Thanh toán QR, xác nhận tự động</span>
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Kèm Nextgency hỗ trợ cài đặt</span>
              <span className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> Trả một lần · cập nhật miễn phí</span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <HeroChat />
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- stats */

export function Stats() {
  return (
    <section aria-label="Con số nổi bật" className="relative z-10 border-b bg-white">
      <Container className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {[
          { stat: <Stat to={4} />, title: "Nền tảng quảng cáo", sub: "Facebook, TikTok, Google, OpenAI" },
          { stat: <Stat to={5} suffix="+" />, title: "Ứng dụng AI dùng được", sub: "Claude, ChatGPT, Gemini…" },
          { stat: <Stat to={1} />, title: "Nơi xem tất cả", sub: "Số liệu mọi tài khoản ở một chỗ" },
          { stat: <Stat text="Của bạn" />, title: "Dữ liệu riêng tư", sub: "Nằm trên máy chủ do bạn sở hữu" },
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

/* --------------------------------------------------------------- đội AI làm gì */

export function Team() {
  const skills = [
    { icon: MegaphoneIcon, title: "Chạy quảng cáo", body: "Tạo, bật, tắt quảng cáo theo quyền bạn cấp", tags: ["Facebook", "TikTok", "Google"] },
    { icon: WalletIcon, title: "Giữ tiền", body: "Mỗi khách tốn bao nhiêu, chỗ nào đang phí", tags: [] },
    { icon: MessageSquareTextIcon, title: "Đọc bình luận", body: "Khách hỏi gì, chê gì dưới bài công khai", tags: ["Fanpage"] },
    { icon: ClapperboardIcon, title: "Góp ý video", body: "Video nào ra khách, quay dọc hay ngang", tags: ["Reels", "Bài viết"] },
    { icon: ScanSearchIcon, title: "Soi đối thủ", body: "Họ quảng cáo gì, bán giá nào", tags: ["Shopee", "TikTok Shop", "Google Maps"] },
    { icon: SendIcon, title: "Báo cáo về điện thoại", body: "Gửi qua Telegram theo yêu cầu hoặc lịch bạn cài", tags: ["Telegram"] },
  ];
  const videos = [
    { name: "Chủ shop tự tư vấn", n: 42, top: true },
    { name: "Vlog hậu trường", n: 27 },
    { name: "Bài tin tức đối tác", n: 15 },
    { name: "Giới thiệu cửa hàng", n: 3, stop: true },
  ];
  return (
    <section id="doi-ai" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Đội AI làm gì cho bạn"
          title="Có MCP là có một đội chạy quảng cáo" accent="làm việc cho bạn"
          description="Bạn chỉ việc hỏi và quyết. Đội AI xem số liệu, theo dõi từng đồng, rồi quay lại góp ý cho bạn — như một phòng marketing thu nhỏ."
        />

        <Reveal>
          <div className="rounded-3xl border bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 font-semibold text-navy">
                <UserRoundIcon className="size-4 text-iris" /> Bạn — chủ shop, spa, nhà hàng
              </span>
              <span className="text-xs text-muted-foreground">hỏi, giao việc ⇄ báo cáo, góp ý lại</span>
              <span className="bg-brand-button inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white">
                <BotIcon className="size-4" /> Đội quảng cáo AI của bạn
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skills.map((s) => (
                <li key={s.title} className="rounded-2xl border bg-card p-4">
                  <span className="mb-3 grid size-10 place-items-center rounded-xl bg-secondary text-iris"><s.icon className="size-5" /></span>
                  <h3 className="font-semibold text-navy">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  {s.tags.length > 0 && (
                    <p className="mt-2.5 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-iris">{t}</span>)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-16 mb-8 text-center">
          <Reveal>
            <h3 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">Mỗi tuần, bạn nhìn thấy những điều này</h3>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Không cần biết thuật ngữ quảng cáo. Đội AI nói bằng ngôn ngữ của người bán hàng: khách, tiền, video.</p>
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Reveal className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">Video nào mang khách về</CardTitle></CardHeader>
              <CardContent className="grid gap-3 p-4 pt-2">
                {videos.map((v) => (
                  <div key={v.name} className="grid gap-1">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex flex-wrap items-center gap-2 font-medium text-navy">
                        {v.name}
                        {v.top && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Hiệu quả nhất</span>}
                        {v.stop && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Nên dừng</span>}
                      </span>
                      <b className="shrink-0 text-navy">{v.n} khách</b>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className={cn("h-full rounded-full", v.stop ? "bg-amber-300" : "bg-brand-button")} style={{ width: `${Math.round((v.n / 42) * 100)}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-xs leading-relaxed text-muted-foreground">Số khách nhắn tin từ mỗi video. Đội gợi ý dừng video cuối, làm thêm video giống video đầu.</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={90} className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">Tiền quảng cáo đi đâu</CardTitle></CardHeader>
              <CardContent className="grid gap-3 p-4 pt-2">
                <p className="text-sm text-muted-foreground">Tuần này bỏ ra</p>
                <p className="text-brand-gradient-dark -mt-2 text-4xl font-black tracking-tight">4,8 triệu</p>
                <div>
                  <div className="flex h-3.5 overflow-hidden rounded-full bg-secondary">
                    <div className="bg-brand-button" style={{ width: "81%" }} />
                    <div className="flex-1 bg-amber-300" />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span><b className="text-navy">3,9 tr</b> <span className="text-muted-foreground">mang về 156 khách</span></span>
                    <span><b className="text-navy">0,9 tr</b> <span className="text-muted-foreground">chưa ra khách</span></span>
                  </div>
                </div>
                <p className="rounded-xl bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">Đội gợi ý: tắt 2 quảng cáo chưa ra khách, dồn tiền sang video đang thắng.</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={180} className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">Báo cáo ngay trên điện thoại</CardTitle></CardHeader>
              <CardContent className="grid gap-3 p-4 pt-2">
                <p className="text-sm text-muted-foreground">Qua Telegram, đọc trong một phút trước giờ mở cửa.</p>
                <div className="grid gap-2 rounded-2xl bg-navy p-3 text-sm text-white">
                  <p className="text-[11px] text-white/50">Đội quảng cáo AI · 7:30</p>
                  <p className="rounded-xl rounded-tl-sm bg-white/10 px-3 py-2">Hôm qua: <b>18 khách</b> nhắn tin</p>
                  <p className="rounded-xl rounded-tl-sm bg-white/10 px-3 py-2">Video “Chủ shop tự tư vấn” vẫn số 1</p>
                  <p className="rounded-xl rounded-tl-sm bg-iris/80 px-3 py-2"><b>Gợi ý hôm nay:</b> quay thêm 1 video trước – sau</p>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">Báo cáo gửi theo yêu cầu hoặc theo lịch bạn cài.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Hình và số liệu minh họa.</p>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- đối tượng */

export function Personas() {
  const items = [
    { icon: UserRoundIcon, title: "Bạn tự chạy", body: "Có người chỉ cho bạn bài nào ra khách, bài nào nên tắt. Không cần học công cụ quảng cáo của Facebook hay TikTok." },
    { icon: UsersRoundIcon, title: "Bạn có nhân viên chạy", body: "Nhân viên làm nhanh hơn. Bạn tự xem số mà không phải đợi ai báo, và biết ai đã bật, tắt cái gì." },
    { icon: HandshakeIcon, title: "Bạn thuê agency", body: "Tự kiểm tra agency có làm hiệu quả không. Có số thật trong tay khi bàn chuyện tiền hay đổi đối tác." },
  ];
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow="Dành cho ai" title="Dù bạn đang chạy" accent="quảng cáo kiểu nào" />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90} className="h-full">
              <div className="h-full rounded-2xl border bg-card p-6">
                <span className="bg-brand-button mb-4 grid size-12 place-items-center rounded-xl text-white shadow-md shadow-iris/30"><it.icon className="size-6" /></span>
                <h3 className="text-lg font-semibold text-navy">{it.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ MCP là gì (30s) */

export function Explainer() {
  const rows = [
    ["Xem báo cáo", "Tự xuất Excel từ Ads Manager rồi dán vào chat", "AI tự lấy số mới nhất, theo đúng câu bạn hỏi"],
    ["Nhiều tài khoản", "Mở từng tab, cộng tay từng con số", "Một câu hỏi, AI đọc hết các tài khoản và Fanpage được cấp"],
    ["Soi đối thủ", "Tự lướt Thư viện quảng cáo, Shopee, đọc từng đánh giá", "AI quét giá, đánh giá, quảng cáo đối thủ và tóm lại điểm khách chưa hài lòng"],
    ["Bật, tắt, chỉnh", "Tự vào Ads Manager bấm", "AI đề xuất và làm theo quyền bạn cấp, bạn chỉ cần xác nhận"],
  ];
  return (
    <section id="mcp-la-gi" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal>
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Hiểu trong 30 giây</p>
          <AnimatedHeading title="MCP là gì?" accent="Hiểu trong 30 giây." align="left" className="lg:text-4xl" />
          <p className="mt-5 text-base leading-relaxed text-navy/90 sm:text-lg">
            Không có MCP, AI chỉ biết những gì bạn dán vào khung chat. Có MCP, AI được cấp quyền đọc và thao tác trên <b>đúng những tài khoản bạn cho phép</b> — như giao chìa khóa một căn phòng, không phải cả căn nhà.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            MCP (Model Context Protocol) là chuẩn kết nối mở mà Claude, ChatGPT, Gemini đều hỗ trợ. {SITE.productName} là một kết nối như thế, làm riêng cho quảng cáo và nghiên cứu thị trường.
          </p>

          <div className="mt-6 grid gap-3 text-sm">
            <p className="rounded-xl border bg-white p-3.5"><b className="text-navy">AI bạn đang dùng:</b> <span className="text-muted-foreground">Claude, ChatGPT, Gemini, Claude Code, Gemini CLI</span></p>
            <p className="rounded-xl border border-iris/30 bg-secondary/70 p-3.5"><b className="text-navy">Một kết nối duy nhất:</b> <span className="text-muted-foreground">chạy trên máy chủ của bạn, mật khẩu kết nối được mã hóa, phân quyền từng người</span></p>
            <p className="rounded-xl border bg-white p-3.5"><b className="text-navy">Quảng cáo:</b> <span className="text-muted-foreground">Facebook, TikTok, Google, OpenAI Ads</span><br /><b className="text-navy">Thị trường:</b> <span className="text-muted-foreground">Shopee, TikTok Shop, Lazada, Thư viện quảng cáo Facebook, Google Maps, YouTube</span><br /><b className="text-navy">Thông báo:</b> <span className="text-muted-foreground">Telegram</span></p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại.</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="grid grid-cols-[0.8fr_1fr_1.2fr] bg-navy text-xs font-semibold text-white sm:text-sm">
              <span className="p-3 sm:p-4" />
              <span className="p-3 text-white/70 sm:p-4">AI thông thường</span>
              <span className="bg-brand-button p-3 sm:p-4">AI có {SITE.productName}</span>
            </div>
            {rows.map(([k, a, b]) => (
              <div key={k} className="grid grid-cols-[0.8fr_1fr_1.2fr] border-t text-[13px] leading-relaxed sm:text-sm">
                <span className="p-3 font-semibold text-navy sm:p-4">{k}</span>
                <span className="p-3 text-muted-foreground sm:p-4">{a}</span>
                <span className="bg-secondary/50 p-3 text-navy/90 sm:p-4">{b}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- dùng thế nào */

export function UseCases() {
  const items = [
    { icon: StoreIcon, who: "Chủ spa", q: "Bài nào tuần này ra khách đặt lịch nhiều nhất? Bài nào nên tắt?", a: "AI xếp hạng bài theo chi phí mỗi tin nhắn, chỉ ra bài đang đốt tiền và lý do." },
    { icon: UtensilsIcon, who: "Chủ nhà hàng", q: "Mấy quán lẩu quanh quận 3 đang chạy quảng cáo gì, khách chê gì?", a: "AI quét Thư viện quảng cáo Facebook và Google Maps, tóm tắt ưu đãi của đối thủ và đánh giá xấu để bạn làm khác." },
    { icon: ShoppingBagIcon, who: "Shop bán hàng online", q: "Đánh giá 1 sao của áo polo cùng giá trên Shopee nói gì?", a: "AI đọc hàng trăm đánh giá, gom thành nỗi đau của khách và gợi ý góc nội dung mới." },
    { icon: UsersRoundIcon, who: "Agency, đội marketing", q: "Tài khoản khách nào có chi phí hiển thị tăng bất thường từ đầu tuần?", a: "AI kiểm tra nhiều tài khoản cùng lúc. Nhân viên được giao việc mà không cần cầm mật khẩu gốc." },
  ];
  return (
    <section id="cach-dung" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Cách dùng"
          title="Dùng thế nào?" accent="Hỏi như hỏi nhân viên."
          description="Không cần biết code, không cần nhớ lệnh. Đây là những câu hỏi mẫu bạn có thể hỏi mỗi ngày."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.who} delay={(i % 2) * 90} className="h-full">
              <div className="h-full rounded-2xl border bg-card p-5 sm:p-6">
                <p className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-iris">
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary"><it.icon className="size-[18px]" /></span>
                  {it.who}
                </p>
                <blockquote className="rounded-xl border-l-4 border-iris bg-secondary/60 p-3.5 text-[15px] leading-relaxed font-medium text-navy">“{it.q}”</blockquote>
                <p className="mt-3 flex gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                  <BotIcon className="mt-0.5 size-5 shrink-0 text-violet" /> {it.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- features */

export function Features() {
  const items = [
    { icon: LayersIcon, title: "Xem hết quảng cáo ở một chỗ", body: "Facebook, TikTok, Google, OpenAI Ads và dữ liệu thị trường trong cùng một kết nối. Nhiều tài khoản quảng cáo, nhiều Fanpage — hỏi và thao tác bằng tiếng Việt." },
    { icon: BarChart3Icon, title: "Chuyên gia phân tích Facebook Ads kiểu Việt Nam", body: "Skill độc quyền giúp tìm nguyên nhân chi phí tăng và đề xuất tăng ngân sách, dừng hay thử cái mới — làm cho shop chốt đơn qua inbox, Zalo, điện thoại." },
    { icon: BellRingIcon, title: "Báo cáo về điện thoại", body: "Nhận tin qua Telegram khi quảng cáo có thay đổi, và báo cáo do AI gửi theo yêu cầu hoặc theo lịch bạn cài." },
    { icon: HeadsetIcon, title: "Cài đặt có người làm cùng", body: "Có sẵn script cài nhanh và video hướng dẫn (mở sau khi kích hoạt). Đội Nextgency hỗ trợ bạn từng bước nên không cần biết kỹ thuật." },
    { icon: KeyRoundIcon, title: "Giao việc mà không lộ mật khẩu", body: "Phân quyền Admin và Nhân viên, xác thực 2 lớp, mật khẩu kết nối (token) được mã hóa AES-256-GCM và ghi nhật ký từng lệnh AI đã chạy." },
    { icon: SlidersHorizontalIcon, title: "Rào chắn bảo vệ ngân sách", body: "Bật xác nhận 2 bước, trần ngân sách, giá thầu và giới hạn thao tác trong chế độ Tùy chỉnh nâng cao. Chế độ Cơ bản không áp dụng các mức trần này." },
  ];
  return (
    <section id="tinh-nang" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Trong Ads MCP Simple có gì"
          title="Mọi thứ để AI giúp bạn" accent="chạy quảng cáo gọn hơn"
          description="AI chỉ làm việc trong phạm vi tài khoản và quyền bạn cho phép. Bạn luôn nắm quyền quyết định."
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

/* ------------------------------------------------------- nghiên cứu thị trường */

export function Apify() {
  const sources = [
    { v: "shop", label: "Shopee · TikTok Shop · Lazada", body: "Tìm sản phẩm, so sánh giá, đọc đánh giá để biết khách đang thiếu gì, chưa hài lòng chỗ nào và nên viết nội dung theo góc nào." },
    { v: "tiktok", label: "TikTok", body: "Tìm video theo từ khóa, hashtag hoặc kênh; đọc bình luận; tham khảo quảng cáo nổi bật từ TikTok Creative Center." },
    { v: "fb", label: "Facebook", body: "Xem bài viết, thông tin Trang và bình luận công khai; xem đối thủ đang chạy quảng cáo gì trong Thư viện quảng cáo Facebook." },
    { v: "ig", label: "Instagram · YouTube", body: "Tìm hiểu tài khoản, kênh và nội dung công khai của đối thủ theo các tác vụ được hỗ trợ." },
    { v: "google", label: "Google & website", body: "Xem kết quả tìm kiếm Google, địa điểm và đánh giá trên Google Maps, quảng cáo trong Google Ads Transparency Center và nội dung website." },
  ];
  const extras = [
    { icon: ShieldCheckIcon, title: "Dùng chung cho cả đội", body: "Công ty có thể dùng chung một kho tài khoản Apify cùng tài khoản cá nhân của chủ MCP. Hệ thống ưu tiên tài khoản còn nhiều credit và tự chuyển sang tài khoản khác khi hết credit hoặc gặp lỗi lúc bắt đầu chạy." },
    { icon: LockKeyholeIcon, title: "Không lo tốn tiền ngoài ý muốn", body: "Mỗi lần nghiên cứu có trần chi phí (mặc định 1 USD/lần, áp dụng cả chế độ Cơ bản); chế độ Tùy chỉnh nâng cao còn có trần theo ngày (mặc định 10 USD/ngày, 0 là không giới hạn). Mật khẩu kết nối được mã hóa AES-256-GCM, AI không nhìn thấy." },
    { icon: RocketIcon, title: "Giao việc theo lịch", body: "Dùng Skill riêng để dặn AI tiêu chí chọn sản phẩm, cách phân tích đối thủ, mẫu báo cáo. Khi ứng dụng AI hoặc công cụ tự động hóa của bạn hỗ trợ chạy theo lịch, có thể giao nghiên cứu hằng tuần và nhận báo cáo qua Telegram." },
  ];
  return (
    <section id="apify" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container>
        <SectionHead
          dark
          eyebrow="Nghiên cứu thị trường"
          title="Biết khách nghĩ gì, đối thủ đang làm gì" accent="ngay trong cuộc trò chuyện"
          description="Số liệu quảng cáo cho bạn biết mình đang chạy thế nào. Thông tin từ bên ngoài cho bạn biết khách quan tâm gì, đối thủ truyền thông ra sao và sản phẩm nào đáng làm — nhờ dịch vụ thu thập dữ liệu Apify được tích hợp sẵn."
        />

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Reveal>
            <Tabs defaultValue="shop" className="gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:p-6">
              <p className="text-sm font-semibold text-white">AI có thể xem giúp bạn ở đâu?</p>
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
              <p className="text-sm font-semibold text-white">Số liệu của bạn + thông tin thị trường trong cùng một câu hỏi</p>
              <p className="mt-2 text-sm text-white/65">Không cần tách riêng việc phân tích quảng cáo và nghiên cứu thị trường. Chỉ cần giao việc:</p>
              <blockquote className="mt-4 rounded-xl border-l-4 border-violet bg-white/5 p-4 text-[15px] leading-relaxed text-white/90 italic">
                “Phân tích chi phí mỗi khách của các chiến dịch Facebook tuần qua, xem đối thủ đang chạy thông điệp gì và đọc đánh giá sản phẩm cùng phân khúc. Đề xuất 3 hướng quảng cáo mới, giải thích căn cứ cho từng hướng. Chưa thay đổi quảng cáo.”
              </blockquote>
              <p className="mt-4 text-sm text-white/65">
                Bạn cũng có thể dùng riêng phần <b className="text-white">nghiên cứu thị trường</b>, chưa cần kết nối tài khoản quảng cáo (từ bản 1.1.1).
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
    "Kiểm tra số liệu chuyển đổi có đáng tin không trước khi kết luận.",
    "Tìm đúng nguyên nhân gốc: do chiến dịch, nhóm quảng cáo hay mẫu quảng cáo.",
    "Giải thích vì sao Facebook dồn tiền vào chỗ trông “đắt” nhưng vẫn đáng (Breakdown Effect, chi phí biên).",
    "Đề xuất tăng ngân sách, dừng hay thử cái mới — kèm cách kiểm chứng.",
  ];
  return (
    <section id="skill" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Chỉ có khi mua Ads MCP Simple</p>
          <AnimatedHeading title="Chuyên gia phân tích quảng cáo Facebook" accent="cho bán hàng kiểu Việt Nam" align="left" className="lg:text-4xl" />
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Skill do noti.vn phát triển, chỉ người kích hoạt Ads MCP Simple mới được dùng. Làm cho tài khoản chốt đơn qua inbox, Zalo, điện thoại, sàn TMĐT — kiểu bán hàng mà công cụ nước ngoài hay đọc sai vì ROAS trên tài khoản thường không đáng tin.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Chạy với dữ liệu từ Ads MCP Simple hoặc file Excel/CSV xuất từ Ads Manager. Có thể kết hợp với Skill riêng của doanh nghiệp để đưa tiêu chí sản phẩm, biên lợi nhuận và cách đọc dữ liệu thị trường vào quy trình phân tích.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Card className="p-2 ring-iris/20">
            <CardHeader className="p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-lg font-semibold text-navy">Skill giúp AI làm gì?</CardTitle>
              <CardDescription>Chẩn đoán kỹ trước khi đề xuất hành động</CardDescription>
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
    { icon: ServerIcon, title: "Chuẩn bị", body: "Một máy chủ (VPS) Ubuntu 24.04 hoặc Debian 12, một tên miền con và tài khoản GitHub. Chưa có thì Nextgency hướng dẫn." },
    { icon: TerminalIcon, title: "Chạy script cài nhanh", body: "Làm theo video: dán lệnh, điền thông tin. Nextgency làm cùng bạn." },
    { icon: BotIcon, title: "Kết nối", body: "Kết nối tài khoản quảng cáo, ứng dụng AI bạn dùng và Telegram; thêm token Apify nếu cần nghiên cứu thị trường." },
    { icon: MessageCircleQuestionIcon, title: "Bắt đầu hỏi", body: "Nextgency hướng dẫn cách hỏi và giao việc cho AI hiệu quả." },
  ];
  return (
    <section id="cai-dat" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Cài đặt & hỗ trợ"
          title="Cài xong trong một buổi," accent="có Nextgency đồng hành"
          description={`Có script cài nhanh và video hướng dẫn (mở sau khi kích hoạt). Nextgency hỗ trợ trong giờ làm việc: ${LEGAL.workHours}.`}
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
                <h3 className="text-balance text-2xl font-bold sm:text-3xl">Không rành kỹ thuật? Nextgency làm phần kỹ thuật cùng bạn</h3>
                <p className="mt-3 text-white/70">
                  Bạn không phải tự mày mò từng bước. Đội ngũ Nextgency đồng hành để đội quảng cáo AI chạy được trên hạ tầng của chính bạn.
                </p>
              </div>
              <ul className="grid gap-3 text-sm text-white/90 sm:text-base">
                <Tick dark>Hỗ trợ cài đặt lên máy chủ (VPS) và cấu hình tên miền</Tick>
                <Tick dark>Hỗ trợ kết nối tài khoản Facebook, TikTok, Google, OpenAI Ads</Tick>
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

/* ----------------------------------------------------------------- audience */

export function Audience() {
  const fit = [
    "Bạn chạy quảng cáo trên nhiều tài khoản, nhiều nền tảng",
    "Bạn chốt đơn qua inbox, Zalo, điện thoại và muốn AI đọc đúng hiệu quả",
    "Đội marketing 2–20 người cần phân quyền, trần ngân sách và nhật ký minh bạch",
    "Bạn cần nghiên cứu sản phẩm, đối thủ, giá trước khi ra nội dung",
    "Bạn muốn nhận báo cáo quảng cáo định kỳ qua Telegram",
  ];
  const notFit = [
    "Bạn muốn AI tự chạy theo lịch mà không cấu hình ứng dụng AI hoặc công cụ tự động hóa",
    "Bạn cần đăng hoặc sửa bài Fanpage: phần Fanpage chỉ đọc",
    "Bạn chưa đủ khả năng đọc hiểu tài liệu để biết sản phẩm có phù hợp với mình hay không",
  ];
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow="Dành cho ai" title="Sản phẩm này hợp với bạn nếu…" />
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
                <h3 className="mb-4 text-lg font-semibold">Chưa hợp nếu</h3>
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

/* ------------------------------------------------------------------ includes */

export function Includes() {
  const get = [
    "Phần mềm Ads MCP Simple dùng trọn đời, cập nhật miễn phí ngay trong web.",
    "Nextgency hỗ trợ cài đặt và kết nối cho bạn (xem gói hỗ trợ ở trên).",
    "Skill độc quyền phân tích quảng cáo Facebook cho thị trường Việt Nam.",
    "Video hướng dẫn cài đặt, được xem sau khi kích hoạt sản phẩm.",
    "Bộ cài sẵn trong repo GitHub riêng của Noti (Docker Compose, script cài nhanh, hướng dẫn tiếng Việt); tự sao lưu hằng ngày, tự quay về bản cũ nếu lỗi.",
  ];
  const supported = [
    "Hỏi số liệu và thao tác quảng cáo Facebook, TikTok, Google Ads, OpenAI Ads qua AI theo quyền đã cấp và khả năng API của từng loại chiến dịch.",
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
    "Ads MCP Simple — dùng trọn đời, cập nhật miễn phí",
    "Nextgency hỗ trợ cài đặt và kết nối cho bạn",
    "Skill phân tích quảng cáo Facebook cho bán hàng kiểu Việt Nam",
    "Video hướng dẫn cài đặt + bộ cài sẵn tiếng Việt (repo GitHub riêng)",
    "Kích hoạt sau khi thanh toán, xác nhận tự động",
  ];
  return (
    <section id="mua" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container>
        <SectionHead dark eyebrow="Bắt đầu ngay" title={`Sở hữu ${SITE.productName}`} accent="kèm hỗ trợ cài đặt" description="Một lần thanh toán. Không phí hằng tháng cho phần mềm." />
        <Reveal>
          <div className="mx-auto max-w-[960px] overflow-hidden rounded-3xl border border-white/20 bg-white text-navy shadow-2xl shadow-black/30">
            <div className="grid sm:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center gap-2 bg-secondary p-8 text-center sm:p-10">
                <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">Trọn bộ</p>
                {SITE.compareAtPrice && <p className="text-lg text-muted-foreground line-through"><Vnd amount={SITE.compareAtPrice} /></p>}
                <p className="text-brand-gradient-dark text-5xl font-black tracking-tight sm:text-6xl"><Vnd amount={SITE.price} /></p>
                <p className="text-sm text-muted-foreground">Đã gồm hỗ trợ cài đặt</p>
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
              <p><b className="text-navy">Lưu ý khi mua dự án GitHub.</b> Dự án GitHub không hoàn tiền vì sau khi được thêm vào repo, người mua đã xem và tải được toàn bộ mã nguồn. Tài khoản GitHub không bắt buộc khi đặt mua — nếu bạn chưa có, Nextgency sẽ hướng dẫn tạo và cấp quyền. Xem <Link href="/policies/chinh-sach-thanh-toan" className="font-semibold text-iris underline underline-offset-4">Chính sách thanh toán &amp; hoàn tiền</Link> và <Link href="/terms" className="font-semibold text-iris underline underline-offset-4">Điều khoản sử dụng</Link>.</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- faq */

const FAQ = [
  { q: "Tôi không rành công nghệ, có dùng được không?", a: "Có. Dùng hằng ngày bạn chỉ cần gõ câu hỏi bằng tiếng Việt trong Claude, ChatGPT hoặc Gemini. Phần cài đặt cần một máy chủ (VPS) và vài bước kỹ thuật — Nextgency hỗ trợ làm cùng bạn nên bạn không phải tự mày mò." },
  { q: "MCP là gì? Ads MCP Simple dùng để làm gì?", a: "MCP là chuẩn kết nối giúp AI (Claude, ChatGPT, Gemini…) đọc và thao tác trên đúng những tài khoản bạn cho phép. Ads MCP Simple là phần mềm MCP quản lý quảng cáo tự host do Noti (noti.vn) phát triển: bạn hỏi số liệu và thao tác Facebook (Meta) Ads, TikTok Ads, Google Ads, OpenAI Ads bằng tiếng Việt. Từ bản 1.1.x, sản phẩm tích hợp Apify để kết hợp số liệu quảng cáo với nghiên cứu sản phẩm, đối thủ và thị trường." },
  { q: "AI có tự ý tiêu tiền quảng cáo của tôi không?", a: "Bạn quyết định AI được làm gì. Ở chế độ Tùy chỉnh nâng cao, bạn đặt xác nhận 2 bước, trần ngân sách, trần giá thầu và giới hạn thao tác. Mọi lệnh AI chạy đều được ghi vào nhật ký. Chế độ Cơ bản không áp dụng các mức trần này; bạn cũng có thể dặn AI chỉ phân tích và chưa thay đổi gì trên tài khoản." },
  { q: "Apify dùng để làm gì? Có thể dùng riêng để nghiên cứu không?", a: "Apify giúp AI thu thập dữ liệu công khai để nghiên cứu sản phẩm, giá, đánh giá, quảng cáo và nội dung đối thủ — nguồn gồm Shopee, TikTok Shop, Lazada, TikTok, Facebook, Instagram, YouTube, Google và website theo danh mục tác vụ được hỗ trợ. Từ bản 1.1.1, bạn có thể tạo MCP chỉ dùng Apify khi kho có token sử dụng được, chưa cần kết nối tài khoản quảng cáo. Chi phí chạy tính trên tài khoản Apify của bạn." },
  { q: "Hỗ trợ những nền tảng quảng cáo và AI nào?", a: "Nền tảng quảng cáo: Meta Ads (Facebook, Instagram), TikTok Ads (gồm GMV Max theo quyền riêng), Google Ads (gồm báo cáo YouTube) và OpenAI Ads. Apify cung cấp dữ liệu thị trường công khai, Telegram nhận thông báo. Phía AI hỗ trợ Claude, ChatGPT, Claude Code, Gemini CLI và Gemini Enterprise; Gemini web cá nhân chưa được hỗ trợ trong hướng dẫn hiện tại." },
  { q: "Tôi cần chuẩn bị gì trước khi mua?", a: "Khi mua, bạn chỉ cần điền họ tên, số điện thoại/Zalo và email. Để chạy được, về sau bạn cần một VPS Ubuntu 24.04 hoặc Debian 12 cùng tên miền con, tài khoản của ứng dụng AI bạn muốn dùng, tài khoản GitHub (chưa có thì Nextgency hướng dẫn tạo khi hỗ trợ) và tài khoản Apify nếu cần nghiên cứu thị trường. Chi phí VPS, tên miền, AI và Apify phát sinh riêng, không nằm trong giá mua." },
  { q: "Gói hỗ trợ cài đặt của Nextgency gồm những gì?", a: "Nextgency đồng hành cùng bạn trong quá trình đưa Ads MCP Simple vào hoạt động: cài lên VPS, kết nối tài khoản quảng cáo, kết nối ứng dụng AI và Telegram, hướng dẫn cách giao việc cho AI. Sau khi thanh toán, đội ngũ sẽ liên hệ qua Zalo (số bạn đã đăng ký) để thống nhất lịch làm việc; cần hỗ trợ thêm bạn có thể nhắn tin fanpage Nextgency." },
  { q: "Thanh toán như thế nào và bao lâu thì được xác nhận?", a: "Bạn điền thông tin, hệ thống tạo mã QR chuyển khoản với số tiền và nội dung điền sẵn. Chỉ cần quét bằng app ngân hàng; giao dịch được ghi nhận tự động qua SePay và trang sẽ báo thành công ngay khi nhận được tiền. Vui lòng không sửa nội dung chuyển khoản." },
  { q: "Tôi có được hoàn tiền không?", a: "Dự án GitHub không hoàn tiền vì sau khi được thêm vào repo, người mua đã xem và tải được toàn bộ mã nguồn. Vì vậy hãy đọc kỹ phần “Sản phẩm này hợp với bạn nếu…” và “Phạm vi và giới hạn” trước khi mua, hoặc liên hệ Nextgency nếu còn băn khoăn." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container className="max-w-[960px]">
        <SectionHead eyebrow="Hỏi đáp" title="Câu hỏi thường gặp" />
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
  const zalo = zaloHref();
  return (
    <section className="bg-brand-soft py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[960px] text-center">
          <AnimatedHeading title="Đối thủ của bạn sẽ hỏi AI" accent="trước khi chi tiền quảng cáo. Bạn thì sao?" />
          <p className="mt-4 text-muted-foreground">Một lần thanh toán <Vnd amount={SITE.price} /> — có Nextgency đồng hành cài đặt.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BuyStarButton className="text-base font-semibold">
              Mua ngay <ArrowRightIcon className="size-4" />
            </BuyStarButton>
            <a
              href={zalo || SITE.contact.fanpage}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-iris/30 bg-white px-6 text-base text-navy hover:bg-secondary")}
            >
              {zalo ? "Hỏi qua Zalo" : "Nhắn tin fanpage"}
            </a>
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
