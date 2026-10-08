import Script from "next/script";

// GA4 for draftly.blog (property 515981455). The measurement ID is public (it ships in
// every page), so it lives here; NEXT_PUBLIC_GA_MEASUREMENT_ID can override it. Google
// Signals stay off. Consent mode controls advertising storage for the linked Google Ads
// destination (AW-…); see ADS_ENABLED below.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-3VSK5GRW95";

// Advertising/retargeting (the linked Google Ads destination). Off until retargeting
// starts AND the privacy policy's "we will not sell or share" line is updated. Even when
// on, a browser Global Privacy Control signal keeps ad storage denied, as the policy promises.
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export function GoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/.test(GA_ID)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var ads = ${ADS_ENABLED ? "!(navigator.globalPrivacyControl === true)" : "false"} ? 'granted' : 'denied';
gtag('consent', 'default', { ad_storage: ads, ad_user_data: ads, ad_personalization: ads, analytics_storage: 'granted' });
gtag('js', new Date());
gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: ${ADS_ENABLED} });`}
      </Script>
    </>
  );
}
