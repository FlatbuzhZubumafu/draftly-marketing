// Data for the five decision pages: /distribb-alternatives, /seobot-alternatives,
// /best-ai-blog-writer, /ai-blog-writer-for-small-business and /koala-ai-alternatives.
//
// Verified facts are reused from the data files that read them on each company's own
// pricing page (lib/writesonic-alternatives.ts, lib/competitor-reviews.ts,
// lib/jasper-vs-draftly.ts). Facts marked `verified: false` have NOT been read on the
// vendor's own site yet: Distribb and ChatSEO come from a third-party write-up dated
// November 10, 2026, and SEObot from its own homepage snippet in Google's results.
// A page that shows any unverified fact is noindex, left out of the sitemap and returns
// 404 in production (see `isPublishable`). To publish one, read each fact on the vendor's
// pricing page, correct it here, set `verified: true` and set `checked` to that day.
// If a fact can't be confirmed there, delete it rather than guess.
// Draftly's side must match lib/pricing.ts and the app.

import { JASPER_PRO } from "./jasper-vs-draftly";
import { PAID_PLANS, SITE_ADDON } from "./pricing";
import {
  ARVOW_CREDITS_PER_ARTICLE,
  ARVOW_PLANS,
  ARTICLE_WORDS,
  COPYAI_PLANS,
  KOALA_FREE,
  KOALA_PLANS,
  KOALA_PUBLISHING,
  SOURCES as REVIEW_SOURCES,
  arvowArticles,
} from "./competitor-reviews";
import { SOURCES as WS_SOURCES, WRITESONIC_PLANS, type Source } from "./writesonic-alternatives";

export type { Source };

export type CheckedDate = { iso: string; label: string; month: string };

/** The day the October data files were read on each vendor's pricing page. */
const OCT_16: CheckedDate = { iso: "2026-10-16", label: "October 16, 2026", month: "October 2026" };
const OCT_12: CheckedDate = { iso: "2026-10-12", label: "October 12, 2026", month: "October 2026" };

/** When these five pages were written. */
export const WRITTEN: CheckedDate = { iso: "2026-11-11", label: "November 11, 2026", month: "November 2026" };

export const [SOLO, GROWTH, AUTOPILOT] = PAID_PLANS;
const soloPosts = Number(SOLO.posts.replace(/\D+/g, ""));
const growthPosts = Number(GROWTH.posts.replace(/\D+/g, ""));

const [KOALA_STARTER] = KOALA_PLANS;
const [ARVOW_SOLO] = ARVOW_PLANS;
const [COPYAI_CHAT] = COPYAI_PLANS;
const [WS_STARTER] = WRITESONIC_PLANS;

/** A tool's facts. Copy that changes from page to page lives in the page entries below. */
export type Tool = {
  id: string;
  name: string;
  startingPrice: string;
  publishing: string;
  freeOption: string;
  /** Monthly price over posts or articles a month on the entry plan, for the cost chart. null = not comparable. */
  perPost: number | null;
  /** How perPost was worked out, shown under the chart. */
  perPostBasis?: string;
  sources: Source[];
  checked: CheckedDate;
  verified: boolean;
  draftly?: boolean;
};

