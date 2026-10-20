// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/html-tokens.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Copied verbatim (needed by extractArticle and normalizeInput in editor-text.ts).
//
// One HTML/shortcode tokenizer for the Editor, shared by the reader
// (editor-text.ts, which turns a post into Markdown for the checker and the
// model) and the patcher (editor-patch.ts, which writes accepted changes back
// into the post's own bytes). Both must agree on what is text and what is
// markup, or a change can't be traced back to the place it came from.
//
// - Tags are matched quote-aware: `alt="Before > after"` is one tag.
// - The bodies of <script>, <style>, <textarea>, <iframe>... are raw text,
//   never parsed for tags ("if(a<b&&c>d)" is not a tag).
// - WordPress shortcodes ([caption ...], [/caption], [vc_row], [et_pb_text])
//   are opaque markup, like tags; the content of a few ([embed]URL[/embed],
//   [code]...[/code]) is opaque too.

export type HtmlTokenKind = "text" | "tag" | "comment" | "shortcode" | "raw";

export interface HtmlToken {
  kind: HtmlTokenKind;
  /** Byte range [start, end) in the source (UTF-16 offsets). */
  start: number;
  end: number;
  /** Lower-case tag or shortcode name; "" for text, raw and comments. */
  name: string;
  closing: boolean;
  selfClosing: boolean;
}

/** Attribute text inside a tag, with quoted values that may hold ">". */
export const TAG_ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;

/** A whole tag, quote-aware (global, for replace/strip). */
export const TAG_RE = new RegExp(`<[A-Za-z/!?]${TAG_ATTRS}>|<[A-Za-z/!?][^>]*>`, "g");

const QUOTED_TAG = new RegExp(`<${TAG_ATTRS}>`, "y");
const PLAIN_TAG = /<[^>]*>/y;
const TAG_HEAD = /^<\s*(\/)?\s*([A-Za-z][A-Za-z0-9:-]*)/;

/** Elements whose content is raw text: no tags inside, never edited. */
export const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title", "xmp", "iframe", "noembed", "noframes", "noscript", "plaintext"]);

/**
 * Elements whose text the Editor never reads or writes: code, embeds, forms
 * and media are dropped by the reader; blockquotes and <pre> are kept as
 * protected blocks. The patcher skips all of them.
 */
export const DROPPED_TAGS = ["script", "style", "noscript", "svg", "iframe", "form", "button", "template", "select", "textarea", "object", "video", "audio", "math", "canvas", "map"];
export const PROTECTED_TAGS = new Set([...DROPPED_TAGS, "pre", "blockquote"]);

/** Shortcodes whose content is not prose (a URL, code, raw HTML): opaque like their tags. */
export const OPAQUE_SHORTCODES = new Set([
  "embed", "video", "audio", "playlist", "code", "sourcecode", "source", "php", "html", "raw", "js", "css",
  "vc_raw_html", "vc_raw_js", "et_pb_code", "et_pb_fullwidth_code", "fusion_code", "av_codeblock",
]);

/** Shortcodes WordPress or common builders use without attributes or a closing tag. */
const BARE_SHORTCODES = new Set(["gallery", "caption", "wp_caption", "embed", "playlist", "audio", "video", "toc", "ez-toc", "wpforms", "contact-form"]);
const BUILDER_PREFIX = /^(?:vc_|et_pb_|fusion_|av_|cs_|tatsu_|tm_|elementor|rev_slider|woocommerce|product)/i;

