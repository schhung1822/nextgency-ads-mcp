import { randomInt } from "node:crypto";
import { after, NextResponse } from "next/server";
import { consultInputSchema, labelOf } from "@/lib/consult-schema";
import { sendMetaEvent } from "@/lib/meta-capi";
import { notifyConsult, type ConsultLead } from "@/lib/notify";
import { ADS_RUNNER_OPTIONS, AD_BUDGET_OPTIONS, BUSINESS_OPTIONS } from "@/lib/order-schema";
import { rateLimit } from "@/lib/orders";
import { SITE } from "@/lib/site";
import { registrationEventId, sanitizeMetaIds } from "@/lib/tracking";

/**
 * Đăng ký tư vấn ở trang /auto-ads-ai: khách điền form → báo về nhóm Lark để đội ngũ liên hệ.
 * Không tạo đơn, không thanh toán, không cần SePay/MySQL (có MySQL thì dùng để giới hạn tần suất).
 * Lark là nơi duy nhất nhận thông tin khách, nên gửi Lark lỗi thì trả lỗi để khách gửi lại — không báo "đã nhận" suông.
 */

const noStore = { "Cache-Control": "no-store" };

const SEND_FAILED = "Chưa gửi được đăng ký. Vui lòng thử lại sau ít phút hoặc nhắn Zalo cho Nextgency.";

/** Mã tham chiếu của lượt đăng ký, VD TV12345678 — khác dạng mã đơn (NGX…) để không lẫn với đơn hàng. */
function generateRef(): string {
  let digits = "";
  for (let i = 0; i < 8; i++) digits += randomInt(0, 10);
  return "TV" + digits;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!(await rateLimit(`consult:${ip}`, 8, 600))) {
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

  const parsed = consultInputSchema.safeParse(body);
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

  if (!process.env.LARK_WEBHOOK_URL) {
    console.error("[consult] Thiếu LARK_WEBHOOK_URL — không có nơi nhận đăng ký tư vấn.");
    return NextResponse.json({ error: SEND_FAILED }, { status: 503, headers: noStore });
  }

  const { name, phone, email, business, adsRunner, adBudget } = parsed.data;
  const ref = generateRef();
  const lead: ConsultLead = {
    ref,
    name,
    phone,
    email,
    business: labelOf(BUSINESS_OPTIONS, business),
    adsRunner: labelOf(ADS_RUNNER_OPTIONS, adsRunner),
    adBudget: labelOf(AD_BUDGET_OPTIONS, adBudget),
  };

  // Thử lại một lần: thà nhóm Lark nhận trùng một thẻ còn hơn mất khách.
  let sent = await notifyConsult(lead);
  if (!sent.ok) sent = await notifyConsult(lead);
  if (!sent.ok) {
    console.error(`[consult] ${ref} không gửi được Lark: ${sent.error}`);
    return NextResponse.json({ error: SEND_FAILED }, { status: 502, headers: noStore });
  }

  // Hoàn tất đăng ký → báo Meta Conversions API (cùng event_id với Pixel trình duyệt để Meta gộp, không đếm đôi).
  const metaIds = sanitizeMetaIds((body as { tracking?: unknown } | null)?.tracking);
  const userAgent = request.headers.get("user-agent") ?? undefined;
  after(async () => {
    await sendMetaEvent({
      name: "CompleteRegistration",
      eventId: registrationEventId(ref),
      sourceUrl: `${SITE.url.replace(/\/$/, "")}/auto-ads-ai`,
      user: { email, phone, name, externalId: ref, ip: ip === "unknown" ? undefined : ip, userAgent, ...metaIds },
      custom: { content_name: SITE.productName, status: true },
    });
  });

  return NextResponse.json({ ok: true, ref }, { headers: noStore });
}
