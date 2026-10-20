// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/editor-text.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Copied verbatim except splitSentences and assemble, which the detector doesn't use.
//
// Text handling for the Draftly Editor ("Fix my copy"): turn pasted text, HTML
// or a fetched page into Markdown, split it into editable units (sentences and
// headings), and put it back together after edits.
//
// Units are the grain of every edit: the checker flags units, the model only
// ever rewrites flagged units, and everything else is reassembled byte for
// byte. Blockquotes, code and tables are kept as protected blocks the editor
// never touches.

import { decodeHtmlEntities } from "./html-entities.ts";
import { DROPPED_TAGS, removeShortcodes, TAG_ATTRS, TAG_RE } from "./html-tokens.ts";
import { stripVisualSuggestions } from "./visual-suggestions.ts";

export type BlockKind = "heading" | "paragraph" | "list_item" | "protected";

export interface Unit {
  /** Stable id within one document, e.g. "u12". */
  id: string;
  text: string;
}

export interface Block {
  kind: BlockKind;
  /** Markdown prefix kept verbatim: "## ", "- ", "1. ", "" ... */
  prefix: string;
  units: Unit[];
  /** For protected blocks, the original markdown, emitted unchanged. */
  raw?: string;
  /** What goes before unit i: "" between Japanese or Chinese sentences, which have no space. Missing means one space. */
  joins?: string[];
}

export interface Segmented {
  blocks: Block[];
  units: Unit[];
}

/** Every HTML character reference decoded (the full HTML5 list), and non-breaking spaces as spaces. */
export function decodeEntities(s: string): string {
  return decodeHtmlEntities(s).replace(/\u00a0/g, " ");
}

export function looksLikeHtml(s: string): boolean {
  return /<\/?(p|div|h[1-6]|ul|ol|li|article|section|br|span|a|strong|em|b|i|blockquote|img|figure|figcaption|table|pre|code|hr)\b[^>]*>/i.test(s) ||
    /<!--\s*\/?wp:/.test(s);
}

/** Tag patterns with quote-aware attributes ("@A"), so `alt="a > b"` never ends a tag early. */
const rx = (src: string, flags = "gi") => new RegExp(src.split("@A").join(TAG_ATTRS), flags);
const DROPPED_RE = rx(`<(${DROPPED_TAGS.join("|")})\\b@A>[\\s\\S]*?<\\/\\1\\s*>`);

const inline = (html: string) =>
  decodeEntities(
    html
      .replace(rx(`<br\\b@A>`), " ")
      .replace(rx(`<(strong|b)\\b@A>([\\s\\S]*?)<\\/\\1>`), "**$2**")
      .replace(rx(`<(em|i)\\b@A>([\\s\\S]*?)<\\/\\1>`), "*$2*")
      .replace(rx(`<a\\b(?:[^>"']|"[^"]*"|'[^']*')*?\\shref=(?:"([^"]+)"|'([^']+)')@A>([\\s\\S]*?)<\\/a>`), (_m, dq, sq, body) => `[${body}](${dq ?? sq})`)
      .replace(rx(`<code\\b@A>([\\s\\S]*?)<\\/code>`), "`$1`")
      .replace(TAG_RE, ""),
  ).replace(/[ \t\r\n]+/g, " ").trim();

