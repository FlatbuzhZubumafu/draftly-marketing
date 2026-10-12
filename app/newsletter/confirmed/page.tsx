import type { Metadata } from "next";
import { NewsletterStatusPage } from "@/components/NewsletterStatusPage";

export const metadata: Metadata = {
  title: { absolute: "Newsletter subscription | Draftly" },
  robots: { index: false, follow: false },
  alternates: { canonical: "/newsletter/confirmed" },
};

// The newsletter-confirm edge function redirects here, adding ?status=expired,
// ?status=invalid or ?status=error when the link didn't work.
const STATES = {
  ok: {
    title: "You're subscribed",
    body: "Thanks for confirming. The next tip lands in your inbox on a Tuesday morning. Until then, the blog has plenty to read.",
  },
  expired: {
    title: "That link has expired",
    body: "Confirmation links work for 7 days. Sign up again below any blog post and we'll send you a fresh one.",
  },
  invalid: {
    title: "That link didn't work",
    body: "It may have been replaced by a newer confirmation email, or copied incompletely. Sign up again below any blog post and we'll send a new link.",
  },
  error: {
    title: "Something went wrong",
    body: "We couldn't confirm your subscription just now. Please click the link in the email again in a few minutes.",
  },
} as const;

export default async function NewsletterConfirmedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const state = STATES[(status && status in STATES ? status : "ok") as keyof typeof STATES];
  return <NewsletterStatusPage title={state.title} body={state.body} links={[{ href: "/blog", label: "Read the blog", primary: true }]} />;
}
