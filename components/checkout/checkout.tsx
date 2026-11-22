"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CopyIcon,
  ExternalLinkIcon,
  Loader2Icon,
  LockIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import StarBorder from "@/components/react-bits/StarBorder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vnd } from "@/components/landing/vnd";
import { getMetaBrowserIds, trackPurchaseComplete, trackRegistrationComplete } from "@/lib/analytics-client";
import { orderInputSchema } from "@/lib/order-schema";
import { SITE, formatVnd } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CHECKOUT_TEXT, type CheckoutText } from "./text";

type Locale = "vi" | "en";
type PaymentInfo = { bank: string; accountNumber: string; accountName: string; qrUrl: string };
// github = "" khi khách không điền (không bắt buộc). phone dùng để nhắc khách "sẽ liên hệ qua Zalo số này".
type Pending = { code: string; amount: number; payment: PaymentInfo; tracking: boolean; github?: string; phone?: string };
type PayStatus = "pending" | "paid" | "underpaid";
type InviteState = "invited" | "already" | "error" | "skipped" | null;
type GhUser = { status: "ok"; login: string; name: string | null; avatar: string };

const STORAGE_KEY = "ng-ads-mcp-order";
const POLL_MS = 4000;
const POLL_MAX_MS = 30 * 60 * 1000;

const linkCls = "font-medium text-iris underline underline-offset-4";
const primaryCls = "bg-brand-button inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white transition-opacity hover:opacity-90";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
const TextCtx = createContext<{ tx: CheckoutText; locale: Locale }>({ tx: CHECKOUT_TEXT.vi, locale: "vi" });

export function CheckoutProvider({ children, locale = "vi" }: { children: React.ReactNode; locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  // Mở popup: nếu khách đang có đơn chờ thanh toán (lỡ đóng / tải lại trang) thì khôi phục.
  const openDialog = useCallback(() => {
    setPending((current) => current ?? readSaved());
    setOpen(true);
  }, []);
  return (
    <Ctx value={{ open: openDialog }}>
      <TextCtx value={{ tx: CHECKOUT_TEXT[locale], locale }}>
        {children}
        <CheckoutDialog open={open} onOpenChange={setOpen} pending={pending} setPending={setPending} />
      </TextCtx>
    </Ctx>
  );
}

/** Nút CTA chính có viền sao chạy quanh (React Bits). */
export function BuyStarButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = useContext(Ctx);
  return (
    <StarBorder
      type="button"
      onClick={open}
      color="#9ed6ff"
      trailColor="#c08dfe"
      radius={999}
      duration={4}
      backgroundColor="linear-gradient(90deg,#24388e,#5e5cf0 55%,#8f5bff)"
      textColor="#ffffff"
      className={className}
    >
      {children}
    </StarBorder>
  );
}

