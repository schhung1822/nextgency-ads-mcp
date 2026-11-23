import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/landing/sections";
import { GLOBAL, GLOBAL_POLICIES, LEGAL, SITE } from "@/lib/site";
import { CookieSettingsButton } from "./cookie-settings-button";

/** Chân trang của trang quốc tế (/global) và các trang chính sách tiếng Anh. */
export function GlobalFooter() {
  const email = GLOBAL.contactEmail;
  return (
    <footer className="bg-ink py-12 text-white/70">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-7 w-auto" />
            <p className="mt-4 text-sm leading-relaxed">Nextgency — digital marketing, AI and automation solutions for businesses.</p>
          </div>
          <div className="grid content-start gap-2 text-sm">
            <p className="font-semibold text-white">Contact</p>
            {email && <p>Email: <a href={`mailto:${email}`} className="hover:text-white">{email}</a></p>}
            <a href={`${SITE.url}${GLOBAL.path}`} className="hover:text-white">{SITE.url.replace(/^https?:\/\//, "")}{GLOBAL.path}</a>
          </div>
        </div>
        <nav aria-label="Policies" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
          {GLOBAL_POLICIES.map((p) => (
            <Link key={p.href} href={p.href} className="hover:text-white">{p.label}</Link>
          ))}
          <CookieSettingsButton className="underline underline-offset-4 hover:text-white" />
        </nav>
        <div className="mt-6 grid gap-1 text-xs leading-relaxed text-white/50">
          <p>
            Meta, TikTok, Google, OpenAI, Claude, ChatGPT, Apify, Telegram, GitHub and PayPal are trademarks of their respective owners.
            Ads MCP is an independent product and is not affiliated with or endorsed by them. Figures on this page are illustrative.
          </p>
          <p>
            © 2026 {LEGAL.operator}. Ads MCP Simple is software developed by Noti (noti.vn).
            {LEGAL.address ? ` ${LEGAL.address}.` : ""}
            {LEGAL.taxId ? ` Tax ID: ${LEGAL.taxId}.` : ""}
          </p>
        </div>
      </Container>
    </footer>
  );
}