/** HTML to simple Markdown: headings, paragraphs, lists, quotes, code. Everything else becomes text. */
export function htmlToMarkdown(html: string): string {
  let s = html
    // A Custom HTML or Shortcode block is the author's own code, not prose (the patcher skips it too).
    .replace(/<!--\s*wp:(html|shortcode)\b[\s\S]*?<!--\s*\/wp:\1\s*-->/g, "\n\n")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Table cells and quote citations are separate words, not glued to their neighbors.
    .replace(/<\/(td|th)>/gi, " </$1>")
    .replace(/<cite\b/gi, " <cite")
    .replace(DROPPED_RE, "");
  const out: string[] = [];
  const pre: string[] = [];
  s = s.replace(rx(`<pre\\b@A>([\\s\\S]*?)<\\/pre>`), (_, body) => {
    pre.push("```\n" + decodeEntities(body.replace(TAG_RE, "")).trim() + "\n```");
    return `\n\u0000PRE${pre.length - 1}\u0000\n`;
  });
  // Tables and definition lists are data, not prose: keep each as a Markdown
  // table, which segment() protects, so cells stay apart and are never
  // flagged or rewritten as sentences.
  const protect = (rows: string[][]) => {
    if (!rows.length) return "";
    const width = Math.max(...rows.map((r) => r.length));
    const line = (r: string[]) => `| ${Array.from({ length: width }, (_, i) => (r[i] ?? "").replace(/\|/g, "\\|")).join(" | ")} |`;
    pre.push([line(rows[0]), `|${" --- |".repeat(width)}`, ...rows.slice(1).map(line)].join("\n"));
    return `\n\u0000PRE${pre.length - 1}\u0000\n`;
  };
  s = s.replace(rx(`<table\\b@A>([\\s\\S]*?)<\\/table>`), (_, body) =>
    protect(
      [...body.matchAll(rx(`<tr\\b@A>([\\s\\S]*?)<\\/tr>`))]
        .map((r) => [...r[1].matchAll(rx(`<(td|th)\\b@A>([\\s\\S]*?)<\\/\\1\\s*>`))].map((c) => inline(c[2])))
        .filter((cells) => cells.some(Boolean)),
    ));
  s = s.replace(rx(`<dl\\b@A>([\\s\\S]*?)<\\/dl>`), (_, body) => {
    const rows: string[][] = [];
    for (const m of body.matchAll(rx(`<(dt|dd)\\b@A>([\\s\\S]*?)<\\/\\1\\s*>`))) {
      const text = inline(m[2]);
      if (m[1].toLowerCase() === "dt" || !rows.length) rows.push([text]);
      else rows[rows.length - 1].push(text);
    }
    return protect(rows);
  });
  s = s.replace(rx(`<blockquote\\b@A>([\\s\\S]*?)<\\/blockquote>`), (_, body) => {
    const text = inline(body.replace(rx(`<\\/p>\\s*<p\\b@A>`), " "));
    return text ? `\n\u0000Q${text}\u0000\n` : "";
  });
  s = s.replace(rx(`<h([1-6])\\b@A>([\\s\\S]*?)<\\/h\\1>`), (_, n, body) => `\n\u0000H${n}${inline(body)}\u0000\n`);
  s = s.replace(rx(`<li\\b@A>([\\s\\S]*?)<\\/li>`), (_, body) => `\n\u0000L${inline(body)}\u0000\n`);
  s = s.replace(/<\/(p|div|section|article|ul|ol|table|tr)>/gi, "\n\n").replace(rx(`<(p|div|tr)\\b@A>`), "\n\n");
  for (const chunk of s.split(/\n{2,}|\n(?=\u0000)|(?<=\u0000)\n/)) {
    const c = chunk.trim();
    if (!c) continue;
    const m = c.match(/^\u0000(H([1-6])|L|Q|PRE(\d+))([\s\S]*)\u0000$/);
    if (m) {
      if (m[1].startsWith("H")) out.push(`${"#".repeat(Number(m[2]))} ${m[4].trim()}`);
      else if (m[1] === "L") out.push(`- ${m[4].trim()}`);
      else if (m[1] === "Q") out.push(`> ${m[4].trim()}`);
      else out.push(pre[Number(m[3])]);
      continue;
    }
    const text = inline(c.replace(/\u0000[^\u0000]*\u0000/g, " "));
    if (text) out.push(text);
  }
  // Join list items into one block; everything else is its own paragraph.
  return out.reduce((acc, line, i) => {
    const prevList = i > 0 && /^- /.test(out[i - 1]);
    return acc + (i === 0 ? "" : prevList && /^- /.test(line) ? "\n" : "\n\n") + line;
  }, "").trim();
}

/**
 * WordPress shortcode tags ([caption id="1" ...], [/caption], [gallery ids="1,2"])
 * are markup, not words a reader sees: drop the tags and keep what they wrap.
 * Only tags with attributes, closing tags, bare tags that have a closing
 * partner and known bare shortcodes ([gallery]) are touched, so ordinary
 * bracketed text and Markdown links survive. The content of shortcodes that
 * wrap code or a URL ([embed]URL[/embed], [code]) is dropped too. Shortcodes
 * inside an HTML attribute are left alone. The patcher uses the same rules
 * (html-tokens.ts), so both agree on what is a shortcode.
 */
