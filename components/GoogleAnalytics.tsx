import Script from "next/script";

// GA4 for draftly.blog. Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set
// (Vercel → draftly-marketing-cms → Environment Variables). Google Signals and ad
// personalization stay off: the privacy policy promises no advertising cookies.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
