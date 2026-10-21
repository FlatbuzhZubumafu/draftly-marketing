// "The difference" band on each /feature/[slug] page. Every line restates a claim
// already made in lib/features.ts (same facts, same limits); nothing new is claimed here.
import type { FeatureId } from "@/lib/features";
import { SITE_ADDON } from "@/lib/pricing";

export type Difference = {
  /** The usual problem, in one or two sentences. */
  problem: string;
  /** Draftly's approach, in one bold line. */
  approach: string;
  /** Lead-in for the list, e.g. "Every topic is:". */
  lead: string;
  points: [string, string, string, string];
  close: string;
};

/** Keyed by feature id (lib/features.ts), which stays the same when a URL slug changes. */
export const DIFFERENCE: Record<FeatureId, Difference> = {
  "topic-ideas": {
    problem: "Picking next week's topic is where a small-business blog usually stalls, and an empty prompt box is no help.",
    approach: "Draftly brings the topics to you, checked against your business first.",
    lead: "Each topic is:",
    points: [
      "Pulled from your industry's news, read every day",
      "Backed by real Google searches and People Also Ask questions on paid plans",
      "Checked against what your website says you sell",
      "Less than three weeks old",
    ],
    close: "Click Add Your Take on a headline and Draftly writes the post.",
  },
  "seo-research": {
    problem: "Keyword data usually lives in a separate SEO tool, with its own login and its own bill.",
    approach: "Draftly puts live search data next to your writing.",
    lead: "A lookup can show:",
    points: [
      "Search volume, difficulty, intent and trend for a keyword",
      "Google's live first page and its People Also Ask questions",
      "The domains you compete with, found when you add your website",
      "Keyword gaps and backlinks, on Autopilot",
    ],
    close: "Results are cached for 30 days, and repeat lookups from the cache are free.",
  },
  "brand-voice": {
    problem: "A general AI tool writes the same way for everyone, so you end up rewriting each draft to sound like your business.",
    approach: "Draftly sets your voice from your own website on day one.",
    lead: "Your voice settings include:",
    points: [
      "Eight tone sliders, set from your site",
      "Words you always use and words you never use",
      "Your opinions and stances",
      "A history in Brand Memory, with an undo on every change",
    ],
    close: "Move a slider and the next post follows it.",
  },
  "ai-models": {
    problem: "The model decides how a post sounds and what it costs. In our 19-model benchmark, overall scores ran from 74.0 to 95.1.",
    approach: "Draftly lets you pick the model for each post and shows the price first.",
    lead: "Whichever model you pick gets:",
    points: [
      "Your brand voice",
      "The same writing rules checks",
      "The same automatic fix pass",
      "Its credit price shown before you write",
    ],
    close: "Claude Sonnet 5.5 is the default because it sounded the most human in our tests.",
  },
  "writing-rules": {
    problem: "AI drafts repeat the same habits: filler words, numbers with no source, meta titles too long for Google.",
    approach: "Draftly checks every draft with code before you see it.",
    lead: "The check looks for:",
    points: [
      "Banned AI words and phrases",
      "Numbers with no source",
      "Meta title and description lengths",
      "One H1, heading style and link placement",
    ],
    close: "A draft that fails a hard rule gets one automatic fix pass.",
  },
  "ai-detector": {
    problem: "A detector score alone leaves you hunting for the sentences that caused it.",
    approach: "Draftly shows the passages that read like AI and says why.",
    lead: "Each check shows:",
    points: [
      "A Reads as AI score from 0 to 100, lower is better",
      "The passages that pull the score up",
      "The reason for each one, like stock transitions or filler words",
      "Human voice, Readability and SEO scores beside it",
    ],
    close: "Edit then rewrites only the flagged sentences. Numbers, quotes and links stay exactly as written.",
  },
  editor: {
    problem: "Checking copy you already have usually means copying it out of your CMS, into a tool, and back again.",
    approach: "The Editor brings the copy in for you and fixes only what breaks a rule.",
    lead: "Each run:",
    points: [
      "Takes pasted text, a page URL or a post from your CMS",
      "Scores the copy against your writing rules and brand voice",
      "Rewrites only the flagged sentences",
      "Shows the price before it runs",
    ],
    close: "You accept or reject each change.",
  },
  "seo-meta": {
    problem: "Meta titles and descriptions get skipped, or written too long for Google to show in full.",
    approach: "Draftly writes them with every draft and checks their length.",
    lead: "Each draft comes with:",
    points: [
      "A URL slug",
      "A meta title of 50 to 60 characters",
      "A meta description of 150 to 160 characters",
      "An SEO score out of 100",
    ],
    close: "When you publish, the meta goes to your CMS and SEO plugin with the post.",
  },
  publishing: {
    problem: "Getting a finished post onto your blog usually means copy, paste, reformatting and filling in the SEO fields by hand.",
    approach: "Draftly sends the post to your CMS with everything in place.",
    lead: "Each post goes out with:",
    points: [
      "Its title and body",
      "Its URL slug",
      "Its meta title and meta description",
      "A choice to publish now or send it as a draft",
    ],
    close: "Updating a live post never unpublishes it.",
  },
  autopilot: {
    problem: "Writing is the first thing to slip in a busy week, and then the blog goes quiet for months.",
    approach: "Autopilot runs the whole job on a schedule you set.",
    lead: "On a schedule, each post is:",
    points: [
      "On a topic Draftly picks for you",
      "Written in your brand voice",
      "Run through every check",
      "Published, or held as a draft for you to review",
    ],
    close: "A weekly email lists everything it published.",
  },
  analytics: {
    problem: "The numbers that show which posts bring in readers sit in Google Analytics and Search Console, two tools a busy owner rarely opens.",
    approach: "Draftly shows your Analytics and Search Console data next to the posts it wrote.",
    lead: "The connection is:",
    points: [
      "Free on every plan, including Free",
      "Read-only access to your Google accounts",
      "Set up per website",
      "Shown beside the posts Draftly wrote",
    ],
    close: "See which searches bring people to your site and what they do next.",
  },
  mcp: {
    problem: "If you already write with Claude or ChatGPT, it doesn't know your brand voice, your topics or your rules.",
    approach: "The Draftly connector gives your AI all three.",
    lead: "Your connected AI gets:",
    points: [
      "Your brand voice",
      "Topic ideas for your business",
      "Your writing checks",
      "Live SEO data, on paid plans",
    ],
    close: "Drafts are checked against your rules and saved to Draftly, ready to publish.",
  },
  "wordpress-plugin": {
    problem: "Posts already in WordPress rarely get a second look, and fixing them means copying each one out to another tool.",
    approach: "The Draftly plugin checks and fixes posts inside WordPress.",
    lead: "Each suggestion is:",
    points: [
      "Checked against your writing rules",
      "Written in your brand voice",
      "Yours to approve or skip",
      "Undone exactly with Revert",
    ],
    close: "It works with Yoast SEO, Rank Math and All in One SEO.",
  },
  teams: {
    problem: "Per-seat pricing makes the bill grow every time someone joins.",
    approach: "Draftly includes your team in the plan price.",
    lead: "Each extra website gets:",
    points: [
      "Its own brand voice",
      "Its own writing rules",
      "Its own topics",
      `${SITE_ADDON.credits} monthly credits`,
    ],
    close: `Each extra website is $${SITE_ADDON.price} a month.`,
  },
};

