// Free E-E-A-T check: does a post show who wrote it, why they're qualified, and
// where its facts come from?
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, UA, loadError, type FetchResult } from "../fetcher.ts";
import { parsePage, typesOf, type PageInfo } from "../html.ts";
import { summarize, type CheckItem, type ToolReport } from "../types.ts";

type Node = Record<string, unknown>;

const SOCIAL = /(^|\.)(facebook|twitter|x|linkedin|instagram|pinterest|tiktok|youtube|reddit|threads|whatsapp|t)\.(com|me|net)$/;
const SHARE = /\/(share|sharer|intent|shareArticle)\b|[?&](url|u)=/i;
const AUTHORITATIVE_HOST = /\.(gov|edu|mil|int)$|\.gov\.[a-z]{2}$|\.ac\.[a-z]{2}$|(^|\.)(wikipedia\.org|who\.int|nih\.gov|cdc\.gov|census\.gov|bls\.gov|ftc\.gov|irs\.gov|sba\.gov|nature\.com|sciencedirect\.com|springer\.com|jamanetwork\.com|nejm\.org|thelancet\.com|bmj\.com|pubmed\.ncbi\.nlm\.nih\.gov|developers\.google\.com|support\.google\.com|w3\.org|schema\.org|ietf\.org|iso\.org|pewresearch\.org|reuters\.com|apnews\.com|arxiv\.org)$/;

/** All Person nodes on the page, including ones nested as an article's author. */
export function findPeople(page: PageInfo): Node[] {
  const out: Node[] = [];
  const walk = (v: unknown, depth: number) => {
    if (depth > 6 || !v || typeof v !== "object") return;
    if (Array.isArray(v)) return v.forEach((x) => walk(x, depth + 1));
    const o = v as Node;
    if (typesOf(o).includes("Person")) out.push(o);
    Object.values(o).forEach((x) => walk(x, depth + 1));
  };
  page.jsonLd.forEach((n) => walk(n, 0));
  // Merge @id references so a stub {"@id": "#me"} picks up the full node's fields.
  const byId = new Map<string, Node>();
  for (const p of out) if (typeof p["@id"] === "string") byId.set(p["@id"] as string, { ...(byId.get(p["@id"] as string) ?? {}), ...p });
  return out.map((p) => (typeof p["@id"] === "string" ? byId.get(p["@id"] as string)! : p));
}

