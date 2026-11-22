import type { ResourceKey } from "@/lib/resources";

export type Locale = "vi" | "en";

/** Đường dẫn trang chủ theo ngôn ngữ: tiếng Việt ở "/", tiếng Anh ở "/en". */
export const HOME_PATH: Record<Locale, string> = { vi: "/", en: "/en" };

/**
 * Chuỗi "rich" trong nội dung landing hỗ trợ cú pháp tối giản:
 * **in đậm**, `mã`, [chữ hiển thị](/duong-dan).
 */
export type Rich = string;

/** Kịch bản khung chat minh hoạ ở hero (components/landing/hero-chat.tsx). */
export type ChatBody =
  | { kind: "rank"; rows: { label: string; value: number; tag?: "top" | "stop" }[]; hint: string }
  | { kind: "split"; good: { label: string; value: string; pct: number }; bad: { label: string; value: string }; note: string; ask: string; done: string }
  | { kind: "bullets"; items: string[] };

export type ChatScenario = {
  chip: string;
  question: string;
  tools: [brand: string, text: string][];
  intro: string;
  body: ChatBody;
};

export type GuideBlock =
  | { type: "steps"; items: Rich[] }
  | { type: "checks"; items: Rich[] }
  | { type: "tip"; text: Rich; tone?: "info" | "warn" }
  | { type: "links"; groups: { title: string; list: ResourceKey }[] };

export type GuideTab = {
  id: "order" | "github" | "vps" | "domain" | "ai";
  label: string;
  blocks: GuideBlock[];
};
