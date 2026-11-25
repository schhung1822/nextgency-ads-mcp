"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowRightIcon, HeartHandshakeIcon, ShirtIcon, SparklesIcon, UserRoundIcon, UtensilsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookMark } from "@/components/ads-mcp/brand-icons";

type RowStatus = "run" | "wait" | "off";

type Row = { name: string; sub?: string; greet?: string; aiTag?: string; status: RowStatus; on: boolean };

type Industry = {
  name: string;
  icon: typeof ShirtIcon;
  ask: string;
  reply: string;
  foot: string;
  rows: Row[];
};

const industries: Industry[] = [
  {
    name: "Thời trang",
    icon: ShirtIcon,
    ask: "Tối nay 8h live xả hàng, chạy quảng cáo cho buổi live. BST mới 15 ảnh lên hết nhé",
    reply: "Đã soạn xong, chờ bạn duyệt",
    foot: "08:00 mai: mẫu áo khoác ra tin rẻ nhất, đề xuất tăng 20%",
    rows: [
      { name: "Live 20:00 · Xả hàng", aiTag: "AI vừa tạo", status: "wait", on: false },
      { name: "BST mới · 15 mẫu", aiTag: "AI vừa tạo", status: "wait", on: false },
      { name: "Áo khoác dạ · Tin nhắn", sub: "8.500đ mỗi tin nhắn", status: "run", on: true },
    ],
  },
  {
    name: "Nhà hàng",
    icon: UtensilsIcon,
    ask: "Cuối tuần ra món mới, đẩy cho khách quanh quán 3km. Ai nhắn thì hỏi đặt bàn mấy người",
    reply: "Đã soạn xong, chờ bạn duyệt",
    foot: "08:00 mai: 42 tin nhắn đặt bàn, combo trưa tốt nhất",
    rows: [
      { name: "Món mới · Quanh quán 3km", aiTag: "AI vừa tạo", status: "wait", on: false },
      { name: "Đặt bàn · Tin nhắn", greet: "Lời chào: “Anh chị đặt bàn mấy người ạ?”", status: "wait", on: false },
      { name: "Combo trưa văn phòng", sub: "42 tin nhắn hôm qua", status: "run", on: true },
    ],
  },
  {
    name: "Spa",
    icon: HeartHandshakeIcon,
    ask: "Đẩy gói gội đầu dưỡng sinh cho khách nữ 22-40, lời chào hỏi giờ đặt lịch. Mẫu nào tốn tiền thì tắt",
    reply: "Đã soạn, đề xuất tắt 1 mẫu",
    foot: "08:00 mai: 31 tin hỏi đặt lịch, đã tắt 1 mẫu tốn tiền",
    rows: [
      { name: "Gội đầu dưỡng sinh · Nữ 22-40", greet: "Lời chào: “Bạn muốn đặt lịch khung giờ nào ạ?”", status: "wait", on: false },
      { name: "Video khách trải nghiệm", sub: "31 tin nhắn hôm qua", status: "run", on: true },
      { name: "Massage cổ vai gáy · Ưu đãi", sub: "Tốn tiền, ít khách — đã tắt", status: "off", on: false },
    ],
  },
];

const statusStyle: Record<RowStatus, { label: string; className: string }> = {
  run: { label: "Đang chạy", className: "bg-[#def6e9] text-[#22a06b]" },
  wait: { label: "Chờ duyệt", className: "bg-[#fceed6] text-[#b9741a]" },
  off: { label: "Đã tắt", className: "bg-[#fbe4e2] text-[#d2412f]" },
};

const AUTOPLAY_MS = 5600;

function ToggleDot({ on }: { on: boolean }) {
  return (
    <span className={cn("relative inline-block h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-500", on ? "bg-[#22a06b]" : "bg-[#c8cbd0]")}>
      <span className={cn("absolute top-[3px] size-4 rounded-full bg-white transition-all duration-500", on ? "right-[3px]" : "left-[3px]")} />
    </span>
  );
}

export function IndustryTabsDemo() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const industry = industries[active];

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
      setActive((i) => (i + 1) % industries.length);
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
          {industries.map((ind, i) => (
            <button
              key={ind.name}
              type="button"
              onClick={() => select(i)}
              className={cn(
                "relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                active === i ? "border-[#2ee6c9] bg-[#2ee6c9]/10 text-white" : "border-white/10 bg-white/5 text-[#96b8b1] hover:text-white",
              )}
            >
              <span className="grid size-7 place-items-center rounded-full bg-white text-[#0b8f80]"><ind.icon className="size-4" /></span>
              {ind.name}
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
              <p className="mt-3 rounded-2xl rounded-tl-sm bg-[#2ee6c9]/10 px-3.5 py-2.5 text-sm font-medium leading-relaxed text-[#e8f4f1]">{industry.ask}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[#2ee6c9]"><SparklesIcon className="size-4" />{industry.reply}</p>
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
                <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-7 place-items-center rounded-lg bg-white shadow-sm"><FacebookMark className="size-4" /></span>Facebook</div>
                <span className="text-xs text-[#5c6b68]">Trình quản lý quảng cáo</span>
              </div>
              <div className="divide-y divide-[#edf0f2] px-4">
                {industry.rows.map((row, i) => (
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
                      {row.greet && <p className="truncate text-xs italic text-[#5c6b68]">{row.greet}</p>}
                      {row.aiTag && <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-[#ece6fa] px-2 py-0.5 text-[11px] font-bold text-[#7b5cc4]"><SparklesIcon className="size-2.5" />{row.aiTag}</span>}
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold", statusStyle[row.status].className)}>{statusStyle[row.status].label}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-start gap-1.5 border-t border-[#edf0f2] bg-[#f3f8f7] px-4 py-2.5 text-xs font-semibold text-[#0b8f80]">
                <SparklesIcon className="mt-0.5 size-3.5 shrink-0" />
                {industry.foot}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-5 text-center text-xs text-[#6e918a]">Ví dụ minh hoạ</p>
      </div>
    </MotionConfig>
  );
}
