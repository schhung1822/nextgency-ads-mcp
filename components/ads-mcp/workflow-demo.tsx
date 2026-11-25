"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckIcon, EyeIcon, FilmIcon, LightbulbIcon, MessageSquareTextIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClaudeMark } from "@/components/ads-mcp/brand-icons";

/**
 * Minh hoạ quy trình ở hero: Ra lệnh → AI đề xuất kế hoạch → Bấm duyệt → AI tự kiểm tra, lặp vòng.
 * Dừng lại khi cuộn khỏi màn hình hoặc khi người dùng bật "giảm chuyển động".
 */

const MESSAGE = "Chạy quảng cáo tin nhắn cho gói gội đầu dưỡng sinh. Mục tiêu 50 tin nhắn/ngày, 500k/ngày.";

const ORDER = ["typing", "sent", "thinking", "plan", "approve", "watch", "hold", "leave"] as const;
type Phase = (typeof ORDER)[number];
const at = (p: Phase) => ORDER.indexOf(p);

const STEP_FOR: Record<Phase, number> = { typing: 0, sent: 0, thinking: 1, plan: 1, approve: 2, watch: 3, hold: 3, leave: 3 };
const DELAY: Record<Phase, number> = { typing: 500, sent: 500, thinking: 1000, plan: 2300, approve: 1400, watch: 3400, hold: 900, leave: 450 };

const TYPE_MS = 36;
const TYPE_LEAD_MS = 450;

const steps = [
  { icon: MessageSquareTextIcon, title: "Ra lệnh" },
  { icon: SparklesIcon, title: "AI đề xuất" },
  { icon: CheckIcon, title: "Bấm duyệt" },
  { icon: EyeIcon, title: "Tự kiểm tra" },
];

const WATCH_LOG = [
  ["3 giờ", "Tắt mẫu Ưu đãi: tốn tiền, ít tin"],
  ["6 giờ", "Tăng 20% tiền cho video review"],
  ["8 giờ", "52 tin nhắn · 14 lịch hẹn"],
] as const;

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
  const showPlan = p >= at("plan") && p < at("watch");
  const approved = p >= at("approve");
  const showWatch = p >= at("watch") && phase !== "leave";
  const leaving = phase === "leave";

  return (
    <div
      ref={rootRef}
      className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] p-4 shadow-2xl shadow-[#0a5d54]/40 sm:p-5"
      style={{ backgroundImage: "radial-gradient(120% 90% at 85% 8%, #8cf7e4 0%, #2ee6c9 22%, #12ae99 50%, #0a5d54 80%, #083d37 100%)" }}
    >
      <div className={cn("relative overflow-hidden rounded-3xl bg-white text-[#17211f] shadow-2xl shadow-black/30 transition-opacity duration-500", leaving && "opacity-50")}>
          <div className="flex items-center gap-2 border-b border-[#edf0f2] bg-[#f3f8f7] px-4 py-3">
            <span className="flex gap-1.5"><i className="block size-2.5 rounded-full bg-[#d5dbda]" /><i className="block size-2.5 rounded-full bg-[#d5dbda]" /><i className="block size-2.5 rounded-full bg-[#d5dbda]" /></span>
            <span className="ml-1 flex items-center gap-1.5 text-sm font-bold"><ClaudeMark className="size-4" /> Trợ lý AI</span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-[#5c6b68]"><span className="size-2 animate-pulse rounded-full bg-[#e5243b]" />Demo</span>
          </div>

          <div className="relative min-h-[280px] space-y-3 p-5">
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

            {showPlan && (
              <div className="rounded-2xl border border-[#e5eeec] bg-white p-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-bold"><SparklesIcon className="size-4 text-[#0b8f80]" /> Kế hoạch quảng cáo</span>
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors duration-500", approved ? "bg-[#def6e9] text-[#22a06b]" : "bg-[#fceed6] text-[#b9741a]")}>{approved ? "Đã duyệt" : "Chờ duyệt"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0b8f80] px-2.5 py-1 text-[11px] font-bold text-white"><FilmIcon className="size-3" /> Video review</span>
                  <span className="rounded-full bg-[#f3f8f7] px-2.5 py-1 text-[11px] font-semibold text-[#17211f]">Không gian spa</span>
                  <span className="rounded-full bg-[#f3f8f7] px-2.5 py-1 text-[11px] font-semibold text-[#17211f]">Ưu đãi</span>
                </div>
                <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-[#f3f8f7] p-2.5 text-xs leading-relaxed text-[#17211f]">
                  <LightbulbIcon className="mt-0.5 size-3.5 shrink-0 text-[#b9741a]" />
                  Dồn 60% tiền cho <b>video review</b>: đang giữ chân người xem tốt nhất
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#f3f8f7] px-2.5 py-1 text-[11px] font-semibold text-[#17211f]">500k/ngày · Nữ 22-40 · Hà Nội</span>
                  {approved ? (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#22a06b] px-3 py-1.5 text-xs font-bold text-white animate-in fade-in zoom-in-95 duration-300"><CheckIcon className="size-3.5" /> Đã duyệt</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-[#0b8f80] px-3 py-1.5 text-xs font-bold text-white">Duyệt</span>
                  )}
                </div>
              </div>
            )}

            {showWatch && (
              <div className="rounded-2xl border border-[#e5eeec] bg-white p-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="flex items-center gap-1.5 text-xs font-bold text-[#17211f]"><EyeIcon className="size-3.5 text-[#0b8f80]" /> Đã lên chiến dịch. Tôi sẽ quay lại kiểm tra:</p>
                <div className="mt-2.5 space-y-2">
                  {WATCH_LOG.map(([t, d]) => (
                    <div key={t} className="flex items-center gap-2 rounded-lg bg-[#f3f8f7] px-2.5 py-2 text-xs">
                      <span className="shrink-0 rounded-full bg-[#0b8f80]/10 px-2 py-0.5 font-bold text-[#0b8f80]">{t}</span>
                      <span className="flex-1 text-[#17211f]">{d}</span>
                      <CheckIcon className="size-3.5 shrink-0 text-[#22a06b]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>

      <div className="relative mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
        {steps.map(({ icon: Icon, title }, i) => (
          <div
            key={title}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl px-1.5 py-2.5 text-center transition-all duration-500",
              activeStep === i ? "bg-black/40 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.8)]" : "bg-black/15 opacity-70",
            )}
          >
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-500", activeStep === i ? "bg-white text-[#0b8f80]" : "bg-white/15 text-white")}>
              <Icon className="size-3.5" />
            </span>
            <b className="text-[11px] leading-tight font-bold text-white sm:text-xs">{title}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
