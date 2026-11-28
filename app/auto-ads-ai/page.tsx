import type { Metadata } from "next";
import Image from "next/image";
import {
  BarChart3Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckBigIcon,
  ClipboardCheckIcon,
  HistoryIcon,
  LockKeyholeIcon,
  MessageCircleIcon,
  MousePointerClickIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrendingUpIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import { Reveal } from "@/components/landing/reveal";
import { AdsHeroAurora, AdsHeroTitle, AdsSectionTitle, AdsShinyBadge } from "@/components/ads-mcp/effects";
import { ChatGptMark, ClaudeMark, FacebookMark, GoogleDriveMark, InstagramMark, MessengerMark, TelegramMark } from "@/components/ads-mcp/brand-icons";
import { RegisterButton as ContactButton, RegistrationCard } from "@/components/ads-mcp/consult-form";
import { WorkflowDemo } from "@/components/ads-mcp/workflow-demo";
import { FeatureCards } from "@/components/ads-mcp/feature-cards";
import { FunnelChart } from "@/components/ads-mcp/funnel-chart";
import { VideoBoard } from "@/components/ads-mcp/video-board";
import { IndustryTabsDemo } from "@/components/ads-mcp/industry-tabs";
import { ADS_MCP, POLICIES, SITE, formatVnd } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chạy quảng cáo Facebook bằng AI | Nextgency",
  description: `Nhắn một câu, AI lên quảng cáo Facebook, tối ưu mỗi ngày và báo cáo mỗi sáng. Như có một team marketing giỏi bên cạnh. Chỉ ${formatVnd(ADS_MCP.price)}/tháng.`,
  alternates: { canonical: "/auto-ads-ai" },
};

const eraRows = [
  { year: "Trước", icon: HistoryIcon, text: "Thuê người chạy, cuối tuần mới biết số" },
  { year: "Hôm nay", icon: MousePointerClickIcon, text: "Tự mày mò trình quản lý quảng cáo" },
  { year: "2027", icon: SparklesIcon, text: "Ra lệnh cho AI. AI làm, tự kiểm tra, báo lại", active: true },
];

const reportItems = [
  { icon: BarChart3Icon, color: "bg-[#d68c1e]", title: "Chi bao nhiêu, ra bao nhiêu khách, bao nhiêu lịch hẹn" },
  { icon: TrendingUpIcon, color: "bg-[#22a06b]", title: "Mỗi lịch hẹn tốn bao nhiêu, có lời không" },
  { icon: ClipboardCheckIcon, color: "bg-[#7b5cc4]", title: "Đề xuất sẵn, bấm duyệt là AI làm" },
];

const controlItems = [
  { icon: LockKeyholeIcon, title: "Tài khoản đứng tên bạn", description: "Quảng cáo chạy trên chính tài khoản quảng cáo của bạn." },
  { icon: ShieldCheckIcon, title: "Quảng cáo mới luôn chờ duyệt", description: "Mọi quảng cáo AI tạo đều ở trạng thái tạm dừng cho đến khi bạn đồng ý." },
  { icon: MessageCircleIcon, title: "Mọi khoản chi đều hỏi trước", description: "Tăng ngân sách, bật, tắt quảng cáo: AI xem trước cho bạn rồi mới làm." },
];

const faqs = [
  ["Tôi không rành công nghệ, có dùng được không?", "Được. Bạn chỉ cần nhắn việc bằng tiếng Việt và bấm duyệt. Phần kết nối, cài đặt Nextgency làm cùng bạn."],
  [`${formatVnd(ADS_MCP.price)}/tháng đã gồm tiền chạy quảng cáo chưa?`, "Chưa. Tiền chạy quảng cáo bạn tự nạp vào tài khoản quảng cáo của mình và tự quyết mức chi."],
  ["AI có tự tiêu tiền của tôi không?", "Không. Quảng cáo mới AI tạo luôn ở trạng thái tạm dừng. Bật quảng cáo, tăng ngân sách đều chờ bạn đồng ý."],
  ["Đang có nhân viên chạy quảng cáo thì sao?", "Vẫn dùng được. Nhân viên làm nhanh hơn nhờ AI, còn bạn có báo cáo mỗi sáng để tự kiểm tra số thật."],
  ["Có chạy được quảng cáo cho livestream không?", "Được. AI lên quảng cáo cho bài live đang phát trên Trang của bạn để kéo thêm người vào xem, nhắn tin."],
  ["AI có tự đăng bài lên Fanpage không?", "Không. AI giúp viết bài, kịch bản để bạn đăng. Quảng cáo thì AI lên từ bài có sẵn trên Trang hoặc ảnh, video bạn đưa."],
  ["Làm sao biết ra bao nhiêu lịch hẹn, có lời không?", "Tin nhắn, chi phí lấy trực tiếp từ Facebook. Lịch hẹn và doanh thu lấy từ sổ hẹn hoặc phần mềm bán hàng của bạn, Nextgency kết nối giúp để báo cáo tính ra mỗi lịch hẹn tốn bao nhiêu và có lời không."],
  ["Tài khoản quảng cáo đứng tên ai?", "Tài khoản vẫn là của bạn. Bạn giữ toàn quyền và có thể ngừng kết nối bất cứ lúc nào."],
];

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}