export function stripShortcodes(text: string): string {
  return removeShortcodes(text);
}

/** Plain text, Markdown or HTML in; Markdown out, with tidy spacing. */
export function normalizeInput(raw: string): string {
  const text = stripShortcodes(String(raw ?? "").replace(/\r\n?/g, "\n"));
  const md = looksLikeHtml(text) ? htmlToMarkdown(text) : text;
  // A [VISUAL SUGGESTION: ...] placeholder (leaked into an older post) is never copy.
  return stripVisualSuggestions(md).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * The main article from a fetched page: <article>, else <main>, else <body>,
 * with navigation, headers, footers, sidebars and forms removed.
 */
export function extractArticle(html: string): { title: string; markdown: string } {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(rx(`<(script|style|noscript|svg|iframe|template)\\b@A>[\\s\\S]*?<\\/\\1\\s*>`), "");
  const pick = (tag: string) => {
    const all = [...cleaned.matchAll(rx(`<${tag}\\b@A>([\\s\\S]*?)<\\/${tag}>`))].map((m) => m[1]);
    return all.sort((a, b) => b.length - a.length)[0] ?? null;
  };
  let body = pick("article") ?? pick("main") ?? pick("body") ?? cleaned;
  body = body.replace(rx(`<(nav|header|footer|aside|form)\\b@A>[\\s\\S]*?<\\/\\1>`), "");
  // A reader on a desktop sees one copy of a responsive layout: drop what is
  // hidden there (a phone-only version of a table, screen-reader-only text)
  // and the page furniture around the article.
  body = removeElements(body, (attrs) => HIDDEN_ATTRS.test(attrs) || hasClass(attrs, DESKTOP_HIDDEN) || hasClassOrId(attrs, PAGE_FURNITURE));
  const h1 = body.match(rx(`<h1\\b@A>([\\s\\S]*?)<\\/h1>`, "i"))?.[1];
  const titleTag = cleaned.match(rx(`<title\\b@A>([\\s\\S]*?)<\\/title>`, "i"))?.[1];
  const title = decodeEntities((h1 ?? titleTag ?? "").replace(TAG_RE, "")).replace(/\s+/g, " ").trim();
  return { title, markdown: dropLinkOnlyBlocks(normalizeInput(htmlToMarkdown(body))) };
}

const HIDDEN_ATTRS = /(?:^|\s)(?:hidden(?=[\s=>]|$)|aria-hidden\s*=\s*["']?true)/i;
/** Hidden at desktop widths (Tailwind/Bootstrap style), or screen-reader only. */
const DESKTOP_HIDDEN = /^(?:(?:sm|md|lg|xl|2xl):hidden|d-(?:sm|md|lg|xl)-none|sr-only|visually-hidden|screen-reader-text)$/;
/** Related-post lists, share bars, newsletter boxes, breadcrumbs and comments are not the article. */
const PAGE_FURNITURE = /^(?:related(?:[-_]posts?)?|keep[-_]reading|read[-_]next|recommended|share|sharing|social[-_]share|newsletter|breadcrumbs?|comments?|post[-_]navigation)$/i;

const attrValue = (attrs: string, name: string) =>
  attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find((v) => v !== undefined) ?? "";
const hasClass = (attrs: string, re: RegExp) => attrValue(attrs, "class").split(/\s+/).some((c) => re.test(c));
const hasClassOrId = (attrs: string, re: RegExp) => hasClass(attrs, re) || re.test(attrValue(attrs, "id"));

const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/** Remove whole elements (with everything inside) whose opening tag's attributes match. Nesting-aware. */
export function removeElements(html: string, matches: (attrs: string) => boolean): string {
  const open = rx(`<([a-zA-Z][\\w-]*)(@A)>`, "g");
  let out = "";
  let at = 0;
  for (let m = open.exec(html); m; m = open.exec(html)) {
    const tag = m[1].toLowerCase();
    if (m[2].trim().endsWith("/") || VOID_TAGS.has(tag) || !matches(m[2])) continue;
    // Walk forward to the matching close tag, counting nested tags of the same name.
    const scan = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    scan.lastIndex = open.lastIndex;
    let depth = 1;
    let end = html.length;
    for (let t = scan.exec(html); t; t = scan.exec(html)) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) {
        end = scan.lastIndex;
        break;
      }
    }
    out += html.slice(at, m.index);
    at = end;
    open.lastIndex = end;
  }
  return out + html.slice(at);
}

/**
 * Blocks made only of links (a "Keep reading" card list, a row of buttons)
 * are navigation, not copy; a heading left with nothing under it goes too.
 */
export function dropLinkOnlyBlocks(markdown: string): string {
  const linkOnly = (line: string) => /\]\(/.test(line) && !line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "").replace(/!?\[[^\]]*\]\([^)]*\)/g, "").replace(/[\s|·•,]+/g, "");
  const blocks = markdown.split(/\n{2,}/).filter((b) => !b.split("\n").every(linkOnly));
  const level = (b: string) => b.match(/^(#{1,6}) /)?.[1].length ?? 0;
  return blocks
    .filter((b, i) => {
      const lv = level(b);
      if (!lv || b.includes("\n")) return true;
      const next = blocks[i + 1];
      return next !== undefined && (level(next) === 0 || level(next) > lv);
    })
    .join("\n\n");
}

const ABBREV = /\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Inc|Ltd|Co|vs|etc|e\.g|i\.e|U\.S|a\.m|p\.m|No|Fig)\.$/i;

