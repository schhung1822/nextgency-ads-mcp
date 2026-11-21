import { after, NextResponse } from "next/server";
import { createOrder, getOrder, isPersistent, rateLimit, type Order } from "@/lib/orders";
import { orderInputSchema } from "@/lib/order-schema";
import { buildPaymentInfo, generateOrderCode, isSepayConfigured } from "@/lib/sepay";
import { reportRegistration } from "@/lib/server-tracking";
import { SITE } from "@/lib/site";
import { sanitizeMetaIds } from "@/lib/tracking";
import { deliverOrderEvent } from "@/lib/webhooks";

const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isSepayConfigured()) {
    return NextResponse.json(
      { error: "Cổng thanh toán chưa được cấu hình. Vui lòng liên hệ Nextgency để được hỗ trợ." },
      { status: 503, headers: noStore },
    );
  }

  // Đơn hàng lưu trên MySQL. Chưa có DB thì từ chối tạo đơn thay vì nhận tiền mà mất thông tin khách.
  if (!isPersistent) {
    console.error("[orders] Thiếu DATABASE_URL — chưa cấu hình MySQL.");
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
  let code: string | null = null;
  try {
    for (let i = 0; i < 5 && !code; i++) {
      const candidate = generateOrderCode();
      if (await createOrder({ ...data, code: candidate, amount })) code = candidate;
    }
  } catch (e) {
    console.error("[orders] lỗi DB khi tạo đơn", e);
    return NextResponse.json({ error: "Không tạo được đơn hàng, vui lòng thử lại." }, { status: 500, headers: noStore });
  }
  if (!code) {
    return NextResponse.json({ error: "Không tạo được đơn hàng, vui lòng thử lại." }, { status: 500, headers: noStore });
  }

  const finalCode = code;
  after(async () => {
    const created: Order | null = await getOrder(finalCode).catch(() => null);
    if (created) await deliverOrderEvent("created", created);
  });

  // Hoàn tất đăng ký → báo Meta Conversions API (cùng event_id với Pixel trình duyệt). Ngữ cảnh trình duyệt
  // được lưu lại để lúc thanh toán (khách có thể đã đóng trang) vẫn báo Purchase đúng người.
  const trackingCtx = {
    ...sanitizeMetaIds((body as { tracking?: unknown } | null)?.tracking),
    ip: ip === "unknown" ? undefined : ip,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
  after(async () => {
    const created: Order | null = await getOrder(finalCode).catch(() => null);
    if (created) await reportRegistration(created, trackingCtx);
  });

  return NextResponse.json(
    {
      code,
      amount,
      payment: buildPaymentInfo(code, amount),
      tracking: true,
    },
    { headers: noStore },
  );
}
