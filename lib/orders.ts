import "server-only";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { db, dbConfigured } from "@/lib/db";
import type { InviteResult, InviteStatus } from "@/lib/github";
import type { SepayWebhookPayload } from "@/lib/sepay";
import type { Currency } from "@/lib/site";

/** Lưu đơn hàng trên MySQL (xem db/schema.sql). */
export const isPersistent = dbConfigured;

export type OrderStatus = "pending" | "underpaid" | "paid" | "cancelled";
export type FulfillState = "pending" | "processing" | "done";
export type PaidVia = "sepay" | "manual" | "paypal";

export type Order = {
  code: string;
  status: OrderStatus;
  name: string;
  phone: string;
  email: string;
  github: string;
  note: string;
  /** Đơn vị nhỏ nhất của `currency` (VND: đồng, USD: cent). */
  currency: Currency;
  amount: number;
  paidAmount: number;
  paidAt?: string;
  paidVia?: PaidVia;
  transactionId?: string;
  createdAt: string;
  consentAt?: string;
  // Đơn quốc tế (PayPal)
  country?: string;
  marketingOptIn: boolean;
  /** false = khách chưa đồng ý cookie đo lường → không gửi sự kiện về Meta Conversions API. */
  trackConsent: boolean;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  payerEmail?: string;
  fulfillState: FulfillState;
  invite?: InviteResult;
  larkNotifiedAt?: string;
  hooks?: { paid?: { ok: boolean; at: string; attempts: number; error?: string } };
  adminNote?: string;
};

export type NewOrder = Pick<Order, "code" | "name" | "phone" | "email" | "github" | "note" | "amount"> &
  Partial<Pick<Order, "currency" | "country" | "marketingOptIn" | "trackConsent">>;

/** Đơn của trang quốc tế (không phải VND). Dùng để chọn nội dung thông báo / sự kiện đo lường phù hợp. */
export const isGlobalOrder = (o: Pick<Order, "currency">) => o.currency !== "VND";

type Row = RowDataPacket & {
  code: string;
  status: OrderStatus;
  name: string;
  phone: string;
  email: string;
  github: string;
  note: string | null;
  // Các cột bổ sung cho đơn quốc tế: có thể chưa tồn tại nếu chưa chạy `npm run db:migrate` → luôn đọc có mặc định.
  currency?: string | null;
  country?: string | null;
  marketing_opt_in?: number | null;
  track_consent?: number | null;
  paypal_order_id?: string | null;
  paypal_capture_id?: string | null;
  payer_email?: string | null;
  amount: number;
  paid_amount: number;
  paid_at: Date | null;
  paid_via: PaidVia | null;
  transaction_id: string | null;
  consent_at: Date | null;
  fulfill_state: FulfillState;
  invite_status: InviteStatus | null;
  invite_message: string | null;
  invite_at: Date | null;
  lark_notified_at: Date | null;
  hook_paid_ok: number | null;
  hook_paid_at: Date | null;
  hook_paid_attempts: number | null;
  hook_paid_error: string | null;
  admin_note: string | null;
  created_at: Date;
};

const iso = (d: Date | null | undefined) => (d ? new Date(d).toISOString() : undefined);

