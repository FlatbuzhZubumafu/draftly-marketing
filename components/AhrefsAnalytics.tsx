import Script from "next/script";

// Ahrefs Web Analytics for www.draftly.blog. Cookieless page-view tracking that feeds the
// Ahrefs project (traffic by page, referrer and channel next to rankings). The data key is
// public (it ships in every page), so it lives here; NEXT_PUBLIC_AHREFS_ANALYTICS_KEY can override it.
const AHREFS_KEY = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY || "lTJESAY+RP/CIKayswO67w";

export function AhrefsAnalytics() {
  if (!AHREFS_KEY) return null;
  return <Script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_KEY} strategy="afterInteractive" />;
}
