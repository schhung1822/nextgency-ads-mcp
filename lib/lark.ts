import "server-only";
import { createHmac } from "node:crypto";

/**
 * Gửi thông báo vào nhóm Lark qua Custom Bot webhook.
 * LARK_WEBHOOK_URL: https://open.larksuite.com/open-apis/bot/v2/hook/xxxx (hoặc open.feishu.cn)
 * LARK_WEBHOOK_SECRET: (tuỳ chọn) nếu bot bật "Xác minh chữ ký".
 */

export type LarkTone = "green" | "orange" | "blue" | "red";

export type LarkField = { label: string; value: string; short?: boolean };

export async function sendLarkCard(opts: {
  title: string;
  tone: LarkTone;
  fields: LarkField[];
  footer?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.LARK_WEBHOOK_URL;
  if (!url) return { ok: false, error: "LARK_WEBHOOK_URL chưa được cấu hình" };

  const body: Record<string, unknown> = {
    msg_type: "interactive",
    card: {
      config: { wide_screen_mode: true },
      header: { template: opts.tone, title: { tag: "plain_text", content: opts.title } },
      elements: [
        {
          tag: "div",
          fields: opts.fields.map((f) => ({
            is_short: f.short ?? true,
            text: { tag: "lark_md", content: `**${f.label}**\n${escapeMd(f.value)}` },
          })),
        },
        ...(opts.footer
          ? [{ tag: "note", elements: [{ tag: "plain_text", content: opts.footer }] }]
          : []),
      ],
    },
  };

  const secret = process.env.LARK_WEBHOOK_SECRET;
  if (secret) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    body.timestamp = timestamp;
    body.sign = createHmac("sha256", `${timestamp}\n${secret}`).update("").digest("base64");
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { code?: number; StatusCode?: number; msg?: string };
    const code = json.code ?? json.StatusCode ?? 0;
    if (!res.ok || code !== 0) {
      return { ok: false, error: `Lark ${res.status} code=${code} ${json.msg ?? ""}`.trim() };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// lark_md hiểu markdown cơ bản (kể cả <at>, [link](url)); bỏ các ký tự đó khỏi chữ người dùng nhập.
// Giữ "_" và "@" để email vẫn đọc được.
function escapeMd(s: string): string {
  return s.replace(/[*`~<>[\]]/g, "").slice(0, 500) || "—";
}