function toOrder(r: Row): Order {
  return {
    code: r.code,
    status: r.status,
    name: r.name,
    phone: r.phone,
    email: r.email,
    github: r.github,
    note: r.note ?? "",
    currency: r.currency === "USD" ? "USD" : "VND",
    amount: Number(r.amount),
    paidAmount: Number(r.paid_amount),
    paidAt: iso(r.paid_at),
    paidVia: r.paid_via ?? undefined,
    transactionId: r.transaction_id ?? undefined,
    createdAt: iso(r.created_at)!,
    consentAt: iso(r.consent_at),
    country: r.country ?? undefined,
    marketingOptIn: r.marketing_opt_in === 1,
    trackConsent: r.track_consent == null ? true : r.track_consent === 1,
    paypalOrderId: r.paypal_order_id ?? undefined,
    paypalCaptureId: r.paypal_capture_id ?? undefined,
    payerEmail: r.payer_email ?? undefined,
    fulfillState: r.fulfill_state,
    invite: r.invite_status
      ? { status: r.invite_status, message: r.invite_message ?? undefined, at: iso(r.invite_at) ?? "" }
      : undefined,
    larkNotifiedAt: iso(r.lark_notified_at),
    hooks:
      r.hook_paid_ok === null
        ? undefined
        : {
            paid: {
              ok: r.hook_paid_ok === 1,
              at: iso(r.hook_paid_at) ?? "",
              attempts: r.hook_paid_attempts ?? 0,
              error: r.hook_paid_error ?? undefined,
            },
          },
    adminNote: r.admin_note ?? undefined,
  };
}

const isDup = (e: unknown) => (e as { code?: string })?.code === "ER_DUP_ENTRY";

/** Dạng rút gọn trả về cho admin API (không có dữ liệu thô). */
export function summarizeOrder(o: Order) {
  return {
    code: o.code,
    status: o.status,
    name: o.name,
    phone: o.phone,
    email: o.email,
    github: o.github,
    country: o.country ?? null,
    currency: o.currency,
    amount: o.amount,
    paidAmount: o.paidAmount,
    paidVia: o.paidVia ?? null,
    paidAt: o.paidAt ?? null,
    paypalOrderId: o.paypalOrderId ?? null,
    payerEmail: o.payerEmail ?? null,
    createdAt: o.createdAt,
    fulfillState: o.fulfillState,
    githubInvite: o.invite?.status ?? null,
    larkNotified: Boolean(o.larkNotifiedAt),
    hookPaid: o.hooks?.paid ?? null,
    adminNote: o.adminNote ?? null,
  };
}

/* ------------------------------------------------------------------ đơn hàng */

