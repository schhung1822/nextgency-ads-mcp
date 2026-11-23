"use client";

import { useSyncExternalStore } from "react";

/**
 * Lựa chọn cookie của khách trên trang quốc tế (/global):
 *   "all"        chấp nhận cả cookie đo lường / quảng cáo (Google Tag Manager, Meta Pixel)
 *   "essential"  chỉ cookie cần thiết
 *   "none"       chưa chọn
 *   "unknown"    chưa đọc được (đang render phía server / chưa hydrate)
 * Lưu trong localStorage (khoá "cookie_choice"); trình duyệt chặn localStorage thì coi như chưa chọn.
 */
export type Consent = "all" | "essential" | "none" | "unknown";

const KEY = "cookie_choice";
const CHANGE = "ng-consent-change";
const OPEN = "ng-consent-open";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : "none";
  } catch {
    return "none";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => "unknown");
}

export function setConsent(choice: "all" | "essential") {
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    /* localStorage bị chặn — lựa chọn chỉ có hiệu lực tới khi tải lại trang */
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** Mở lại thanh chọn cookie (nút "Cookie settings" ở chân trang). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN));
}

export function onConsentSettingsOpen(cb: () => void) {
  window.addEventListener(OPEN, cb);
  return () => window.removeEventListener(OPEN, cb);
}
