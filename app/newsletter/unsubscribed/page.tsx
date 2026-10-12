import type { Metadata } from "next";
import { NewsletterStatusPage } from "@/components/NewsletterStatusPage";

export const metadata: Metadata = {
  title: { absolute: "Unsubscribed | Draftly" },
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/unsubscribed" },
};

export default function NewsletterUnsubscribedPage() {
  return (
    <NewsletterStatusPage
      title="You're unsubscribed"
      body="You won't get the Draftly newsletter anymore. If that was a mistake, you can sign up again from the blog."
      links={[{ href: "/blog", label: "Go to the blog" }]}
    />
  );
}