/** Tạo đơn. Trả false nếu trùng mã (để sinh mã khác). */
export async function createOrder(o: NewOrder): Promise<boolean> {
  const now = new Date();
  try {
    if (o.currency && o.currency !== "VND") {
      // Đơn quốc tế: dùng các cột bổ sung (cần đã chạy `npm run db:migrate`).
      await db().execute(
        `INSERT INTO orders (code, status, name, phone, email, github, note, currency, amount, country, marketing_opt_in, track_consent, consent_at, created_at)
         VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.code, o.name, o.phone, o.email, o.github, o.note || null, o.currency, o.amount,
          o.country ?? null, o.marketingOptIn ? 1 : 0, o.trackConsent === false ? 0 : 1, now, now,
        ],
      );
      return true;
    }
    // Đơn VND giữ nguyên câu lệnh cũ để không phụ thuộc việc đã migrate hay chưa.
    await db().execute(
      `INSERT INTO orders (code, status, name, phone, email, github, note, amount, consent_at, created_at)
       VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [o.code, o.name, o.phone, o.email, o.github, o.note || null, o.amount, now, now],
    );
    return true;
  } catch (e) {
    if (isDup(e)) return false;
    throw e;
  }
}

export async function getOrder(code: string): Promise<Order | null> {
  const [rows] = await db().execute<Row[]>("SELECT * FROM orders WHERE code = ? LIMIT 1", [code]);
  return rows[0] ? toOrder(rows[0]) : null;
}

/** Tìm đơn theo danh sách mã ứng viên (ưu tiên theo thứ tự). */
export async function findOrderByCodes(codes: string[]): Promise<Order | null> {
  for (const code of codes) {
    const o = await getOrder(code);
    if (o) return o;
  }
  return null;
}

export async function listOrders(opts: { status?: OrderStatus; q?: string; limit?: number; offset?: number }) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (opts.status) {
    where.push("status = ?");
    params.push(opts.status);
  }
  if (opts.q) {
    where.push("(code LIKE ? OR email LIKE ? OR phone LIKE ? OR name LIKE ? OR github LIKE ?)");
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    params.push(like, like, like, like, like);
  }
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 50), 1), 200);
  const offset = Math.max(Math.trunc(opts.offset ?? 0), 0);
  const [rows] = await db().query<Row[]>(
    `SELECT * FROM orders ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    params,
  );
  return rows.map(toOrder);
}

/* ------------------------------------------------------------ giao dịch SePay */

export type PaymentOutcome =
  | { outcome: "duplicate" } // giao dịch này đã xử lý rồi
  | { outcome: "paid"; order: Order } // đủ tiền → cần chạy các bước hậu thanh toán
  | { outcome: "underpaid"; order: Order } // chuyển thiếu
  | { outcome: "extra"; order: Order } // tiền vào đơn đã paid
  | { outcome: "cancelled"; order: Order }; // tiền vào đơn đã hủy

function ledgerParams(p: SepayWebhookPayload, orderCode: string | null) {
  return [
    String(p.id),
    orderCode,
    Math.round(Number(p.transferAmount) || 0),
    p.gateway ?? null,
    (p.referenceCode ?? "").slice(0, 100) || null,
    (p.content ?? p.description ?? "").slice(0, 500) || null,
    p.transactionDate ?? null,
    JSON.stringify(p),
    new Date(),
  ];
}

const LEDGER_SQL = `INSERT INTO sepay_transactions
  (id, order_code, amount, gateway, reference_code, content, tx_time, raw, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

/** Ghi giao dịch không khớp đơn nào. Trả false nếu giao dịch này đã ghi trước đó. */
export async function recordUnmatchedTransaction(p: SepayWebhookPayload): Promise<boolean> {
  try {
    await db().execute(LEDGER_SQL, ledgerParams(p, null));
    return true;
  } catch (e) {
    if (isDup(e)) return false;
    throw e;
  }
}

/**
 * Ghi nhận một giao dịch SePay vào đơn — trong một transaction DB:
 * ghi sổ giao dịch (chống trùng) + cộng dồn số tiền + đổi trạng thái đơn.
 */
export async function applySepayPayment(code: string, p: SepayWebhookPayload): Promise<PaymentOutcome> {
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    try {
      await conn.execute(LEDGER_SQL, ledgerParams(p, code));
    } catch (e) {
      await conn.rollback();
      if (isDup(e)) return { outcome: "duplicate" };
      throw e;
    }

    const [rows] = await conn.execute<Row[]>("SELECT * FROM orders WHERE code = ? FOR UPDATE", [code]);
    const row = rows[0];
    if (!row) {
      await conn.rollback();
      throw new Error(`Đơn ${code} không tồn tại`);
    }

    let outcome: PaymentOutcome["outcome"];
    if (row.status === "pending" || row.status === "underpaid") {
      const received = Number(row.paid_amount) + Math.round(Number(p.transferAmount) || 0);
      const full = received >= Number(row.amount);
      outcome = full ? "paid" : "underpaid";
      await conn.execute(
        `UPDATE orders SET paid_amount = ?, status = ?, transaction_id = ?, paid_via = 'sepay',
           paid_at = IF(? = 1, COALESCE(paid_at, UTC_TIMESTAMP()), paid_at)
         WHERE code = ?`,
        [received, full ? "paid" : "underpaid", String(p.id), full ? 1 : 0, code],
      );
    } else {
      outcome = row.status === "paid" ? "extra" : "cancelled";
    }
    await conn.commit();

    const order = (await getOrder(code))!;
    return { outcome, order } as PaymentOutcome;
  } catch (e) {
    try {
      await conn.rollback();
    } catch {
      /* đã rollback */
    }
    throw e;
  } finally {
    conn.release();
  }
}

/** Giao dịch gần nhất của đơn (để điền vào thông báo khi hậu thanh toán chạy từ cron/admin). */
export async function getLatestTransaction(code: string) {
  const [rows] = await db().execute<RowDataPacket[]>(
    "SELECT id, amount, gateway, reference_code, content, tx_time FROM sepay_transactions WHERE order_code = ? ORDER BY created_at DESC LIMIT 1",
    [code],
  );
  const r = rows[0];
  if (!r) return undefined;
  return {
    id: String(r.id),
    amount: Number(r.amount),
    gateway: (r.gateway as string | null) ?? undefined,
    reference: (r.reference_code as string | null) ?? undefined,
    content: (r.content as string | null) ?? undefined,
    time: (r.tx_time as string | null) ?? undefined,
  };
}

/* ------------------------------------------------------------ giao dịch PayPal */

/** Thông tin một lần capture của PayPal đã được chuẩn hoá (xem lib/paypal.ts). */
export type PaypalCaptureInfo = {
  captureId: string;
  paypalOrderId?: string;
  status: string;
  currency: string;
  /** Đơn vị nhỏ nhất (cent). */
  amountMinor: number;
  payerEmail?: string;
  time?: string;
  raw?: unknown;
};

export type PaypalOutcome =
  | { outcome: "duplicate"; order: Order } // capture này đã xử lý rồi
  | { outcome: "paid"; order: Order } // khớp tiền → cần chạy các bước hậu thanh toán
  | { outcome: "mismatch"; order: Order } // PayPal đã thu tiền nhưng sai loại tiền / số tiền so với đơn → cần xử lý tay
  | { outcome: "extra"; order: Order } // tiền vào đơn đã paid
  | { outcome: "cancelled"; order: Order }; // tiền vào đơn đã hủy

export async function setPaypalOrderId(code: string, paypalOrderId: string) {
  await db().execute("UPDATE orders SET paypal_order_id = ? WHERE code = ?", [paypalOrderId, code]);
}

export async function getOrderByPaypalOrderId(paypalOrderId: string): Promise<Order | null> {
  const [rows] = await db().execute<Row[]>("SELECT * FROM orders WHERE paypal_order_id = ? LIMIT 1", [paypalOrderId]);
  return rows[0] ? toOrder(rows[0]) : null;
}

/** Tìm đơn từ mã capture đã ghi sổ (dùng cho webhook hoàn tiền / tranh chấp). */
export async function getOrderByCaptureId(captureId: string): Promise<Order | null> {
  const [rows] = await db().execute<RowDataPacket[]>("SELECT order_code FROM paypal_transactions WHERE capture_id = ? LIMIT 1", [captureId]);
  return rows[0] ? getOrder(String(rows[0].order_code)) : null;
}

/**
 * Ghi nhận một lần capture THÀNH CÔNG (status COMPLETED) của PayPal vào đơn — trong một transaction DB:
 * ghi sổ (chống trùng theo mã capture) + đổi trạng thái đơn. Khớp = cùng loại tiền và đúng số tiền của đơn.
 * Capture ở trạng thái PENDING (PayPal đang rà soát) KHÔNG được gọi vào đây; PayPal sẽ gửi webhook COMPLETED sau.
 */
export async function applyPaypalCapture(code: string, cap: PaypalCaptureInfo): Promise<PaypalOutcome> {
  const conn = await db().getConnection();
  try {
    await conn.beginTransaction();
    try {
      await conn.execute(
        `INSERT INTO paypal_transactions (capture_id, order_code, paypal_order_id, amount, currency, status, payer_email, tx_time, raw, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cap.captureId,
          code,
          cap.paypalOrderId ?? null,
          cap.amountMinor,
          cap.currency,
          cap.status,
          cap.payerEmail?.slice(0, 160) ?? null,
          cap.time?.slice(0, 40) ?? null,
          cap.raw === undefined ? null : JSON.stringify(cap.raw),
          new Date(),
        ],
      );
    } catch (e) {
      await conn.rollback();
      if (isDup(e)) return { outcome: "duplicate", order: (await getOrder(code))! };
      throw e;
    }

    const [rows] = await conn.execute<Row[]>("SELECT * FROM orders WHERE code = ? FOR UPDATE", [code]);
    const row = rows[0];
    if (!row) {
      await conn.rollback();
      throw new Error(`Đơn ${code} không tồn tại`);
    }

    let outcome: PaypalOutcome["outcome"];
    if (row.status === "pending" || row.status === "underpaid") {
      const matches = cap.currency === (row.currency ?? "VND") && cap.amountMinor === Number(row.amount);
      outcome = matches ? "paid" : "mismatch";
      if (matches) {
        await conn.execute(
          `UPDATE orders SET status = 'paid', paid_amount = ?, paid_at = COALESCE(paid_at, UTC_TIMESTAMP()), paid_via = 'paypal',
             transaction_id = ?, paypal_capture_id = ?, payer_email = COALESCE(?, payer_email)
           WHERE code = ?`,
          [cap.amountMinor, cap.captureId, cap.captureId, cap.payerEmail?.slice(0, 160) ?? null, code],
        );
      }
    } else {
      outcome = row.status === "paid" ? "extra" : "cancelled";
    }
    await conn.commit();

    return { outcome, order: (await getOrder(code))! } as PaypalOutcome;
  } catch (e) {
    try {
      await conn.rollback();
    } catch {
      /* đã rollback */
    }
    throw e;
  } finally {
    conn.release();
  }
}

/** Giao dịch PayPal gần nhất của đơn (để điền vào thông báo khi hậu thanh toán chạy từ cron/admin). */
export async function getLatestPaypalTransaction(code: string) {
  const [rows] = await db().execute<RowDataPacket[]>(
    "SELECT capture_id, amount, payer_email, tx_time FROM paypal_transactions WHERE order_code = ? ORDER BY created_at DESC LIMIT 1",
    [code],
  );
  const r = rows[0];
  if (!r) return undefined;
  return {
    id: String(r.capture_id),
    amount: Number(r.amount),
    gateway: "PayPal",
    reference: String(r.capture_id),
    content: (r.payer_email as string | null) ?? undefined,
    time: (r.tx_time as string | null) ?? undefined,
  };
}

/* ------------------------------------------------------ hậu thanh toán (fulfill) */

/**
 * Giành quyền chạy các bước hậu thanh toán cho đơn (mỗi lúc chỉ 1 tiến trình).
 * Điều kiện: đơn đã paid và chưa xử lý (hoặc đang xử lý quá 5 phút = tiến trình trước đã chết).
 * Đồng thời điền các cột còn thiếu khi admin chuyển trạng thái tay (paid_at, paid_amount, paid_via).
 */
export async function claimFulfillment(code: string): Promise<boolean> {
  const [res] = await db().execute<ResultSetHeader>(
    `UPDATE orders SET
       fulfill_state = 'processing',
       fulfill_started_at = UTC_TIMESTAMP(),
       paid_at = COALESCE(paid_at, UTC_TIMESTAMP()),
       paid_via = COALESCE(paid_via, IF(transaction_id IS NULL, 'manual', 'sepay')),
       paid_amount = IF(paid_amount = 0, amount, paid_amount)
     WHERE code = ? AND status = 'paid'
       AND (fulfill_state = 'pending'
            OR (fulfill_state = 'processing' AND fulfill_started_at < UTC_TIMESTAMP() - INTERVAL 5 MINUTE))`,
    [code],
  );
  return res.affectedRows === 1;
}

export async function finishFulfillment(code: string) {
  await db().execute("UPDATE orders SET fulfill_state = 'done' WHERE code = ?", [code]);
}

export async function releaseFulfillment(code: string) {
  await db().execute("UPDATE orders SET fulfill_state = 'pending' WHERE code = ? AND fulfill_state = 'processing'", [code]);
}

export async function listUnfulfilledCodes(limit = 10): Promise<string[]> {
  const [rows] = await db().query<RowDataPacket[]>(
    `SELECT code FROM orders WHERE status = 'paid'
       AND (fulfill_state = 'pending'
            OR (fulfill_state = 'processing' AND fulfill_started_at < UTC_TIMESTAMP() - INTERVAL 5 MINUTE))
     ORDER BY created_at ASC LIMIT ${Math.min(Math.max(Math.trunc(limit), 1), 50)}`,
  );
  return rows.map((r) => String(r.code));
}

export async function setInvite(code: string, invite: InviteResult) {
  await db().execute(
    "UPDATE orders SET invite_status = ?, invite_message = ?, invite_at = ? WHERE code = ?",
    [invite.status, invite.message?.slice(0, 300) ?? null, new Date(invite.at), code],
  );
}

export async function markLarkNotified(code: string) {
  await db().execute("UPDATE orders SET lark_notified_at = ? WHERE code = ?", [new Date(), code]);
}

export async function recordPaidHook(code: string, s: { ok: boolean; at: string; attempts: number; error?: string }) {
  await db().execute(
    "UPDATE orders SET hook_paid_ok = ?, hook_paid_at = ?, hook_paid_attempts = ?, hook_paid_error = ? WHERE code = ?",
    [s.ok ? 1 : 0, new Date(s.at), s.attempts, s.error?.slice(0, 200) ?? null, code],
  );
}

/* ------------------------------------------------------------------- admin */

/**
 * Đổi trạng thái đơn thủ công. Chuyển sang 'paid' = xác nhận thành công bằng tay:
 * đặt paid_via='manual', paid_amount = amount và đưa fulfill_state về 'pending' để hệ thống chạy các bước còn lại.
 */
export async function adminSetStatus(code: string, status: OrderStatus, note?: string): Promise<Order | null> {
  const current = await getOrder(code);
  if (!current) return null;
  const becomingPaid = status === "paid" && current.status !== "paid";
  await db().execute(
    `UPDATE orders SET status = ?,
       admin_note = COALESCE(?, admin_note),
       paid_via = IF(? = 1, 'manual', paid_via),
       paid_amount = IF(? = 1 AND paid_amount < amount, amount, paid_amount),
       paid_at = IF(? = 1, COALESCE(paid_at, UTC_TIMESTAMP()), paid_at),
       fulfill_state = IF(? = 1, 'pending', fulfill_state)
     WHERE code = ?`,
    [status, note?.slice(0, 255) ?? null, becomingPaid ? 1 : 0, becomingPaid ? 1 : 0, becomingPaid ? 1 : 0, becomingPaid ? 1 : 0, code],
  );
  return getOrder(code);
}

/* --------------------------------------------------------------- rate limit */

/** Giới hạn tần suất theo cửa sổ cố định. Lỗi DB thì cho qua (không chặn bán hàng). */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  if (!dbConfigured) return true;
  try {
    const nowSec = Math.floor(Date.now() / 1000);
    const w = Math.floor(nowSec / windowSec);
    const k = key.slice(0, 120);
    await db().execute(
      "INSERT INTO rate_limits (k, w, c, ts) VALUES (?, ?, 1, ?) ON DUPLICATE KEY UPDATE c = c + 1",
      [k, w, nowSec],
    );
    const [rows] = await db().execute<RowDataPacket[]>("SELECT c FROM rate_limits WHERE k = ? AND w = ?", [k, w]);
    if (nowSec % 50 === 0) {
      await db().execute("DELETE FROM rate_limits WHERE ts < ?", [nowSec - 86_400]).catch(() => {});
    }
    return Number(rows[0]?.c ?? 0) <= limit;
  } catch {
    return true;
  }
}
