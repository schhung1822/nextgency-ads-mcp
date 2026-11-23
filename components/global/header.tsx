"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRightIcon, MenuIcon } from "lucide-react";
import StarBorder from "@/components/react-bits/StarBorder";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { G } from "@/lib/global/copy";
import { cn } from "@/lib/utils";

/** Cuộn tới khung thanh toán (#buy). */
export function BuyLink({ children, className, headerStyle = false }: { children: React.ReactNode; className?: string; headerStyle?: boolean }) {
  return (
    <StarBorder
      as="a"
      href="#buy"
      color="#9ed6ff"
      trailColor="#c08dfe"
      radius={999}
      duration={4}
      thickness={headerStyle ? 1.5 : undefined}
      backgroundColor="linear-gradient(90deg,#24388e,#5e5cf0 55%,#8f5bff)"
      textColor="#ffffff"
      className={cn(
        headerStyle &&
          "group gap-1.5! px-4! py-2! text-sm font-semibold shadow-[0_6px_24px_-6px_rgba(109,101,255,0.85)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px sm:px-5!",
        className,
      )}
    >
      {children}
    </StarBorder>
  );
}

export function GlobalHeader({ hasDemo }: { hasDemo: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const n = G.nav;
  const items = hasDemo ? [n.demo, ...n.items] : n.items;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" aria-label={n.home} className="shrink-0">
          <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto sm:h-7" />
        </a>

        <nav aria-label={n.label} className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <a key={it.href} href={it.href} className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              {it.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <BuyLink headerStyle className="max-[399px]:hidden">
            {n.cta}
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </BuyLink>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10 hover:text-white md:hidden" aria-label={n.openMenu} />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-ink text-white">
              <SheetHeader>
                <SheetTitle className="text-white">{n.menu}</SheetTitle>
              </SheetHeader>
              <nav aria-label={n.label} className="grid gap-1 px-4">
                {[...items, { href: "#buy", label: n.cta }].map((it) => (
                  <SheetClose key={it.href} render={<a href={it.href} />} className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10 hover:text-white">
                    {it.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
