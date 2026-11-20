import { CheckoutProvider } from "@/components/checkout/checkout";
import { Guide } from "@/components/landing/guide";
import { SiteHeader } from "@/components/landing/header";
import {
  Apify,
  Audience,
  Faq,
  Features,
  FinalCta,
  Footer,
  Hero,
  Includes,
  Pricing,
  Setup,
  SkillSection,
  Stats,
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
        <Audience />
        <Features />
        <Apify />
        <SkillSection />
        <Setup />
        <Guide />
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
