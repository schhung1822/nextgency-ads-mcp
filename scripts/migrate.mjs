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

try {
  await conn.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const [rows] = await conn.query("SHOW TABLES");
  console.log("✓ Đã chạy schema. Các bảng hiện có:", rows.map((r) => Object.values(r)[0]).join(", "));
} catch (e) {
  console.error("✗ Lỗi khi chạy schema:", e.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
