import { formatVnd } from "@/lib/site";

/** Giá tiền dùng Archivo: chữ số "0" và ký hiệu ₫ rõ ràng hơn Hubot Sans. */
export function Vnd({ amount, className }: { amount: number; className?: string }) {
  return <span className={`font-archivo tabular-nums ${className ?? ""}`}>{formatVnd(amount)}</span>;
}
