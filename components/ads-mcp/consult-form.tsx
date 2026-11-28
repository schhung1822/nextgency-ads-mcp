"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  LockIcon,
  MessageCircleIcon,
  RocketIcon,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";
import StarBorder from "@/components/react-bits/StarBorder";
import { getMetaBrowserIds, trackRegistrationComplete } from "@/lib/analytics-client";
import { consultInputSchema } from "@/lib/consult-schema";
import { ADS_RUNNER_OPTIONS, AD_BUDGET_OPTIONS, BUSINESS_OPTIONS } from "@/lib/order-schema";
import { zaloHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Form đăng ký tư vấn cho trang /auto-ads-ai — nằm ngay trên trang (section #form), không phải popup.
 * Khách điền rồi gửi là xong: máy chủ báo về nhóm Lark (POST /api/consult) để đội ngũ liên hệ tư vấn.
 * Không có bước thanh toán, không tạo đơn hàng.
 */

const ZALO_GROUP = "https://zalo.me/g/wjh3xkcip7phppc2lzdi";

/** Nút "Đăng ký tư vấn" dùng khắp trang /auto-ads-ai — cuộn tới section #form thay vì mở popup. */
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

/** Khối đăng ký đặt ngay trong section #form của trang — điền thông tin, gửi, rồi hiện lời xác nhận. */
export function RegistrationCard() {
  // Số điện thoại khách vừa đăng ký; null = chưa gửi.
  const [sentPhone, setSentPhone] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-[#2ee6c9]/20 bg-[#0e2824]/70 p-5 shadow-2xl shadow-black/20 sm:p-8">
      {sentPhone === null ? <ConsultForm onSent={setSentPhone} /> : <SentView phone={sentPhone} />}
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

function ConsultForm({ onSent }: { onSent: (phone: string) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [business, setBusiness] = useState("");
  const [adsRunner, setAdsRunner] = useState("");
  const [adBudget, setAdBudget] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = consultInputSchema.safeParse(raw);
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
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // tracking: _fbp/_fbc của Meta Pixel để máy chủ báo sự kiện đăng ký qua Conversions API đúng người xem quảng cáo
        body: JSON.stringify({ ...raw, tracking: getMetaBrowserIds() }),
      });
      const data = (await res.json()) as { ref?: string; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ref) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        toast.error(data.error ?? "Chưa gửi được đăng ký, vui lòng thử lại.");
        return;
      }
      trackRegistrationComplete(data.ref); // hoàn tất đăng ký tư vấn (đội ngũ đã nhận được thông tin)
      onSent(parsed.data.phone);
    } catch {
      toast.error("Có lỗi mạng, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h3 className="text-center text-lg font-black text-white">Thông tin đăng ký tư vấn</h3>
      <p className="mt-1 text-center text-sm text-[#96b8b1]">Chưa cần thanh toán. Nextgency liên hệ tư vấn cho bạn trước.</p>

      <form onSubmit={onSubmit} noValidate className="mt-4 grid gap-3">
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
          {submitting ? "Đang gửi..." : "Gửi đăng ký tư vấn"}
        </button>
        <p className="flex items-start justify-center gap-1.5 text-center text-[11px] leading-snug text-[#6e918a]">
          <LockIcon className="mt-0.5 size-3 shrink-0" />
          <span>
            Nextgency liên hệ qua Zalo/điện thoại trong 24 giờ. Bảo mật theo{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="font-semibold text-[#2ee6c9] underline underline-offset-4">Chính sách bảo mật</a>.
          </span>
        </p>
      </form>
    </>
  );
}

/* ------------------------------ Bước 2: đã gửi ------------------------------ */

function SentView({ phone }: { phone: string }) {
  const directZalo = zaloHref();
  const ref = useRef<HTMLDivElement>(null);

  // Lời xác nhận thấp hơn form nên có thể nằm ngoài màn hình sau khi gửi — đưa nó về giữa màn hình.
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div ref={ref} role="status" className="grid gap-5 text-center">
      <div className="grid justify-items-center gap-2.5">
        <span className="grid size-[76px] place-items-center rounded-full bg-[#2ee6c9] text-[#06110f]">
          <CheckCircle2Icon className="size-10" />
        </span>
        <div>
          <h3 className="text-2xl font-black text-white sm:text-3xl">Đã nhận đăng ký tư vấn!</h3>
          <p className="mt-1.5 text-base text-[#96b8b1]">
            Nextgency sẽ liên hệ tư vấn cho bạn qua Zalo/điện thoại số <b className="text-white">{phone}</b> trong 24 giờ.
          </p>
        </div>
      </div>

      {/* Mobile: bỏ vạch nối và thu gọn để 3 bước nằm trên một hàng. */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0e2420] px-2.5 py-1.5 text-xs font-bold text-[#2ee6c9] sm:px-3"><CheckIcon className="size-3.5" />Đăng ký</span>
        <span className="hidden h-0.5 w-5 shrink-0 bg-[#2ee6c9]/30 sm:block" />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0068ff] px-2.5 py-1.5 text-xs font-bold text-white shadow-[0_0_0_4px_rgba(0,104,255,.25)] sm:px-3"><MessageCircleIcon className="size-3.5" />Tư vấn</span>
        <span className="hidden h-0.5 w-5 shrink-0 bg-[#2ee6c9]/30 sm:block" />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0e2420] px-2.5 py-1.5 text-xs font-bold text-[#96b8b1] sm:px-3"><RocketIcon className="size-3.5" />Bắt đầu chạy</span>
      </div>

      <p className="text-sm text-[#96b8b1]">Bạn chưa cần thanh toán gì ở bước này.</p>

      <div className="grid gap-2.5">
        {directZalo && (
          <a href={directZalo} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0068ff] text-base font-bold text-white shadow-[0_10px_28px_rgba(0,104,255,.35)] transition-transform hover:-translate-y-0.5">
            <MessageCircleIcon className="size-5" /> Nhắn Zalo với Nextgency
          </a>
        )}
        <a href={ZALO_GROUP} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-[#2ee6c9]/30 bg-[#2ee6c9]/10 px-5 py-2 text-sm leading-snug font-bold text-[#2ee6c9] transition-colors hover:bg-[#2ee6c9]/20 sm:text-base">
          <RocketIcon className="size-5 shrink-0" /> Vào nhóm Zalo xem AI chạy quảng cáo thật
        </a>
      </div>
    </div>
  );
}
