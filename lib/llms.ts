import { BENCHMARK, BENCHMARK_DATE } from "@/lib/benchmark";
import {
  BLOG_TABLE,
  CHATGPT_TABLE,
  CONTENT_TABLE,
  COPY_TABLE,
  LEADERBOARD_TABLE,
  SEO_TABLE,
  tableToMarkdown,
} from "@/lib/benchmarkTables";
import { MCP_URL, TOOLS, toolPlans } from "@/lib/mcp";
import { PLANS } from "@/lib/pricing";
import { APP_URL, SITE_URL } from "@/lib/site";

// Builds /llms.txt and /llms-full.txt from the same data the pages render, so
// prices, tools and benchmark numbers match the site.

function plansTable(): string {
  const rows = PLANS.map((p) => `| ${p.name} | $${p.price}/month | ${p.posts} | ${p.credits} |`);
  return ["| Plan | Price | Posts | Credits |", "| --- | --- | --- | --- |", ...rows].join("\n");
}

function toolsTable(): string {
  const rows = TOOLS.map((t) => `| ${t.name} | ${t.does} | ${toolPlans(t.plan)} | ${t.data ? "Yes" : "No"} |`);
  return ["| Tool | What it returns | Plans | Uses a data call |", "| --- | --- | --- | --- |", ...rows].join("\n");
}

export function buildLlmsTxt(): string {
  return `# Draftly

> Draftly (${SITE_URL}) is an AI blog writer for small businesses: paste your website URL and it writes SEO-ready blog posts in your brand's voice, then publishes them to your CMS.

Draftly learns a brand's voice from its website, suggests topics from industry news, writes posts with a 0 to 100 human-voice score, and publishes to WordPress, Shopify, Ghost, Webflow, HubSpot and Squarespace. The default model is GPT 6 Luna, and Claude Sonnet 5.5 is the recommended premium model. A Preston Vawdrey SEO product.

## Plans

The first post is free. Paid plans add volume, a choice of 8 AI models and the MCP connector.

${plansTable()}

## SEO MCP Connector

Connector URL: ${MCP_URL}

Connect Draftly to Claude, ChatGPT, Cursor or Claude Code with this URL. Sign-in uses OAuth, and the connector is included on every paid plan. All ${TOOLS.length} tools are read-only. SEO data comes from DataForSEO.

${toolsTable()}

## Pages

- [Best AI for Writing (2026 Benchmark)](${SITE_URL}/best-ai-for-writing): ${BENCHMARK.length} AI models tested on blog writing and copywriting under the same rules, scored on formatting, human voice, SEO checks and cost per post.
- [AI Copywriter](${SITE_URL}/ai-copywriter): How Draftly writes a blog post from your URL, checks it against writing rules and publishes it, with a sample post and plan prices.
- [SEO Copywriting Rules](${SITE_URL}/seo-copywriting): The structure, voice and call-to-action rules Draftly checks on every post, with before and after examples from its benchmark.
- [AI SEO Agency or AI SEO Tool](${SITE_URL}/ai-seo-agency-vs-tool): What an agency does that a tool does not, what a tool like Draftly covers, and a table for choosing between them.
- [SEO MCP Server](${SITE_URL}/mcp): What an SEO MCP is, setup steps for each AI app, the tool list and data allowances by plan.
- [How to Use an SEO MCP Server With Claude and ChatGPT](${SITE_URL}/blog/seo-mcp-server): What an SEO MCP server does, Draftly's 10 read-only tools by plan, example requests and setup for Claude, ChatGPT, Claude Code and Cursor.
- [AEO and GEO for Small Business Blogs in 2026](${SITE_URL}/blog/the-death-of-keyword-how-aeo-aio-is-leaving-keywords-behind): How to get a small business blog cited by ChatGPT, Claude and Google AI Overviews, based on Google's guidance, the GEO research paper and Pew's 2025 click data.
- [Pricing](${SITE_URL}/pricing): Plans, credit costs and the AI models on each plan.
- [Blog](${SITE_URL}/blog): Notes on AI writing, SEO and AEO for small businesses.
- [App](${APP_URL}): Sign up and write the first post free.

## Optional

- [Full benchmark results](${SITE_URL}/llms-full.txt): Every results table from the benchmark in plain text.
`;
}

export function buildLlmsFullTxt(): string {
  const tables = [
    tableToMarkdown(LEADERBOARD_TABLE),
    tableToMarkdown(CONTENT_TABLE),
    tableToMarkdown(COPY_TABLE),
    tableToMarkdown(SEO_TABLE),
    tableToMarkdown(BLOG_TABLE),
    tableToMarkdown(CHATGPT_TABLE),
  ];
  return `# Draftly: Best AI for Writing Benchmark, Full Results

> Edition 1, tested ${BENCHMARK_DATE} by Preston Vawdrey at Draftly. Source: ${SITE_URL}/best-ai-for-writing

## Method

Each of the ${BENCHMARK.length} models wrote one blog post and one copy pack for three made-up businesses: a roofing company in Boise, a B2B software company that automates accounts payable, and a family dental practice in Phoenix. Every model got the same system prompt, the writing rules Draftly uses in production, and was called through the Vercel AI Gateway, so costs are what we were billed.

- Formatting: a script scored each blog post against 12 writing and SEO rules.
- Voice: two judge models (Gemini 3 Flash and GPT 5.4) scored each post with Draftly's 13-point human-voice audit, and the two scores were averaged.
- Overall: the mean of formatting and voice, out of 100.
- Copywriting: each copy pack had five landing page headlines, a hero section, a Google search ad, three email subject lines with preview text, and three benefit bullets. Packs were scored by code (hard limits, AI tells, use of brief facts) and by the same two judges on clarity, persuasion, voice and specificity.

Three briefs per model is a small sample, so treat a gap of two or three points as a tie. The test does not measure factual accuracy or real-world conversion.

## Results

${tables.map((t) => `### ${t}`).join("\n\n")}
`;
}
