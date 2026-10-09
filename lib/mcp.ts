// The Draftly MCP connector: its URL and the tools it exposes. Used by /mcp and
// /llms.txt so both list the same tools.
export const MCP_URL = "https://app.draftly.blog/mcp";

export type McpPlan = "Solopreneur" | "Growth" | "Autopilot";

/** `writes`: the tool checks, edits or saves (and may spend credits); every other tool only reads. No tool publishes. */
export const TOOLS: { name: string; does: string; plan: McpPlan; data?: boolean; writes?: boolean }[] = [
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
  { name: "get_writing_brief", does: "Everything your AI needs to write for your brand: voice, rules, facts, sources and links. Free.", plan: "Solopreneur", writes: true },
  { name: "check_draft", does: "Draftly checks your AI's draft and lists the sentences to fix: rule checks free, reader-quality check 3 credits.", plan: "Solopreneur", writes: true },
  { name: "save_draft", does: "Saves the post to Draftly as a draft; marked ready only if it passed its last check. Free. Never publishes.", plan: "Solopreneur", writes: true },
  { name: "check_copy", does: "Checks copy you already have against your Draftly writing rules plus a readability review. Returns SEO, human-voice and readability scores and the sentences to fix. 2 credits per 1,000 words (minimum 2).", plan: "Solopreneur", writes: true },
  { name: "edit_copy", does: "Fixes only the sentences that break a rule or read badly. Keeps numbers, quotes and links as written and never adds facts. Nothing is published. 2 credits per 1,000 words on the default model, more on premium models.", plan: "Solopreneur", writes: true },
];

export const READ_ONLY_TOOL_COUNT = TOOLS.filter((t) => !t.writes).length;

/** "Bring your own AI", in one plain line for /mcp and /llms.txt. */
export const BYO_AI_LINE =
  "Bring your own AI: your own Claude or ChatGPT can write the post on your existing subscription. Draftly briefs it, checks the draft and saves it to your account, and the checks cost a few credits.";

/** Plain-language plan coverage for a tool. */
export function toolPlans(plan: McpPlan): string {
  return plan === "Solopreneur" ? "Every paid plan" : plan === "Growth" ? "Growth, Autopilot" : "Autopilot";
}
