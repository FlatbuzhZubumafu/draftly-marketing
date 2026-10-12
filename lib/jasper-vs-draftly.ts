// Data for /jasper-vs-draftly. Every Jasper fact here was read on Jasper's own
// public pages on CHECKED (jasper.ai/pricing, /free-trial, /integrations,
// /solutions/seo-aeo-geo, /agents, /brand-voice and the help-center MCP article).
// If a Jasper fact can't be re-confirmed on Jasper's site, delete it rather than
// guess. Draftly's side must match lib/pricing.ts and the app.

import { PAID_PLANS } from "./pricing";

const [SOLO, GROWTH] = PAID_PLANS;

export const CHECKED = { iso: "2026-10-12", label: "October 12, 2026", month: "October 2026" };

export type Source = { label: string; href: string };

export const JASPER_SOURCES = {
  pricing: { label: "Jasper pricing", href: "https://www.jasper.ai/pricing" },
  trial: { label: "Jasper free trial", href: "https://www.jasper.ai/free-trial" },
  integrations: { label: "Jasper integrations", href: "https://www.jasper.ai/integrations" },
  seo: { label: "Jasper for SEO, AEO and GEO", href: "https://www.jasper.ai/solutions/seo-aeo-geo" },
  mcp: { label: "Jasper help: MCP server", href: "https://help.jasper.ai/hc/en-us/articles/39658912106779-Jasper-Model-Context-Provider-MCP-Server" },
  home: { label: "jasper.ai", href: "https://www.jasper.ai/" },
} satisfies Record<string, Source>;

/** The page's share image and homepage card source (public/images/og). */
export const OG_IMAGE = {
  url: "/images/og/jasper-vs-draftly.png",
  width: 1200,
  height: 630,
  alt: "Jasper vs Draftly bake-off scorecard: average Human voice score 80 for Jasper and 99 for Draftly, Reads as AI 30 and 22, and links to the business's own pages 0 and 10, across four real businesses",
};

/** Jasper's list prices as published on jasper.ai/pricing on CHECKED. */
export const JASPER_PRO = { monthly: 69, yearly: 59 } as const;

// ---------------------------------------------------------------------------
// The bake-off. Real results from ~/draftly-work/bakeoff/RESULTS-2026-10-12.md:
// four real businesses (permission given for testing; kept anonymous here), the
// same topic for both tools, every post scored with Draftly's own checker.
// Human voice: 0 to 100, higher is better. Reads as AI: 0 to 100, lower is better.
// Links: links to the business's own pages.
// ---------------------------------------------------------------------------

export const BAKEOFF_METHOD = {
  date: "October 12, 2026",
  jasper: "Jasper's Blog Post agent, Medium length, AI visibility on, given the business name, website and a one-line description",
  draftly: "Draftly given only the website URL, writing with its default model, Claude Sonnet 5.5",
};

export type Score = { jasper: number; draftly: number };
export type BakeoffRun = {
  business: string;
  topic: string;
  humanVoice: Score;
  readsAsAi: Score;
  ownLinks: Score;
  note?: string;
};

export const BAKEOFF: BakeoffRun[] = [
  {
    business: "A dental practice",
    topic: "How long do dental implants last?",
    humanVoice: { jasper: 71, draftly: 100 },
    readsAsAi: { jasper: 39, draftly: 29 },
    ownLinks: { jasper: 0, draftly: 3 },
  },
  {
    business: "A real estate lead provider",
    topic: "What to know before you pay for FSBO leads",
    humanVoice: { jasper: 83, draftly: 100 },
    readsAsAi: { jasper: 33, draftly: 15 },
    ownLinks: { jasper: 0, draftly: 3 },
  },
  {
    business: "A vehicle protection plan company",
    topic: "When to use rental car reimbursement",
    humanVoice: { jasper: 95, draftly: 95 },
    readsAsAi: { jasper: 25, draftly: 24 },
    ownLinks: { jasper: 0, draftly: 2 },
    note: "A tie on the writing. Draftly linked the company's real rental reimbursement and coverage pages.",
  },
  {
    business: "A marketing consultant",
    topic: "What to know before paying for Google and Meta ads",
    humanVoice: { jasper: 71, draftly: 100 },
    readsAsAi: { jasper: 21, draftly: 21 },
    ownLinks: { jasper: 0, draftly: 2 },
    note: "A tie on Reads as AI.",
  },
];

const avg = (xs: number[]) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/** Averages over the four businesses (links are a total). 80 vs 99, 30 vs 22, 0 vs 10. */
export const BAKEOFF_TOTALS = {
  humanVoice: { jasper: avg(BAKEOFF.map((r) => r.humanVoice.jasper)), draftly: avg(BAKEOFF.map((r) => r.humanVoice.draftly)) },
  readsAsAi: { jasper: avg(BAKEOFF.map((r) => r.readsAsAi.jasper)), draftly: avg(BAKEOFF.map((r) => r.readsAsAi.draftly)) },
  ownLinks: { jasper: sum(BAKEOFF.map((r) => r.ownLinks.jasper)), draftly: sum(BAKEOFF.map((r) => r.ownLinks.draftly)) },
};

