"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangleIcon, CheckCircle2Icon, Loader2Icon, LockIcon, MailIcon, ShieldCheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMetaBrowserIds, trackPurchaseComplete, trackRegistrationComplete } from "@/lib/analytics-client";
import { useConsent } from "@/lib/consent";
import { COUNTRIES, GDPR_COUNTRIES } from "@/lib/countries";
import { globalOrderSchema } from "@/lib/global-order-schema";
import { G, PRICE } from "@/lib/global/copy";
import { GLOBAL, LEGAL_GLOBAL, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { PayPalButtons, type PayPalHandlers } from "./paypal-buttons";

const CLIENT_ID = (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "").trim();
const P = GLOBAL.path;

type Values = { name: string; email: string; country: string; github: string; note: string };
const EMPTY: Values = { name: "", email: "", country: "", github: "", note: "" };

type Gh = { state: "idle" } | { state: "checking" } | { state: "ok"; login: string; name: string | null; avatar: string } | { state: "not_found" };
type InviteState = "invited" | "already" | "error" | "skipped" | null;
type View =
  | { kind: "form" }
  | { kind: "paid"; code: string; email: string; github: string }
  | { kind: "processing"; code: string; email: string };

const FIELD_ORDER = ["name", "email", "country", "github", "note", "consentTerms", "consentDigital"] as const;
const FIELD_ID: Record<string, string> = {
  name: "co-name",
  email: "co-email",
  country: "co-country",
  github: "co-github",
  note: "co-note",
  consentTerms: "co-terms",
  consentDigital: "co-digital",
};

const linkCls = "font-medium text-iris underline underline-offset-4";
const selectCls =
  "h-11 w-full rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm";

/** Chuẩn hoá tên GitHub giống schema: bỏ URL / dấu @. */
const cleanGithub = (v: string) => v.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/^@/, "").replace(/\/+$/, "");
const GH_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

