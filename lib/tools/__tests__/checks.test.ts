import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fleschReadingEase, parsePage, skippedHeadings, syllables } from "../html.ts";
import { botVerdict, isAllowed, parseRobots } from "../robots.ts";
import { looksLikePost, newestFeedDate, parseSitemap, isPostSitemap } from "../sitemap.ts";
import { analyzeBlogPost, brokenLinksItem } from "../checks/blog-seo.ts";
import { freshnessItem, indexingItem, llmsItem, parityItem, robotsItems, schemaItem, titleDescItem } from "../checks/ai-visibility.ts";
import { findDuplicates, overlap, refreshItems, slugTitle, stripSiteName, titleTokens, type Post } from "../checks/content-refresh.ts";
import { authorPageItem, bylineItem, citationsItem, datesItem, findPeople, pageReachItem, personSchemaItem } from "../checks/eeat.ts";
import { firewallOf, loadError, type FetchResult } from "../fetcher.ts";
import type { CheckItem } from "../types.ts";

const fx = (name: string) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
const POST_URL = "https://acme.example.com/blog/flush-water-heater/";
const good = parsePage(fx("good-post.html"), POST_URL);
const bad = parsePage(fx("bad-post.html"), "https://bad.example.com/p");
const byId = (items: CheckItem[], id: string) => {
  const it = items.find((i) => i.id === id);
  assert.ok(it, `missing item ${id}`);
  return it;
};
const res = (over: Partial<FetchResult>): FetchResult => ({
  ok: true, status: 200, url: "", finalUrl: "", redirects: 0, contentType: "text/html", headers: {}, body: "", bytes: 1000, truncated: false, ...over,
});

// ---- HTML parsing ----

test("parsePage extracts head and body facts", () => {
  assert.equal(good.title, "How Often Should You Flush a Water Heater? | Acme Plumbing");
  assert.match(good.metaDescription ?? "", /^Learn how often/);
  assert.equal(good.canonical, POST_URL);
  assert.equal(good.ogImage, "https://acme.example.com/img/heater.jpg");
  assert.deepEqual(good.headings.map((h) => h.level), [1, 2, 3]);
  assert.ok(good.jsonLdTypes.includes("BlogPosting"));
  assert.ok(good.jsonLdTypes.includes("Person"));
  assert.equal(good.jsonLdErrors, 0);
  assert.ok(good.wordCount > 150 && good.wordCount < 400, String(good.wordCount));
  assert.deepEqual(good.bylines.length > 0, true);
  assert.deepEqual(good.authorLinks, ["https://acme.example.com/team/jane"]);
});

test("links are resolved, classified internal/external and in-main", () => {
  const main = good.links.filter((l) => l.inMain);
  assert.ok(main.some((l) => l.href === "https://acme.example.com/services/water-heaters" && l.internal));
  assert.ok(main.some((l) => l.href.startsWith("https://www.energy.gov/") && !l.internal));
  // Nav and footer links are not main content.
  assert.ok(!main.some((l) => l.href === "https://acme.example.com/about"));
  assert.ok(!main.some((l) => l.href.includes("facebook.com")));
});

test("svg <title> is ignored, bad JSON-LD is counted", () => {
  assert.equal(bad.title, "Hi");
  assert.equal(bad.jsonLdErrors, 1);
  assert.deepEqual(skippedHeadings(bad.headings).map((s) => [s.from.level, s.to.level]), [[1, 4]]);
});

test("readability helpers", () => {
  assert.equal(syllables("cat"), 1);
  assert.equal(syllables("water"), 2);
  assert.equal(syllables("readability"), 5);
  assert.equal(fleschReadingEase("Too short."), null);
  const easy = "The cat sat on the mat. It was a good day. ".repeat(20);
  const s = fleschReadingEase(easy);
  assert.ok(s !== null && s > 80, String(s));
});

// ---- Blog SEO ----

