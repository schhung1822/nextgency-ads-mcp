"use client";

/**
 * Hiệu ứng động dùng thư viện React Bits (components/react-bits/*).
 * Tất cả đều tự tôn trọng prefers-reduced-motion.
 */
import Aurora from "@/components/react-bits/Aurora";
import BlurText from "@/components/react-bits/BlurText";
import CountUp from "@/components/react-bits/CountUp";
import GradientText from "@/components/react-bits/GradientText";
import LogoLoop from "@/components/react-bits/LogoLoop";
import ShinyText from "@/components/react-bits/ShinyText";
import { cn } from "@/lib/utils";

/** Nền Aurora cho hero (WebGL, nằm dưới nội dung). */
export function HeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden>
      <Aurora
        colorStops={["#2e7bdf", "#9a63ff", "#5e5cf0"]}
        amplitude={1.1}
        blend={0.6}
        speed={0.7}
        glow={0.7}
        dpr={1.5}
      />
    </div>
  );
}

/** Tiêu đề mục: chữ hiện dần kiểu blur + dòng nhấn màu. */
export function AnimatedHeading({
  title,
  accent,
  dark,
  align = "center",
  className,
}: {
  title: string;
  accent?: string;
  dark?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  const justify = align === "center" ? "justify-center text-center" : "justify-start";
  return (
    <h2
      className={cn(
        "text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]",
        className,
      )}
    >
      <BlurText
        text={title}
        animateBy="words"
        trigger="view"
        color={dark ? "#ffffff" : "#0a1326"}
        className={cn(justify)}
      />
      {accent && (
        <BlurText
          text={accent}
          animateBy="words"
          trigger="view"
          color={dark ? "#c08dfe" : "#5e5cf0"}
          className={cn(justify)}
        />
      )}
    </h2>
  );
}

export function HeroTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h1 className="text-4xl leading-[1.08] font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
      <BlurText text={title} animateBy="words" trigger="load" color="#ffffff" className="" />
      <GradientText colors={["#9ed6ff", "#c08dfe", "#9a63ff", "#9ed6ff"]} animationSpeed={6}>
        {accent}
      </GradientText>
    </h1>
  );
}

export function ShinyBadgeText({ children }: { children: string }) {
  return <ShinyText text={children} color="#ffffffb3" shineColor="#ffffff" speed={3} />;
}

export function Stat({
  to,
  suffix,
  text,
}: {
  to?: number;
  suffix?: string;
  text?: string;
}) {
  return (
    <div className="text-brand-gradient-dark text-3xl font-bold tracking-tight sm:text-4xl">
      {to != null ? <CountUp to={to} suffix={suffix} duration={1.6} /> : text}
    </div>
  );
}

export function PlatformMarquee({ items, label }: { items: string[]; label: string }) {
  return (
    <LogoLoop
      ariaLabel={label}
      logos={items.map((name) => ({
        node: (
          <span className="rounded-full border border-iris/15 bg-white px-5 py-2 text-sm font-semibold whitespace-nowrap text-navy/80 shadow-sm">
            {name}
          </span>
        ),
        title: name,
      }))}
      speed={55}
      gap={14}
      logoHeight={40}
      fadeOut
      fadeOutColor="#ffffff"
      pauseOnHover
    />
  );
}
