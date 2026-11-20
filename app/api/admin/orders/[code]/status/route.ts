import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-auth";
import { fulfillOrder } from "@/lib/fulfill";
import { adminSetStatus, getOrder, summarizeOrder } from "@/lib/orders";

const noStore = { "Cache-Control": "no-store" };
const bodySchema = z.object({
  status: z.enum(["pending", "underpaid", "paid", "cancelled"]),
  note: z.string().max(255).optional(),
});

/**
 * Đổi trạng thái đơn thủ công.
 *   POST /api/admin/orders/NGX12345678/status
 *   Authorization: Bearer <ADMIN_TOKEN>
 *   { "status": "paid", "note": "Khách chuyển khoản sai nội dung, đã đối soát" }
 *
 * Chuyển sang "paid" = xác nhận thành công bằng tay → hệ thống chạy ngay các bước còn lại
 * (mời GitHub, Lark, webhook order.paid) như khi thanh toán thật. Gọi lại nhiều lần vẫn an toàn.
 * (Sửa cột status trực tiếp trong DB cũng được — cron/lần khách mở trang sẽ nhặt và chạy các bước đó.)
 */
export async function POST(request: Request, ctx: RouteContext<"/api/admin/orders/[code]/status">) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });

  const { code } = await ctx.params;
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Body phải là JSON: { status: pending|underpaid|paid|cancelled, note?: string }" },
      { status: 400, headers: noStore },
    );
  }

  const order = await adminSetStatus(code.toUpperCase(), parsed.data.status, parsed.data.note);
  if (!order) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404, headers: noStore });

  let fulfillment: string | null = null;
  if (order.status === "paid") fulfillment = await fulfillOrder(order.code); // done | skipped | retry

  const fresh = fulfillment ? ((await getOrder(order.code)) ?? order) : order;
  return NextResponse.json({ ok: true, fulfillment, order: summarizeOrder(fresh) }, { headers: noStore });
}
