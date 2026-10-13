// Sitemap and feed parsing. Pure functions over fetched text.
import { parseDocument, parseFeed, DomUtils } from "htmlparser2";

export type SitemapEntry = { loc: string; lastmod: string | null };
export type Sitemap = { kind: "urlset" | "index" | "invalid"; entries: SitemapEntry[] };

export function parseSitemap(xml: string): Sitemap {
  const doc = parseDocument(xml, { xmlMode: true });
  const els = DomUtils.findAll(() => true, doc.children);
  const local = (name: string) => name.toLowerCase().replace(/^.*:/, "");
  const root = els.find((e) => ["urlset", "sitemapindex"].includes(local(e.name)));
  if (!root) return { kind: "invalid", entries: [] };
  const kind = local(root.name) === "sitemapindex" ? "index" : "urlset";
  const itemName = kind === "index" ? "sitemap" : "url";
  const entries: SitemapEntry[] = [];
  for (const item of els.filter((e) => local(e.name) === itemName)) {
    const child = (n: string) => item.children.find((c) => "name" in c && local((c as { name: string }).name) === n);
    const locEl = child("loc");
    if (!locEl) continue;
    const loc = DomUtils.textContent(locEl).trim();
    if (!/^https?:\/\//i.test(loc)) continue;
    const lastEl = child("lastmod");
    entries.push({ loc, lastmod: lastEl ? DomUtils.textContent(lastEl).trim() || null : null });
  }
  return { kind, entries };
}

/** Newest item date in an RSS or Atom feed, as an ISO string. */
export function newestFeedDate(xml: string): { date: string | null; items: number } {
  const feed = parseFeed(xml);
  if (!feed) return { date: null, items: 0 };
  const dates = feed.items.map((i) => i.pubDate?.getTime()).filter((t): t is number => typeof t === "number" && !Number.isNaN(t));
  if (!dates.length) return { date: feed.updated ? feed.updated.toISOString() : null, items: feed.items.length };
  return { date: new Date(Math.max(...dates)).toISOString(), items: feed.items.length };
}

export function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s.trim());
  if (Number.isNaN(d.getTime())) return null;
  // Ignore obviously bogus dates (before the web or more than a day in the future).
  if (d.getFullYear() < 1995 || d.getTime() > Date.now() + 86_400_000) return null;
  return d;
}

const POST_HINT = /\/(blog|posts?|articles?|news|insights|resources|guides|journal|stories|learn)\//i;
const NOT_POST = /\/(tag|tags|category|categories|author|authors|page|search|cart|checkout|account|login|wp-admin|feed)(\/|$)/i;

/** Heuristic: does this URL look like a blog post (as opposed to a product, tag or home page)? */
export function looksLikePost(url: string): boolean {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  const path = u.pathname;
  if (NOT_POST.test(path)) return false;
  if (POST_HINT.test(path) && path.split("/").filter(Boolean).length >= 2) return true;
  // WordPress-style dated permalinks: /2024/05/slug/
  return /\/\d{4}\/\d{2}\/[^/]+/.test(path);
}

/** Sitemap file names that usually hold posts (post-sitemap.xml, sitemap-posts.xml, blog sitemaps). */
export function isPostSitemap(url: string): boolean {
  return /post|blog|article|news/i.test(url) && !/page|product|categor|tag|author|collection|image|video/i.test(url.split("/").pop() ?? "");
}