test("blog SEO checklist on a good post", () => {
  const items = analyzeBlogPost(good);
  assert.equal(byId(items, "h1").status, "pass");
  assert.equal(byId(items, "heading-order").status, "pass");
  assert.equal(byId(items, "meta-description").status, "pass");
  assert.equal(byId(items, "image-alt").status, "pass"); // empty alt = decorative
  assert.equal(byId(items, "internal-links").status, "pass");
  assert.equal(byId(items, "external-links").status, "pass");
  assert.equal(byId(items, "article-schema").status, "pass");
  assert.equal(byId(items, "canonical").status, "pass");
  assert.equal(byId(items, "og-image").status, "pass");
  assert.equal(byId(items, "title").status, "pass");
});

test("blog SEO checklist on a bad post", () => {
  const items = analyzeBlogPost(bad);
  assert.equal(byId(items, "title").status, "warn");
  assert.equal(byId(items, "meta-description").status, "fail");
  assert.equal(byId(items, "h1").status, "fail");
  assert.equal(byId(items, "heading-order").status, "warn");
  assert.equal(byId(items, "word-count").status, "fail");
  assert.equal(byId(items, "image-alt").status, "fail");
  assert.equal(byId(items, "internal-links").status, "fail");
  assert.equal(byId(items, "article-schema").status, "warn");
  assert.equal(byId(items, "canonical").status, "warn");
  assert.equal(byId(items, "og-image").status, "warn");
});

test("broken link item", () => {
  const item = brokenLinksItem(
    [
      { href: "https://a.example.com/ok", status: 200 },
      { href: "https://a.example.com/gone", status: 404 },
      { href: "https://b.example.com/", status: 403 },
      { href: "https://nx.example.com/", status: 0, error: "Domain not found" },
    ],
    4,
  );
  assert.equal(item.status, "fail");
  assert.equal(item.list?.length, 3);
  assert.equal(brokenLinksItem([{ href: "x", status: 200 }], 1).status, "pass");
  assert.equal(brokenLinksItem([{ href: "x", status: 0, error: "Timed out" }], 1).status, "warn");
});

// ---- robots.txt ----

test("robots.txt parsing and matching", () => {
  const r = parseRobots(fx("robots.txt"));
  assert.deepEqual(r.sitemaps, ["https://acme.example.com/sitemap_index.xml"]);
  assert.equal(isAllowed(r, "Googlebot", "/"), true);
  assert.equal(isAllowed(r, "Googlebot", "/wp-admin/x"), false);
  assert.equal(isAllowed(r, "Googlebot", "/wp-admin/admin-ajax.php"), true);
  assert.equal(isAllowed(r, "GPTBot", "/"), false);
  assert.equal(isAllowed(r, "ccbot", "/anything"), false);
  assert.equal(isAllowed(r, "PerplexityBot", "/blog/post"), false);
  assert.equal(isAllowed(r, "PerplexityBot", "/blog/public-1"), true);
  const pdf = parseRobots("User-agent: *\nDisallow: /*.pdf$");
  assert.equal(isAllowed(pdf, "Googlebot", "/files/a.pdf"), false);
  assert.equal(isAllowed(pdf, "Googlebot", "/files/a.pdf?v=2"), true); // $ anchors the end
  assert.equal(isAllowed(r, "Google-Extended", "/wp-admin/"), true); // empty Disallow, named group wins
  assert.equal(botVerdict(r, "GPTBot").verdict, "blocked");
  assert.equal(botVerdict(r, "Googlebot", ["/blog/post"]).verdict, "allowed"); // admin-only rules don't count
  assert.equal(botVerdict(r, "PerplexityBot", ["/blog/post"]).verdict, "partial");
});

test("robots items: search bot block fails, training block warns", () => {
  const r = parseRobots(fx("robots.txt"));
  const [search, training] = robotsItems(r, 200, ["/blog/post"]);
  assert.equal(search.status, "warn"); // Perplexity partially blocked
  assert.equal(training.status, "warn"); // GPTBot, CCBot blocked
  const blockedAll = robotsItems(parseRobots("User-agent: *\nDisallow: /"), 200, []);
  assert.equal(blockedAll[0].status, "fail");
  assert.equal(robotsItems(null, 404, [])[0].status, "pass");
  assert.equal(robotsItems(null, 503, [])[0].status, "fail");
});

test("hostile robots patterns are capped", () => {
  const r = parseRobots(`User-agent: *\nDisallow: /${"*a".repeat(50)}\nDisallow: /${"x".repeat(400)}`);
  assert.equal(r.groups[0].rules.length, 0);
});

