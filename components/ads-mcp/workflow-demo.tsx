"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BarChart3Icon, BotIcon, CheckIcon, MessageSquareTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaudeMark, FacebookMark } from "@/components/ads-mcp/brand-icons";

/**
 * Minh hoạ quy trình "cách hoạt động" tự chạy theo vòng lặp: gõ câu lệnh → AI soạn → bạn duyệt → có báo cáo.
 * Dừng lại khi cuộn khỏi màn hình hoặc khi người dùng bật "giảm chuyển động".
 */

const MESSAGE = "Lên quảng cáo tin nhắn từ bài hôm qua, 200k/ngày nhé";

const ORDER = ["typing", "sent", "thinking", "draft", "approve", "report", "hold", "leave"] as const;
type Phase = (typeof ORDER)[number];
const at = (p: Phase) => ORDER.indexOf(p);

const STEP_FOR: Record<Phase, number> = { typing: 0, sent: 0, thinking: 1, draft: 1, approve: 2, report: 3, hold: 3, leave: 3 };
const DELAY: Record<Phase, number> = { typing: 500, sent: 500, thinking: 1000, draft: 1700, approve: 1900, report: 2700, hold: 900, leave: 450 };

const TYPE_MS = 36;
const TYPE_LEAD_MS = 450;

const steps = [
  { icon: MessageSquareTextIcon, title: "Bạn nhắn việc" },
  { icon: BotIcon, title: "AI soạn quảng cáo" },
  { icon: CheckIcon, title: "Bạn duyệt là chạy" },
  { icon: BarChart3Icon, title: "8h sáng có báo cáo" },
];

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function WorkflowDemo() {
  const reduce = useSyncExternalStore(subscribeMotion, getMotion, () => false);
  const [phase, setPhase] = useState<Phase>("typing");
  const [n, setN] = useState(0);
  const [cycle, setCycle] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const phaseStart = useRef({ key: "", t: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const typing = phase === "typing" && !reduce && n < MESSAGE.length;

    if (typing) {
      const key = `typing-${cycle}`;
      if (phaseStart.current.key !== key) phaseStart.current = { key, t: performance.now() + TYPE_LEAD_MS };
      let raf = 0;
      const tick = (now: number) => {
        const next = Math.min(MESSAGE.length, Math.floor((now - phaseStart.current.t) / TYPE_MS));
        if (next > n) setN(next);
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const timer = setTimeout(() => {
      if (phase === "leave") {
        setCycle((c) => c + 1);
        setN(0);
        setPhase("typing");
        return;
      }
      setPhase(ORDER[at(phase) + 1]);
    }, DELAY[phase]);
    return () => clearTimeout(timer);
  }, [phase, n, reduce, visible, cycle]);

  const p = at(phase);
  const activeStep = STEP_FOR[phase];
  const typedText = phase === "typing" ? (reduce ? MESSAGE : MESSAGE.slice(0, n)) : "";
  const showSent = p >= at("sent");
  const showThinking = phase === "thinking";
  const showDraft = p >= at("draft");
  const approved = p >= at("approve");
  const showReport = p >= at("report") && phase !== "leave";
  const leaving = phase === "leave";

  return (
    <div ref={rootRef} className="grid items-center gap-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {steps.map(({ icon: Icon, title }, i) => (
          <div
            key={title}
            className={cn(
              "flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-500",
              activeStep === i ? "border-[#2ee6c9] bg-[#2ee6c9]/10 shadow-[0_0_0_1px_rgba(46,230,201,.15)]" : "border-white/10 bg-white/5",
            )}
          >
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-500", activeStep === i ? "bg-[#2ee6c9] text-[#06110f]" : "bg-[#2ee6c9]/10 text-[#2ee6c9]")}>
              <Icon className="size-5" />
            </span>
            <span className="font-bold text-white">{title}</span>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-lg">
        <div className={cn("relative overflow-hidden rounded-3xl bg-white text-[#17211f] shadow-2xl shadow-black/20 transition-opacity duration-500", leaving && "opacity-50")}>
          <div className="flex items-center gap-2 border-b border-[#edf0f2] bg-[#f3f8f7] px-4 py-3">
            <span className="flex gap-1.5"><i className="block size-2.5 rounded-full bg-[#d5dbda]" /><i className="block size-2.5 rounded-full bg-[#d5dbda]" /><i className="block size-2.5 rounded-full bg-[#d5dbda]" /></span>
            <span className="ml-1 flex items-center gap-1.5 text-sm font-bold"><ClaudeMark className="size-4" /> Trợ lý AI</span>
          </div>

          <div className="relative min-h-[236px] space-y-3 p-5">
            {showReport && (
              <div className="absolute inset-x-4 top-3 z-10 flex items-center gap-2.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_14px_34px_rgba(0,0,0,.2)] animate-in fade-in slide-in-from-top-4 duration-500">
                <ClaudeMark className="size-6 shrink-0" />
                <div className="text-xs"><b className="block text-[#17211f]">08:00 · Báo cáo hôm qua</b><span className="text-[#5c6b68]">128 tin nhắn · mẫu A tốt nhất</span></div>
              </div>
            )}

            {(typedText || showSent) && (
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0b8f80] px-3.5 py-2.5 text-sm font-medium leading-relaxed text-white">
                  {showSent ? MESSAGE : typedText}
                  {phase === "typing" && !reduce && <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-white/80" />}
                </p>
              </div>
            )}

            {showThinking && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-[#f3f8f7] px-3.5 py-3 animate-in fade-in duration-200">
                {[0, 150, 300].map((d) => <span key={d} className="size-1.5 animate-bounce rounded-full bg-[#9aa7a4]" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            )}

            {showDraft && (
              <div className="rounded-2xl border border-[#e5eeec] bg-white p-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-bold"><FacebookMark className="size-5" /> Quảng cáo tin nhắn</span>
                  <span className={cn("relative inline-block h-[22px] w-[38px] rounded-full transition-colors duration-500", approved ? "bg-[#22a06b]" : "bg-[#c8cbd0]")}>
                    <span className={cn("absolute top-[3px] size-4 rounded-full bg-white transition-all duration-500", approved ? "right-[3px]" : "left-[3px]")} />
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{["200.000đ/ngày", "Nữ 25-45 · Hà Nội", "Có lời chào"].map((c) => <span key={c} className="rounded-full bg-[#f3f8f7] px-2.5 py-1 text-[11px] font-semibold text-[#17211f]">{c}</span>)}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors duration-500", approved ? "bg-[#def6e9] text-[#22a06b]" : "bg-[#fceed6] text-[#b9741a]")}>{approved ? "Đang chạy" : "Chờ duyệt"}</span>
                  {approved ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22a06b] px-3 py-1.5 text-xs font-bold text-white animate-in fade-in zoom-in-95 duration-300"><CheckIcon className="size-3.5" /> Đã duyệt</span>
                  ) : (
                    <span className="rounded-full bg-[#0b8f80] px-3 py-1.5 text-xs font-bold text-white">Duyệt chạy</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-[#6e918a]">Minh hoạ quy trình, số liệu chỉ để tham khảo</p>
      </div>
    </div>
  );
}
