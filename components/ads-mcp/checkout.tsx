"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  Loader2Icon,
  LockIcon,
  MessageCircleIcon,
  RocketIcon,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import StarBorder from "@/components/react-bits/StarBorder";
import { getMetaBrowserIds, trackPurchaseComplete, trackRegistrationComplete } from "@/lib/analytics-client";
import { ADS_RUNNER_OPTIONS, AD_BUDGET_OPTIONS, BUSINESS_OPTIONS, orderInputSchema } from "@/lib/order-schema";
import { ADS_MCP, formatVnd, zaloHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Form đăng ký + thanh toán cho trang /ads-mcp — nằm ngay trên trang (section #form), không phải popup, để
 * khách thấy rõ và không bị che mất ngữ cảnh giá/ưu đãi phía trên. Dùng cùng cơ chế backend với trang chủ
 * (SePay QR, tạo đơn trên MySQL, tự xác nhận khi nhận được tiền) nhưng là một luồng riêng: giá khác
 * (ADS_MCP.price qua plan "ads-mcp"), không có bước GitHub, và sau khi thanh toán thì hẹn liên hệ qua Zalo
 * thay vì mời vào repo.
 */

type PaymentInfo = { bank: string; accountNumber: string; accountName: string; qrUrl: string };
type Pending = { code: string; amount: number; payment: PaymentInfo; tracking: boolean; phone?: string };
type PayStatus = "pending" | "paid" | "underpaid";

const STORAGE_KEY = "ng-ads-mcp-consult-order";
const POLL_MS = 4000;
const POLL_MAX_MS = 30 * 60 * 1000;
const ZALO_GROUP = "https://zalo.me/g/wjh3xkcip7phppc2lzdi";

/** Nút "Đăng ký tư vấn" dùng khắp trang /ads-mcp — cuộn tới section #form thay vì mở popup. */
export function RegisterButton({
  children,
  light = false,
  glow = false,
  className,
}: {
  children: React.ReactNode;
  light?: boolean;
  glow?: boolean;
  className?: string;
}) {
  if (glow) {
    return (
      <StarBorder
        as="a"
        href="#form"
        color="#eafff9"
        trailColor="#2ee6c9"
        radius={999}
        duration={3.4}
        thickness={1.5}
        sparkle
        backgroundColor="#2ee6c9"
        textColor="#06110f"
        className={cn(
          "h-12! gap-2! px-6! text-sm! font-bold! shadow-lg shadow-[#2ee6c9]/25 transition-transform duration-200 hover:-translate-y-0.5",
          className,
        )}
      >
        {children}
        <ArrowRightIcon className="size-4" />
      </StarBorder>
    );
  }
  return (
    <a
      href="#form"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5",
        light ? "border border-white/20 bg-white/10 text-white hover:bg-white/16" : "bg-[#2ee6c9] text-[#06110f] shadow-lg shadow-[#2ee6c9]/20 hover:bg-[#62f2da]",
        className,
      )}
    >
      {children}
      <ArrowRightIcon className="size-4" />
    </a>
  );
}

function readSaved(): Pending | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pending) : null;
  } catch {
    return null;
  }
}
function writeSaved(p: Pending | null) {
  try {
    if (p) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sessionStorage có thể bị chặn — bỏ qua */
  }
}

