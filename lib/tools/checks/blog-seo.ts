// Free blog post SEO check: one post URL, an on-page checklist plus a broken-link pass.
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, UA, loadError, mapLimit } from "../fetcher.ts";
import { fleschReadingEase, parsePage, skippedHeadings, type PageInfo } from "../html.ts";
import { summarize, type CheckItem, type ToolReport } from "../types.ts";

export const ARTICLE_TYPES = ["Article", "BlogPosting", "NewsArticle", "TechArticle", "Report", "ScholarlyArticle", "SocialMediaPosting"];

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

export function analyzeBlogPost(page: PageInfo): CheckItem[] {
  const items: CheckItem[] = [];

  // Title
  const t = page.title;
  items.push({
    id: "title",
    label: "Title length",
    status: !t ? "fail" : t.length >= 30 && t.length <= 60 ? "pass" : "warn",
    detail: t ? `"${t}" is ${t.length} characters.` : "The page has no title tag.",
    why: "Google shows about 50 to 60 characters of a title. A title that's too long gets cut off, and one that's too short wastes room to say what the post answers.",
    fix: !t ? "Add a title tag that names the question the post answers." : t.length > 60 ? "Trim the title to 60 characters or fewer, with the main keyword near the start." : t.length < 30 ? "Make the title more specific: name the topic and who it's for." : undefined,
  });

  // Meta description
  const d = page.metaDescription ?? "";
  items.push({
    id: "meta-description",
    label: "Meta description length",
    status: !d ? "fail" : d.length >= 120 && d.length <= 160 ? "pass" : "warn",
    detail: d ? `${d.length} characters: "${d.length > 170 ? `${d.slice(0, 167)}...` : d}"` : "No meta description.",
    why: "The description is the snippet under your title in search results. Without one, Google picks a sentence from the page, which may not sell the click.",
    fix: !d ? "Write a 120 to 160 character description that starts with a verb and says what the reader gets." : d.length > 160 ? "Cut it to 160 characters so it doesn't get truncated." : d.length < 120 ? "Add specifics until it's about 120 to 160 characters." : undefined,
  });

  // H1
  const h1s = page.headings.filter((h) => h.level === 1);
  items.push({
    id: "h1",
    label: "Exactly one H1",
    status: h1s.length === 1 ? "pass" : "fail",
    detail: h1s.length === 1 ? `H1: "${h1s[0].text}"` : h1s.length === 0 ? "No H1 on the page." : `${h1s.length} H1 headings on the page.`,
    why: "The H1 is the page's main headline. One clear H1 tells readers and search engines what the post is about.",
    fix: h1s.length === 0 ? "Make the post title an H1." : h1s.length > 1 ? "Keep the post title as the only H1 and turn the others into H2s." : undefined,
    list: h1s.length > 1 ? h1s.map((h) => ({ text: h.text || "(empty)" })) : undefined,
  });

  // Heading order
  const skips = skippedHeadings(page.headings);
  const subheads = page.headings.filter((h) => h.level >= 2).length;
  items.push({
    id: "heading-order",
    label: "Heading order",
    status: skips.length ? "warn" : subheads === 0 ? "warn" : "pass",
    detail: skips.length
      ? `${plural(skips.length, "place")} where a heading level is skipped.`
      : subheads === 0
        ? "No H2 or H3 subheadings."
        : `${plural(subheads, "subheading")}, no skipped levels.`,
    why: "Headings form the outline of the post. Screen readers and AI tools use that outline to find the answer to a question.",
    fix: skips.length ? "Go one level at a time: H2 under the H1, H3 under an H2." : subheads === 0 ? "Break the post into sections with H2 headings, ideally phrased as the questions readers ask." : undefined,
    list: skips.slice(0, 8).map((s) => ({ text: `H${s.from.level} "${s.from.text.slice(0, 60)}" then H${s.to.level} "${s.to.text.slice(0, 60)}"` })),
  });

  // Word count
  const wc = page.wordCount;
  items.push({
    id: "word-count",
    label: "Word count",
    status: wc >= 800 ? "pass" : wc >= 300 ? "warn" : "fail",
    detail: `About ${plural(wc, "word")} in the main content.`,
    why: "Length isn't a ranking factor by itself. Posts under a few hundred words rarely answer a question fully, so they rarely rank or get quoted.",
    fix: wc < 800 ? "Cover the questions a reader would ask next: steps, costs, examples and mistakes to avoid." : undefined,
  });

  // Images
  const imgs = page.images.filter((i) => i.src && !/^data:/.test(i.src));
  const withAlt = imgs.filter((i) => i.alt !== null && i.alt.trim() !== "");
  const decorative = imgs.filter((i) => i.alt === "");
  const missing = imgs.filter((i) => i.alt === null);
  const pct = imgs.length ? Math.round((withAlt.length / imgs.length) * 100) : 100;
  items.push({
    id: "image-alt",
    label: "Image alt text",
    status: !imgs.length ? "info" : missing.length === 0 ? "pass" : pct >= 80 ? "warn" : "fail",
    detail: !imgs.length
      ? "No images found."
      : `${withAlt.length} of ${imgs.length} images have alt text (${pct}%)${decorative.length ? `, ${decorative.length} marked decorative with empty alt` : ""}${missing.length ? `, ${missing.length} have no alt attribute` : ""}.`,
    why: "Alt text describes an image for screen readers and for search engines, which can't see the picture.",
    fix: !imgs.length ? "Add at least one image that shows something the text explains, with a short alt description." : missing.length ? "Describe each image in a short alt attribute. Use alt=\"\" only for purely decorative images." : undefined,
    list: missing.slice(0, 6).map((i) => ({ text: i.src.slice(0, 120) })),
  });

  // Links
  const mainLinks = page.links.filter((l) => l.inMain);
  const pool = mainLinks.length ? mainLinks : page.links;
  const internal = new Set(pool.filter((l) => l.internal && l.href.split("#")[0] !== page.url.split("#")[0]).map((l) => l.href));
  const external = new Set(pool.filter((l) => !l.internal).map((l) => l.href));
  items.push({
    id: "internal-links",
    label: "Internal links",
    status: internal.size >= 3 ? "pass" : internal.size >= 1 ? "warn" : "fail",
    detail: `${plural(internal.size, "link")} to other pages on your site${mainLinks.length ? " inside the post" : ""}.`,
    why: "Links to your own pages help readers keep going and help search engines see which pages matter most.",
    fix: internal.size < 3 ? "Link to 2 or 3 related pages, such as a service page and another post, with descriptive anchor text." : undefined,
  });
  items.push({
    id: "external-links",
    label: "External links",
    status: external.size >= 1 ? "pass" : "warn",
    detail: `${plural(external.size, "link")} to other websites${mainLinks.length ? " inside the post" : ""}.`,
    why: "Citing a trustworthy source for a fact or figure shows readers and AI tools where the claim comes from.",
    fix: external.size ? undefined : "Link the source for any statistic or claim, ideally the original study or official page.",
  });

  // Schema
  const articleTypes = page.jsonLdTypes.filter((t) => ARTICLE_TYPES.includes(t));
  items.push({
    id: "article-schema",
    label: "Article or BlogPosting schema",
    status: articleTypes.length ? "pass" : "warn",
    detail: articleTypes.length ? `Found ${articleTypes.join(", ")} structured data.` : page.jsonLdTypes.length ? `Structured data found (${page.jsonLdTypes.slice(0, 6).join(", ")}), but no Article or BlogPosting.` : "No JSON-LD structured data.",
    why: "BlogPosting schema states the headline, author and dates in a format machines read directly.",
    fix: articleTypes.length ? undefined : "Add BlogPosting JSON-LD with headline, author, datePublished, dateModified and image. Yoast, Rank Math and most blog platforms can do this.",
  });

  // Canonical
  const canon = page.canonical;
  const sameAsPage = canon && canon.replace(/\/$/, "") === page.url.replace(/[?#].*$/, "").replace(/\/$/, "");
  items.push({
    id: "canonical",
    label: "Canonical URL",
    status: !canon ? "warn" : sameAsPage ? "pass" : "warn",
    detail: !canon ? "No canonical link tag." : sameAsPage ? "Canonical points to this page." : `Canonical points to a different URL: ${canon}`,
    why: "The canonical tag tells search engines which URL is the original when the same post is reachable at more than one address.",
    fix: !canon ? "Add <link rel=\"canonical\"> pointing to the post's own URL." : sameAsPage ? undefined : "If this post is the original, point the canonical at this URL.",
  });

  // OG image
  items.push({
    id: "og-image",
    label: "Open Graph image",
    status: page.ogImage ? "pass" : "warn",
    detail: page.ogImage ? `og:image is set.` : "No og:image.",
    why: "The Open Graph image is the picture shown when the post is shared on LinkedIn, Facebook, Slack or iMessage.",
    fix: page.ogImage ? undefined : "Set a 1200 x 630 featured image and make sure your SEO plugin outputs it as og:image.",
  });

  // Readability
  const fre = fleschReadingEase(page.mainText);
  items.push({
    id: "readability",
    label: "Readability (Flesch reading ease)",
    status: fre === null ? "info" : fre >= 50 ? "pass" : fre >= 30 ? "warn" : "fail",
    detail: fre === null ? "Not enough text to score." : `Score ${fre} out of 100. ${fre >= 60 ? "Easy to read." : fre >= 50 ? "Fairly easy to read." : fre >= 30 ? "Fairly hard to read." : "Hard to read."}`,
    why: "Shorter sentences and plain words keep readers on the page. This is a rough estimate from sentence and word length.",
    fix: fre !== null && fre < 50 ? "Split long sentences, swap jargon for plain words, and use lists for steps." : undefined,
  });

  return items;
}

export type LinkCheck = { href: string; status: number; error?: string };

export function brokenLinksItem(results: LinkCheck[], total: number): CheckItem {
  const broken = results.filter((r) => (r.status >= 400 && ![401, 403, 429].includes(r.status)) || r.error === "Domain not found");
  const unsure = results.filter((r) => !broken.includes(r) && (r.status === 0 || [401, 403, 429].includes(r.status)));
  return {
    id: "broken-links",
    label: "Broken links",
    status: broken.length ? "fail" : unsure.length ? "warn" : "pass",
    detail: `Checked ${results.length} of ${total} links. ${broken.length ? `${plural(broken.length, "link")} broken.` : "None broken."}${unsure.length ? ` ${unsure.length} couldn't be confirmed (blocked or timed out).` : ""}`,
    why: "Broken links frustrate readers and waste the trust a citation is supposed to add.",
    fix: broken.length ? "Update or remove each broken link. For a moved page, link the new URL." : unsure.length ? "Open the unconfirmed links in a browser to make sure they still work." : undefined,
    list: [...broken, ...unsure].slice(0, 20).map((r) => ({ text: r.href, href: r.href, note: r.status ? `HTTP ${r.status}` : r.error })),
  };
}

export async function checkLinks(scan: Scan, hrefs: string[]): Promise<LinkCheck[]> {
  return mapLimit(hrefs, 5, async (href) => {
    try {
      let res = await scan.fetch(href, { method: "HEAD", timeoutMs: 5000 });
      if (res.status === 0 || res.status === 405 || res.status === 501 || res.status === 400 || res.status === 403 || res.status === 404) {
        if (!scan.canFetch()) return { href, status: res.status, error: res.error };
        res = await scan.fetch(href, { headersOnly: true, timeoutMs: 5000, ua: UA.browser });
      }
      return { href, status: res.status, error: res.error };
    } catch (e) {
      return { href, status: 0, error: e instanceof ToolError ? "Skipped (not a public address)" : "Couldn't check" };
    }
  });
}

export async function runBlogSeo(input: string): Promise<ToolReport> {
  const start = checkUrl(input, { allowBare: true });
  const scan = new Scan({ budgetMs: 40_000, maxFetches: 50 });
  const res = await scan.fetch(start, { ua: UA.browser, expect: "html" });
  if (!res.ok || res.wrongType) {
    throw new ToolError(loadError(res), 422);
  }
  const page = parsePage(res.body, res.finalUrl);
  const items = analyzeBlogPost(page);
  const notes: string[] = [];
  if (res.truncated) notes.push("The page is over 2 MB, so we only read the first 2 MB.");

  const mainLinks = page.links.filter((l) => l.inMain);
  const unique = [...new Set((mainLinks.length ? mainLinks : page.links).map((l) => l.href))];
  const sample = unique.slice(0, 20);
  if (sample.length) {
    const results = await checkLinks(scan, sample);
    items.push(brokenLinksItem(results, unique.length));
    if (unique.length > sample.length) notes.push(`The post has ${unique.length} links. We checked the first ${sample.length}.`);
  }
  return { tool: "blog-seo", checked: res.finalUrl, items, summary: summarize(items), notes };
}
