"use client";

import { useEffect, useState } from "react";
import { BanIcon, CheckIcon, ClockIcon, CreditCardIcon, LayersIcon, MinusIcon, SearchIcon, UserCheckIcon, VideoIcon } from "lucide-react";
import type { LandingDict } from "@/lib/landing";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./use-reduced-motion";

const CHANGE_ICONS = [CreditCardIcon, BanIcon, VideoIcon, SearchIcon, UserCheckIcon, LayersIcon];
const AUTO_MS = 4500;

/** Khối "Trước / Sau khi có MCP": tự đổi qua lại cho tới khi người xem bấm chọn. */
export function BeforeAfter({ t }: { t: LandingDict["compare"] }) {
  const reduced = useReducedMotion();
  const [choice, setChoice] = useState<boolean | null>(null);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (choice !== null || reduced) return;
    const id = setInterval(() => setAuto((v) => !v), AUTO_MS);
    return () => clearInterval(id);
  }, [choice, reduced]);

  const on = choice ?? (reduced ? true : auto);
  const brightPeople = on ? 14 : 7;
  const goodPct = on ? 86 : 55;

  return (
    <div className="grid gap-8">
      <div className="flex justify-center">
        <div role="group" aria-label={t.group} className="inline-flex gap-1 rounded-full border bg-white p-1.5 shadow-lg shadow-iris/10">
          <button
            type="button"
            onClick={() => setChoice(false)}
            aria-pressed={!on}
            className={cn(
              "h-11 cursor-pointer rounded-full px-5 text-sm font-semibold transition-all duration-300 sm:text-base",
              on ? "text-muted-foreground hover:text-navy" : "bg-navy text-white shadow-md",
            )}
          >
            {t.before}
          </button>
          <button
            type="button"
            onClick={() => setChoice(true)}
            aria-pressed={on}
            className={cn(
              "h-11 cursor-pointer rounded-full px-5 text-sm font-semibold transition-all duration-300 sm:text-base",
              on ? "bg-brand-button text-white shadow-md shadow-iris/30" : "text-muted-foreground hover:text-navy",
            )}
          >
            {t.after}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* trái: hình ảnh lớn */}
        <div className="grid content-start gap-7 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 text-[15px] font-semibold text-navy">{t.customersLabel}</span>
              <span
                className={cn(
                  "text-3xl font-black tracking-tight whitespace-nowrap transition-colors duration-500 sm:text-4xl",
                  on ? "text-brand-gradient-dark" : "text-navy/60",
                )}
              >
                {on ? t.customers.after : t.customers.before}
              </span>
            </div>
            <div className="grid grid-cols-8 gap-2" aria-hidden>
              {Array.from({ length: 16 }, (_, k) => (
                <svg key={k} viewBox="0 0 24 24" className="h-auto w-full">
                  <circle cx="12" cy="7.5" r="4.5" className={cn("transition-[fill] duration-500", k < brightPeople ? "fill-iris" : "fill-[#dfe5f5]")} />
                  <path d="M3 23c1-6 4.6-9 9-9s8 3 9 9z" className={cn("transition-[fill] duration-500", k < brightPeople ? "fill-iris" : "fill-[#dfe5f5]")} />
                </svg>
              ))}
            </div>
          </div>

          <div className="grid gap-2.5">
            <span className="text-[15px] font-semibold text-navy">{t.moneyLabel}</span>
            <div className="flex h-11 overflow-hidden rounded-xl bg-[repeating-linear-gradient(135deg,#fef3c7_0_8px,#fde68a_8px_16px)]">
              <div
                className="bg-brand-button flex items-center pl-4 text-sm font-bold whitespace-nowrap text-white transition-[width] duration-900 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{ width: `${goodPct}%` }}
              >
                {goodPct}%
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><span className="bg-brand-button size-2.5 rounded-full" aria-hidden />{t.good}</span>
              <span className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-amber-300" aria-hidden />{t.waste}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-secondary/70 p-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-iris shadow-sm" aria-hidden>
              <ClockIcon className="size-6" />
            </span>
            <div className="grid gap-0.5">
              <span className="text-sm text-muted-foreground">{t.hoursLabel}</span>
              <span className="text-2xl font-bold text-navy">{on ? t.hours.after : t.hours.before}</span>
            </div>
          </div>
        </div>

        {/* phải: sáu thay đổi */}
        <ul className="grid rounded-3xl border bg-white px-5 py-2 shadow-sm sm:px-7">
          {t.changes.map((ch, i) => {
            const Icon = CHANGE_ICONS[i] ?? LayersIcon;
            return (
              <li key={ch.title} className={cn("flex items-center gap-4 py-3.5", i < t.changes.length - 1 && "border-b")}>
                <span
                  className={cn(
                    "relative grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-500",
                    on ? "bg-secondary text-iris" : "bg-muted text-muted-foreground/60",
                  )}
                  aria-hidden
                >
                  <Icon className="size-6" />
                  <span
                    className={cn(
                      "absolute -right-1 -bottom-1 grid size-5 place-items-center rounded-full border-2 border-white text-white transition-colors duration-500",
                      on ? "bg-iris" : "bg-slate-400",
                    )}
                  >
                    {on ? <CheckIcon className="size-2.5" strokeWidth={4} /> : <MinusIcon className="size-2.5" strokeWidth={4} />}
                  </span>
                </span>
                <span className="grid min-w-0 gap-0.5">
                  <span className="font-semibold text-navy">{ch.title}</span>
                  {on ? (
                    <span key="after" className="animate-in fade-in slide-in-from-bottom-1 text-[15px] leading-snug font-medium text-iris duration-300">{ch.after}</span>
                  ) : (
                    <span key="before" className="animate-in fade-in slide-in-from-bottom-1 text-[15px] leading-snug text-muted-foreground duration-300">{ch.before}</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
