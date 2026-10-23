import { BENCHMARK, BENCHMARK_DATE, BENCHMARK_UPDATED } from "@/lib/benchmark";
import {
  BLOG_TABLE,
  CHATGPT_TABLE,
  CONTENT_TABLE,
  COPY_TABLE,
  LEADERBOARD_TABLE,
  SEO_TABLE,
  tableToMarkdown,
} from "@/lib/benchmarkTables";
import { BYO_AI_LINE, FREE_PLAN_LINE, MCP_URL, READ_ONLY_TOOL_COUNT, TOOLS, toolPlans } from "@/lib/mcp";
import { PLANS, TEAM_NOTE } from "@/lib/pricing";
import { APP_MODELS, APP_MODEL_COUNT } from "@/lib/app-models";
import { APP_URL, SITE_URL } from "@/lib/site";
import { WP_COMPARE_NOTES, WP_COMPARE_ROWS, WP_COMPARE_TOOLS, WP_COMPARED_ON, type Cell } from "@/lib/wordpress-compare";
import { WP_FEATURES, WP_PLANS, WP_PLUGIN_VERSION, WP_TOP_UPS } from "@/lib/wordpress-plugin";
import { FREE_TOOLS, TOOLS_HUB } from "@/lib/free-tools";
import { INDUSTRIES, INDUSTRIES_HUB, industryPath, topicCount } from "@/lib/industries";
import { FEATURES, FEATURES_HUB, featurePath } from "@/lib/features";

// Builds /llms.txt and /llms-full.txt from the same data the pages render, so
// prices, tools and benchmark numbers match the site.

function plansTable(): string {
  const rows = PLANS.map((p) => `| ${p.name} | $${p.price}/month | ${p.posts} | ${p.credits} | ${p.seats ?? "Unlimited"} |`);
  return ["| Plan | Price | Posts | Credits | Team members |", "| --- | --- | --- | --- | --- |", ...rows, "", TEAM_NOTE].join("\n");
}

function modelsTable(): string {
  const rows = APP_MODELS.map((m) => `| ${m.name}${m.note ? ` (${m.note})` : ""} | ${m.credits} |`);
  return ["| Model | Credits per blog post |", "| --- | --- |", ...rows].join("\n");
}

function toolsTable(): string {
  const rows = TOOLS.map((t) => `| ${t.name} | ${t.does} | ${toolPlans(t.plan)} | ${t.data ? "Yes" : "No"} |`);
  return ["| Tool | What it returns | Plans | Uses a data call |", "| --- | --- | --- | --- |", ...rows].join("\n");
}

function wpPlansTable(): string {
  const header = `| Plan | Price | ${WP_FEATURES.map((f) => (f.status === "soon" ? `${f.label} (coming soon)` : f.label)).join(" | ")} |`;
  const rows = WP_PLANS.map((p) => {
    const price = p.monthly === 0 ? "$0" : `$${p.monthly}/month or $${p.yearly}/year`;
    return `| ${p.name} | ${price} | ${p.values.map((v) => v ?? "Not included").join(" | ")} |`;
  });
  return [header, `| ${Array(WP_FEATURES.length + 2).fill("---").join(" | ")} |`, ...rows].join("\n");
}

function compareCell(cell: Cell): string {
  const words: Record<string, string> = { yes: "Yes", no: "No", partial: "Partial", notListed: "Not listed", soon: "Coming soon", isSeoPlugin: "Is the SEO plugin" };
  const lines = Array.isArray(cell) ? cell : [cell];
  return lines
    .map((l) => {
      const mark = l.mark ? words[l.mark] : "";
      const text = l.mark === "soon" || l.mark === "notListed" ? [l.text, mark] : [mark, l.text];
      return text.filter(Boolean).join(l.mark === "soon" || l.mark === "notListed" ? " " : ": ") + (l.note ? ` [${l.note}]` : "");
    })
    .join("; ");
}

