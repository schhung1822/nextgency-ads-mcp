"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRightIcon, GlobeIcon, MenuIcon, SparklesIcon } from "lucide-react";
import { BuyHeaderButton } from "@/components/checkout/checkout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { LandingDict } from "@/lib/landing";
import { cn } from "@/lib/utils";

type Nav = LandingDict["nav"];

export function SiteHeader({ t, switchHref }: { t: Nav; switchHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" aria-label={t.home} className="shrink-0">
          <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto sm:h-7" />
        </a>

        <nav aria-label={t.label} className="hidden items-center gap-1 xl:flex">
          {t.items.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={switchHref}
            hrefLang={t.switchTo.label.toLowerCase()}
            aria-label={t.switchTo.aria}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-3 text-xs font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            <GlobeIcon className="size-3.5" aria-hidden />
            {t.switchTo.label}
          </a>
          <BuyHeaderButton className="max-[399px]:hidden">
            <SparklesIcon className="size-4 text-sky" />
            {t.buy}
            <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </BuyHeaderButton>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10 hover:text-white xl:hidden" aria-label={t.openMenu} />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-ink text-white">
              <SheetHeader>
                <SheetTitle className="text-white">{t.menu}</SheetTitle>
              </SheetHeader>
              <nav aria-label={t.label} className="grid gap-1 px-4">
                {t.items.map((n) => (
                  <SheetClose key={n.href} render={<a href={n.href} />} className="rounded-lg px-3 py-3 text-base text-white/80 hover:bg-white/10 hover:text-white">
                    {n.label}
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

/** Đặt thuộc tính lang của <html> theo trang (layout gốc mặc định lang="vi"; trang /en cần "en"). */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.lang;
    root.lang = lang;
    return () => {
      root.lang = prev;
    };
  }, [lang]);
  return null;
}
