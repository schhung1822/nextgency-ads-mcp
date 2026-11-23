import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Hubot_Sans } from "next/font/google";
import { AnalyticsNoscript, AnalyticsScripts } from "@/components/analytics/analytics";
import { Toaster } from "@/components/ui/sonner";
import { getLanding } from "@/lib/landing";
import { SITE } from "@/lib/site";
import "./globals.css";

const hubot = Hubot_Sans({
  variable: "--font-hubot",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext", "vietnamese"],
  display: "swap",
});

const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Mặc định là nội dung tiếng Việt; trang /en tự ghi đè title, description, openGraph.
const { title, description, ogLocale } = getLanding("vi").meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  openGraph: { title, description, type: "website", locale: ogLocale, alternateLocale: ["en_US"], siteName: "Nextgency" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#060614",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" className={`${hubot.variable} ${archivo.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <AnalyticsNoscript />
        {children}
        <Toaster position="top-center" />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
