// Free AI visibility check: can AI assistants and Google read and cite this site?
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, UA, firewallOf, loadError, mapLimit, type FetchResult } from "../fetcher.ts";
import { parsePage, type PageInfo } from "../html.ts";
import { botVerdict, parseRobots, type Robots } from "../robots.ts";
import { isPostSitemap, looksLikePost, newestFeedDate, parseDate, parseSitemap, type SitemapEntry } from "../sitemap.ts";
import { summarize, type CheckItem, type ToolReport } from "../types.ts";

export const SEARCH_BOTS = [
  { token: "Googlebot", who: "Google Search and AI Overviews" },
  { token: "OAI-SearchBot", who: "ChatGPT search" },
  { token: "ChatGPT-User", who: "ChatGPT fetching a page a user asked about" },
  { token: "Claude-SearchBot", who: "Claude search" },
  { token: "Claude-User", who: "Claude fetching a page a user asked about" },
  { token: "PerplexityBot", who: "Perplexity search" },
];
export const TRAINING_BOTS = [
  { token: "GPTBot", who: "OpenAI model training" },
  { token: "ClaudeBot", who: "Anthropic model training" },
  { token: "Google-Extended", who: "Gemini training and grounding" },
  { token: "CCBot", who: "Common Crawl, a dataset many AI models learn from" },
];

const ORG_TYPES = /^(Organization|Corporation|LocalBusiness|OnlineBusiness|OnlineStore|Store|ProfessionalService|NGO|EducationalOrganization|MedicalBusiness|Restaurant|HomeAndConstructionBusiness|LegalService|FinancialService|AutomotiveBusiness|HealthAndBeautyBusiness|SportsOrganization|NewsMediaOrganization)$/;

/** robots.txt items: one for AI search bots, one for AI training bots. */
export function robotsItems(robots: Robots | null, robotsStatus: number, samplePaths: string[]): CheckItem[] {
  if (robotsStatus >= 500 || robotsStatus === 0) {
    return [
      {
        id: "robots",
        label: "robots.txt",
        status: "fail",
        detail: robotsStatus ? `robots.txt returned an error (HTTP ${robotsStatus}).` : "We couldn't load robots.txt.",
        why: "When robots.txt errors out, Google and most crawlers treat the whole site as off limits until it loads again.",
        fix: "Make /robots.txt return a 200 with your rules, or a 404 if you have none.",
      },
    ];
  }
  const r = robots ?? { groups: [], sitemaps: [] };
  const rows = (bots: typeof SEARCH_BOTS) =>
    bots.map((b) => {
      const v = botVerdict(r, b.token, samplePaths);
      const word = v.verdict === "allowed" ? "Allowed" : v.verdict === "blocked" ? "Blocked" : `Blocked from ${v.blockedPaths.join(", ")}`;
      return { bot: b, v, row: { text: `${b.token}: ${word}`, note: `${b.who}${v.named ? " (named in robots.txt)" : ""}` } };
    });

  const search = rows(SEARCH_BOTS);
  const training = rows(TRAINING_BOTS);
  const searchBlocked = search.filter((x) => x.v.verdict !== "allowed");
  const trainingBlocked = training.filter((x) => x.v.verdict !== "allowed");
  const none = robotsStatus === 404 || !robots;

  return [
    {
      id: "ai-search-bots",
      label: "AI search bots allowed in robots.txt",
      status: searchBlocked.some((x) => x.v.verdict === "blocked") ? "fail" : searchBlocked.length ? "warn" : "pass",
      detail: none
        ? "No robots.txt found, so every crawler is allowed."
        : searchBlocked.length
          ? `${searchBlocked.map((x) => x.bot.token).join(", ")} ${searchBlocked.length === 1 ? "is" : "are"} blocked from some or all of the site.`
          : "Google, ChatGPT, Claude and Perplexity search bots can all crawl the site.",
      why: "These bots fetch pages so an assistant can quote and link them in an answer. A blocked bot can't cite you.",
      fix: searchBlocked.length
        ? `Remove the Disallow rules that apply to ${searchBlocked.map((x) => x.bot.token).join(", ")} in /robots.txt, or add an "Allow: /" group for each one.`
        : undefined,
      list: search.map((x) => x.row),
    },
    {
      id: "ai-training-bots",
      label: "AI training bots in robots.txt",
      status: trainingBlocked.length ? "warn" : "pass",
      detail: trainingBlocked.length
        ? `${trainingBlocked.map((x) => x.bot.token).join(", ")} ${trainingBlocked.length === 1 ? "is" : "are"} blocked.`
        : "No training crawlers are blocked.",
      why: "Training bots decide whether your pages feed future AI models. Blocking them is a fair choice. It can mean newer models know less about your business.",
      fix: trainingBlocked.length
        ? "If you want AI models to learn about your business, allow these bots in /robots.txt. If you blocked them on purpose, you can leave this as is."
        : undefined,
      list: training.map((x) => x.row),
    },
  ];
}