const SHORTCODE = /\[(\/)?([A-Za-z][\w-]*)((?:[^\]\["'\n]|"[^"\n]*"|'[^'\n]*')*)\]/y;

/** Names that appear as a closing shortcode tag ([/name]) somewhere in the text. */
export function closedShortcodeNames(text: string): Set<string> {
  return new Set([...text.matchAll(/\[\/([A-Za-z][\w-]*)\]/g)].map((m) => m[1].toLowerCase()));
}

/**
 * The shortcode tag at `i` (text[i] === "["), or null when the bracket is
 * ordinary text: "[1]", "[sic]", a Markdown link "[text](url)".
 */
export function shortcodeAt(text: string, i: number, closed: Set<string>): { end: number; name: string; closing: boolean; selfClosing: boolean } | null {
  SHORTCODE.lastIndex = i;
  const m = SHORTCODE.exec(text);
  if (!m) return null;
  const end = i + m[0].length;
  if (text[end] === "(") return null; // Markdown link
  const name = m[2].toLowerCase();
  const attrs = m[3];
  const closing = Boolean(m[1]);
  const selfClosing = /\/\s*$/.test(attrs);
  let ok: boolean;
  if (closing) ok = attrs.trim() === "";
  else if (/^\s/.test(attrs) && attrs.includes("=")) ok = true;
  else if (/^\s*\/?\s*$/.test(attrs)) ok = closed.has(name) || BARE_SHORTCODES.has(name) || BUILDER_PREFIX.test(name);
  else ok = false;
  return ok ? { end, name, closing, selfClosing } : null;
}

/**
 * Tokens in source order. Adjacent text is one token. Every byte of the
 * input belongs to exactly one token, so joining the raw slices gives the
 * input back.
 */
export function tokenizeHtml(html: string, opts: { shortcodes?: boolean } = {}): HtmlToken[] {
  const shortcodes = opts.shortcodes !== false;
  const closed = shortcodes ? closedShortcodeNames(html) : new Set<string>();
  const out: HtmlToken[] = [];
  let textStart = -1;
  const flushText = (upTo: number) => {
    if (textStart >= 0 && upTo > textStart) out.push({ kind: "text", start: textStart, end: upTo, name: "", closing: false, selfClosing: false });
    textStart = -1;
  };
  const push = (t: HtmlToken) => {
    flushText(t.start);
    out.push(t);
  };
  let i = 0;
  const n = html.length;
  while (i < n) {
    const ch = html[i];
    if (ch === "<") {
      if (html.startsWith("<!--", i)) {
        const close = html.indexOf("-->", i + 4);
        const end = close < 0 ? n : close + 3;
        push({ kind: "comment", start: i, end, name: "", closing: false, selfClosing: false });
        i = end;
        continue;
      }
      const next = html[i + 1] ?? "";
      if (/[A-Za-z!?]/.test(next) || (next === "/" && /[A-Za-z]/.test(html[i + 2] ?? ""))) {
        QUOTED_TAG.lastIndex = i;
        let m = QUOTED_TAG.exec(html);
        if (!m) {
          PLAIN_TAG.lastIndex = i;
          m = PLAIN_TAG.exec(html);
        }
        if (m) {
          const raw = m[0];
          const head = raw.match(TAG_HEAD);
          const name = head?.[2]?.toLowerCase() ?? "";
          const closing = Boolean(head?.[1]);
          const selfClosing = /\/\s*>$/.test(raw);
          const end = i + raw.length;
          push({ kind: "tag", start: i, end, name, closing, selfClosing });
          i = end;
          if (!closing && !selfClosing && RAW_TEXT_TAGS.has(name)) {
            const closeRe = new RegExp(`<\\/\\s*${name}\\b`, "ig");
            closeRe.lastIndex = i;
            const c = closeRe.exec(html);
            const bodyEnd = c ? c.index : n;
            if (bodyEnd > i) out.push({ kind: "raw", start: i, end: bodyEnd, name, closing: false, selfClosing: false });
            i = bodyEnd;
          }
          continue;
        }
      }
    } else if (ch === "[" && shortcodes) {
      const sc = shortcodeAt(html, i, closed);
      if (sc) {
        push({ kind: "shortcode", start: i, end: sc.end, name: sc.name, closing: sc.closing, selfClosing: sc.selfClosing });
        i = sc.end;
        if (!sc.closing && !sc.selfClosing && OPAQUE_SHORTCODES.has(sc.name) && closed.has(sc.name)) {
          const closeAt = html.toLowerCase().indexOf(`[/${sc.name}]`, i);
          if (closeAt > i) {
            out.push({ kind: "raw", start: i, end: closeAt, name: sc.name, closing: false, selfClosing: false });
            i = closeAt;
          }
        }
        continue;
      }
    }
    if (textStart < 0) textStart = i;
    i++;
  }
  flushText(n);
  return out;
}

/** The text with every shortcode tag removed (and the content of opaque ones like [embed]); everything else unchanged. */
export function removeShortcodes(text: string): string {
  if (!text.includes("[")) return text;
  const toks = tokenizeHtml(text);
  let out = "";
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.kind === "shortcode") continue;
    if (t.kind === "raw" && toks[k - 1]?.kind === "shortcode") continue;
    out += text.slice(t.start, t.end);
  }
  return out;
}

/** Gutenberg blocks whose inner HTML is the author's own code, never prose to edit. */
export const PROTECTED_BLOCK_COMMENT = /^<!--\s*(\/)?wp:(html|code|preformatted|verse|shortcode|quote|pullquote)\b/;
