import { SparklesIcon, VideoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS = [
  { label: "Khách thật review", width: 86, verdict: "ok", from: "#bfe9e1", to: "#5fc7b5" },
  { label: "Không gian, quy trình", width: 72, verdict: "ok", from: "#d9ccf5", to: "#a68be2" },
  { label: "Giới thiệu dịch vụ", width: 44, verdict: "mid", from: "#fce3c2", to: "#e9a65a" },
  { label: "Ưu đãi giảm giá", width: 18, verdict: "bad", from: "#f7d3ce", to: "#e08575" },
] as const;

const VERDICT: Record<string, { label: string; badge: string; bar: string }> = {
  ok: { label: "Làm thêm", badge: "bg-[#def6e9] text-[#22a06b]", bar: "bg-[#2ee6c9]" },
  mid: { label: "Giữ", badge: "bg-[#fceed6] text-[#b9741a]", bar: "bg-[#d68c1e]" },
  bad: { label: "Dừng", badge: "bg-[#fbe4e2] text-[#d2412f]", bar: "bg-[#d2412f]" },
};

export function VideoBoard() {
  return (
    <div className="rounded-[2rem] border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5 shadow-xl shadow-black/20 sm:p-7">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-sm font-bold text-white">
        <VideoIcon className="size-4 text-[#2ee6c9]" /> Video quảng cáo 7 ngày qua
      </div>
      <div className="mt-4 grid gap-4">
        {ROWS.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="size-11 shrink-0 rounded-xl" style={{ backgroundImage: `linear-gradient(135deg, ${r.from}, ${r.to})` }} aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{r.label}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className={cn("h-full rounded-full transition-all duration-700", VERDICT[r.verdict].bar)} style={{ width: `${r.width}%` }} />
              </div>
            </div>
            <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold", VERDICT[r.verdict].badge)}>{VERDICT[r.verdict].label}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-start gap-2 rounded-2xl bg-[#2ee6c9]/10 p-3.5 text-sm leading-relaxed text-[#e8f4f1]">
        <SparklesIcon className="mt-0.5 size-4 shrink-0 text-[#2ee6c9]" />
        Nên tập trung dòng video <b>khách thật review</b> và <b>không gian, quy trình</b>. Tuần này quay thêm 3 video kiểu này.
      </p>
      <p className="mt-3 text-center text-xs text-[#6e918a]">Thanh: mức ra khách so với tiền chi · số liệu minh hoạ</p>
    </div>
  );
}