// ---- Sitemaps and feeds ----

test("sitemap index, urlset and feed parsing", () => {
  const idx = parseSitemap(fx("sitemap-index.xml"));
  assert.equal(idx.kind, "index");
  assert.equal(idx.entries.length, 2);
  assert.equal(isPostSitemap(idx.entries[1].loc), true);
  assert.equal(isPostSitemap(idx.entries[0].loc), false);
  const urls = parseSitemap(fx("post-sitemap.xml"));
  assert.equal(urls.kind, "urlset");
  assert.equal(urls.entries.length, 5);
  assert.equal(urls.entries[3].lastmod, null);
  assert.equal(parseSitemap("<html><body>nope</body></html>").kind, "invalid");
  assert.equal(newestFeedDate(fx("feed.xml")).date?.slice(0, 10), "2026-09-01");
  assert.equal(looksLikePost("https://a.com/blog/my-post/"), true);
  assert.equal(looksLikePost("https://a.com/2024/05/my-post/"), true);
  assert.equal(looksLikePost("https://a.com/tag/plumbing/"), false);
  assert.equal(looksLikePost("https://a.com/pricing"), false);
});

// ---- AI visibility ----

test("AI visibility items", () => {
  const now = new Date("2026-10-13");
  assert.equal(freshnessItem({ date: new Date("2026-09-20"), source: "sitemap" }, 10, now).status, "pass");
  assert.equal(freshnessItem({ date: new Date("2026-05-01"), source: "sitemap" }, 10, now).status, "warn");
  assert.equal(freshnessItem({ date: new Date("2024-01-01"), source: "sitemap" }, 10, now).status, "fail");
  assert.equal(freshnessItem(null, 0, now).status, "warn");
  assert.equal(schemaItem(good).status, "pass");
  assert.equal(schemaItem(bad).status, "fail");
  assert.equal(indexingItem(good, "").status, "pass");
  assert.equal(indexingItem(parsePage('<meta name="robots" content="noindex, nofollow">', "https://a.com/"), "").status, "fail");
  assert.equal(indexingItem(parsePage('<meta name="robots" content="noai, noimageai">', "https://a.com/"), "").status, "warn");
  assert.equal(indexingItem(good, "noindex").status, "fail");
  assert.equal(titleDescItem(good).status, "pass");
  assert.equal(titleDescItem(parsePage("<p>x</p>", "https://a.com/")).status, "fail");
  assert.equal(llmsItem(res({ body: "# Acme\n> Plumbing" })).status, "pass");
  assert.equal(llmsItem(res({ ok: false, status: 404 })).status, "info");
  assert.equal(llmsItem(res({ body: "<!doctype html><html>" })).status, "info"); // soft 404
});

test("bot parity", () => {
  const ok = parityItem([
    { name: "Browser", res: res({}), words: 500 },
    { name: "GPTBot", res: res({}), words: 480 },
    { name: "ClaudeBot", res: res({}), words: 500 },
  ]);
  assert.equal(ok.status, "pass");
  const blocked = parityItem([
    { name: "Browser", res: res({}), words: 500 },
    { name: "GPTBot", res: res({ ok: false, status: 403 }), words: 0 },
    { name: "ClaudeBot", res: res({}), words: 500 },
  ]);
  assert.equal(blocked.status, "warn");
  assert.match(blocked.detail, /GPTBot got HTTP 403/);
  const thin = parityItem([
    { name: "Browser", res: res({}), words: 500 },
    { name: "GPTBot", res: res({}), words: 40 },
    { name: "ClaudeBot", res: res({}), words: 500 },
  ]);
  assert.equal(thin.status, "warn");
});

// ---- Content refresh ----

test("title tokens, overlap and site-name stripping", () => {
  assert.deepEqual([...titleTokens("How to Flush a Water Heater in 2026")].sort(), ["flush", "heater", "water"]);
  assert.equal(overlap(titleTokens("How Often Should You Flush a Water Heater?"), titleTokens("How to flush a water heater")), 1);
  assert.ok(overlap(titleTokens("Tankless vs tank water heaters"), titleTokens("When to replace the anode rod")) < 0.3);
  assert.equal(stripSiteName("Flush a Water Heater | Acme Plumbing"), "Flush a Water Heater");
  assert.equal(stripSiteName("Acme"), "Acme");
  assert.equal(slugTitle("https://a.com/blog/how-to-flush-a-water-heater/"), "how to flush a water heater");
});

