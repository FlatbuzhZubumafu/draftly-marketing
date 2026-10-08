import sanitize from "sanitize-html";

// sanitize-html parses with htmlparser2, so it runs in Vercel functions.
// isomorphic-dompurify pulled in jsdom, which failed to load there
// (ERR_REQUIRE_ESM), so any post rendered at request time returned 500.
const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "b", "i", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "img",
  "figure", "figcaption", "hr", "span", "div", "pre", "code",
];
// `id` keeps in-page anchors working (legal pages' table of contents, post jump links).
const ALLOWED_ATTR = ["id", "href", "src", "alt", "title", "class", "target", "rel", "width", "height"];

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
const escapeAttr = (value: string) => value.replace(/&(?!#?\w+;)/g, "&amp;").replace(/"/g, "&quot;");

/**
 * Fixes two WordPress editor habits in sanitized post HTML: headings with no text
 * (an image wrapped in an h2) become plain blocks, and images with an empty or
 * missing alt get `fallbackAlt`.
 */
export function tidyPostHtml(html: string, fallbackAlt: string): string {
  const alt = escapeAttr(fallbackAlt);
  return html
    .replace(HEADING, (match, _tag: string, attrs: string | undefined, inner: string) =>
      hasText(inner) ? match : `<div${attrs ?? ""}>${inner}</div>`,
    )
    .replace(/<img\b([^>]*)>/gi, (match, attrs: string) => {
      const current = /\salt="([^"]*)"/i.exec(attrs)?.[1] ?? "";
      if (current.trim()) return match;
      return `<img alt="${alt}"${attrs.replace(/\salt="[^"]*"/i, "")}>`;
    });
}

/** Promotes the first heading to an h1 when the HTML has none, so the page has exactly one. */
export function ensureH1(html: string): string {
  if (/<h1[\s>]/i.test(html)) return html;
  let done = false;
  return html.replace(HEADING, (match, _tag: string, attrs: string | undefined, inner: string) => {
    if (done || !hasText(inner)) return match;
    done = true;
    return `<h1${attrs ?? ""}>${inner}</h1>`;
  });
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
  return out;
}
