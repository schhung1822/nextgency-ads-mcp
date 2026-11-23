import "server-only";
import type { RowDataPacket } from "mysql2/promise";
import { db } from "@/lib/db";
import { metaCapiConfigured, sendMetaEvent } from "@/lib/meta-capi";
import { isGlobalOrder, type Order } from "@/lib/orders";
import { GLOBAL, SITE } from "@/lib/site";
import { purchaseEventId, registrationEventId, type MetaBrowserIds } from "@/lib/tracking";

/**
 * Báo sự kiện chuyển đổi về Meta từ máy chủ (Conversions API).
 *  • reportRegistration — lúc khách tạo đơn (hoàn tất đăng ký)
 *  • reportPurchase     — khi đơn được xác nhận đã thanh toán (hoàn tất thanh toán)
 *
 * Lúc thanh toán (webhook SePay) khách có thể đã đóng trang, nên ngữ cảnh trình duyệt (IP, user-agent,
 * _fbp, _fbc) được lưu vào bảng `order_tracking` ngay khi tạo đơn. Bảng chưa tạo (chưa chạy migrate)
 * thì vẫn gửi được, chỉ thiếu các trường đó (Meta vẫn khớp được bằng email/SĐT đã băm).
 * Không hàm nào throw.
 */

export type OrderTrackingContext = MetaBrowserIds & { ip?: string; userAgent?: string };

const ITEM_ID = "ads-mcp-simple";

async function saveOrderTracking(code: string, ctx: OrderTrackingContext) {
  try {
    await db().execute(
      `INSERT INTO order_tracking (order_code, fbp, fbc, client_ip, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, ctx.fbp ?? null, ctx.fbc ?? null, ctx.ip?.slice(0, 64) ?? null, ctx.userAgent?.slice(0, 400) ?? null, new Date()],
    );
  } catch (e) {
    console.warn("[tracking] chưa lưu được order_tracking (đã chạy `npm run db:migrate` chưa?):", (e as Error).message);
  }
}

async function loadOrderTracking(code: string): Promise<OrderTrackingContext> {
  try {
    const [rows] = await db().execute<RowDataPacket[]>(
      "SELECT fbp, fbc, client_ip, user_agent FROM order_tracking WHERE order_code = ? LIMIT 1",
      [code],
    );
    const r = rows[0];
    if (!r) return {};
    return {
      fbp: (r.fbp as string | null) ?? undefined,
      fbc: (r.fbc as string | null) ?? undefined,
      ip: (r.client_ip as string | null) ?? undefined,
      userAgent: (r.user_agent as string | null) ?? undefined,
    };
  } catch {
    return {};
  }
}

/** Trang mà khách đã đặt hàng (để Meta gắn đúng nguồn sự kiện). */
const sourceUrlOf = (o: Order) => (isGlobalOrder(o) ? `${SITE.url.replace(/\/$/, "")}${GLOBAL.path}` : SITE.url);

const userOf = (o: Order, ctx: OrderTrackingContext) => ({
  email: o.email,
  phone: o.phone,
  name: o.name,
  externalId: o.code,
  ip: ctx.ip,
  userAgent: ctx.userAgent,
  fbp: ctx.fbp,
  fbc: ctx.fbc,
});

/** Hoàn tất đăng ký: đơn vừa được tạo (chưa thanh toán). */
export async function reportRegistration(order: Order, ctx: OrderTrackingContext): Promise<void> {
  // Khách quốc tế chưa đồng ý cookie đo lường/quảng cáo thì không báo gì về Meta.
  if (!metaCapiConfigured || !order.trackConsent) return;
  try {
    await saveOrderTracking(order.code, ctx);
    await sendMetaEvent({
      name: "CompleteRegistration",
      eventId: registrationEventId(order.code),
      eventTime: Math.floor(new Date(order.createdAt).getTime() / 1000),
      sourceUrl: sourceUrlOf(order),
      user: userOf(order, ctx),
      custom: { content_name: SITE.productName, status: true },
    });
  } catch (e) {
    console.error("[tracking] reportRegistration", order.code, e);
  }
}

/** Hoàn tất thanh toán: đơn đã nhận đủ tiền. Gọi nhiều lần vẫn an toàn (cùng event_id nên Meta gộp lại). */
export async function reportPurchase(order: Order): Promise<void> {
  if (!metaCapiConfigured || !order.trackConsent) return;
  try {
    const ctx = await loadOrderTracking(order.code);
    await sendMetaEvent({
      name: "Purchase",
      eventId: purchaseEventId(order.code),
      eventTime: order.paidAt ? Math.floor(new Date(order.paidAt).getTime() / 1000) : undefined,
      sourceUrl: sourceUrlOf(order),
      user: userOf(order, ctx),
      custom: {
        // Đơn USD lưu theo cent → đổi về đô la cho Meta.
        value: isGlobalOrder(order) ? order.amount / 100 : order.amount,
        currency: order.currency,
        content_name: SITE.productName,
        content_type: "product",
        content_ids: [ITEM_ID],
        order_id: order.code,
      },
    });
  } catch (e) {
    console.error("[tracking] reportPurchase", order.code, e);
  }
}
