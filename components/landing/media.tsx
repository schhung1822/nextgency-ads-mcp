import Image from "next/image";
import { HandshakeIcon, MapPinnedIcon, PenLineIcon, PlaneIcon, SparklesIcon, UserRoundIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ShotDef = { src: string | null; bg: string; icon: LucideIcon };

/**
 * Ảnh minh hoạ dùng trong khung chat mô phỏng và các mockup bài đăng.
 * Muốn dùng ảnh thật: chép ảnh vào public/landing/ rồi điền `src` (ví dụ "/landing/owner.jpg").
 * Để `src: null` thì hiển thị nền gradient minh hoạ.
 */
export const SHOTS = {
  /** Chị chủ cầm sản phẩm tư vấn (video thắng) */
  owner: { src: null, bg: "linear-gradient(160deg,#9ed6ff 0%,#5e5cf0 55%,#17135c 100%)", icon: UserRoundIcon },
  /** Vlog đi Hàn */
  vlog: { src: null, bg: "linear-gradient(160deg,#bfdbfe 0%,#60a5fa 50%,#1e3a8a 100%)", icon: PlaneIcon },
  /** Giới thiệu spa / phòng VIP */
  spa: { src: null, bg: "linear-gradient(160deg,#f5f5f4 0%,#d6d3d1 50%,#a8a29e 100%)", icon: SparklesIcon },
  /** Đối tác Hàn Quốc */
  partner: { src: null, bg: "linear-gradient(160deg,#e9d5ff 0%,#a78bfa 55%,#4c1d95 100%)", icon: HandshakeIcon },
  /** Video ngang chuyến công tác */
  trip: { src: null, bg: "linear-gradient(160deg,#99f6e4 0%,#14b8a6 50%,#134e4a 100%)", icon: MapPinnedIcon },
  /** Ký hợp tác */
  signing: { src: null, bg: "linear-gradient(160deg,#fecaca 0%,#f87171 50%,#7f1d1d 100%)", icon: PenLineIcon },
} satisfies Record<string, ShotDef>;

export type ShotName = keyof typeof SHOTS;

/** Lấp đầy phần tử cha (cha cần `relative`). `icon` = hiện biểu tượng mờ khi chưa có ảnh thật. */
export function Shot({
  name,
  gray,
  icon = false,
  sizes = "240px",
  className,
}: {
  name: ShotName;
  gray?: boolean;
  icon?: boolean;
  sizes?: string;
  className?: string;
}) {
  const s: ShotDef = SHOTS[name];
  const Icon = s.icon;
  return (
    <span
      aria-hidden
      className={cn("absolute inset-0 block overflow-hidden", gray && "grayscale-[.6]", className)}
      style={{ background: s.bg }}
    >
      {s.src ? (
        <Image src={s.src} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        icon && <Icon className="absolute top-[40%] left-1/2 size-[34%] max-h-20 max-w-20 -translate-x-1/2 -translate-y-1/2 text-white/40" strokeWidth={1.4} />
      )}
    </span>
  );
}

export function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M8 5l11 7-11 7z" fill="currentColor" />
    </svg>
  );
}
