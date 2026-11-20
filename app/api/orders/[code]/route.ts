import { NextResponse } from "next/server";
import { CODE_DIGITS, CODE_PREFIX } from "@/lib/sepay";
import { getOrder } from "@/lib/store";

const noStore = { "Cache-Control": "no-store" };

// Chỉ trả về trạng thái — không lộ thông tin khách hàng.
export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[code]">) {
  const { code: raw } = await ctx.params;
  const code = raw.toUpperCase();
  if (!new RegExp(`^${CODE_PREFIX}\\d{${CODE_DIGITS}}$`).test(code)) {
    return NextResponse.json({ status: "not_found" }, { status: 404, headers: noStore });
  }
  const order = await getOrder(code);
  if (!order) return NextResponse.json({ status: "not_found" }, { status: 404, headers: noStore });
  return NextResponse.json({ status: order.status, invite: order.invite?.status ?? null }, { headers: noStore });
}
