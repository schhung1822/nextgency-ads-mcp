import "server-only";
import mysql, { type Pool } from "mysql2/promise";

/**
 * Kết nối MySQL.
 *  DATABASE_URL=mysql://user:password@host:3306/ten_db     (mật khẩu có ký tự đặc biệt thì URL-encode)
 *  DATABASE_SSL=true            bật TLS (nên bật khi DB nằm trên VPS và mở ra Internet)
 *  DATABASE_SSL_REJECT_UNAUTHORIZED=false   chỉ dùng nếu chứng chỉ tự ký
 *  DATABASE_POOL_SIZE=3         số kết nối tối đa MỖI instance serverless
 */
export const dbConfigured = Boolean(process.env.DATABASE_URL);

const g = globalThis as unknown as { __ngPool?: Pool };

export function db(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Chưa cấu hình DATABASE_URL");
  return (g.__ngPool ??= mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: Number(process.env.DATABASE_POOL_SIZE ?? 3),
    maxIdle: 3,
    idleTimeout: 30_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
    connectTimeout: 8_000,
    charset: "utf8mb4",
    timezone: "Z", // đọc/ghi DATETIME theo UTC
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" }
        : undefined,
  }));
}