export const TOOLS = {
  draftly: {
    id: "draftly",
    name: "Draftly",
    draftly: true,
    startingPrice: `$${SOLO.price} a month`,
    publishing: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
    freeOption: "First post free, no credit card",
    perPost: SOLO.price / soloPosts,
    perPostBasis: `Solopreneur, $${SOLO.price} for ${SOLO.posts.toLowerCase()}`,
    sources: [],
    checked: WRITTEN,
    verified: true,
  },
  koala: {
    id: "koala",
    name: "Koala",
    startingPrice: `$${KOALA_STARTER.monthly} a month (Starter)`,
    publishing: KOALA_PUBLISHING,
    freeOption: KOALA_FREE,
    perPost: KOALA_STARTER.monthly / Math.floor(KOALA_STARTER.words / ARTICLE_WORDS),
    perPostBasis: `Starter, ${KOALA_STARTER.words.toLocaleString("en-US")} words split into ${ARTICLE_WORDS.toLocaleString("en-US")}-word articles on GPT-6 Luna (our arithmetic)`,
    sources: [REVIEW_SOURCES.koalaPricing],
    checked: OCT_16,
    verified: true,
  },
  seowriting: {
    id: "seowriting-ai",
    name: "SEOWriting.ai",
    startingPrice: "$19 a month, or $14 a month billed yearly",
    publishing: "WordPress and Shopify",
    freeOption: "3 free articles, no credit card",
    perPost: 19 / 50,
    perPostBasis: "Starter, $19 a month for up to 50 articles",
    sources: [WS_SOURCES.seowriting],
    checked: OCT_16,
    verified: true,
  },
  arvow: {
    id: "arvow",
    name: "Arvow",
    startingPrice: `$${ARVOW_SOLO.monthly} a month, or $${ARVOW_SOLO.yearlyMonthly} a month billed yearly`,
    publishing: "9 platforms, including WordPress, Shopify, Webflow, Ghost, Squarespace, Framer and Blogger",
    freeOption: "No free trial listed",
    perPost: ARVOW_SOLO.monthly / arvowArticles(ARVOW_SOLO.credits),
    perPostBasis: `Solo, $${ARVOW_SOLO.monthly} a month for ${ARVOW_SOLO.credits.toLocaleString("en-US")} credits at ${ARVOW_CREDITS_PER_ARTICLE} credits an article`,
    sources: [REVIEW_SOURCES.arvowPricing],
    checked: OCT_16,
    verified: true,
  },
  jasper: {
    id: "jasper",
    name: "Jasper",
    startingPrice: `$${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly`,
    publishing: "A Webflow app. WordPress isn't on its integrations page",
    freeOption: "7-day free trial of Pro",
    perPost: null,
    sources: [REVIEW_SOURCES.jasperPricing, REVIEW_SOURCES.jasperIntegrations],
    checked: OCT_12,
    verified: true,
  },
  writesonic: {
    id: "writesonic",
    name: "Writesonic",
    startingPrice: `$${WS_STARTER.yearlyMonthly} a month billed yearly`,
    publishing: "WordPress",
    freeOption: "Free trial, no credit card",
    perPost: WS_STARTER.yearly / 12 / WS_STARTER.articles,
    perPostBasis: `Starter, $${WS_STARTER.yearly.toLocaleString("en-US")} a year for ${WS_STARTER.articles} articles a month`,
    sources: [REVIEW_SOURCES.writesonicPricing],
    checked: OCT_16,
    verified: true,
  },
  copyai: {
    id: "copy-ai",
    name: "Copy.ai",
    startingPrice: `$${COPYAI_CHAT.monthly} a month for Chat, or $${COPYAI_CHAT.yearlyMonthly} billed yearly`,
    publishing: "No CMS publishing listed on its pricing page",
    freeOption: "None listed on its pricing page",
    perPost: null,
    sources: [REVIEW_SOURCES.copyaiPricing],
    checked: OCT_16,
    verified: true,
  },
  // ---- Not yet read on the vendor's own site. See the note at the top. ----
  distribb: {
    id: "distribb",
    name: "Distribb",
    startingPrice: "$97 a month (Pro)",
    publishing: "WordPress, Shopify, Webflow, Wix, Ghost, Notion and Framer",
    freeOption: "3-day free trial",
    perPost: 97 / 30,
    perPostBasis: "Pro, $97 a month for 30 articles",
    sources: [{ label: "Distribb pricing", href: "https://distribb.com/pricing" }],
    checked: WRITTEN,
    verified: false,
  },
  chatseo: {
    id: "chatseo",
    name: "ChatSEO",
    startingPrice: "€29 a month, €49 with the MCP server",
    publishing: "WordPress, Shopify and Webflow",
    freeOption: "7-day free trial",
    perPost: null,
    sources: [],
    checked: WRITTEN,
    verified: false,
  },
  seobot: {
    id: "seobot",
    name: "SEObot",
    startingPrice: "$49 a month",
    publishing: "Not checked",
    freeOption: "Not checked",
    perPost: null,
    sources: [{ label: "seobotai.com", href: "https://seobotai.com/" }],
    checked: WRITTEN,
    verified: false,
  },
} satisfies Record<string, Tool>;

export type ToolId = keyof typeof TOOLS;

/** One tool as it appears on one page. */
export type Entry = {
  tool: ToolId;
  /** Lowercase start: it follows "1. Name: " in the section heading. */
  bestFor: string;
  summary: string;
  pickIf: string;
  skipIf: string;
};

export type Faq = { q: string; a: string };