/** Nút CTA trên header: gọn, viền sao chạy + ánh sáng nền, đồng bộ với các nút CTA ở hero. */
export function BuyHeaderButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = useContext(Ctx);
  return (
    <StarBorder
      type="button"
      onClick={open}
      color="#9ed6ff"
      trailColor="#c08dfe"
      radius={999}
      duration={4}
      thickness={1.5}
      backgroundColor="linear-gradient(90deg,#24388e,#5e5cf0 55%,#8f5bff)"
      textColor="#ffffff"
      className={cn(
        "group gap-1.5! px-4! py-2! text-sm font-semibold shadow-[0_6px_24px_-6px_rgba(109,101,255,0.85)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_10px_30px_-6px_rgba(143,91,255,0.95)] active:translate-y-0 sm:px-5!",
        className,
      )}
    >
      {children}
    </StarBorder>
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

function CheckoutDialog({
  open,
  onOpenChange,
  pending,
  setPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pending: Pending | null;
  setPending: (p: Pending | null) => void;
}) {
  const { locale } = useContext(TextCtx);
  const [status, setStatus] = useState<PayStatus>("pending");
  const [invite, setInvite] = useState<InviteState>(null);

  // Theo dõi trạng thái thanh toán.
  useEffect(() => {
    if (!open || !pending || !pending.tracking || (status === "paid" && invite !== null)) return;
    const startedAt = Date.now();
    let stopped = false;
    const tick = async () => {
      try {
        const res = await fetch(`/api/orders/${pending.code}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { status: PayStatus; invite?: InviteState };
        if (stopped) return;
        if (data.status === "paid") {
          writeSaved(null);
          trackPurchaseComplete(pending.code, pending.amount); // hoàn tất thanh toán (tự chống gửi lặp)
        }
        setInvite(data.invite ?? null);
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
  }, [open, pending, status, invite]);

  const reset = () => {
    writeSaved(null);
    setPending(null);
    setStatus("pending");
    setInvite(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        lang={locale}
        className={cn(
          "max-h-[94dvh] gap-5 overflow-y-auto p-5 sm:p-8",
          // Bước QR thanh toán rộng nhất để mã QR đủ lớn, dễ quét.
          !pending || status === "paid" ? "sm:max-w-2xl" : "sm:max-w-4xl",
        )}
      >
        {!pending ? (
          <OrderForm
            onCreated={(p) => {
              writeSaved(p);
              setStatus("pending");
              setPending(p);
            }}
          />
        ) : status === "paid" ? (
          <PaidView code={pending.code} invite={invite} github={pending.github} phone={pending.phone} onClose={() => { onOpenChange(false); reset(); }} />
        ) : (
          <PayView pending={pending} status={status} onBack={reset} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Bước 1: thông tin ------------------------------ */

function OrderForm({ onCreated }: { onCreated: (p: Pending) => void }) {
  const { tx, locale } = useContext(TextCtx);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [ghUser, setGhUser] = useState<GhUser | null>(null);

  // Thông báo lỗi từng ô: bản tiếng Việt lấy từ schema, bản tiếng Anh dịch theo tên ô.
  const fieldMsg = (field: string, fallback: string) => tx.fieldErrors?.[field] ?? fallback;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = { ...Object.fromEntries(form.entries()), consent };
    const parsed = orderInputSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= fieldMsg(key, issue.message);
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      // GitHub không bắt buộc: để trống thì bỏ qua bước kiểm tra/xác nhận avatar.
      // Có điền thì hiện avatar để khách chắc chắn đúng tài khoản sẽ nhận quyền vào repo.
      if (parsed.data.github && (!ghUser || ghUser.login.toLowerCase() !== parsed.data.github.toLowerCase())) {
        const chk = await fetch(`/api/github/check?u=${encodeURIComponent(parsed.data.github)}`, { cache: "no-store" })
          .then((r) => r.json() as Promise<{ status: string } & Partial<GhUser>>)
          .catch(() => ({ status: "unavailable" }));
        if (chk.status === "not_found") {
          setErrors({ github: tx.errors.github404 });
          return;
        }
        if (chk.status === "ok") {
          setGhUser(chk as GhUser);
          return; // dừng lại để khách bấm xác nhận
        }
        // skipped / unavailable: không chặn, tiếp tục đặt hàng
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // tracking: _fbp/_fbc của Meta Pixel để máy chủ báo Purchase qua Conversions API đúng người xem quảng cáo
        body: JSON.stringify({ ...raw, tracking: getMetaBrowserIds() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) {
          const fe: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.fieldErrors as Record<string, string>)) fe[k] = fieldMsg(k, v);
          setErrors(fe);
        }
        toast.error(locale === "vi" ? (data.error ?? tx.errors.createFailed) : tx.errors.createFailed);
        return;
      }
      trackRegistrationComplete((data as Pending).code); // hoàn tất đăng ký (đơn đã tạo, chờ thanh toán)
      onCreated({ ...(data as Pending), github: parsed.data.github, phone: parsed.data.phone });
    } catch {
      toast.error(tx.errors.network);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">{tx.formTitle}</DialogTitle>
        <DialogDescription className="text-sm">
          {tx.formDescBefore}
          <strong className="text-foreground"><Vnd amount={SITE.price} locale={locale} /></strong>
          {tx.formDescAfter}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <Field id="name" label={tx.name} error={errors.name}>
          <Input id="name" name="name" autoComplete="name" placeholder={tx.namePh} aria-invalid={!!errors.name} className="h-11" />
        </Field>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <Field id="phone" label={tx.phone} hint={tx.phoneHint} error={errors.phone}>
            <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={tx.phonePh} aria-invalid={!!errors.phone} className="h-11" />
          </Field>
          <Field id="email" label={tx.email} error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder={tx.emailPh} aria-invalid={!!errors.email} className="h-11" />
          </Field>
        </div>
        <Field id="github" label={tx.github} hint={tx.githubHint} error={errors.github}>
          <Input id="github" name="github" autoComplete="off" placeholder={tx.githubPh} aria-invalid={!!errors.github} className="h-11" onChange={() => setGhUser(null)} />
        </Field>
        {ghUser && (
          <div role="status" className="flex items-center gap-3 rounded-xl border border-iris/30 bg-secondary/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar GitHub */}
            <img src={ghUser.avatar} alt="" width={44} height={44} className="size-11 rounded-full ring-2 ring-white" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-navy">
                {ghUser.name ? `${ghUser.name} · ` : ""}@{ghUser.login}
              </p>
              <p className="text-muted-foreground">{tx.githubConfirm}</p>
            </div>
          </div>
        )}
        <Field id="note" label={tx.note} error={errors.note}>
          <Textarea id="note" name="note" rows={2} placeholder={tx.notePh} className="min-h-20" />
        </Field>

        <div className="grid gap-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={!!errors.consent} className="mt-0.5" />
            <Label htmlFor="consent" className="block text-sm leading-snug font-normal text-muted-foreground">
              {tx.consentPrefix}
              <a href="/terms" target="_blank" rel="noopener" className={linkCls}>{tx.consentTerms}</a>,{" "}
              <a href="/policies/chinh-sach-thanh-toan" target="_blank" rel="noopener" className={linkCls}>{tx.consentPayment}</a>
              {tx.consentMid}
              <a href="/privacy" target="_blank" rel="noopener" className={linkCls}>{tx.consentPrivacy}</a>.
            </Label>
          </div>
          {errors.consent && <p role="alert" className="text-xs text-destructive">{errors.consent}</p>}
        </div>

        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" disabled={submitting} className={cn(primaryCls, "h-12 w-full text-base disabled:opacity-70")}>
          {submitting ? <Loader2Icon className="size-4 animate-spin" /> : <LockIcon className="size-4" />}
          {submitting ? tx.processing : ghUser ? tx.confirmGithub : <>{tx.continuePay}<Vnd amount={SITE.price} locale={locale} /></>}
        </button>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0 text-azure" />
          {tx.secureNote}
        </p>
      </form>
    </>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------ Bước 2: QR ------------------------------ */

function PayView({ pending, status, onBack }: { pending: Pending; status: PayStatus; onBack: () => void }) {
  const { tx, locale } = useContext(TextCtx);
  const { code, amount, payment, tracking } = pending;
  return (
    <>
      <DialogHeader className="gap-2 pr-8">
        <DialogTitle className="text-2xl font-semibold">{tx.payTitle}</DialogTitle>
        <DialogDescription className="text-base leading-relaxed">
          {tx.payDescBefore}
          <strong className="text-foreground">{tx.payDescStrong}</strong>
          {tx.payDescAfter}
        </DialogDescription>
      </DialogHeader>

      <div className="grid items-start gap-6 sm:grid-cols-[minmax(0,340px)_minmax(0,1fr)] sm:gap-8">
        <div className="mx-auto w-full max-w-85 rounded-3xl border bg-white p-3 shadow-md shadow-iris/10 ring-1 ring-iris/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- QR động từ qr.sepay.vn */}
          <img src={payment.qrUrl} alt={tx.qrAlt(code)} width={400} height={400} className="aspect-square w-full" />
        </div>

        <div className="grid content-start gap-4">
          <div className="rounded-2xl bg-secondary/70 p-4 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">{tx.amount}</p>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 sm:justify-start">
              <span className="font-mono text-3xl font-bold tracking-tight text-navy">{formatVnd(amount, locale)}</span>
              <CopyButton label={tx.amountLabel} text={String(amount)} />
            </p>
          </div>
          <dl className="grid content-start gap-3.5 text-base">
            <Row label={tx.bank} value={payment.bank} />
            <Row label={tx.account} value={payment.accountNumber} copy />
            <Row label={tx.holder} value={payment.accountName} />
            <Row label={tx.memo} value={code} copy emphasis />
          </dl>
        </div>
      </div>

      {status === "underpaid" && (
        <div role="status" className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-900">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          {tx.underpaid(formatVnd(amount, locale), code)}
        </div>
      )}

      <div role="status" aria-live="polite" className="flex items-center gap-2.5 rounded-xl bg-secondary p-3.5 text-sm text-secondary-foreground sm:text-base">
        {tracking ? (
          <>
            <Loader2Icon className="size-5 shrink-0 animate-spin text-iris" />
            {tx.waiting}
          </>
        ) : (
          <>{tx.manualConfirm}</>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{tx.orderCode}<span className="font-mono text-foreground">{code}</span></span>
        <button type="button" onClick={onBack} className="underline underline-offset-4 hover:text-foreground">
          {tx.reenter}
        </button>
      </div>
    </>
  );
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const { tx } = useContext(TextCtx);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(tx.copied(label));
    } catch {
      toast.error(tx.copyFailed);
    }
  };
  return (
    <Button type="button" variant="ghost" size="icon-sm" onClick={doCopy} aria-label={tx.copyAria(label)}>
      <CopyIcon />
    </Button>
  );
}

function Row({
  label,
  value,
  copy,
  emphasis,
}: {
  label: string;
  value: string;
  copy?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed pb-2.5 last:border-0">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1 text-right">
        <span className={cn("wrap-break-word", emphasis ? "font-mono text-lg font-bold text-iris" : "font-semibold text-foreground")}>
          {value || "—"}
        </span>
        {copy && value && <CopyButton label={label.toLowerCase()} text={value} />}
      </dd>
    </div>
  );
}

/* ------------------------------ Bước 3: xong ------------------------------ */

function PaidView({
  code,
  invite,
  github,
  phone,
  onClose,
}: {
  code: string;
  invite: InviteState;
  github?: string;
  phone?: string;
  onClose: () => void;
}) {
  const { tx } = useContext(TextCtx);
  // GitHub không bắt buộc: khách không điền thì chỉ báo "sẽ được hướng dẫn khi liên hệ".
  const hasGithub = Boolean(github);
  const inviting = hasGithub && invite === null; // đang chạy các bước hậu thanh toán (vài giây)
  const manual = invite === "error" || invite === "skipped";
  const account = `@${github}`;

  return (
    <div className="grid gap-4">
      <div className="grid justify-items-center gap-2.5 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2Icon className="size-8" />
        </span>
        <DialogHeader className="items-center gap-1.5">
          <DialogTitle className="text-2xl font-semibold sm:text-3xl">{tx.paidTitle}</DialogTitle>
          <DialogDescription className="text-base">
            {tx.paidDescBefore}
            <strong className="font-mono text-foreground">{code}</strong>
            {tx.paidDescAfter}
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Thông báo chính: sẽ có người liên hệ qua Zalo */}
      <div className="rounded-2xl border border-iris/25 bg-linear-to-br from-secondary/80 to-white p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center bg-brand-button rounded-full text-white">
            <MessageCircleIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-navy">{tx.zaloTitle}</p>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">{tx.zaloBody(phone)}</p>
          </div>
        </div>
      </div>

      {/* Tình trạng quyền vào repo (chỉ khi khách có điền GitHub) */}
      {hasGithub ? (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border bg-white p-3.5 text-sm leading-relaxed">
          {inviting && <Loader2Icon className="mt-0.5 size-4 shrink-0 animate-spin text-iris" />}
          <p className="text-muted-foreground">
            {inviting ? (
              tx.inviting(account)
            ) : manual ? (
              tx.inviteManual(account)
            ) : invite === "already" ? (
              tx.inviteAlready(account)
            ) : (
              <>
                {tx.inviteSentBefore(account)}
                <a href="https://github.com/notifications" target="_blank" rel="noopener noreferrer" className={linkCls}>{tx.inviteSentLink}</a>
                {tx.inviteSentAfter}
              </>
            )}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border bg-white p-3.5 text-sm leading-relaxed text-muted-foreground">{tx.noGithub}</p>
      )}

      {/* Cần hỗ trợ thêm → fanpage */}
      <div className="grid gap-3 rounded-2xl border bg-white p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold text-navy">{tx.helpTitle}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{tx.helpBody}</p>
        </div>
        <a href={SITE.contact.fanpage} target="_blank" rel="noopener noreferrer" className={cn(primaryCls, "h-11 shrink-0 px-5 text-[15px]")}>
          {tx.helpCta} <ExternalLinkIcon className="size-4" />
        </a>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {tx.prepBefore}
        <a href="#huong-dan" onClick={onClose} className={linkCls}>{tx.prepLink}</a>
        {tx.prepAfter}
        {SITE.bookingUrl && (
          <>
            {tx.bookingBefore}
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>{tx.bookingLink}</a>.
          </>
        )}
      </p>

      {(SITE.contact.zalo || SITE.contact.email) && (
        <p className="text-center text-xs text-muted-foreground">
          {tx.urgent}
          {SITE.contact.zalo && <>Zalo <b>{SITE.contact.zalo}</b></>}
          {SITE.contact.zalo && SITE.contact.email && " · "}
          {SITE.contact.email && <b>{SITE.contact.email}</b>}
        </p>
      )}
      <Button type="button" variant="outline" onClick={onClose} className="mx-auto h-10 px-6">{tx.close}</Button>
    </div>
  );
}
