import Script from "next/script";
import { GTM_ID, META_PIXEL_ID } from "@/lib/tracking";

/**
 * Script đo lường — đặt cuối <body> trong app/layout.tsx.
 *  • Google Tag Manager (cấu hình GA4 và các tag khác ngay trong GTM).
 *  • Meta Pixel (Dataset) — chỉ tải khi có NEXT_PUBLIC_META_PIXEL_ID.
 *
 * Lưu ý: nếu đã đặt NEXT_PUBLIC_META_PIXEL_ID thì KHÔNG thêm tag Meta Pixel trong GTM nữa, kẻo đếm đôi.
 */
export function AnalyticsScripts() {
  return (
    <>
      {GTM_ID && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}

/** Bản <noscript> cho người tắt JavaScript — đặt ngay sau thẻ <body> mở. */
export function AnalyticsNoscript() {
  return (
    <>
      {GTM_ID && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      )}
      {META_PIXEL_ID && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- pixel 1x1 theo hướng dẫn của Meta */}
          <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
        </noscript>
      )}
    </>
  );
}
