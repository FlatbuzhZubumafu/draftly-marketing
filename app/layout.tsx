import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GlobalAnimations } from "@/components/GlobalAnimations";
import { jsonLdHtml, organizationJsonLd, websiteJsonLd } from "@/lib/schema";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_URL } from "@/lib/site";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s | Draftly",
  },
  description: HOME_DESCRIPTION,
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: "Draftly",
    type: "website",
  },
  // Title and description fall back to each page's Open Graph tags.
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(organizationJsonLd, websiteJsonLd) }} />
        {children}
        <GlobalAnimations />
      </body>
    </html>
  );
}
