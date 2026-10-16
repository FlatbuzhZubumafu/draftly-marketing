// Reads a small, safe summary of a visitor's site for the AI tools: homepage title,
// description, headings and opening text, plus up to 60 page URLs from the sitemap.
// Uses the SSRF-guarded Scan from the checkers. Nothing is stored.
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, firewallOf, loadError } from "../fetcher.ts";
import { parsePage } from "../html.ts";
import { parseRobots } from "../robots.ts";
import { looksLikePost, parseSitemap, type SitemapEntry } from "../sitemap.ts";

export type SitePage = { url: string; title: string };

export type SiteContext = {
  origin: string;
  host: string;
  title: string;
  description: string;
  headings: string[];
  /** First ~1,200 characters of the homepage's main text. */
  text: string;
  /** Pages from the sitemap (posts first), titled from their slugs. */
  pages: SitePage[];
  /** How many of `pages` look like blog posts. */
  postCount: number;
};

export const MAX_PAGES = 60;

/** "best-water-heater-brands" -> "best water heater brands". */
export function slugTitle(url: string): string {
  try {
    const seg = new URL(url).pathname.split("/").filter(Boolean).pop() ?? "";
    return decodeURIComponent(seg).replace(/\.[a-z]+$/, "").replace(/[-_]+/g, " ").trim();
  } catch {
    return "";
  }
}

/** Picks up to `max` useful pages: posts first, no home/tag/category/author/pagination URLs. */
export function pickPages(entries: SitemapEntry[], host: string, max = MAX_PAGES): { pages: SitePage[]; postCount: number } {
  const seen = new Set<string>();
  const usable: { url: string; post: boolean }[] = [];
  for (const e of entries) {
    let u: URL;
    try {
      u = new URL(e.loc);
    } catch {
      continue;
    }
    if (u.hostname.replace(/^www\./, "") !== host) continue;
    const path = u.pathname.replace(/\/+$/, "");
    if (!path || /\/(tag|tags|category|categories|author|page|feed|wp-content|cart|checkout|account|login)(\/|$)/i.test(path)) continue;
    const key = u.origin + path;
    if (seen.has(key)) continue;
    seen.add(key);
    usable.push({ url: u.origin + path, post: looksLikePost(u.href) });
  }
  const posts = usable.filter((p) => p.post);
  const others = usable.filter((p) => !p.post);
  const chosen = [...posts.slice(0, Math.ceil(max * 0.7)), ...others].slice(0, max);
  const kept = chosen.map((p) => ({ ...p, title: slugTitle(p.url) })).filter((p) => p.title.length > 2);
  return { pages: kept.map(({ url, title }) => ({ url, title })), postCount: kept.filter((p) => p.post).length };
}

export async function readSite(input: string): Promise<SiteContext> {
  const start = checkUrl(input, { allowBare: true });
  const scan = new Scan({ budgetMs: 10_000, maxFetches: 8 });
  const host = start.hostname.replace(/^www\./, "");

  const home = await scan.fetch(start.origin + "/", { expect: "html", maxBytes: 1024 * 1024 });
  if (home.error && /Domain not found|Couldn't connect|Refused/.test(home.error)) throw new ToolError(`We couldn't reach that site: ${home.error}.`, 422);
  if (firewallOf(home) || !home.ok || home.wrongType) throw new ToolError(loadError(home, "site"), 422);
  const origin = new URL(home.finalUrl || start.origin).origin;
  const page = parsePage(home.body, home.finalUrl || origin);

  const robots = await scan.fetch(`${origin}/robots.txt`, { expect: "text", maxBytes: 200 * 1024 });
  const fromRobots = robots.ok && !robots.wrongType ? parseRobots(robots.body).sitemaps.slice(0, 2) : [];
  const roots = [...new Set([...fromRobots, `${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/wp-sitemap.xml`])];

  let entries: SitemapEntry[] = [];
  for (const root of roots) {
    if (!scan.canFetch()) break;
    const res = await scan.fetch(root, { expect: "xml" });
    if (!res.ok || res.wrongType) continue;
    const sm = parseSitemap(res.body);
    if (sm.kind === "invalid") continue;
    if (sm.kind === "urlset") {
      entries = sm.entries;
      break;
    }
    // An index: read the post sitemap if there is one, else the first two children.
    const children = sm.entries.filter((e) => /post|blog|article|news/i.test(e.loc));
    for (const child of (children.length ? children : sm.entries).slice(0, 2)) {
      if (!scan.canFetch()) break;
      const c = await scan.fetch(child.loc, { expect: "xml" });
      if (c.ok && !c.wrongType) entries.push(...parseSitemap(c.body).entries);
    }
    break;
  }

  const { pages, postCount } = pickPages(entries, host);
  return {
    origin,
    host,
    title: page.title.slice(0, 200),
    description: (page.metaDescription ?? "").slice(0, 300),
    headings: page.headings
      .filter((h) => h.level <= 3 && h.text.length > 2)
      .map((h) => h.text.slice(0, 120))
      .slice(0, 12),
    text: page.mainText.replace(/\s+/g, " ").slice(0, 1200),
    pages,
    postCount,
  };
}

/** The site summary as plain text for a prompt. Page text is quoted data, not instructions. */
export function siteForPrompt(site: SiteContext, { withPages }: { withPages: boolean }): string {
  const lines = [
    `Site: ${site.origin}`,
    `Homepage title: ${site.title || "(none)"}`,
    `Homepage description: ${site.description || "(none)"}`,
    `Homepage headings: ${site.headings.join(" | ") || "(none)"}`,
    `Homepage text (excerpt): ${site.text || "(none)"}`,
  ];
  if (withPages && site.pages.length) {
    lines.push(`Existing pages (${site.pages.length}, titles guessed from URLs):`);
    for (const p of site.pages) lines.push(`- ${p.title} :: ${p.url}`);
  }
  return lines.join("\n");
}