/**
 * Scripts written without spaces between words (Chinese, Japanese, Thai...)
 * or without capital letters (Arabic, Hebrew, Hindi...): the Latin rule
 * ("period, space, capital") can't find their sentences or words.
 */
const UNSPACED_SCRIPT = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}\p{Script=Tibetan}]/u;
const UNCASED_SCRIPT = /[\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Gurmukhi}\p{Script=Gujarati}\p{Script=Tamil}\p{Script=Telugu}\p{Script=Kannada}\p{Script=Malayalam}\p{Script=Sinhala}\p{Script=Hangul}\p{Script=Georgian}\p{Script=Ethiopic}]/u;

type Segmenter = { segment(s: string): Iterable<{ segment: string; index: number; isWordLike?: boolean }> };
const segmenters = new Map<string, Segmenter | null>();
function segmenter(granularity: "sentence" | "word"): Segmenter | null {
  if (!segmenters.has(granularity)) {
    // deno-lint-ignore no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const S = (Intl as any).Segmenter;
    segmenters.set(granularity, typeof S === "function" ? new S(undefined, { granularity }) : null);
  }
  return segmenters.get(granularity)!;
}

/** Sentences plus what separated them in the text (joins[i] goes before parts[i]). */
export function splitSentencesWithJoins(text: string): { parts: string[]; joins: string[] } {
  if (UNSPACED_SCRIPT.test(text) || UNCASED_SCRIPT.test(text)) return splitUnicode(text);
  const parts: string[] = [];
  let start = 0;
  // Any capital letter (Ü, É, Ł...), digit or Markdown marker can start the next sentence.
  const re = /[.!?]["”’)\]]*\s+(?=["“‘«(\[]?[\p{Lu}0-9*])/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const end = m.index + m[0].trimEnd().length;
    const candidate = text.slice(start, end);
    if (ABBREV.test(candidate.trimEnd())) continue;
    if (/(^|\s)\p{Lu}\.$/u.test(candidate.trimEnd())) continue; // initials "J. R. Smith"
    parts.push(candidate.trim());
    start = m.index + m[0].length;
  }
  const tail = text.slice(start).trim();
  if (tail) parts.push(tail);
  const kept = parts.filter(Boolean);
  return { parts: kept, joins: kept.map((_, i) => (i === 0 ? "" : " ")) };
}

