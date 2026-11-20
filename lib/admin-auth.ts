import "server-only";
import { timingSafeEqual } from "node:crypto";

/** So sánh header `Authorization: Bearer <secret>` với secret trong env, theo thời gian cố định. */
export function bearerMatches(header: string | null, secret: string | undefined): boolean {
  if (!secret || secret.length < 16 || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header.trim());
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Admin API: ADMIN_TOKEN (>= 16 ký tự). Chưa đặt = tắt toàn bộ admin API. */
export const isAdminRequest = (request: Request) => bearerMatches(request.headers.get("authorization"), process.env.ADMIN_TOKEN);

/** Cron: CRON_SECRET (Vercel Cron tự gửi header này) hoặc ADMIN_TOKEN (để bạn gọi tay / crontab trên VPS). */
export const isCronRequest = (request: Request) =>
  bearerMatches(request.headers.get("authorization"), process.env.CRON_SECRET) || isAdminRequest(request);
