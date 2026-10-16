// FAQ schema generator: pure functions shared by the client tool and its tests.
// Nothing here touches the network. Answers keep only the HTML tags Google's FAQ
// documentation allowed (h1-h6, br, ol, ul, li, a, p, div, b, strong, i, em);
// everything else is stripped down to its text. Questions are plain text.

export type FaqPair = { q: string; a: string };
export type FaqWarning = { level: "error" | "warn" | "info"; text: string };

const ALLOWED = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "br", "ol", "ul", "li", "a", "p", "div", "b", "strong", "i", "em"]);
/** Answers longer than this read as an article, not an answer, and get cut when quoted. */
export const LONG_ANSWER_WORDS = 120;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Keeps http(s), mailto and same-site links. Anything else (javascript:, data:) is dropped. */
function safeHref(raw: string): string | null {
  const href = raw.trim().replace(/&amp;/g, "&");
  if (/^(https?:|mailto:)/i.test(href) || /^[/#]/.test(href)) return href;
  return null;
}

/**
 * Cleans answer HTML down to the allowed tags. Attributes are dropped except a safe
 * href on links. Script and style blocks are removed with their contents, and a
 * stray "<" that doesn't start a tag is escaped.
 */
export function cleanAnswerHtml(html: string): string {
  const noBlocks = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  let out = "";
  let last = 0;
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/g;
  for (let m = tag.exec(noBlocks); m; m = tag.exec(noBlocks)) {
    out += noBlocks.slice(last, m.index).replace(/</g, "&lt;");
    last = tag.lastIndex;
    const [, close, rawName, attrs] = m;
    const name = rawName.toLowerCase();
    if (!ALLOWED.has(name)) continue;
    if (close) {
      if (name !== "br") out += `</${name}>`;
      continue;
    }
    if (name === "br") {
      out += "<br>";
    } else if (name === "a") {
      const hrefMatch = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
      const href = hrefMatch ? safeHref(hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "") : null;
      out += href ? `<a href="${escapeHtml(href)}">` : "<a>";
    } else {
      out += `<${name}>`;
    }
  }
  out += noBlocks.slice(last).replace(/</g, "&lt;");
  return out.trim();
}

/** Plain text from HTML: tags removed, common entities decoded, whitespace collapsed. */
export function plainText(s: string): string {
  return s
    .replace(/<\/?[a-zA-Z][^<>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/ ([?.!,;:])/g, "$1")
    .trim();
}

const wordCount = (s: string) => (plainText(s).match(/\S+/g) ?? []).length;

/** The pairs that go into the output: both sides filled in, question as plain text, answer cleaned. */
export function completePairs(pairs: FaqPair[]): FaqPair[] {
  return pairs
    .map((p) => ({ q: plainText(p.q), a: cleanAnswerHtml(p.a) }))
    .filter((p) => p.q && plainText(p.a));
}

/** The FAQPage object for a set of pairs. Incomplete pairs are left out. */
export function buildFaqJsonLd(pairs: FaqPair[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: completePairs(pairs).map((p) => ({
      "@type": "Question",
      name: p.q,
      acceptedAnswer: { "@type": "Answer", text: p.a },
    })),
  };
}

/**
 * The full <script> tag. "<", ">" and "&" are written as \u escapes so an answer
 * can never close the script tag early; JSON parsers read them back as the same text.
 */
export function faqJsonLdScript(pairs: FaqPair[]): string {
  const json = JSON.stringify(buildFaqJsonLd(pairs), null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

/** The visible FAQ block that matches the schema, as <details>/<summary> pairs. */
export function faqHtml(pairs: FaqPair[], heading = "Frequently asked questions"): string {
  const items = completePairs(pairs).map((p) => {
    const answer = /^<(p|div|ol|ul|h[1-6])>/.test(p.a) ? p.a : `<p>${p.a}</p>`;
    return `  <details>\n    <summary>${escapeHtml(p.q)}</summary>\n    ${answer}\n  </details>`;
  });
  return `<section class="faq">\n  <h2>${escapeHtml(heading)}</h2>\n${items.join("\n")}\n</section>`;
}

/** Problems worth fixing before the markup goes on a page. */
export function validateFaqs(pairs: FaqPair[]): FaqWarning[] {
  const out: FaqWarning[] = [];
  const seen = new Map<string, number>();
  pairs.forEach((p, i) => {
    const n = i + 1;
    const q = plainText(p.q);
    const a = plainText(p.a);
    if (!q && !a) return;
    if (q && !a) out.push({ level: "error", text: `Question ${n} has no answer, so it's left out of the markup.` });
    if (!q && a) out.push({ level: "error", text: `Answer ${n} has no question, so it's left out of the markup.` });
    if (q) {
      const key = q.toLowerCase().replace(/[^a-z0-9 ]/g, "");
      const first = seen.get(key);
      if (first) out.push({ level: "warn", text: `Question ${n} repeats question ${first}. Merge them or ask something different.` });
      else seen.set(key, n);
      if (/<[a-z]/i.test(p.q)) out.push({ level: "info", text: `Question ${n} had HTML. Questions are plain text, so the tags were removed.` });
    }
    if (a) {
      const words = wordCount(p.a);
      if (words > LONG_ANSWER_WORDS) out.push({ level: "warn", text: `Answer ${n} is ${words} words. Keep answers under ${LONG_ANSWER_WORDS} words so they can be quoted whole.` });
      if (hasDisallowedHtml(p.a)) {
        out.push({ level: "info", text: `Answer ${n} had tags or attributes FAQ markup doesn't allow. They were removed and the text kept.` });
      }
    }
  });
  const complete = completePairs(pairs).length;
  if (complete === 1) out.push({ level: "info", text: "One question isn't much of an FAQ. Most FAQ sections have three to eight." });
  return out;
}

/** True when an answer has a tag outside the allowed list, or attributes other than a link's href. */
export function hasDisallowedHtml(html: string): boolean {
  if (/<(script|style)\b/i.test(html)) return true;
  for (const m of html.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/g)) {
    const name = m[1].toLowerCase();
    const attrs = m[2].replace(/\/\s*$/, "").trim();
    if (!ALLOWED.has(name)) return true;
    if (!attrs) continue;
    const href = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
    if (name === "a" && href && !safeHref(href[1] ?? href[2] ?? href[3] ?? "")) return true;
    if (name !== "a" || attrs.replace(/\bhref\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+)/i, "").trim()) return true;
  }
  return false;
}

/**
 * Reads FAQ pairs back out of existing markup: raw JSON, a <script> tag, an array
 * of nodes or an @graph. Throws with a readable message when there's no FAQPage.
 */
export function parseFaqJsonLd(input: string): FaqPair[] {
  const scripts = [...input.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const sources = scripts.length ? scripts : [input];
  for (const src of sources) {
    let data: unknown;
    try {
      data = JSON.parse(src.trim());
    } catch {
      continue;
    }
    const page = findFaqPage(data);
    if (!page) continue;
    const entities = Array.isArray(page.mainEntity) ? page.mainEntity : page.mainEntity ? [page.mainEntity] : [];
    const pairs = entities
      .map((e: Record<string, unknown>) => {
        const accepted = e?.acceptedAnswer as Record<string, unknown> | Record<string, unknown>[] | undefined;
        const answer = Array.isArray(accepted) ? accepted[0] : accepted;
        return { q: String(e?.name ?? ""), a: String(answer?.text ?? "") };
      })
      .filter((p: FaqPair) => p.q || p.a);
    if (pairs.length) return pairs;
  }
  throw new Error("No FAQPage markup found. Paste the JSON-LD or the whole <script> tag.");
}

function findFaqPage(node: unknown): { mainEntity?: unknown } | null {
  if (Array.isArray(node)) {
    for (const n of node) {
      const hit = findFaqPage(n);
      if (hit) return hit;
    }
    return null;
  }
  if (!node || typeof node !== "object") return null;
  const obj = node as Record<string, unknown>;
  const type = obj["@type"];
  if (type === "FAQPage" || (Array.isArray(type) && type.includes("FAQPage"))) return obj as { mainEntity?: unknown };
  return obj["@graph"] ? findFaqPage(obj["@graph"]) : null;
}
