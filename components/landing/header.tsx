"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { BuyButton } from "@/components/checkout/checkout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#tinh-nang", label: "Tính năng" },
  { href: "#apify", label: "Apify" },
  { href: "#skill", label: "Skill Meta Ads" },
  { href: "#cai-dat", label: "Cài đặt & hỗ trợ" },
  { href: "#huong-dan", label: "Hướng dẫn mua" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="Nextgency — về đầu trang" className="shrink-0">
          <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto sm:h-7" />
        </a>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-3 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BuyButton size="lg" className="bg-brand-button h-9 rounded-full border-0 px-4 text-sm font-semibold text-white hover:opacity-90">
            Mua ngay
          </BuyButton>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Mở menu" />}>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-ink text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-1 px-4">
                {NAV.map((n) => (
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