type UaProbe = { name: string; res: FetchResult; words: number };

/** Compares what a browser, GPTBot and ClaudeBot get from the homepage. */
export function parityItem(probes: UaProbe[]): CheckItem {
  const [browser, ...bots] = probes;
  const rows = probes.map((p) => ({
    text: `${p.name}: ${p.res.status ? `HTTP ${p.res.status}` : p.res.error ?? "no response"}${firewallOf(p.res) ? ` (${firewallOf(p.res)} firewall)` : ""}`,
    note: p.res.status ? `${p.words.toLocaleString("en-US")} words of text, ${Math.round(p.res.bytes / 1024)} KB` : undefined,
  }));
  const blocked = bots.filter((b) => !b.res.ok && browser.res.ok);
  const thin = bots.filter((b) => b.res.ok && browser.words >= 50 && b.words < browser.words * 0.5);
  const base = {
    id: "bot-parity",
    label: "Same page for AI bots and browsers",
    why: "Some firewalls and bot shields serve AI crawlers an error or a challenge page. The assistant then sees nothing to cite.",
    list: rows,
  };
  if (blocked.length) {
    return {
      ...base,
      status: "warn",
      detail: `${blocked.map((b) => b.name).join(" and ")} got ${blocked.map((b) => (b.res.status ? `HTTP ${b.res.status}` : b.res.error)).join(" / ")} while a browser got HTTP ${browser.res.status}.`,
      fix: "Check your firewall, CDN or security plugin (Cloudflare, Wordfence, Sucuri) for AI-bot blocking. Some only let in bots from their real IP addresses, which our test can't use, so confirm in your firewall logs before changing anything.",
    };
  }
  if (thin.length) {
    return {
      ...base,
      status: "warn",
      detail: `${thin.map((b) => b.name).join(" and ")} got much less text than a browser (${thin.map((b) => b.words).join(" / ")} words vs ${browser.words}).`,
      fix: "Make sure the main content is in the HTML the server sends, not loaded later by JavaScript. Most AI crawlers don't run JavaScript.",
    };
  }
  return { ...base, status: "pass", detail: "GPTBot and ClaudeBot got the same page a browser got." };
}

export function llmsItem(res: FetchResult | null): CheckItem {
  const body = res?.ok && !res.wrongType ? res.body.trim() : "";
  const looksRight = body.length > 0 && !/^<(!doctype|html)/i.test(body);
  return {
    id: "llms-txt",
    label: "llms.txt",
    status: looksRight ? "pass" : "info",
    detail: looksRight ? `Found /llms.txt (${body.split("\n").length} lines).` : "No /llms.txt file.",
    why: "llms.txt is a short Markdown summary of your site for AI tools. It's optional, and no major assistant has said it uses it for ranking. It costs little to add.",
    fix: looksRight ? undefined : "Add /llms.txt: a title, a one-paragraph summary of what you do, and links to your key pages with one line each.",
  };
}