/** Khối đăng ký đặt ngay trong section #form của trang — tự chuyển giữa 3 bước: điền thông tin, quét QR, xong. */
export function RegistrationCard() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [status, setStatus] = useState<PayStatus>("pending");

  // Khôi phục đơn dở dang sau khi tải lại trang. Phải đọc trong effect (không phải lazy useState)
  // vì sessionStorage chỉ có ở client — đọc lúc render sẽ lệch với HTML server trả về.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ một lần với sessionStorage sau khi mount, không phải suy ra từ props/state
    setPending(readSaved());
  }, []);

  // Theo dõi trạng thái thanh toán.
  useEffect(() => {
    if (!pending || !pending.tracking || status === "paid") return;
    const startedAt = Date.now();
    let stopped = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/orders/${pending.code}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { status: PayStatus };
        if (stopped) return;
        if (data.status === "paid") {
          writeSaved(null);
          trackPurchaseComplete(pending.code, pending.amount); // hoàn tất thanh toán (tự chống gửi lặp)
        }
        setStatus(data.status);
      } catch {
        /* mạng chập chờn — thử lại ở lần sau */
      }
    };
    void tick();
    const id = setInterval(() => {
      if (Date.now() - startedAt > POLL_MAX_MS) return clearInterval(id);
      void tick();
    }, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [pending, status]);

  const reset = () => {
    writeSaved(null);
    setPending(null);
    setStatus("pending");
  };

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-[#2ee6c9]/20 bg-[#0e2824]/70 p-5 shadow-2xl shadow-black/20 sm:p-8">
      {!pending ? (
        <OrderForm
          onCreated={(p) => {
            writeSaved(p);
            setStatus("pending");
            setPending(p);
          }}
        />
      ) : status === "paid" ? (
        <PaidView code={pending.code} phone={pending.phone} />
      ) : (
        <PayView pending={pending} status={status} onBack={reset} />
      )}
    </div>
  );
}

/* ------------------------------ UI dùng chung (tối màu) ------------------------------ */

const inputCls =
  "h-11 w-full rounded-xl border-[1.5px] border-[#1f3a35] bg-[#081613] px-3.5 text-sm text-[#e8f4f1] outline-none transition-colors placeholder:text-[#5c7a74] focus:border-[#2ee6c9] focus:ring-[3px] focus:ring-[#2ee6c9]/15 aria-invalid:border-[#ef4444]";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-xs font-bold text-white">{label}</label>
      {children}
      {error && <p role="alert" className="text-xs text-[#ff7b6b]">{error}</p>}
    </div>
  );
}

function SelectField({
  id,
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={cn(inputCls, "appearance-none pr-9")}
        >
          <option value="" className="bg-[#0a1a17] text-[#5c7a74]">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0a1a17] text-[#e8f4f1]">{o.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#96b8b1]" />
      </div>
    </Field>
  );
}

/* ------------------------------ Bước 1: thông tin ------------------------------ */

