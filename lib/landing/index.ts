import { en } from "./en";
import type { Locale } from "./types";
import { vi, type LandingDict } from "./vi";

export type { LandingDict } from "./vi";
export { HOME_PATH, type Locale } from "./types";

const LANDING: Record<Locale, LandingDict> = { vi, en };

export function getLanding(locale: Locale): LandingDict {
  return LANDING[locale];
}

/** Bỏ cú pháp rich (**đậm**, `mã`, [chữ](link)) để dùng trong JSON-LD / văn bản thuần. */
export function plainText(rich: string): string {
  return rich
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}
