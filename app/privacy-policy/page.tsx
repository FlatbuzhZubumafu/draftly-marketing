import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 3600;
const TITLE = "Privacy Policy | Draftly AI Blog Writer";
const DESCRIPTION =
  "How Draftly collects, uses, shares and protects your information, including Google API data, cookies and analytics, data retention and your privacy rights.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/privacy-policy" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/privacy-policy", images: [DEFAULT_OG_IMAGE] },
};

export default function PrivacyPolicyPage() {
  return <LegalPage slug="privacy-policy" />;
}
