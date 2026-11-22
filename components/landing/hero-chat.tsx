"use client";

import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpIcon, CheckIcon, Loader2Icon } from "lucide-react";
import type { LandingDict } from "@/lib/landing";
import type { ChatBody as Body, ChatScenario as Scenario } from "@/lib/landing/types";
import { cn } from "@/lib/utils";

/**
 * Khung chat minh hoạ ở hero — tự chạy như một đoạn demo:
 *   gõ câu hỏi vào ô chat → gửi → AI "đang tìm" → hiện từng bước đọc dữ liệu → trả lời từng chữ,
 *   thanh số liệu chạy ra → (có câu hỏi xin xác nhận thì tự bấm "Đồng ý") → sang câu hỏi tiếp theo, lặp lại.
 * Bấm vào gợi ý bên dưới để nhảy tới câu hỏi đó. Người đặt "giảm chuyển động" thì hiện sẵn kết quả, không gõ/chạy.
 * Toàn bộ số liệu chỉ là minh hoạ.
 *
 * Cách làm: một máy trạng thái (phase + bộ đếm n); mỗi lần trạng thái đổi, đặt đúng một timer để tiến tới bước kế.
 */

type Chat = LandingDict["hero"]["chat"];

/* ------------------------------------------------------------- máy trạng thái */

const ORDER = ["typing", "sent", "thinking", "tools", "answer", "body", "ask", "pressed", "confirmed", "hold", "leave"] as const;
type Phase = (typeof ORDER)[number];
const at = (p: Phase) => ORDER.indexOf(p);

type State = { sc: number; phase: Phase; n: number };
type Action = { type: "advance"; reduce: boolean; scenarios: Scenario[] } | { type: "jump"; sc: number } | { type: "set"; n: number };

// Gõ chữ / trả lời từng chữ tính theo THỜI GIAN THỰC (không dùng timer từng ký tự) để tốc độ không phụ thuộc máy nhanh hay chậm.
const TYPE_MS = 42; // mỗi ký tự khi "gõ" câu hỏi
const WORD_MS = 70; // mỗi từ khi AI "trả lời"
const TYPE_LEAD_MS = 500; // dừng một nhịp trước khi bắt đầu gõ

const wordsOf = (s: string) => s.split(" ");
const itemsOf = (b: Body) => (b.kind === "rank" ? b.rows.length + 1 : b.kind === "split" ? 2 : b.items.length);

function reducer(s: State, a: Action): State {
  if (a.type === "jump") return { sc: a.sc, phase: "typing", n: 0 };
  if (a.type === "set") return { ...s, n: a.n };
  const SCENARIOS = a.scenarios;
  const sc = SCENARIOS[s.sc];
  if (a.reduce) {
    // Giảm chuyển động: hiện sẵn kết quả đầy đủ, chỉ đổi câu hỏi sau mỗi vài giây.
    return s.phase === "hold" ? { sc: (s.sc + 1) % SCENARIOS.length, phase: "hold", n: 0 } : { ...s, phase: "hold", n: 0 };
  }
  switch (s.phase) {
    case "typing":
      return s.n < sc.question.length ? { ...s, n: s.n + 1 } : { ...s, phase: "sent", n: 0 };
    case "sent":
      return { ...s, phase: "thinking", n: 0 };
    case "thinking":
      return { ...s, phase: "tools", n: 1 };
    case "tools":
      return s.n <= sc.tools.length ? { ...s, n: s.n + 1 } : { ...s, phase: "answer", n: 0 };
    case "answer":
      return s.n < wordsOf(sc.intro).length ? { ...s, n: s.n + 1 } : { ...s, phase: "body", n: 0 };
    case "body":
      return s.n < itemsOf(sc.body) ? { ...s, n: s.n + 1 } : { ...s, phase: sc.body.kind === "split" ? "ask" : "hold", n: 0 };
    case "ask":
      return { ...s, phase: "pressed" };
    case "pressed":
      return { ...s, phase: "confirmed" };
    case "confirmed":
    case "hold":
      return { ...s, phase: "leave" };
    case "leave":
      return { sc: (s.sc + 1) % SCENARIOS.length, phase: "typing", n: 0 };
  }
}