export type DecisionPage = {
  path: string;
  /** The query this page targets, and what we know about it. */
  query: string;
  queryNote: string;
  title: string;
  description: string;
  h1: string;
  h1Accent: string;
  /** The answer, first thing on the page. Names Draftly. */
  answer: string;
  /** The tool people are leaving, if any. Its facts must be verified too. */
  target?: ToolId;
  /** Shown under the target's facts. Counts as the target's facts for verification. */
  targetNote?: string;
  entries: Entry[];
  faqs: Faq[];
  keepReading: { guides: string[]; topic: string };
  cta: { heading: string; body: string };
};

const draftlyPublishing = TOOLS.draftly.publishing;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const CHECKED_NOTE = "Prices are from each company's own pricing page on the date shown next to them";

// ---------------------------------------------------------------------------
// The five pages
// ---------------------------------------------------------------------------

export const DISTRIBB_ALTERNATIVES: DecisionPage = {
  path: "/distribb-alternatives",
  query: "distribb alternatives",
  queryNote: "No search volume data (Draftly keyword tool, November 11, 2026). Top 8 results had no independent alternatives page.",
  title: "Distribb Alternatives in 2026: 6 Options Without the Backlink Exchange",
  description:
    "Distribb bundles daily AI articles, publishing and a backlink exchange from $97 a month. Compare ChatSEO, Koala, SEOWriting.ai, Arvow, Draftly and Writesonic on price and what you get.",
  h1: "Distribb alternatives",
  h1Accent: "that skip the link network",
  answer: `Distribb sells AI articles, CMS publishing, AI citation tracking and a backlink exchange in one plan from $97 a month. If you want the SEO data and an AI agent, ChatSEO is the closest match for less. For cheap articles, SEOWriting.ai and Koala start under $25. Draftly writes posts in your brand voice from $${SOLO.price} a month. Writesonic covers the AI tracking.`,
  target: "distribb",
  targetNote:
    "Pro writes 30 articles a month, tracks when ChatGPT, Gemini, Perplexity and Google's AI answers cite you, and connects to your AI assistant through an MCP server. It also has a backlink exchange you turn on with one toggle, placing 3 to 5 links a month between member sites. Google's spam policies list excessive link exchanges as link spam, which is the main reason to look elsewhere on a new domain.",
  entries: [
    {
      tool: "chatseo",
      bestFor: "an SEO agent with live keyword data and Search Console",
      summary:
        "ChatSEO reads your Search Console and pulls keyword volumes, backlinks and competitor data from DataForSEO. It crawls your site, gives you a fix list and publishes to WordPress, Shopify and Webflow once you connect them.",
      pickIf: "You liked Distribb's research side and want an agent you can talk to, with an MCP server for Claude or ChatGPT on the Pro plan.",
      skipIf: "You want articles written and published every day without asking. ChatSEO works when you prompt it, and heavy chat use spends credits.",
    },
    {
      tool: "seowriting",
      bestFor: "the lowest price per article",
      summary: "Starter is $19 a month, or $14 billed yearly, for up to 50 articles. Every plan, including the free one, publishes to WordPress and Shopify.",
      pickIf: "You mainly used Distribb for article volume and you publish to WordPress or Shopify.",
      skipIf: "You publish to Webflow, Ghost or Framer. Its pricing page lists only WordPress and Shopify.",
    },
    {
      tool: "koala",
      bestFor: "high-volume articles priced by the word",
      summary: `Starter is $${KOALA_STARTER.monthly} a month for ${KOALA_STARTER.words.toLocaleString("en-US")} words. Every plan publishes to WordPress, Shopify, Webflow and Ghost, and new accounts get 5,000 words free.`,
      pickIf: "You publish a lot of articles, affiliate content especially, and want bulk writing.",
      skipIf: "You'd rather count posts than words. Its better models use 2x or 3x the words.",
    },
    {
      tool: "draftly",
      bestFor: "fewer posts in your brand voice, checked before they go out",
      summary: `Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()}. Draftly sets your brand voice from your site, checks each post for AI-sounding writing, and publishes in one click to ${draftlyPublishing}. Every plan, Free included, connects to Claude or ChatGPT through its MCP server.`,
      pickIf: "You want blog posts that sound like your business, and you'd rather build links by pitching real sites than through an exchange.",
      skipIf: "You need backlinks, Reddit posting or AI citation tracking. Draftly writes and publishes blog posts only, in English, for US businesses.",
    },
    {
      tool: "arvow",
      bestFor: "an all-in-one platform with a backlink network of its own",
      summary: `Solo is $${ARVOW_SOLO.monthly} a month, or $${ARVOW_SOLO.yearlyMonthly} billed yearly, for about ${arvowArticles(ARVOW_SOLO.credits)} articles. It publishes to 9 platforms and, like Distribb, trades backlinks between member sites.`,
      pickIf: "You want Distribb's bundle at a lower price and you're comfortable with a link exchange.",
      skipIf: "You left Distribb because of the link exchange. Arvow runs one too.",
    },
    {
      tool: "writesonic",
      bestFor: "tracking how ChatGPT and Gemini mention your brand",
      summary: `Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly. It tracks your brand in ChatGPT, Gemini and Google AI Overviews and includes ${WS_STARTER.articles} AI articles a month.`,
      pickIf: "The AI citation tracking was the part of Distribb you used most.",
      skipIf: "You only need articles. You'd be paying for tracking you won't use.",
    },
  ],
  faqs: [
    {
      q: "What is the best Distribb alternative?",
      a: `It depends on which part of Distribb you used. ChatSEO for SEO data and an agent, SEOWriting.ai or Koala for cheap article volume, Writesonic for AI citation tracking, and Draftly for posts in your brand voice from $${SOLO.price} a month.`,
    },
    {
      q: "Is Distribb's backlink exchange safe?",
      a: "Google's spam policies name excessive link exchanges as link spam. An exchange between member sites carries that risk however it's packaged. A new domain has the most to lose, so leave it off there.",
    },
    {
      q: "Is there a cheaper alternative to Distribb?",
      a: `Yes. SEOWriting.ai starts at $19 a month, Koala at $${KOALA_STARTER.monthly}, Draftly at $${SOLO.price} and ChatSEO at €29. None of them includes a backlink exchange.`,
    },
    {
      q: "Does Draftly build backlinks like Distribb?",
      a: "No. Draftly writes and publishes blog posts. For links, a story about a tool you use or a pitch to a list that names your competitors works better than an exchange.",
    },
  ],
  keepReading: { guides: ["/arvow-review", "/best-ai-for-seo"], topic: "distribb alternative backlinks ai seo tool compare pricing" },
  cta: {
    heading: "Try a Distribb alternative for free",
    body: "Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card.",
  },
};

