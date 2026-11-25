import { CalendarCheckIcon, MessageSquareTextIcon, TrendingUpIcon, UsersIcon, WalletIcon } from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import { FacebookMark } from "@/components/ads-mcp/brand-icons";
import { cn } from "@/lib/utils";

const ROWS = [
  { icon: WalletIcon, color: "#d68c1e", label: "Tiền quảng cáo", value: 1_200_000, unit: "đ", width: 100 },
  { icon: MessageSquareTextIcon, color: "#16c4ac", label: "Khách nhắn tin", value: 128, unit: " người", width: 82 },
  { icon: CalendarCheckIcon, color: "#7b5cc4", label: "Lịch hẹn", value: 31, unit: " lịch", width: 56 },
  { icon: UsersIcon, color: "#0b7fa8", label: "Khách đến", value: 18, unit: " khách", width: 42 },
] as const;

const REVENUE = { icon: TrendingUpIcon, color: "#22a06b", label: "Doanh thu", value: 9_000_000, unit: "đ", width: 100 } as const;

function FunnelRow({ icon: Icon, color, label, value, unit, width, big }: { icon: typeof WalletIcon; color: string; label: string; value: number; unit: string; width: number; big?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2.5 text-sm font-semibold text-[#e8f4f1]">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg text-white" style={{ background: color }}><Icon className="size-4" /></span>
          {label}
        </span>
        <b className={cn("shrink-0 tabular-nums", big ? "text-lg font-black text-[#2ee6c9]" : "text-sm font-black text-white")}>
          <CountUp to={value} separator="." duration={1.6} />{unit}
        </b>
      </div>
      <div className="mt-1.5 ml-[42px] h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

export function FunnelChart() {
  return (
    <div className="rounded-[2rem] border border-[#2ee6c9]/15 bg-[#0e2824]/70 p-5 shadow-xl shadow-black/20 sm:p-7">
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
        <FacebookMark className="size-6" />
        <b className="flex-1 text-sm font-bold text-white">Quảng cáo hôm qua</b>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#96b8b1]">Spa · ví dụ</span>
      </div>
      <div className="mt-4 grid gap-4">
        {ROWS.map((row) => <FunnelRow key={row.label} {...row} />)}
        <FunnelRow {...REVENUE} big />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-3.5">
          <span className="block text-xs text-[#96b8b1]">Mỗi lịch hẹn tốn</span>
          <b className="text-lg font-black text-white">38.700đ</b>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[#2ee6c9]/10 p-3.5">
          <div><span className="block text-xs text-[#96b8b1]">1đ quảng cáo mang về</span><b className="text-lg font-black text-[#2ee6c9]">7,5đ</b></div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#22a06b]/15 px-2.5 py-1 text-[11px] font-bold text-[#22a06b]"><TrendingUpIcon className="size-3" /> Có lời</span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-[#6e918a]">Số liệu minh hoạ</p>
    </div>
  );
}
