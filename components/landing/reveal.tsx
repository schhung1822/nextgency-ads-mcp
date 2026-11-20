"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Hiện dần khi cuộn tới. Không có JS / reduce-motion thì hiện ngay (SSR luôn hiển thị nội dung). */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    // Phần tử đã nằm trong khung nhìn khi tải trang thì không cần ẩn đi.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: armed && !shown ? undefined : `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        armed && !shown && "translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
