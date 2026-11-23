"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";

/** Phần tối thiểu của PayPal JS SDK mà trang này dùng. */
type ClickActions = { resolve: () => Promise<void>; reject: () => Promise<void> };
type ApproveActions = { restart: () => Promise<void> };
type ButtonsConfig = {
  style?: Record<string, unknown>;
  onClick?: (data: unknown, actions: ClickActions) => void | Promise<void>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }, actions: ApproveActions) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: unknown) => void;
};
type ButtonsInstance = { isEligible: () => boolean; render: (el: HTMLElement) => Promise<void>; close: () => Promise<void> };
type PayPalNamespace = { Buttons: (cfg: ButtonsConfig) => ButtonsInstance };

export type PayPalHandlers = {
  onClick: (data: unknown, actions: ClickActions) => void | Promise<void>;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }, actions: ApproveActions) => Promise<void>;
  onCancel: () => void;
  onError: (err: unknown) => void;
};

let sdk: Promise<PayPalNamespace> | null = null;

/** Tải PayPal JS SDK đúng một lần cho cả trang. */
function loadSdk(clientId: string): Promise<PayPalNamespace> {
  const existing = (window as unknown as { paypal?: PayPalNamespace }).paypal;
  if (existing?.Buttons) return Promise.resolve(existing);
  sdk ??= new Promise<PayPalNamespace>((resolve, reject) => {
    const params = new URLSearchParams({ "client-id": clientId, currency: "USD", intent: "capture", components: "buttons" });
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?${params}`;
    script.async = true;
    script.onload = () => {
      const ns = (window as unknown as { paypal?: PayPalNamespace }).paypal;
      if (ns?.Buttons) resolve(ns);
      else {
        sdk = null;
        reject(new Error("PayPal SDK is unavailable"));
      }
    };
    script.onerror = () => {
      sdk = null;
      script.remove();
      reject(new Error("Could not load PayPal"));
    };
    document.head.appendChild(script);
  });
  return sdk;
}

/**
 * Nút thanh toán PayPal (Smart Buttons: PayPal + thẻ). SDK chỉ được tải khi khung thanh toán sắp hiện ra trên màn hình,
 * để khách chỉ đọc trang không bị gọi sang PayPal. Các handler được giữ trong ref nên nút không bị dựng lại khi form đổi.
 */
export function PayPalButtons({ clientId, handlers }: { clientId: string; handlers: PayPalHandlers }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const handlersRef = useRef(handlers);
  const [armed, setArmed] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "unavailable" | "error">("loading");

  useEffect(() => {
    handlersRef.current = handlers;
  });

  // Đợi tới khi khung thanh toán gần vào màn hình rồi mới tải SDK.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || armed) return;
    if (!("IntersectionObserver" in window)) {
      const raf = requestAnimationFrame(() => setArmed(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  useEffect(() => {
    if (!armed) return;
    let cancelled = false;
    let instance: ButtonsInstance | null = null;

    loadSdk(clientId)
      .then((paypal) => {
        const mount = mountRef.current;
        if (cancelled || !mount) return;
        instance = paypal.Buttons({
          style: { layout: "vertical", shape: "pill", color: "gold", label: "pay", height: 46, tagline: false },
          onClick: (d, a) => handlersRef.current.onClick(d, a),
          createOrder: () => handlersRef.current.createOrder(),
          onApprove: (d, a) => handlersRef.current.onApprove(d, a),
          onCancel: () => handlersRef.current.onCancel(),
          onError: (e) => handlersRef.current.onError(e),
        });
        if (!instance.isEligible()) {
          setState("unavailable");
          return;
        }
        return instance.render(mount).then(() => {
          if (!cancelled) setState("ready");
        });
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
      instance?.close().catch(() => {});
    };
  }, [armed, clientId]);

  return (
    <div ref={wrapRef} className="grid gap-2">
      {state === "loading" && (
        <div role="status" className="flex h-12 items-center justify-center gap-2 rounded-full bg-secondary text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading secure checkout…
        </div>
      )}
      {state === "error" && (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          We couldn’t load PayPal. Check your connection or any ad blocker, then reload the page.
        </p>
      )}
      {state === "unavailable" && (
        <p role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          PayPal checkout isn’t available in this browser or region. Please email us and we’ll help you order another way.
        </p>
      )}
      {/* Luôn hiển thị (không display:none) vì PayPal cần đo bề rộng khung chứa lúc dựng nút. */}
      <div ref={mountRef} />
    </div>
  );
}
