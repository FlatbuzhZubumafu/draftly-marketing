import { PAID_PLANS } from "@/lib/pricing";
import { WP_PLANS } from "@/lib/wordpress-plugin";

// The comparison table on /wordpress-ai-plugin#compare.
//
// Competitor cells come only from each vendor's own pages, read on
// WP_COMPARED_DATE (links in WP_COMPARE_TOOLS[].sources). "notListed" means the
// vendor's pages don't mention the feature; use "no" only when they clearly say
// it isn't offered. Draftly cells follow the plugin on draftly.blog main
// (integrations/wordpress-plugin/draftly, version in WP_PLUGIN_VERSION).

export const WP_COMPARED_ON = "October 2026";
export const WP_COMPARED_DATE = "2026-10-09";

export type Mark = "yes" | "no" | "partial" | "notListed" | "soon" | "isSeoPlugin";

/** One line in a cell: an optional mark, optional short text, optional footnote number. */
export type CellLine = { mark?: Mark; text?: string; note?: number };
export type Cell = CellLine | CellLine[];

export type ToolId = "draftly" | "rankmath" | "yoast" | "aioseo" | "getgenie";

export type CompareTool = {
  id: ToolId;
  name: string;
  /** Second line under the name in the header. */
  product: string;
  sources: { href: string; label: string }[];
};

export const WP_COMPARE_TOOLS: CompareTool[] = [
  { id: "draftly", name: "Draftly", product: "AI Post Optimizer", sources: [] },
  {
    id: "rankmath",
    name: "Rank Math",
    product: "Content AI (Rank Math AI)",
    sources: [
      { href: "https://rankmath.com/ai/pricing/", label: "rankmath.com/ai/pricing" },
      { href: "https://rankmath.com/content-ai/", label: "rankmath.com/content-ai" },
      { href: "https://rankmath.com/kb/fix-seo-tests-with-content-ai/", label: "rankmath.com/kb/fix-seo-tests-with-content-ai" },
    ],
  },
  {
    id: "yoast",
    name: "Yoast SEO Premium",
    product: "AI features",
    sources: [
      { href: "https://yoast.com/wordpress/plugins/seo/", label: "yoast.com/wordpress/plugins/seo" },
      { href: "https://yoast.com/ai-features/", label: "yoast.com/ai-features" },
      { href: "https://yoast.com/help/how-to-use-the-yoast-ai-optimize-feature/", label: "yoast.com/help (AI Optimize)" },
      { href: "https://yoast.com/pricing/", label: "yoast.com/pricing" },
    ],
  },
  {
    id: "aioseo",
    name: "All in One SEO",
    product: "AIOSEO AI features",
    sources: [
      { href: "https://aioseo.com/pricing/", label: "aioseo.com/pricing" },
      { href: "https://aioseo.com/features/ai-content-generator/", label: "aioseo.com/features/ai-content-generator" },
    ],
  },
  {
    id: "getgenie",
    name: "GetGenie",
    product: "AI writing plugin",
    sources: [
      { href: "https://getgenie.ai/pricing/", label: "getgenie.ai/pricing" },
      { href: "https://getgenie.ai/template/", label: "getgenie.ai/template" },
      { href: "https://getgenie.ai/template/content-rewriter/", label: "getgenie.ai/template/content-rewriter" },
    ],
  },
];

const starter = WP_PLANS.find((p) => p.monthly > 0)!;
const mainFrom = PAID_PLANS[0].price;

export type CompareRow = { label: string; cells: Record<ToolId, Cell> };

