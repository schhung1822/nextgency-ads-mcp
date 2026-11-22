import { BotIcon, CheckIcon, ExternalLinkIcon, GitBranchIcon, GlobeIcon, QrCodeIcon, ServerIcon, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LandingDict } from "@/lib/landing";
import type { GuideBlock, GuideTab } from "@/lib/landing/types";
import { HAS_AFFILIATE, RESOURCES, type Resource } from "@/lib/resources";
import { cn } from "@/lib/utils";
import { AnimatedHeading } from "./fx";
import { Reveal } from "./reveal";
import { Rich } from "./rich";

type GuideDict = LandingDict["guide"];

const TAB_ICONS: Record<GuideTab["id"], LucideIcon> = {
  order: QrCodeIcon,
  github: GitBranchIcon,
  vps: ServerIcon,
  domain: GlobeIcon,
  ai: BotIcon,
};

function Block({ block, g, en }: { block: GuideBlock; g: GuideDict; en: boolean }) {
  switch (block.type) {
    case "steps":
      return (
        <ol className="grid gap-4">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="bg-brand-button mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white">{i + 1}</span>
              <span className="text-[15px] leading-relaxed text-navy/90"><Rich text={item} /></span>
            </li>
          ))}
        </ol>
      );
    case "checks":
      return (
        <ul className="grid gap-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-navy/90">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-iris">
                <CheckIcon className="size-3.5" strokeWidth={3} />
              </span>
              <span><Rich text={item} /></span>
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <p
          className={cn(
            "rounded-xl border p-3.5 text-sm leading-relaxed",
            block.tone === "warn" ? "border-amber-300 bg-amber-50 text-amber-900" : "border-iris/20 bg-secondary/60 text-secondary-foreground",
          )}
        >
          <Rich text={block.text} />
        </p>
      );
    case "links":
      return (
        <div className={cn("grid gap-6", block.groups.length > 1 && "lg:grid-cols-2")}>
          {block.groups.map((group) => (
            <Links key={group.title} title={group.title} items={RESOURCES[group.list]} g={g} en={en} />
          ))}
        </div>
      );
  }
}

function Links({ title, items, g, en }: { title: string; items: readonly Resource[]; g: GuideDict; en: boolean }) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold text-navy">{title}</p>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {items.map((r) => (
          <li key={r.name}>
            <a
              href={r.href}
              target="_blank"
              rel={r.affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
              className="group flex h-full items-start justify-between gap-3 rounded-xl border bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-iris/40 hover:shadow-md hover:shadow-iris/10"
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 font-semibold text-navy">
                  {(en && r.nameEn) || r.name}
                  {r.affiliate && <Badge variant="secondary" className="h-4.5 px-1.5 text-[10px] text-iris">{g.affiliateBadge}</Badge>}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{en ? r.noteEn : r.note}</span>
              </span>
              <ExternalLinkIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-iris" aria-hidden />
              <span className="sr-only">{g.newTab}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Guide({ t }: { t: LandingDict }) {
  const g = t.guide;
  const en = t.locale === "en";
  return (
    <section id="huong-dan" className="scroll-mt-16 bg-brand-soft py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <Reveal className="mx-auto mb-10 max-w-4xl text-center sm:mb-14">
          <p className="mb-3 font-archivo text-xs font-semibold tracking-[0.2em] text-iris uppercase">{g.eyebrow}</p>
          <AnimatedHeading title={g.title} accent={g.accent} />
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{g.lead}</p>
        </Reveal>

        <Reveal>
          <Tabs defaultValue={g.tabs[0]?.id ?? "order"} className="gap-5">
            <TabsList className="h-auto! w-full flex-wrap justify-start gap-1.5 rounded-2xl border bg-white p-1.5 sm:justify-center">
              {g.tabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id];
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="h-auto! flex-none gap-2 rounded-xl px-3.5 py-2 text-sm text-muted-foreground data-active:bg-iris! data-active:text-white! data-active:shadow-md data-active:shadow-iris/30"
                  >
                    <Icon /> {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur sm:p-8">
              {g.tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="grid gap-6">
                  {tab.blocks.map((block, i) => (
                    <Block key={i} block={block} g={g} en={en} />
                  ))}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </Reveal>

        {HAS_AFFILIATE && (
          <p className="mx-auto mt-6 max-w-[960px] text-center text-xs leading-relaxed text-muted-foreground">{g.affiliateNote}</p>
        )}
      </div>
    </section>
  );
}
