import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Footer } from "@/components/landing/sections";
import { LEGAL, POLICIES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LegalPage({
  title,
  current,
  intro,
  children,
}: {
  title: string;
  current: (typeof POLICIES)[number]["href"];
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-brand-hero">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Nextgency — về trang chủ">
            <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} priority className="h-6 w-auto sm:h-7" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeftIcon className="size-4" /> Về trang chủ
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-sky uppercase">Chính sách</p>
          <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-white/60">Cập nhật lần cuối: {LEGAL.updated}</p>
        </div>
      </header>

      <main className="bg-brand-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1fr_260px]">
          <article className="min-w-0 text-[15px] leading-relaxed text-navy/90">
            {intro && <p className="mb-8 rounded-xl border bg-white p-4 text-muted-foreground">{intro}</p>}
            {children}
          </article>
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <nav aria-label="Các chính sách" className="rounded-2xl border bg-white p-4">
              <p className="mb-2 text-sm font-semibold text-navy">Chính sách khác</p>
              <ul className="grid gap-1">
                {POLICIES.map((p) => (
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
      <Footer />
    </>
  );
}

export function Sec({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9 scroll-mt-20" id={`muc-${n}`}>
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
export function ContactList() {
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

export function EmailInline() {
  return <b>{SITE.contact.email || "email liên hệ được công bố trên website"}</b>;
}

export const legalMeta = (title: string, description: string) => ({
  title: `${title} | Nextgency`,
  description,
  robots: { index: true, follow: true },
});
