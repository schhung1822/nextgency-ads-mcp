import { ArrowRightIcon, EyeIcon, FlameIcon, FolderOpenIcon, HeartIcon, ImageIcon, MegaphoneIcon, PlayIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { FacebookMark, MessengerMark } from "@/components/ads-mcp/brand-icons";
import { cn } from "@/lib/utils";

/** Mũi tên "biến thành" giữa hai khối trong hình minh hoạ. */
function FlowArrow() {
  return (
    <span className="grid size-5 shrink-0 place-items-center self-center rounded-full bg-[#dcefea] text-[#0b8f80]">
      <ArrowRightIcon className="size-3" strokeWidth={2.5} />
    </span>
  );
}

function WaitBadge() {
  return <span className="rounded-full bg-[#fceed6] px-2 py-0.5 text-[11px] font-bold text-[#b9741a]">Chờ duyệt</span>;
}

const LIBRARY_THUMBS = [
  { from: "#d9ccf5", to: "#a68be2", video: true },
  { from: "#bfe9e1", to: "#5fc7b5", video: false },
  { from: "#fce3c2", to: "#e9a65a", video: true },
  { from: "#bcd9f7", to: "#5b9ee0", video: false },
  { from: "#f7d3ce", to: "#e08575", video: true },
  { from: "#bfe9e1", to: "#5fc7b5", video: false },
];

const OPTIMIZE_COLUMNS = [
  { name: "Mẫu A", result: "74 tin nhắn", action: "Tăng 20%", height: 64, bar: "bg-[#22a06b]", chip: "bg-[#def6e9] text-[#22a06b]" },
  { name: "Mẫu B", result: "6 tin nhắn", action: "Tắt", height: 14, bar: "bg-[#e9b3ab]", chip: "bg-[#fbe4e2] text-[#d2412f]" },
  { name: "Mẫu C", result: "48 tin nhắn", action: "Giữ", height: 40, bar: "bg-[#9dd9cd]", chip: "bg-[#e8f1ef] text-[#0b8f80]" },
];

const COMMENTS = [
  { text: "Còn size M không shop?", avatar: "#d9ccf5" },
  { text: "Giá bao nhiêu vậy ạ?", avatar: "#fce3c2" },
];

const COMPETITORS = [
  { name: "Đối thủ A", note: "Chạy 45 ngày", from: "#f5d9c8", to: "#e9a887", chip: "bg-[#dcefea] text-[#0b8f80]" },
  { name: "Đối thủ B", note: "Chạy 30 ngày", from: "#cfe0f7", to: "#8eb4ea", chip: "bg-[#dcefea] text-[#0b8f80]" },
  { name: "Đối thủ C", note: "Mẫu mới", from: "#d9f0da", to: "#93d199", chip: "bg-[#ece6fa] text-[#7b5cc4]" },
];

type Feature = {
  title: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  /** Nền của khung minh hoạ, mặc định là trắng. */
  frame?: string;
  preview: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "Bài đang hot thành quảng cáo",
    tag: "Lên trong vài phút",
    tagBg: "#dcefea",
    tagColor: "#0b8f80",
    preview: (
      <div className="mx-auto flex w-full max-w-[260px] items-stretch gap-1 self-center">
        <div className="min-w-0 flex-1 rounded-xl border border-[#e5eeec] p-1.5">
          <b className="block text-xs leading-tight">Bài hôm qua</b>
          <div className="mt-1.5 h-16 rounded-lg bg-gradient-to-br from-[#bfe9e1] to-[#7fd3c4] p-1">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[11px] font-bold text-[#d2412f]"><FlameIcon className="size-3" />Hot</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs font-bold text-[#e0245e]"><HeartIcon className="size-3.5 fill-current" />1.240</div>
        </div>
        <FlowArrow />
        <div className="flex w-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#fff9e1] px-1.5 py-2 text-center">
          <FacebookMark className="size-8" />
          <b className="text-xs leading-tight">Quảng cáo tin nhắn</b>
          <WaitBadge />
        </div>
      </div>
    ),
  },
  {
    title: "Kho ảnh, video thành loạt quảng cáo",
    tag: "Một lượt là xong",
    tagBg: "#ece6fa",
    tagColor: "#7b5cc4",
    preview: (
      <div className="mx-auto flex w-full max-w-[260px] items-stretch gap-1 self-center">
        <div className="min-w-0 flex-1 rounded-xl border border-[#e5eeec] p-1.5">
          <div className="flex items-center gap-1">
            <FolderOpenIcon className="size-4 shrink-0 text-[#d68c1e]" />
            <b className="text-xs leading-tight">Ảnh, video</b>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {LIBRARY_THUMBS.map(({ from, to, video }, i) => (
              <span key={i} className="grid aspect-square place-items-center rounded-md text-white" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}>
                {video ? <PlayIcon className="size-3 fill-current" /> : <ImageIcon className="size-3" />}
              </span>
            ))}
          </div>
        </div>
        <FlowArrow />
        <div className="flex w-[88px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-[#f3effc] px-1.5 py-2 text-center">
          <b className="text-4xl leading-none font-black text-[#7b5cc4]">12</b>
          <b className="text-xs leading-tight">mẫu quảng cáo</b>
          <WaitBadge />
        </div>
      </div>
    ),
  },
  {
    title: "Quảng cáo cho buổi livestream",
    tag: "Đúng lúc đang live",
    tagBg: "#fbe4e2",
    tagColor: "#d2412f",
    frame: "bg-gradient-to-br from-[#2b2140] to-[#14101f] text-white",
    preview: (
      <div className="flex flex-col justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#e5243b] px-2 py-0.5 text-xs font-black"><span className="size-1.5 animate-pulse rounded-full bg-white" />LIVE</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-xs font-bold"><EyeIcon className="size-3.5" />1.2K đang xem</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="flex -space-x-1.5">
            {["#f7d3ce", "#bcd9f7", "#bfe9e1"].map((color) => (
              <span key={color} className="size-6 rounded-full ring-2 ring-[#211a33]" style={{ background: color }} />
            ))}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-[#2ee6c9]"><TrendingUpIcon className="size-3.5" />+86 người vừa vào</span>
        </div>
        <p className="flex items-center gap-1.5 rounded-xl bg-[#2ee6c9] px-2.5 py-2 text-xs leading-tight font-bold text-balance text-[#06110f]">
          <MegaphoneIcon className="size-4 shrink-0" />Quảng cáo đang đẩy người vào xem
        </p>
      </div>
    ),
  },
  {
    title: "Khách nhắn là có lời chào sẵn",
    tag: "Không bỏ lỡ khách",
    tagBg: "#e1ecff",
    tagColor: "#1c64d9",
    frame: "bg-[#f3f8f7]",
    preview: (
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5c6b68]"><MessengerMark className="size-4 shrink-0" />Khách vừa nhắn từ quảng cáo</div>
        <p className="w-fit rounded-2xl rounded-tl-md bg-white px-3 py-2 text-[13px] leading-snug font-semibold text-balance shadow-[0_2px_8px_rgba(0,0,0,.06)]">Chào bạn, bạn cần xem giá hay tư vấn size ạ?</p>
        <div className="flex flex-wrap gap-1.5">
          {["Xem giá", "Tư vấn size"].map((reply) => (
            <span key={reply} className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#1c64d9] ring-[1.5px] ring-[#1c64d9] ring-inset">{reply}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Tối ưu mỗi ngày",
    tag: "Bớt đốt tiền",
    tagBg: "#def6e9",
    tagColor: "#22a06b",
    preview: (
      <div className="flex items-end justify-center gap-1 self-center">
        {OPTIMIZE_COLUMNS.map(({ name, result, action, height, bar, chip }) => (
          <div key={name} className="flex min-w-0 flex-1 flex-col items-center">
            <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] font-black whitespace-nowrap", chip)}>{action}</span>
            <span className={cn("mt-1 w-10 rounded-t-lg rounded-b-sm", bar)} style={{ height }} />
            <b className="mt-1.5 text-xs">{name}</b>
            <span className="text-[11px] whitespace-nowrap text-[#5c6b68]">{result}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Đọc bình luận, biết khách hỏi gì",
    tag: "Làm đúng nội dung",
    tagBg: "#ece6fa",
    tagColor: "#7b5cc4",
    frame: "bg-[#f3f8f7]",
    preview: (
      <div className="flex flex-col justify-center gap-2.5">
        <div className="flex flex-col gap-1.5">
          {COMMENTS.map(({ text, avatar }) => (
            <div key={text} className="flex items-center gap-1.5">
              <span className="size-5 shrink-0 rounded-full" style={{ background: avatar }} />
              <span className="rounded-2xl bg-white px-2.5 py-1.5 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,.05)]">{text}</span>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-1.5 rounded-xl bg-[#7b5cc4] px-2.5 py-2 text-xs leading-tight font-bold text-balance text-white">
          <SparklesIcon className="size-4 shrink-0" />Khách hỏi nhiều nhất: giá, size
        </p>
      </div>
    ),
  },
  {
    title: "Báo cáo 8h sáng",
    tag: "Biết có lời không",
    tagBg: "#fceed6",
    tagColor: "#b9741a",
    frame: "bg-gradient-to-b from-[#e8f1ef] to-white",
    preview: (
      <div className="flex flex-col justify-center gap-2.5">
        <p className="text-center text-3xl leading-none font-semibold tracking-tight">08:00</p>
        <div className="rounded-xl bg-white p-2.5 shadow-[0_6px_18px_rgba(0,0,0,.1)]">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <FacebookMark className="size-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">Quảng cáo hôm qua</span>
            <span className="shrink-0 rounded-full bg-[#def6e9] px-2 py-0.5 text-[11px] text-[#22a06b]">Có lời</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#edf0f2] pt-2 text-center text-[11px] text-[#5c6b68]">
            <span><b className="block text-base leading-tight font-black text-[#0b8f80]">31</b>lịch hẹn</span>
            <span><b className="block text-base leading-tight font-black text-[#0b8f80]">38.700đ</b>mỗi lịch</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Xem đối thủ đang chạy mẫu gì",
    tag: "Không bị tụt lại",
    tagBg: "#dcefea",
    tagColor: "#0b8f80",
    preview: (
      <div className="flex flex-col justify-center gap-1.5">
        {COMPETITORS.map(({ name, note, from, to, chip }) => (
          <div key={name} className="flex items-center gap-2 rounded-xl border border-[#e5eeec] p-1.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg text-white" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}><PlayIcon className="size-3 fill-current" /></span>
            <b className="min-w-0 flex-1 truncate text-xs">{name}</b>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold", chip)}>{note}</span>
          </div>
        ))}
      </div>
    ),
  },
];

/** Các việc AI làm được: mobile vuốt ngang từng thẻ, từ sm trở lên xếp lưới. */
export function FeatureCards() {
  return (
    <>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pt-1 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:p-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {features.map(({ title, tag, tagBg, tagColor, frame, preview }, i) => (
          // Trên mobile thẻ nằm ngoài khung nhìn theo chiều ngang nên không dùng hiệu ứng hiện dần, tránh thẻ bị trống khi vuốt nhanh.
          <Reveal key={title} delay={(i % 4) * 70} className="w-[82%] min-w-[272px] shrink-0 snap-center max-sm:translate-y-0! max-sm:opacity-100! sm:w-auto sm:min-w-0">
            <article className="flex h-full flex-col rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-4 text-center transition-all duration-300 sm:text-left sm:hover:-translate-y-1 sm:hover:border-[#2ee6c9]/35">
              <div className={cn("grid min-h-46 flex-1 overflow-hidden rounded-2xl p-2.5 text-left text-[#17211f] shadow-sm", frame ?? "bg-white")}>{preview}</div>
              <h3 className="mt-4 text-[17px] leading-snug font-bold text-balance text-white sm:text-base">{title}</h3>
              <span className="mx-auto mt-2.5 w-fit rounded-full px-3 py-1.5 text-xs font-bold sm:mx-0 sm:mt-2 sm:px-2.5 sm:py-1 sm:text-[11px]" style={{ background: tagBg, color: tagColor }}>{tag}</span>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[#2ee6c9] sm:hidden">
        Vuốt để xem thêm <ArrowRightIcon className="nudge-x size-4" />
      </p>
    </>
  );
}
