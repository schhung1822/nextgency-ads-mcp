import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BellRingIcon,
  BotIcon,
  CheckIcon,
  CircleDollarSignIcon,
  HandshakeIcon,
  HeadsetIcon,
  KeyRoundIcon,
  LayersIcon,
  LightbulbIcon,
  MegaphoneIcon,
  MessageCircleQuestionIcon,
  MessageSquareTextIcon,
  ScanSearchIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  StoreIcon,
  TerminalIcon,
  UserRoundIcon,
  UsersRoundIcon,
  UtensilsIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { BuyStarButton } from "@/components/checkout/checkout";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLanding, type LandingDict, type Locale } from "@/lib/landing";
import { SITE, formatVnd, zaloHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "./before-after";
import { AnimatedHeading, HeroAurora, HeroTitle, PlatformMarquee, ShinyBadgeText, Stat } from "./fx";
import { HeroChat } from "./hero-chat";
import { PlayGlyph, Shot, type ShotName } from "./media";
import { Reveal } from "./reveal";
import { Rich } from "./rich";

type T = { t: LandingDict };

/* ------------------------------------------------------------------ helpers */

export function SectionHead({
  eyebrow,
  title,
  accent,
  description,
  dark,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: React.ReactNode;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("mb-10 max-w-4xl sm:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <Reveal>
          <p className={cn("mb-3 font-archivo text-xs font-semibold tracking-[0.2em] uppercase", dark ? "text-sky" : "text-iris")}>
            {eyebrow}
          </p>
        </Reveal>
      )}
      <AnimatedHeading title={title} accent={accent} dark={dark} align={align} />
      {description && (
        <Reveal delay={150}>
          <p className={cn("mt-4 text-pretty text-base leading-relaxed sm:text-lg", dark ? "text-white/70" : "text-muted-foreground")}>
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6", className)}>{children}</div>;
}

export function Tick({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-full", dark ? "bg-white/15 text-sky" : "bg-secondary text-iris")}>
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-iris/15 bg-white px-3 py-1 text-xs font-medium whitespace-nowrap text-navy/80 shadow-xs">{children}</span>;
}

export const outlineOnLight = cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-iris/30 bg-white px-6 text-base text-navy hover:bg-secondary");

/* --------------------------------------------------------------------- hero */

export function Hero({ t }: T) {
  const h = t.hero;
  return (
    <section id="top" className="bg-brand-hero relative isolate overflow-hidden pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
      <HeroAurora />
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <Container className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <Reveal>
            <Badge className="mb-6 h-7 gap-2 border border-white/20 bg-white/10 px-3 text-xs text-white backdrop-blur">
              <SparklesIcon className="text-sky" /> <ShinyBadgeText>{h.badge}</ShinyBadgeText>
            </Badge>
            <HeroTitle title={h.title} accent={h.titleAccent} />
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg [&_strong]:text-white">
              <Rich text={h.lead} />
            </p>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/60 sm:text-base [&_strong]:text-white/85">
              <Rich text={h.sub} />
            </p>
          </Reveal>

          <Reveal delay={150} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BuyStarButton className="text-base font-semibold">
              {h.buy} · {t.price}
              <ArrowRightIcon className="size-4" />
            </BuyStarButton>
            <a
              href="#mcp-la-gi"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 rounded-full border-white/25 bg-white/5 px-6 text-base text-white hover:bg-white/15 hover:text-white")}
            >
              {h.ctaLearn}
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
          <HeroChat t={h.chat} />
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- stats */

export function Stats({ t }: T) {
  const s = t.stats;
  return (
    <section aria-label={s.label} className="relative z-10 border-b bg-white">
      <Container className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {s.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 80} className="px-2 py-8 text-center">
            {it.text ? <Stat text={it.text} /> : <Stat to={it.to} suffix={it.suffix || undefined} />}
            <div className="mt-1 text-sm font-semibold text-navy">{it.title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{it.sub}</div>
          </Reveal>
        ))}
      </Container>
      <div className="border-t py-5">
        <PlatformMarquee items={s.marquee} label={s.marqueeLabel} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ trước / sau */

export function Compare({ t }: T) {
  const c = t.compare;
  return (
    <section id="hieu-qua" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={c.eyebrow} title={c.title} accent={c.accent} description={c.lead} />
        <Reveal>
          <BeforeAfter t={c} />
        </Reveal>
        <p className="mt-4 text-center text-xs text-muted-foreground">{c.note}</p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------- đội quảng cáo AI */

const SPOKE_ICONS = [MegaphoneIcon, CircleDollarSignIcon, MessageSquareTextIcon, VideoIcon, ScanSearchIcon, SendIcon];
const SPOKE_POS = [
  { x: 17, y: 16 },
  { x: 17, y: 50 },
  { x: 17, y: 84 },
  { x: 83, y: 16 },
  { x: 83, y: 50 },
  { x: 83, y: 84 },
];

export function Team({ t }: T) {
  const tm = t.team;
  return (
    <section id="doi-ai" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={tm.eyebrow} title={tm.title} accent={tm.accent} description={tm.lead} />

        <Reveal>
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-3 rounded-2xl border bg-secondary/60 px-5 py-3">
              <span className="bg-brand-button grid size-11 place-items-center rounded-full text-white shadow-md shadow-iris/30" aria-hidden>
                <UserRoundIcon className="size-5" />
              </span>
              <span className="grid leading-tight">
                <span className="text-lg font-bold text-navy">{tm.you}</span>
                <span className="text-sm text-muted-foreground">{tm.youSub}</span>
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 py-3">
            <span className="w-36 text-right text-sm font-medium text-iris">{tm.ask}</span>
            <svg width="34" height="64" viewBox="0 0 34 64" fill="none" strokeWidth="2.2" aria-hidden className="shrink-0">
              <path d="M10 2v56M3 50l7 8 7-8" stroke="#5e5cf0" />
              <path d="M24 62V6M17 14l7-8 7 8" stroke="#9a63ff" />
            </svg>
            <span className="w-36 text-sm font-medium text-violet">{tm.report}</span>
          </div>
        </Reveal>

        {/* MCP ở giữa, 6 việc xung quanh; màn hình nhỏ xếp thành danh sách */}
        <div className="relative mx-auto flex max-w-[1140px] flex-col items-center gap-3 min-[1000px]:block min-[1000px]:h-[600px]">
          <svg className="absolute inset-0 hidden size-full min-[1000px]:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {SPOKE_POS.map((p, i) => (
              <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke="#5e5cf0" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 5" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>

          <div className="mb-2 min-[1000px]:absolute min-[1000px]:top-1/2 min-[1000px]:left-1/2 min-[1000px]:mb-0 min-[1000px]:-translate-x-1/2 min-[1000px]:-translate-y-1/2">
            <div className="absolute -inset-6 -z-10 rounded-full bg-violet/20 blur-3xl" aria-hidden />
            <div className="bg-brand-button size-44 rounded-[2.25rem] p-[3px] shadow-xl shadow-iris/30">
              <div className="flex size-full flex-col items-center justify-center gap-1.5 rounded-[2.1rem] bg-white text-center">
                <span className="text-brand-gradient-dark font-archivo text-4xl font-black tracking-tight">MCP</span>
                <span className="max-w-[120px] text-sm leading-snug text-muted-foreground">{tm.center}</span>
              </div>
            </div>
          </div>

          {tm.spokes.map((s, i) => {
            const Icon = SPOKE_ICONS[i] ?? MegaphoneIcon;
            const pos = SPOKE_POS[i] ?? SPOKE_POS[0];
            return (
              <div
                key={s.title}
                className="w-full max-w-[420px] min-[1000px]:absolute min-[1000px]:top-(--y) min-[1000px]:left-(--x) min-[1000px]:w-[270px] min-[1000px]:-translate-x-1/2 min-[1000px]:-translate-y-1/2"
                style={{ "--x": `${pos.x}%`, "--y": `${pos.y}%` } as React.CSSProperties}
              >
              <Reveal delay={(i % 3) * 90}>
                <div className="flex items-center gap-3.5 rounded-2xl border bg-card p-3.5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-secondary text-iris" aria-hidden>
                    <Icon className="size-6" />
                  </span>
                  <span className="grid min-w-0 gap-1">
                    <span className="font-semibold text-navy">{s.title}</span>
                    <span className="text-sm leading-snug text-muted-foreground">{s.desc}</span>
                    {s.tags.length > 0 && (
                      <span className="flex flex-wrap gap-1">
                        {s.tags.map((tag) => <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-iris">{tag}</span>)}
                      </span>
                    )}
                  </span>
                </div>
              </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* --------------------------------------------------- mỗi tuần bạn thấy gì */

function Phone({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative aspect-[9/17.5] w-full overflow-hidden rounded-[30px] border-[6px] border-navy shadow-lg shadow-navy/10", className)}>
      {children}
    </div>
  );
}

function PostHead({ brand, sponsored }: { brand: string; sponsored: string }) {
  return (
    <div className="flex items-center gap-[7px] px-2.5">
      <span className="bg-brand-button size-[26px] shrink-0 rounded-full" />
      <span className="flex flex-col">
        <span className="text-[11px] font-bold">{brand}</span>
        <span className="text-[9px] text-[#65676B]">{sponsored}</span>
      </span>
    </div>
  );
}

function PostActions({ actions }: { actions: string[] }) {
  return (
    <div className="mx-2.5 flex justify-around border-t border-[#E4E6EB] pt-[7px] text-[9px] font-semibold text-[#65676B]">
      {actions.map((a) => <span key={a}>{a}</span>)}
    </div>
  );
}

const VIDEO_CARD_SHOTS: ShotName[] = ["owner", "vlog", "signing", "spa"];

export function Weekly({ t }: T) {
  const w = t.weekly;
  const f = w.formats;
  return (
    <section className="bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={w.eyebrow} title={w.title} accent={w.accent} description={w.lead} />

        {/* Dạng bài trên Facebook */}
        <Reveal>
          <div className="grid gap-7 rounded-3xl border bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-bold text-navy sm:text-2xl">{f.title}</h3>
              <span className="text-sm text-muted-foreground">{f.sub}</span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] justify-items-center gap-8">
              {/* A. Reels dọc */}
              <div className="flex w-full max-w-[250px] flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-brand-gradient-dark text-2xl font-black">{f.reels.n}</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-emerald-700">{f.reels.badge}</span>
                </div>
                <Phone className="border-iris shadow-iris/25">
                  <Shot name="owner" icon sizes="250px" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.4)_0%,rgba(0,0,0,0)_16%,rgba(0,0,0,0)_52%,rgba(0,0,0,.8)_100%)]" />
                  <span className="absolute top-3 left-3 text-[15px] font-bold text-white">{f.reels.tag}</span>
                  <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-3 text-[10px] text-white" aria-hidden>
                    <span className="flex flex-col items-center gap-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M7 10v11M3 10h4v11H3zM7 10l4-8a3 3 0 0 1 3 3v4h5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.6 21H7" /></svg>
                      1,2k
                    </span>
                    <span className="flex flex-col items-center gap-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6A8 8 0 1 1 21 12z" /></svg>
                      86
                    </span>
                    <span className="flex flex-col items-center gap-0.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 5l7 7-7 7v-4c-6 0-9 2-11 5 1-6 4-10 11-11z" /></svg>
                      40
                    </span>
                  </div>
                  <div className="absolute right-11 bottom-[52px] left-3 flex flex-col gap-[5px] text-white">
                    <span className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="size-5 shrink-0 rounded-full bg-white/80" />
                      {f.brand}
                    </span>
                    <span className="text-[10px] opacity-85">{f.sponsored}</span>
                    <span className="text-[11px] leading-[1.35]">{f.reels.caption}</span>
                  </div>
                  <div className="absolute right-2.5 bottom-3 left-2.5 flex h-[30px] items-center justify-center rounded-lg bg-white/20 text-xs font-semibold text-white">{f.send}</div>
                </Phone>
                <span className="font-semibold text-navy">{f.reels.label}</span>
              </div>

              {/* B. Ảnh nhiều tấm */}
              <div className="flex w-full max-w-[250px] flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl font-black text-navy">{f.carousel.n}</span>
                  <span className="rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-navy">{f.carousel.badge}</span>
                </div>
                <Phone className="bg-[#F0F2F5]">
                  <div className="absolute inset-0 flex flex-col justify-center gap-2 py-3 text-[#050505]">
                    <div className="flex flex-col gap-2 bg-white py-2.5">
                      <PostHead brand={f.brand} sponsored={f.sponsored} />
                      <span className="px-2.5 text-[10px] leading-[1.35]">{f.carousel.caption}</span>
                      <div className="flex gap-1.5 overflow-hidden pl-2.5">
                        {(["partner", "spa"] as const).map((shot, i) => (
                          <div key={shot} className="flex-[0_0_72%] overflow-hidden rounded-lg border border-[#E4E6EB]">
                            <div className="relative aspect-square w-full"><Shot name={shot} icon sizes="170px" /></div>
                            <div className="flex flex-col gap-[5px] p-1.5">
                              <span className="text-[10px] font-bold">{f.carousel.cards[i]}</span>
                              <span className="flex h-5 items-center justify-center rounded-[5px] bg-[#E4E6EB] text-[9px] font-semibold">{i === 0 ? f.send : ""}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <PostActions actions={f.actions} />
                    </div>
                  </div>
                </Phone>
                <span className="font-semibold text-navy">{f.carousel.label}</span>
              </div>

              {/* C. Video ngang */}
              <div className="flex w-full max-w-[250px] flex-col gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl font-black text-muted-foreground">{f.landscape.n}</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-amber-700">{f.landscape.badge}</span>
                </div>
                <Phone className="bg-[#F0F2F5] opacity-80">
                  <div className="absolute inset-0 flex flex-col justify-center text-[#050505]">
                    <div className="flex flex-col gap-2 bg-white py-2.5">
                      <PostHead brand={f.brand} sponsored={f.sponsored} />
                      <span className="px-2.5 text-[10px] leading-[1.35]">{f.landscape.caption}</span>
                      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#1C1E21]">
                        <Shot name="trip" sizes="240px" />
                        <span className="relative flex size-[34px] items-center justify-center rounded-full bg-white/85">
                          <PlayGlyph className="size-3.5 text-[#1C1E21]" />
                        </span>
                        <span className="absolute right-1.5 bottom-[5px] rounded bg-black/60 px-[5px] py-px text-[9px] text-white">2:14</span>
                      </div>
                      <div className="flex justify-between px-2.5 text-[9px] text-[#65676B]">
                        <span>{f.landscape.likes}</span>
                        <span>{f.landscape.comments}</span>
                      </div>
                      <PostActions actions={f.actions} />
                    </div>
                  </div>
                </Phone>
                <span className="font-semibold text-muted-foreground">{f.landscape.label}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t pt-5">
              <span className="mr-1 text-[15px] text-muted-foreground">{f.suggestLabel}</span>
              {f.suggestions.map((s) => (
                <span key={s} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-iris">{s}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Video nào mang khách về */}
          <Reveal className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">{w.videos.title}</CardTitle></CardHeader>
              <CardContent className="grid gap-4 p-4 pt-2">
                <div className="grid grid-cols-4 items-end gap-2">
                  {w.videos.items.map((v, i) => {
                    const last = i === w.videos.items.length - 1;
                    return (
                      <div key={v.name} className="grid justify-items-center gap-1.5 text-center">
                        <span className={cn("text-lg font-black", i === 0 ? "text-brand-gradient-dark" : last ? "text-muted-foreground" : "text-navy")}>{v.n}</span>
                        <div
                          className={cn(
                            "relative grid aspect-[9/14] w-full place-items-center overflow-hidden rounded-lg",
                            i === 0 && "ring-2 ring-iris ring-offset-2",
                            last && "opacity-70",
                          )}
                        >
                          <Shot name={VIDEO_CARD_SHOTS[i] ?? "spa"} gray={last} sizes="90px" />
                          <PlayGlyph className="relative size-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.6)]" />
                        </div>
                        <span className={cn("text-xs leading-tight", last ? "text-muted-foreground" : "text-navy")}>{v.name}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">{w.videos.top}: {w.videos.items[0]?.name}</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">{w.videos.stop}: {w.videos.items.at(-1)?.name}</span>
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">{w.videos.note}</p>
              </CardContent>
            </Card>
          </Reveal>

          {/* Tiền đi đâu */}
          <Reveal delay={90} className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">{w.money.title}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 p-4 pt-2">
                <p className="text-sm text-muted-foreground">{w.money.spentLabel}</p>
                <p className="text-brand-gradient-dark -mt-2 text-4xl font-black tracking-tight">{w.money.spent}</p>
                <div>
                  <div className="flex h-3.5 overflow-hidden rounded-full bg-secondary">
                    <div className="bg-brand-button" style={{ width: "81%" }} />
                    <div className="flex-1 bg-amber-300" />
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-sm">
                    <span><b className="text-navy">{w.money.good}</b> <span className="text-muted-foreground">{w.money.goodLegend}</span></span>
                    <span className="text-right"><b className="text-navy">{w.money.waste}</b> <span className="text-muted-foreground">{w.money.wasteLegend}</span></span>
                  </div>
                </div>
                <p className="flex gap-2.5 rounded-xl bg-secondary p-3 text-sm leading-relaxed text-secondary-foreground">
                  <LightbulbIcon className="mt-0.5 size-4 shrink-0 text-iris" aria-hidden />
                  {w.money.tip}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          {/* Báo cáo trên điện thoại */}
          <Reveal delay={180} className="h-full">
            <Card className="h-full p-2 ring-iris/15">
              <CardHeader className="p-4 pb-2"><CardTitle className="text-lg text-navy">{w.report.title}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 p-4 pt-2">
                <p className="text-sm text-muted-foreground">{w.report.sub}</p>
                <div className="grid gap-2 rounded-2xl bg-navy p-3 text-sm text-white">
                  <p className="text-[11px] text-white/50">{w.report.header}</p>
                  {w.report.messages.map((m) => (
                    <p key={m.text} className={cn("rounded-xl rounded-tl-sm px-3 py-2", m.hint ? "bg-iris/80" : "bg-white/10")}>
                      <Rich text={m.text} />
                    </p>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{w.report.footnote}</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{w.note}</p>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- đối tượng */

const PERSONA_ICONS = [UserRoundIcon, UsersRoundIcon, HandshakeIcon];

export function Personas({ t }: T) {
  const p = t.personas;
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={p.eyebrow} title={p.title} accent={p.accent} />
        <div className="grid gap-5 md:grid-cols-3">
          {p.items.map((it, i) => {
            const Icon = PERSONA_ICONS[i] ?? UserRoundIcon;
            return (
              <Reveal key={it.title} delay={i * 90} className="h-full">
                <div className="h-full rounded-2xl border bg-card p-6">
                  <span className="bg-brand-button mb-4 grid size-12 place-items-center rounded-xl text-white shadow-md shadow-iris/30"><Icon className="size-6" /></span>
                  <h3 className="text-lg font-semibold text-navy">{it.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{it.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ MCP là gì (30s) */

export function Explainer({ t }: T) {
  const m = t.mcp;
  return (
    <section id="mcp-la-gi" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <Reveal>
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{m.eyebrow}</p>
          <AnimatedHeading title={m.title} accent={m.accent} align="left" className="lg:text-4xl" />
          <p className="mt-5 text-base leading-relaxed text-navy/90 sm:text-lg"><Rich text={m.lead} /></p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.aside}</p>

          <div className="mt-6 grid gap-3 text-sm">
            <div className="rounded-xl border bg-white p-3.5">
              <p className="mb-2 font-semibold text-navy">{m.aiLabel}</p>
              <div className="flex flex-wrap gap-1.5">{m.ais.map((a) => <Chip key={a}>{a}</Chip>)}</div>
            </div>
            <div className="bg-brand-button rounded-xl p-px shadow-md shadow-iris/20">
              <div className="rounded-[11px] bg-haze p-3.5 text-center">
                <p className="font-bold text-navy">{m.link}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.linkSub}</p>
              </div>
            </div>
            <div className="grid gap-2.5 rounded-xl border bg-white p-3.5">
              {m.groups.map((g) => (
                <div key={g.label}>
                  <p className="mb-1.5 font-semibold text-navy">{g.label}</p>
                  <div className="flex flex-wrap gap-1.5">{g.items.map((it) => <Chip key={it}>{it}</Chip>)}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div className="grid grid-cols-[0.8fr_1fr_1.2fr] bg-navy text-xs font-semibold text-white sm:text-sm">
              <span className="p-3 sm:p-4" />
              <span className="p-3 text-white/70 sm:p-4">{m.cmpHead[0]}</span>
              <span className="bg-brand-button p-3 sm:p-4">{m.cmpHead[1]}</span>
            </div>
            {m.rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[0.8fr_1fr_1.2fr] border-t text-[13px] leading-relaxed sm:text-sm">
                <span className="p-3 font-semibold text-navy sm:p-4">{row.label}</span>
                <span className="p-3 text-muted-foreground sm:p-4">{row.plain}</span>
                <span className="bg-secondary/50 p-3 text-navy/90 sm:p-4">{row.mcp}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- dùng thế nào */

const USE_ICONS = [StoreIcon, UtensilsIcon, ShoppingBagIcon, UsersRoundIcon];

export function UseCases({ t }: T) {
  const u = t.usage;
  return (
    <section id="cach-dung" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={u.eyebrow} title={u.title} accent={u.accent} description={u.lead} />
        <div className="grid gap-5 md:grid-cols-2">
          {u.items.map((it, i) => {
            const Icon = USE_ICONS[i] ?? StoreIcon;
            return (
              <Reveal key={it.who} delay={(i % 2) * 90} className="h-full">
                <div className="h-full rounded-2xl border bg-card p-5 sm:p-6">
                  <p className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-iris">
                    <span className="grid size-9 place-items-center rounded-lg bg-secondary"><Icon className="size-[18px]" /></span>
                    {it.who}
                  </p>
                  <blockquote className="rounded-xl border-l-4 border-iris bg-secondary/60 p-3.5 text-[15px] leading-relaxed font-medium text-navy">“{it.q}”</blockquote>
                  <p className="mt-3 flex gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    <BotIcon className="mt-0.5 size-5 shrink-0 text-violet" /> {it.a}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* --------------------------------------------------------- hai cách bắt đầu */

export function Paths({ t }: T) {
  const p = t.paths;
  const zalo = zaloHref();
  const adsAiPrice = SITE.adsAiMonthlyPrice;
  return (
    <section className="bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={p.eyebrow} title={p.title} accent={p.accent} description={p.lead} />
        <div className="mx-auto grid max-w-[1000px] gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="bg-brand-button h-full rounded-3xl p-[2px] shadow-xl shadow-iris/20">
              <div className="flex h-full flex-col gap-4 rounded-[22px] bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-bold text-navy">{p.mcp.name}</h3>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-iris">{p.mcp.tag}</span>
                </div>
                <p className="leading-relaxed text-muted-foreground">{p.mcp.body}</p>
                <p className="mt-auto">
                  <span className="text-brand-gradient-dark font-archivo text-4xl font-black tracking-tight tabular-nums">{t.price}</span>{" "}
                  <span className="text-sm text-muted-foreground">{p.mcp.priceSuffix}</span>
                </p>
                <a href="#mua" className="bg-brand-button inline-flex h-12 items-center justify-center gap-2 self-start rounded-full px-6 font-semibold text-white shadow-md shadow-iris/30 transition-opacity hover:opacity-90">
                  {p.mcp.cta} <ArrowRightIcon className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col gap-4 rounded-3xl border bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-bold text-navy">{p.ai.name}</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{p.ai.tag}</span>
              </div>
              <p className="leading-relaxed text-muted-foreground">{p.ai.body}</p>
              <p className="mt-auto">
                {adsAiPrice ? (
                  <>
                    <span className="font-archivo text-4xl font-black tracking-tight text-navy tabular-nums">{formatVnd(adsAiPrice, t.locale)}</span>{" "}
                    <span className="text-sm text-muted-foreground">{p.ai.priceSuffix}</span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-navy">{p.ai.priceOnRequest}</span>
                )}
              </p>
              <a href={zalo || SITE.contact.fanpage} target="_blank" rel="noopener noreferrer" className={cn(outlineOnLight, "self-start")}>
                {zalo ? p.ai.ctaZalo : p.ai.ctaFanpage}
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ----------------------------------------------------------------- features */

const FEATURE_ICONS = [LayersIcon, KeyRoundIcon, SlidersHorizontalIcon, ScanSearchIcon, BellRingIcon, ServerIcon];

export function Features({ t }: T) {
  const f = t.features;
  return (
    <section id="tinh-nang" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={f.eyebrow} title={f.title} accent={f.accent} description={f.lead} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {f.items.map((it, i) => {
            const Icon = FEATURE_ICONS[i] ?? LayersIcon;
            return (
              <Reveal key={it.title} delay={(i % 3) * 90} className="h-full">
                <SpotlightCard theme="light" className="group h-full rounded-2xl border bg-card p-5 transition-transform duration-300 hover:-translate-y-1">
                  <span className="bg-brand-button mb-4 grid size-11 place-items-center rounded-xl text-white shadow-md shadow-iris/30">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-lg leading-snug font-semibold text-navy">{it.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{it.body}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-10 text-center text-sm text-muted-foreground [&_strong]:text-navy">
          <Rich text={f.worksWith} />
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- skill */

export function SkillSection({ t }: T) {
  const s = t.skill;
  return (
    <section id="skill" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-sky uppercase">{s.eyebrow}</p>
          <AnimatedHeading title={s.title} accent={s.accent} dark align="left" className="lg:text-4xl" />
          <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">{s.body}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{s.note}</p>
        </Reveal>
        <Reveal delay={120}>
          <Card className="p-2 text-navy ring-white/20">
            <CardHeader className="p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-lg font-semibold text-navy">{s.cardTitle}</CardTitle>
              <CardDescription>{s.cardSub}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 sm:pt-2">
              <ol className="grid gap-4">
                {s.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="bg-brand-button grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white">{i + 1}</span>
                    <span className="pt-1 text-[15px] leading-relaxed text-navy/90">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------- setup */

const SETUP_ICONS = [ServerIcon, TerminalIcon, BotIcon, MessageCircleQuestionIcon];

export function Setup({ t }: T) {
  const s = t.setup;
  return (
    <section id="cai-dat" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={s.eyebrow} title={s.title} accent={s.accent} description={s.lead} />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.steps.map((step, i) => {
            const Icon = SETUP_ICONS[i] ?? ServerIcon;
            return (
              <Reveal key={step.title} delay={i * 90}>
                <li className="relative h-full rounded-2xl border bg-card p-5">
                  <span className="absolute top-4 right-4 font-archivo text-4xl font-black text-iris/10">0{i + 1}</span>
                  <span className="mb-4 grid size-10 place-items-center rounded-xl bg-secondary text-iris"><Icon className="size-5" /></span>
                  <h3 className="font-semibold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <Reveal className="mt-8">
          <div className="bg-brand-hero relative isolate overflow-hidden rounded-3xl p-6 text-white sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <Badge className="mb-4 h-6 border border-white/20 bg-white/10 text-white"><HeadsetIcon /> {s.support.badge}</Badge>
                <h3 className="text-balance text-2xl font-bold sm:text-3xl">{s.support.title}</h3>
                <p className="mt-3 text-white/70">{s.support.body}</p>
              </div>
              <ul className="grid gap-3 text-sm text-white/90 sm:text-base">
                {s.support.items.map((item) => <Tick key={item} dark>{item}</Tick>)}
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------- phù hợp / chưa */

export function Fit({ t }: T) {
  const f = t.fit;
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHead eyebrow={f.eyebrow} title={f.title} />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <Card className="h-full p-2 ring-iris/15">
              <CardContent className="p-4 sm:p-6">
                <ul className="grid gap-4 text-[15px] leading-relaxed text-navy/90">
                  {f.yes.map((item) => <Tick key={item}>{item}</Tick>)}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={120}>
            <Card className="self-start border-0 bg-navy p-2 text-white ring-white/10">
              <CardContent className="p-4 sm:p-6">
                <h3 className="mb-4 text-lg font-semibold">{f.noTitle}</h3>
                <ul className="grid gap-4 text-[15px] leading-relaxed text-white/80">
                  {f.no.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-red-500/20 text-red-300"><XIcon className="size-3.5" strokeWidth={3} /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-6">
          <Accordion className="rounded-2xl border bg-card px-5 sm:px-6">
            <AccordionItem value="limits">
              <AccordionTrigger className="py-4 text-base font-semibold text-navy">{f.limitsTitle}</AccordionTrigger>
              <AccordionContent>
                <ul className="grid gap-2.5 pb-3 text-sm leading-relaxed text-muted-foreground">
                  {f.limits.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-violet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ pricing */

export function Pricing({ t }: T) {
  const p = t.pricing;
  return (
    <section id="mua" className="bg-brand-hero relative isolate scroll-mt-16 overflow-hidden py-20 text-white sm:py-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden />
      <Container>
        <SectionHead dark eyebrow={p.eyebrow} title={p.title} accent={p.accent} description={p.lead} />
        <Reveal>
          <div className="mx-auto max-w-[960px] overflow-hidden rounded-3xl border border-white/20 bg-white text-navy shadow-2xl shadow-black/30">
            <div className="grid sm:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center gap-2 bg-secondary p-8 text-center sm:p-10">
                <p className="font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{p.label}</p>
                {SITE.compareAtPrice && <p className="font-archivo text-lg text-muted-foreground line-through">{formatVnd(SITE.compareAtPrice, t.locale)}</p>}
                <p className="text-brand-gradient-dark font-archivo text-5xl font-black tracking-tight tabular-nums sm:text-6xl">{t.price}</p>
                <p className="text-sm text-muted-foreground">{p.included}</p>
                <div className="mt-5 flex justify-center">
                  <BuyStarButton className="w-full text-base font-semibold">
                    {p.buy}
                    <ArrowRightIcon className="size-4" />
                  </BuyStarButton>
                </div>
                <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheckIcon className="size-3.5 text-azure" /> {p.secure}</p>
              </div>
              <div className="p-8 sm:p-10">
                <ul className="grid gap-3.5 text-[15px]">{p.includes.map((item) => <Tick key={item}>{item}</Tick>)}</ul>
              </div>
            </div>
            <div className="grid gap-3 border-t bg-muted/60 p-6 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2 sm:p-8 [&_strong]:text-navy">
              {p.notes.map((n) => <p key={n}><Rich text={n} /></p>)}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ---------------------------------------------------------------------- faq */

export function Faq({ t }: T) {
  return (
    <section id="faq" className="scroll-mt-16 bg-white py-20 sm:py-28">
      <Container className="max-w-[960px]">
        <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Reveal>
          <Accordion className="rounded-2xl border bg-card px-5 sm:px-6">
            {t.faq.items.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="py-4 text-base font-semibold text-navy">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                  <Rich text={f.a} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------- final + foot */

export function FinalCta({ t }: T) {
  const zalo = zaloHref();
  const f = t.final;
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-[960px] text-center">
          <AnimatedHeading title={f.title} accent={f.accent} />
          <p className="mt-4 text-muted-foreground">{f.sub}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BuyStarButton className="text-base font-semibold">
              {f.buy} <ArrowRightIcon className="size-4" />
            </BuyStarButton>
            <a href={zalo || SITE.contact.fanpage} target="_blank" rel="noopener noreferrer" className={outlineOnLight}>
              {zalo ? f.zalo : f.fanpage}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function Footer({ locale = "vi" }: { locale?: Locale }) {
  const f = getLanding(locale).footer;
  const { zalo, phone, email } = SITE.contact;
  return (
    <footer className="bg-ink py-12 text-white/70">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Image src="/brand/logo-light.png" alt="Nextgency" width={640} height={105} className="h-7 w-auto" />
            <p className="mt-4 text-sm leading-relaxed">{f.tagline}</p>
          </div>
          <div className="grid gap-2 text-sm">
            <p className="font-semibold text-white">{f.contact}</p>
            {zalo && <p>Zalo: {zalo}</p>}
            {phone && <p>{f.hotline}: {phone}</p>}
            {email && <p>Email: {email}</p>}
            <a href={SITE.url} className="hover:text-white">{SITE.url.replace(/^https?:\/\//, "")}</a>
          </div>
        </div>
        <nav aria-label={f.policiesLabel} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
          {f.policies.map((p) => (
            <Link key={p.href} href={p.href} hrefLang="vi" className="hover:text-white">{p.label}</Link>
          ))}
        </nav>
        <div className="mt-6 text-xs leading-relaxed text-white/50">
          {f.policiesNote && <p className="mb-1">{f.policiesNote}</p>}
          <p>{f.copyright}</p>
          <p className="mt-1">{f.trademark}</p>
        </div>
      </Container>
    </footer>
  );
}
