// Tạo/cập nhật bảng MySQL từ db/schema.sql.  Dùng:  npm run db:migrate
// Đọc DATABASE_URL (+ DATABASE_SSL) từ môi trường hoặc file .env.
import { readFileSync } from "node:fs";
import mysql from "mysql2/promise";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Thiếu DATABASE_URL (vd: mysql://user:pass@host:3306/ten_db). Điền vào .env rồi chạy lại.");
  process.exit(1);
}

const conn = await mysql.createConnection({
  uri: url,
  multipleStatements: true,
  charset: "utf8mb4",
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
      : undefined,
});

/**
 * Nâng cấp bảng `orders` đã có từ phiên bản cũ (CREATE TABLE IF NOT EXISTS không thêm cột vào bảng đã tồn tại).
 * MySQL không có "ADD COLUMN IF NOT EXISTS" nên kiểm tra information_schema trước; chạy lại nhiều lần vẫn an toàn.
 */
async function upgradeOrders() {
  const [cols] = await conn.query(
    "SELECT COLUMN_NAME AS name, COLUMN_TYPE AS type FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders'",
  );
  if (!cols.length) return; // bảng chưa tồn tại — schema.sql vừa tạo mới với đủ cột
  const have = new Map(cols.map((c) => [c.name, String(c.type)]));
  const add = [
    ["currency", "CHAR(3) NOT NULL DEFAULT 'VND' AFTER note"],
    ["country", "CHAR(5) NULL"],
    ["marketing_opt_in", "TINYINT(1) NOT NULL DEFAULT 0"],
    ["track_consent", "TINYINT(1) NOT NULL DEFAULT 1"],
    ["paypal_order_id", "VARCHAR(40) NULL"],
    ["paypal_capture_id", "VARCHAR(40) NULL"],
    ["payer_email", "VARCHAR(160) NULL"],
    ["business", "VARCHAR(40) NULL AFTER note"],
    ["ads_runner", "VARCHAR(40) NULL AFTER business"],
    ["ad_budget", "VARCHAR(40) NULL AFTER ads_runner"],
  ];
  for (const [name, ddl] of add) {
    if (have.has(name)) continue;
    await conn.query(`ALTER TABLE orders ADD COLUMN ${name} ${ddl}`);
    console.log(`  + orders.${name}`);
  }
  if (!have.get("paid_via")?.includes("paypal")) {
    await conn.query("ALTER TABLE orders MODIFY COLUMN paid_via ENUM('sepay','manual','paypal') NULL");
    console.log("  ~ orders.paid_via: thêm giá trị 'paypal'");
  }
  const [idx] = await conn.query(
    "SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND INDEX_NAME = 'idx_paypal_order' LIMIT 1",
  );
  if (!idx.length) {
    await conn.query("ALTER TABLE orders ADD KEY idx_paypal_order (paypal_order_id)");
    console.log("  + index orders.idx_paypal_order");
  }
}

try {
  await conn.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  await upgradeOrders();
  const [rows] = await conn.query("SHOW TABLES");
  console.log("✓ Đã chạy schema. Các bảng hiện có:", rows.map((r) => Object.values(r)[0]).join(", "));
} catch (e) {
  console.error("✗ Lỗi khi chạy schema:", e.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
