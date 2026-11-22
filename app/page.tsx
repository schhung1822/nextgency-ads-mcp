import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { vi: "/", en: "/en", "x-default": "/" },
  },
};

export default function Home() {
  return <LandingPage locale="vi" />;
}
