// Free content refresh check: reads the sitemap, lists posts oldest first, flags
// posts not updated in 12+ months and posts whose titles overlap enough to compete.
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, firewallOf, loadError, mapLimit } from "../fetcher.ts";
import { parsePage } from "../html.ts";
import { parseRobots } from "../robots.ts";
import { isPostSitemap, looksLikePost, parseDate, parseSitemap, type SitemapEntry } from "../sitemap.ts";
import { summarize, type CheckItem, type ToolReport } from "../types.ts";

export const MAX_URLS = 200;
export const MAX_TITLE_FETCHES = 40;
const STALE_DAYS = 365;

const STOP = new Set(
  "a an and are as at be best by can do does for from get guide how i in is it its my need of often on or our should the this to top vs what when where which who why will with you your about much many make use using new free ultimate complete tips ways things".split(" "),
);

/** Lower-case content words with light stemming, for overlap scoring. */
export function titleTokens(title: string): Set<string> {
  const words = title
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w));
  return new Set(words.map((w) => w.replace(/(ies)$/, "y").replace(/(ing|ed|es|s)$/, "") || w));
}

/** Overlap between two titles: shared tokens over all distinct tokens (Jaccard, 0 to 1). */
export function overlap(a: Set<string>, b: Set<string>): number {
  if (a.size < 2 || b.size < 2) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

/** Strips a trailing " | Brand" or " - Brand" from a page title. */
export function stripSiteName(title: string): string {
  const parts = title.split(/\s+[|\-–—·•]\s+/);
  if (parts.length > 1 && parts[parts.length - 1].length < parts.slice(0, -1).join(" ").length) return parts.slice(0, -1).join(" - ").trim();
  return title.trim();
}

/** A readable title from a URL slug, for posts we didn't fetch. */
export function slugTitle(url: string): string {
  const seg = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
  return decodeURIComponent(seg).replace(/\.[a-z]+$/, "").replace(/[-_]+/g, " ").trim();
}

export type Post = { url: string; lastmod: Date | null; title: string; titleSource: "page" | "slug" };
export type DupPair = { a: Post; b: Post; score: number };

export function findDuplicates(posts: Post[], threshold = 0.6): DupPair[] {
  const toks = posts.map((p) => titleTokens(p.title));
  const pairs: DupPair[] = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const score = overlap(toks[i], toks[j]);
      // Slug-only titles are noisier, so they need a higher score.
      const need = posts[i].titleSource === "slug" || posts[j].titleSource === "slug" ? Math.max(threshold, 0.75) : threshold;
      if (score >= need && Math.min(toks[i].size, toks[j].size) >= 2) pairs.push({ a: posts[i], b: posts[j], score });
    }
  }
  return pairs.sort((x, y) => y.score - x.score);
}

/** Oldest first; posts with no date go last so they don't crowd out real dates. */
const byDateUndatedLast = (a: { lastmod: Date | null }, b: { lastmod: Date | null }) =>
  (a.lastmod?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.lastmod?.getTime() ?? Number.MAX_SAFE_INTEGER);

const day = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "no date");

/**
 * `all` describes the whole sitemap when we only analyzed a sample of it, so the
 * stale count isn't skewed by sampling the oldest posts.
 */
