import type { Metadata } from "next";
import { GlobalPage } from "@/components/global/global-page";
import { G } from "@/lib/global/copy";
import { GLOBAL } from "@/lib/site";

const { title, description } = G.meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: GLOBAL.path },
  openGraph: { title, description, type: "website", locale: "en_US", siteName: "Nextgency", url: GLOBAL.path },
  twitter: { card: "summary_large_image", title, description },
};

export default function Global() {
  return <GlobalPage />;
}
