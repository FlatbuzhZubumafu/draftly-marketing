// Data for /koala-ai-review, /arvow-review and /copy-ai-alternatives. Every competitor fact
// was read on that company's own site on CHECKED (pricing pages, homepages and Arvow's
// rebrand post). If a fact can't be re-confirmed there, delete it rather than guess.
// Arvow's pricing page shows a Monthly/Yearly toggle; the raw HTML maps $69 to monthly
// billing and $39 to yearly (x-show="!yearly" / x-show="yearly"), and the same for the
// other plans. Koala's page says annual billing saves 20% but lists monthly prices only.
// Copy.ai's page has a "Try for free" button with no stated terms, so no free plan is claimed.
// Jasper and Writesonic facts come from their own data files. Draftly's side must match
// lib/pricing.ts and the app.

import { JASPER_PRO, JASPER_SOURCES } from "./jasper-vs-draftly";
import { PAID_PLANS } from "./pricing";
import { SOURCES as WS_SOURCES, WRITESONIC_PLANS, type Source } from "./writesonic-alternatives";
import { SOURCES as SEO_SOURCES } from "./best-ai-for-seo";

export type { Source };

export const CHECKED = { iso: "2026-10-16", label: "October 16, 2026", month: "October 2026" };

export const SOURCES = {
  koalaPricing: WS_SOURCES.koala,
  koalaHome: { label: "koala.sh", href: "https://koala.sh/" },
  arvowPricing: { label: "Arvow pricing", href: "https://arvow.com/pricing" },
  arvowHome: { label: "arvow.com", href: "https://arvow.com/" },
  arvowRebrand: { label: "Arvow rebrand post", href: "https://arvow.com/blog/rebrand-journalist-ai-is-now-arvow" },
  copyaiPricing: WS_SOURCES.copyai,
  copyaiHome: { label: "copy.ai", href: "https://www.copy.ai/" },
  jasperPricing: JASPER_SOURCES.pricing,
  jasperIntegrations: JASPER_SOURCES.integrations,
  writesonicPricing: WS_SOURCES.writesonicPricing,
  claudePricing: SEO_SOURCES.claudePricing,
} satisfies Record<string, Source>;

export const [SOLO, GROWTH, AUTOPILOT] = PAID_PLANS;

// ---------------------------------------------------------------------------
// Koala (koala.sh/pricing). Monthly prices; words assume GPT-6 Luna.
// ---------------------------------------------------------------------------

export const KOALA_PLANS = [
  { name: "Starter", monthly: 25, words: 45_000, brands: 1 },
  { name: "Professional", monthly: 49, words: 100_000, brands: 1 },
  { name: "Boost", monthly: 99, words: 250_000, brands: 1 },
  { name: "Growth", monthly: 179, words: 500_000, brands: 3 },
  { name: "Elite", monthly: 350, words: 1_000_000, brands: 7 },
] as const;

/** Word multipliers from Koala's pricing page. GPT-6 Luna is the 1x baseline. */
export const KOALA_MULTIPLIERS = [
  { model: "GPT-6 Luna", x: 1 },
  { model: "GPT-6.1 Sol and Claude Sonnet 5", x: 2 },
  { model: "Claude Opus 5.5", x: 3 },
] as const;

export const KOALA_FREE = "5,000 words and 25 credits, no credit card";
export const KOALA_PUBLISHING = "WordPress, Shopify, Webflow and Ghost, plus webhooks";

/** Our arithmetic, labeled as such on the page: articles of this length per month on Starter. */
export const ARTICLE_WORDS = 1500;
export const koalaArticles = (words: number, multiplier: number) => Math.floor(words / multiplier / ARTICLE_WORDS);

// ---------------------------------------------------------------------------
// Arvow (arvow.com/pricing). Formerly Journalist AI.
// ---------------------------------------------------------------------------

export const ARVOW_PLANS = [
  { name: "Solo", monthly: 69, yearlyMonthly: 39, credits: 1000, websites: "1 website" },
  { name: "Business", monthly: 169, yearlyMonthly: 69, credits: 3000, websites: "5 websites" },
  { name: "Ultimate", monthly: 449, yearlyMonthly: 249, credits: 9000, websites: "Unlimited websites" },
] as const;

/** "An article costs 15 credits" (Arvow pricing FAQ). */
export const ARVOW_CREDITS_PER_ARTICLE = 15;
export const arvowArticles = (credits: number) => Math.floor(credits / ARVOW_CREDITS_PER_ARTICLE);

// ---------------------------------------------------------------------------
// Copy.ai (copy.ai/prices).
// ---------------------------------------------------------------------------