/** The author named in the article schema (Person or Organization), if any. */
export function schemaAuthor(page: PageInfo): Node | null {
  for (const n of page.jsonLd) {
    const author = n["author"];
    const first = Array.isArray(author) ? author[0] : author;
    if (first && typeof first === "object") return first as Node;
    if (typeof first === "string") return { "@type": "Person", name: first };
  }
  return null;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function schemaDates(page: PageInfo): { published: string; modified: string } {
  let published = "";
  let modified = "";
  for (const n of page.jsonLd) {
    published ||= str(n["datePublished"]);
    modified ||= str(n["dateModified"]);
  }
  return { published, modified };
}

export function bylineItem(page: PageInfo): CheckItem {
  const author = schemaAuthor(page);
  const authorName = str(author?.["name"]);
  const visible = page.bylines.find((b) => b.length >= 3 && /[a-z]/i.test(b));
  const where = visible ? `Visible byline: "${visible.slice(0, 80)}"` : page.metaAuthor ? `Only in the meta tag: "${page.metaAuthor}"` : authorName ? `Only in structured data: "${authorName}"` : "";
  return {
    id: "byline",
    label: "Visible author byline",
    status: visible ? "pass" : page.metaAuthor || authorName ? "warn" : "fail",
    detail: where || "No author name on the page or in its metadata.",
    why: "Readers, Google's quality raters and AI tools all look for a named person behind advice. An anonymous post is harder to trust.",
    fix: visible ? undefined : "Show the author's name near the title, linked to their author page.",
  };
}

export function authorPageItem(link: string | null, res: FetchResult | null, source: "byline" | "schema" = "byline"): CheckItem {
  const why = "An author page shows who the writer is and why they know the topic: experience, credentials and other work.";
  if (!link) {
    return {
      id: "author-page",
      label: "Author page",
      status: "fail",
      detail: "The byline doesn't link to an author page.",
      why,
      fix: "Create an author page with a photo, a short bio of relevant experience and links to their profiles, then link the byline to it.",
    };
  }
  const ok = !!res?.ok;
  return {
    id: "author-page",
    label: "Author page",
    status: ok ? "pass" : "fail",
    detail: ok
      ? source === "byline"
        ? `The byline links to ${link}.`
        : `The author's page is ${link} (from structured data; the visible byline doesn't link to it).`
      : `The author link (${link}) ${res?.status ? `returned HTTP ${res.status}` : `failed: ${res?.error ?? "not checked"}`}.`,
    why,
    fix: ok ? undefined : "Fix the author link so it opens a live author page.",
    list: [{ text: link, href: link }],
  };
}

export function personSchemaItem(page: PageInfo, authorPage: PageInfo | null): CheckItem {
  const people = [...findPeople(page), ...(authorPage ? findPeople(authorPage) : [])];
  const author = schemaAuthor(page);
  const isOrgAuthor = author && typesOf(author).some((t) => t !== "Person") && !typesOf(author).includes("Person");
  const best = people.sort((a, b) => score(b) - score(a))[0];
  const why = "Person schema with sameAs and jobTitle connects the author to their profiles elsewhere, so machines can confirm who they are.";
  if (!best) {
    return {
      id: "person-schema",
      label: "Person schema for the author",
      status: "fail",
      detail: isOrgAuthor ? `The article's author is a ${typesOf(author!)[0] ?? "non-person"}, not a Person.` : "No Person structured data found.",
      why,
      fix: "Set the article's author to a Person with name, url, jobTitle and sameAs links (LinkedIn, professional profiles). Yoast, Rank Math and most SEO plugins fill this from the user profile.",
    };
  }
  const has = { name: !!str(best["name"]), sameAs: !!best["sameAs"] && (Array.isArray(best["sameAs"]) ? (best["sameAs"] as unknown[]).length > 0 : !!str(best["sameAs"])), jobTitle: !!str(best["jobTitle"]) };
  const missing = Object.entries(has).filter(([, v]) => !v).map(([k]) => k);
  return {
    id: "person-schema",
    label: "Person schema for the author",
    status: missing.length === 0 ? "pass" : has.name ? "warn" : "fail",
    detail: `Person "${str(best["name"]) || "(no name)"}"${missing.length ? `, missing ${missing.join(", ")}` : " with name, jobTitle and sameAs"}.`,
    why,
    fix: missing.length ? `Add ${missing.join(" and ")} to the author's Person schema.` : undefined,
  };
}

function score(p: Node): number {
  return ["name", "sameAs", "jobTitle", "url", "description"].filter((k) => !!p[k]).length;
}

export function pageReachItem(kind: "about" | "contact", found: { url: string; res: FetchResult } | null, tried: string[]): CheckItem {
  const label = kind === "about" ? "About page" : "Contact page";
  const why =
    kind === "about"
      ? "An About page says who runs the site and why it exists. It's one of the first places a quality rater looks."
      : "A way to reach a real business is a basic trust signal for readers, Google and AI tools.";
  if (found?.res.ok) {
    return { id: kind, label, status: "pass", detail: `Found ${found.res.finalUrl}.`, why };
  }
  return {
    id: kind,
    label,
    status: "fail",
    detail: found ? `${found.url} returned ${found.res.status ? `HTTP ${found.res.status}` : found.res.error}.` : `No ${kind} page linked from the post or homepage${tried.length ? `, and ${tried.join(", ")} didn't load` : ""}.`,
    why,
    fix: kind === "about" ? "Publish an About page (who you are, what you do, how long, for whom) and link it in the main menu or footer." : "Publish a Contact page with an email, phone or form, and a business address if you have one. Link it in the footer.",
  };
}

export function datesItem(page: PageInfo): CheckItem {
  const s = schemaDates(page);
  const published = s.published || page.publishedTime || page.timeElements[0] || "";
  const modified = s.modified || page.modifiedTime || "";
  return {
    id: "dates",
    label: "Published and updated dates",
    status: published && modified ? "pass" : published || modified ? "warn" : "fail",
    detail: [published && `Published: ${published.slice(0, 25)}`, modified && `Updated: ${modified.slice(0, 25)}`].filter(Boolean).join(". ") || "No publish or update date found.",
    why: "Dates tell readers whether advice is current. Google and AI tools use them to judge freshness.",
    fix: published && modified ? undefined : "Show the publish date on the post, add an \"Updated\" date when you revise it, and include datePublished and dateModified in the article schema.",
  };
}

export function citationsItem(page: PageInfo): CheckItem {
  const main = page.links.filter((l) => l.inMain);
  const pool = main.length ? main : page.links;
  const ext = [...new Map(pool.filter((l) => !l.internal).map((l) => [l.href, l])).values()].filter((l) => {
    const h = new URL(l.href).hostname.replace(/^www\./, "");
    return !SOCIAL.test(h) && !SHARE.test(l.href);
  });
  const auth = ext.filter((l) => AUTHORITATIVE_HOST.test(new URL(l.href).hostname.replace(/^www\./, "")));
  return {
    id: "citations",
    label: "Citations to authoritative sources",
    status: auth.length >= 1 && ext.length >= 2 ? "pass" : ext.length ? "warn" : "fail",
    detail: `${ext.length} outbound link${ext.length === 1 ? "" : "s"} in the post, ${auth.length} to a government, university, standards or major research source.`,
    why: "Linking the source of a fact shows your work. AI assistants favor pages whose claims they can check.",
    fix: auth.length >= 1 && ext.length >= 2 ? undefined : "Link the original source for each statistic or claim: a study, an official guideline or the primary data.",
    list: auth.slice(0, 8).map((l) => ({ text: l.href, href: l.href })),
  };
}

function findLink(pages: PageInfo[], kind: "about" | "contact"): string | null {
  const re = kind === "about" ? /\/(about|about-us|our-story|who-we-are|team)(\/|$|\.html?)/i : /\/(contact|contact-us|get-in-touch|support)(\/|$|\.html?)/i;
  const textRe = kind === "about" ? /^(about|about us|our story|who we are)$/i : /^(contact|contact us|get in touch)$/i;
  for (const p of pages) {
    const hit = p.links.find((l) => l.internal && (re.test(new URL(l.href).pathname) || textRe.test(l.text)));
    if (hit) return hit.href;
  }
  return null;
}

export async function runEeat(input: string, homepageInput?: string): Promise<ToolReport> {
  const start = checkUrl(input, { allowBare: true });
  const homeUrl = homepageInput?.trim() ? checkUrl(homepageInput, { allowBare: true }) : null;
  const scan = new Scan({ budgetMs: 35_000, maxFetches: 20 });
  const notes: string[] = [];

  const res = await scan.fetch(start, { ua: UA.browser, expect: "html" });
  if (!res.ok || res.wrongType) {
    throw new ToolError(loadError(res), 422);
  }
  const page = parsePage(res.body, res.finalUrl);
  const origin = new URL(res.finalUrl).origin;

  const homeTarget = homeUrl ? homeUrl.href : `${origin}/`;
  const author = schemaAuthor(page);
  const bylineLink = page.authorLinks.find((l) => l !== res.finalUrl) ?? null;
  const schemaUrl = (() => {
    try {
      const u = new URL(str(author?.["url"]), res.finalUrl);
      return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
    } catch {
      return null;
    }
  })();
  const authorLink = bylineLink ?? (str(author?.["url"]) ? schemaUrl : null);

  const [homeRes, authorRes] = await Promise.all([
    homeTarget.replace(/\/$/, "") === res.finalUrl.replace(/\/$/, "") ? Promise.resolve(res) : scan.fetch(homeTarget, { ua: UA.browser, expect: "html" }),
    authorLink ? scan.fetch(authorLink, { ua: UA.browser, expect: "html" }).catch(() => null) : Promise.resolve(null),
  ]);
  const home = homeRes.ok && !homeRes.wrongType ? parsePage(homeRes.body, homeRes.finalUrl) : null;
  if (!home) notes.push("We couldn't load the homepage, so About and Contact links come from the post only.");
  const authorPage = authorRes?.ok && !authorRes.wrongType ? parsePage(authorRes.body, authorRes.finalUrl) : null;

  const pagesForLinks = [page, ...(home ? [home] : [])];
  const findPage = async (kind: "about" | "contact") => {
    const linked = findLink(pagesForLinks, kind);
    const tried: string[] = [];
    if (linked) return { found: { url: linked, res: await scan.fetch(linked, { ua: UA.browser, expect: "html", timeoutMs: 6000 }) }, tried };
    const guesses = kind === "about" ? ["/about", "/about-us"] : ["/contact", "/contact-us"];
    const homeOrigin = home ? new URL(home.url).origin : origin;
    for (const g of guesses) {
      if (!scan.canFetch()) break;
      const url = `${homeOrigin}${g}`;
      tried.push(g);
      const r = await scan.fetch(url, { ua: UA.browser, expect: "html", timeoutMs: 6000 });
      if (r.ok) return { found: { url, res: r }, tried };
    }
    return { found: null, tried };
  };
  const [about, contact] = await Promise.all([findPage("about"), findPage("contact")]);

  const items: CheckItem[] = [
    bylineItem(page),
    authorPageItem(authorLink, authorRes, bylineLink ? "byline" : "schema"),
    personSchemaItem(page, authorPage),
    datesItem(page),
    citationsItem(page),
    pageReachItem("about", about.found, about.tried),
    pageReachItem("contact", contact.found, contact.tried),
  ];
  return { tool: "eeat", checked: res.finalUrl, items, summary: summarize(items), notes };
}