function SectionHeading({ tag, title, accent, lead, note }: { tag: string; title: string; accent?: string; lead?: string; note?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <p className="mb-3 inline-block rounded-full bg-[#2ee6c9]/8 px-3 py-1.5 font-archivo text-xs font-bold tracking-[0.18em] text-[#16c4ac] uppercase">{tag}</p>
      <AdsSectionTitle title={title} accent={accent} />
      {lead && <p className="mt-4 text-base leading-relaxed text-[#96b8b1] sm:text-lg">{lead}</p>}
      {note && <p className="mt-2 text-xs text-[#6e918a]">{note}</p>}
    </div>
  );
}

export default function AdsMcpPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#06110f] pb-20 text-[#e8f4f1] lg:pb-0">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-36 -right-24 size-72 rounded-full bg-[#0e6b60]/20 blur-[80px] sm:-top-72 sm:-right-56 sm:size-[44rem] sm:bg-[#0e6b60]/40 sm:blur-[120px]" />
        <div className="absolute -bottom-36 -left-24 size-64 rounded-full bg-[#0a3f48]/20 blur-[80px] sm:-bottom-72 sm:-left-56 sm:size-[38rem] sm:bg-[#0a3f48]/50 sm:blur-[120px]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(46,230,201,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(46,230,201,.055)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_50%_12%,black,transparent_68%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#2ee6c9]/10 bg-[#06110f]/82 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-3">
          <a href="#top" aria-label="Nextgency" className="shrink-0"><Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto" /></a>
          <nav aria-label="Điều hướng" className="hidden items-center gap-1 lg:flex">
            {[['#ket-qua', 'Kết quả'], ['#video', 'Video hiệu quả'], ['#nganh', 'Ngành phù hợp'], ['#bang-gia', 'Chi phí'], ['#faq', 'Câu hỏi']].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-3 py-2 text-sm font-medium text-[#96b8b1] transition-colors hover:bg-white/5 hover:text-[#2ee6c9]">{label}</a>
            ))}
          </nav>
          <ContactButton className="h-9 px-4 text-xs">Đăng ký tư vấn</ContactButton>
        </Container>
      </header>

      <main id="top" className="relative z-10">
        <section className="relative isolate overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-28">
          <AdsHeroAurora />
          <Container className="grid items-center gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-10">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2ee6c9]/20 bg-[#2ee6c9]/8 px-3 py-1.5 text-xs font-bold text-[#2ee6c9]"><ZapIcon className="size-3.5" /> <AdsShinyBadge>Năm 2027 · Doanh nghiệp làm việc cùng AI</AdsShinyBadge></span>
                <AdsHeroTitle />
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#96b8b1] sm:text-lg">Như có một team marketing giỏi ngồi cạnh. Bạn chỉ nhìn kết quả: ra bao nhiêu khách, có lời không.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ContactButton glow>Đăng ký tư vấn</ContactButton>
                </div>
                <p className="mt-4 text-sm text-[#6e918a]">Chỉ <b className="font-bold text-[#2ee6c9]">{formatVnd(ADS_MCP.price)}/tháng</b> · chưa gồm tiền chạy quảng cáo</p>
              </Reveal>
            </div>

            <Reveal delay={130}>
              <WorkflowDemo />
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#2ee6c9]/15 bg-[#0e2824]/50 px-5 py-3 sm:justify-start">
                <span className="shrink-0 text-sm font-semibold text-[#96b8b1]">Làm việc ngay trong</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[ClaudeMark, ChatGptMark, FacebookMark, InstagramMark, MessengerMark, TelegramMark, GoogleDriveMark].map((Mark, i) => (
                    <span key={i} className="grid size-9 shrink-0 place-items-center rounded-lg bg-white sm:size-10"><Mark className="size-5 sm:size-6" /></span>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="ket-qua" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
            <Reveal>
              <p className="inline-block rounded-full bg-[#2ee6c9]/8 px-3 py-1.5 font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Bạn chỉ cần nhìn kết quả</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Chi bao nhiêu, ra bao nhiêu khách, <span className="text-[#2ee6c9]">có lời không</span></h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#96b8b1]">AI lo phần chạy. Mỗi sáng bạn nhận đúng những con số này.</p>
              <p className="mt-2 text-xs text-[#6e918a]">Lịch hẹn, doanh thu lấy từ sổ hẹn hoặc phần mềm bán hàng của bạn.</p>
            </Reveal>
            <Reveal delay={100}><FunnelChart /></Reveal>
          </Container>
        </section>

        <section id="nam-2027" className="py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
            <Reveal>
              <p className="inline-block rounded-full bg-[#2ee6c9]/8 px-3 py-1.5 font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Năm 2027</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Ai ra lệnh được cho AI, <span className="text-[#2ee6c9]">người đó đi trước</span></h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#96b8b1]">Meta đặt mục tiêu đến cuối 2026: doanh nghiệp chỉ cần đưa sản phẩm và ngân sách, AI làm phần còn lại.</p>
              <p className="mt-2 text-xs text-[#6e918a]">Nguồn: The Wall Street Journal, 6/2025</p>
            </Reveal>
            <Reveal delay={100}>
              <div className="grid gap-3">
                {eraRows.map((row) => (
                  <div key={row.year} className={cn("flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300", row.active ? "border-[#2ee6c9] bg-[#2ee6c9]/10" : "border-white/10 bg-white/5")}>
                    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-black", row.active ? "bg-[#2ee6c9] text-[#06110f]" : "bg-white/10 text-[#96b8b1]")}>{row.year}</span>
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", row.active ? "bg-[#2ee6c9]/20 text-[#2ee6c9]" : "bg-white/5 text-[#6e918a]")}><row.icon className="size-4" /></span>
                    <span className="flex-1 text-sm font-semibold text-[#e8f4f1]">{row.text}</span>
                    {row.active && <span className="shrink-0 rounded-full bg-[#2ee6c9] px-2.5 py-1 text-[11px] font-bold text-[#06110f]">Bạn ở đây</span>}
                  </div>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="tinh-nang" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="AI làm được gì" title="Mỗi việc AI làm," accent="đều để ra thêm khách" />
            <FeatureCards />
            <p className="mt-3 text-center text-xs text-[#6e918a] sm:mt-6">Giao diện và số liệu minh hoạ</p>
          </Container>
        </section>

        <section id="video" className="py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
            <Reveal><VideoBoard /></Reveal>
            <Reveal delay={100}>
              <p className="inline-block rounded-full bg-[#2ee6c9]/8 px-3 py-1.5 font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Không chỉ chạy quảng cáo</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">AI còn chỉ bạn <span className="text-[#2ee6c9]">nên làm video gì</span></h2>
              <p className="mt-5 max-w-md leading-relaxed text-[#96b8b1]">Video nào ra khách, video nào đốt tiền, dòng video nào nên làm thêm.</p>
            </Reveal>
          </Container>
        </section>

        <section id="nganh" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Ngành phù hợp" title="Bạn bán gì," accent="AI chạy theo cách đó" lead="Chọn ngành của bạn để xem." />
            <Reveal><IndustryTabsDemo /></Reveal>
          </Container>
        </section>

        <section className="hidden py-20 sm:block sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <div className="relative mx-auto w-[300px]">
                <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(circle,rgba(46,230,201,.22),transparent_65%)] blur-2xl" aria-hidden />
                <div className="float-slow relative flex aspect-[9/16] flex-col rounded-[2.5rem] bg-[#141a19] p-3 shadow-2xl shadow-black/40 ring-1 ring-white/10">
                  <span className="absolute -right-[3px] top-24 h-10 w-[3px] rounded-l-full bg-[#2a3a37]" aria-hidden />
                  <span className="absolute -left-[3px] top-16 h-6 w-[3px] rounded-r-full bg-[#2a3a37]" aria-hidden />
                  <div className="flex flex-1 flex-col rounded-[2rem] bg-[#f3f8f7] px-5 pb-4 pt-4 text-[#17211f]">
                    <div className="mx-auto h-5 w-28 shrink-0 rounded-full bg-[#141a19]" />
                    <div className="flex flex-1 flex-col items-center justify-center">
                      <p className="text-center text-4xl font-semibold tracking-tight">08:00</p>
                      <p className="text-center text-xs text-[#5c6b68]">Báo cáo sáng</p>
                      <div className="mt-5 w-full rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-md">
                        <div className="flex items-center gap-2 text-sm font-bold"><FacebookMark className="size-4" /> Quảng cáo Facebook · hôm qua</div>
                        <div className="mt-3 divide-y divide-[#f0f3f2]">
                          {[[MessageCircleIcon, "#1877f2", 128, "tin nhắn"], [ClipboardCheckIcon, "#7b5cc4", 31, "lịch hẹn"], [WalletIcon, "#22a06b", 38700, "đ mỗi lịch hẹn"]].map(([Icon, color, value, label], i) => {
                            const StatIcon = Icon as typeof MessageCircleIcon;
                            return (
                              <div key={label as string} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f7f9f8]" style={{ color: color as string }}><StatIcon className="size-5" /></span>
                                <span className="flex items-baseline gap-1.5"><b className="text-lg font-black text-[#0b8f80]"><CountUp to={value as number} separator="." duration={1.6} delay={i * 0.15} /></b><span className="text-xs text-[#5c6b68]">{label as string}</span></span>
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#0b8f80] to-[#16c4ac] py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(11,143,128,.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(11,143,128,.45)]"><CheckIcon className="size-4" /> Duyệt đề xuất hôm nay</button>
                      </div>
                    </div>
                    <div className="mx-auto h-1 w-24 shrink-0 rounded-full bg-[#141a19]/60" aria-hidden />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-[#6e918a]">Số liệu minh hoạ</p>
            </Reveal>
            <div>
              <p className="inline-block rounded-full bg-[#2ee6c9]/8 px-3 py-1.5 font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Có báo cáo mỗi ngày</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Sáng dậy, <span className="text-[#2ee6c9]">đã biết quảng cáo ra sao</span></h2>
              <div className="mt-7 grid gap-3">
                {reportItems.map(({ icon: Icon, color, title }, i) => <Reveal key={title} delay={i * 80}><div className="flex items-center gap-4 rounded-2xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#2ee6c9]/35"><span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-white", color)}><Icon className="size-5" /></span><h4 className="font-bold text-white">{title}</h4></div></Reveal>)}
              </div>
            </div>
          </Container>
        </section>

        <section id="kiem-soat" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Kiểm soát bằng AI" title="Tiền của bạn," accent="bạn quyết" lead="AI làm việc, nhưng mọi quyết định chi tiền đều nằm trong tay bạn." />
            <div className="grid gap-4 sm:grid-cols-3">
              {controlItems.map(({ icon: Icon, title, description }, i) => (
                <Reveal key={title} delay={i * 90}>
                  <article className="h-full rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#2ee6c9]/40 hover:shadow-xl hover:shadow-black/20">
                    <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#2ee6c9]/10 text-[#2ee6c9]"><Icon className="size-6" /></span>
                    <h3 className="mt-4 font-bold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#96b8b1]">{description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="bang-gia" className="py-20 sm:py-28">
          <Container><SectionHeading tag="Chi phí" title="Thuê phòng Marketing Ads AI tối ưu" accent={`chỉ ${formatVnd(ADS_MCP.price)}/tháng`} /><Reveal><article className="mx-auto max-w-xl rounded-[2rem] border-2 border-[#2ee6c9]/45 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,230,201,.22),transparent_52%)] bg-[#0e2824] p-7 text-center shadow-2xl shadow-black/25 transition-transform duration-300 hover:-translate-y-1 sm:p-9"><span className="rounded-full bg-[#2ee6c9] px-3 py-1.5 text-xs font-black tracking-wider text-[#06110f]">QUẢNG CÁO FACEBOOK BẰNG AI</span><p className="mt-5 text-5xl font-black tracking-tight text-[#2ee6c9] sm:text-6xl">{formatVnd(ADS_MCP.price)}</p><p className="mt-1 font-semibold text-[#e8f4f1]">mỗi tháng</p><p className="mt-1 text-sm text-[#96b8b1]">Chưa gồm tiền chạy quảng cáo</p><ul className="my-7 grid gap-3 text-left text-sm text-[#e8f4f1]">{["Lên quảng cáo từ bài, ảnh, video, livestream", "Lời chào tin nhắn soạn sẵn", "AI tự kiểm tra quảng cáo trong ngày, đề xuất tối ưu", "Chỉ ra video nào hiệu quả, nên làm thêm dòng video gì", "Báo cáo 8h sáng: chi phí, khách, lịch hẹn", "Tài khoản đứng tên bạn, bạn duyệt mới chạy"].map(item => <li key={item} className="flex gap-2"><CircleCheckBigIcon className="size-5 shrink-0 text-[#2ee6c9]" />{item}</li>)}</ul><ContactButton glow className="w-full">Đăng ký tư vấn</ContactButton></article></Reveal></Container>
        </section>

        <section id="form" className="py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Đăng ký tư vấn" title="Thuê phòng Marketing" accent="Ads AI tối ưu" lead="Để lại thông tin, Nextgency liên hệ tư vấn cho bạn trong 24 giờ. Chưa cần thanh toán." />
            <Reveal><RegistrationCard /></Reveal>
          </Container>
        </section>

        <section id="faq" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28"><Container><SectionHeading tag="Câu hỏi thường gặp" title="Bạn đang" accent="thắc mắc?" /><div className="mx-auto grid max-w-3xl gap-3">{faqs.map(([q, a]) => <Reveal key={q}><details className="group rounded-2xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 transition-colors duration-300 open:border-[#2ee6c9]/40 hover:border-[#2ee6c9]/30"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-white"><span>{q}</span><ChevronDownIcon className="size-5 shrink-0 text-[#2ee6c9] transition-transform group-open:rotate-180" /></summary><p className="border-t border-[#2ee6c9]/10 px-5 py-4 text-sm leading-relaxed text-[#96b8b1]">{a}</p></details></Reveal>)}</div></Container></section>

        <section className="py-20 sm:py-28"><Container><Reveal><div className="overflow-hidden rounded-[2rem] border border-[#2ee6c9]/20 bg-[radial-gradient(circle_at_72%_0%,rgba(46,230,201,.22),transparent_34%),linear-gradient(135deg,#0e2420,#0b8f80)] px-6 py-12 text-center sm:px-10 sm:py-16"><h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">2027 rồi, <span className="text-[#2ee6c9]">ra lệnh cho AI chạy quảng cáo thôi</span></h2><p className="mx-auto mt-4 max-w-xl text-[#d2ebe5]">Chỉ {formatVnd(ADS_MCP.price)}/tháng, chưa gồm tiền chạy quảng cáo.</p><ContactButton glow className="mt-7">Đăng ký tư vấn</ContactButton></div></Reveal></Container></section>
      </main>

      <footer className="relative z-10 border-t border-white/8 bg-[#040c0b] py-12 text-[#96b8b1]">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row">
            <div className="max-w-sm">
              <a href="#top" aria-label="Nextgency"><Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-7 w-auto" /></a>
              <p className="mt-4 text-sm leading-relaxed">Chạy quảng cáo Facebook bằng AI.</p>
            </div>
            <div className="grid gap-2 text-sm">
              <p className="font-semibold text-white">Liên hệ</p>
              {SITE.contact.zalo && <p>Zalo: {SITE.contact.zalo}</p>}
              {SITE.contact.phone && <p>Hotline: {SITE.contact.phone}</p>}
              {SITE.contact.email && <p>Email: {SITE.contact.email}</p>}
              <a href={SITE.url} className="hover:text-[#2ee6c9]">{SITE.url.replace(/^https?:\/\//, "")}</a>
            </div>
          </div>
          <nav aria-label="Chính sách" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
            {POLICIES.map((p) => <a key={p.href} href={p.href} className="hover:text-[#2ee6c9]">{p.label}</a>)}
          </nav>
          <div className="mt-6 text-xs leading-relaxed text-[#6e918a]">
            <p>© 2026 Nextgency. All rights reserved.</p>
            <p className="mt-1">Meta, Facebook, OpenAI, Claude, ChatGPT là thương hiệu của các chủ sở hữu tương ứng; trang này không phải trang chính thức của các bên đó.</p>
          </div>
        </Container>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-[#2ee6c9]/15 bg-[#06110f]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0 text-xs leading-tight">
          <b className="block font-bold text-white">{formatVnd(ADS_MCP.price)}/tháng</b>
          <span className="text-[#6e918a]">chưa gồm tiền chạy quảng cáo</span>
        </div>
        <ContactButton className="h-11 shrink-0 px-5 text-sm">Đăng ký tư vấn</ContactButton>
      </div>
    </div>
  );
}
