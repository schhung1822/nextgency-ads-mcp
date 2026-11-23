import { after, NextResponse } from "next/server";
import { globalOrderSchema } from "@/lib/global-order-schema";
import { adminSetStatus, createOrder, getOrder, isPersistent, rateLimit, setPaypalOrderId, type Order } from "@/lib/orders";
import { createPaypalOrder, paypalConfigured } from "@/lib/paypal";
import { generateOrderCode } from "@/lib/sepay";
import { reportRegistration } from "@/lib/server-tracking";
import { GLOBAL, GLOBAL_PRICE_CENTS, SITE } from "@/lib/site";
import { sanitizeMetaIds } from "@/lib/tracking";
import { deliverOrderEvent } from "@/lib/webhooks";

const noStore = { "Cache-Control": "no-store" };

/**
 * Bước 1 của thanh toán PayPal (trang /global): nút PayPal ở trình duyệt gọi route này trong `createOrder`.
 * Kiểm tra thông tin khách → lưu đơn "pending" (USD) vào MySQL → tạo đơn PayPal → trả về ID đơn PayPal.
 * Giá luôn do server đặt (GLOBAL_PRICE_CENTS), client không gửi giá lên.
 */
export async function POST(request: Request) {
  if (!paypalConfigured) {
    return NextResponse.json(
      { error: "Checkout is not available right now. Please email us and we'll help you complete your order." },
      { status: 503, headers: noStore },
    );
  }
  // Đơn hàng lưu trên MySQL. Chưa có DB thì từ chối thay vì nhận tiền mà mất thông tin khách.
  if (!isPersistent) {
    console.error("[paypal/orders] Thiếu DATABASE_URL — chưa cấu hình MySQL.");
    return NextResponse.json(
      { error: "Checkout is under maintenance. Please email us and we'll help you complete your order." },
      { status: 503, headers: noStore },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await rateLimit(`pporder:${ip}`, 10, 600))) {
    return NextResponse.json({ error: "You're doing that too fast. Please try again in a few minutes." }, { status: 429, headers: noStore });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: noStore });
  }

  const parsed = globalOrderSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ error: "Please check your details.", fieldErrors }, { status: 400, headers: noStore });
  }
  const { name, email, country, github, note, marketingOptIn, trackConsent } = parsed.data;

  let code: string | null = null;
  try {
    for (let i = 0; i < 5 && !code; i++) {
      const candidate = generateOrderCode();
      if (
        await createOrder({
          code: candidate,
          name,
          email,
          phone: "", // trang quốc tế không thu số điện thoại — hỗ trợ qua email
          github,
          note,
          currency: GLOBAL.currency,
          amount: GLOBAL_PRICE_CENTS,
          country,
          marketingOptIn,
          trackConsent,
        })
      ) {
        code = candidate;
      }
    }
  } catch (e) {
    console.error("[paypal/orders] lỗi DB khi tạo đơn (đã chạy `npm run db:migrate` chưa?)", e);
    return NextResponse.json({ error: "We couldn't create your order. Please try again." }, { status: 500, headers: noStore });
  }
  if (!code) {
    return NextResponse.json({ error: "We couldn't create your order. Please try again." }, { status: 500, headers: noStore });
  }
  const finalCode = code;

  let paypalOrderId: string;
  try {
    ({ id: paypalOrderId } = await createPaypalOrder({
      code: finalCode,
      amountMinor: GLOBAL_PRICE_CENTS,
      currency: GLOBAL.currency,
      description: `${SITE.productName} (one-time purchase)`,
    }));
    await setPaypalOrderId(finalCode, paypalOrderId);
  } catch (e) {
    console.error("[paypal/orders] không tạo được đơn PayPal", finalCode, e);
    // Đơn nội bộ chưa có thanh toán nào → đánh dấu hủy để không nằm lại như đơn chờ.
    await adminSetStatus(finalCode, "cancelled", "Không tạo được đơn PayPal").catch(() => {});
    return NextResponse.json({ error: "We couldn't reach PayPal. Please try again in a moment." }, { status: 502, headers: noStore });
  }

  after(async () => {
    const created: Order | null = await getOrder(finalCode).catch(() => null);
    if (!created) return;
    await deliverOrderEvent("created", created);
    // Ngữ cảnh trình duyệt được lưu lại để lúc thanh toán vẫn báo Purchase đúng người (chỉ khi khách đã đồng ý cookie).
    await reportRegistration(created, {
      ...sanitizeMetaIds((body as { tracking?: unknown } | null)?.tracking),
      ip: ip === "unknown" ? undefined : ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });
  });

  return NextResponse.json({ id: paypalOrderId, code: finalCode }, { headers: noStore });
}
