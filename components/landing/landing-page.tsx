import { CheckoutProvider } from "@/components/checkout/checkout";
import { HOME_PATH, getLanding, plainText, type Locale } from "@/lib/landing";
import { SITE } from "@/lib/site";
import { Guide } from "./guide";
import { HtmlLang, SiteHeader } from "./header";
import {
  Compare,
  Explainer,
  Faq,
  Features,
  FinalCta,
  Fit,
  Footer,
  Hero,
  Paths,
  Personas,
  Pricing,
  Setup,
  SkillSection,
  Stats,
  Team,
  UseCases,
  Weekly,
} from "./sections";

/** Toàn bộ landing page theo ngôn ngữ: "vi" ở "/", "en" ở "/en". */
export function LandingPage({ locale }: { locale: Locale }) {
  const t = getLanding(locale);
  const other: Locale = locale === "vi" ? "en" : "vi";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: SITE.productName,
      description: t.meta.description,
      inLanguage: locale,
      url: new URL(HOME_PATH[locale], SITE.url).toString(),
      brand: { "@type": "Brand", name: "Noti" },
      offers: {
        "@type": "Offer",
        price: SITE.price,
        priceCurrency: "VND",
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "Nextgency" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: t.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
      })),
    },
  ];

  return (
    <div lang={locale}>
      {locale !== "vi" && <HtmlLang lang={locale} />}
      <CheckoutProvider locale={locale}>
        <SiteHeader t={t.nav} switchHref={HOME_PATH[other]} />
        <main>
          <Hero t={t} />
          <Stats t={t} />
          <Compare t={t} />
          <Team t={t} />
          <Weekly t={t} />
          <Personas t={t} />
          <Explainer t={t} />
          <UseCases t={t} />
          <Paths t={t} />
          <Features t={t} />
          <SkillSection t={t} />
          <Setup t={t} />
          <Fit t={t} />
          <Pricing t={t} />
          <Faq t={t} />
          <Guide t={t} />
          <FinalCta t={t} />
        </main>
        <Footer locale={locale} />
      </CheckoutProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