export function sitemapItem(found: { url: string; count: number; inRobots: boolean } | null): CheckItem {
  const why = "A sitemap lists every page you want found, with the date each one changed. Search engines use it to find new and updated posts.";
  if (!found) {
    return {
      id: "sitemap",
      label: "XML sitemap",
      status: "fail",
      detail: "We couldn't find a valid sitemap at /sitemap.xml, /sitemap_index.xml, /wp-sitemap.xml or in robots.txt.",
      why,
      fix: "Turn on your CMS or SEO plugin's sitemap (Yoast, Rank Math, Shopify and Squarespace make one for you), then add a \"Sitemap:\" line to robots.txt.",
    };
  }
  return {
    id: "sitemap",
    label: "XML sitemap",
    status: found.inRobots ? "pass" : "warn",
    detail: `Valid sitemap at ${found.url} with ${found.count.toLocaleString("en-US")} URLs${found.inRobots ? ", listed in robots.txt" : ""}.`,
    why,
    fix: found.inRobots ? undefined : `Add "Sitemap: ${found.url}" to your robots.txt so every crawler finds it.`,
  };
}

export function freshnessItem(newest: { date: Date; url?: string; source: string } | null, postCount: number, now = new Date()): CheckItem {
  const why = "AI assistants and Google lean toward pages that show recent activity. A blog that stopped a year ago tells them the site may be out of date.";
  if (!newest) {
    return {
      id: "blog-freshness",
      label: "Blog and newest post",
      status: "warn",
      detail: postCount ? `Found ${postCount} post-like URLs but no dates for them.` : "We couldn't find a blog in the sitemap or an RSS feed.",
      why,
      fix: postCount
        ? "Make sure your sitemap includes <lastmod> dates for posts."
        : "Publish helpful posts that answer your customers' questions, and make sure they're in your sitemap.",
    };
  }
  const days = Math.floor((now.getTime() - newest.date.getTime()) / 86_400_000);
  const when = newest.date.toISOString().slice(0, 10);
  return {
    id: "blog-freshness",
    label: "Blog and newest post",
    status: days <= 60 ? "pass" : days <= 180 ? "warn" : "fail",
    detail: `Newest post ${days <= 1 ? "is from the last day" : `was ${days} days ago`} (${when}, from the ${newest.source})${postCount ? `. ${postCount.toLocaleString("en-US")} posts found in the sitemap` : ""}.`,
    why,
    fix: days <= 60 ? undefined : "Publish on a steady schedule, and refresh your best older posts with current facts and dates.",
    list: newest.url ? [{ text: newest.url, href: newest.url }] : undefined,
  };
}

export function schemaItem(home: PageInfo): CheckItem {
  const types = home.jsonLdTypes;
  const hasOrg = types.some((t) => ORG_TYPES.test(t));
  const hasSite = types.includes("WebSite");
  const missing = [!hasOrg && "Organization", !hasSite && "WebSite"].filter(Boolean) as string[];
  return {
    id: "org-schema",
    label: "Organization and WebSite schema",
    status: missing.length === 0 ? "pass" : missing.length === 1 ? "warn" : "fail",
    detail:
      (types.length ? `Homepage structured data: ${types.slice(0, 8).join(", ")}.` : "No JSON-LD structured data on the homepage.") +
      (home.jsonLdErrors ? ` ${home.jsonLdErrors} JSON-LD block${home.jsonLdErrors > 1 ? "s" : ""} couldn't be parsed.` : ""),
    why: "Organization and WebSite schema tell machines your business name, logo, site and profiles in a format they don't have to guess at.",
    fix: missing.length ? `Add ${missing.join(" and ")} JSON-LD to your homepage. Most SEO plugins can add it from your site settings.` : undefined,
  };
}