export const SEOBOT_ALTERNATIVES: DecisionPage = {
  path: "/seobot-alternatives",
  query: "seobot alternatives",
  queryNote: "No search volume data (Draftly keyword tool, November 11, 2026). 6 of the top 9 results were vendor head-to-head pages.",
  title: "SEObot Alternatives in 2026: 5 Tools Compared on Price and Control",
  description:
    "SEObot runs your blog on autopilot from $49 a month. Compare Koala, SEOWriting.ai, Arvow, Draftly and Writesonic if you want lower prices or more say over each post.",
  h1: "SEObot alternatives",
  h1Accent: "with more say over each post",
  answer: `SEObot writes and publishes on autopilot from $49 a month. SEOWriting.ai is the cheapest switch at $19 a month. Arvow is the closest full-autopilot match. Draftly from $${SOLO.price} a month suits you if you want to read and approve each post in your brand voice before it goes live.`,
  target: "seobot",
  targetNote:
    "SEObot's homepage says it takes 100% of SEO work out of your way, with subscriptions from $49 a month. It researches keywords, writes and publishes on its own. That suits a founder who wants no involvement, and it's the reason to switch if the posts stopped sounding like your business.",
  entries: [
    {
      tool: "arvow",
      bestFor: "the closest match to SEObot's autopilot",
      summary: `Solo is $${ARVOW_SOLO.monthly} a month, or $${ARVOW_SOLO.yearlyMonthly} billed yearly, for about ${arvowArticles(ARVOW_SOLO.credits)} articles. It runs an automated blog, publishes to 9 platforms and tracks brand mentions in AI search.`,
      pickIf: "You want a hands-off blog like SEObot's with more publishing options.",
      skipIf: "You want to avoid link exchanges. Arvow trades backlinks between member sites.",
    },
    {
      tool: "seowriting",
      bestFor: "the lowest price per article",
      summary: "Starter is $19 a month, or $14 billed yearly, for up to 50 articles, with WordPress and Shopify publishing on every plan.",
      pickIf: "Price per article matters most and your site runs on WordPress or Shopify.",
      skipIf: "You publish anywhere else. Its pricing page lists only WordPress and Shopify.",
    },
    {
      tool: "koala",
      bestFor: "bulk and affiliate articles priced by the word",
      summary: `Starter is $${KOALA_STARTER.monthly} a month for ${KOALA_STARTER.words.toLocaleString("en-US")} words, with publishing to WordPress, Shopify, Webflow and Ghost.`,
      pickIf: "You write affiliate content and want live Amazon data in bulk articles.",
      skipIf: "You want a set number of posts a month. Koala counts words, and better models use more of them.",
    },
    {
      tool: "draftly",
      bestFor: "posts you approve, in your brand voice",
      summary: `Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()}. You pick the topic from your industry's news, read the draft, and publish in one click to ${draftlyPublishing}. Autopilot, $${AUTOPILOT.price} a month, adds posting schedules for WordPress and Shopify.`,
      pickIf: "SEObot's posts didn't sound like your business and you want a say before anything goes live.",
      skipIf: "You want zero involvement, or you need posts in languages other than English. Draftly serves US businesses.",
    },
    {
      tool: "writesonic",
      bestFor: "AI visibility tracking with articles included",
      summary: `Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly for ${WS_STARTER.articles} AI articles a month, plus tracking in ChatGPT, Gemini and Google AI Overviews.`,
      pickIf: "You want to know whether AI answers mention you, not only whether Google ranks you.",
      skipIf: "You only need articles.",
    },
  ],
  faqs: [
    {
      q: "What is the best SEObot alternative?",
      a: `Arvow if you want the same autopilot, SEOWriting.ai if you want the lowest price, and Draftly if you want to approve each post in your brand voice from $${SOLO.price} a month.`,
    },
    {
      q: "Is there a cheaper alternative to SEObot?",
      a: `SEOWriting.ai starts at $19 a month and Koala at $${KOALA_STARTER.monthly}. Draftly starts at $${SOLO.price}, and your first post is free.`,
    },
    {
      q: "Is a fully automated blog a good idea?",
      a: "On a new domain, publish one to four pages a week and read each one. A blog that publishes daily with nobody reading it can fill your site with posts that don't match what you sell.",
    },
  ],
  keepReading: { guides: ["/arvow-review", "/koala-ai-review"], topic: "seobot alternative autopilot blog ai seo compare pricing" },
  cta: {
    heading: "Try an SEObot alternative for free",
    body: "Paste your URL and Draftly writes a full blog post in your brand's voice. Read it, change what you like, then publish. No credit card.",
  },
};

