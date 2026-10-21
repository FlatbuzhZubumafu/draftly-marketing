// The features hub (/features), one page per feature (/feature/[slug]) and the
// homepage feature cards all come from this list. Add a feature here and its page,
// hub card, homepage card, sitemap entry and llms.txt line appear.
//
// Only list features that are live in the app (draftly.blog repo, origin/main).
// Facts and limits were checked against that code on 2026-10-20:
// - Editor Check/Edit: _shared/editor-engine.ts, editor-pricing.ts (2 credits per
//   1,000 words, minimum 2), text, URL or CMS input (src EditorView).
// - Brand voice: functions/analyze-website, _shared/brand-voice-tune.ts (MAX_DELTA 15),
//   _shared/brand-learning.ts (±5 per event, 15 a week).
// - Writing rules: _shared/post-checks.ts, _shared/writing-rules.ts.
// - AI detector: _shared/ai-detect.ts (free, no model call).
// - Topics: _shared/brand-topic-engine.ts, _shared/topic-sources.ts.
// - Schedules: functions/process-content-schedules (fixed 2026-10-08, PR #54).
// Jasper claims are either from lib/jasper-vs-draftly.ts (its public pages, CHECKED)
// or from our own test of its app on JASPER_TESTED, with screenshots kept.
import type { Faq } from "@/components/ArticleParts";
import { FEATURE_SLIDES, GUIDE_SHOTS, INTEGRATIONS_SHOT, STEP_SHOTS, type ProductShot } from "@/lib/product-shots";
import { APP_MODEL_COUNT } from "@/lib/app-models";
import { DEFAULT_WRITER } from "@/lib/ruleCheck";
import { BAKEOFF_TOTALS, CHECKED, JASPER_PRO } from "@/lib/jasper-vs-draftly";
import { PLANS, SITE_ADDON } from "@/lib/pricing";

export const FEATURES_DATE = { iso: "2026-10-20", label: "October 20, 2026" };
/** The day we ran Jasper's own tools on a test account for the comparisons below. */
export const JASPER_TESTED = { iso: "2026-10-20", label: "October 20, 2026" };

export const FEATURES_HUB = {
  path: "/features",
  title: "Draftly Features: Topics, Brand Voice, Checks and Publishing",
  description:
    "Every Draftly feature in one place: blog topic ideas, an AI brand voice built from your website, writing checks, one-click publishing and automated blogging.",
};

export type CategoryId = "topics" | "write" | "check" | "publish" | "anywhere";

export const CATEGORIES: { id: CategoryId; name: string; blurb: string }[] = [
  { id: "topics", name: "Find topics", blurb: "Know what to write this week." },
  { id: "write", name: "Write in your voice", blurb: "Posts that sound like your business wrote them." },
  { id: "check", name: "Check and fix", blurb: "Catch AI phrasing and broken SEO basics before you publish." },
  { id: "publish", name: "Publish and measure", blurb: "Get posts onto your blog without copy and paste, then see what they bring in." },
  { id: "anywhere", name: "Use it your way", blurb: "From your AI, inside WordPress, or with your team." },
];

export type FeatureCompare = {
  /** What Draftly does, in one sentence. */
  draftly: string;
  /** What Jasper does, in one sentence, only what we saw or what its pages say. */
  jasper: string;
  /** Where the Jasper side comes from. */
  basis: "tested" | "pricing-page";
};

/**
 * Stable internal key for a feature. Art, "The difference" copy, related links and
 * cross-page links key off this, so a page's URL slug can change without breaking them.
 */
export type FeatureId =
  | "topic-ideas"
  | "seo-research"
  | "brand-voice"
  | "ai-models"
  | "writing-rules"
  | "ai-detector"
  | "editor"
  | "seo-meta"
  | "publishing"
  | "autopilot"
  | "analytics"
  | "mcp"
  | "wordpress-plugin"
  | "teams";

export type Feature = {
  id: FeatureId;
  /** URL slug: /feature/{slug}. Chosen for search (keyword audit, 2026-10-20). Old slugs are in lib/feature-redirects.ts. */
  slug: string;
  /** Short name for cards, nav and breadcrumbs. */
  name: string;
  /** lucide-react icon name, mapped in components/FeatureIcon.tsx. */
  icon: "Newspaper" | "SlidersHorizontal" | "Cpu" | "ListChecks" | "ScanSearch" | "PenLine" | "Search" | "Tags" | "Send" | "CalendarClock" | "LineChart" | "Plug" | "Blocks" | "Users";
  category: CategoryId;
  /** One line for cards. */
  summary: string;
  title: string;
  description: string;
  h1: { lead: string; accent: string };
  /** Answer-first: what it does, in two or three short paragraphs. */
  intro: string[];
  /** How it works, in order. */
  steps: { title: string; text: string }[];
  shot?: ProductShot;
  /** Which plans include it, in plain words. */
  plans: string;
  /** Honest limits. Every feature page says what it doesn't do. */
  limits: string[];
  compare?: FeatureCompare;
  faqs: Faq[];
  related: FeatureId[];
  /** A deeper page about the same thing, when one exists. */
  guide?: { href: string; label: string };
  /** A free tool that does part of the job without signing up. */
  tool?: { href: string; label: string };
  ogAlt: string;
  /**
   * Text for the first "How it works" H2, phrased the way people search. Defaults to "How it works".
   * The H1 carries the page's primary keyword; the other section headings are in HEADINGS
   * (lib/feature-pages.ts). Keep each H1 and H2 unique across the site.
   */
  howHeading?: string;
};

