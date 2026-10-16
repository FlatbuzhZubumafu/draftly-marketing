// Data for /writesonic-alternatives. Every competitor fact was read on that company's own
// pricing page on CHECKED. If a fact can't be re-confirmed there, delete it rather than
// guess. Byword was left out because its pricing page didn't load past the title.
// Jasper's WordPress note comes from lib/jasper-vs-draftly.ts (checked 2026-10-12).
// Draftly's side must match lib/pricing.ts and the app.

import { JASPER_PRO, JASPER_SOURCES } from "./jasper-vs-draftly";
import { PAID_PLANS } from "./pricing";

export const CHECKED = { iso: "2026-10-16", label: "October 16, 2026", month: "October 2026" };

export type Source = { label: string; href: string };

export const SOURCES = {
  writesonicPricing: { label: "Writesonic pricing", href: "https://writesonic.com/pricing" },
  writesonicHome: { label: "writesonic.com", href: "https://writesonic.com/" },
  koala: { label: "Koala pricing", href: "https://koala.sh/pricing" },
  seowriting: { label: "SEOWriting.ai pricing", href: "https://seowriting.ai/pricing" },
  jasper: JASPER_SOURCES.pricing,
  jasperIntegrations: JASPER_SOURCES.integrations,
  copyai: { label: "Copy.ai pricing", href: "https://www.copy.ai/prices" },
} satisfies Record<string, Source>;

/** Writesonic's self-serve plans as listed on writesonic.com/pricing (prices billed yearly). */
export const WRITESONIC_PLANS = [
  { name: "Starter", yearlyMonthly: 79, yearly: 948, users: 1, articles: 15, voices: 1 },
  { name: "Basic", yearlyMonthly: 199, yearly: 2388, users: 2, articles: 25, voices: 5 },
  { name: "Growth", yearlyMonthly: 399, yearly: 4788, users: 3, articles: 50, voices: 10 },
] as const;

/** "Self-serve from $99/mo" on writesonic.com/pricing: the month-to-month starting price. */
export const WRITESONIC_MONTHLY_FROM = 99;

const [SOLO] = PAID_PLANS;
const soloPosts = Number(SOLO.posts.replace(/\D+/g, ""));
const WS = WRITESONIC_PLANS[0];

/** Starter's yearly price spread over its 180 AI articles a year. */
export const WRITESONIC_PER_ARTICLE = WS.yearly / (WS.articles * 12);
/** Solopreneur's monthly price over its estimated posts on the default model. */
export const DRAFTLY_PER_POST = SOLO.price / soloPosts;

export type Alternative = {
  name: string;
  /** Anchor id on the page. */
  id: string;
  bestFor: string;
  startingPrice: string;
  included: string;
  publishing: string;
  freeOption: string;
  /** One or two sentences opening the tool's section. */
  summary: string;
  pickIf: string;
  skipIf: string;
  sources: Source[];
  draftly?: boolean;
};

export const ALTERNATIVES: Alternative[] = [
  {
    name: "Draftly",
    id: "draftly",
    draftly: true,
    bestFor: "Small-business and team blogs written in your brand voice",
    startingPrice: `$${SOLO.price} a month`,
    included: `${SOLO.posts} on Solopreneur, ${SOLO.seats} team members`,
    publishing: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
    freeOption: "First post free, no credit card",
    summary: `Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()}, with ${SOLO.seats} team members. Posts publish in one click to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot, and your first post is free.`,
    pickIf: "You want regular SEO blog posts that sound like your business, published to your CMS, without per-seat pricing.",
    skipIf: "You need AI visibility tracking, posts in languages other than English, or you're outside the US. Draftly writes blog posts only.",
    sources: [],
  },
  {
    name: "Koala",
    id: "koala",
    bestFor: "High-volume SEO and affiliate articles",
    startingPrice: "$25 a month (Starter)",
    included: "45,000 words a month on Starter",
    publishing: "WordPress, Shopify, Webflow and Ghost, plus webhooks",
    freeOption: "5,000 words and 25 credits, no credit card",
    summary: "Koala prices by the word. Starter is $25 a month for 45,000 words. Every plan publishes to WordPress, Shopify, Webflow and Ghost, and new accounts get 5,000 words free.",
    pickIf: "You publish a lot of articles, especially affiliate content, and want bulk writing with live Amazon data.",
    skipIf: "You'd rather count posts than words. Koala's word counts assume GPT-6 Luna, and Claude Sonnet 5 and Opus 5.5 count words at 2x and 3x.",
    sources: [SOURCES.koala],
  },
  {
    name: "SEOWriting.ai",
    id: "seowriting-ai",
    bestFor: "The lowest price per article",
    startingPrice: "$19 a month, or $14 a month billed yearly",
    included: "Up to 50 articles a month on Starter",
    publishing: "WordPress and Shopify",
    freeOption: "3 free articles, no credit card",
    summary: "Starter is $19 a month, or $14 billed yearly, for up to 50 articles. Every plan, including the free one, publishes to WordPress and Shopify.",
    pickIf: "Price per article matters most and you publish to WordPress or Shopify.",
    skipIf: "You publish to Webflow, Ghost, Squarespace or HubSpot. Its pricing page lists only WordPress and Shopify.",
    sources: [SOURCES.seowriting],
  },
  {
    name: "Jasper",
    id: "jasper",
    bestFor: "Marketing teams writing ads, emails and social posts as well as blogs",
    startingPrice: `$${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly`,
    included: "1 seat and 2 brand voices on Pro",
    publishing: "Webflow app. WordPress isn't on its integrations page",
    freeOption: "7-day free trial of Pro",
    summary: `Jasper Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly, with 2 brand voices. Its integrations page lists a Webflow app and no WordPress publishing.`,
    pickIf: "Your team writes for many channels and needs brand voices, agents and admin controls in one place.",
    skipIf: "You mainly need blog posts on WordPress. Per-seat pricing also adds up fast for a team.",
    sources: [SOURCES.jasper, SOURCES.jasperIntegrations],
  },
  {
    name: "Copy.ai",
    id: "copy-ai",
    bestFor: "Sales and marketing teams automating go-to-market work",
    startingPrice: "$29 a month for Chat, or $24 billed yearly",
    included: "5 seats and unlimited words in Chat",
    publishing: "No CMS publishing listed on its pricing page",
    freeOption: "None listed on its pricing page",
    summary: "The Chat plan is $29 a month for 5 seats with unlimited words, using OpenAI, Anthropic and Gemini models. The workflow plans start at $1,000 a month, billed yearly, and no CMS publishing is listed.",
    pickIf: "You want AI chat with OpenAI, Anthropic and Gemini models for a team of five, or workflows for prospecting and CRM work on the bigger plans.",
    skipIf: "You want finished blog posts published for you. Its workflow plans start at $1,000 a month, billed yearly.",
    sources: [SOURCES.copyai],
  },
];