export function refreshItems(posts: Post[], dups: DupPair[], now = new Date(), all?: { posts: number; dated: number; stale: number }): CheckItem[] {
  const items: CheckItem[] = [];
  const dated = posts.filter((p) => p.lastmod);
  const coverage = posts.length ? dated.length / posts.length : 0;
  items.push({
    id: "lastmod",
    label: "Update dates in the sitemap",
    status: coverage >= 0.9 ? "pass" : coverage > 0 ? "warn" : "fail",
    detail: `${dated.length} of ${posts.length} posts have a <lastmod> date (${Math.round(coverage * 100)}%).`,
    why: "The lastmod date tells search engines a post changed, so they come back and recrawl it. Without it, refreshes can go unnoticed for weeks.",
    fix: coverage >= 0.9 ? undefined : "Use a sitemap that outputs lastmod for each post (Yoast, Rank Math, Shopify, Webflow and Squarespace do).",
  });

  const cutoff = now.getTime() - STALE_DAYS * 86_400_000;
  const stale = dated.filter((p) => p.lastmod!.getTime() < cutoff).sort((a, b) => a.lastmod!.getTime() - b.lastmod!.getTime());
  const staleCount = all ? all.stale : stale.length;
  const datedCount = all ? all.dated : dated.length;
  const share = datedCount ? staleCount / datedCount : 0;
  items.push({
    id: "stale",
    label: "Posts not updated in 12+ months",
    status: !dated.length ? "info" : stale.length === 0 ? "pass" : share > 0.5 ? "fail" : "warn",
    detail: !dated.length
      ? "No dates to check."
      : stale.length
        ? `${staleCount.toLocaleString("en-US")} of ${datedCount.toLocaleString("en-US")} dated posts (${Math.round(share * 100)}%) haven't been updated in over a year.${stale.length > 25 ? " The 25 oldest are listed." : ""}`
        : "Every dated post was updated in the last 12 months.",
    why: "Older posts drift out of date: prices, screenshots and advice change. Search engines and AI assistants favor pages that are current.",
    fix: stale.length ? "Refresh the posts that still get traffic first: check facts, update the year and examples, add what readers ask now, and change the updated date." : undefined,
    list: stale.slice(0, 25).map((p) => ({ text: p.title || p.url, href: p.url, note: `Last updated ${day(p.lastmod)}` })),
  });

  items.push({
    id: "duplicates",
    label: "Posts that overlap",
    status: dups.length ? "warn" : "pass",
    detail: dups.length ? `${dups.length} pair${dups.length === 1 ? "" : "s"} of posts with very similar titles.` : "No posts with overlapping titles among the ones we read.",
    why: "Two posts on the same question compete with each other in search, and neither ranks as well as one strong post would.",
    fix: dups.length
      ? "Merge each pair: keep the stronger URL, fold in the best parts of the other, and 301 redirect the weaker one to it. If two posts are deliberate parts of a series, link them to each other and keep both."
      : undefined,
    list: dups.slice(0, 15).map((d) => ({ text: `"${d.a.title}" and "${d.b.title}"`, href: d.a.url, note: `${Math.round(d.score * 100)}% title overlap` })),
  });

  // Plan: merge overlaps first, then refresh the oldest posts.
  const merged = new Set<string>();
  const plan: { text: string; href?: string; note?: string }[] = [];
  for (const d of dups.slice(0, 10)) {
    if (merged.has(d.a.url) || merged.has(d.b.url)) continue;
    const [keep, fold] = (d.a.lastmod?.getTime() ?? 0) >= (d.b.lastmod?.getTime() ?? 0) ? [d.a, d.b] : [d.b, d.a];
    merged.add(keep.url).add(fold.url);
    plan.push({ text: `Merge: fold "${fold.title}" into "${keep.title}"`, href: keep.url, note: "Then 301 redirect the old URL" });
  }
  for (const p of stale) {
    if (plan.length >= 20) break;
    if (merged.has(p.url)) continue;
    plan.push({ text: `Refresh: ${p.title || p.url}`, href: p.url, note: `Last updated ${day(p.lastmod)}` });
  }
  items.push({
    id: "plan",
    label: "Suggested refresh plan",
    status: "info",
    detail: plan.length ? "Start at the top. Merges first, because they fix two posts at once." : "Nothing urgent. Check back in a few months.",
    why: "Updating a post that already has links and history is usually faster than writing a new one from scratch.",
    list: plan,
  });

  const oldest = [...posts].sort(byDateUndatedLast).slice(0, 30);
  items.push({
    id: "oldest",
    label: "Posts by last update, oldest first",
    status: "info",
    detail: `The ${oldest.length} least recently updated of ${posts.length} posts we found.`,
    why: "This is the order to review in, if you have no traffic data at hand.",
    list: oldest.map((p) => ({ text: p.title || p.url, href: p.url, note: day(p.lastmod) })),
  });
  return items;
}

/** Evenly spaced picks from a list, always including both ends. */
function spread<T>(list: T[], n: number): T[] {
  if (list.length <= n) return list;
  return Array.from({ length: n }, (_, i) => list[Math.round((i * (list.length - 1)) / (n - 1))]);
}

