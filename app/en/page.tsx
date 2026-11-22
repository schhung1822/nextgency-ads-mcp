import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { getLanding } from "@/lib/landing";

const { title, description, ogLocale } = getLanding("en").meta;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/en",
    languages: { vi: "/", en: "/en", "x-default": "/" },
  },
  openGraph: { title, description, type: "website", locale: ogLocale, alternateLocale: ["vi_VN"], siteName: "Nextgency", url: "/en" },
  twitter: { card: "summary_large_image", title, description },
};

export default function EnglishHome() {
  return <LandingPage locale="en" />;
}
