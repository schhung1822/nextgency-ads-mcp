"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  CalendarCheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  Loader2Icon,
  LockIcon,
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
import { orderInputSchema } from "@/lib/order-schema";
import { SITE, formatVnd } from "@/lib/site";

type PaymentInfo = { bank: string; accountNumber: string; accountName: string; qrUrl: string };
type Pending = { code: string; amount: number; payment: PaymentInfo; tracking: boolean; github?: string };
type PayStatus = "pending" | "paid" | "underpaid";
type InviteState = "invited" | "already" | "error" | "skipped" | null;
type GhUser = { status: "ok"; login: string; name: string | null; avatar: string };

const STORAGE_KEY = "ng-ads-mcp-order";
const POLL_MS = 4000;
const POLL_MAX_MS = 30 * 60 * 1000;

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  // Mở popup: nếu khách đang có đơn chờ thanh toán (lỡ đóng / tải lại trang) thì khôi phục.
  const openDialog = useCallback(() => {
    setPending((current) => current ?? readSaved());
    setOpen(true);
  }, []);
  return (
    <Ctx value={{ open: openDialog }}>
      {children}
      <CheckoutDialog open={open} onOpenChange={setOpen} pending={pending} setPending={setPending} />
    </Ctx>
  );
}

export function BuyButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  const { open } = useContext(Ctx);
  return (
    <Button type="button" onClick={open} {...props}>
      {children}
    </Button>
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
        if (data.status === "paid") writeSaved(null);
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
      <DialogContent className="max-h-[92dvh] overflow-y-auto p-5 sm:max-w-xl sm:p-6">
        {!pending ? (
          <OrderForm
            onCreated={(p) => {
              writeSaved(p);
              setStatus("pending");
              setPending(p);
            }}
          />
        ) : status === "paid" ? (
          <PaidView code={pending.code} invite={invite} github={pending.github} onClose={() => { onOpenChange(false); reset(); }} />
        ) : (
          <PayView pending={pending} status={status} onBack={reset} />
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Bước 1: thông tin ------------------------------ */

function OrderForm({ onCreated }: { onCreated: (p: Pending) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [ghUser, setGhUser] = useState<GhUser | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = { ...Object.fromEntries(form.entries()), consent };
    const parsed = orderInputSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      // Bước xác nhận: hiện avatar để khách chắc chắn đúng tài khoản GitHub sẽ nhận quyền vào repo.
      if (!ghUser || ghUser.login.toLowerCase() !== parsed.data.github.toLowerCase()) {
        const chk = await fetch(`/api/github/check?u=${encodeURIComponent(parsed.data.github)}`, { cache: "no-store" })
          .then((r) => r.json() as Promise<{ status: string } & Partial<GhUser>>)
          .catch(() => ({ status: "unavailable" }));
        if (chk.status === "not_found") {
          setErrors({ github: "Không tìm thấy tài khoản GitHub này. Kiểm tra lại tên đăng nhập (username)." });
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
        body: JSON.stringify(raw),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        toast.error(data.error ?? "Không tạo được đơn hàng. Vui lòng thử lại.");
        return;
      }
      onCreated({ ...(data as Pending), github: String(parsed.data.github) });
    } catch {
      toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Đăng ký mua {SITE.productName}</DialogTitle>
        <DialogDescription className="text-sm">
          Trọn bộ + Nextgency hỗ trợ setup · <strong className="text-foreground"><Vnd amount={SITE.price} /></strong>. Điền
          thông tin để nhận mã QR thanh toán.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        <Field id="name" label="Họ và tên" error={errors.name}>
          <Input id="name" name="name" autoComplete="name" placeholder="Nguyễn Văn A" aria-invalid={!!errors.name} className="h-10" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone" label="Số điện thoại / Zalo" error={errors.phone}>
            <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0901234567" aria-invalid={!!errors.phone} className="h-10" />
          </Field>
          <Field id="email" label="Email" error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="ban@congty.vn" aria-invalid={!!errors.email} className="h-10" />
          </Field>
        </div>
        <Field
          id="github"
          label="Tài khoản GitHub"
          hint="Dùng để mời bạn vào repo riêng chứa bộ cài. Chưa có? Đăng ký miễn phí tại github.com."
          error={errors.github}
        >
          <Input id="github" name="github" autoComplete="off" placeholder="username-github" aria-invalid={!!errors.github} className="h-10" onChange={() => setGhUser(null)} />
        </Field>
        {ghUser && (
          <div role="status" className="flex items-center gap-3 rounded-xl border border-iris/30 bg-secondary/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- avatar GitHub */}
            <img src={ghUser.avatar} alt="" width={44} height={44} className="size-11 rounded-full ring-2 ring-white" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-navy">
                {ghUser.name ? `${ghUser.name} · ` : ""}@{ghUser.login}
              </p>
              <p className="text-muted-foreground">Quyền vào repo sẽ được cấp cho tài khoản này. Đúng là tài khoản của bạn?</p>
            </div>
          </div>
        )}
        <Field id="note" label="Ghi chú (không bắt buộc)" error={errors.note}>
          <Textarea id="note" name="note" rows={2} placeholder="VD: đã có VPS chưa, chạy nền tảng nào, thời gian tiện để setup…" className="min-h-16" />
        </Field>

        <div className="grid gap-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={!!errors.consent} className="mt-0.5" />
            <Label htmlFor="consent" className="block text-sm leading-snug font-normal text-muted-foreground">
              Tôi đã đọc và đồng ý với{" "}
              <a href="/terms" target="_blank" rel="noopener" className="font-medium text-iris underline underline-offset-4">Điều khoản sử dụng</a>,{" "}
              <a href="/policies/chinh-sach-thanh-toan" target="_blank" rel="noopener" className="font-medium text-iris underline underline-offset-4">Chính sách thanh toán &amp; hoàn tiền</a> (dự án GitHub không hoàn tiền) và{" "}
              <a href="/privacy" target="_blank" rel="noopener" className="font-medium text-iris underline underline-offset-4">Chính sách quyền riêng tư</a>.
            </Label>
          </div>
          {errors.consent && <p role="alert" className="text-xs text-destructive">{errors.consent}</p>}
        </div>

        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <Button type="submit" size="lg" disabled={submitting} className="bg-brand-button h-11 w-full border-0 text-base font-semibold text-white hover:opacity-90">
          {submitting ? <Loader2Icon className="animate-spin" /> : <LockIcon />}
          {submitting ? "Đang xử lý…" : ghUser ? <>Đúng tài khoản của tôi · Tiếp tục thanh toán</> : <>Tiếp tục thanh toán · <Vnd amount={SITE.price} /></>}
        </Button>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0 text-azure" />
          Thanh toán chuyển khoản qua mã QR, hệ thống tự xác nhận khi nhận được tiền.
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
  const { code, amount, payment, tracking } = pending;
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Quét mã QR để thanh toán</DialogTitle>
        <DialogDescription className="text-sm">
          Mở app ngân hàng → quét mã. Số tiền và nội dung đã được điền sẵn — <strong className="text-foreground">đừng sửa nội dung chuyển khoản</strong> để hệ thống nhận diện đúng đơn.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
        <div className="mx-auto w-full max-w-[220px] rounded-2xl border bg-white p-2 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- QR động từ qr.sepay.vn */}
          <img src={payment.qrUrl} alt={`Mã QR thanh toán đơn ${code}`} width={400} height={400} className="aspect-square w-full" />
        </div>

        <dl className="grid content-start gap-3 text-sm">
          <Row label="Ngân hàng" value={payment.bank} />
          <Row label="Số tài khoản" value={payment.accountNumber} copy />
          <Row label="Chủ tài khoản" value={payment.accountName} />
          <Row label="Số tiền" value={formatVnd(amount)} copyValue={String(amount)} emphasis />
          <Row label="Nội dung CK" value={code} copy emphasis />
        </dl>
      </div>

      {status === "underpaid" && (
        <div role="status" className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
          Hệ thống đã nhận một khoản nhưng chưa đủ <Vnd amount={amount} />. Vui lòng chuyển bù phần còn thiếu với cùng nội dung <strong>{code}</strong>, hoặc liên hệ Nextgency.
        </div>
      )}

      <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
        {tracking ? (
          <>
            <Loader2Icon className="size-4 shrink-0 animate-spin text-iris" />
            Đang chờ thanh toán… trang sẽ tự cập nhật ngay khi nhận được tiền.
          </>
        ) : (
          <>Sau khi chuyển khoản, Nextgency sẽ xác nhận và liên hệ bạn qua số điện thoại / email đã đăng ký.</>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Mã đơn: <span className="font-mono text-foreground">{code}</span></span>
        <button type="button" onClick={onBack} className="underline underline-offset-4 hover:text-foreground">
          Nhập lại thông tin
        </button>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  copy,
  copyValue,
  emphasis,
}: {
  label: string;
  value: string;
  copy?: boolean;
  copyValue?: string;
  emphasis?: boolean;
}) {
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      toast.success(`Đã sao chép ${label.toLowerCase()}`);
    } catch {
      toast.error("Không sao chép được — hãy chọn và copy thủ công.");
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dashed pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 text-right">
        <span className={emphasis ? "font-mono text-base font-semibold text-foreground" : "font-medium text-foreground"}>
          {value || "—"}
        </span>
        {(copy || copyValue) && value && (
          <Button type="button" variant="ghost" size="icon-xs" onClick={doCopy} aria-label={`Sao chép ${label.toLowerCase()}`}>
            <CopyIcon />
          </Button>
        )}
      </dd>
    </div>
  );
}

/* ------------------------------ Bước 3: xong ------------------------------ */

function PaidView({
  code,
  invite,
  github,
  onClose,
}: {
  code: string;
  invite: InviteState;
  github?: string;
  onClose: () => void;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const inviting = invite === null; // đang chạy các bước hậu thanh toán (vài giây)
  const manual = invite === "error" || invite === "skipped";

  const steps = [
    {
      id: "github",
      title: manual ? "Chờ Nextgency mời tài khoản GitHub của bạn" : "Chấp nhận lời mời vào repo trên GitHub",
      body: inviting
        ? `Đang gửi lời mời tới ${github ? "@" + github : "tài khoản GitHub của bạn"}… vài giây nữa bạn sẽ thấy xác nhận.`
        : manual
        ? `Chúng tôi sẽ mời ${github ? "@" + github : "tài khoản GitHub của bạn"} vào repo trong giờ làm việc. Bạn sẽ nhận email từ GitHub — bấm Accept khi nhận được.`
        : invite === "already"
          ? "Tài khoản của bạn đã có quyền truy cập repo — không cần làm gì thêm."
          : `Lời mời đã được gửi tới ${github ? "@" + github : "tài khoản GitHub của bạn"}. Mở email từ GitHub hoặc trang thông báo rồi bấm Accept (lời mời hết hạn sau 7 ngày).`,
      link: { href: "https://github.com/notifications", label: "Mở thông báo GitHub" },
    },
    {
      id: "infra",
      title: "Chuẩn bị VPS và tên miền",
      body: "VPS Ubuntu 24.04 (tối thiểu 1 vCPU, 2 GB RAM, 20 GB ổ cứng) và 1 tên miền để trỏ về VPS.",
      link: { href: "#huong-dan", label: "Xem hướng dẫn chuẩn bị", internal: true },
    },
    {
      id: "token",
      title: "Tạo token GitHub (sau khi đã Accept)",
      body: "Token classic, tích repo và read:packages, hạn 1 năm. Lưu vào trình quản lý mật khẩu — không gửi cho ai.",
      link: { href: "https://github.com/settings/tokens/new", label: "Tạo token" },
    },
  ];
  const allDone = steps.every((st) => done[st.id]);

  return (
    <div className="grid gap-5">
      <div className="grid justify-items-center gap-3 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2Icon className="size-8" />
        </span>
        <DialogHeader className="items-center">
          <DialogTitle className="text-2xl font-semibold">Thanh toán thành công!</DialogTitle>
          <DialogDescription className="max-w-md text-sm">
            Đơn <strong className="font-mono text-foreground">{code}</strong> đã được xác nhận. Làm theo 3 bước dưới đây để buổi setup diễn ra nhanh nhất.
          </DialogDescription>
        </DialogHeader>
      </div>

      <ol className="grid gap-2.5">
        {steps.map((st, i) => (
          <li key={st.id} className={`rounded-xl border p-3.5 transition-colors ${done[st.id] ? "border-emerald-300 bg-emerald-50/60" : "bg-white"}`}>
            <div className="flex items-start gap-3">
              <Checkbox
                id={`step-${st.id}`}
                checked={!!done[st.id]}
                onCheckedChange={(v) => setDone((d) => ({ ...d, [st.id]: v === true }))}
                className="mt-1"
              />
              <div className="min-w-0 text-sm">
                <Label htmlFor={`step-${st.id}`} className="block cursor-pointer text-[15px] font-semibold text-navy">
                  {i + 1}. {st.title}
                </Label>
                <p className="mt-1 leading-relaxed text-muted-foreground">{st.body}</p>
                <a
                  href={st.link.href}
                  {...(st.link.internal ? { onClick: onClose } : { target: "_blank", rel: "noopener noreferrer" })}
                  className="mt-1.5 inline-flex items-center gap-1 font-medium text-iris underline underline-offset-4"
                >
                  {st.link.label}
                  {!st.link.internal && <ExternalLinkIcon className="size-3.5" />}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {SITE.bookingUrl ? (
        <div className="grid gap-2 rounded-xl bg-secondary/70 p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-navy">
            <CalendarCheckIcon className="size-4 text-iris" /> Đặt lịch hỗ trợ setup
          </p>
          {allDone ? (
            <a
              href={SITE.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold text-white hover:opacity-90"
            >
              Chọn khung giờ <ExternalLinkIcon className="size-4" />
            </a>
          ) : (
            <>
              <button type="button" disabled className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-full bg-muted px-6 text-base font-semibold text-muted-foreground">
                Chọn khung giờ
              </button>
              <p className="text-xs text-muted-foreground">Tích đủ 3 mục ở trên để mở lịch — buổi setup sẽ diễn ra nhanh hơn khi bạn đã chuẩn bị xong.</p>
            </>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-secondary/70 p-4 text-center text-sm text-secondary-foreground">
          Nextgency sẽ liên hệ bạn sớm để hẹn lịch hỗ trợ setup.
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        <GitBranchIcon className="mr-1 inline size-3.5" />
        Hãy lưu lại mã đơn <b className="font-mono">{code}</b>
        {(SITE.contact.zalo || SITE.contact.email) && (
          <>
            {" "}· Cần gấp? {SITE.contact.zalo && <>Zalo <b>{SITE.contact.zalo}</b></>}
            {SITE.contact.zalo && SITE.contact.email && " · "}
            {SITE.contact.email && <b>{SITE.contact.email}</b>}
          </>
        )}
      </p>
      <Button type="button" variant="outline" onClick={onClose} className="mx-auto h-10 px-6">Đóng</Button>
    </div>
  );
}
