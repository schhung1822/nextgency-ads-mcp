import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckBigIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  LockKeyholeIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import StarBorder from "@/components/react-bits/StarBorder";
import { Reveal } from "@/components/landing/reveal";
import { AdsHeroAurora, AdsHeroTitle, AdsSectionTitle, AdsShinyBadge } from "@/components/ads-mcp/effects";
import { ChatGptMark, ClaudeMark, FacebookMark, GoogleAdsMark, TikTokMark } from "@/components/ads-mcp/brand-icons";
import { PlatformTabsDemo } from "@/components/ads-mcp/platform-tabs";
import { WorkflowDemo } from "@/components/ads-mcp/workflow-demo";
import { PipelineStepper } from "@/components/ads-mcp/pipeline-stepper";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ads MCP | Phòng marketing AI của Nextgency",
  description: "Thuê phòng marketing AI chỉ 4 triệu/tháng: nhắn một câu, AI lên quảng cáo Facebook, TikTok, Google, tối ưu mỗi ngày và báo cáo mỗi sáng.",
  alternates: { canonical: "/ads-mcp" },
};

const contactHref = "https://zalo.me/g/wjh3xkcip7phppc2lzdi";

const heroTasks = [
  { icon: MegaphoneIcon, title: "Chạy quảng cáo", tag: "Lên trong vài phút", iconFrom: "#34eccf", iconTo: "#0b8f80", tagBg: "#dcefea", tagColor: "#0b8f80" },
  { icon: FileTextIcon, title: "Viết bài, kịch bản", tag: "Có bài mỗi tuần", iconFrom: "#a78bfa", iconTo: "#7b5cc4", tagBg: "#ece6fa", tagColor: "#7b5cc4" },
  { icon: TargetIcon, title: "Tối ưu mỗi ngày", tag: "Bớt đốt tiền", iconFrom: "#a78bfa", iconTo: "#7b5cc4", tagBg: "#def6e9", tagColor: "#22a06b" },
  { icon: BarChart3Icon, title: "Báo cáo 8h sáng", tag: "Biết tiền đi đâu", iconFrom: "#f3b65f", iconTo: "#d68c1e", tagBg: "#fceed6", tagColor: "#b9741a" },
];

