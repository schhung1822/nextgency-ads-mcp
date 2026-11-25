"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowRightIcon, SparklesIcon, UserRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookMark, GoogleAdsMark, TikTokMark } from "@/components/ads-mcp/brand-icons";

type RowStatus = "run" | "wait" | "off";

type Row = { name: string; sub?: string; aiTag?: string; status: RowStatus; on: boolean };

type Platform = {
  name: string;
  icon: typeof FacebookMark;
  ask: string;
  reply: string;
  rows: Row[];
};

const platforms: Platform[] = [
  {
    name: "Facebook",
    icon: FacebookMark,
    ask: "Lên 2 mẫu quảng cáo tin nhắn từ bài hôm qua nhé",
    reply: "Đã soạn xong, chờ bạn duyệt",
    rows: [
      { name: "Trị mụn · Tin nhắn", sub: "Đang chạy từ tuần trước", status: "run", on: true },
      { name: "Trị mụn · Mẫu A", aiTag: "AI vừa tạo", status: "wait", on: false },
      { name: "Trị mụn · Mẫu B", aiTag: "AI vừa tạo", status: "wait", on: false },
    ],
  },
  {
    name: "TikTok",
    icon: TikTokMark,
    ask: "Đẩy video review hôm qua thành quảng cáo, mẫu nào tốn tiền thì tắt",
    reply: "Đã lên 1 mẫu, đề xuất tắt 1 mẫu",
    rows: [
      { name: "Video khách review", aiTag: "AI vừa tạo", status: "wait", on: false },
      { name: "Video ưu đãi giá", sub: "Tốn tiền, ít khách", status: "off", on: false },
      { name: "Video trước - sau", sub: "21.300 lượt xem", status: "run", on: true },
    ],
  },
  {
    name: "Google",
    icon: GoogleAdsMark,
    ask: "Chiến dịch trị mụn đang tốt, tăng 20% tiền và nhân bản thêm 1 cái",
    reply: "Đã xong, chờ bạn duyệt",
    rows: [
      { name: "Tìm kiếm · Spa trị mụn", sub: "Ngân sách 300.000đ → 360.000đ", status: "run", on: true },
      { name: "Tìm kiếm · Trị mụn 2", aiTag: "AI nhân bản", status: "wait", on: false },
    ],
  },
];

const statusStyle: Record<RowStatus, { label: string; className: string }> = {
  run: { label: "Đang chạy", className: "bg-[#def6e9] text-[#22a06b]" },
  wait: { label: "Chờ duyệt", className: "bg-[#fceed6] text-[#b9741a]" },
  off: { label: "Đã tắt", className: "bg-[#fbe4e2] text-[#d2412f]" },
};

const AUTOPLAY_MS = 5200;

function ToggleDot({ on }: { on: boolean }) {
  return (
    <span className={cn("relative inline-block h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-500", on ? "bg-[#22a06b]" : "bg-[#c8cbd0]")}>
      <span className={cn("absolute top-[3px] size-4 rounded-full bg-white transition-all duration-500", on ? "right-[3px]" : "left-[3px]")} />
    </span>
  );
}

export function PlatformTabsDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const platform = platforms[active];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % platforms.length);
      setTick((t) => t + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, visible]);

  function select(i: number) {
    setActive(i);
    setTick((t) => t + 1);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="flex flex-wrap justify-center gap-2.5">
          {platforms.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => select(i)}
              className={cn(
                "relative overflow-hidden inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                active === i ? "border-[#2ee6c9] bg-[#2ee6c9]/10 text-white" : "border-white/10 bg-white/5 text-[#96b8b1] hover:text-white",
              )}
            >
              <span className="grid size-7 place-items-center rounded-full bg-white"><p.icon className="size-4" /></span>
              {p.name}
              {active === i && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
                  <motion.span
                    key={tick}
                    className="block h-full bg-[#2ee6c9]"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-center gap-4 lg:grid-cols-[.85fr_auto_1.15fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={`ask-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[#96b8b1]"><UserRoundIcon className="size-4 text-[#2ee6c9]" /> Bạn nhắn</div>
              <p className="mt-3 rounded-2xl rounded-tl-sm bg-[#2ee6c9]/10 px-3.5 py-2.5 text-sm font-medium leading-relaxed text-[#e8f4f1]">{platform.ask}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#2ee6c9]"><SparklesIcon className="size-4" />{platform.reply}</p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block"
          >
            <ArrowRightIcon className="size-5 text-[#2ee6c9]/50" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`win-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden rounded-3xl bg-white text-[#17211f] shadow-xl shadow-black/20"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#e5eeec] bg-[#f3f8f7] px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-7 place-items-center rounded-lg bg-white shadow-sm"><platform.icon className="size-4" /></span>{platform.name}</div>
                <span className="text-xs text-[#5c6b68]">Trình quản lý quảng cáo</span>
              </div>
              <div className="divide-y divide-[#edf0f2] px-4">
                {platform.rows.map((row, i) => (
                  <motion.div
                    key={row.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.09 }}
                    className={cn("flex items-center gap-3 py-3", row.status === "wait" && "-mx-4 bg-[#fff9e1] px-4")}
                  >
                    <ToggleDot on={row.on} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{row.name}</p>
                      {row.sub && <p className="truncate text-xs text-[#5c6b68]">{row.sub}</p>}
                      {row.aiTag && <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#ece6fa] px-2 py-0.5 text-[11px] font-bold text-[#7b5cc4]"><SparklesIcon className="size-2.5" />{row.aiTag}</span>}
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold", statusStyle[row.status].className)}>{statusStyle[row.status].label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="h-3" />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-5 text-center text-xs text-[#6e918a]">Giao diện và số liệu minh hoạ</p>
      </div>
    </MotionConfig>
  );
}
