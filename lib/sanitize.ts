import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "b", "i", "a", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "img",
      "figure", "figcaption", "hr", "span", "div", "pre", "code",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "target", "rel", "width", "height"],
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
