import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart3Icon,
  BotIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleCheckBigIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  GaugeIcon,
  LightbulbIcon,
  LockKeyholeIcon,
  MessageSquareTextIcon,
  MousePointerClickIcon,
  ScanSearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { AdsHeroAurora, AdsHeroTitle, AdsSectionTitle, AdsShinyBadge } from "@/components/ads-mcp/effects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ads MCP | Phòng marketing AI của Nextgency",
  description: "Ra lệnh, duyệt và theo dõi quảng cáo Facebook, TikTok, Google trong một nơi với Ads MCP.",
  alternates: { canonical: "/ads-mcp" },
};

const contactHref = "https://zalo.me/g/wjh3xkcip7phppc2lzdi";

const platforms = [
  { name: "Meta Ads", label: "Facebook & Instagram", color: "bg-[#1877f2]", metric: "238 leads", icon: ThumbsUpIcon },
  { name: "TikTok Ads", label: "Video ngắn", color: "bg-[#fe2c55]", metric: "42.6K views", icon: SparklesIcon },
  { name: "Google Ads", label: "Nhu cầu tìm kiếm", color: "bg-[#4285f4]", metric: "5.8% CTR", icon: ScanSearchIcon },
];

const faqs = [
  ["Tôi không rành công nghệ có dùng được không?", "Có. Bạn chỉ cần nêu yêu cầu bằng tiếng Việt như đang giao việc cho nhân sự. Nextgency hỗ trợ kết nối và hướng dẫn quy trình đầu tiên."],
  ["4 triệu/tháng đã bao gồm ngân sách quảng cáo chưa?", "Chưa. Đây là chi phí vận hành phòng marketing AI. Ngân sách quảng cáo vẫn do bạn tự nạp, theo dõi và quyết định."],
  ["AI có tự tiêu tiền của tôi không?", "Không. Mọi chiến dịch mới và thay đổi liên quan đến ngân sách đều nằm ở trạng thái chờ duyệt cho đến khi bạn đồng ý."],
  ["Tài khoản quảng cáo có thuộc về tôi không?", "Có. Ads MCP làm việc trên tài khoản quảng cáo của doanh nghiệp; bạn luôn giữ quyền quản trị và có thể ngừng kết nối bất cứ lúc nào."],
];

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}