export function GlobalCheckout() {
  const consent = useConsent();
  const [values, setValues] = useState<Values>(EMPTY);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentDigital, setConsentDigital] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [view, setView] = useState<View>({ kind: "form" });
  const [confirming, setConfirming] = useState(false);
  const [failure, setFailure] = useState<{ code?: string; message: string } | null>(null);
  const [invite, setInvite] = useState<InviteState>(null);

  // Kiểm tra tên GitHub (có thật không) và hiện avatar để khách chắc chắn đúng tài khoản sẽ nhận lời mời.
  // Kết quả được ghi nhớ theo tên đã kiểm tra; tên đang gõ mà chưa có kết quả thì coi là "đang kiểm tra".
  const ghName = cleanGithub(values.github);
  const ghValid = GH_RE.test(ghName);
  const [ghResult, setGhResult] = useState<{ name: string; res: Gh } | null>(null);
  const gh: Gh = !ghValid ? { state: "idle" } : ghResult?.name === ghName ? ghResult.res : { state: "checking" };

  useEffect(() => {
    if (!ghValid) return;
    let stopped = false;
    const t = setTimeout(async () => {
      let res: Gh = { state: "idle" }; // không kiểm tra được / chưa bật kiểm tra: không chặn đơn
      try {
        const r = (await fetch(`/api/github/check?u=${encodeURIComponent(ghName)}`, { cache: "no-store" }).then((x) => x.json())) as {
          status: string;
          login?: string;
          name?: string | null;
          avatar?: string;
        };
        if (r.status === "not_found") res = { state: "not_found" };
        else if (r.status === "ok" && r.login && r.avatar) res = { state: "ok", login: r.login, name: r.name ?? null, avatar: r.avatar };
      } catch {
        /* giữ "idle" */
      }
      if (!stopped) setGhResult({ name: ghName, res });
    }, 600);
    return () => {
      stopped = true;
      clearTimeout(t);
    };
  }, [ghName, ghValid]);

  // Các handler của nút PayPal chạy ngoài vòng render → đọc giá trị mới nhất qua ref.
  const latest = useRef({ values, consentTerms, consentDigital, marketing, consent, gh });
  useEffect(() => {
    latest.current = { values, consentTerms, consentDigital, marketing, consent, gh };
  });
  const codeRef = useRef<string | null>(null);
  const lastError = useRef<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    setErrors((er) => (er[k] ? { ...er, [k]: "" } : er));
  };

  function validate() {
    const s = latest.current;
    const parsed = globalOrderSchema.safeParse({
      ...s.values,
      consentTerms: s.consentTerms,
      consentDigital: s.consentDigital,
      marketingOptIn: s.marketing,
      trackConsent: s.consent === "all",
    });
    const next: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
    }
    if (s.gh.state === "not_found") next.github ??= "We couldn’t find this GitHub account. Check the username, or leave it blank.";
    setErrors(next);
    const first = FIELD_ORDER.find((k) => next[k]);
    if (first) {
      const el = document.getElementById(FIELD_ID[first]);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    }
    return parsed.success && !first ? parsed.data : null;
  }

  const handlers: PayPalHandlers = {
    // Chạy trước khi PayPal mở cửa sổ: form chưa hợp lệ thì không cho thanh toán.
    onClick: async (_data, actions) => {
      setFailure(null);
      // Đang kiểm tra GitHub thì đợi tối đa vài giây để kết quả kịp về.
      for (let i = 0; i < 20 && latest.current.gh.state === "checking"; i++) await new Promise((r) => setTimeout(r, 150));
      return validate() ? actions.resolve() : actions.reject();
    },
    createOrder: async () => {
      const data = validate();
      if (!data) throw new Error("Please check your details.");
      let res: Response;
      try {
        const tracking = latest.current.consent === "all" ? getMetaBrowserIds() : undefined;
        res = await fetch("/api/paypal/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // tracking: _fbp/_fbc của Meta Pixel (chỉ có khi khách đã đồng ý cookie) để báo Purchase từ máy chủ đúng người
          body: JSON.stringify({ ...data, ...(tracking ? { tracking } : {}) }),
        });
      } catch {
        lastError.current = "Connection error. Please check your network and try again.";
        throw new Error(lastError.current);
      }
      const json = (await res.json().catch(() => ({}))) as { id?: string; code?: string; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !json.id || !json.code) {
        if (json.fieldErrors) setErrors(json.fieldErrors);
        lastError.current = json.error ?? "We couldn’t start your payment. Please try again.";
        throw new Error(lastError.current);
      }
      codeRef.current = json.code;
      if (latest.current.consent === "all") trackRegistrationComplete(json.code); // đơn đã được tạo, chờ thanh toán
      return json.id;
    },
    onApprove: async (data, actions) => {
      setConfirming(true);
      const { values: v } = latest.current;
      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const r = (await res.json().catch(() => ({}))) as { status?: string; code?: string; error?: string };
        const code = r.code ?? codeRef.current ?? "";
        if (r.status === "declined") {
          toast.error("PayPal couldn’t use that payment method. Please try another one.");
          await actions.restart();
        } else if (r.status === "paid") {
          if (latest.current.consent === "all") trackPurchaseComplete(code, GLOBAL.priceUsd, "USD"); // hoàn tất thanh toán (tự chống gửi lặp)
          setView({ kind: "paid", code, email: v.email.trim(), github: cleanGithub(v.github) });
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (r.status === "processing") {
          setView({ kind: "processing", code, email: v.email.trim() });
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          setFailure({ code: code || undefined, message: r.error ?? "We couldn’t confirm your payment automatically. Please don’t pay again — email us and we’ll sort it out." });
        }
      } catch {
        setFailure({
          code: codeRef.current ?? undefined,
          message: "We couldn’t confirm your payment automatically. Please don’t pay again — if PayPal charged you, email us with your order code.",
        });
      } finally {
        setConfirming(false);
      }
    },
    onCancel: () => toast("Payment cancelled. You haven’t been charged."),
    onError: () => {
      toast.error(lastError.current ?? "Something went wrong with PayPal. Please try again.");
      lastError.current = null;
    },
  };

  // Sau khi thanh toán: theo dõi trạng thái lời mời GitHub (hệ thống gửi lời mời chạy nền trong vài giây).
  useEffect(() => {
    if (view.kind !== "paid" || !view.github || invite !== null) return;
    let stopped = false;
    const startedAt = Date.now();
    const tick = async () => {
      try {
        const res = await fetch(`/api/orders/${view.code}`, { cache: "no-store" });
        if (!res.ok) return;
        const d = (await res.json()) as { invite?: InviteState };
        if (!stopped && d.invite) setInvite(d.invite);
      } catch {
        /* mạng chập chờn — thử lại ở lần sau */
      }
    };
    void tick();
    const id = setInterval(() => {
      if (Date.now() - startedAt > 90_000) return clearInterval(id);
      void tick();
    }, 3000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [view, invite]);

  const mail = GLOBAL.contactEmail;

  return (
    <div ref={rootRef} className="scroll-mt-24 rounded-3xl border border-white/20 bg-white p-5 text-navy shadow-2xl shadow-black/30 sm:p-8">
      {view.kind === "paid" ? (
        <PaidView code={view.code} email={view.email} github={view.github} invite={invite} />
      ) : view.kind === "processing" ? (
        <ProcessingView code={view.code} email={view.email} />
      ) : (
        <div className="grid gap-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-xl font-semibold text-navy">Order {G.buy.card.label}</h3>
            <p className="text-sm text-muted-foreground">
              <b className="font-archivo text-lg text-navy tabular-nums">{PRICE}</b> · {G.buy.card.sub} · {G.buy.card.included.toLowerCase()}
            </p>
          </div>

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <Field id={FIELD_ID.name} label="Full name" error={errors.name}>
              <Input id={FIELD_ID.name} name="name" autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} maxLength={80} className="h-11" />
            </Field>
            <Field id={FIELD_ID.email} label="Email" hint="Your receipt and setup details go here." error={errors.email}>
              <Input id={FIELD_ID.email} name="email" type="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} maxLength={120} placeholder="you@company.com" className="h-11" />
            </Field>
          </div>

          <Field id={FIELD_ID.country} label="Country" error={errors.country}>
            <select id={FIELD_ID.country} name="country" autoComplete="country" value={values.country} onChange={set("country")} aria-invalid={!!errors.country} className={selectCls}>
              <option value="">Select country</option>
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </Field>

          <Field
            id={FIELD_ID.github}
            label="GitHub username (optional)"
            hint="Not technical, or no account yet? Leave it blank and we’ll help you after payment. If you have one, enter it to get the repo invite right away."
            error={errors.github}
          >
            <Input id={FIELD_ID.github} name="github" autoComplete="off" value={values.github} onChange={set("github")} aria-invalid={!!errors.github} maxLength={80} placeholder="github-username" className="h-11" />
          </Field>
          {gh.state === "checking" && (
            <p className="-mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Loader2Icon className="size-3.5 animate-spin" /> Checking GitHub…</p>
          )}
          {gh.state === "ok" && (
            <div role="status" className="-mt-2 flex items-center gap-3 rounded-xl border border-iris/30 bg-secondary/60 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- avatar GitHub */}
              <img src={gh.avatar} alt="" width={40} height={40} className="size-10 rounded-full ring-2 ring-white" />
              <div className="min-w-0 text-sm">
                <p className="font-semibold text-navy">{gh.name ? `${gh.name} · ` : ""}@{gh.login}</p>
                <p className="text-muted-foreground">Repo access will be granted to this account. Not yours? Fix the username above.</p>
              </div>
            </div>
          )}

          <Field id={FIELD_ID.note} label="Notes (optional)" error={errors.note}>
            <Textarea id={FIELD_ID.note} name="note" rows={2} value={values.note} onChange={set("note")} maxLength={500} placeholder="E.g. do you have a server yet, which ad platforms you run, your time zone…" className="min-h-20" />
          </Field>

          <div className="grid gap-3.5 border-t pt-5">
            {GDPR_COUNTRIES.has(values.country) && (
              <p className="rounded-xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
                We use your details to deliver your order and help you set up. We send product emails only if you tick the optional box below.
              </p>
            )}
            <Consent id={FIELD_ID.consentTerms} checked={consentTerms} onChange={(v) => { setConsentTerms(v); if (v) setErrors((e) => ({ ...e, consentTerms: "" })); }} error={errors.consentTerms}>
              I agree to the <Link href={`${P}/terms`} target="_blank" className={linkCls}>Terms of Service</Link> and the{" "}
              <Link href={`${P}/payment-refund-policy`} target="_blank" className={linkCls}>Payment &amp; Refund Policy</Link>, and I have read the{" "}
              <Link href={`${P}/privacy`} target="_blank" className={linkCls}>Privacy Policy</Link>.
            </Consent>
            <Consent id={FIELD_ID.consentDigital} checked={consentDigital} onChange={(v) => { setConsentDigital(v); if (v) setErrors((e) => ({ ...e, consentDigital: "" })); }} error={errors.consentDigital}>
              I want access to the repository right after I pay. I understand that once I have access I can’t cancel or get a refund, except where the law says otherwise.
            </Consent>
            <Consent id="co-marketing" checked={marketing} onChange={setMarketing}>
              Email me product updates and tips. <span className="text-muted-foreground">Optional. Unsubscribe anytime.</span>
            </Consent>
          </div>

          {/* honeypot đã nằm trong schema (website) — người thật không thấy ô này nên không cần hiển thị ở đây */}

          <div className="grid gap-3">
            {failure && (
              <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0" />
                <p>
                  {failure.message}
                  {failure.code && <> Order code: <b className="font-mono">{failure.code}</b>.</>}
                  {mail && <> <a href={`mailto:${mail}`} className="font-semibold underline underline-offset-4">{mail}</a></>}
                </p>
              </div>
            )}

            {CLIENT_ID ? (
              <div className={cn("relative", confirming && "pointer-events-none")}>
                <PayPalButtons clientId={CLIENT_ID} handlers={handlers} />
                {confirming && (
                  <div role="status" className="absolute inset-0 grid place-items-center rounded-2xl bg-white/90 text-sm font-medium text-navy">
                    <span className="flex items-center gap-2"><Loader2Icon className="size-4 animate-spin text-iris" /> Confirming your payment… please don’t close this page.</span>
                  </div>
                )}
              </div>
            ) : (
              <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-900">
                Online checkout isn’t switched on yet.
                {mail ? <> Email <a href={`mailto:${mail}?subject=${encodeURIComponent(`Order ${SITE.productName}`)}`} className="font-semibold underline underline-offset-4">{mail}</a> and we’ll help you order.</> : " Please contact us to order."}
              </p>
            )}

            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0 text-azure" />
              <span>
                <LockIcon className="mr-1 inline size-3 align-[-1px]" />
                Payments are processed by PayPal, by PayPal balance or debit/credit card. We never see your card details. Price in US dollars; your bank or PayPal may add currency-conversion fees.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p role="alert" className="text-xs text-destructive">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Consent({ id, checked, onChange, error, children }: { id: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-start gap-2.5">
        <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} aria-invalid={!!error} className="mt-0.5" />
        <Label htmlFor={id} className="block text-sm leading-snug font-normal text-navy/85">{children}</Label>
      </div>
      {error && <p role="alert" className="pl-6.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ sau thanh toán */

function PaidView({ code, email, github, invite }: { code: string; email: string; github: string; invite: InviteState }) {
  const hasGithub = Boolean(github);
  const inviting = hasGithub && invite === null;
  const manual = invite === "error" || invite === "skipped";
  const account = `@${github}`;
  const mail = GLOBAL.contactEmail;

  return (
    <div role="status" className="grid gap-4">
      <div className="grid justify-items-center gap-2 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2Icon className="size-8" />
        </span>
        <h3 className="text-2xl font-semibold text-navy sm:text-3xl">Payment received. Thank you!</h3>
        <p className="text-muted-foreground">
          Order <b className="font-mono text-navy">{code}</b>. PayPal emails you the receipt.
        </p>
      </div>

      <div className="rounded-2xl border border-iris/25 bg-linear-to-br from-secondary/80 to-white p-5">
        <div className="flex items-start gap-4">
          <span className="bg-brand-button grid size-11 shrink-0 place-items-center rounded-full text-white"><MailIcon className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-navy">We’ll email you to help with setup</p>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">
              A team member will write to <b className="text-navy">{email}</b> within {LEGAL_GLOBAL.firstResponse} ({LEGAL_GLOBAL.workHours}). Check your spam folder if you don’t see us.
            </p>
          </div>
        </div>
      </div>

      {hasGithub ? (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border bg-white p-3.5 text-sm leading-relaxed">
          {inviting && <Loader2Icon className="mt-0.5 size-4 shrink-0 animate-spin text-iris" />}
          <p className="text-muted-foreground">
            {inviting
              ? `Sending the repository invite to ${account}… you’ll see a confirmation in a few seconds.`
              : manual
                ? `We’ll invite ${account} to the repository during working hours. You’ll get an email from GitHub — click Accept when it arrives.`
                : invite === "already"
                  ? `${account} already has access to the repository. Nothing else to do.`
                  : (
                    <>
                      The repository invite has been sent to {account}. Open your email or{" "}
                      <a href="https://github.com/notifications" target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub notifications</a>{" "}
                      and click Accept (the invite expires after 7 days).
                    </>
                  )}
          </p>
        </div>
      ) : (
        <p className="rounded-xl border bg-white p-3.5 text-sm leading-relaxed text-muted-foreground">
          No GitHub account yet? No problem. We’ll help you create one and give you access when we email you.
        </p>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Want to get ready first? See <a href="#setup" className={linkCls}>what to have ready</a>.
        {mail && <> Questions? <a href={`mailto:${mail}`} className={linkCls}>{mail}</a></>}
      </p>
    </div>
  );
}

function ProcessingView({ code, email }: { code: string; email: string }) {
  const mail = GLOBAL.contactEmail;
  return (
    <div role="status" className="grid gap-3 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-amber-100 text-amber-600">
        <Loader2Icon className="size-7" />
      </span>
      <h3 className="text-2xl font-semibold text-navy">Your payment is being processed</h3>
      <p className="text-muted-foreground">
        PayPal is still confirming order <b className="font-mono text-navy">{code}</b>. We’ll email <b className="text-navy">{email}</b> as soon as it’s confirmed, so there’s no need to pay again.
        {mail && <> Questions? <a href={`mailto:${mail}`} className={linkCls}>{mail}</a></>}
      </p>
    </div>
  );
}
