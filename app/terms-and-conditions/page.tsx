import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 3600;
const TITLE = "Terms and Conditions | Draftly AI Blog Writer";
const DESCRIPTION =
  "The terms for using Draftly, the AI blog writer: accounts, purchases and subscriptions, your content, prohibited activities, liability limits and disputes.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/terms-and-conditions" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/terms-and-conditions", images: [DEFAULT_OG_IMAGE] },
};

export default function TermsPage() {
  return <LegalPage slug="terms-and-conditions" />;
}