function ContactButton({ children, light = false, className }: { children: React.ReactNode; light?: boolean; className?: string }) {
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
            {[['#cach-hoat-dong', 'Cách hoạt động'], ['#nen-tang', 'Nền tảng'], ['#kiem-soat', 'Kiểm soát'], ['#chi-phi', 'Chi phí']].map(([href, label]) => (
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
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#96b8b1] sm:text-lg">Ads MCP kết nối Facebook, TikTok và Google vào một không gian làm việc. Bạn giao việc bằng tiếng Việt, AI chuẩn bị kế hoạch, nội dung và chiến dịch để bạn duyệt.</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {["Tài khoản thuộc về bạn", "Mọi khoản chi đều hỏi trước", "Báo cáo mỗi sáng"].map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#e8f4f1]"><CheckIcon className="size-3.5 text-[#2ee6c9]" />{item}</span>)}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ContactButton>Đăng ký tư vấn</ContactButton>
                  <a href="#cach-hoat-dong" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition-colors hover:bg-white/10">Xem cách hoạt động <ChevronDownIcon className="size-4" /></a>
                </div>
              </Reveal>
            </div>

            <Reveal delay={130}>
              <div className="rounded-[2rem] border border-[#2ee6c9]/20 bg-[#0e2824]/75 p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-5">
                <div className="rounded-[1.45rem] bg-[#f3f8f7] p-4 text-[#17211f] sm:p-5">
                  <div className="flex items-center justify-between border-b border-[#dce9e6] pb-3"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-[#0b8f80] text-white"><BotIcon className="size-5" /></span><span><b className="block text-sm">Ads MCP</b><small className="text-xs text-[#5c6b68]">Trợ lý marketing của bạn</small></span></div><span className="rounded-full bg-[#def6e9] px-2.5 py-1 text-[11px] font-bold text-[#22a06b]">Đang kết nối</span></div>
                  <div className="mt-5 max-w-[85%] rounded-2xl rounded-tl-sm bg-[#e0f4ef] px-3.5 py-3 text-sm font-medium leading-relaxed">Lên chiến dịch tin nhắn cho bài mới, ngân sách 200k/ngày nhé.</div>
                  <div className="mt-4 rounded-2xl border border-[#dce9e6] bg-white p-3.5 shadow-sm"><div className="flex items-center gap-2 text-sm font-bold"><SparklesIcon className="size-4 text-[#0b8f80]" /> AI đã chuẩn bị chiến dịch</div><div className="mt-3 grid gap-2 text-xs"><div className="flex items-center justify-between rounded-xl bg-[#f3f8f7] px-3 py-2"><span><b className="block">Meta · Tin nhắn</b><small className="text-[#5c6b68]">Tệp khách hàng mới</small></span><span className="font-bold text-[#0b8f80]">200.000đ/ngày</span></div><div className="flex items-center justify-between rounded-xl bg-[#f3f8f7] px-3 py-2"><span><b className="block">Nội dung & hình ảnh</b><small className="text-[#5c6b68]">Đã tạo 3 phương án</small></span><span className="rounded-full bg-[#fceed6] px-2 py-1 font-bold text-[#b9741a]">Chờ duyệt</span></div></div><button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b8f80] py-2.5 text-sm font-bold text-white">Duyệt chiến dịch <MousePointerClickIcon className="size-4" /></button></div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#5c6b68]"><span className="size-2 rounded-full bg-[#2ee6c9]" /> AI sẽ không chạy khi chưa có xác nhận của bạn.</div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        <section id="cach-hoat-dong" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Cách hoạt động" title="Nhắn một câu," accent="AI lên quảng cáo" lead="Một luồng công việc rõ ràng, từ ý tưởng đến khi bạn duyệt chiến dịch." />
            <div className="grid gap-5 lg:grid-cols-3">
              {[
                ["01", MessageSquareTextIcon, "Giao việc như cho nhân sự", "Nói mục tiêu, sản phẩm hoặc chiến dịch bạn muốn bằng ngôn ngữ tự nhiên."],
                ["02", BotIcon, "AI chuẩn bị phương án", "Ads MCP tạo nội dung, gợi ý tệp khách hàng và phân bổ ngân sách phù hợp."],
                ["03", ClipboardCheckIcon, "Bạn xem & duyệt", "Mọi thứ xuất hiện rõ ràng trong bảng duyệt. Không có thay đổi nào tự chạy."],
              ].map(([number, Icon, title, description]) => {
                const StepIcon = Icon as typeof BotIcon;
                return <Reveal key={number as string}><article className="relative h-full rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-6 pt-9 shadow-lg shadow-black/10"><span className="absolute -top-3 left-6 rounded-full bg-linear-to-r from-[#0b8f80] to-[#2ee6c9] px-3 py-1 text-xs font-black tracking-wider text-[#06110f]">{number as string}</span><span className="grid size-12 place-items-center rounded-2xl bg-[#2ee6c9]/10 text-[#2ee6c9]"><StepIcon className="size-6" /></span><h3 className="mt-5 text-xl font-bold text-white">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-[#96b8b1]">{description as string}</p></article></Reveal>;
              })}
            </div>
          </Container>
        </section>

        <section id="nen-tang" className="py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Một nơi, ba nền tảng" title="Quảng cáo đa kênh" accent="không còn rối" lead="Theo dõi, tạo và tối ưu chiến dịch trên những kênh khách hàng của bạn đang sử dụng." />
            <div className="grid gap-5 lg:grid-cols-3">
              {platforms.map(({ name, label, color, metric, icon: Icon }) => <Reveal key={name}><article className="h-full rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5"><div className="flex items-center gap-3"><span className={cn("grid size-12 place-items-center rounded-2xl text-white shadow-lg", color)}><Icon className="size-6" /></span><span><h3 className="font-bold text-white">{name}</h3><p className="text-xs text-[#96b8b1]">{label}</p></span></div><div className="mt-5 rounded-2xl bg-white p-3.5 text-[#17211f]"><div className="flex items-center justify-between text-xs"><span className="font-bold">Hiệu quả tuần này</span><span className="text-[#22a06b]">+18.4%</span></div><div className="mt-4 flex h-14 items-end gap-1.5">{[35, 57, 43, 76, 60, 92, 78].map((height, i) => <span key={i} className="flex-1 rounded-t-sm bg-[#16c4ac]" style={{ height: `${height}%`, opacity: 0.35 + i / 12 }} />)}</div><div className="mt-3 flex items-center justify-between border-t border-[#e5eeec] pt-3"><span className="text-xs text-[#5c6b68]">Chỉ số chính</span><b className="text-sm text-[#0b8f80]">{metric}</b></div></div><ul className="mt-5 grid gap-2 text-sm text-[#e8f4f1]"><li className="flex gap-2"><CheckIcon className="mt-0.5 size-4 text-[#2ee6c9]" />Đề xuất nội dung theo nền tảng</li><li className="flex gap-2"><CheckIcon className="mt-0.5 size-4 text-[#2ee6c9]" />Tối ưu theo dữ liệu thực tế</li></ul></article></Reveal>)}
            </div>
          </Container>
        </section>

        <section className="bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container>
            <SectionHeading tag="Phòng marketing AI" title="Bốn việc vận hành" accent="trong một quy trình" lead="Ads MCP biến một yêu cầu ngắn thành một chuỗi công việc có thể theo dõi." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[[FileTextIcon, "Viết bài & kịch bản", "Có phương án nội dung đều đặn."], [TargetIcon, "Lên chiến dịch", "Chuẩn bị tệp, mục tiêu và ngân sách."], [GaugeIcon, "Tối ưu mỗi ngày", "Tìm điểm cần tăng, giảm hoặc tạm dừng."], [BarChart3Icon, "Báo cáo 8h sáng", "Biết rõ tiền đi đâu, kết quả ra sao."]].map(([Icon, title, description], i) => { const CardIcon = Icon as typeof BotIcon; return <Reveal key={title as string} delay={i * 80}><article className="relative h-full rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5"><span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-[#2ee6c9] text-xs font-black text-[#06110f]">0{i + 1}</span><span className="grid size-12 place-items-center rounded-2xl bg-[#2ee6c9]/10 text-[#2ee6c9]"><CardIcon className="size-6" /></span><h3 className="mt-5 font-bold text-white">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-[#96b8b1]">{description as string}</p></article></Reveal>; })}
            </div>
          </Container>
        </section>

        <section id="kiem-soat" className="py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal><div><p className="font-archivo text-xs font-bold tracking-[.18em] text-[#16c4ac] uppercase">Kiểm soát bằng AI</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">AI làm việc. <span className="text-[#2ee6c9]">Bạn quyết định.</span></h2><p className="mt-5 max-w-xl leading-relaxed text-[#96b8b1]">Công nghệ chỉ hữu ích khi bạn hiểu và làm chủ được nó. Ads MCP được thiết kế để mọi thay đổi quan trọng đều minh bạch, có dấu vết và chờ xác nhận.</p><ContactButton className="mt-7">Nhận tư vấn lộ trình</ContactButton></div></Reveal>
            <div className="grid gap-4 sm:grid-cols-3">{[[LockKeyholeIcon, "Tài khoản của bạn", "Quảng cáo chạy trên tài khoản doanh nghiệp của bạn."], [ShieldCheckIcon, "Chờ bạn duyệt", "Chiến dịch mới luôn ở trạng thái tạm dừng."], [LightbulbIcon, "Chi tiền có lý do", "Tăng ngân sách hay thử nghiệm đều được giải thích."]].map(([Icon, title, description], i) => { const CardIcon = Icon as typeof BotIcon; return <Reveal key={title as string} delay={i * 90}><article className="h-full rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5 text-center"><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#2ee6c9]/10 text-[#2ee6c9]"><CardIcon className="size-6" /></span><h3 className="mt-4 font-bold text-white">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-[#96b8b1]">{description as string}</p></article></Reveal>; })}</div>
          </Container>
        </section>

        <section id="chi-phi" className="border-y border-[#2ee6c9]/10 bg-[#0a1a17]/70 py-20 sm:py-28">
          <Container><SectionHeading tag="Chi phí minh bạch" title="Sở hữu phòng marketing AI" accent="từ 4 triệu/tháng" lead="Đi trước một bước về công nghệ, trong khi vẫn giữ quyền kiểm soát ở doanh nghiệp." /><Reveal><article className="mx-auto max-w-xl rounded-[2rem] border-2 border-[#2ee6c9]/45 bg-[radial-gradient(ellipse_at_50%_0%,rgba(46,230,201,.22),transparent_52%)] bg-[#0e2824] p-7 text-center shadow-2xl shadow-black/25 sm:p-9"><span className="rounded-full bg-[#2ee6c9] px-3 py-1.5 text-xs font-black tracking-wider text-[#06110f]">ADS MCP</span><p className="mt-5 text-5xl font-black tracking-tight text-[#2ee6c9] sm:text-6xl">4 triệu</p><p className="mt-1 font-semibold text-[#e8f4f1]">mỗi tháng</p><p className="mt-1 text-sm text-[#96b8b1]">Chưa bao gồm ngân sách quảng cáo</p><ul className="my-7 grid gap-3 text-left text-sm text-[#e8f4f1]">{["Kết nối & hỗ trợ thiết lập ban đầu", "Quản lý Facebook, TikTok, Google trong một nơi", "Báo cáo và gợi ý tối ưu mỗi ngày", "Bạn duyệt trước mọi thay đổi liên quan đến ngân sách"].map(item => <li key={item} className="flex gap-2"><CircleCheckBigIcon className="size-5 shrink-0 text-[#2ee6c9]" />{item}</li>)}</ul><ContactButton className="w-full">Đăng ký tư vấn ngay</ContactButton></article></Reveal></Container>
        </section>

        <section className="py-20 sm:py-28"><Container><SectionHeading tag="Câu hỏi thường gặp" title="Bạn đang" accent="thắc mắc?" /><div className="mx-auto grid max-w-3xl gap-3">{faqs.map(([q, a]) => <Reveal key={q}><details className="group rounded-2xl border border-[#2ee6c9]/15 bg-[#0e2824]/70"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-white"><span>{q}</span><ChevronDownIcon className="size-5 shrink-0 text-[#2ee6c9] transition-transform group-open:rotate-180" /></summary><p className="border-t border-[#2ee6c9]/10 px-5 py-4 text-sm leading-relaxed text-[#96b8b1]">{a}</p></details></Reveal>)}</div></Container></section>

        <section className="pb-20 sm:pb-28"><Container><Reveal><div className="overflow-hidden rounded-[2rem] border border-[#2ee6c9]/20 bg-[radial-gradient(circle_at_72%_0%,rgba(46,230,201,.22),transparent_34%),linear-gradient(135deg,#0e2420,#0b8f80)] px-6 py-12 text-center sm:px-10 sm:py-16"><p className="font-archivo text-xs font-bold tracking-[.18em] text-[#2ee6c9] uppercase">Bắt đầu từ một câu lệnh</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Để AI làm phần nặng.<br />Bạn tập trung vào quyết định lớn.</h2><p className="mx-auto mt-4 max-w-xl text-[#d2ebe5]">Nhận tư vấn cách đưa Ads MCP vào quy trình marketing hiện tại của doanh nghiệp.</p><ContactButton className="mt-7">Đăng ký tư vấn ngay</ContactButton></div></Reveal></Container></section>
      </main>

      <footer className="relative z-10 border-t border-white/8 bg-[#040c0b] py-10 text-center"><a href="#top" aria-label="Nextgency" className="inline-block"><Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-6 w-auto" /></a><p className="mt-2 text-sm text-[#6e918a]">Phòng marketing chạy & kiểm soát bằng AI</p><div className="mt-4 flex justify-center gap-4 text-sm text-[#96b8b1]"><a href="/privacy" className="hover:text-[#2ee6c9]">Chính sách bảo mật</a><a href="/terms" className="hover:text-[#2ee6c9]">Điều khoản sử dụng</a></div><p className="mt-4 text-xs text-[#6e918a]">© 2026 Nextgency. All rights reserved.</p></footer>
    </div>
  );
}
