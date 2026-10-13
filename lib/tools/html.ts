// Turns fetched HTML into the facts the checks need. Pure functions, no network,
// so the unit tests can run them on fixture HTML.
import { parseDocument, DomUtils } from "htmlparser2";

type Doc = ReturnType<typeof parseDocument>;
type El = ReturnType<typeof DomUtils.findAll>[number];
type AnyNode = Doc["children"][number];

export type Link = { href: string; text: string; rel: string; internal: boolean; /** Inside the article/main content. */ inMain: boolean };
export type Img = { src: string; alt: string | null };
export type Heading = { level: number; text: string };

export type PageInfo = {
  url: string;
  lang: string;
  title: string;
  metaDescription: string | null;
  canonical: string | null;
  robots: string;
  /** Lower-cased tokens from robots meta tags that limit AI use (noai, noimageai) or indexing (noindex). */
  robotsTokens: string[];
  ogImage: string | null;
  ogTitle: string | null;
  metaAuthor: string | null;
  headings: Heading[];
  links: Link[];
  images: Img[];
  jsonLd: Record<string, unknown>[];
  jsonLdTypes: string[];
  jsonLdErrors: number;
  /** Visible main-content text (article/main when present). */
  mainText: string;
  wordCount: number;
  publishedTime: string | null;
  modifiedTime: string | null;
  timeElements: string[];
  /** Text of elements that look like a byline (class/itemprop/rel author). */
  bylines: string[];
  authorLinks: string[];
  feedLinks: string[];
};

const SKIP = new Set(["script", "style", "noscript", "template", "svg", "iframe", "head"]);
const CHROME = new Set(["nav", "header", "footer", "aside", "form"]);

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

function attr(el: El, name: string): string | null {
  const v = el.attribs?.[name];
  return v === undefined ? null : v;
}