export const COPYAI_PLANS = [
  { name: "Chat", monthly: 29, yearlyMonthly: 24, seats: 5, extra: "Unlimited words in Chat with OpenAI, Anthropic and Gemini models" },
  { name: "Growth", monthly: 1000, yearlyMonthly: null, seats: 75, extra: "20,000 workflow credits a month, billed $12,000 a year" },
  { name: "Expansion", monthly: 2000, yearlyMonthly: null, seats: 150, extra: "45,000 workflow credits a month, billed $24,000 a year" },
  { name: "Scale", monthly: 3000, yearlyMonthly: null, seats: 200, extra: "75,000 workflow credits a month, billed $36,000 a year" },
] as const;

export type Alternative = {
  name: string;
  id: string;
  bestFor: string;
  startingPrice: string;
  publishing: string;
  summary: string;
  pickIf: string;
  skipIf: string;
  sources: Source[];
  draftly?: boolean;
};

const [WS_STARTER] = WRITESONIC_PLANS;
const [KOALA_STARTER] = KOALA_PLANS;

export const COPYAI_ALTERNATIVES: Alternative[] = [
  {
    name: "Draftly",
    id: "draftly",
    draftly: true,
    bestFor: "SEO blog posts in your brand voice, published to your CMS",
    startingPrice: `$${SOLO.price} a month for ${SOLO.posts.toLowerCase()}`,
    publishing: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
    summary: `Draftly writes blog posts and nothing else. Paste your URL, it sets your brand voice from your site, and posts publish in one click to your CMS. Solopreneur is $${SOLO.price} a month with ${SOLO.seats} team members, Growth is $${GROWTH.price} with ${GROWTH.seats}, and your first post is free.`,
    pickIf: "Blog posts were the main thing you used Copy.ai for and you want them published, not pasted.",
    skipIf: "You need sales emails, social posts or translation, or you write in languages other than English. Draftly serves US businesses only.",
    sources: [],
  },
  {
    name: "Jasper",
    id: "jasper",
    bestFor: "Marketing teams writing ads, emails, social posts and blogs",
    startingPrice: `$${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly`,
    publishing: "A Webflow app. WordPress isn't on its integrations page",
    summary: `Jasper is the closest match to the Copy.ai people remember: one place to write marketing content for every channel. Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly, with 2 brand voices.`,
    pickIf: "Your team writes across many channels and wants brand voices and templates in one tool.",
    skipIf: "You're pricing a team. Per-seat pricing adds up, and Copy.ai Chat covers 5 seats for less.",
    sources: [SOURCES.jasperPricing, SOURCES.jasperIntegrations],
  },
  {
    name: "Writesonic",
    id: "writesonic",
    bestFor: "Tracking how ChatGPT and Gemini mention your brand, with articles included",
    startingPrice: `$${WS_STARTER.yearlyMonthly} a month billed yearly`,
    publishing: "WordPress",
    summary: `Writesonic now leads with AI search visibility. Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly and includes ${WS_STARTER.articles} AI articles a month, plus tracking in ChatGPT, Gemini and Google AI Overviews.`,
    pickIf: "You want visibility tracking and site audits along with articles.",
    skipIf: "You only need the writing. You'd be paying for tracking you won't use.",
    sources: [SOURCES.writesonicPricing],
  },
  {
    name: "Koala",
    id: "koala",
    bestFor: "High-volume SEO and affiliate articles priced by the word",
    startingPrice: `$${KOALA_STARTER.monthly} a month (Starter)`,
    publishing: KOALA_PUBLISHING,
    summary: `Koala sells words. Starter is $${KOALA_STARTER.monthly} a month for ${KOALA_STARTER.words.toLocaleString("en-US")} words on GPT-6 Luna, with bulk writing, live Amazon data and publishing to WordPress, Shopify, Webflow and Ghost.`,
    pickIf: "You publish a lot of articles, especially affiliate content, and want them in bulk.",
    skipIf: "You'd rather count posts than words. Better models use 2x or 3x the words.",
    sources: [SOURCES.koalaPricing],
  },
  {
    name: "Claude",
    id: "claude",
    bestFor: "One person who wants a strong writing model in a chat app",
    startingPrice: "$20 a month (Pro), or $17 a month billed yearly",
    publishing: "None. You copy drafts into your CMS",
    summary: "If you mostly used Copy.ai as a chat window, a chat app does the same job. Claude Pro is $20 a month, or $17 billed yearly. Claude Opus 5.5 scored 93.8 on blog posts in Draftly's writing benchmark, third of 14 models.",
    pickIf: "You write one draft at a time and are happy to edit and publish by hand.",
    skipIf: "You're a team of five. Copy.ai Chat at $29 a month for 5 seats is cheaper than five chat subscriptions.",
    sources: [SOURCES.claudePricing],
  },
];