const pipelineNodes = [
  {
    title: "Viết bài, kịch bản",
    tag: "Có bài mỗi tuần",
    tagBg: "#ece6fa",
    tagColor: "#7b5cc4",
    preview: (
      <div className="flex min-h-[132px] flex-col justify-center rounded-2xl bg-white p-3 text-[#17211f] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold"><span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-[#a78bfa] to-[#7b5cc4] text-white"><FileTextIcon className="size-3.5" /></span>Bài viết · trị mụn</div>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 rounded-full bg-[#ece6fa]" style={{ width: "100%" }} />
          <div className="h-2 rounded-full bg-[#eef2f1]" style={{ width: "90%" }} />
          <div className="h-2 rounded-full bg-[#eef2f1]" style={{ width: "95%" }} />
          <div className="h-2 rounded-full bg-[#eef2f1]" style={{ width: "60%" }} />
        </div>
      </div>
    ),
  },
  {
    title: "Chạy quảng cáo",
    tag: "Lên trong vài phút",
    tagBg: "#dcefea",
    tagColor: "#0b8f80",
    preview: (
      <div className="flex min-h-[132px] flex-col justify-center gap-2 rounded-2xl bg-white p-3 text-[#17211f] shadow-sm">
        {["Mẫu A", "Mẫu B", "Mẫu C"].map((label) => (
          <div key={label} className="flex items-center gap-2 rounded-lg bg-[#fff9e1] px-2 py-1.5">
            <FacebookMark className="size-4 shrink-0" />
            <span className="flex-1 truncate text-[11px] font-bold">Trị mụn · {label}</span>
            <span className="shrink-0 rounded-full bg-[#fceed6] px-1.5 py-0.5 text-[9px] font-bold text-[#b9741a]">Chờ duyệt</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Tối ưu mỗi ngày",
    tag: "Bớt đốt tiền",
    tagBg: "#def6e9",
    tagColor: "#22a06b",
    preview: (
      <div className="flex min-h-[132px] flex-col justify-center rounded-2xl bg-white p-3 text-[#17211f] shadow-sm">
        <div className="flex items-end justify-center gap-6">
          <div className="text-center"><span className="mb-1 block text-xs font-black text-[#22a06b]">+20%</span><div className="h-16 w-8 rounded-t-lg bg-gradient-to-t from-[#0b8f80] to-[#34eccf] shadow-[0_6px_14px_rgba(11,143,128,.3)]" /><span className="mt-1 block text-[10px] font-semibold text-[#5c6b68]">Mẫu A</span></div>
          <div className="text-center"><span className="mb-1 block text-xs font-black text-[#d2412f]">Tắt</span><div className="h-7 w-8 rounded-t-lg bg-[#f3d9d6]" /><span className="mt-1 block text-[10px] font-semibold text-[#5c6b68]">Mẫu B</span></div>
        </div>
        <div className="mx-auto mt-2 h-px w-28 bg-[#e5eeec]" />
      </div>
    ),
  },
  {
    title: "Báo cáo 8h sáng",
    tag: "Biết tiền đi đâu",
    tagBg: "#fceed6",
    tagColor: "#b9741a",
    preview: (
      <div className="flex min-h-[132px] flex-col items-center justify-center rounded-2xl bg-white p-3 text-center text-[#17211f] shadow-sm">
        <p className="text-3xl font-black tracking-tight">08:00</p>
        <div className="mt-2.5 flex items-center justify-center gap-2 rounded-full bg-[#f7f9f8] px-3 py-1.5 text-xs font-bold">
          <span className="flex items-center gap-1"><FacebookMark className="size-4" />128</span>
          <span className="h-3 w-px bg-[#e5eeec]" />
          <span className="flex items-center gap-1"><TikTokMark className="size-4" />21K</span>
          <span className="h-3 w-px bg-[#e5eeec]" />
          <span className="flex items-center gap-1"><GoogleAdsMark className="size-4" />86</span>
        </div>
      </div>
    ),
  },
];

const reportItems = [
  { icon: BarChart3Icon, color: "bg-[#d68c1e]", title: "Cả 3 kênh gói trong một tin" },
  { icon: TrendingUpIcon, color: "bg-[#22a06b]", title: "Biết ngay mẫu nào đang ra khách" },
  { icon: ClipboardCheckIcon, color: "bg-[#7b5cc4]", title: "Đề xuất sẵn, bấm duyệt là AI làm" },
];

const controlItems = [
  { icon: LockKeyholeIcon, title: "Tài khoản đứng tên bạn", description: "Quảng cáo chạy trên chính tài khoản quảng cáo của bạn." },
  { icon: ShieldCheckIcon, title: "Quảng cáo mới luôn chờ duyệt", description: "Mọi quảng cáo AI tạo đều ở trạng thái tạm dừng cho đến khi bạn đồng ý." },
  { icon: MessageCircleIcon, title: "Mọi khoản chi đều hỏi trước", description: "Tăng ngân sách, bật, tắt quảng cáo: AI xem trước cho bạn rồi mới làm." },
];

const faqs = [
  ["Tôi không rành công nghệ có dùng được không?", "Có. Bạn chỉ cần nêu yêu cầu bằng tiếng Việt như đang giao việc cho nhân sự. Nextgency hỗ trợ kết nối và hướng dẫn quy trình đầu tiên."],
  ["4 triệu/tháng đã bao gồm ngân sách quảng cáo chưa?", "Chưa. Đây là chi phí vận hành phòng marketing AI. Ngân sách quảng cáo vẫn do bạn tự nạp, theo dõi và quyết định."],
  ["AI có tự tiêu tiền của tôi không?", "Không. Mọi chiến dịch mới và thay đổi liên quan đến ngân sách đều nằm ở trạng thái chờ duyệt cho đến khi bạn đồng ý."],
  ["Chạy được những nền tảng nào?", "Facebook (cả Instagram), TikTok và Google. Bạn có thể dùng 1, 2 hoặc cả 3 kênh tuỳ nhu cầu."],
  ["Tài khoản quảng cáo có thuộc về tôi không?", "Có. Ads MCP làm việc trên tài khoản quảng cáo của doanh nghiệp; bạn luôn giữ quyền quản trị và có thể ngừng kết nối bất cứ lúc nào."],
  ["Tôi đang thuê người chạy quảng cáo thì có dùng được không?", "Được. Bạn vẫn có thể giữ người đang chạy và dùng Ads MCP để xem báo cáo, kiểm tra số liệu thật mỗi ngày."],
];

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}

function ContactButton({ children, light = false, glow = false, className }: { children: React.ReactNode; light?: boolean; glow?: boolean; className?: string }) {
  if (glow) {
    return (
      <StarBorder
        as="a"
        href={contactHref}
        target={contactHref.startsWith("http") ? "_blank" : undefined}
        rel={contactHref.startsWith("http") ? "noopener noreferrer" : undefined}
        color="#eafff9"
        trailColor="#2ee6c9"
        radius={999}
        duration={3.4}
        thickness={1.5}
        sparkle
        backgroundColor="#2ee6c9"
        textColor="#06110f"
        className={cn("h-12! gap-2! px-6! text-sm! font-bold! shadow-lg shadow-[#2ee6c9]/25 transition-transform duration-200 hover:-translate-y-0.5", className)}
      >
        {children}<ArrowRightIcon className="size-4" />
      </StarBorder>
    );
  }
  return (
    <a
      href={contactHref}
      target={contactHref.startsWith("http") ? "_blank" : undefined}
      rel={contactHref.startsWith("http") ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5",
        light ? "border border-white/20 bg-white/10 text-white hover:bg-white/16" : "bg-[#2ee6c9] text-[#06110f] shadow-lg shadow-[#2ee6c9]/20 hover:bg-[#62f2da]",
        className,
      )}
    >
      {children}<ArrowRightIcon className="size-4" />
    </a>
  );
}

function SectionHeading({ tag, title, accent, lead }: { tag: string; title: string; accent?: string; lead?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <p className="mb-3 font-archivo text-xs font-bold tracking-[0.18em] text-[#16c4ac] uppercase">{tag}</p>
      <AdsSectionTitle title={title} accent={accent} />
      {lead && <p className="mt-4 text-base leading-relaxed text-[#96b8b1] sm:text-lg">{lead}</p>}
    </div>
  );
}

export default function AdsMcpPage() {
  return (
    <div className="min-h-dvh overflow-hidden bg-[#06110f] text-[#e8f4f1]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-72 -right-56 size-[44rem] rounded-full bg-[#0e6b60]/40 blur-[120px]" />
        <div className="absolute -bottom-72 -left-56 size-[38rem] rounded-full bg-[#0a3f48]/50 blur-[120px]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(46,230,201,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(46,230,201,.055)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_50%_12%,black,transparent_68%)]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#2ee6c9]/10 bg-[#06110f]/82 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-3">
          <a href="#top" aria-label="Nextgency" className="shrink-0"><Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto" /></a>
          <nav aria-label="Điều hướng Ads MCP" className="hidden items-center gap-1 lg:flex">
            {[['#cach-hoat-dong', 'Cách hoạt động'], ['#nen-tang', '3 nền tảng'], ['#phong-marketing-ai', 'Phòng marketing AI'], ['#chi-phi', 'Chi phí'], ['#faq', 'Câu hỏi']].map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-3 py-2 text-sm font-medium text-[#96b8b1] transition-colors hover:bg-white/5 hover:text-[#2ee6c9]">{label}</a>
            ))}
          </nav>
          <ContactButton className="h-9 px-4 text-xs">Đăng ký tư vấn</ContactButton>
        </Container>
      </header>

      <main id="top" className="relative z-10">
        <section className="relative isolate overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
          <AdsHeroAurora />
          <Container className="grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-10">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2ee6c9]/20 bg-[#2ee6c9]/8 px-3 py-1.5 text-xs font-bold text-[#2ee6c9]"><SparklesIcon className="size-3.5" /> <AdsShinyBadge>PHÒNG MARKETING AI</AdsShinyBadge></span>
                <AdsHeroTitle />
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold text-[#96b8b1]">chỉ</span>
                  <span className="text-3xl font-black tracking-tight text-[#2ee6c9] sm:text-4xl">4 triệu/tháng</span>
                  <span className="text-xs text-[#6e918a]">chưa gồm tiền chạy quảng cáo</span>
                </div>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#96b8b1] sm:text-lg">Nhắn một câu, AI lên quảng cáo trên Facebook, TikTok, Google. Mỗi ngày tối ưu, mỗi sáng gửi báo cáo. Bạn chủ động hoàn toàn, chỉ cần bấm duyệt.</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {["Đủ chức năng như một phòng marketing", "Tài khoản thuộc về bạn", "Có báo cáo mỗi ngày"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#e8f4f1]"><CheckIcon className="size-3.5 text-[#2ee6c9]" />{item}</span>)}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ContactButton glow>Đăng ký tư vấn</ContactButton>
                  <a href="#cach-hoat-dong" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10">Xem cách hoạt động <ChevronDownIcon className="size-4" /></a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={130}>
              <div className="relative overflow-hidden rounded-[2rem] border border-[#2ee6c9]/20 bg-[#0e2824]/75 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,230,201,.18),transparent_58%)]" aria-hidden />
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-4">
                    <span className="grid size-16 place-items-center rounded-[22px] bg-gradient-to-b from-white to-[#f2f2f2] shadow-[0_10px_24px_rgba(0,0,0,.35)] ring-1 ring-black/5 sm:size-20"><ClaudeMark className="size-10 sm:size-12" /></span>
                    <span className="grid size-8 place-items-center rounded-full bg-[#2ee6c9]/10 text-lg font-black text-[#2ee6c9] ring-1 ring-[#2ee6c9]/30">+</span>
                    <span className="grid size-16 place-items-center rounded-[22px] bg-gradient-to-b from-white to-[#f2f2f2] shadow-[0_10px_24px_rgba(0,0,0,.35)] ring-1 ring-black/5 sm:size-20"><ChatGptMark className="size-10 text-[#06110f] sm:size-12" /></span>
                  </div>
                  <span className="rounded-full bg-[#2ee6c9] px-4 py-2 text-sm font-black text-[#06110f] shadow-[0_6px_18px_rgba(46,230,201,.35)]">Claude · ChatGPT + Ads MCP</span>
                </div>
                <div className="relative mx-[14%] h-9" aria-hidden>
                  <span className="absolute left-1/2 top-0 h-5 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#2ee6c9] to-[#16c4ac] shadow-[0_0_10px_rgba(46,230,201,.6)]" />
                  <span className="absolute inset-x-0 top-[18px] h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#2ee6c9] to-transparent shadow-[0_0_10px_rgba(46,230,201,.6)]" />
                </div>
                <div className="relative grid grid-cols-2 gap-3.5 sm:gap-4">
                  {heroTasks.map(({ icon: Icon, title, tag, iconFrom, iconTo, tagBg, tagColor }, i) => (
                    <Reveal key={title} delay={200 + i * 90}>
                      <div className="flex h-full flex-col items-center rounded-2xl bg-white p-4 text-center text-[#17211f] shadow-[0_8px_20px_rgba(0,0,0,.14)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1.5">
                        <span className="mb-2.5 block size-1.5 rounded-full bg-[#2ee6c9] shadow-[0_0_6px_rgba(46,230,201,.9)]" />
                        <span className="grid size-12 shrink-0 place-items-center rounded-full text-white shadow-[0_6px_14px_rgba(0,0,0,.18)]" style={{ backgroundImage: `linear-gradient(135deg, ${iconFrom}, ${iconTo})` }}><Icon className="size-6" /></span>
                        <h4 className="mt-2.5 flex min-h-[2.3rem] items-center justify-center text-sm font-extrabold leading-snug">{title}</h4>
                        <span className="mt-auto inline-block rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: tagBg, color: tagColor }}>{tag}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
                <div className="relative mt-5 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#e8f4f1]"><CheckIcon className="size-3.5 text-[#2ee6c9]" /> Bạn duyệt mới chạy · mọi khoản chi đều hỏi bạn</span>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="cach-hoat-dong" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Cách hoạt động" title="Nhắn một câu," accent="AI lên quảng cáo" lead="Xem AI chạy từng bước, lặp lại liên tục." />
            <Reveal><WorkflowDemo /></Reveal>
          </Container>
        </section>

        <section id="nen-tang" className="py-20 sm:py-28">
          <Container>
            <SectionHeading tag="3 nền tảng" title="Facebook, TikTok, Google" accent="chạy từ một khung chat" lead="Bấm từng nền tảng để xem AI làm gì." />
            <Reveal><PlatformTabsDemo /></Reveal>
          </Container>
        </section>

        <section id="phong-marketing-ai" className="bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Phòng marketing AI" title="4 việc," accent="như một phòng marketing inhouse" lead="Một trợ lý AI làm nối tiếp cả 4 việc, từ nội dung đến báo cáo. Bạn chỉ duyệt." />
            <Reveal><PipelineStepper nodes={pipelineNodes} /></Reveal>
          </Container>
        </section>

        <section id="bao-cao-sang" className="py-20 sm:py-28">
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
                        <div className="flex items-center gap-2 text-sm font-bold"><ClaudeMark className="size-4" /> Trợ lý AI · hôm qua<span className="relative ml-auto flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#22a06b]/70" /><span className="relative inline-flex size-1.5 rounded-full bg-[#22a06b]" /></span></div>
                        <div className="mt-3 divide-y divide-[#f0f3f2]">
                          {[[FacebookMark, 128, "tin nhắn"], [TikTokMark, 21300, "lượt xem"], [GoogleAdsMark, 86, "lượt bấm"]].map(([Icon, value, label], i) => { const StatIcon = Icon as typeof FacebookMark; return <div key={label as string} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f7f9f8]"><StatIcon className="size-5" /></span><span className="flex items-baseline gap-1.5"><b className="text-lg font-black text-[#0b8f80]"><CountUp to={value as number} separator="." duration={1.6} delay={i * 0.15} /></b><span className="text-xs text-[#5c6b68]">{label as string}</span></span></div>; })}
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
              <p className="font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Có báo cáo mỗi ngày</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Sáng dậy, <span className="text-[#2ee6c9]">đã biết quảng cáo ra sao</span></h2>
              <p className="mt-5 max-w-xl leading-relaxed text-[#96b8b1]">Một tin nhắn mỗi sáng gói đủ số liệu của Facebook, TikTok và Google, kèm đề xuất bạn chỉ cần bấm duyệt.</p>
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

        <section id="chi-phi" className="py-20 sm:py-28">
          <Container><SectionHeading tag="Chi phí minh bạch" title="Sở hữu phòng marketing AI" accent="chỉ 4 triệu/tháng" lead="Đi trước một bước về công nghệ, trong khi vẫn giữ quyền kiểm soát ở doanh nghiệp." /><Reveal><article className="mx-auto max-w-xl rounded-[2rem] border-2 border-[#2ee6c9]/45 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,230,201,.22),transparent_52%)] bg-[#0e2824] p-7 text-center shadow-2xl shadow-black/25 transition-transform duration-300 hover:-translate-y-1 sm:p-9"><span className="rounded-full bg-[#2ee6c9] px-3 py-1.5 text-xs font-black tracking-wider text-[#06110f]">ADS MCP</span><p className="mt-5 text-5xl font-black tracking-tight text-[#2ee6c9] sm:text-6xl">4 triệu</p><p className="mt-1 font-semibold text-[#e8f4f1]">mỗi tháng</p><p className="mt-1 text-sm text-[#96b8b1]">Chưa bao gồm ngân sách quảng cáo</p><ul className="my-7 grid gap-3 text-left text-sm text-[#e8f4f1]">{["Kết nối & hỗ trợ thiết lập ban đầu", "Lên quảng cáo trên Facebook, TikTok, Google", "Tối ưu quảng cáo và báo cáo mỗi ngày (8h sáng)", "Bài viết, kịch bản video mỗi tuần", "Tài khoản đứng tên bạn, bạn duyệt mới chạy"].map(item => <li key={item} className="flex gap-2"><CircleCheckBigIcon className="size-5 shrink-0 text-[#2ee6c9]" />{item}</li>)}</ul><ContactButton className="w-full">Đăng ký tư vấn ngay</ContactButton></article></Reveal></Container>
        </section>

        <section id="faq" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28"><Container><SectionHeading tag="Câu hỏi thường gặp" title="Bạn đang" accent="thắc mắc?" /><div className="mx-auto grid max-w-3xl gap-3">{faqs.map(([q, a]) => <Reveal key={q}><details className="group rounded-2xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 transition-colors duration-300 open:border-[#2ee6c9]/40 hover:border-[#2ee6c9]/30"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-white"><span>{q}</span><ChevronDownIcon className="size-5 shrink-0 text-[#2ee6c9] transition-transform group-open:rotate-180" /></summary><p className="border-t border-[#2ee6c9]/10 px-5 py-4 text-sm leading-relaxed text-[#96b8b1]">{a}</p></details></Reveal>)}</div></Container></section>

        <section className="py-20 sm:py-28"><Container><Reveal><div className="overflow-hidden rounded-[2rem] border border-[#2ee6c9]/20 bg-[radial-gradient(circle_at_72%_0%,rgba(46,230,201,.22),transparent_34%),linear-gradient(135deg,#0e2420,#0b8f80)] px-6 py-12 text-center sm:px-10 sm:py-16"><h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Năm 2027, doanh nghiệp <span className="text-[#2ee6c9]">không thể bỏ qua điều này</span></h2><p className="mx-auto mt-4 max-w-xl text-[#d2ebe5]">Sở hữu phòng marketing AI chạy Facebook, TikTok, Google chỉ 4 triệu/tháng.</p><ContactButton glow className="mt-7">Đăng ký và nhắn Zalo tư vấn</ContactButton></div></Reveal></Container></section>
      </main>

      <footer className="relative z-10 border-t border-white/8 bg-[#040c0b] py-10 text-center"><a href="#top" aria-label="Nextgency" className="inline-block"><Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-6 w-auto" /></a><p className="mt-2 text-sm text-[#6e918a]">Phòng marketing chạy & kiểm soát bằng AI</p><div className="mt-4 flex justify-center gap-4 text-sm text-[#96b8b1]"><a href="/privacy" className="hover:text-[#2ee6c9]">Chính sách bảo mật</a><a href="/terms" className="hover:text-[#2ee6c9]">Điều khoản sử dụng</a></div><p className="mt-4 text-xs text-[#6e918a]">© 2026 Nextgency. All rights reserved.</p></footer>
    </div>
  );
}