export const BEST_AI_BLOG_WRITER: DecisionPage = {
  path: "/best-ai-blog-writer",
  query: "best ai blog writer",
  queryNote: "70 searches a month in the US, difficulty 27 (Draftly keyword tool, November 11, 2026). All 8 top results were list posts.",
  title: "Best AI Blog Writer in 2026: 7 Tools Compared by Job and Price",
  description:
    "Seven AI blog writers compared on price, cost per post and where they publish: SEOWriting.ai, Koala, Arvow, Draftly, Jasper, Writesonic and Copy.ai.",
  h1: "The best AI blog writer",
  h1Accent: "for the job you have",
  answer: `For the lowest cost per post, SEOWriting.ai at $19 a month. For bulk affiliate articles, Koala. For a hands-off blog on 9 platforms, Arvow. For posts in your brand voice published to your CMS, Draftly from $${SOLO.price} a month. For a team writing more than blogs, Jasper.`,
  entries: [
    {
      tool: "seowriting",
      bestFor: "the lowest cost per post",
      summary: `Starter is $19 a month for up to 50 articles, about ${usd2(19 / 50)} each, and the cheapest per post on this list. Every plan publishes to WordPress and Shopify, and you get 3 articles free.`,
      pickIf: "Price per article matters most and you publish to WordPress or Shopify.",
      skipIf: "You publish to Webflow, Ghost, Squarespace or HubSpot.",
    },
    {
      tool: "koala",
      bestFor: "bulk SEO and affiliate articles",
      summary: `Koala prices by the word. Starter is $${KOALA_STARTER.monthly} a month for ${KOALA_STARTER.words.toLocaleString("en-US")} words, with live Amazon data for affiliate posts and publishing to WordPress, Shopify, Webflow and Ghost.`,
      pickIf: "You run affiliate or niche sites and publish a lot.",
      skipIf: "You want to count posts, not words. Claude Sonnet 5 and Opus 5.5 use 2x and 3x the words.",
    },
    {
      tool: "arvow",
      bestFor: "a hands-off blog on almost any platform",
      summary: `Solo is $${ARVOW_SOLO.monthly} a month for about ${arvowArticles(ARVOW_SOLO.credits)} articles, or $${ARVOW_SOLO.yearlyMonthly} billed yearly. It publishes to 9 platforms, including Framer and Blogger.`,
      pickIf: "Your site runs on a platform the others don't support, or you want an automated blog.",
      skipIf: "You want a free trial first. Its pricing page lists none.",
    },
    {
      tool: "draftly",
      bestFor: "posts in your brand voice, published to your CMS",
      summary: `Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()}, about ${usd2(TOOLS.draftly.perPost)} each. Paste your URL, Draftly sets your voice from your site and checks every draft for AI-sounding writing before you see it. Posts publish to ${draftlyPublishing}.`,
      pickIf: "You want posts that read like your business wrote them, and your first one free to judge that.",
      skipIf: "You write in languages other than English, you're outside the US, or you need ads and emails too.",
    },
    {
      tool: "jasper",
      bestFor: "marketing teams writing for every channel",
      summary: `Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly, with 2 brand voices. Blog posts are one of many things it writes.`,
      pickIf: "Your team writes ads, emails and social posts as well as blogs.",
      skipIf: "You mainly publish blog posts to WordPress. It isn't on Jasper's integrations page.",
    },
    {
      tool: "writesonic",
      bestFor: "AI search tracking with articles included",
      summary: `Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly for ${WS_STARTER.articles} articles a month, about ${usd2(TOOLS.writesonic.perPost ?? 0)} each, plus tracking in ChatGPT, Gemini and Google AI Overviews.`,
      pickIf: "You want visibility tracking and site audits with your articles.",
      skipIf: "You only need posts. Per article it's the most expensive here.",
    },
    {
      tool: "copyai",
      bestFor: "a cheap AI chat for a small team",
      summary: `Chat is $${COPYAI_CHAT.monthly} a month for ${COPYAI_CHAT.seats} seats with unlimited words on OpenAI, Anthropic and Gemini models. It has no CMS publishing.`,
      pickIf: "You want to draft posts yourself in a chat window, with your team.",
      skipIf: "You want finished posts published for you.",
    },
  ],
  faqs: [
    {
      q: "What is the best AI blog writer?",
      a: `It depends on the job. SEOWriting.ai is cheapest per post, Koala suits bulk affiliate content, Arvow publishes to the most platforms, and Draftly writes in your brand voice from $${SOLO.price} a month.`,
    },
    {
      q: "Is there a free AI blog writer?",
      a: "Draftly writes your first full post free with no credit card. SEOWriting.ai gives 3 free articles and Koala gives 5,000 free words. None is free for ongoing use.",
    },
    {
      q: "Will Google penalize AI-written blog posts?",
      a: "Google's guidance rewards helpful content however it's made. Posts made mainly to rank, in bulk, with nothing new in them, are what its spam policies target. Read every post before it goes live.",
    },
    {
      q: "Is ChatGPT or Claude good enough on its own?",
      a: "For drafting, yes. You'd still do the keyword research, the brand voice prompt, the fact check and the publishing yourself. The tools here do those steps for you.",
    },
  ],
  keepReading: { guides: ["/best-ai-for-writing", "/writesonic-alternatives"], topic: "best ai blog writer tool compare pricing posts" },
  cta: {
    heading: "Try Draftly free",
    body: "Paste your URL and Draftly writes a full blog post in your brand's voice. Your first post is free, no credit card.",
  },
};

