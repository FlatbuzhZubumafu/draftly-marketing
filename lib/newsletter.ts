// Newsletter signup endpoint: the newsletter-subscribe Supabase edge function
// (app repo). It needs no key; CORS allows www.draftly.blog and this project's
// Vercel previews. NEXT_PUBLIC_NEWSLETTER_ENDPOINT can point a preview elsewhere.
export const NEWSLETTER_ENDPOINT =
  process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || "https://oejdjmpgxqtnakoamsjh.supabase.co/functions/v1/newsletter-subscribe";

// The server stores the consent wording for this version (CONSENT_TEXTS in
// supabase/functions/_shared/newsletter.ts). Bump both if the form text changes.
export const NEWSLETTER_CONSENT_VERSION = "web_v1";

export type NewsletterLocation = "blog_post" | "footer" | "blog_index";