const SOLO = PLANS.find((p) => p.name === "Solopreneur")!;
const GROWTH = PLANS.find((p) => p.name === "Growth")!;
const editorShot: ProductShot = {
  src: "/images/product/feature-editor-check.webp",
  width: 1389,
  height: 868,
  alt: "Draftly's Editor with the blog writing service page brought in from its URL (1,375 words), Check selected at about 3 credits, target keyword blog writing service cost, and the scores SEO 30, Human voice 83, Readability 75 and Reads as AI 9",
  caption: "A published page checked straight from its URL. The SEO score is measured against the target keyword you type in.",
};
const dashboardShot: ProductShot = {
  src: "/images/product/feature-dashboard-connect.webp",
  width: 1568,
  height: 453,
  alt: "Draftly's Connect Your Tools panel: Google Analytics, Google Search Console and Your AI (connected to Claude), each with a Connect button",
  caption: "Connect Google Analytics and Search Console from the dashboard. Both are free on every plan.",
};

export const FEATURES: Feature[] = [
  {
    id: "topic-ideas",
    slug: "blog-topic-ideas",
    name: "Blog topic ideas",
    icon: "Newspaper",
    category: "topics",
    summary: "Post ideas pulled from your industry's news and real Google searches, checked against what your business sells.",
    title: "Blog Topic Ideas From Your Industry's News | Draftly",
    description:
      "Get blog topic ideas from your industry's news and real Google searches, checked against what your business sells. One click turns an idea into a post.",
    h1: { lead: "Blog topic ideas that fit", accent: "your business" },
    intro: [
      "Draftly reads your industry's news every day and pulls the stories your customers would care about. On paid plans it also adds topics from real Google searches, with the search volume and difficulty attached.",
      "Each idea is checked against your website first. Old news, competitor announcements and topics with nothing to do with what you sell are dropped before you see them.",
    ],
    steps: [
      { title: "Draftly reads your site", text: "It learns what you sell, who you sell to and the words you use, from your own pages." },
      { title: "It gathers ideas", text: "Fresh headlines from your industry's news, plus Google searches and People Also Ask questions on paid plans." },
      { title: "It filters and ranks them", text: "Ideas older than three weeks, off-brand or too vague are removed. The rest are ranked by search demand, how winnable they are and how well they fit." },
      { title: "You pick one", text: "Click Add Your Take on a headline, or pick a suggested topic, and Draftly writes the post." },
    ],
    shot: STEP_SHOTS[1],
    plans: "Every plan. Topic refreshes are free on paid plans; on Free they use your monthly credits. Search-based topics need a paid plan.",
    limits: [
      "News topics need your industry to have news sources Draftly can read. Very niche businesses get fewer headlines.",
      "Draftly doesn't use your Search Console data to pick topics yet.",
    ],
    compare: {
      draftly: "Suggests topics for you every day, filtered for your business.",
      jasper: "Its Blog Post agent asks you for the topic, the length and an outline before it writes.",
      basis: "tested",
    },
    faqs: [
      { q: "Where do Draftly's topic ideas come from?", a: "From news sources in your industry, and on paid plans from Google keyword data and People Also Ask questions. Every idea is checked against your website before you see it." },
      { q: "Can I write about my own topic instead?", a: "Yes. Type any topic in Write Your Own Topic and Draftly writes it in your voice." },
      { q: "How is this different from a blog topic generator?", a: "A topic generator gives ideas for whatever keyword you type. Draftly starts from your website and your industry's news, and drops ideas that don't fit what you sell. For a quick list without signing up, use the free blog ideas generator." },
    ],
    related: ["seo-research", "brand-voice", "autopilot"],
    tool: { href: "/tools/blog-ideas-generator", label: "free blog ideas generator" },
    ogAlt: "Draftly blog topic ideas: trending industry headlines, each one click from a blog post",
    howHeading: "How Draftly ranks blog topic ideas by search demand",
  },
  {
    id: "brand-voice",
    slug: "brand-voice",
    name: "AI brand voice",
    icon: "SlidersHorizontal",
    category: "write",
    summary: "Your tone set from your own website on day one, with sliders you can move and a voice that learns from your edits.",
    title: "AI Brand Voice Generator Built From Your Website | Draftly",
    description:
      "Draftly's AI brand voice generator reads your website and sets eight tone sliders you can adjust. It learns from your edits and ratings, and every post uses it.",
    h1: { lead: "An AI brand voice built from", accent: "your own website" },
    intro: [
      "Paste your URL and Draftly reads your site. It sets eight tone sliders (professional, friendly, authoritative, formal, technical, empathetic, innovative and conversational) and fills in what you sell and who you sell to.",
      "Every post and every edit uses that voice. Move a slider and the next post follows it.",
    ],
    steps: [
      { title: "Paste your URL", text: "Draftly reads your homepage and key pages and sets your sliders from them." },
      { title: "Adjust anything", text: "Move a slider, add words you always use, list words you never use, and add your opinions and stances." },
      { title: "Teach it in plain words", text: "Type something like \"less formal, more like we talk to customers\" in Teach the AI. It moves the right sliders, by up to 15 points per message." },
      { title: "It keeps learning", text: "Your ratings and edits nudge the voice by up to 5 points at a time, with a weekly cap. Brand Memory shows every change, and you can undo any of them." },
    ],
    shot: GUIDE_SHOTS.brandVoice,
    plans: "Every plan, including Free. Each extra website gets its own voice.",
    limits: [
      "Draftly writes in English only.",
      "A voice built from a site with very little text starts close to neutral. Add writing samples to sharpen it.",
    ],
    compare: {
      draftly: `A brand voice on every plan, and one per website on every paid plan. In our bake-off Draftly's posts averaged ${BAKEOFF_TOTALS.humanVoice.draftly} for human voice.`,
      jasper: `Pro ($${JASPER_PRO.monthly} per seat) includes 2 brand voices. Its posts averaged ${BAKEOFF_TOTALS.humanVoice.jasper} for human voice in the same test.`,
      basis: "pricing-page",
    },
    faqs: [
      { q: "How does Draftly learn my brand voice?", a: "It reads your website and sets eight tone sliders from it. After that, your ratings and edits nudge the sliders a few points at a time, and you can type changes in Teach the AI." },
      { q: "Can I undo something it learned?", a: "Yes. Brand Memory lists every change with the reason, and each one has an undo." },
      { q: "Can I have a different voice for each client?", a: `Yes. Each extra website is $${SITE_ADDON.price} a month and has its own voice, rules and credits.` },
    ],
    related: ["writing-rules", "ai-models", "teams"],
    guide: { href: "/for-teams", label: "Draftly for teams" },
    ogAlt: "Draftly brand voice: tone sliders set from your website, adjustable any time",
    howHeading: "How to train AI on your brand voice",
  },
  {
    id: "ai-models",
    slug: "ai-models",
    name: `${APP_MODEL_COUNT} AI models`,
    icon: "Cpu",
    category: "write",
    summary: `Pick the model for each post: Claude Sonnet 5.5 by default, or any of ${APP_MODEL_COUNT} including GPT, Gemini, Kimi and DeepSeek.`,
    title: `${APP_MODEL_COUNT} AI Models for Blog Posts: Claude, GPT, Gemini | Draftly`,
    description: `Draftly writes with Claude Sonnet 5.5 by default. Paid plans pick from ${APP_MODEL_COUNT} models per post, including GPT, Gemini, Kimi and DeepSeek, priced before you write.`,
    h1: { lead: "Pick the AI model for", accent: "each blog post" },
    intro: [
      `Claude Sonnet 5.5 is the default because it sounded the most human in our tests. In a ${DEFAULT_WRITER.briefs}-brief test it passed every hard writing rule ${DEFAULT_WRITER.rulePass}% of the time after the fix pass.`,
      `Paid plans include all ${APP_MODEL_COUNT} models. The price in credits shows next to each one before you write, and every model goes through the same checks.`,
    ],
    steps: [
      { title: "Type or pick a topic", text: "Start from a suggested topic or write your own." },
      { title: "Choose a model", text: "The picker shows each model's credit price. Budget models cost less; premium ones cost more." },
      { title: "Same checks for every model", text: "Whichever model writes, the post is checked against your writing rules and gets a fix pass." },
    ],
    shot: GUIDE_SHOTS.modelPicker,
    plans: "Free can use Claude Sonnet 5.5 and GPT 5.4 Mini. Every paid plan includes all of them.",
    limits: ["Premium models cost more credits per post, so you get fewer posts a month on them."],
    faqs: [
      { q: "Which AI model does Draftly use?", a: `Claude Sonnet 5.5 by default. Paid plans can switch per post to any of ${APP_MODEL_COUNT} models.` },
      { q: "Which model is best for blog posts?", a: "We test them and publish the results in the best AI for writing benchmark, scored on formatting, voice and cost." },
    ],
    related: ["writing-rules", "brand-voice", "editor"],
    guide: { href: "/best-ai-for-writing", label: "best AI for writing benchmark" },
    ogAlt: `Draftly's model picker: Claude Sonnet 5.5 by default and ${APP_MODEL_COUNT} models on paid plans`,
    howHeading: "How to pick an AI model for each post",
  },
  {
    id: "writing-rules",
    slug: "writing-rules",
    name: "Writing rules checker",
    icon: "ListChecks",
    category: "check",
    summary: "Every draft is checked for AI filler, banned words and SEO basics, and gets an automatic fix pass when it misses one.",
    title: "AI Words to Avoid, Checked in Every Draft | Draftly",
    description:
      "Draftly checks every draft for AI words to avoid, unsourced numbers, meta lengths, headings and links, then fixes what fails. You choose which rules are on.",
    h1: { lead: "AI words to avoid, flagged in", accent: "every draft" },
    intro: [
      "Before you see a draft, Draftly checks it against your writing rules. Banned AI words like \"seamless\" and \"leverage\", numbers with no source, meta titles outside 50 to 60 characters, a missing H1 or a call to action in the wrong place all fail the check.",
      `A failed check gets one automatic fix pass. In our ${DEFAULT_WRITER.briefs}-brief test, ${DEFAULT_WRITER.model} posts passed every hard rule ${DEFAULT_WRITER.rulePass}% of the time after that pass, and a reader-quality check scores whether the post makes sense and answers the question.`,
    ],
    steps: [
      { title: "Draftly writes the draft", text: "Using your voice, your rules and any source material for the topic." },
      { title: "Code checks the rules", text: "No AI guesses here: word lists, lengths, headings, links and every number are checked by code." },
      { title: "A fix pass runs", text: "If a hard rule fails, Draftly rewrites only what's needed and checks again." },
      { title: "A reader-quality check", text: "A second model scores whether it makes sense, answers the question and reads like an expert wrote it." },
    ],
    shot: GUIDE_SHOTS.genericVsDraftly,
    plans: "Every plan. Turn rules on or off per website in Brand > Writing Rules.",
    limits: ["The checks catch patterns. Someone who knows your business should still read each post before it goes live."],
    compare: {
      draftly: "Checks every draft for AI-sounding writing on every plan.",
      jasper: `Style Guides are on the Business plan; Pro shows an upgrade prompt. Its SEO rewriter's output in our test was full of em dashes.`,
      basis: "tested",
    },
    faqs: [
      { q: "What do Draftly's writing rules check?", a: "Banned AI words and phrases, unsourced numbers, meta title and description lengths, one H1, keyword placement, heading style, the call to action link and link placement, among others." },
      { q: "Which AI words and phrases does Draftly flag?", a: "Banned AI words like \"seamless\" and \"leverage\" and other stock AI phrases. A draft that uses one fails the check and gets an automatic fix pass before you see it." },
      { q: "Can I turn rules off?", a: "Yes. Each website has its own rule toggles and three presets: default, strict and light." },
    ],
    related: ["ai-detector", "editor", "seo-meta"],
    guide: { href: "/seo-copywriting", label: "SEO copywriting rules guide" },
    ogAlt: "Draftly's writing rule checker: a generic AI paragraph with four flagged rules beside a Draftly draft with none",
    howHeading: "How the writing rules checker works on every draft",
  },
  {
    id: "ai-detector",
    slug: "ai-detector",
    name: "AI content detector",
    icon: "ScanSearch",
    category: "check",
    summary: "A Reads as AI score and the exact passages that sound machine-written, with a one-click fix.",
    title: "AI Content Detector That Fixes Flagged Sentences | Draftly",
    description:
      "Draftly's AI content detector scores how much your copy reads like AI, highlights the passages that do and rewrites only those sentences. Works on any copy.",
    h1: { lead: "An AI detection score with", accent: "the sentences to fix" },
    intro: [
      "Draftly gives every piece of copy a Reads as AI score from 0 to 100, lower is better. It flags the passages that pull the score up and says why: stock transitions, three-item lists, sentences all the same length, filler words.",
      "Then Edit rewrites only the flagged sentences. Numbers, quotes and links stay exactly as written.",
    ],
    steps: [
      { title: "Bring in copy", text: "A Draftly post, or anything you paste in, load from a URL or pull from your CMS." },
      { title: "See the score", text: "Reads as AI, Human voice, Readability and SEO, side by side." },
      { title: "Fix only what's flagged", text: "Edit rewrites the flagged sentences and leaves the rest alone. You keep or reject each change." },
    ],
    shot: editorShot,
    plans: "Every plan. The score comes with Check and the fix with Edit, each about 2 credits per 1,000 words on the default model.",
    limits: ["No detector is perfect. Treat the score as a list of passages to reread before you publish."],
    faqs: [
      { q: "How much does the AI detector cost?", a: "Checking costs about 2 credits per 1,000 words on the default model, with a minimum of 2, and so does fixing the flagged sentences with Edit. The price shows before anything runs." },
      { q: "Does it change my facts?", a: "No. Edit drops any rewrite that changes a number, quote or link." },
      { q: "Can it rewrite the parts that sound like AI?", a: "Yes. Edit rewrites only the sentences the detector flags and leaves the rest alone. You keep or reject each change." },
    ],
    related: ["editor", "writing-rules", "brand-voice"],
    ogAlt: "Draftly's AI content detector: a Reads as AI score with the passages that sound machine-written",
    howHeading: "How the Reads as AI score flags passages",
  },
  {
    id: "editor",
    slug: "ai-copy-editor",
    name: "AI copy editor",
    icon: "PenLine",
    category: "check",
    summary: "Check or fix copy you already have, pasted in, loaded from a URL or pulled from your CMS.",
    title: "AI Copy Editor for Blog Posts and Web Pages | Draftly",
    description:
      "Draftly's AI copy editor checks existing copy against your rules and brand voice, from pasted text, a URL or your CMS, and fixes only what breaks a rule.",
    h1: { lead: "An AI copy editor for", accent: "copy you already have" },
    intro: [
      "The Editor works on copy Draftly didn't write. Paste text, enter a page URL or pull a post from your CMS, and Draftly checks it against your writing rules and brand voice.",
      "Check scores it and lists the sentences to look at. Edit rewrites only those sentences. You see the price before anything runs, about 2 credits per 1,000 words on the default model.",
    ],
    steps: [
      { title: "Bring it in", text: "Paste text, enter a URL or choose a post from your connected CMS. Bringing it in is free." },
      { title: "Add a target keyword", text: "Optional. It's used for the SEO score." },
      { title: "Check or Edit", text: "Check flags and scores. Edit fixes only the flagged sentences and keeps numbers, quotes and links as written." },
      { title: "Keep what you like", text: "Accept or reject each change, then copy it or save it as a Draftly post." },
    ],
    shot: editorShot,
    plans: "Every plan, priced per run in credits.",
    limits: ["Pages brought in from a URL can pick up extra parts of the page, like related-post cards, and tables come through as plain lines. Paste the text when you want only the article checked."],
    compare: {
      draftly: "Reads the page from its URL and checks it.",
      jasper: "Three of its tools that ask for \"content or URL\" said they couldn't access the page and asked us to paste the text.",
      basis: "tested",
    },
    faqs: [
      { q: "Can Draftly check a page that's already published?", a: "Yes. Enter its URL in the Editor, or pull the post from your connected CMS." },
      { q: "How much does the Editor cost?", a: "About 2 credits per 1,000 words on the default model, with a minimum of 2. The price shows before you run it." },
    ],
    related: ["ai-detector", "writing-rules", "wordpress-plugin"],
    tool: { href: "/tools/blog-seo-checker", label: "free blog SEO checker" },
    ogAlt: "Draftly's AI copy editor scoring a page loaded from its URL: SEO, Human voice, Readability and Reads as AI",
    howHeading: "How the AI copy editor works",
  },
  {
    id: "seo-meta",
    slug: "seo-meta",
    name: "Meta title and description",
    icon: "Tags",
    category: "check",
    summary: "A URL slug, meta title and meta description with every draft, sized for Google, plus an SEO score.",
    title: "Meta Title and Description Generator for Blogs | Draftly",
    description:
      "Every Draftly draft comes with a URL slug, a meta title of 50 to 60 characters and a meta description of 150 to 160, plus an SEO score out of 100.",
    h1: { lead: "A meta title and description with", accent: "every draft" },
    intro: [
      "Every draft comes with a URL slug, a meta title sized to 50 to 60 characters and a meta description of 150 to 160, so they fit how Google shows them.",
      "Each post also gets an SEO score out of 100 that checks keyword placement, headings, length and links. When you publish, the meta goes to your CMS and SEO plugin with the post.",
    ],
    steps: [
      { title: "Draftly writes the meta", text: "Slug, title and description are part of every draft." },
      { title: "The checker sizes them", text: "Titles and descriptions outside the length limits fail the rules and get fixed." },
      { title: "It publishes with the post", text: "The meta fields go to your CMS when you publish." },
    ],
    shot: FEATURE_SLIDES[2].shot,
    plans: "Every plan.",
    limits: ["The SEO score checks the page itself. It can't see your backlinks or how competitive the keyword is."],
    faqs: [
      { q: "Does Draftly write the meta title and description?", a: "Yes, with every draft, and it checks their length against Google's display limits." },
      { q: "What is the best length for a meta description?", a: "Draftly sizes meta descriptions to 150 to 160 characters and meta titles to 50 to 60, so they fit how Google shows them. One outside those lengths fails the writing rules and gets fixed." },
    ],
    related: ["writing-rules", "publishing", "seo-research"],
    tool: { href: "/tools/blog-seo-checker", label: "free blog SEO checker" },
    ogAlt: "SEO fields Draftly writes with every post: URL slug, meta title and meta description",
    howHeading: "How Draftly writes your meta title and description",
  },
  {
    id: "seo-research",
    slug: "keyword-research",
    name: "Keyword research",
    icon: "Search",
    category: "topics",
    summary: "Search volume, difficulty, live Google results, People Also Ask, competitor gaps and backlinks for your site.",
    title: "Keyword Research and Competitor Keywords for Blogs | Draftly",
    description:
      "Check a keyword's volume, difficulty and intent, see Google's first page and People Also Ask, and find the keywords your competitors rank for, by plan.",
    h1: { lead: "Keyword research for", accent: "your site and competitors" },
    intro: [
      "Draftly includes live search data, so you can check a keyword before you write. Look up search volume, difficulty and intent, see Google's first page and its People Also Ask questions, find the domains you compete with, and on Autopilot see the keywords they rank for that you don't.",
      "Draftly finds your competitors when you add your website, and you can edit the list. Results are cached for 30 days, and repeat lookups from the cache are free.",
    ],
    steps: [
      { title: "Connect your AI or use Draftly", text: "The data is available through the Draftly connector in Claude, ChatGPT or Cursor, and feeds the topic ideas." },
      { title: "Ask about a keyword or domain", text: "Volume, difficulty, intent, trend, related keywords, Google's live results and competitor data." },
      { title: "Write from it", text: "Turn what you find into a post in your voice." },
    ],
    plans: `Keyword lookups from Solopreneur (40 a month). Live Google results, People Also Ask and domain data from Growth (150 a month). Keyword gaps and backlinks on Autopilot (300 a month).`,
    limits: ["Data calls are capped per month by plan. Cached results don't count against the cap."],
    faqs: [
      { q: "Where does Draftly's SEO data come from?", a: "From DataForSEO, the same kind of data source many SEO tools use, fetched live and cached for 30 days." },
      { q: "How do I find the keywords my competitors rank for?", a: "Add your website and Draftly finds the domains you compete with, and you can edit the list. On the Autopilot plan it shows the keywords they rank for that you don't. Keyword gaps and backlinks are Autopilot features." },
      { q: "Does Draftly show People Also Ask questions?", a: "Yes. From the Growth plan, a lookup shows Google's live first page for a keyword along with its People Also Ask questions." },
      { q: "Do I need a separate SEO tool?", a: "For blog planning, often not. For rank tracking or a full backlink audit, a dedicated SEO tool goes further." },
    ],
    related: ["topic-ideas", "mcp", "seo-meta"],
    guide: { href: "/mcp", label: "SEO MCP connector" },
    tool: { href: "/tools/content-brief-generator", label: "free content brief generator" },
    ogAlt: "Draftly keyword research: keyword volume, Google results, People Also Ask and competitor keywords",
    howHeading: "How to research blog keywords in Draftly",
  },
  {
    id: "publishing",
    slug: "publishing",
    name: "One-click publishing",
    icon: "Send",
    category: "publish",
    summary: "Send a finished post to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot in one click.",
    title: "Publish AI Blog Posts to WordPress and Shopify | Draftly",
    description:
      "Draftly publishes finished posts to WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot in one click, with meta title, description and slug filled in.",
    h1: { lead: "Publish blog posts to WordPress and Shopify", accent: "in one click" },
    intro: [
      "Connect your CMS once, then publish any post from Draftly with its title, body, slug, meta title and meta description in place. You can also send it as a draft to review in your CMS first.",
      "Draftly works with WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot. You can also copy the post or send it to Google Docs.",
    ],
    steps: [
      { title: "Connect your CMS", text: "In Settings > Integrations, once per website." },
      { title: "Open a finished post", text: "Read it and make any edits." },
      { title: "Publish", text: "Choose publish now or send as a draft. Updating a live post never unpublishes it." },
    ],
    shot: INTEGRATIONS_SHOT,
    plans: "Every plan, including your free post.",
    limits: ["Wix isn't supported yet."],
    compare: {
      draftly: "One-click publishing to six CMSs on every plan.",
      jasper: "In our test its documents could be downloaded as Word, PDF, text, Markdown or HTML. Its integrations page doesn't list WordPress.",
      basis: "tested",
    },
    faqs: [
      { q: "Which platforms can Draftly publish to?", a: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot. You can also copy a post or send it to Google Docs." },
      { q: "Can I review it in WordPress before it goes live?", a: "Yes. Send it as a draft and publish it from WordPress when you're ready." },
    ],
    related: ["autopilot", "wordpress-plugin", "seo-meta"],
    ogAlt: "Draftly publishing to WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
    howHeading: "How to post to WordPress without copy and paste",
  },
  {
    id: "autopilot",
    slug: "automated-blogging",
    name: "Automated blogging",
    icon: "CalendarClock",
    category: "publish",
    summary: "Set a schedule once. Draftly picks topics, writes the posts and publishes them on your cadence.",
    title: "Automated Blogging: AI Posts on Your Schedule | Draftly",
    description:
      "Automated blogging on the Autopilot plan: Draftly picks topics, writes posts and publishes them to WordPress or Shopify on your schedule, with a weekly digest.",
    h1: { lead: "Automated blogging on", accent: "your schedule" },
    intro: [
      "Set a schedule once: how often, how many topics and how many posts can go out without your review. Draftly picks the topics, writes each post, runs every check and publishes on that cadence.",
      "You get a weekly email listing everything it published. Posts you'd rather check first wait for you as drafts.",
    ],
    steps: [
      { title: "Set the cadence", text: "Choose how often and how many posts." },
      { title: "Choose what auto-publishes", text: "Approve everything yourself, or let a set number go straight to WordPress or Shopify." },
      { title: "Draftly runs it", text: "Topics, writing, checks, images and publishing, on schedule." },
      { title: "Read the digest", text: "A weekly email lists every post that went out." },
    ],
    plans: "Autopilot plan ($100 a month).",
    limits: ["Automatic publishing works with WordPress and Shopify. Other CMSs get the post ready for one-click publishing."],
    compare: {
      draftly: "Scheduled auto-publishing on the Autopilot plan.",
      jasper: "Scheduled publishing isn't listed on its site.",
      basis: "pricing-page",
    },
    faqs: [
      { q: "What is automated blogging?", a: "Software that picks topics, writes posts and publishes them on a schedule. In Draftly that's the Autopilot plan: you set the cadence and choose how many posts go live without your review." },
      { q: "Can Draftly post to my blog automatically?", a: "Yes, on the Autopilot plan, to WordPress or Shopify on a schedule you set." },
      { q: "Can I approve posts before they go live?", a: "Yes. You choose how many posts publish on their own; the rest wait for you as drafts." },
    ],
    related: ["publishing", "topic-ideas", "analytics"],
    ogAlt: "Draftly automated blogging: posts picked, written and published on your schedule",
    howHeading: "How automated blogging works in Draftly",
  },
  {
    id: "analytics",
    slug: "blog-analytics",
    name: "Blog analytics",
    icon: "LineChart",
    category: "publish",
    summary: "Connect Google Analytics and Search Console, free on every plan, to see what your posts bring in.",
    title: "Blog Analytics With Google Search Console | Draftly",
    description:
      "Connect Google Analytics and Search Console to Draftly for free on every plan. See which searches bring people to your posts and what they do next.",
    h1: { lead: "Blog analytics that show what your posts", accent: "bring in" },
    intro: [
      "Connect Google Analytics and Search Console from your dashboard. Draftly shows which Google searches bring people to your site, how many people read your posts and what they do next.",
      "Both connections are free on every plan, including Free. Draftly asks Google for read-only access.",
    ],
    steps: [
      { title: "Connect Google", text: "From the dashboard's Connect Your Tools section. Draftly asks for read-only access." },
      { title: "Pick your property", text: "Choose the Analytics property and Search Console site for each website." },
      { title: "Read the reports", text: "Searches, clicks and readers, next to the posts Draftly wrote." },
    ],
    shot: dashboardShot,
    plans: "Every plan, including Free.",
    limits: ["Draftly reports on your traffic. It isn't a full replacement for Google Analytics."],
    faqs: [
      { q: "Is the Search Console connection free?", a: "Yes, on every plan." },
      { q: "Can Draftly change my Google settings?", a: "No. It asks for read-only access to Analytics and Search Console." },
    ],
    related: ["seo-research", "autopilot", "topic-ideas"],
    ogAlt: "Draftly's dashboard with Google Analytics and Search Console, free on every plan",
    howHeading: "How to see which searches bring readers to your blog",
  },
  {
    id: "mcp",
    slug: "mcp",
    name: "Claude and ChatGPT connector",
    icon: "Plug",
    category: "anywhere",
    summary: "Use Draftly from Claude, ChatGPT or Cursor: your brand voice, posts, topics, checks and live SEO data.",
    title: "Claude and ChatGPT Connector for Blog Writing | Draftly",
    description:
      "Connect Draftly to Claude, ChatGPT or Cursor. Your AI gets your brand voice, topics, posts, writing checks and live SEO data, and can save drafts to Draftly.",
    h1: { lead: "A Claude and ChatGPT connector for", accent: "your blog" },
    intro: [
      "Draftly has a connector (an MCP server) for Claude, ChatGPT, Cursor and other AI apps. Once connected, your AI can read your brand voice, find topics, look up live SEO data and check its own drafts against your rules.",
      "You can also bring your own AI: your Claude or ChatGPT writes the post on your existing subscription, and Draftly briefs it, checks the draft and saves it to your account.",
    ],
    steps: [
      { title: "Add the connector", text: "Add Draftly's MCP address in Claude, ChatGPT or Cursor and sign in." },
      { title: "Ask in plain words", text: "\"Find three topics for my plumbing site and draft the best one in my voice.\"" },
      { title: "Draftly checks and saves", text: "The draft is checked against your rules and saved to Draftly, ready to publish." },
    ],
    shot: { ...FEATURE_SLIDES[0].shot, src: "/images/product/guide-thumb-mcp.webp", width: 1280, height: 800, alt: "Claude, ChatGPT, Grok, Cursor, OpenClaw and Hermes Agent connecting to Draftly, which publishes to six CMSs", caption: "Your AI on top, Draftly in the middle, your CMS below." },
    plans: "Every plan, including Free. Live SEO data tools are on paid plans.",
    limits: ["Your AI app needs to support MCP connectors."],
    compare: {
      draftly: "The connector is on every plan.",
      jasper: "Jasper's MCP connector is on the Business plan.",
      basis: "pricing-page",
    },
    faqs: [
      { q: "What is an MCP connector?", a: "A standard way for AI apps like Claude and ChatGPT to use outside tools. Draftly's connector gives your AI your brand voice, topics, checks and SEO data." },
      { q: "Do I need a paid plan to use it?", a: "No. Free can connect and write one post with your own AI. Live SEO data needs a paid plan." },
    ],
    related: ["seo-research", "brand-voice", "editor"],
    guide: { href: "/mcp", label: "SEO MCP connector page" },
    ogAlt: "Draftly's MCP connector: Claude, ChatGPT and Cursor connected to Draftly",
    howHeading: "How to add the Draftly connector to Claude or ChatGPT",
  },
  {
    id: "wordpress-plugin",
    slug: "wordpress-plugin",
    name: "WordPress plugin",
    icon: "Blocks",
    category: "anywhere",
    summary: "Check and fix posts inside WordPress, with suggestions you approve one at a time.",
    title: "WordPress Plugin That Checks and Fixes Your Posts | Draftly",
    description:
      "Draftly's WordPress plugin checks your posts against your writing rules and suggests edits in your voice. Works with Yoast SEO, Rank Math and All in One SEO.",
    h1: { lead: "Check and fix posts inside", accent: "WordPress" },
    intro: [
      "The Draftly plugin adds a Check and an Optimize button to your WordPress posts. It flags sentences that break your writing rules and suggests fixes in your brand voice, each with Approve and Skip.",
      "It works with Yoast SEO, Rank Math and All in One SEO, and saves your meta fields where your SEO plugin expects them.",
    ],
    steps: [
      { title: "Install the plugin", text: "Upload it to WordPress and connect it to your Draftly account." },
      { title: "Open a post", text: "Click Check to see what breaks a rule." },
      { title: "Approve or skip", text: "Each suggested edit is yours to approve, one at a time. Revert puts the original back exactly." },
    ],
    shot: { ...INTEGRATIONS_SHOT, src: "/images/product/guide-thumb-wordpress-plugin.webp", width: 1280, height: 800, alt: "The Draftly plugin inside WordPress suggesting edits to a post, each with Approve and Skip buttons", caption: "Suggested edits inside WordPress, each with Approve and Skip." },
    plans: "Free to install, with paid plugin plans from $5 a month.",
    limits: ["The plugin edits existing posts. Writing new posts happens in the Draftly app."],
    faqs: [
      { q: "Does the plugin work with Yoast or Rank Math?", a: "Yes. It works with Yoast SEO, Rank Math and All in One SEO." },
      { q: "Will it change my posts without asking?", a: "Not by default. Each suggestion waits for your approval, and Revert restores the original." },
    ],
    related: ["editor", "publishing", "writing-rules"],
    guide: { href: "/wordpress-ai-plugin", label: "WordPress plugin page" },
    ogAlt: "Draftly's WordPress plugin suggesting edits with Approve and Skip",
    howHeading: "How to check a WordPress post against your writing rules",
  },
  {
    id: "teams",
    slug: "teams",
    name: "Teams and extra websites",
    icon: "Users",
    category: "anywhere",
    summary: `Team members included with no per-seat price, and $${SITE_ADDON.price} a month for each extra client website.`,
    title: "Team Accounts and Multiple Websites | Draftly",
    description: `Team members are included: ${SOLO.seats} on Solopreneur, ${GROWTH.seats} on Growth, unlimited on Autopilot. Each extra website is $${SITE_ADDON.price} a month with its own voice and credits.`,
    h1: { lead: "Team accounts with", accent: "no per-seat price" },
    intro: [
      `Invite your team at no extra cost: ${SOLO.seats} people on Solopreneur, ${GROWTH.seats} on Growth and unlimited on Autopilot, sharing the plan's credits.`,
      `Agencies and multi-brand businesses can add websites for $${SITE_ADDON.price} a month each. Every website has its own brand voice, writing rules, topics and ${SITE_ADDON.credits} monthly credits.`,
    ],
    steps: [
      { title: "Invite people", text: "From Settings > Team. Everyone shares the plan's credits." },
      { title: "Add a website", text: "Each one gets its own voice, rules and credits." },
      { title: "Switch between them", text: "Pick the website at the top of any screen." },
    ],
    plans: "Paid plans. Free has one seat and one website.",
    limits: ["Draftly doesn't offer single sign-on (SSO)."],
    compare: {
      draftly: `${GROWTH.seats} people on Growth for $${GROWTH.price} a month.`,
      jasper: `${GROWTH.seats} seats on Pro cost $${JASPER_PRO.monthly * (GROWTH.seats ?? 1)} a month.`,
      basis: "pricing-page",
    },
    faqs: [
      { q: "Does Draftly charge per seat?", a: "No. Team members are included with each paid plan." },
      { q: "Can an agency manage several clients?", a: `Yes. Add each client as a website for $${SITE_ADDON.price} a month, each with its own voice and credits.` },
    ],
    related: ["brand-voice", "mcp", "autopilot"],
    guide: { href: "/for-teams", label: "Draftly for teams" },
    ogAlt: `Draftly for teams: no per-seat price and $${SITE_ADDON.price} client websites`,
    howHeading: "How to add team members and client websites",
  },
];

export const featurePath = (f: Pick<Feature, "slug">) => `/feature/${f.slug}`;
/** Look up a feature by its stable id (related links, hub chips, comparison rows). */
export const getFeature = (id: string) => FEATURES.find((f) => f.id === id);
/** Look up a feature by its URL slug (the /feature/[slug] route). */
export const getFeatureBySlug = (slug: string) => FEATURES.find((f) => f.slug === slug);
/** /feature/{slug} for a feature id. Throws at build time if the id is unknown. */
export function featurePathById(id: FeatureId): string {
  const f = getFeature(id);
  if (!f) throw new Error(`Unknown feature id: ${id}`);
  return featurePath(f);
}

export const featuresIn = (c: CategoryId) => FEATURES.filter((f) => f.category === c);

/** Where a comparison's Jasper side comes from, in one plain line. */
export const compareBasis = (c: FeatureCompare) =>
  c.basis === "tested"
    ? `From our test of Jasper's app on ${JASPER_TESTED.label}.`
    : `From Jasper's own pages, checked ${CHECKED.label}.`;