export const AI_BLOG_WRITER_SMALL_BUSINESS: DecisionPage = {
  path: "/ai-blog-writer-for-small-business",
  query: "ai blog writer for small business",
  queryNote: "No search volume data (Draftly keyword tool, November 11, 2026). 7 of the top 8 results were list posts.",
  title: "AI Blog Writer for Small Business: What $0, $30 and $70 a Month Gets You",
  description:
    "What a small business gets from an AI blog writer at $0, about $30 and about $70 a month, comparing SEOWriting.ai, Koala, Draftly, Arvow and Jasper.",
  h1: "An AI blog writer for a small business",
  h1Accent: "at $0, $30 or $70 a month",
  answer: `Start free: Draftly writes one full post free and SEOWriting.ai gives 3 articles. Around $30 a month, SEOWriting.ai, Koala and Draftly Solopreneur ($${SOLO.price}) cover a weekly blog. Around $70, Draftly Growth ($${GROWTH.price}) adds team seats and live Google data, Arvow adds autopilot, and Jasper adds other channels.`,
  entries: [
    {
      tool: "seowriting",
      bestFor: "the cheapest weekly blog",
      summary: "Starter is $19 a month, or $14 billed yearly, for up to 50 articles, publishing to WordPress or Shopify. The free plan gives you 3 articles to test it.",
      pickIf: "You're on WordPress or Shopify and the budget is tight.",
      skipIf: "Your site is on Squarespace, Webflow or HubSpot.",
    },
    {
      tool: "koala",
      bestFor: "a business that already knows its keywords",
      summary: `Starter is $${KOALA_STARTER.monthly} a month for ${KOALA_STARTER.words.toLocaleString("en-US")} words, about ${Math.floor(KOALA_STARTER.words / ARTICLE_WORDS)} articles of ${ARTICLE_WORDS.toLocaleString("en-US")} words on its base model (our arithmetic).`,
      pickIf: "You have a keyword list and want articles written against it in bulk.",
      skipIf: "You want the tool to pick topics for you.",
    },
    {
      tool: "draftly",
      bestFor: "a blog that sounds like the owner wrote it",
      summary: `Free gets you one full post. Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()} with ${SOLO.seats} people. Growth is $${GROWTH.price} for ${growthPosts} posts with ${GROWTH.seats} people and live Google results. Each extra website is $${SITE_ADDON.price} a month. Posts publish to ${draftlyPublishing}.`,
      pickIf: "You'd rather approve a post a week in your own voice than publish a lot.",
      skipIf: "You're outside the US, write in another language, or need ads and emails too.",
    },
    {
      tool: "arvow",
      bestFor: "owners who want a blog without touching it",
      summary: `Solo is $${ARVOW_SOLO.monthly} a month, or $${ARVOW_SOLO.yearlyMonthly} billed yearly, and publishes to 9 platforms on autopilot.`,
      pickIf: "You won't read the posts and want them going out anyway.",
      skipIf: "You want a free trial, or you'd rather stay out of link exchanges.",
    },
    {
      tool: "jasper",
      bestFor: "businesses with a marketer writing for every channel",
      summary: `Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly, and writes ads, emails and social posts as well as blogs.`,
      pickIf: "One person does all your marketing writing.",
      skipIf: "You mainly need blog posts on WordPress.",
    },
  ],
  faqs: [
    {
      q: "What is the best AI blog writer for a small business?",
      a: `SEOWriting.ai if price comes first, Draftly from $${SOLO.price} a month if the posts need to sound like you, and Arvow if you want the blog to run itself.`,
    },
    {
      q: "How many blog posts should a small business publish?",
      a: "One good post a week is a solid start. A new site does better adding one to four pages a week than publishing in bulk.",
    },
    {
      q: "Can a small business blog with AI for free?",
      a: "For a few posts, yes. Draftly's first post is free, SEOWriting.ai gives 3 articles and Koala 5,000 words. Ongoing posting costs about $20 to $30 a month on the cheapest plans.",
    },
  ],
  keepReading: { guides: ["/blog-writing-service", "/ai-copywriter"], topic: "small business ai blog writer cost per post" },
  cta: {
    heading: "Write your first post free",
    body: "Paste your URL and Draftly writes a full post in your business's voice, ready to publish. No credit card.",
  },
};

