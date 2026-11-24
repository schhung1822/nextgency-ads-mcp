"use client";

import Aurora from "@/components/react-bits/Aurora";
import BlurText from "@/components/react-bits/BlurText";
import GradientText from "@/components/react-bits/GradientText";
import ShinyText from "@/components/react-bits/ShinyText";

/** Chuyển động hero cùng hệ React Bits đang dùng cho trang chủ, đổi sang bảng màu Ads MCP. */
export function AdsHeroAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden>
      <Aurora colorStops={["#0b8f80", "#2ee6c9", "#0a3f48"]} amplitude={1.05} blend={0.62} speed={0.65} glow={0.72} dpr={1.5} />
    </div>
  );
}

export function AdsHeroTitle() {
  return (
    <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
      <BlurText text="Ra lệnh quảng cáo." animateBy="words" trigger="load" color="#ffffff" className="" />
      <GradientText colors={["#2ee6c9", "#b6fff0", "#16c4ac", "#2ee6c9"]} animationSpeed={6}>
        AI lo phần còn lại.
      </GradientText>
    </h1>
  );
}

export function AdsSectionTitle({ title, accent }: { title: string; accent?: string }) {
  return (
    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
      <BlurText text={title} animateBy="words" trigger="view" color="#ffffff" className="justify-center text-center" />
      {accent && <BlurText text={accent} animateBy="words" trigger="view" color="#2ee6c9" className="justify-center text-center" />}
    </h2>
  );
}

export function AdsShinyBadge({ children }: { children: string }) {
  return <ShinyText text={children} color="#2ee6c9cc" shineColor="#ffffff" speed={3} />;
}
