import Script from "next/script";

// GA4 for draftly.blog (property 515981455). The measurement ID is public (it ships in
// every page), so it lives here; NEXT_PUBLIC_GA_MEASUREMENT_ID can override it. Google
// Signals and ad personalization stay off, and consent mode denies all advertising storage:
// this Google tag also carries a linked Google Ads destination (AW-…), and the privacy
// policy promises no advertising cookies. Flip ad_* to 'granted' only alongside a policy update.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-3VSK5GRW95";

export function GoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