export const KOALA_AI_ALTERNATIVES: DecisionPage = {
  path: "/koala-ai-alternatives",
  query: "koala ai alternatives",
  queryNote: "No search volume data (Draftly keyword tool, November 11, 2026). The #1 result was about a different product called Koala.",
  title: "Koala AI Alternatives in 2026: 5 AI Writers Compared",
  description:
    "Alternatives to Koala's AI writer (koala.sh) compared on price and publishing: SEOWriting.ai, Arvow, Draftly, Jasper and Writesonic.",
  h1: "Koala AI alternatives",
  h1Accent: "for blog posts",
  answer: `For cheaper bulk articles, SEOWriting.ai from $19 a month. For more platforms and autopilot, Arvow. For posts counted by the post in your brand voice, Draftly from $${SOLO.price} a month. This page is about Koala Writer (koala.sh), the AI article writer, not the sales tool with the same name.`,
  entries: [
    {
      tool: "seowriting",
      bestFor: "cheaper bulk articles",
      summary: `Starter is $19 a month for up to 50 articles. Koala Starter is $${KOALA_STARTER.monthly} for ${KOALA_STARTER.words.toLocaleString("en-US")} words, about ${Math.floor(KOALA_STARTER.words / ARTICLE_WORDS)} articles of ${ARTICLE_WORDS.toLocaleString("en-US")} words.`,
      pickIf: "You use Koala for volume and publish to WordPress or Shopify.",
      skipIf: "You rely on Koala's Amazon data for affiliate posts or publish to Webflow or Ghost.",
    },
    {
      tool: "arvow",
      bestFor: "more publishing platforms and an automated blog",
      summary: `Solo is $${ARVOW_SOLO.monthly} a month, or $${ARVOW_SOLO.yearlyMonthly} billed yearly, for about ${arvowArticles(ARVOW_SOLO.credits)} articles, publishing to 9 platforms.`,
      pickIf: "You need Framer, Squarespace or Blogger, which Koala doesn't list.",
      skipIf: "You want to try it free first.",
    },
    {
      tool: "draftly",
      bestFor: "a set number of posts in your brand voice",
      summary: `Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()} on the default model, Claude Sonnet 5.5. Premium models such as Claude Opus 5.5 use about 1.7x the credits per post. Posts publish to ${draftlyPublishing}.`,
      pickIf: "You'd rather plan by posts than by words, or Koala's posts didn't sound like you.",
      skipIf: "You write affiliate content that needs live Amazon data. Koala does that and Draftly doesn't.",
    },
    {
      tool: "jasper",
      bestFor: "teams writing more than blog posts",
      summary: `Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly, with brand voices and templates for every channel.`,
      pickIf: "You need ads, emails and social posts in one place.",
      skipIf: "You publish to WordPress and want it done for you.",
    },
    {
      tool: "writesonic",
      bestFor: "AI search tracking with articles included",
      summary: `Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly for ${WS_STARTER.articles} articles a month and tracking in ChatGPT, Gemini and Google AI Overviews.`,
      pickIf: "You want to see whether AI answers mention you.",
      skipIf: "You only need articles. It costs several times more per article than Koala.",
    },
  ],
  faqs: [
    {
      q: "What is the best Koala AI alternative?",
      a: `SEOWriting.ai for cheaper bulk articles, Arvow for more platforms, and Draftly for posts in your brand voice from $${SOLO.price} a month.`,
    },
    {
      q: "Is Koala AI the same as Koala the sales tool?",
      a: "No. Koala Writer at koala.sh is an AI article writer. Another product called Koala identifies website visitors for sales teams. This page covers the writer.",
    },
    {
      q: "Why do Koala's words run out faster on some models?",
      a: "Koala's pricing page counts words at 1x on GPT-6 Luna, 2x on GPT-6.1 Sol and Claude Sonnet 5, and 3x on Claude Opus 5.5.",
    },
  ],
  keepReading: { guides: ["/koala-ai-review", "/writesonic-alternatives"], topic: "koala ai alternative writer compare pricing" },
  cta: {
    heading: "Try a Koala alternative for free",
    body: "Paste your URL and Draftly writes a full blog post in your brand's voice. Your first post is free, no credit card.",
  },
};

export const DECISION_PAGES = [
  DISTRIBB_ALTERNATIVES,
  SEOBOT_ALTERNATIVES,
  BEST_AI_BLOG_WRITER,
  AI_BLOG_WRITER_SMALL_BUSINESS,
  KOALA_AI_ALTERNATIVES,
];

/** Every tool a page states facts about. */
export const pageTools = (page: DecisionPage): Tool[] => {
  const ids = [...(page.target ? [page.target] : []), ...page.entries.map((e) => e.tool)];
  return ids.map((id) => TOOLS[id]);
};

/** Tools on the page whose facts haven't been read on the vendor's own site. */
export const unverifiedTools = (page: DecisionPage) => pageTools(page).filter((t) => !t.verified);

/** True when every fact on the page has been read on the vendor's own site. */
export const isPublishable = (page: DecisionPage) => unverifiedTools(page).length === 0;

/** The page's last-checked date: the oldest check among its tools, or WRITTEN. */
export const pageChecked = (page: DecisionPage): CheckedDate =>
  pageTools(page)
    .filter((t) => !t.draftly)
    .reduce((oldest, t) => (t.checked.iso < oldest.iso ? t.checked : oldest), WRITTEN);

export { CHECKED_NOTE };
