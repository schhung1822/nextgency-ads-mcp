import { existsSync } from "node:fs";
import path from "node:path";
import { HtmlLang } from "@/components/landing/html-lang";
import { plainText } from "@/lib/landing";
import { G } from "@/lib/global/copy";
import { GLOBAL, GLOBAL_PRICE_CENTS, SITE } from "@/lib/site";
import { GlobalFooter } from "./footer";
import { GlobalHeader } from "./header";
import { AdsAi, Benefits, Buy, Different, GlobalFaq, GlobalFinal, GlobalHero, GlobalVideo, Problem, Setup, Who } from "./sections";

/**
 * Trang landing quốc tế (/global): tiếng Anh, thanh toán PayPal, giá USD.
 * Mục demo video chỉ hiện khi đã có file public/global/ads-mcp-demo.mp4 (thêm file rồi deploy lại là tự xuất hiện).
 */
export function GlobalPage() {
  const hasDemo = existsSync(path.join(process.cwd(), "public", G.video.src));
  const url = new URL(GLOBAL.path, SITE.url).toString();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: SITE.productName,
      description: G.meta.description,
      inLanguage: "en",
      url,
      brand: { "@type": "Brand", name: "Noti" },
      offers: {
        "@type": "Offer",
        price: (GLOBAL_PRICE_CENTS / 100).toFixed(2),
        priceCurrency: GLOBAL.currency,
        availability: "https://schema.org/InStock",
        url: `${url}#buy`,
        seller: { "@type": "Organization", name: "Nextgency" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "en",
      mainEntity: G.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
      })),
    },
  ];

  return (
    <div lang="en">
      <HtmlLang lang="en" />
      <GlobalHeader hasDemo={hasDemo} />
      <main>
        <GlobalHero hasDemo={hasDemo} />
        {hasDemo && <GlobalVideo />}
        <Problem />
        <Different />
        <Benefits />
        <AdsAi />
        <Who />
        <Setup />
        <Buy />
        <GlobalFaq />
        <GlobalFinal />
      </main>
      <GlobalFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
