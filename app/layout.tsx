import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono, Hubot_Sans } from "next/font/google";
import { AnalyticsNoscript, AnalyticsScripts } from "@/components/analytics/analytics";
import { Toaster } from "@/components/ui/sonner";
import { SITE, formatVnd } from "@/lib/site";
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

const title = `${SITE.productName}: ${SITE.tagline} | Nextgency`;
const description = `Hỏi AI bằng tiếng Việt: video nào ra khách, tiền quảng cáo đang phí ở đâu, đối thủ đang làm gì. Ads MCP Simple kết nối AI với quảng cáo Facebook, TikTok, Google; có Nextgency hỗ trợ cài đặt. Trọn bộ ${formatVnd(SITE.price)}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  openGraph: { title, description, type: "website", locale: "vi_VN", siteName: "Nextgency" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#060614",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${hubot.variable} ${archivo.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <AnalyticsNoscript />
        {children}
        <Toaster position="top-center" />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