export function indexingItem(home: PageInfo, xRobots: string): CheckItem {
  const header = xRobots.toLowerCase();
  const noindex = home.robotsTokens.includes("noindex") || home.robotsTokens.includes("none") || /noindex|none/.test(header);
  const noai = home.robotsTokens.filter((t) => t === "noai" || t === "noimageai" || t === "nosnippet");
  const headerNoai = /noai|noimageai|nosnippet/.test(header);
  const why = "noindex keeps a page out of Google and AI search. noai and nosnippet ask tools not to use or quote your text.";
  if (noindex) {
    return {
      id: "indexing",
      label: "noindex and noai signals",
      status: "fail",
      detail: `The homepage says noindex (${[home.robots, xRobots && `X-Robots-Tag: ${xRobots}`].filter(Boolean).join("; ")}).`,
      why,
      fix: "Remove noindex from the homepage. In WordPress, check Settings > Reading > \"Discourage search engines\".",
    };
  }
  if (noai.length || headerNoai) {
    return {
      id: "indexing",
      label: "noindex and noai signals",
      status: "warn",
      detail: `The homepage asks AI tools to hold back (${[home.robots, xRobots && `X-Robots-Tag: ${xRobots}`].filter(Boolean).join("; ")}).`,
      why,
      fix: "If you want assistants to quote you, remove noai and nosnippet from the robots meta tag and X-Robots-Tag header.",
    };
  }
  return { id: "indexing", label: "noindex and noai signals", status: "pass", detail: "No noindex, noai or nosnippet on the homepage.", why };
}

export function titleDescItem(home: PageInfo): CheckItem {
  const t = home.title;
  const d = home.metaDescription ?? "";
  const problems: string[] = [];
  if (!t) problems.push("no title tag");
  else if (t.length < 15) problems.push(`a very short title (${t.length} characters)`);
  if (!d) problems.push("no meta description");
  else if (d.length < 50) problems.push(`a very short meta description (${d.length} characters)`);
  return {
    id: "title-description",
    label: "Homepage title and description",
    status: !t ? "fail" : problems.length ? "warn" : "pass",
    detail: problems.length ? `The homepage has ${problems.join(" and ")}.` : `Title: "${t}". Description: "${d.length > 160 ? `${d.slice(0, 157)}...` : d}"`,
    why: "The title and description are often the first words a search engine or assistant uses to describe your business.",
    fix: problems.length ? "Write a title that says what you do and where (50 to 60 characters), and a description that answers who it's for (120 to 160 characters)." : undefined,
  };
}

const wordsOf = (r: FetchResult) => (r.ok && r.body ? parsePage(r.body, r.finalUrl).wordCount : 0);

