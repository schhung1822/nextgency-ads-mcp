import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardCheckIcon,
  HeadsetIcon,
  PlayIcon,
  ServerIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  TerminalIcon,
  XIcon,
  BotIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedHeading, HeroAurora, HeroTitle, ShinyBadgeText } from "@/components/landing/fx";
import { Reveal } from "@/components/landing/reveal";
import { Rich } from "@/components/landing/rich";
import { Container, SectionHead, Tick } from "@/components/landing/sections";
import { G, PRICE } from "@/lib/global/copy";
import { GLOBAL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { GlobalCheckout } from "./checkout";
import { BuyLink } from "./header";
import { HeroDemo } from "./hero-demo";

const outlineLight = cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-iris/30 bg-white px-6 text-base text-navy hover:bg-secondary");
const outlineDark = cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-white/25 bg-white/5 px-6 text-base text-white hover:bg-white/15 hover:text-white");

/** Khung số liệu nhỏ dùng trong các thẻ minh hoạ (KPI). */
function Kpis({ items }: { items: readonly { label: string; value: string; delta?: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((k) => (
        <div key={k.label} className="rounded-xl border bg-card px-2.5 py-2">
          <span className="block text-[11px] text-muted-foreground">{k.label}</span>
          <b className="mt-0.5 block font-mono text-lg leading-tight text-navy tabular-nums">{k.value}</b>
          {k.delta && <em className="text-[10px] font-semibold not-italic text-emerald-600">{k.delta}</em>}
        </div>
      ))}
    </div>
  );
}

/** Hàng "tên — số" có thanh ngang (thanh đỏ khi `bad`). */
function BarRows({ rows }: { rows: readonly { label: string; value: string; pct?: number; bad?: boolean }[] }) {
  return (
    <div className="grid gap-2.5">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 text-sm">
          <span className={cn("text-navy", r.bad && "font-medium text-red-600")}>{r.label}</span>
          <b className={cn("font-mono tabular-nums", r.bad ? "text-red-600" : "text-navy")}>{r.value}</b>
          {r.pct != null && (
            <div className="col-span-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className={cn("h-full rounded-full", r.bad ? "bg-red-500" : "bg-linear-to-r from-sky to-violet")} style={{ width: `${r.pct}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Viz({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-auto rounded-2xl border bg-brand-soft p-3.5 text-sm", className)}>{children}</div>;
}

/* ---------------------------------------------------------------------- hero */

export function GlobalHero({ hasDemo }: { hasDemo: boolean }) {
  const h = G.hero;
  return (
    <section id="top" className="bg-brand-hero relative isolate overflow-hidden pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
      <HeroAurora />
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <Reveal>
            <Badge className="mb-6 h-auto min-h-7 gap-2 border border-white/20 bg-white/10 px-3 py-1 text-xs whitespace-normal text-white backdrop-blur">
              <ShieldCheckIcon className="shrink-0 text-sky" /> <ShinyBadgeText>{h.badge}</ShinyBadgeText>
            </Badge>
            <HeroTitle title={h.title} accent={h.accent} />
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg [&_strong]:text-white">
              <Rich text={h.lead} />
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BuyLink className="text-base font-semibold">
              {h.buy} · {PRICE}
              <ArrowRightIcon className="size-4" />
            </BuyLink>
            <a href={hasDemo ? "#demo" : "#benefits"} className={outlineDark}>
              {hasDemo ? <PlayIcon className="size-4" /> : null}
              {hasDemo ? h.demo : h.learn}
            </a>
          </Reveal>

          <Reveal delay={300}>
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              {h.trust.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5"><CheckIcon className="size-4 text-sky" /> {item}</span>
              ))}
            </p>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <HeroDemo />
        </Reveal>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------------------- video */

export function GlobalVideo() {
  const v = G.video;
  return (
    <section id="demo" className="scroll-mt-16 bg-white py-16 sm:py-24">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div className="grid gap-3">
            <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{v.eyebrow}</p>
            <h2 className="text-balance text-2xl font-bold tracking-tight text-navy sm:text-4xl">{v.title}</h2>
          </div>
          <BuyLink>{v.cta}<ArrowRightIcon className="size-4" /></BuyLink>
        </div>
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-3xl border bg-ink shadow-xl shadow-iris/10">
            <video controls playsInline preload="metadata" poster={v.poster} className="size-full object-cover">
              <source src={v.src} type="video/mp4" />
            </video>
          </div>
        </Reveal>
        <p className="mt-3 text-sm text-muted-foreground">{v.meta.join(" ")}</p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------- problem */

export function Problem() {
  const p = G.problem;
  return (
    <section className="border-y bg-white py-20 sm:py-28">
      <Container className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{p.eyebrow}</p>
            <AnimatedHeading title={p.title} accent={p.accent} align="left" className="lg:text-4xl" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{p.lead}</p>
          </Reveal>
          <div className="mt-8 grid gap-5">
            {p.fails.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                  <span className="row-span-2 grid size-7 place-items-center rounded-lg bg-red-100 text-red-600"><XIcon className="size-4" strokeWidth={3} /></span>
                  <b className="font-semibold text-navy">{f.title}</b>
                  <p className="text-[15px] text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="rounded-3xl border bg-brand-soft p-6 sm:p-8">
            <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-red-600 uppercase">{p.cost.label}</p>
            <p className="mt-3 font-archivo text-5xl font-black tracking-tight text-red-600 tabular-nums sm:text-6xl">{p.cost.big}</p>
            <p className="mt-1.5 text-navy/90">{p.cost.text}</p>
            <table className="mt-5 w-full border-collapse text-[15px]">
              <tbody>
                {p.cost.rows.map(([label, value]) => (
                  <tr key={label} className="border-t">
                    <td className="py-2.5 text-navy/90">{label}</td>
                    <td className="py-2.5 text-right font-mono font-semibold text-navy tabular-nums">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted-foreground">{p.cost.note}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- different */

export function Different() {
  const d = G.different;
  return (
    <section className="bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={d.eyebrow} title={d.title} accent={d.accent} align="left" />
        <div className="grid gap-6 md:grid-cols-3">
          {d.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 90}>
              <div className="grid gap-2 border-t-2 border-navy pt-4">
                <h3 className="text-xl leading-snug font-semibold text-navy">{it.title}</h3>
                <p className="text-muted-foreground">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ benefits */

export function Benefits() {
  const b = G.benefits;
  const c = b.cards;
  const card = "flex h-full flex-col gap-3 rounded-2xl border bg-card p-6 transition-transform duration-300 hover:-translate-y-0.5";
  return (
    <section id="benefits" className="scroll-mt-16 bg-white pt-4 pb-20 sm:pb-28">
      <Container>
        <SectionHead eyebrow={b.eyebrow} title={b.title} align="left" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          <Reveal className="lg:col-span-3">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.numbers.title}</h3>
              <p className="text-muted-foreground">{c.numbers.body}</p>
              <Viz><Kpis items={c.numbers.kpis} /></Viz>
            </article>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-3">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.waste.title}</h3>
              <p className="text-muted-foreground">{c.waste.body}</p>
              <Viz><BarRows rows={c.waste.rows} /></Viz>
            </article>
          </Reveal>
          <Reveal className="lg:col-span-2">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.scale.title}</h3>
              <p className="text-muted-foreground">{c.scale.body}</p>
              <Viz>
                <p className="text-xs text-muted-foreground">{c.scale.label}</p>
                <p className="mt-1 flex items-baseline gap-3 font-mono text-3xl font-semibold tracking-tight">
                  <s className="text-muted-foreground decoration-2">{c.scale.from}</s>
                  <span aria-hidden>→</span>
                  <b className="text-brand-gradient-dark">{c.scale.to}</b>
                </p>
              </Viz>
            </article>
          </Reveal>
          <Reveal delay={90} className="lg:col-span-2">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.comments.title}</h3>
              <p className="text-muted-foreground">{c.comments.body}</p>
              <Viz><BarRows rows={c.comments.rows} /></Viz>
            </article>
          </Reveal>
          <Reveal delay={180} className="lg:col-span-2">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.launch.title}</h3>
              <p className="text-muted-foreground">{c.launch.body}</p>
              <Viz className="flex items-center gap-3">
                <b className="font-mono text-4xl font-semibold text-brand-gradient-dark">{c.launch.big}</b>
                <span className="text-sm leading-snug font-semibold text-navy">
                  {c.launch.label}
                  <br />
                  <span className="text-xs font-normal text-muted-foreground">{c.launch.hint}</span>
                </span>
              </Viz>
            </article>
          </Reveal>
          <Reveal className="sm:col-span-2 lg:col-span-6">
            <article className={card}>
              <h3 className="text-xl font-semibold text-navy">{c.log.title}</h3>
              <p className="text-muted-foreground">{c.log.body}</p>
              <Viz>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                  <CheckIcon className="size-3.5" strokeWidth={3} /> {c.log.chip}
                </span>
                <div className="mt-3 grid gap-1 border-t border-dashed pt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  {c.log.lines.map((l) => <span key={l}>{l}</span>)}
                </div>
              </Viz>
            </article>
          </Reveal>
        </div>
        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
          <BuyLink>{b.cta}<ArrowRightIcon className="size-4" /></BuyLink>
          <span className="text-sm text-muted-foreground">{b.ctaNote}</span>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- Ads AI */

export function AdsAi() {
  const a = G.adsAi;
  const mail = GLOBAL.contactEmail;
  return (
    <section id="ads-ai" className="scroll-mt-16 bg-haze py-20 sm:py-28">
      <Container>
        <div className="mb-10 grid max-w-4xl gap-5 sm:mb-14">
          <Reveal>
            <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-violet uppercase">{a.eyebrow}</p>
            <AnimatedHeading title={a.title} accent={a.accent} align="left" />
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap items-center gap-2.5 text-base font-semibold" aria-label={a.equation.label}>
              <span className="rounded-full bg-violet px-4 py-2 text-white">{a.equation.ai}</span>=
              <span className="bg-brand-button rounded-full px-4 py-2 text-white">{a.equation.mcp}</span>+
              <span className="rounded-full border bg-white px-4 py-2 text-navy">{a.equation.plus}</span>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{a.lead}</p>
            {mail && (
              <a href={`mailto:${mail}?subject=${encodeURIComponent(a.ctaSubject)}`} className={cn(outlineLight, "mt-5")}>
                {a.cta} <ArrowRightIcon className="size-4" />
              </a>
            )}
          </Reveal>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-semibold text-navy">{a.competitors.title}</h3>
              <p className="text-xs text-muted-foreground">{a.competitors.hint}</p>
              <div>
                {a.competitors.rows.map((r) => (
                  <div key={r.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 border-b py-3 last:border-0">
                    <span className="row-span-2 grid size-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: r.color }}>{r.initial}</span>
                    <b className="text-navy">{r.name}</b>
                    <span className="row-span-2 rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-semibold text-iris">{r.days}</span>
                    <small className="text-[13px] text-muted-foreground">{r.detail}</small>
                  </div>
                ))}
              </div>
              <Viz>
                <b className="text-navy">{a.competitors.complaints}</b>
                <br />
                <span className="text-xs text-muted-foreground">{a.competitors.complaintsDetail}</span>
              </Viz>
            </div>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card p-6">
              <h3 className="text-xl font-semibold text-navy">{a.report.title}</h3>
              <p className="text-muted-foreground">{a.report.body}</p>
              <div className="mt-auto">
                <div className="flex justify-between rounded-t-2xl bg-[#1F96D3] px-4 py-3 font-semibold text-white">
                  <span>{a.report.group}</span>
                  <span className="font-mono">{a.report.time}</span>
                </div>
                <div className="grid gap-1.5 rounded-b-2xl border border-t-0 bg-white p-4 text-[15px]">
                  <span className="text-[13px] font-semibold text-violet">{a.report.from}</span>
                  <b className="text-navy">{a.report.heading}</b>
                  {a.report.lines.map((l) => <span key={l} className="font-mono text-navy/90">{l}</span>)}
                  <span className="text-emerald-600">{a.report.best}</span>
                  <span className="text-red-600">{a.report.pause}</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{a.report.sources}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------------- who */

export function Who() {
  const w = G.who;
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={w.eyebrow} title={w.title} accent={w.accent} align="left" />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-7">
              <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{w.owners.eyebrow}</p>
              <h3 className="text-2xl leading-tight font-bold tracking-tight text-navy">{w.owners.title}</h3>
              <table className="w-full border-collapse text-[15px]">
                <thead>
                  <tr>
                    {w.owners.head.map((h, i) => (
                      <th key={i} scope="col" className="py-1.5 text-left text-[13px] font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {w.owners.rows.map((r) => (
                    <tr key={r.label} className="border-t">
                      <td className="py-2.5 text-navy/90">{r.label}</td>
                      <td className="py-2.5 font-mono text-[17px] font-semibold text-navy tabular-nums">{r.a}</td>
                      <td className={cn("py-2.5 font-mono text-[17px] font-semibold tabular-nums", r.off ? "text-red-600" : "text-navy")}>{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 sm:p-7">
              <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{w.agencies.eyebrow}</p>
              <h3 className="text-2xl leading-tight font-bold tracking-tight text-navy">{w.agencies.title}</h3>
              <div>
                {w.agencies.accounts.map((a) => (
                  <div key={a.name} className="flex items-center gap-2.5 border-t py-2.5 font-medium text-navy">
                    <span className="grid size-[26px] place-items-center rounded-md text-[13px] font-bold text-white" style={{ background: a.color }}>{a.badge}</span>
                    {a.name}
                    <span className={cn("ml-auto rounded-full px-2.5 py-1 text-xs font-semibold", a.over ? "bg-red-100 text-red-600" : "bg-secondary text-iris")}>{a.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 rounded-xl border bg-brand-soft p-3 font-mono text-sm text-navy/90">
                <span>{w.agencies.prompt}</span>
                <span className="text-iris">↵</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------------------- setup */

const STEP_ICONS = [ServerIcon, BotIcon, SlidersHorizontalIcon];

export function Setup() {
  const s = G.setup;
  return (
    <section id="setup" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} description={s.lead} align="left" />
        <ol className="grid gap-5 md:grid-cols-3">
          {s.steps.map((step, i) => {
            const Icon = STEP_ICONS[i] ?? TerminalIcon;
            return (
              <Reveal key={step.title} delay={i * 90} className="h-full">
                <li className="relative flex h-full flex-col gap-3 rounded-2xl border bg-card p-5">
                  <span className="absolute top-4 right-4 font-archivo text-4xl font-black text-iris/10">0{i + 1}</span>
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary text-iris"><Icon className="size-5" /></span>
                  <h3 className="font-semibold text-navy">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 rounded-xl border bg-brand-soft p-3 font-mono text-[13px] text-navy/90">
                    <span>{step.mock[0]}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-iris">
                      {i === 0 || i === 2 ? <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
                      {step.mock[1]}
                    </span>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardContent className="grid gap-4 p-4 sm:p-6">
                <h3 className="flex items-center gap-2.5 text-lg font-semibold text-navy">
                  <ClipboardCheckIcon className="size-5 text-iris" /> {s.ready.title}
                </h3>
                <ul className="grid gap-3 text-[15px] leading-relaxed text-navy/90">
                  {s.ready.items.map((item) => <Tick key={item}>{item}</Tick>)}
                </ul>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.ready.note}</p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <div className="bg-brand-hero relative isolate h-full overflow-hidden rounded-3xl p-6 text-white sm:p-8">
              <Badge className="mb-4 h-6 border border-white/20 bg-white/10 text-white"><HeadsetIcon /> {s.support.badge}</Badge>
              <h3 className="text-balance text-2xl font-bold">{s.support.title}</h3>
              <p className="mt-3 text-white/70">{s.support.body}</p>
              <ul className="mt-5 grid gap-3 text-sm text-white/90 sm:text-base">
                {s.support.items.map((item) => <Tick key={item} dark>{item}</Tick>)}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------------- buy */

export function Buy() {
  const b = G.buy;
  return (
    <section id="buy" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <Reveal>
            <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-sky uppercase">{b.eyebrow}</p>
            <AnimatedHeading title={b.title} accent={b.accent} dark align="left" className="lg:text-4xl" />
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">{b.lead}</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-brand-gradient font-archivo text-5xl font-black tracking-tight tabular-nums sm:text-6xl">{PRICE}</span>
              <span className="text-sm text-white/60">{b.card.sub}</span>
            </p>
            <ul className="mt-6 grid gap-3.5 text-[15px] text-white/90">
              {b.gets.map((g) => <Tick key={g} dark>{g}</Tick>)}
            </ul>
            <div className="mt-7 grid gap-1.5 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm backdrop-blur">
              <b className="flex items-center gap-2 font-semibold text-white"><ShieldCheckIcon className="size-4 text-sky" /> {b.safe.title}</b>
              <p className="leading-relaxed text-white/65">{b.safe.body}</p>
            </div>
            <div className="mt-4 grid gap-2 text-xs leading-relaxed text-white/55 [&_a]:text-sky [&_strong]:text-white/80">
              {b.notes.map((n) => <p key={n}><Rich text={n} /></p>)}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <GlobalCheckout />
        </Reveal>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------------- faq */

export function GlobalFaq() {
  const f = G.faq;
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container className="max-w-[960px]">
        <SectionHead eyebrow={f.eyebrow} title={f.title} align="left" />
        <Reveal>
          <Accordion className="rounded-2xl border bg-card px-5 sm:px-6">
            {f.items.map((it, i) => (
              <AccordionItem key={it.q} value={`faq-${i}`}>
                <AccordionTrigger className="py-4 text-base font-semibold text-navy">{it.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  <Rich text={it.a} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------------------- final */

export function GlobalFinal() {
  const f = G.final;
  return (
    <section className="bg-brand-soft py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto grid max-w-[960px] justify-items-center gap-5 text-center">
          <AnimatedHeading title={f.title} accent={f.accent} />
          <p className="text-muted-foreground">{f.sub}</p>
          <BuyLink className="text-base font-semibold">
            {f.cta} · {PRICE} <ArrowRightIcon className="size-4" />
          </BuyLink>
        </Reveal>
      </Container>
    </section>
  );
}
