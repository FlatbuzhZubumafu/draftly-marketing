import { BENCHMARK } from "@/lib/benchmark";

// Internal-linking map for the marketing site: the pillar pages every related page
// should point to, and posts that stay live but out of search.

export type Pillar = { href: string; title: string; blurb: string; keywords: string[] };

export const PILLARS: Pillar[] = [
  {
    href: "/ai-copywriter",
    title: "The AI copywriter for small-business blogs",
    blurb: "How Draftly goes from your URL to a published post in your brand voice.",
    keywords: ["copywriter", "copywriting", "brand voice", "small business", "blog post", "write"],
  },
  {
    href: "/seo-copywriting",
    title: "SEO copywriting rules we check on every post",
    blurb: "Structure, voice and call-to-action rules, with before and after examples.",
    keywords: ["seo", "keyword", "meta", "headings", "rules", "ranking", "search"],
  },
  {
    href: "/best-ai-for-writing",
    title: `Best AI for writing: ${BENCHMARK.length} models tested`,
    blurb: "Which models write the most human-sounding posts, and what each one costs.",
    keywords: ["model", "chatgpt", "claude", "gpt", "llm", "ai writing", "benchmark"],
  },
  {
    href: "/mcp",
    title: "SEO MCP server for Claude and ChatGPT",
    blurb: "Bring your brand voice and live keyword data into the AI app you already use.",
    keywords: ["mcp", "claude", "chatgpt", "cursor", "assistant", "connector", "aeo", "ai search"],
  },
  {
    href: "/ai-seo-agency-vs-tool",
    title: "AI SEO agency or AI SEO tool?",
    blurb: "What each one does, what it costs, and when a small business needs both.",
    keywords: ["agency", "seo agency", "hire", "cost", "outsourc", "strategy"],
  },
  {
    href: "/jasper-vs-draftly",
    title: "Jasper vs Draftly",
    blurb: "Both tools tested on the same topics for four real businesses, plus pricing, brand voice and WordPress publishing.",
    keywords: ["jasper", "alternative", "compare", "versus", " vs ", "pricing"],
  },
];

/** Every guide-style page, for the /blog hub and "Keep reading": the pillars plus the WordPress plugin page. */
export const GUIDES: Pillar[] = [
  ...PILLARS,
  {
    href: "/wordpress-ai-plugin",
    title: "The AI plugin for WordPress",
    blurb: "Checks the posts you already have, suggests edits in your voice and saves the ones you approve as revisions.",
    keywords: ["wordpress", "plugin", "yoast", "rank math", "aioseo", "revision"],
  },
  {
    href: "/blog-writing-service",
    title: "Blog writing service or AI: what a post costs",
    blurb: "Freelancer, agency and Draftly prices per post, and when a human writer is still the better hire.",
    keywords: ["writing service", "freelance", "outsourc", "hire a writer", "cost per post", "agency"],
  },
  {
    href: "/claude-vs-chatgpt-for-writing",
    title: "Claude vs ChatGPT for writing",
    blurb: "Four Claude and three GPT models scored on the same blog posts and copy, with costs and which to pick.",
    keywords: ["claude", "chatgpt", "gpt", "model", "llm", "anthropic", "openai"],
  },
  {
    href: "/writesonic-alternatives",
    title: "Writesonic alternatives for SEO blog posts",
    blurb: "Draftly, Koala, SEOWriting.ai, Jasper and Copy.ai compared on price, posts included and publishing.",
    keywords: ["writesonic", "alternative", "koala", "seowriting", "copy.ai", "compare"],
  },
  {
    href: "/copy-ai-alternatives",
    title: "Copy.ai alternatives for blog posts and marketing",
    blurb: "Draftly, Jasper, Writesonic, Koala and Claude compared on price and publishing, plus Jasper vs Copy.ai.",
    keywords: ["copy.ai", "copy ai", "alternative", "jasper", "compare", "marketing copy"],
  },
  {
    href: "/koala-ai-review",
    title: "Koala AI review",
    blurb: "KoalaWriter's plans priced by the word, how far the words go on each model, and when Draftly fits better.",
    keywords: ["koala", "koalawriter", "review", "affiliate", "bulk articles"],
  },
  {
    href: "/arvow-review",
    title: "Arvow review",
    blurb: "Arvow, formerly Journalist AI: plans, AutoBlog, the backlink exchange and when Draftly fits better.",
    keywords: ["arvow", "journalist ai", "autoblog", "review", "backlinks"],
  },
  {
    href: "/best-ai-for-seo",
    title: "Best AI for SEO, picked by job",
    blurb: "The AI tools for keyword research, blog writing, optimization, AI visibility and technical SEO, with prices.",
    keywords: ["seo tool", "ahrefs", "semrush", "surfer", "clearscope", "keyword research", "ai seo"],
  },
  {
    href: "/blog-ideas",
    title: "Blog ideas by industry",
    blurb: "Topics for plumbers, HVAC companies, roofers, dentists, real estate agents, law firms, financial advisors and CPA firms, with the rules for each.",
    keywords: ["blog ideas", "blog topics", "plumb", "hvac", "roof", "dental", "dentist", "real estate", "law firm", "lawyer", "attorney", "financial advisor", "accounting", "cpa", "industry"],
  },
  {
    href: "/for-teams",
    title: "Draftly for teams and agencies",
    blurb: "Team members on each plan, client websites at $29 a month, and one brand voice for everyone who writes.",
    keywords: ["team", "agency", "agencies", "client", "seats", "marketing team"],
  },
];

/** Card label for a guide: what kind of page it is. */
export function guideTag(href: string): string {
  return ({
    "/best-ai-for-writing": "Benchmark",
    "/jasper-vs-draftly": "Comparison",
    "/ai-seo-agency-vs-tool": "Comparison",
    "/wordpress-ai-plugin": "Plugin",
    "/blog-writing-service": "Comparison",
    "/for-teams": "Teams",
    "/claude-vs-chatgpt-for-writing": "Benchmark",
    "/writesonic-alternatives": "Comparison",
    "/copy-ai-alternatives": "Comparison",
    "/koala-ai-review": "Review",
    "/arvow-review": "Review",
    "/best-ai-for-seo": "Guide",
    "/mcp": "Guide",
    "/blog-ideas": "Ideas",
  } as Record<string, string>)[href] ?? "Guide";
}

/** Live but thin or off-strategy posts: kept for readers, marked noindex, left out of the sitemap. */
export const NOINDEX_POST_SLUGS = new Set<string>([]);

/** The `count` pillars most related to `text` (keyword hits), never `exclude`; ties keep list order. */
export function relatedPillars(text: string, exclude?: string, count = 3, from: Pillar[] = PILLARS): Pillar[] {
  const haystack = text.toLowerCase();
  return from.filter((p) => p.href !== exclude)
    .map((p, i) => ({ p, i, score: p.keywords.reduce((n, k) => n + (haystack.split(k).length - 1), 0) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p);
}