export async function runAiVisibility(input: string): Promise<ToolReport> {
  const start = checkUrl(input, { allowBare: true });
  const scan = new Scan({ budgetMs: 40_000, maxFetches: 24 });
  const notes: string[] = [];

  const homeRes = await scan.fetch(start.origin + "/", { ua: UA.browser, expect: "html" });
  if (!homeRes.ok || homeRes.wrongType) {
    throw new ToolError(loadError(homeRes, "homepage"), 422);
  }
  const origin = new URL(homeRes.finalUrl).origin;
  const home = parsePage(homeRes.body, homeRes.finalUrl);

  const [robotsRes, llmsRes, gptRes, claudeRes] = await Promise.all([
    scan.fetch(`${origin}/robots.txt`, { expect: "text", maxBytes: 500 * 1024 }),
    scan.fetch(`${origin}/llms.txt`, { expect: "any", maxBytes: 200 * 1024 }),
    scan.fetch(homeRes.finalUrl, { ua: UA.gptbot, expect: "html" }),
    scan.fetch(homeRes.finalUrl, { ua: UA.claudebot, expect: "html" }),
  ]);
  const robots = robotsRes.ok && !robotsRes.wrongType ? parseRobots(robotsRes.body) : null;

  // Sitemap: robots.txt entries first, then the usual locations.
  const sameSite = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "") === new URL(origin).hostname.replace(/^www\./, "");
    } catch {
      return false;
    }
  };
  const fromRobots = (robots?.sitemaps ?? []).filter(sameSite).slice(0, 3);
  const candidates = [...new Set([...fromRobots, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/wp-sitemap.xml`])];
  let sitemapFound: { url: string; count: number; inRobots: boolean } | null = null;
  let entries: SitemapEntry[] = [];
  for (const c of candidates) {
    if (!scan.canFetch()) break;
    const res = await scan.fetch(c, { expect: "xml", maxBytes: 2 * 1024 * 1024 });
    if (!res.ok || res.wrongType) continue;
    const sm = parseSitemap(res.body);
    if (sm.kind === "invalid") continue;
    if (sm.kind === "index") {
      const children = [...sm.entries].sort((a, b) => Number(isPostSitemap(b.loc)) - Number(isPostSitemap(a.loc))).filter((e) => sameSite(e.loc)).slice(0, 3);
      const kids = await mapLimit(children, 3, (e) => scan.fetch(e.loc, { expect: "xml" }));
      for (const k of kids) if (k.ok && !k.wrongType) entries.push(...parseSitemap(k.body).entries.filter((e) => !!e));
      sitemapFound = { url: res.finalUrl, count: entries.length, inRobots: fromRobots.length > 0 };
      if (sm.entries.length > 3) notes.push(`Your sitemap index lists ${sm.entries.length} sitemaps. We read the ${children.length} most likely to hold posts.`);
    } else {
      entries = sm.entries;
      sitemapFound = { url: res.finalUrl, count: entries.length, inRobots: fromRobots.length > 0 };
    }
    break;
  }

  // Newest post: sitemap lastmod on post-like URLs, else an RSS/Atom feed.
  const posts = entries.filter((e) => looksLikePost(e.loc));
  let newest: { date: Date; url?: string; source: string } | null = null;
  for (const p of posts) {
    const d = parseDate(p.lastmod);
    if (d && (!newest || d > newest.date)) newest = { date: d, url: p.loc, source: "sitemap" };
  }
  if (!newest) {
    const feeds = [...new Set([...home.feedLinks.filter(sameSite), `${origin}/feed`, `${origin}/rss.xml`, `${origin}/feed.xml`])].slice(0, 3);
    for (const f of feeds) {
      if (!scan.canFetch()) break;
      const res = await scan.fetch(f, { expect: "xml", maxBytes: 1024 * 1024 });
      if (!res.ok || res.wrongType) continue;
      const fd = newestFeedDate(res.body);
      const d = parseDate(fd.date);
      if (d) {
        newest = { date: d, source: "RSS feed" };
        break;
      }
    }
  }

  const samplePaths = [...new Set(posts.slice(0, 3).map((p) => new URL(p.loc).pathname))];
  const items: CheckItem[] = [
    ...robotsItems(robots, robotsRes.status === 0 ? 0 : robotsRes.ok ? 200 : robotsRes.status, samplePaths),
    parityItem([
      { name: "Browser", res: homeRes, words: home.wordCount },
      { name: "GPTBot", res: gptRes, words: wordsOf(gptRes) },
      { name: "ClaudeBot", res: claudeRes, words: wordsOf(claudeRes) },
    ]),
    indexingItem(home, homeRes.headers["x-robots-tag"] ?? ""),
    titleDescItem(home),
    schemaItem(home),
    sitemapItem(sitemapFound),
    freshnessItem(newest, posts.length),
    llmsItem(llmsRes),
  ];
  if (robotsRes.status >= 400 && robotsRes.status < 500 && robotsRes.status !== 404) notes.push(`robots.txt returned HTTP ${robotsRes.status}; crawlers treat that like no robots.txt.`);
  return { tool: "ai-visibility", checked: homeRes.finalUrl, items, summary: summarize(items), notes };
}
