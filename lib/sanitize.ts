import sanitize from "sanitize-html";

// sanitize-html parses with htmlparser2, so it runs in Vercel functions.
// isomorphic-dompurify pulled in jsdom, which failed to load there
// (ERR_REQUIRE_ESM), so any post rendered at request time returned 500.
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "img",
  "figure", "figcaption", "hr", "span", "div", "pre", "code",
  // Tables: legal pages (cookie, provider and retention tables) and post comparison tables.
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "colgroup", "col",
];
// `id` keeps in-page anchors working (legal pages' table of contents, post jump links).
const ALLOWED_ATTR = ["id", "href", "src", "alt", "title", "class", "target", "rel", "width", "height", "colspan", "rowspan", "scope"];

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { "*": ALLOWED_ATTR },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}

const HEADING = /<(h[1-6])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
const hasText = (html: string) => html.replace(/<[^>]*>/g, "").replace(/&nbsp;|&#160;|\s/g, "") !== "";
const headingId = (inner: string) =>
  inner.replace(/<[^>]*>/g, "").replace(/&amp;/g, " and ").replace(/&[#\w]+;/g, " ").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "section";
const escapeAttr = (value: string) => value.replace(/&(?!#?\w+;)/g, "&amp;").replace(/"/g, "&quot;");

/**
 * Fixes WordPress editor habits in sanitized post HTML: headings with no text
 * (an image wrapped in an h2) become plain blocks, and images with an empty or
 * missing alt get `fallbackAlt`.
 */
export function tidyPostHtml(html: string, fallbackAlt: string): string {
  const alt = escapeAttr(fallbackAlt);
  const used = new Set<string>();
  return html
    .replace(HEADING, (match, tag: string, attrs: string | undefined, inner: string) => {
      if (!hasText(inner)) return `<div${attrs ?? ""}>${inner}</div>`;
      // Give H2s a stable id so the "On this page" list and shared #links work.
      if (tag.toLowerCase() !== "h2" || /\sid="/i.test(attrs ?? "")) return match;
      let id = headingId(inner);
      while (used.has(id)) id += "-2";
      used.add(id);
      return `<h2 id="${id}"${attrs ?? ""}>${inner}</h2>`;
    })
    .replace(/<img\b([^>]*)>/gi, (match, attrs: string) => {
      const current = /\salt="([^"]*)"/i.exec(attrs)?.[1] ?? "";
      if (current.trim()) return match;
      return `<img alt="${alt}"${attrs.replace(/\salt="[^"]*"/i, "")}>`;
    });
}

/** Turns every h1 in WordPress body copy into an h2, so the page's own title stays the only h1. */
export function demoteH1s(html: string): string {
  return html.replace(/<(\/?)h1(?=[\s>])/gi, "<$1h2");
}

// Termly links to a few targets its export never defines. Point those at the
// section that holds the text, and give the table of contents its own target.
const LEGAL_ANCHOR_ALIASES: Record<string, string> = { personalinfo: "infocollect", othersources: "infocollect" };

/** Repairs in-page links in the Termly legal copy so every `#anchor` lands somewhere. */
export function fixLegalAnchors(html: string): string {
  let out = html.replace(/href="#([^"]+)"/g, (match, id: string) =>
    LEGAL_ANCHOR_ALIASES[id] ? `href="#${LEGAL_ANCHOR_ALIASES[id]}"` : match,
  );
  if (!/\bid="toc"/.test(out)) out = out.replace(/TABLE OF CONTENTS/, '<span id="toc"></span>TABLE OF CONTENTS');
  // Section headings without an id get one from their text, minus the section
  // number, so other pages can link to a section that keeps its name when the
  // numbering changes ("4. Billing, cancellation and refunds" ->
  // #billing-cancellation-and-refunds).
  const used = new Set<string>();
  out = out.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi, (match, attrs: string | undefined, inner: string) => {
    if (/\sid="/i.test(attrs ?? "") || !hasText(inner)) return match;
    let id = headingId(inner.replace(/<[^>]*>/g, "").replace(/^\s*\d+\.\s*/, ""));
    while (used.has(id)) id += "-2";
    used.add(id);
    return `<h2 id="${id}"${attrs ?? ""}>${inner}</h2>`;
  });
  return out;
}
