"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { G } from "@/lib/global/copy";
import { cn } from "@/lib/utils";

type AppId = "claude" | "chatgpt";
type Decision = "pending" | "approved" | "declined";

/**
 * Khung hội thoại minh hoạ ở hero (bản tiếng Anh): chọn Claude/ChatGPT, câu trả lời có số liệu, biểu đồ theo giờ,
 * nút "Approve" bấm được. Chỉ là minh hoạ — số liệu là ví dụ và không có gì được gửi đi.
 */
export function HeroDemo() {
  const c = G.chat;
  const [app, setApp] = useState<AppId>("claude");
  const [decision, setDecision] = useState<Decision>("pending");

  const note = decision === "approved" ? c.noteApproved : decision === "declined" ? c.noteDeclined : c.note;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-violet/30 blur-3xl" aria-hidden />

      <div aria-label={c.ariaLabel} className="overflow-hidden rounded-2xl border border-white/15 bg-ink/70 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div role="group" aria-label={c.chooser} className="inline-flex rounded-full border border-white/15 bg-white/5 p-0.5">
            {c.apps.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-pressed={app === a.id}
                onClick={() => setApp(a.id as AppId)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  app === a.id ? "bg-white text-navy" : "text-white/70 hover:text-white",
                )}
              >
                <span className="size-2 rounded-full" style={{ background: a.dot }} />
                {a.label}
              </button>
            ))}
          </div>
          <span className="ml-auto font-mono text-[11px] text-white/45">{c.time}</span>
        </div>

        <div className="grid gap-3 p-4 text-sm">
          <div
            className={cn(
              "justify-self-end rounded-2xl rounded-br-sm px-4 py-2.5 font-medium text-white",
              app === "claude" ? "bg-[#CC785C]" : "bg-white/15",
            )}
          >
            {c.question}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span>{c.toolLabel}</span>
            {c.platforms.map((p, i) => (
              <span
                key={p}
                className="animate-in fade-in zoom-in-90 fill-mode-both inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-white/85 motion-reduce:animate-none"
                style={{ animationDelay: `${(i + 1) * 250}ms`, animationDuration: "500ms" }}
              >
                <CheckIcon className="size-3 text-emerald-300" strokeWidth={3} />
                {p}
              </span>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <strong className="text-base font-semibold text-white">{c.answerTitle}</strong>
              <small className="text-xs text-white/50">{c.answerMeta}</small>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {c.kpis.map((k) => (
                <div key={k.label} className="rounded-xl border border-white/10 bg-ink/40 px-2.5 py-2">
                  <span className="block text-[11px] text-white/55">{k.label}</span>
                  <b className="mt-0.5 block font-mono text-lg leading-tight text-white tabular-nums">{k.value}</b>
                  {k.delta && <em className="text-[10px] font-semibold not-italic text-emerald-300">{k.delta}</em>}
                </div>
              ))}
            </div>

            <div className="mt-3 flex h-14 items-end gap-1.5 px-0.5" aria-hidden>
              {c.hours.map((h, i) => (
                <i
                  key={i}
                  className={cn(
                    "bar-rise flex-1 rounded-t-[5px] rounded-b-[2px]",
                    i === c.hours.length - 1 ? "bg-linear-to-t from-sky to-violet" : "bg-white/20",
                  )}
                  style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-white/40" aria-hidden>
              {c.hourLabels.map((l) => <span key={l}>{l}</span>)}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs text-white/85">
                <span className="block font-mono text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">{c.best.tag}</span>
                <b className="font-semibold text-white">{c.best.name}</b> · {c.best.value}
              </div>
              <div className="rounded-xl bg-red-400/10 px-3 py-2 text-xs text-white/85">
                <span className="block font-mono text-[10px] font-semibold tracking-wider text-red-300 uppercase">{c.pause.tag}</span>
                <b className="font-semibold text-white">{c.pause.name}</b> · {c.pause.value}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 border-t border-dashed border-white/15 pt-3">
            <button
              type="button"
              disabled={decision !== "pending"}
              onClick={() => setDecision("approved")}
              className="bg-brand-button rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {decision === "approved" ? c.approved : c.approve}
            </button>
            <button
              type="button"
              disabled={decision !== "pending"}
              onClick={() => setDecision("declined")}
              className="rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
            >
              {c.decline}
            </button>
            <small role="status" className="text-[11px] text-white/50">{note}</small>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {c.timeline.map((t, i) => (
          <div key={t.text} className={cn("border-t-2 pt-2 text-xs text-white/60", i === c.timeline.length - 1 ? "border-sky" : "border-white/15")}>
            <b className="block font-mono text-[13px] font-semibold text-white">{t.time}</b>
            {t.text}
          </div>
        ))}
      </div>
      <p className="mt-2 text-right text-[11px] text-white/45">{c.disclaimer}</p>
    </div>
  );
}
