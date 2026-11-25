"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEP_MS = 3000;

export function PipelineStepper({ nodes }: { nodes: { title: string; tag: string; tagBg: string; tagColor: string; preview: React.ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setInterval(() => setActive((i) => (i + 1) % nodes.length), reduce ? STEP_MS * 1.6 : STEP_MS);
    return () => clearInterval(id);
  }, [visible, nodes.length]);

  return (
    <div ref={rootRef}>
      <div className="relative mx-auto mb-10 flex max-w-2xl items-center justify-between">
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/10" />
        <div
          className="absolute inset-y-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#2ee6c9] transition-[width] duration-700 ease-out"
          style={{ width: `${(active / (nodes.length - 1)) * 100}%` }}
        />
        {nodes.map((node, i) => (
          <span
            key={node.title}
            className={cn(
              "relative grid size-9 place-items-center rounded-full bg-[#0a1a17] text-xs font-black transition-all duration-500",
              i < active && "bg-[#2ee6c9] text-[#06110f]",
              i === active && "border-2 border-[#2ee6c9] text-[#2ee6c9] shadow-[0_0_0_4px_rgba(46,230,201,.15)]",
              i > active && "border border-white/15 text-[#6e918a]",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {nodes.map(({ title, tag, tagBg, tagColor, preview }, i) => (
          <article
            key={title}
            className={cn(
              "h-full rounded-3xl border p-4 transition-all duration-500",
              i === active ? "border-[#2ee6c9]/60 bg-[#0e2824] shadow-xl shadow-[#2ee6c9]/15 -translate-y-1" : "border-[#2ee6c9]/15 bg-[#0e2824]/70",
            )}
          >
            {preview}
            <h3 className="mt-4 font-bold text-white">{title}</h3>
            <span className="mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: tagBg, color: tagColor }}>{tag}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
