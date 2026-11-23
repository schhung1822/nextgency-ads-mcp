"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onConsentSettingsOpen, setConsent, useConsent } from "@/lib/consent";
import { GLOBAL } from "@/lib/site";

/**
 * Thanh chọn cookie của trang quốc tế. Hiện khi khách chưa chọn, hoặc khi bấm "Cookie settings" ở chân trang.
 * Chỉ khi chọn "Accept all" thì Google Tag Manager / Meta Pixel mới được tải (xem components/analytics/consent-gate.tsx).
 */
export function ConsentBar() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => onConsentSettingsOpen(() => setReopened(true)), []);

  if (consent === "unknown") return null;
  if (consent !== "none" && !reopened) return null;

  const choose = (choice: "all" | "essential") => {
    setConsent(choice);
    setReopened(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/15 bg-ink/95 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:p-5"
    >
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-white/75">
        <p id="cookie-title" className="font-semibold text-white">Cookies</p>
        <p className="mt-1">
          We use essential cookies to run this page. With your permission we also use analytics and advertising cookies to
          measure our campaigns. See our{" "}
          <Link href={`${GLOBAL.path}/privacy#cookies`} className="font-medium text-sky underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
        <button
          type="button"
          onClick={() => choose("all")}
          className="bg-brand-button h-10 rounded-full px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="h-10 rounded-full border border-white/25 px-5 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
        >
          Reject non-essential
        </button>
      </div>
    </div>
  );
}