export const WP_COMPARE_ROWS: CompareRow[] = [
  {
    label: "Free use",
    cells: {
      draftly: { text: "Up to 5 posts, no card" },
      rankmath: { text: "Limited monthly AI use with the free plugin" },
      yoast: { text: "Free plugin has no AI writing" },
      aioseo: { text: "Free Lite plugin; AI runs on credits you buy" },
      getgenie: { text: "2,500 AI words a month" },
    },
  },
  {
    label: "Lowest paid price",
    cells: {
      draftly: [
        { text: `$${starter.monthly}/mo billed monthly` },
        { text: `$${starter.yearly / 12}/mo billed yearly ($${starter.yearly})` },
      ],
      rankmath: [{ text: "€5.99/mo billed yearly (€71.88)", note: 1 }, { text: "No monthly billing" }],
      yoast: [{ text: "$118.80 a year ($9.90/mo)", note: 1 }, { text: "No monthly billing" }],
      aioseo: [{ text: "$49.50 first year, then $99 a year", note: 1 }, { text: "No monthly billing" }],
      getgenie: [{ text: "$9.99/mo billed monthly" }, { text: "$6/mo billed yearly ($72)" }],
    },
  },
  {
    label: "Fixes the posts you already have, sentence by sentence",
    cells: {
      draftly: { mark: "yes", text: "Edits across the whole post" },
      rankmath: { mark: "partial", text: "Fixes failed SEO tests", note: 2 },
      yoast: { mark: "partial", text: "AI Optimize for 5 SEO checks", note: 2 },
      aioseo: { mark: "notListed" },
      getgenie: { mark: "partial", text: "Rewrites text you paste in" },
    },
  },
  {
    label: "Shows each edit before and after, for you to approve",
    cells: {
      draftly: { mark: "yes", text: "Untick any edit you don't want" },
      rankmath: { mark: "yes", text: "Approve, regenerate or reject" },
      yoast: { mark: "yes", text: "Apply or dismiss each suggestion" },
      aioseo: { mark: "partial", text: "Review AI text before inserting it" },
      getgenie: { mark: "notListed" },
    },
  },
  {
    label: "Saves changes as a WordPress revision with one-click revert",
    cells: {
      draftly: { mark: "yes", text: "Revert a post or a whole auto-mode run" },
      rankmath: { mark: "partial", text: "Past AI output kept in History", note: 3 },
      yoast: { mark: "notListed", note: 3 },
      aioseo: { mark: "notListed", note: 3 },
      getgenie: { mark: "notListed", note: 3 },
    },
  },
  {
    label: "Auto mode: fixes posts across your site on its own",
    cells: {
      draftly: { mark: "yes", text: "Opt-in, Safe or Full, posts only, paid plans" },
      rankmath: { mark: "notListed" },
      yoast: { mark: "no", text: "You approve every change" },
      aioseo: { mark: "notListed" },
      getgenie: { mark: "notListed" },
    },
  },
  {
    label: "Flags AI-sounding writing",
    cells: {
      draftly: { mark: "yes", text: "Human voice score, 0 to 100" },
      rankmath: { mark: "notListed" },
      yoast: { mark: "notListed" },
      aioseo: { mark: "notListed" },
      getgenie: { mark: "notListed" },
    },
  },
  {
    label: "Writes in your brand voice",
    cells: {
      draftly: { mark: "partial", text: "Uses the voice Draftly saved for your site", note: 4 },
      rankmath: { mark: "partial", text: "You pick a tone of voice" },
      yoast: { mark: "notListed" },
      aioseo: { mark: "notListed" },
      getgenie: { mark: "partial", text: "You pick a tone" },
    },
  },
  {
    label: "SEO titles and meta descriptions",
    cells: {
      draftly: [
        { mark: "partial", text: "One post: fills missing ones in auto mode", note: 5 },
        { mark: "soon", text: "Bulk:" },
      ],
      rankmath: [{ mark: "yes", text: "One post" }, { mark: "yes", text: "Bulk: 100 a month on Starter" }],
      yoast: [{ mark: "yes", text: "One post" }, { mark: "yes", text: "Bulk editor, you approve each" }],
      aioseo: [{ mark: "yes", text: "One post" }, { mark: "yes", text: "Bulk: AI Bulk Actions" }],
      getgenie: [{ mark: "yes", text: "One post: Meta Description template" }, { mark: "notListed", text: "Bulk:" }],
    },
  },
  {
    label: "Works with your SEO plugin",
    cells: {
      draftly: { mark: "yes", text: "Writes into Yoast SEO, Rank Math or AIOSEO" },
      rankmath: { mark: "isSeoPlugin" },
      yoast: { mark: "isSeoPlugin" },
      aioseo: { mark: "isSeoPlugin" },
      getgenie: { mark: "notListed" },
    },
  },
  {
    label: "Writes brand-new posts",
    cells: {
      draftly: { text: `On main Draftly plans, from $${mainFrom}/mo, not the plugin plans` },
      rankmath: { mark: "yes", text: "15 long-form articles a month on Starter" },
      yoast: { mark: "partial", text: "Content Planner builds a starter draft" },
      aioseo: { mark: "yes", text: "Blog drafts, paid with AI credits" },
      getgenie: { mark: "yes", text: "One-click blog posts" },
    },
  },
  {
    label: "How usage is counted",
    cells: {
      draftly: { text: "Posts a month (30 on Optimize), plus optional credit top-ups" },
      rankmath: { text: "Monthly limit for each AI feature" },
      yoast: { text: "Yearly license; AI limits not listed" },
      aioseo: { text: "AI credits (10,000 with Basic)" },
      getgenie: { text: "AI words a month (20,000 on Starter)" },
    },
  },
];

export const WP_COMPARE_NOTES: string[] = [
  "Prices before tax, as each vendor listed them. Rank Math AI, which includes Content AI, is sold yearly in euros and renews at €6.99 a month. Yoast SEO Premium is billed yearly. AIOSEO's first-year price is an introductory rate, and its plans are yearly.",
  "Rank Math's Fix with AI edits a post to pass 12 of Rank Math's SEO tests, such as keyword placement, content length and keyword density, and it also has a paragraph rewriter. Yoast AI Optimize covers five checks: keyphrase in introduction, keyphrase density, keyphrase distribution, paragraph length and sentence length.",
  "Anything you save in the WordPress editor goes into WordPress's own revision history, whichever plugin you use. \"Not listed\" means the vendor doesn't describe a revert for its AI changes. Rank Math keeps past AI output under Content AI > History so you can copy it back.",
  "Draftly uses the brand voice saved for your website in your Draftly account. It's learned from your site when you add the site in the Draftly app, and you can edit it there. A site first connected from the plugin starts with Draftly's default writing rules until you set a voice.",
  "Auto mode fills a missing SEO title or description from the post's title and opening lines, in the fields your SEO plugin uses. It doesn't rewrite meta you already have. AI-written meta for many posts at once is coming soon to the plugin plans.",
];
