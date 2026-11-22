import { formatVnd } from "@/lib/site";

/** Giá tiền dùng Archivo: chữ số "0" và ký hiệu ₫ rõ ràng hơn Hubot Sans. */
export function Vnd({ amount, className, locale = "vi" }: { amount: number; className?: string; locale?: "vi" | "en" }) {
  return <span className={`font-archivo tabular-nums ${className ?? ""}`}>{formatVnd(amount, locale)}</span>;
}
