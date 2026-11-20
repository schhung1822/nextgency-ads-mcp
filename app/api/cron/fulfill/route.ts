import { NextResponse } from "next/server";
import { isCronRequest } from "@/lib/admin-auth";
import { fulfillOrder } from "@/lib/fulfill";
import { listUnfulfilledCodes } from "@/lib/orders";

const noStore = { "Cache-Control": "no-store" };

/**
 * Nhặt các đơn đã "paid" nhưng chưa chạy xong các bước hậu thanh toán (do admin đổi trạng thái trong DB,
 * hoặc lần chạy trước bị lỗi/Lark lỗi) rồi chạy tiếp. Gọi mỗi phút:
 *   - Vercel Cron (Pro): xem vercel.json mẫu trong README (đặt CRON_SECRET, Vercel tự gửi header)
 *   - hoặc crontab trên VPS:  * * * * * curl -s -H "Authorization: Bearer $ADMIN_TOKEN" https://<domain>/api/cron/fulfill
 */
export async function GET(request: Request) {
  if (!isCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });

  const codes = await listUnfulfilledCodes(10);
  const results: Record<string, string> = {};
  for (const code of codes) results[code] = await fulfillOrder(code);
  return NextResponse.json({ processed: codes.length, results }, { headers: noStore });
}
