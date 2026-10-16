// Small validators shared by the AI tools' input and output checks.
import { ToolError } from "../ssrf.ts";

/** Trims, collapses whitespace and strips control characters. */
export function clean(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Output strings: also swap em and en dashes (the site's copy rule) for commas or hyphens. */
export function cleanOut(s: unknown, max: number): string {
  return clean(s, max * 2)
    .replace(/\s*—\s*/g, ", ")
    .replace(/(\d)\s*–\s*(\d)/g, "$1-$2")
    .replace(/\s*–\s*/g, ", ")
    .slice(0, max)
    .trim();
}

const SMALL_WORDS = new Set(["a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "to", "of", "in", "on", "at", "by", "as", "vs", "via", "per"]);

/** Title Case house style: small words stay lowercase unless they start the title or follow a colon or question mark. */
export function titleCase(title: string): string {
  return title
    .split(" ")
    .map((w, i, all) => {
      const lower = w.toLowerCase();
      const startsPart = i === 0 || /[:?]$/.test(all[i - 1]);
      return !startsPart && SMALL_WORDS.has(lower) ? lower : w;
    })
    .join(" ");
}

export function cleanList(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of v) {
    const s = cleanOut(item, maxLen);
    const key = s.toLowerCase();
    if (s.length < 3 || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= maxItems) break;
  }
  return out;
}

/** A short topic or keyword typed by a visitor: 2 to 80 characters, at least one letter, at most 10 words. */
export function validatePhrase(raw: unknown, what: string, { min = 2, max = 80, maxWords = 10 } = {}): string {
  const s = clean(raw, max + 1);
  if (s.length < min) throw new ToolError(`Enter a ${what}.`, 400);
  if (s.length > max) throw new ToolError(`Keep the ${what} under ${max} characters.`, 400);
  if (!/\p{L}/u.test(s)) throw new ToolError(`That ${what} needs at least one word.`, 400);
  if (s.split(" ").length > maxWords) throw new ToolError(`Keep the ${what} to ${maxWords} words or fewer.`, 400);
  if (/https?:\/\/|<[a-z/]/i.test(s)) throw new ToolError(`Enter the ${what} as plain words, not a link or code.`, 400);
  return s;
}

/** Hype and filler words the owner's copy rules ban. Output that leans on them reads as AI filler. */
export const BANNED_WORDS = [
  "ultimate",
  "comprehensive",
  "unlock",
  "unleash",
  "elevate",
  "delve",
  "landscape",
  "game-changer",
  "game changer",
  "in today's",
  "navigate the",
  "seamless",
  "supercharge",
  "revolutionize",
  "harness",
  "tapestry",
  "realm",
];

export function bannedHits(texts: string[]): string[] {
  const all = texts.join(" \n ").toLowerCase();
  return BANNED_WORDS.filter((w) => all.includes(w));
}
