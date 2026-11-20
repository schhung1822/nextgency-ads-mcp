import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listOrders, summarizeOrder, type OrderStatus } from "@/lib/orders";

const noStore = { "Cache-Control": "no-store" };
const STATUSES: OrderStatus[] = ["pending", "underpaid", "paid", "cancelled"];

/**
 * GET /api/admin/orders?status=pending&q=email-hoac-ma&limit=50&offset=0
 * Header: Authorization: Bearer <ADMIN_TOKEN>
 */
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });

  const sp = new URL(request.url).searchParams;
  const status = sp.get("status") as OrderStatus | null;
  if (status && !STATUSES.includes(status)) {
    return NextResponse.json({ error: `status phải là một trong: ${STATUSES.join(", ")}` }, { status: 400, headers: noStore });
  }
  const orders = await listOrders({
    status: status ?? undefined,
    q: sp.get("q")?.trim() || undefined,
    limit: Number(sp.get("limit") ?? 50),
    offset: Number(sp.get("offset") ?? 0),
  });
  return NextResponse.json({ count: orders.length, orders: orders.map(summarizeOrder) }, { headers: noStore });
}