function abs(href: string, base: string): string | null {
  try {
    const u = new URL(href.trim(), base);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}

function isEl(n: AnyNode): n is El {
  return n.type === "tag" || n.type === "script" || n.type === "style";
}

/** Visible text under `nodes`, skipping scripts and (optionally) page chrome. */
function visibleText(nodes: AnyNode[], skipChrome: boolean): string {
  const out: string[] = [];
  const walk = (list: AnyNode[]) => {
    for (const n of list) {
      if (n.type === "text") out.push((n as unknown as { data: string }).data);
      else if (isEl(n)) {
        if (SKIP.has(n.name)) continue;
        if (skipChrome && CHROME.has(n.name)) continue;
        if (attr(n, "hidden") !== null || attr(n, "aria-hidden") === "true") continue;
        const block = /^(p|div|li|h[1-6]|br|tr|td|th|section|article|blockquote|pre|dd|dt|figcaption)$/.test(n.name);
        if (block) out.push(" \n");
        walk(n.children as AnyNode[]);
        if (block) out.push(" \n");
      }
    }
  };
  walk(nodes);
  return out.join("").replace(/[ \t ]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

function flattenJsonLd(value: unknown, into: Record<string, unknown>[]) {
  if (Array.isArray(value)) return value.forEach((v) => flattenJsonLd(v, into));
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  if (obj["@graph"]) flattenJsonLd(obj["@graph"], into);
  if (obj["@type"]) into.push(obj);
}

export function typesOf(node: Record<string, unknown>): string[] {
  const t = node["@type"];
  return (Array.isArray(t) ? t : [t]).filter((x): x is string => typeof x === "string");
}

export function parsePage(html: string, url: string): PageInfo {
  const doc = parseDocument(html, { decodeEntities: true });
  const all = DomUtils.findAll(() => true, doc.children);
  const byName = (name: string) => all.filter((e) => e.name === name);
  const metas = byName("meta");
  const meta = (key: string) => {
    const m = metas.find((e) => (attr(e, "name") ?? attr(e, "property") ?? "").toLowerCase() === key);
    return m ? clean(attr(m, "content") ?? "") : null;
  };

  const htmlEl = byName("html")[0];
  const base = (() => {
    const b = byName("base")[0];
    const href = b ? attr(b, "href") : null;
    return (href && abs(href, url)) || url;
  })();
  const host = new URL(url).hostname.replace(/^www\./, "");

  const insideSvg = (e: El) => {
    for (let p = e.parent as El | null; p; p = p.parent as El | null) if (p.name === "svg") return true;
    return false;
  };
  const titleEl = all.find((e) => e.name === "title" && !insideSvg(e));
  const canonicalEl = byName("link").find((e) => (attr(e, "rel") ?? "").toLowerCase().split(/\s+/).includes("canonical"));

  const robotsMetas = metas.filter((e) => /^(robots|googlebot|bingbot|gptbot|claudebot|ccbot)$/i.test(attr(e, "name") ?? ""));
  const robots = robotsMetas.map((e) => `${(attr(e, "name") ?? "").toLowerCase()}: ${attr(e, "content") ?? ""}`).join("; ");
  const robotsTokens = [
    ...new Set(robotsMetas.flatMap((e) => (attr(e, "content") ?? "").toLowerCase().split(/[\s,]+/)).filter((t) => ["noindex", "nofollow", "none", "noai", "noimageai", "nosnippet"].includes(t))),
  ];

  const headings: Heading[] = all
    .filter((e) => /^h[1-6]$/.test(e.name))
    .map((e) => ({ level: Number(e.name[1]), text: clean(DomUtils.textContent(e)) }));

  // One <article> is the post; several are cards on a listing page, so fall back to <main>.
  const articles = byName("article");
  const mainRoot = (articles.length === 1 ? articles[0] : undefined) ?? byName("main")[0] ?? all.find((e) => attr(e, "role") === "main") ?? byName("body")[0];
  const hasMain = !!mainRoot && mainRoot.name !== "body";
  /** True when `e` sits in the main content: under mainRoot (or anywhere, with no main) and not inside nav/header/footer/aside/form. */
  const inMainContent = (e: El) => {
    for (let p = e.parent as El | null; p; p = p.parent as El | null) {
      if (hasMain && p === mainRoot) return true;
      if (CHROME.has(p.name)) return false;
    }
    return !hasMain;
  };

  const links: Link[] = [];
  for (const a of byName("a")) {
    const href = attr(a, "href");
    if (!href || /^(#|javascript:|mailto:|tel:)/i.test(href.trim())) continue;
    const resolved = abs(href, base);
    if (!resolved) continue;
    const linkHost = new URL(resolved).hostname.replace(/^www\./, "");
    links.push({ href: resolved, text: clean(DomUtils.textContent(a)), rel: (attr(a, "rel") ?? "").toLowerCase(), internal: linkHost === host, inMain: inMainContent(a) });
  }

  const images: Img[] = byName("img")
    .filter((e) => {
      const w = attr(e, "width");
      const h = attr(e, "height");
      return !(w === "1" || h === "1"); // tracking pixels
    })
    .map((e) => ({ src: attr(e, "src") ?? attr(e, "data-src") ?? "", alt: attr(e, "alt") }));

  const jsonLd: Record<string, unknown>[] = [];
  let jsonLdErrors = 0;
  for (const s of byName("script").filter((e) => (attr(e, "type") ?? "").toLowerCase().trim() === "application/ld+json")) {
    try {
      flattenJsonLd(JSON.parse(DomUtils.textContent(s)), jsonLd);
    } catch {
      jsonLdErrors++;
    }
  }
  // Nested nodes (author inside BlogPosting, etc.) also count for type detection.
  const nestedTypes = new Set<string>();
  const collect = (v: unknown, depth: number) => {
    if (depth > 6 || !v || typeof v !== "object") return;
    if (Array.isArray(v)) return v.forEach((x) => collect(x, depth + 1));
    const o = v as Record<string, unknown>;
    typesOf(o).forEach((t) => nestedTypes.add(t));
    Object.values(o).forEach((x) => collect(x, depth + 1));
  };
  jsonLd.forEach((n) => collect(n, 0));

  const mainText = mainRoot ? visibleText(mainRoot.children as AnyNode[], mainRoot.name === "body") : visibleText(doc.children, true);
  const wordCount = (mainText.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;

  const authorish = (e: El) => {
    const cls = `${attr(e, "class") ?? ""} ${attr(e, "id") ?? ""}`.toLowerCase();
    return attr(e, "itemprop") === "author" || /(^|[\s_-])(author|byline|writer)([\s_-]|$)/.test(cls) || (attr(e, "rel") ?? "").toLowerCase().split(/\s+/).includes("author");
  };
  const bylineEls = all.filter((e) => e.name !== "meta" && e.name !== "link" && e.name !== "script" && authorish(e));
  const bylines = [...new Set(bylineEls.map((e) => clean(DomUtils.textContent(e))).filter((t) => t && t.length <= 160))].slice(0, 5);
  const authorLinks = [
    ...new Set(
      [
        ...bylineEls.flatMap((e) => (e.name === "a" ? [e] : DomUtils.findAll((x) => x.name === "a", e.children))),
        ...byName("link").filter((e) => (attr(e, "rel") ?? "").toLowerCase() === "author"),
      ]
        .map((e) => attr(e, "href"))
        .filter((h): h is string => !!h)
        .map((h) => abs(h, base))
        .filter((h): h is string => !!h),
    ),
  ].slice(0, 5);

  const feedLinks = byName("link")
    .filter((e) => (attr(e, "rel") ?? "").toLowerCase().includes("alternate") && /rss|atom/i.test(attr(e, "type") ?? ""))
    .map((e) => abs(attr(e, "href") ?? "", base))
    .filter((h): h is string => !!h);

  return {
    url,
    lang: htmlEl ? attr(htmlEl, "lang") ?? "" : "",
    title: titleEl ? clean(DomUtils.textContent(titleEl)) : "",
    metaDescription: meta("description"),
    canonical: canonicalEl ? abs(attr(canonicalEl, "href") ?? "", base) : null,
    robots,
    robotsTokens,
    ogImage: meta("og:image") || meta("og:image:url") || meta("twitter:image") || null,
    ogTitle: meta("og:title"),
    metaAuthor: meta("author") || meta("article:author") || null,
    headings,
    links,
    images,
    jsonLd,
    jsonLdTypes: [...nestedTypes],
    jsonLdErrors,
    mainText,
    wordCount,
    publishedTime: meta("article:published_time") || null,
    modifiedTime: meta("article:modified_time") || meta("og:updated_time") || null,
    timeElements: byName("time").map((e) => attr(e, "datetime") ?? clean(DomUtils.textContent(e))).filter(Boolean).slice(0, 10),
    bylines,
    authorLinks,
    feedLinks,
  };
}

// ---- Readability -------------------------------------------------------------

/** Rough English syllable count: vowel groups, minus a silent final e. */
export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

/** Flesch reading ease (0 to 100, higher is easier). null when there is too little text. */
export function fleschReadingEase(text: string): number | null {
  const words = text.match(/[A-Za-z][A-Za-z'’-]*/g) ?? [];
  if (words.length < 100) return null;
  const sentences = Math.max(1, (text.match(/[^.!?\n]+(?:[.!?]+|\n|$)/g) ?? []).filter((s) => /[A-Za-z]/.test(s)).length);
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const score = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (syl / words.length);
  return Math.round(Math.max(0, Math.min(100, score)));
}

/** Heading levels that skip, e.g. an H2 followed by an H4. */
export function skippedHeadings(headings: Heading[]): { from: Heading; to: Heading }[] {
  const out: { from: Heading; to: Heading }[] = [];
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1];
    const cur = headings[i];
    if (cur.level > prev.level + 1) out.push({ from: prev, to: cur });
  }
  return out;
}
