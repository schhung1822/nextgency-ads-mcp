import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { GlobalFooter } from "@/components/global/footer";
import { Footer } from "@/components/landing/sections";
import { HtmlLang } from "@/components/landing/html-lang";
import { GLOBAL, GLOBAL_POLICIES, LEGAL, LEGAL_GLOBAL, POLICIES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** "vi" = trang chính sách tiếng Việt (/terms, /privacy, /policies/...) · "global" = bản tiếng Anh cho trang /global. */
export type LegalLocale = "vi" | "global";

const CHROME = {
  vi: {
    home: "/",
    homeAria: "Nextgency — về trang chủ",
    back: "Về trang chủ",
    kicker: "Chính sách",
    updated: `Cập nhật lần cuối: ${LEGAL.updated}`,
    navLabel: "Các chính sách",
    navTitle: "Chính sách khác",
    policies: POLICIES as readonly { href: string; label: string }[],
  },
  global: {
    home: GLOBAL.path,
    homeAria: "Nextgency — back to home",
    back: "Back to home",
    kicker: "Policies",
    updated: `Last updated: ${LEGAL_GLOBAL.updated}`,
    navLabel: "Policies",
    navTitle: "Other policies",
    policies: GLOBAL_POLICIES as readonly { href: string; label: string }[],
  },
} as const;

export function LegalPage({
  title,
  current,
  intro,
  locale = "vi",
  children,
}: {
  title: string;
  /** href của trang hiện tại trong danh sách chính sách (để tô sáng). */
  current: string;
  intro?: string;
  locale?: LegalLocale;
  children: React.ReactNode;
}) {
  const c = CHROME[locale];
  return (
    <>
      {locale === "global" && <HtmlLang lang="en" />}
      <header className="bg-brand-hero">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href={c.home} aria-label={c.homeAria}>
            <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto sm:h-7" />
          </Link>
          <Link href={c.home} className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon className="size-4" /> {c.back}
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-sky uppercase">{c.kicker}</p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-white/60">{c.updated}</p>
        </div>
      </header>

      <main className="bg-brand-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_260px]">
          <article className="min-w-0 text-[15px] leading-relaxed text-navy/90">
            {intro && <p className="mb-8 rounded-xl border bg-white p-4 text-muted-foreground">{intro}</p>}
            {children}
          </article>
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <nav aria-label={c.navLabel} className="rounded-2xl border bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-navy">{c.navTitle}</p>
              <ul className="grid gap-1">
                {c.policies.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      aria-current={p.href === current ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        p.href === current ? "bg-secondary font-semibold text-iris" : "text-muted-foreground hover:bg-muted hover:text-navy",
                      )}
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </main>
      {locale === "global" ? <GlobalFooter /> : <Footer />}
    </>
  );
}

export function Sec({ n, title, children, id }: { n: number; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section className="mb-9 scroll-mt-20" id={id ?? `muc-${n}`}>
      <h2 className="mb-3 text-xl font-bold tracking-tight text-navy">
        {n}. {title}
      </h2>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="grid list-disc gap-2 pl-5 marker:text-violet">{children}</ul>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border-l-4 border-violet bg-white p-3 text-sm text-muted-foreground">{children}</p>;
}

/** Thông tin liên hệ lấy từ cấu hình; ẩn các mục chưa điền. */
export function ContactList({ locale = "vi" }: { locale?: LegalLocale }) {
  if (locale === "global") {
    return (
      <Ul>
        {GLOBAL.contactEmail && <li>Email: <b>{GLOBAL.contactEmail}</b></li>}
        <li>Support hours: {LEGAL_GLOBAL.workHours}</li>
      </Ul>
    );
  }
  const { zalo, phone, email } = SITE.contact;
  return (
    <Ul>
      {email && <li>Email: <b>{email}</b></li>}
      {zalo && <li>Zalo: <b>{zalo}</b></li>}
      {phone && <li>Hotline: <b>{phone}</b></li>}
      <li>Giờ làm việc: {LEGAL.workHours}</li>
    </Ul>
  );
}

export function EmailInline({ locale = "vi" }: { locale?: LegalLocale }) {
  if (locale === "global") return <b>{GLOBAL.contactEmail || "the contact email published on this website"}</b>;
  return <b>{SITE.contact.email || "email liên hệ được công bố trên website"}</b>;
}

export const legalMeta = (title: string, description: string, locale: LegalLocale = "vi") => ({
  title: `${title} | Nextgency`,
  description,
  robots: { index: true, follow: true },
  ...(locale === "global" ? { openGraph: { title: `${title} | Nextgency`, description, locale: "en_US" } } : {}),
});