/** The /wordpress-ai-plugin comparison as markdown, with its notes and sources. */
function wpCompareTable(): string {
  const header = `| Feature | ${WP_COMPARE_TOOLS.map((t) => `${t.name} (${t.product})`).join(" | ")} |`;
  const sep = `| ${Array(WP_COMPARE_TOOLS.length + 1).fill("---").join(" | ")} |`;
  const rows = WP_COMPARE_ROWS.map((r) => `| ${r.label} | ${WP_COMPARE_TOOLS.map((t) => compareCell(r.cells[t.id])).join(" | ")} |`);
  const notes = WP_COMPARE_NOTES.map((n, i) => `[${i + 1}] ${n}`);
  const sources = WP_COMPARE_TOOLS.filter((t) => t.sources.length).map((t) => `${t.name}: ${t.sources.map((s) => s.href).join(", ")}`);
  return [header, sep, ...rows, "", ...notes, "", `Sources: ${sources.join("; ")}.`].join("\n");
}

export function buildLlmsTxt(): string {
  return `# Draftly

> Draftly (${SITE_URL}) is an AI blog writer for small businesses: paste your website URL and it writes SEO-ready blog posts in your brand's voice, then publishes them to your CMS.

Draftly learns a brand's voice from its website, suggests topics from industry news, writes posts with a 0 to 100 human-voice score, and publishes to WordPress, Shopify, Ghost, Webflow, HubSpot and Squarespace. The default model on paid plans is Claude Sonnet 5.5; in a 20-brief test, 95% of Claude Sonnet 5.5 posts passed Draftly's reader-quality bar after its quality check. Free accounts write with Claude Haiku 5.5. GPT 6 Luna, Claude Haiku 5.5 and DeepSeek V4.1 Flash are 50-credit budget options on paid plans. A Preston Vawdrey SEO product.

## Plans

The first post is free and comes with a thumbnail. Paid plans add volume, a choice of ${APP_MODEL_COUNT} AI models, AI images inside each post and live SEO data in the MCP connector. Draftly is available to businesses in the United States only.

${plansTable()}

## AI Models

Claude Sonnet 5.5 is the default writer on paid plans. Free accounts, including the free first post, write with Claude Haiku 5.5. Paid plans pick the model for each post from this list.

${modelsTable()}

## SEO MCP Connector

Connector URL: ${MCP_URL}

Connect Draftly to Claude, ChatGPT, Cursor or Claude Code with this URL. Sign-in uses OAuth, and every plan can connect, Free included. It has ${TOOLS.length} tools: ${READ_ONLY_TOOL_COUNT} only read data, and ${TOOLS.length - READ_ONLY_TOOL_COUNT} brief, check, edit or save drafts. No tool publishes. SEO data comes from DataForSEO.

${BYO_AI_LINE}

${FREE_PLAN_LINE}

${toolsTable()}

## WordPress Plugin

Draftly's AI plugin for WordPress (version ${WP_PLUGIN_VERSION}, in beta, coming to the WordPress plugin directory) checks existing posts for human voice and readability, suggests sentence-level edits in the site's brand voice, and saves the edits a user approves as a WordPress revision that Revert can undo. By default nothing changes without approval. On paid plans an administrator can turn on auto mode, which applies edits to published posts by itself at Safe or Full level, each as a revision that can be reverted. Auto mode also fills a missing SEO title or description in Yoast SEO, Rank Math or All in One SEO. The plugin shows no SEO score. Free accounts can check and optimize up to 5 posts. Its plans are billed by Draftly and listed only at ${SITE_URL}/wordpress-ai-plugin. Available to businesses in the United States only. Features marked "coming soon" are in the plan but not in the plugin yet; De-AI already runs in the Draftly web editor.

${wpPlansTable()}

${WP_TOP_UPS} Writing new posts, topic ideas, AI images and autopilot are on the main plans above.

### Compared with other WordPress AI plugins (checked ${WP_COMPARED_ON})

${wpCompareTable()}

## Features

Every live feature has its own page, listed at ${SITE_URL}${FEATURES_HUB.path}.

${FEATURES.map((f) => `- [${f.name}](${SITE_URL}${featurePath(f)}): ${f.summary} Plans: ${f.plans}`).join("\n")}

## Free SEO Tools

Free, no sign-up, at ${SITE_URL}${TOOLS_HUB.path}. The four checkers fetch the pages you enter and run fixed rules on them; no AI model reads the pages. The AI content detector (Draftly's own statistical detector, no AI model) and the FAQ schema generator run entirely in the browser; the detector's URL mode only fetches the article text. The content brief and blog ideas generators make one AI call (GPT 6 Luna) from what you enter and, optionally, your homepage and sitemap. Inputs and results are not stored.

${FREE_TOOLS.map((t) => `- [${t.name}](${SITE_URL}${t.path}): ${t.intro.split(". ")[0]}. ${t.kind === "generator" ? "Gives you" : "Checks"}: ${t.checks.map((c) => c.label).join(", ")}.`).join("\n")}

## Pages

- [Best AI for Writing (2026 Benchmark)](${SITE_URL}/best-ai-for-writing): ${BENCHMARK.length} AI models tested on blog writing and copywriting under the same rules, scored on formatting, human voice, SEO checks and cost per post.
- [AI Copywriter](${SITE_URL}/ai-copywriter): How Draftly writes a blog post from your URL, checks it against writing rules and publishes it, with a sample post and plan prices.
- [SEO Copywriting Rules](${SITE_URL}/seo-copywriting): The structure, voice and call-to-action rules Draftly checks on every post, with before and after examples from its benchmark.
- [AI SEO Agency or AI SEO Tool](${SITE_URL}/ai-seo-agency-vs-tool): What an agency does that a tool does not, what a tool like Draftly covers, and a table for choosing between them.
- [Jasper vs Draftly](${SITE_URL}/jasper-vs-draftly): Jasper AI and Draftly compared on pricing, free options, SEO blog posts, brand voice, AI-sounding writing, WordPress publishing and the Claude and ChatGPT connector, with Jasper facts sourced from jasper.ai and where Jasper is the better pick.
- [Draftly for Teams](${SITE_URL}/for-teams): Draftly for marketing teams and agencies. Team members per plan (${PLANS.map((p) => `${p.name} ${p.seats ?? "unlimited"}`).join(", ")}) with no per-seat price and shared credits; the owner handles billing and websites; agencies add client websites for $29 a month each, each with its own brand voice and 10,000 credits a month. No approval workflow, per-member permissions or single sign-on.
- [Blog Writing Service or AI](${SITE_URL}/blog-writing-service): What a blog post costs from a freelance writer (25 to 45 cents a word, Editorial Freelancers Association 2026 rate chart), a content agency and Draftly, what each one delivers, and when to hire a human writer instead.
- [Claude vs ChatGPT for Writing](${SITE_URL}/claude-vs-chatgpt-for-writing): Claude Opus 5.5, Claude Sonnet 5.5, Claude Sonnet 4.6 and Claude Haiku 4.5 against GPT 5.5, GPT 5.4 and GPT 5.4 Mini on the same blog posts and copy, from Draftly's Edition 1 benchmark: overall, voice, SEO checks, AI habits, cost per post and which to pick.
- [Writesonic Alternatives](${SITE_URL}/writesonic-alternatives): What Writesonic sells now (AI search visibility plans from $79 a month billed yearly, with 15 to 50 AI articles) and five alternatives for SEO blog posts: Draftly, Koala, SEOWriting.ai, Jasper and Copy.ai, with prices from each company's pricing page as of October 2026.
- [Writesonic vs Draftly](${SITE_URL}/writesonic-vs-draftly): Writesonic's self-serve plans (Starter $79, Basic $199 and Growth $399 a month billed yearly, with 15, 25 and 50 AI articles) against Draftly's plans: price per post, brand voices, people included, free trial, WordPress publishing, AI visibility tracking and site audits, plus Writesonic vs Jasper and when Writesonic is the better pick. Writesonic facts from writesonic.com as of October 2026.
- [Copy.ai Alternatives](${SITE_URL}/copy-ai-alternatives): What Copy.ai sells now (a go-to-market platform: Chat at $29 a month for 5 seats, then workflow plans from $1,000 a month billed yearly, no CMS publishing listed) and five alternatives: Draftly for SEO blog posts, Jasper for marketing copy, Writesonic for AI visibility tracking, Koala for bulk articles and Claude for chat, plus Jasper vs Copy.ai. Prices from each company's own pages as of October 2026.
- [Koala AI Review](${SITE_URL}/koala-ai-review): Koala AI (KoalaWriter) plans from $25 a month for 45,000 words on GPT-6 Luna, with 2x and 3x word multipliers for Claude Sonnet 5 and Opus 5.5, features by plan, publishing to WordPress, Shopify, Webflow and Ghost, and Koala vs Draftly. From koala.sh as of October 2026.
- [Arvow Review](${SITE_URL}/arvow-review): Arvow, formerly Journalist AI: Solo $69 a month or $39 billed yearly for 1,000 credits (15 credits an article), AutoBlog, 150+ languages, the backlink exchange and Google's link spam policy, AI visibility tracking, and Arvow vs Draftly. From arvow.com as of October 2026.
- [Best AI for SEO](${SITE_URL}/best-ai-for-seo): AI tools picked by SEO job, with prices from each company's own page as of October 2026: Ahrefs or Semrush for keyword research, Draftly for writing and publishing blog posts (Koala and SEOWriting.ai as cheaper volume options), Surfer or Clearscope for optimizing pages, AI visibility tracking in Semrush, Clearscope, Surfer and Ahrefs, Google Search Console and Ahrefs Free for technical SEO, and which AI models wrote the best SEO content in Draftly's benchmark.
- [Blog Ideas by Industry](${SITE_URL}${INDUSTRIES_HUB.path}): ${INDUSTRIES_HUB.description}
${INDUSTRIES.map((i) => `  - [${i.title}](${SITE_URL}${industryPath(i)}): ${topicCount(i)} topics. ${i.description}`).join("\n")}
- [SEO MCP Server](${SITE_URL}/mcp): What an SEO MCP is, setup steps for each AI app, the tool list and data allowances by plan.
- [How to Use an SEO MCP Server With Claude and ChatGPT](${SITE_URL}/blog/seo-mcp-server): What an SEO MCP server does, Draftly's ${TOOLS.length} tools by plan (${READ_ONLY_TOOL_COUNT} read-only, plus tools that brief, check, edit and save drafts; none publishes), example requests and setup for Claude, ChatGPT, Claude Code and Cursor.
- [AEO and GEO for Small Business Blogs in 2026](${SITE_URL}/blog/the-death-of-keyword-how-aeo-aio-is-leaving-keywords-behind): How to get a small business blog cited by ChatGPT, Claude and Google AI Overviews, based on Google's guidance, the GEO research paper and Pew's 2025 click data.
- [WordPress AI Plugin](${SITE_URL}/wordpress-ai-plugin): The Draftly plugin for WordPress: check, optimize, approve as a revision and revert existing posts, meta for Yoast SEO, Rank Math and AIOSEO, plugin plans and a feature and price comparison with Rank Math Content AI, Yoast SEO Premium, All in One SEO and GetGenie.
- [Pricing](${SITE_URL}/pricing): Plans, credit costs and the AI models on each plan.
- [Blog](${SITE_URL}/blog): Notes on AI writing, SEO and AEO for small businesses.
- [About](${SITE_URL}/about): Who Preston Vawdrey is, why he built Draftly, the company behind it (Meta-Marketing LLC, Utah, US only) and how posts on the blog are written.
- [Contact](${SITE_URL}/contact): Email preston@draftly.blog for support, billing and privacy requests; text line and mailing address.
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

> Edition 1, tested ${BENCHMARK_DATE} (new models added ${BENCHMARK_UPDATED}) by Preston Vawdrey at Draftly. Source: ${SITE_URL}/best-ai-for-writing

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
