// The Draftly MCP connector: its URL and the tools it exposes. Used by /mcp and
// /llms.txt so both list the same tools.
export const MCP_URL = "https://app.draftly.blog/mcp";

export type McpPlan = "Solopreneur" | "Growth" | "Autopilot";

export const TOOLS: { name: string; does: string; plan: McpPlan; data?: boolean }[] = [
  { name: "get_brand_context", does: "Your brand voice, tone sliders, audience, vocabulary and writing samples for each website.", plan: "Solopreneur" },
  { name: "list_posts", does: "Your recent Draftly posts with status, word count, SEO score and human-voice score.", plan: "Solopreneur" },
  { name: "get_post", does: "One post in full: body, meta title, meta description, slug and keywords.", plan: "Solopreneur" },
  { name: "find_topics", does: "Your topic pipeline, suggested topics and newsroom articles ranked by brand relevance.", plan: "Solopreneur" },
  { name: "research_keyword", does: "Search volume, difficulty, intent, cost per click, 12-month trend and related keywords.", plan: "Solopreneur", data: true },
  { name: "get_serp", does: "Google's live first page for a query, People Also Ask questions, related searches and SERP features.", plan: "Growth", data: true },
  { name: "get_domain_overview", does: "Organic keyword counts by ranking position and estimated traffic for any domain.", plan: "Growth", data: true },
  { name: "get_competitors", does: "The domains competing with a site for the same keywords.", plan: "Growth", data: true },
  { name: "get_keyword_gap", does: "Keywords a competitor ranks for that your site does not.", plan: "Autopilot", data: true },
  { name: "get_backlinks_summary", does: "Backlinks, referring domains, domain rank and spam score for any domain.", plan: "Autopilot", data: true },
];

/** Plain-language plan coverage for a tool. */
export function toolPlans(plan: McpPlan): string {
  return plan === "Solopreneur" ? "Every paid plan" : plan === "Growth" ? "Growth, Autopilot" : "Autopilot";
}
