"use client";

import { useEffect } from "react";

/** Đặt thuộc tính lang của <html> theo trang (layout gốc mặc định lang="vi"; trang /en và /global cần "en"). */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.lang;
    root.lang = lang;
    return () => {
      root.lang = prev;
    };
  }, [lang]);
  return null;
}
