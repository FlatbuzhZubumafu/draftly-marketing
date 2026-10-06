import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GlobalAnimations } from "@/components/GlobalAnimations";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.draftly.blog"),
  title: {
    default: "Draftly: Blog Posts in Your Brand's Voice, Ready to Publish",
    template: "%s | Draftly",
  },
  description:
    "Draftly reads your website, picks timely topics from your industry's news, and writes full blog posts in your voice. Publish to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace in one click.",
  openGraph: {
    title: "Draftly: Blog Posts in Your Brand's Voice, Ready to Publish",
    description:
      "Draftly reads your website, picks timely topics from your industry's news, and writes full blog posts in your voice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans">
        {children}
        <GlobalAnimations />
      </body>
    </html>
  );
}
