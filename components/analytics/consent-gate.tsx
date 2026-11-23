"use client";

import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";
import { GLOBAL } from "@/lib/site";

/**
 * Chỉ cho các script đo lường bên trong chạy khi được phép.
 *  • Trang tiếng Việt (/, /en, các trang chính sách): chạy như trước đây, không đổi gì.
 *  • Trang quốc tế (/global/...): chỉ chạy sau khi khách bấm "Accept all" ở thanh cookie.
 * `noscript` = dùng cho thẻ <noscript> (khi tắt JavaScript không thể hỏi đồng ý) → trên trang quốc tế luôn ẩn.
 */
export function ConsentGate({ children, noscript = false }: { children: React.ReactNode; noscript?: boolean }) {
  const pathname = usePathname() ?? "";
  const consent = useConsent();
  const needsConsent = pathname === GLOBAL.path || pathname.startsWith(`${GLOBAL.path}/`);
  if (needsConsent && (noscript || consent !== "all")) return null;
  return <>{children}</>;
}
