import "server-only";
import { randomInt, timingSafeEqual } from "node:crypto";

export const CODE_PREFIX = (process.env.SEPAY_CODE_PREFIX ?? "NGX").toUpperCase().replace(/[^A-Z0-9]/g, "");
export const CODE_DIGITS = 8;

export type PaymentInfo = {
  bank: string;
  accountNumber: string;
  accountName: string;
  qrUrl: string;
};

export function generateOrderCode(): string {
  let digits = "";
  for (let i = 0; i < CODE_DIGITS; i++) digits += randomInt(0, 10);
  return CODE_PREFIX + digits;
}

export function isSepayConfigured(): boolean {
  return Boolean(process.env.SEPAY_BANK && process.env.SEPAY_ACCOUNT_NUMBER);
}

export function buildPaymentInfo(code: string, amount: number): PaymentInfo {
  const bank = process.env.SEPAY_BANK ?? "";
  const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER ?? "";
  const accountName = process.env.SEPAY_ACCOUNT_NAME ?? "";
  const qr = new URL("https://qr.sepay.vn/img");
  qr.searchParams.set("acc", accountNumber);
  qr.searchParams.set("bank", bank);
  qr.searchParams.set("amount", String(amount));
  qr.searchParams.set("des", code);
  qr.searchParams.set("template", "compact");
  return { bank, accountNumber, accountName, qrUrl: qr.toString() };
}

/** SePay gửi header `Authorization: Apikey <key>` — so sánh thời gian cố định. */
export function verifyWebhookAuth(header: string | null): boolean {
  const key = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!key || !header) return false;
  const expected = Buffer.from(`Apikey ${key}`);
  const actual = Buffer.from(header.trim());
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export type SepayWebhookPayload = {
  id: number | string;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string;
  transferType?: "in" | "out";
  transferAmount?: number;
  accumulated?: number;
  subAccount?: string | null;
  referenceCode?: string;
  description?: string;
};

/**
 * Tìm các mã đơn có thể có trong giao dịch: `code` do SePay nhận diện + quét lại nội dung chuyển khoản
 * (ngân hàng đôi khi thêm/bớt khoảng trắng, hạ chữ hoa).
 */
export function extractCandidateCodes(payload: SepayWebhookPayload): string[] {
  const out = new Set<string>();
  const pattern = new RegExp(`${CODE_PREFIX}\\d{${CODE_DIGITS}}`, "g");
  const sources = [payload.code ?? "", payload.content ?? "", payload.description ?? ""];
  for (const src of sources) {
    const upper = src.toUpperCase();
    for (const m of upper.matchAll(pattern)) out.add(m[0]);
    for (const m of upper.replace(/[\s._-]/g, "").matchAll(pattern)) out.add(m[0]);
  }
  return [...out];
}