export async function runContentRefresh(input: string): Promise<ToolReport> {
  const start = checkUrl(input, { allowBare: true });
  const scan = new Scan({ budgetMs: 45_000, maxFetches: 60 });
  const origin = start.origin;
  const host = start.hostname.replace(/^www\./, "");
  const sameSite = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "") === host;
    } catch {
      return false;
    }
  };
  const notes: string[] = [];

  const robotsRes = await scan.fetch(`${origin}/robots.txt`, { expect: "text", maxBytes: 500 * 1024 });
  if (robotsRes.error && /Domain not found|Couldn't connect|Refused/.test(robotsRes.error)) throw new ToolError(`We couldn't reach that site: ${robotsRes.error}.`, 422);
  if (firewallOf(robotsRes)) throw new ToolError(loadError(robotsRes, "site"), 422);
  const siteOrigin = robotsRes.finalUrl ? new URL(robotsRes.finalUrl).origin : origin;
  const fromRobots = robotsRes.ok && !robotsRes.wrongType ? parseRobots(robotsRes.body).sitemaps.filter(sameSite).slice(0, 3) : [];
  const roots = [...new Set([...fromRobots, `${siteOrigin}/sitemap.xml`, `${siteOrigin}/sitemap_index.xml`, `${siteOrigin}/wp-sitemap.xml`])];

  let entries: SitemapEntry[] = [];
  let fromPostSitemap = false;
  let sitemapUrl = "";
  for (const root of roots) {
    if (!scan.canFetch()) break;
    const res = await scan.fetch(root, { expect: "xml" });
    if (!res.ok || res.wrongType) continue;
    const sm = parseSitemap(res.body);
    if (sm.kind === "invalid") continue;
    sitemapUrl = res.finalUrl;
    if (sm.kind === "urlset") {
      entries = sm.entries;
      break;
    }
    const children = sm.entries.filter((e) => sameSite(e.loc));
    const postMaps = children.filter((e) => isPostSitemap(e.loc));
    const queue = (postMaps.length ? postMaps : children).slice(0, 8);
    fromPostSitemap = postMaps.length > 0;
    for (const child of queue) {
      if (entries.length >= MAX_URLS * 3 || !scan.canFetch()) break;
      const c = await scan.fetch(child.loc, { expect: "xml" });
      if (c.ok && !c.wrongType) entries.push(...parseSitemap(c.body).entries);
    }
    break;
  }
  if (!sitemapUrl) {
    const item: CheckItem = {
      id: "sitemap",
      label: "Sitemap",
      status: "fail",
      detail: "We couldn't find a sitemap at /sitemap.xml, /sitemap_index.xml, /wp-sitemap.xml or in robots.txt.",
      why: "This check reads your post list and update dates from the sitemap. Search engines use it the same way.",
      fix: "Turn on your CMS or SEO plugin's XML sitemap and list it in robots.txt.",
    };
    return { tool: "content-refresh", checked: siteOrigin, items: [item], summary: summarize([item]), notes };
  }

  const sameSiteEntries = entries.filter((e) => sameSite(e.loc));
  const postLike = sameSiteEntries.filter((e) => looksLikePost(e.loc));
  let chosen = fromPostSitemap ? sameSiteEntries : postLike.length ? postLike : sameSiteEntries.filter((e) => new URL(e.loc).pathname.length > 1);
  if (!fromPostSitemap && !postLike.length) notes.push("We couldn't tell which URLs are blog posts, so this covers every page in the sitemap.");
  const seen = new Set<string>();
  chosen = chosen.filter((e) => (seen.has(e.loc) ? false : (seen.add(e.loc), true)));
  const cutoff = Date.now() - STALE_DAYS * 86_400_000;
  const allDates = chosen.map((e) => parseDate(e.lastmod));
  const all = {
    posts: chosen.length,
    dated: allDates.filter(Boolean).length,
    stale: allDates.filter((d) => d && d.getTime() < cutoff).length,
  };
  if (chosen.length > MAX_URLS) {
    notes.push(`Your sitemap lists ${chosen.length} posts. We looked at the ${MAX_URLS} least recently updated.`);
    chosen = chosen
      .map((e) => ({ e, lastmod: parseDate(e.lastmod) }))
      .sort(byDateUndatedLast)
      .slice(0, MAX_URLS)
      .map((x) => x.e);
  }

  const posts: Post[] = chosen.map((e) => ({ url: e.loc, lastmod: parseDate(e.lastmod), title: slugTitle(e.loc), titleSource: "slug" }));
  const sorted = [...posts].sort(byDateUndatedLast);
  const toFetch = spread(sorted, Math.min(MAX_TITLE_FETCHES, Math.max(0, scan.maxFetches - scan.fetches - 2)));
  await mapLimit(toFetch, 6, async (p) => {
    if (!scan.canFetch()) return;
    const r = await scan.fetch(p.url, { expect: "html", maxBytes: 400 * 1024, timeoutMs: 6000 });
    if (!r.ok || !r.body) return;
    const page = parsePage(r.body, r.finalUrl);
    const t = stripSiteName(page.ogTitle || page.title || page.headings.find((h) => h.level === 1)?.text || "");
    if (t) {
      p.title = t;
      p.titleSource = "page";
    }
    // Use the page's own modified date when the sitemap has none.
    if (!p.lastmod) p.lastmod = parseDate(page.modifiedTime || page.publishedTime);
  });
  if (toFetch.length < posts.length) notes.push(`We read the titles of ${toFetch.length} posts; the rest are compared by URL slug.`);

  const dups = findDuplicates(posts);
  const items: CheckItem[] = [
    {
      id: "sitemap",
      label: "Sitemap",
      status: "pass",
      detail: `Read ${sitemapUrl} and found ${all.posts.toLocaleString("en-US")} posts${all.posts > posts.length ? `. We analyzed the ${posts.length} least recently updated` : ""}.`,
      why: "This check reads your post list and update dates from the sitemap. Search engines use it the same way.",
    },
    ...refreshItems(posts, dups, new Date(), all),
  ];
  return { tool: "content-refresh", checked: siteOrigin, items, summary: summarize(items), notes };
}