/** Sentences in any script: Intl.Segmenter where the runtime has it, else terminal punctuation. */
function splitUnicode(text: string): { parts: string[]; joins: string[] } {
  const pieces: string[] = [];
  const seg = segmenter("sentence");
  if (seg) {
    for (const s of seg.segment(text)) pieces.push(s.segment);
  } else {
    for (const m of text.matchAll(/[^.!?。！？؟۔।]*(?:[.!?。！？؟۔।]+["”’)\]」』》]*\s*|$)/gu)) if (m[0]) pieces.push(m[0]);
  }
  // Keep abbreviations and initials with the sentence they belong to, as the Latin rule does.
  const merged: string[] = [];
  for (const p of pieces) {
    const prev = merged[merged.length - 1];
    if (prev !== undefined && (ABBREV.test(prev.trimEnd()) || /(^|\s)\p{Lu}\.$/u.test(prev.trimEnd()) || !/\S/.test(prev))) merged[merged.length - 1] = prev + p;
    else merged.push(p);
  }
  const parts: string[] = [];
  const joins: string[] = [];
  let gap = "";
  for (const p of merged) {
    const t = p.trim();
    if (!t) {
      gap += p;
      continue;
    }
    joins.push(parts.length ? gap + (p.match(/^\s*/)?.[0] ?? "") : "");
    parts.push(t);
    gap = p.match(/\s*$/)?.[0] ?? "";
  }
  return { parts, joins };
}

/** Markdown into blocks of editable units. */
export function segment(markdown: string): Segmented {
  const blocks: Block[] = [];
  const units: Unit[] = [];
  let n = 0;
  const unit = (text: string): Unit => {
    const u = { id: `u${++n}`, text };
    units.push(u);
    return u;
  };
  const chunks: string[] = [];
  // Keep fenced code blocks whole even when they contain blank lines.
  const md = markdown.replace(/```[\s\S]*?```/g, (m) => m.replace(/\n\n/g, "\n\u0001\n"));
  for (const c of md.split(/\n{2,}/)) chunks.push(c.replace(/\u0001/g, ""));
  for (const raw of chunks) {
    const chunk = raw.trim();
    if (!chunk) continue;
    if (/^```/.test(chunk) || /^>/.test(chunk) || /^\|.*\|$/m.test(chunk) || /^!\[/.test(chunk)) {
      blocks.push({ kind: "protected", prefix: "", units: [], raw: chunk });
      continue;
    }
    const heading = chunk.match(/^(#{1,6} )(.+)$/);
    if (heading && !chunk.includes("\n")) {
      blocks.push({ kind: "heading", prefix: heading[1], units: [unit(heading[2].trim())] });
      continue;
    }
    const lines = chunk.split("\n");
    if (lines.every((l) => /^\s*(?:[-*+]|\d+[.)])\s+/.test(l))) {
      for (const l of lines) {
        const p = l.match(/^(\s*(?:[-*+]|\d+[.)])\s+)(.*)$/)!;
        const { parts, joins } = splitSentencesWithJoins(p[2]);
        blocks.push({ kind: "list_item", prefix: p[1], units: parts.map(unit), joins });
      }
      continue;
    }
    const { parts, joins } = splitSentencesWithJoins(lines.join(" "));
    blocks.push({ kind: "paragraph", prefix: "", units: parts.map(unit), joins });
  }
  return { blocks, units };
}

/**
 * Words a reader sees: Markdown markers (#, -, >, 1.) and link URLs don't
 * count. Text in scripts without spaces (Japanese, Chinese, Thai) is counted
 * with Intl.Segmenter, so such a post isn't "one word".
 */
export function countWords(text: string): number {
  const plain = text
    .replace(/\]\([^)\s]*\)/g, "]")
    .replace(/^\s*(?:#{1,6}|[-*+]|\d+\.|>)\s+/gm, "");
  if (!UNSPACED_SCRIPT.test(plain)) return plain.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const seg = segmenter("word");
  if (seg) {
    let n = 0;
    for (const s of seg.segment(plain)) if (s.isWordLike && /[\p{L}\p{N}]/u.test(s.segment)) n++;
    return n;
  }
  // No segmenter: each unspaced-script character is a word, plus the spaced words around them.
  let n = 0;
  for (const w of plain.split(/\s+/)) {
    const chars = [...w].filter((c) => UNSPACED_SCRIPT.test(c)).length;
    n += chars || (/[\p{L}\p{N}]/u.test(w) ? 1 : 0);
  }
  return n;
}
