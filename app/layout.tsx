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
  title: "Draftly — Stop Writing for Algorithms. Start Writing for Humans.",
  description:
    "AI-powered content that curates timely topics and writes brand-aligned first drafts in one click. No blank pages. No guessing.",
  openGraph: {
    title: "Draftly — Stop Writing for Algorithms. Start Writing for Humans.",
    description:
      "AI-powered content that curates timely topics and writes brand-aligned first drafts in one click.",
    type: "website",
    url: "https://draftly.blog",
  },
  icons: {
    icon: "https://draftly.blog/wp-content/uploads/2025/10/cropped-Draftly.blog_.png",
    apple: "https://draftly.blog/wp-content/uploads/2025/10/cropped-Draftly.blog_.png",
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
