import { after, NextResponse } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { getOrder } from "@/lib/orders";
import { CODE_DIGITS, CODE_PREFIX } from "@/lib/sepay";

const noStore = { "Cache-Control": "no-store" };

// Chỉ trả về trạng thái — không lộ thông tin khách hàng.
export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[code]">) {
  const { code: raw } = await ctx.params;
  const code = raw.toUpperCase();
  if (!new RegExp(`^${CODE_PREFIX}\\d{${CODE_DIGITS}}$`).test(code)) {
    return NextResponse.json({ status: "not_found" }, { status: 404, headers: noStore });
  }

  let order;
  try {
    order = await getOrder(code);
  } catch (e) {
    console.error("[orders/status] lỗi DB", e);
    return NextResponse.json({ status: "unavailable" }, { status: 503, headers: noStore });
  }
  if (!order) return NextResponse.json({ status: "not_found" }, { status: 404, headers: noStore });

  // Đơn đã "paid" (kể cả do admin đổi tay) nhưng chưa chạy các bước hậu thanh toán → chạy ngay, không đợi cron.
  if (order.status === "paid" && order.fulfillState !== "done") {
    after(() => fulfillOrder(code));
  }

  return NextResponse.json(
    {
      // 'cancelled' hiển thị như chưa thanh toán cho khách
      status: order.status === "cancelled" ? "pending" : order.status,
      invite: order.invite?.status ?? null,
    },
    { headers: noStore },
  );
}