/** Heading text with the part that gets the accent (squiggle or italic) split out. */
export type Accented = { lead: string; accent: string };

/**
 * Section headings on each /feature/[slug] page, keyed by feature id. Text only: the
 * markup and accents are set in app/feature/[slug]/page.tsx. Each H2 targets a search
 * phrase that belongs to this page alone, so no two feature pages (or the hub, the free
 * tools and the guides) share an H2. Keyword map and volumes: PR "Headings: one keyword
 * per page" (DataForSEO through the Draftly MCP, US, 2026-10-20 and 2026-10-21).
 */
export type FeatureHeadings = {
  /** "The difference" H2. Blue squiggle on the accent. */
  difference: Accented;
  /** "Where it fits" H2. Yellow underline on the accent. */
  fits: Accented;
  /** "Which plans" H2. Yellow underline on the accent. */
  plans: Accented;
  /** H3 over the honest limits. */
  limits: string;
  /** H3 over the Jasper comparison, when the feature has one. */
  compare?: string;
  /** FAQ H2. The last word gets the blue squiggle. */
  faq: string;
  /** Related features H2. The last word gets the blue squiggle. */
  related: string;
  /** Closing call-to-action H2. Italic accent. */
  cta: Accented;
};

export const HEADINGS: Record<FeatureId, FeatureHeadings> = {
  "topic-ideas": {
    difference: { lead: "Unique blog ideas, checked against", accent: "what you sell" },
    fits: { lead: "Where blog topic ideas fit in", accent: "the Draftly workflow" },
    plans: { lead: "Which plans include", accent: "blog topic ideas" },
    limits: "Limits of news-based topic ideas",
    compare: "Topic ideas in Draftly vs Jasper's Blog Post agent",
    faq: "Blog topic ideas FAQ",
    related: "Features that turn a topic into a post",
    cta: { lead: "Turn a topic idea into", accent: "your first free post" },
  },
  "seo-research": {
    difference: { lead: "Keyword volume and difficulty next to", accent: "your drafts" },
    fits: { lead: "Where keyword research fits before", accent: "you write" },
    plans: { lead: "Keyword research limits on", accent: "each plan" },
    limits: "How the monthly data cap works",
    faq: "Keyword research FAQ",
    related: "Turn keyword research into posts",
    cta: { lead: "Start with a free post, add", accent: "keyword data later" },
  },
  "brand-voice": {
    difference: { lead: "Brand voice guidelines set from", accent: "your own pages" },
    fits: { lead: "Where your brand voice shows up in", accent: "every post" },
    plans: { lead: "Is the AI brand voice on", accent: "every plan?" },
    limits: "What the AI brand voice can't do",
    compare: "Brand voices in Draftly vs Jasper Pro",
    faq: "AI brand voice FAQ",
    related: "Features that use your brand voice",
    cta: { lead: "Hear your brand voice in", accent: "a free post" },
  },
  "ai-models": {
    difference: { lead: "Each model's price in credits,", accent: "shown up front" },
    fits: { lead: "Where model choice fits in", accent: "writing a post" },
    plans: { lead: "Which plans include", accent: "all the models" },
    limits: "What premium models cost in credits",
    faq: "AI model picker FAQ",
    related: "Features that work with any model",
    cta: { lead: "Try Claude Sonnet 5.5 on", accent: "a free post" },
  },
  "writing-rules": {
    difference: { lead: "Common AI words and phrases,", accent: "caught by code" },
    fits: { lead: "Where the writing rules run before", accent: "you see a draft" },
    plans: { lead: "Which plans include", accent: "the writing rules" },
    limits: "What the writing rules can't catch",
    compare: "Writing checks in Draftly vs Jasper Style Guides",
    faq: "Writing rules FAQ",
    related: "More ways to check a draft",
    cta: { lead: "Read a checked draft of", accent: "your first post" },
  },
  "ai-detector": {
    difference: { lead: "Flag AI writing, then fix", accent: "only those sentences" },
    fits: { lead: "Where the AI detection score fits in", accent: "checking copy" },
    plans: { lead: "What the AI detection score", accent: "costs to run" },
    limits: "What an AI detection score can't prove",
    faq: "AI detection score FAQ",
    related: "Features that fix what the score flags",
    cta: { lead: "Score and fix", accent: "your first post" },
  },
  editor: {
    difference: { lead: "AI copy editing that keeps", accent: "your facts intact" },
    fits: { lead: "Where the AI copy editor fits for", accent: "existing pages" },
    plans: { lead: "What AI copy editing costs on", accent: "each plan" },
    limits: "When to paste text instead of a URL",
    compare: "Checking a page from its URL: Draftly vs Jasper",
    faq: "AI copy editor FAQ",
    related: "Other ways to check your copy",
    cta: { lead: "Start with a free post, then", accent: "check your old ones" },
  },
  "seo-meta": {
    difference: { lead: "Meta descriptions sized to", accent: "150 to 160 characters" },
    fits: { lead: "Where meta titles fit between", accent: "draft and publish" },
    plans: { lead: "Which plans include", accent: "meta titles and descriptions" },
    limits: "What the SEO score can't see",
    faq: "Meta title and description FAQ",
    related: "Features that check and publish your meta",
    cta: { lead: "Get a meta title and description with", accent: "your free post" },
  },
  publishing: {
    difference: { lead: "Shopify blog posts with", accent: "the meta filled in" },
    fits: { lead: "Where publishing fits after", accent: "the final check" },
    plans: { lead: "Which plans include", accent: "one-click publishing" },
    limits: "Platforms Draftly can't publish to yet",
    compare: "Publishing in Draftly vs Jasper's downloads",
    faq: "One-click publishing FAQ",
    related: "Features for after you hit publish",
    cta: { lead: "Publish your first post", accent: "for free" },
  },
  autopilot: {
    difference: { lead: "Blog automation with", accent: "an approval step" },
    fits: { lead: "Where automated blogging takes over", accent: "every step" },
    plans: { lead: "Which plan includes", accent: "automated blogging" },
    limits: "Which blogs can auto-publish",
    compare: "Scheduled publishing: Draftly vs Jasper",
    faq: "Automated blogging FAQ",
    related: "Features automated blogging builds on",
    cta: { lead: "Read one post before you", accent: "automate the rest" },
  },
  analytics: {
    difference: { lead: "Search Console keywords next to", accent: "your posts" },
    fits: { lead: "Where blog analytics fits after", accent: "a post goes live" },
    plans: { lead: "Blog analytics is free on", accent: "every plan" },
    limits: "What blog analytics in Draftly doesn't replace",
    faq: "Blog analytics FAQ",
    related: "Features to use with blog analytics",
    cta: { lead: "Connect Search Console, then write", accent: "your first post" },
  },
  mcp: {
    difference: { lead: "Your brand voice and SEO data inside", accent: "Claude and ChatGPT" },
    fits: { lead: "Where the connector fits when you write in", accent: "your own AI" },
    plans: { lead: "Which plans include", accent: "the connector" },
    limits: "Which AI apps the connector works with",
    compare: "The connector in Draftly vs Jasper's MCP",
    faq: "Claude and ChatGPT connector FAQ",
    related: "Features your AI can reach through the connector",
    cta: { lead: "Connect your AI and write", accent: "a free post" },
  },
  "wordpress-plugin": {
    difference: { lead: "Suggested edits you approve", accent: "one at a time" },
    fits: { lead: "Where the plugin fits in", accent: "your WordPress editor" },
    plans: { lead: "What the WordPress plugin costs to", accent: "install and run" },
    limits: "What the plugin leaves to the Draftly app",
    faq: "WordPress plugin FAQ",
    related: "Features that work with WordPress",
    cta: { lead: "Write a free post, then check", accent: "the rest in WordPress" },
  },
  teams: {
    difference: { lead: "Multiple websites, each with", accent: "its own voice" },
    fits: { lead: "Where team accounts fit when", accent: "several people write" },
    plans: { lead: "Team seats on", accent: "each paid plan" },
    limits: "What team accounts don't include",
    compare: "Team pricing: Draftly Growth vs Jasper Pro",
    faq: "Team accounts FAQ",
    related: "Features to pair with team accounts",
    cta: { lead: "Try one post before you", accent: "invite the team" },
  },
};
