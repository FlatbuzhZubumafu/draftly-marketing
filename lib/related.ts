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
    title: "Best AI for writing: 14 models tested",
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
];

/** Live but thin or off-strategy posts: kept for readers, marked noindex, left out of the sitemap. */
export const NOINDEX_POST_SLUGS = new Set<string>([]);

/** The `count` pillars most related to `text` (keyword hits), never `exclude`; ties keep PILLARS order. */
export function relatedPillars(text: string, exclude?: string, count = 3): Pillar[] {
  const haystack = text.toLowerCase();
  return PILLARS.filter((p) => p.href !== exclude)
    .map((p, i) => ({ p, i, score: p.keywords.reduce((n, k) => n + (haystack.split(k).length - 1), 0) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p);
}