function OrderForm({ onCreated }: { onCreated: (p: Pending) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [business, setBusiness] = useState("");
  const [adsRunner, setAdsRunner] = useState("");
  const [adBudget, setAdBudget] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Form này không có ô đồng ý riêng (xem ghi chú cuối form) — bấm đăng ký coi như đã đồng ý.
    const raw = { ...Object.fromEntries(form.entries()), consent: true, plan: "ads-mcp" };
    const parsed = orderInputSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // tracking: _fbp/_fbc của Meta Pixel để máy chủ báo Purchase qua Conversions API đúng người xem quảng cáo
        body: JSON.stringify({ ...raw, tracking: getMetaBrowserIds() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors as Record<string, string>);
        toast.error(data.error ?? "Không tạo được đăng ký, vui lòng thử lại.");
        return;
      }
      trackRegistrationComplete((data as Pending).code); // hoàn tất đăng ký (đơn đã tạo, chờ thanh toán)
      onCreated({ ...(data as Pending), phone: parsed.data.phone });
    } catch {
      toast.error("Có lỗi mạng, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-4 py-3"
        style={{ backgroundImage: "radial-gradient(ellipse at 0% 0%, rgba(46,230,201,.22), transparent 70%)", backgroundColor: "rgba(46,230,201,.06)", boxShadow: "inset 0 0 0 1.5px rgba(46,230,201,.45)" }}
      >
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#2ee6c9] px-2.5 py-1 text-[11px] font-black text-[#06110f]"><RocketIcon className="size-3.5" /> Ads AI tối ưu</span>
        <p className="text-right text-xl font-black leading-tight text-[#2ee6c9]">
          {formatVnd(ADS_MCP.price)}<span className="block text-[11px] font-semibold text-[#96b8b1]">mỗi tháng · chưa gồm tiền chạy quảng cáo</span>
        </p>
      </div>

      <h3 className="mt-4 text-center text-lg font-black text-white">Thông tin đăng ký</h3>

      <form onSubmit={onSubmit} noValidate className="mt-3 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="name" label="Họ và tên *" error={errors.name}>
            <input id="name" name="name" autoComplete="name" placeholder="VD: Nguyễn Văn A" aria-invalid={!!errors.name} className={inputCls} />
          </Field>
          <Field id="phone" label="Số điện thoại / Zalo *" error={errors.phone}>
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="VD: 0901234567" aria-invalid={!!errors.phone} className={inputCls} />
          </Field>
        </div>
        <Field id="email" label="Email (không bắt buộc)" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="VD: email@gmail.com" aria-invalid={!!errors.email} className={inputCls} />
        </Field>
        <SelectField id="business" name="business" label="Bạn kinh doanh lĩnh vực gì? *" placeholder="-- Chọn lĩnh vực --" options={BUSINESS_OPTIONS} value={business} onChange={setBusiness} error={errors.business} />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField id="adsRunner" name="adsRunner" label="Hiện quảng cáo đang do ai chạy? *" placeholder="-- Chọn một mục --" options={ADS_RUNNER_OPTIONS} value={adsRunner} onChange={setAdsRunner} error={errors.adsRunner} />
          <SelectField id="adBudget" name="adBudget" label="Tiền chạy quảng cáo mỗi tháng khoảng *" placeholder="-- Chọn mức --" options={AD_BUDGET_OPTIONS} value={adBudget} onChange={setAdBudget} error={errors.adBudget} />
        </div>

        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2ee6c9] text-sm font-black text-[#06110f] shadow-[0_8px_28px_rgba(46,230,201,.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting ? <Loader2Icon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
          {submitting ? "Đang xử lý..." : "Đăng ký và thanh toán"}
        </button>
        <p className="flex items-start justify-center gap-1.5 text-center text-[11px] leading-snug text-[#6e918a]">
          <LockIcon className="mt-0.5 size-3 shrink-0" />
          Thanh toán qua mã QR ngân hàng. Bảo mật theo{" "}
          <a href="/privacy" target="_blank" rel="noopener" className="font-semibold text-[#2ee6c9] underline underline-offset-4">Chính sách bảo mật</a>.
        </p>
      </form>
    </>
  );
}

/* ------------------------------ Bước 2: QR ------------------------------ */

function PayView({ pending, status, onBack }: { pending: Pending; status: PayStatus; onBack: () => void }) {
  const { code, amount, payment, tracking } = pending;
  return (
    <>
      <div className="text-center">
        <h3 className="text-xl font-black text-white sm:text-2xl">Quét mã để thanh toán</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#96b8b1] sm:text-base">Mở app ngân hàng, quét mã. Số tiền và nội dung đã điền sẵn.</p>
      </div>

      <div className="mx-auto mt-5 w-full max-w-60 rounded-2xl bg-white p-2.5 shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- QR động từ qr.sepay.vn */}
        <img src={payment.qrUrl} alt={`Mã QR thanh toán đăng ký ${code}`} width={240} height={240} className="aspect-square w-full" />
      </div>

      <div className="mt-5 grid gap-1.5">
        <Row label="Ngân hàng" value={payment.bank} />
        <Row label="Số tài khoản" value={payment.accountNumber} copy />
        <Row label="Chủ tài khoản" value={payment.accountName} />
        <Row label="Số tiền" value={formatVnd(amount)} emphasis />
        <Row label="Nội dung" value={code} copy emphasis />
      </div>

      {status === "underpaid" && (
        <div role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3.5 text-sm text-amber-200">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          Bạn đã chuyển chưa đủ {formatVnd(amount)}. Vui lòng chuyển thêm phần còn thiếu, giữ đúng nội dung {code}.
        </div>
      )}

      <div role="status" aria-live="polite" className="mt-5 flex items-center gap-2.5 rounded-xl bg-[#081613] p-3.5 text-sm text-[#96b8b1] sm:text-base">
        {tracking ? (
          <>
            <Loader2Icon className="size-5 shrink-0 animate-spin text-[#2ee6c9]" />
            Đang chờ thanh toán...
          </>
        ) : (
          <>Nextgency sẽ xác nhận thủ công sau khi nhận được tiền.</>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-[#6e918a]">
        <span>Mã đăng ký: <span className="font-mono font-semibold text-white">{code}</span></span>
        <button type="button" onClick={onBack} className="font-semibold text-[#2ee6c9] underline underline-offset-4 hover:text-[#62f2da]">
          Nhập lại thông tin
        </button>
      </div>
    </>
  );
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.error("Không sao chép được, vui lòng copy thủ công.");
    }
  };
  return (
    <button type="button" onClick={doCopy} aria-label={`Sao chép ${label}`} className="shrink-0 rounded-full bg-[#2ee6c9]/15 px-2.5 py-1.5 text-xs font-bold text-[#2ee6c9] transition-colors hover:bg-[#2ee6c9]/25">
      <CopyIcon className="size-3.5" />
    </button>
  );
}

function Row({ label, value, copy, emphasis }: { label: string; value: string; copy?: boolean; emphasis?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-[#081613] px-3.5 py-2.5">
      <span className="w-28 shrink-0 text-sm text-[#96b8b1]">{label}</span>
      <span className={cn("min-w-0 flex-1 truncate text-sm font-bold", emphasis ? "text-[#2ee6c9]" : "text-white")}>{value || "—"}</span>
      {copy && value && <CopyButton label={label.toLowerCase()} text={value} />}
    </div>
  );
}

/* ------------------------------ Bước 3: xong ------------------------------ */

function PaidView({ code, phone }: { code: string; phone?: string }) {
  const directZalo = zaloHref();
  return (
    <div className="grid gap-5 text-center">
      <div className="grid justify-items-center gap-2.5">
        <span className="grid size-[76px] place-items-center rounded-full bg-[#2ee6c9] text-[#06110f]">
          <CheckCircle2Icon className="size-10" />
        </span>
        <div>
          <h3 className="text-2xl font-black text-white sm:text-3xl">Đã nhận thanh toán!</h3>
          <p className="mt-1.5 text-base text-[#96b8b1]">Nextgency sẽ gọi xếp lịch cài đặt phòng Marketing Ads AI cho bạn trong 24 giờ.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0e2420] px-3 py-1.5 text-xs font-bold text-[#2ee6c9]"><CheckIcon className="size-3.5" />Thanh toán</span>
        <span className="h-0.5 w-5 shrink-0 bg-[#2ee6c9]/30" />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0068ff] px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_0_4px_rgba(0,104,255,.25)]"><MessageCircleIcon className="size-3.5" />Nhắn Zalo</span>
        <span className="h-0.5 w-5 shrink-0 bg-[#2ee6c9]/30" />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0e2420] px-3 py-1.5 text-xs font-bold text-[#96b8b1]"><RocketIcon className="size-3.5" />Bắt đầu chạy</span>
      </div>

      {phone && <p className="text-sm text-[#96b8b1]">Đội ngũ sẽ nhắn Zalo tới số <b className="text-white">{phone}</b> để bắt đầu kết nối tài khoản quảng cáo.</p>}

      <div className="grid gap-2.5">
        {directZalo && (
          <a href={directZalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0068ff] text-base font-bold text-white shadow-[0_10px_28px_rgba(0,104,255,.35)] transition-transform hover:-translate-y-0.5">
            <MessageCircleIcon className="size-5" /> Nhắn Zalo với Nextgency
          </a>
        )}
        <a href={ZALO_GROUP} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#2ee6c9]/30 bg-[#2ee6c9]/10 text-base font-bold text-[#2ee6c9] transition-colors hover:bg-[#2ee6c9]/20">
          <RocketIcon className="size-5" /> Vào nhóm Zalo xem AI chạy quảng cáo thật
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-[#6e918a]">
        Mã đăng ký: <span className="font-mono font-semibold text-white">{code}</span>
      </div>
    </div>
  );
}