/**
 * Side-by-side excerpts, quoted from the bake-off posts with the business names
 * swapped for brackets. `hl` is the phrase to highlight inside `text`; `link`
 * is a phrase that was a link to the business's own page in the original post.
 */
export type Excerpt = { text: string; hl?: string; link?: string };
export type Callout = { business: string; title: string; jasper: Excerpt; draftly: Excerpt; takeaway: string };

export const CALLOUTS: Callout[] = [
  {
    business: "A dental practice",
    title: "Experience the practice never gave it",
    jasper: {
      text: "At [the practice], we've placed implants for patients across [the city]...",
      hl: "we've placed implants for patients across [the city]",
    },
    draftly: {
      text: "Read about dental implants at [the practice], then schedule a consultation and bring this list of questions with you.",
      link: "dental implants at [the practice]",
    },
    takeaway: "Jasper invented the practice's experience. Draftly linked its real implant page.",
  },
  {
    business: "A real estate lead provider",
    title: "Product claims nobody asked for",
    jasper: {
      text: "If you're ready to see how fresh, verified FSBO leads paired with a built-in dialer can fit into your prospecting strategy, explore what [the provider] offers...",
      hl: "fresh, verified FSBO leads",
    },
    draftly: {
      text: "Rehearse your answers before the first dial. This FSBO script walkthrough covers how to turn the conversation toward a listing appointment.",
      link: "FSBO script walkthrough",
    },
    takeaway: "Jasper wrote sales claims the owner would have to check. Draftly linked the company's own blog.",
  },
  {
    business: "A vehicle protection plan company",
    title: "Linking the pages that matter",
    jasper: {
      text: "...explore the coverage options available through [the company] to find a plan that matches how you drive.",
    },
    draftly: {
      text: "[The company] describes its coverage on its rental car reimbursement page, and your own contract documents set the exact terms that apply to you.",
      link: "rental car reimbursement page",
    },
    takeaway: "Same writing score. Only Draftly's post linked the company's pages.",
  },
];

/** The checkmark table. `true` = has it, `false` = doesn't, a string = the detail. */
export type Cell = boolean | string;
export type TableRow = { label: string; draftly: Cell; jasper: Cell; draftlyNote?: string; jasperNote?: string };

export const TABLE: TableRow[] = [
  { label: "Built for", draftly: "Small-business blogs", jasper: "Marketing teams" },
  { label: "Starting price", draftly: "$29 a month", jasper: `$${JASPER_PRO.monthly} per seat a month` },
  { label: "One price, not per seat", draftly: true, draftlyNote: `${GROWTH.seats} people on Growth for $${GROWTH.price} a month`, jasper: false, jasperNote: `${GROWTH.seats} seats on Pro: $${JASPER_PRO.monthly * (GROWTH.seats ?? 1)} a month` },
  { label: "Team members included", draftly: `${SOLO.seats} on Solopreneur, ${GROWTH.seats} on Growth, unlimited on Autopilot`, jasper: `Billed per seat, $${JASPER_PRO.monthly} a month each` },
  { label: "Free first post, no credit card", draftly: true, jasper: false, jasperNote: "7-day trial of Pro" },
  { label: "Brand voice on every plan", draftly: true, draftlyNote: "Built from your website", jasper: "2 voices on Pro, unlimited on Business" },
  { label: "Every draft checked for AI-sounding writing", draftly: true, jasper: false, jasperNote: "Style Guide on Business" },
  { label: "Linked the business's own pages in our test", draftly: true, draftlyNote: "4 of 4 posts", jasper: false, jasperNote: "0 of 4 posts" },
  { label: "One-click publish to WordPress", draftly: true, jasper: false, jasperNote: "Not on its integrations page" },
  { label: "Publish to Shopify, Webflow, Ghost, HubSpot, Squarespace", draftly: true, jasper: "Webflow app" },
  { label: "Scheduled auto-publishing", draftly: true, draftlyNote: "Autopilot plan", jasper: false, jasperNote: "Not listed" },
  { label: "Claude and ChatGPT connector (MCP)", draftly: true, draftlyNote: "Every plan", jasper: true, jasperNote: "Business plan only" },
  { label: "Ads, emails and social posts", draftly: false, draftlyNote: "Blog posts only", jasper: true, jasperNote: "100+ agents" },
  { label: "Languages other than English", draftly: false, draftlyNote: "US businesses only", jasper: true, jasperNote: "30+ languages" },
  { label: "Single sign-on (SSO)", draftly: false, jasper: true, jasperNote: "Business plan" },
];
