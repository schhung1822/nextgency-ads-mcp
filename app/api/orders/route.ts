import { after, NextResponse } from "next/server";
import { orderInputSchema } from "@/lib/order-schema";
import { buildPaymentInfo, generateOrderCode, isSepayConfigured } from "@/lib/sepay";
import { createOrderIfFree, isPersistent, rateLimit, type Order } from "@/lib/store";
import { SITE } from "@/lib/site";
import { deliverOrderEvent } from "@/lib/webhooks";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isSepayConfigured()) {
    return NextResponse.json(
      { error: "Cổng thanh toán chưa được cấu hình. Vui lòng liên hệ Nextgency để được hỗ trợ." },
      { status: 503, headers: noStore },
    );
  }

  // Thông tin khách chỉ được gửi về Lark khi đã thanh toán, nên bắt buộc phải lưu đơn được.
  // Không có Redis ở production thì từ chối tạo đơn thay vì nhận tiền mà mất thông tin khách.
  if (!isPersistent && process.env.NODE_ENV === "production") {
    console.error("[orders] Thiếu KV_REST_API_URL / KV_REST_API_TOKEN — chưa cấu hình Upstash Redis.");
    return NextResponse.json(
      { error: "Hệ thống đặt hàng đang được bảo trì. Vui lòng liên hệ Nextgency để được hỗ trợ." },
      { status: 503, headers: noStore },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await rateLimit(`order:${ip}`, 8, 600))) {
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút." },
      { status: 429, headers: noStore },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400, headers: noStore });
  }

  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json(
      { error: "Vui lòng kiểm tra lại thông tin.", fieldErrors },
      { status: 400, headers: noStore },
    );
  }

  const { website: _honeypot, consent: _consent, ...data } = parsed.data;
  void _honeypot;
  void _consent;

  // Giá luôn lấy từ server.
  const amount = SITE.price;
  let order: Order | null = null;
  for (let i = 0; i < 5 && !order; i++) {
    const candidate: Order = {
      ...data,
      code: generateOrderCode(),
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
      consentAt: new Date().toISOString(),
    };
    if (await createOrderIfFree(candidate)) order = candidate;
  }
  if (!order) {
    return NextResponse.json({ error: "Không tạo được đơn hàng, vui lòng thử lại." }, { status: 500, headers: noStore });
  }

  const created = order;
  after(() => deliverOrderEvent("created", created));

  return NextResponse.json(
    {
      code: order.code,
      amount: order.amount,
      payment: buildPaymentInfo(order.code, order.amount),
      tracking: true,
    },
    { headers: noStore },
  );
}
