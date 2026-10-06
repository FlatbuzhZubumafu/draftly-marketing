import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Terms and Conditions", alternates: { canonical: "/terms-and-conditions" }, openGraph: { title: "Terms and Conditions | Draftly", type: "website", url: "/terms-and-conditions" } };

export default function TermsPage() {
  return <LegalPage slug="terms-and-conditions" />;
}
