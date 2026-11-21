import { CheckoutProvider } from "@/components/checkout/checkout";
import { Guide } from "@/components/landing/guide";
import { SiteHeader } from "@/components/landing/header";
import {
  Apify,
  Audience,
  Explainer,
  Faq,
  Features,
  FinalCta,
  Footer,
  Hero,
  Includes,
  Personas,
  Pricing,
  Setup,
  SkillSection,
  Stats,
  Team,
  UseCases,
  faqJsonLd,
} from "@/components/landing/sections";
import { SITE } from "@/lib/site";

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: SITE.productName,
  description: SITE.tagline,
  brand: { "@type": "Brand", name: "Noti" },
  offers: {
    "@type": "Offer",
    price: SITE.price,
    priceCurrency: "VND",
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "Nextgency" },
  },
};

export default function Home() {
  return (
    <CheckoutProvider>
      <SiteHeader />
      <main>
        <Hero />
        <Stats />
        <Team />
        <Personas />
        <Explainer />
        <UseCases />
        <Features />
        <Apify />
        <SkillSection />
        <Setup />
        <Guide />
        <Audience />
        <Includes />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, faqJsonLd]).replace(/</g, "\u003c") }}
      />
    </CheckoutProvider>
  );
}
