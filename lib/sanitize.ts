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