test("refresh items flag stale posts and duplicates", () => {
  const now = new Date("2026-10-13");
  const posts: Post[] = [
    { url: "https://a.com/blog/1", lastmod: new Date("2026-09-01"), title: "How Often Should You Flush a Water Heater?", titleSource: "page" },
    { url: "https://a.com/blog/2", lastmod: new Date("2023-02-01"), title: "How to Flush a Water Heater", titleSource: "page" },
    { url: "https://a.com/blog/3", lastmod: new Date("2024-01-15"), title: "Tankless vs Tank Water Heaters", titleSource: "page" },
    { url: "https://a.com/blog/4", lastmod: null, title: "anode rod", titleSource: "slug" },
  ];
  const dups = findDuplicates(posts);
  assert.equal(dups.length, 1);
  const items = refreshItems(posts, dups, now);
  assert.equal(byId(items, "lastmod").status, "warn");
  const stale = byId(items, "stale");
  assert.equal(stale.status, "fail"); // 2 of 3 dated posts are stale
  assert.equal(stale.list?.[0].href, "https://a.com/blog/2"); // oldest first
  assert.equal(byId(items, "duplicates").status, "warn");
  const plan = byId(items, "plan").list ?? [];
  assert.match(plan[0].text, /^Merge: fold "How to Flush a Water Heater" into "How Often/);
  assert.match(plan[1].text, /^Refresh: Tankless/);
  assert.equal(byId(items, "oldest").list?.at(-1)?.note, "no date"); // undated last
});

// ---- E-E-A-T ----

test("E-E-A-T items on a good post", () => {
  assert.equal(bylineItem(good).status, "pass");
  assert.equal(findPeople(good)[0]["name"], "Jane Doe");
  assert.equal(personSchemaItem(good, null).status, "pass");
  assert.equal(datesItem(good).status, "pass");
  const cites = citationsItem(good);
  assert.equal(cites.status, "pass"); // energy.gov + wikipedia; facebook in footer ignored
  assert.equal(authorPageItem("https://acme.example.com/team/jane", res({})).status, "pass");
  assert.equal(authorPageItem("https://acme.example.com/team/jane", res({ ok: false, status: 404 })).status, "fail");
  assert.equal(authorPageItem(null, null).status, "fail");
  assert.equal(pageReachItem("about", { url: "https://a.com/about", res: res({ finalUrl: "https://a.com/about" }) }, []).status, "pass");
  assert.equal(pageReachItem("contact", null, ["/contact", "/contact-us"]).status, "fail");
});

test("E-E-A-T items on a bare post", () => {
  assert.equal(bylineItem(bad).status, "fail");
  assert.equal(personSchemaItem(bad, null).status, "fail");
  assert.equal(datesItem(bad).status, "fail");
  assert.equal(citationsItem(bad).status, "fail");
  const metaOnly = parsePage('<meta name="author" content="Sam">', "https://a.com/p");
  assert.equal(bylineItem(metaOnly).status, "warn");
  const partial = parsePage('<script type="application/ld+json">{"@type":"Article","author":{"@type":"Person","name":"Sam"}}</script>', "https://a.com/p");
  assert.equal(personSchemaItem(partial, null).status, "warn");
});

test("firewall detection and load errors", () => {
  assert.equal(firewallOf(res({ ok: false, status: 403, headers: { "x-vercel-mitigated": "challenge" } })), "Vercel");
  assert.equal(firewallOf(res({ ok: false, status: 403, headers: { "cf-mitigated": "challenge" } })), "Cloudflare");
  assert.equal(firewallOf(res({ ok: false, status: 404, headers: { server: "cloudflare" } })), null);
  assert.match(loadError(res({ ok: false, status: 403, headers: { "x-vercel-mitigated": "challenge" } })), /firewall \(Vercel\)/);
  assert.equal(loadError(res({ ok: false, status: 0, error: "Timed out" })), "We couldn't load the page: Timed out.");
});