/** Thời gian chờ (ms) trước khi tiến tới bước kế. */
function delay(s: State, reduce: boolean): number {
  if (reduce) return s.phase === "hold" ? 8000 : 0;
  switch (s.phase) {
    case "typing":
      return 600; // gõ xong, dừng một nhịp rồi mới bấm gửi (đang gõ dở thì do ticker tính theo thời gian, không qua đây)
    case "sent":
      return 450;
    case "thinking":
      return 950;
    case "tools":
      return 800;
    case "answer":
      return 350; // nói xong câu dẫn, nghỉ một nhịp rồi mới hiện số liệu
    case "body":
      return 450;
    case "ask":
      return 2100;
    case "pressed":
      return 700;
    case "confirmed":
      return 3300;
    case "hold":
      return 3800;
    case "leave":
      return 450;
  }
}

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ giao diện */

export function HeroChat({ t }: { t: Chat }) {
  const SCENARIOS = t.scenarios;
  const reduce = useSyncExternalStore(subscribeMotion, getMotion, () => false);
  const [s, dispatch] = useReducer(reducer, { sc: 0, phase: "typing", n: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const phaseStart = useRef({ key: "", t: 0 });
  const [visible, setVisible] = useState(true);

  // Cuộn khỏi màn hình thì tạm dừng demo cho đỡ tốn pin; cuộn lại thì chạy tiếp.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const sc = SCENARIOS[s.sc];
    const typing = s.phase === "typing" && s.n < sc.question.length;
    const answering = s.phase === "answer" && s.n < wordsOf(sc.intro).length;

    if (!reduce && (typing || answering)) {
      const total = typing ? sc.question.length : wordsOf(sc.intro).length;
      const step = typing ? TYPE_MS : WORD_MS;
      const key = `${s.sc}:${s.phase}`;
      if (phaseStart.current.key !== key) phaseStart.current = { key, t: performance.now() + (typing ? TYPE_LEAD_MS : 0) };
      let raf = 0;
      const tick = (now: number) => {
        const n = Math.min(total, Math.floor((now - phaseStart.current.t) / step));
        if (n > s.n) dispatch({ type: "set", n });
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    const t = setTimeout(() => dispatch({ type: "advance", reduce, scenarios: SCENARIOS }), delay(s, reduce));
    return () => clearTimeout(t);
  }, [s, reduce, visible, SCENARIOS]);

  const sc = SCENARIOS[s.sc];
  const p = at(s.phase);
  const typed = s.phase === "typing" ? sc.question.slice(0, s.n) : "";
  const readyToSend = s.phase === "typing" && s.n >= sc.question.length;

  const toolCount = p > at("tools") ? sc.tools.length : s.phase === "tools" ? Math.min(s.n, sc.tools.length) : 0;
  const introWords = p > at("answer") ? wordsOf(sc.intro).length : s.phase === "answer" ? s.n : 0;
  const shownItems = p > at("body") ? itemsOf(sc.body) : s.phase === "body" ? s.n : 0;

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-violet/30 blur-3xl" aria-hidden />

      {/* Khung chat chỉ để minh hoạ; người dùng đọc chữ thay thế bên dưới */}
      <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-white/15 bg-ink/70 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <span className="bg-brand-button grid size-9 place-items-center rounded-full font-archivo text-xs font-bold text-white">AI</span>
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-white">{t.team}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/55">
              <span className="relative flex size-1.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              <span className="truncate">{t.status}</span>
            </p>
          </div>
          <span className="ml-auto hidden shrink-0 text-[10px] tracking-wider whitespace-nowrap text-white/40 uppercase sm:inline">{t.badge}</span>
        </div>

        {/* Vùng hội thoại: nội dung mới nằm dưới, nội dung cũ trôi lên và mờ dần ở mép trên như chat thật */}
        <div className="relative h-[23rem] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-linear-to-b from-[#0d0d24] to-transparent" />
          <div
            key={s.sc}
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-4 text-sm transition-opacity duration-300",
              s.phase === "leave" ? "opacity-0" : "opacity-100",
            )}
          >
            <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-2.5 text-white/85 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {t.greeting}
            </div>

            {p >= at("sent") && (
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-iris/90 px-4 py-2.5 text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
                {sc.question}
              </div>
            )}

            {s.phase === "thinking" && (
              <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-3.5 py-3 animate-in fade-in duration-200">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}

            {toolCount > 0 && (
              <div className="grid gap-1.5">
                {sc.tools.slice(0, toolCount).map(([brand, text], i) => {
                  const running = s.phase === "tools" && i === s.n - 1;
                  return (
                    <div key={brand} className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 animate-in fade-in slide-in-from-bottom-1 duration-300">
                      <span className={cn("grid size-5 shrink-0 place-items-center rounded-md", running ? "bg-white/10 text-white/70" : "bg-sky/20 text-sky")}>
                        {running ? <Loader2Icon className="size-3 animate-spin" /> : <CheckIcon className="size-3" strokeWidth={3} />}
                      </span>
                      <span><b className="font-semibold text-white">{brand}</b> · {text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {introWords > 0 && (
              <div className="grid max-w-[94%] gap-3 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3 text-white/90 animate-in fade-in slide-in-from-bottom-1 duration-300">
                <p>{wordsOf(sc.intro).slice(0, introWords).join(" ")}</p>
                <Answer body={sc.body} shown={shownItems} phase={s.phase} t={t} />
              </div>
            )}
          </div>
        </div>

        {/* Ô nhập: câu hỏi được "gõ" vào đây rồi gửi đi */}
        <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-2xl bg-white/5 px-4 text-[13px] leading-snug text-white">
            <span className="line-clamp-2">
              {typed ? (
                <>
                  {typed}
                  <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-white" />
                </>
              ) : (
                <span className="text-white/35">{t.placeholder}</span>
              )}
            </span>
          </div>
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-200",
              readyToSend ? "bg-brand-button scale-110 text-white" : "bg-white/10 text-white/40",
            )}
          >
            <ArrowUpIcon className="size-4" />
          </span>
        </div>
      </div>

      <p className="sr-only">{t.srSummary}</p>
      <p className="mt-2 text-center text-[11px] text-white/45">{t.note}</p>

      <div className="mt-3">
        <p className="mb-2 text-center text-xs text-white/55">{t.asksLabel}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SCENARIOS.map((it, i) => (
            <button
              key={it.chip}
              type="button"
              aria-pressed={s.sc === i}
              onClick={() => dispatch({ type: "jump", sc: i })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                s.sc === i ? "border-transparent bg-white text-navy" : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15",
              )}
            >
              {it.chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Answer({ body, shown, phase, t }: { body: Body; shown: number; phase: Phase; t: Chat }) {
  const p = at(phase);
  const enter = "animate-in fade-in slide-in-from-bottom-1 duration-300";

  if (body.kind === "rank") {
    const max = Math.max(...body.rows.map((r) => r.value));
    return (
      <div className="grid gap-2.5">
        {body.rows.slice(0, shown).map((r, i) => (
          <div key={r.label} className={cn("grid gap-1", enter)}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-2 text-white">
                <span className="grid size-5 place-items-center rounded-full bg-white/10 text-[10px] font-bold">{i + 1}</span>
                {r.label}
                {r.tag === "top" && <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">{t.top}</span>}
                {r.tag === "stop" && <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">{t.stop}</span>}
              </span>
              <b className="text-white">{r.value} {t.unit}</b>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn("bar-grow h-full rounded-full", r.tag === "stop" ? "bg-amber-300/70" : "bg-linear-to-r from-sky to-violet")}
                style={{ width: `${Math.max(6, Math.round((r.value / max) * 100))}%` }}
              />
            </div>
          </div>
        ))}
        {shown > body.rows.length && <p className={cn("text-xs text-white/60", enter)}>{body.hint}</p>}
      </div>
    );
  }

  if (body.kind === "split") {
    return (
      <div className="grid gap-3">
        {shown >= 1 && (
          <div className={enter}>
            <div className="flex h-3 overflow-hidden rounded-full bg-white/10">
              <div className="bar-grow bg-linear-to-r from-sky to-violet" style={{ width: `${body.good.pct}%` }} />
              <div className="flex-1 bg-amber-300/80" />
            </div>
            <div className="mt-1.5 flex justify-between text-xs">
              <span className="text-white"><b>{body.good.value}</b> <span className="text-white/60">{body.good.label}</span></span>
              <span className="text-white"><b>{body.bad.value}</b> <span className="text-white/60">{body.bad.label}</span></span>
            </div>
          </div>
        )}
        {shown >= 2 && <p className={cn("text-xs text-white/60", enter)}>{body.note}</p>}

        {p >= at("ask") && p < at("confirmed") && (
          <div className={cn("grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3", enter)}>
            <p className="text-xs font-medium text-white">{body.ask}</p>
            <div className="flex gap-2">
              <span
                className={cn(
                  "bg-brand-button rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200",
                  phase === "pressed" && "scale-95 ring-2 ring-white/60 brightness-125",
                )}
              >
                {t.yes}
              </span>
              <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80">{t.later}</span>
            </div>
          </div>
        )}
        {p >= at("confirmed") && (
          <p className={cn("rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-xs text-emerald-100", enter)}>{body.done}</p>
        )}
      </div>
    );
  }

  return (
    <ul className="grid gap-2 text-xs leading-relaxed text-white/80">
      {body.items.slice(0, shown).map((t) => (
        <li key={t} className={cn("flex gap-2", enter)}>
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
