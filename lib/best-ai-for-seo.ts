// Data for /best-ai-for-seo. Every third-party fact was read on that company's own pricing
// or product page on CHECKED. If a fact can't be re-confirmed there, delete it rather than
// guess. ChatGPT's plan prices are left out because chatgpt.com/pricing and
// openai.com/chatgpt/pricing returned 403 to our fetcher on CHECKED.
// Koala and SEOWriting.ai prices are shared with lib/writesonic-alternatives.ts (same day).
// Draftly's side must match lib/pricing.ts and the app.

import { PAID_PLANS } from "./pricing";
import { SOURCES as ALT_SOURCES, type Source } from "./writesonic-alternatives";

export type { Source };

export const CHECKED = { iso: "2026-10-16", label: "October 16, 2026", month: "October 2026" };

export const SOURCES = {
  ahrefsPricing: { label: "Ahrefs pricing", href: "https://ahrefs.com/pricing" },
  ahrefsFree: { label: "Ahrefs Webmaster Tools", href: "https://ahrefs.com/webmaster-tools" },
  semrushPricing: { label: "Semrush pricing", href: "https://www.semrush.com/prices/" },
  surferPricing: { label: "Surfer pricing", href: "https://surferseo.com/pricing/" },
  clearscopePricing: { label: "Clearscope pricing", href: "https://www.clearscope.io/pricing" },
  claudePricing: { label: "Claude pricing", href: "https://claude.com/pricing" },
  searchConsole: { label: "Search Console", href: "https://search.google.com/search-console/about" },
  searchConsoleHelp: { label: "Search Console Help", href: "https://support.google.com/webmasters/answer/9128668" },
  googleAiContent: { label: "Google Search Central", href: "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content" },
  koala: ALT_SOURCES.koala,
  seowriting: ALT_SOURCES.seowriting,
} satisfies Record<string, Source>;

const [SOLO, GROWTH] = PAID_PLANS;

export type Pick = {
  /** Anchor id of the section that covers this job. */
  id: string;
  job: string;
  pick: string;
  price: string;
  free: string;
};

/** The at-a-glance table: one row per SEO job, linking to its section. */
export const PICKS: Pick[] = [
  {
    id: "keyword-research",
    job: "Keyword research and competitors",
    pick: "Ahrefs or Semrush",
    price: "Ahrefs Lite $129 a month. Semrush SEO $139 a month, or $117.33 billed yearly",
    free: "Ahrefs Free for your own site. Semrush has a free plan and a 7-day trial",
  },
  {
    id: "writing",
    job: "Writing and publishing blog posts",
    pick: "Draftly",
    price: `$${SOLO.price} a month for ${SOLO.posts.toLowerCase()}`,
    free: "First post free, no credit card",
  },
  {
    id: "optimizing",
    job: "Optimizing pages against the top results",
    pick: "Surfer or Clearscope",
    price: "Surfer Discovery $49 a month billed yearly. Clearscope Essentials $129 a month",
    free: "Clearscope has a 14-day trial",
  },
  {
    id: "ai-visibility",
    job: "Tracking mentions in ChatGPT and Gemini",
    pick: "Whichever research or optimization tool you already pay for",
    price: "Included in Semrush, Surfer Standard and Clearscope. 5 prompts on Ahrefs Lite",
    free: "Draftly's AI visibility checker tests crawler access, free",
  },
  {
    id: "technical",
    job: "Technical SEO checks",
    pick: "Google Search Console and Ahrefs Free",
    price: "Free",
    free: "Free for sites you verify",
  },
];

export const DRAFTLY = {
  solo: SOLO,
  growth: GROWTH,
  /** Keyword lookups a month through the connector on Solopreneur (lib/pricing.ts). */
  keywordLookups: 40,
};
