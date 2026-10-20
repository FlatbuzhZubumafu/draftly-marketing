// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/ai-detect.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Copied verbatim so the free tool at /tools/ai-content-detector scores exactly like the app.
//
// Statistical AI-writing detector for the Draftly Editor. Pure functions, no
// I/O, no LLM: it costs nothing to run, so check_copy, edit_copy and the free
// detect_ai_writing MCP tool can all use it.
//
// The rule checker (post-checks.ts) catches discrete tells: a banned word, a
// "not just X" sentence, a stock opener. What it can't see is the *shape* of
// machine prose, which is what GPTZero-style detectors key on: sentence
// lengths that barely vary (low burstiness), every sentence opening the same
// way, decorative three-item lists, generic sentences with no names, numbers
// or examples, no contractions, no punctuation beyond commas.
//
// The decision model is a small logistic score over those features, computed
// per passage (a paragraph, or a run of short paragraphs / list items merged
// until there is enough text to measure) and for the whole document:
//
//   z = BIAS + Σ weight_i · signal_i      signal_i ∈ [0, 1], 1 = machine-like
//   p = 1 / (1 + e^-z)
//
// A passage at or above FLAG_AT is flagged, and inside it the sentences that
// carry the most sentence-level tells are handed to the Editor to rewrite
// (rule "ai_pattern"). Short passages are pulled toward the prior, so a
// two-sentence paragraph can never be called AI on its own.
//
// Calibrated by hand on the fixtures in ai-detect.test.ts. It is a heuristic
// editing signal, not proof of authorship: statistical detectors are known to
// over-flag plain, formulaic or non-native English, so reports say "reads as
// AI-written", never "was written by AI".

import { AI_VOCABULARY } from "./writing-rules.ts";
import { countWords, segment, type Segmented } from "./editor-text.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AiSignal =
  | "uniform_rhythm"
  | "ai_lexicon"
  | "stock_transitions"
  | "tricolons"
  | "repeated_openers"
  | "low_specificity"
  | "no_contractions"
  | "flat_punctuation"
  | "average_length";

export type AiLabel = "likely_human" | "mixed" | "likely_ai";
export type Confidence = "low" | "medium" | "high";

export interface SignalScore {
  signal: AiSignal;
  /** 0-1, 1 = machine-like. */
  value: number;
  /** weight · value: how much this signal pushed the score up. */
  contribution: number;
}

export interface PassageScore {
  /** The units (sentences) this passage covers, in order. */
  unitIds: string[];
  words: number;
  /** 0-1 probability-style score that the passage reads as AI-written. */
  probability: number;
  label: AiLabel;
  /** The signals that pushed this passage up, strongest first. */
  topSignals: SignalScore[];
  flagged: boolean;
}

export interface SentenceFinding {
  id: string;
  text: string;
  /** Plain-language reasons this sentence reads as machine-written. */
  reasons: string[];
}

export interface AiDetection {
  /** 0-100: how strongly the whole text reads as AI-written. */
  score: number;
  label: AiLabel;
  confidence: Confidence;
  wordCount: number;
  /** Share (0-100) of prose words inside flagged passages. */
  flaggedShare: number;
  signals: SignalScore[];
  passages: PassageScore[];
  /** Sentences to rewrite, in document order. */
  sentences: SentenceFinding[];
  note: string;
}

// ---------------------------------------------------------------------------
// Model constants
// ---------------------------------------------------------------------------

export const WEIGHTS: Record<AiSignal, number> = {
  uniform_rhythm: 1.6,
  ai_lexicon: 2.2,
  stock_transitions: 1.2,
  tricolons: 1.0,
  repeated_openers: 0.8,
  low_specificity: 1.2,
  no_contractions: 0.6,
  flat_punctuation: 0.5,
  average_length: 0.6,
};
export const BIAS = -3.4;

/** Passages at or above this probability are flagged and their sentences sent to the Editor. */
export const FLAG_AT = 0.65;
/** Document labels: below MIXED_AT likely human, at or above LIKELY_AI_AT likely AI. */
export const MIXED_AT = 0.4;
export const LIKELY_AI_AT = 0.7;
/** A passage needs this much text before it is scored on its own. */
export const MIN_PASSAGE_WORDS = 45;
export const MIN_PASSAGE_SENTENCES = 3;
/** Below this many words, the score is shrunk toward the prior (BIAS alone). */
const FULL_EVIDENCE_WORDS = 90;
/** At most this share of a flagged passage's sentences is sent for rewriting. */
const MAX_SHARE_PER_PASSAGE = 0.6;

export const SIGNAL_LABELS: Record<AiSignal, string> = {
  uniform_rhythm: "Sentence lengths barely vary",
  ai_lexicon: "AI-typical words and phrases",
  stock_transitions: "Stock transitions (Additionally, Moreover...)",
  tricolons: "Three-item lists everywhere",
  repeated_openers: "Sentences open the same way",
  low_specificity: "Few names, numbers or examples",
  no_contractions: "No contractions",
  flat_punctuation: "Only commas and periods",
  average_length: "Every sentence is mid-length",
};

// ---------------------------------------------------------------------------
// Lexicons
// ---------------------------------------------------------------------------

/**
 * Words and phrases models overuse that are not on the banned list (the rule
 * checker already flags those, and they are scored here too). Matched as
 * lowercase stems at word starts.
 */
const EXTRA_LEXICON = [
  "additionally", "furthermore", "moreover", "various", "numerous", "a wide range of", "a variety of", "plays a crucial role",
  "plays a key role", "plays a vital role", "it is essential", "it's essential", "essential to", "ensure", "ensuring",
  "enhance", "enhancing", "optimize", "optimal", "significantly", "effectively", "efficiently", "key factor", "valuable insights",
  "insights", "overall", "in summary", "ultimately", "navigate", "navigating", "foster", "fostering", "meticulous",
  "meticulously", "intricate", "nuanced", "showcase", "showcasing", "boast", "boasts", "align", "aligns", "resonate",
  "resonates", "paramount", "commendable", "invaluable", "embrace", "embracing", "endeavor", "realm", "vital",
];

function lexiconTerms(): string[] {
  const banned = [...AI_VOCABULARY.adjectives, ...AI_VOCABULARY.verbs, ...AI_VOCABULARY.nouns]
    .map((t) => t.replace(/\(s\)$/, "").toLowerCase())
    .filter((t) => !/[[\]/]|\bx\b/i.test(t));
  const phrases = AI_VOCABULARY.phrases
    .map((t) => t.toLowerCase().replace(/[‘’]/g, "'"))
    .filter((t) => !/[[\]/]|\bx\b|\by\b/i.test(t));
  return [...new Set([...banned, ...phrases, ...EXTRA_LEXICON])];
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const LEXICON_RE = new RegExp(`\\b(?:${lexiconTerms().sort((a, b) => b.length - a.length).map(esc).join("|")})\\w*`, "gi");

const STOCK_OPENERS = /^(?:additionally|furthermore|moreover|consequently|notably|importantly|ultimately|indeed|overall|in addition|in conclusion|in summary|as a result|that said|by doing so|by (?:\w+ing)\b|whether you're|when it comes to|in today's|with (?:its|their|our|this)\b)/i;

/** "A, B, and C" / "A, B or C" with short items: the decorative triplet. */
const TRICOLON = /\b[\w'-]+(?: [\w'-]+){0,3}, [\w'-]+(?: [\w'-]+){0,3},? (?:and|or) [\w'-]+(?: [\w'-]+){0,3}\b/gi;

const CONTRACTION = /\b\w+(?:'|’)(?:s|t|re|ve|ll|d|m)\b/gi;
const RICH_PUNCTUATION = /[;:()?!"“”]|\s[—–]\s|—/;
const LIST_MARKERS = /^\s*(?:[-*+]|\d+[.)])\s+/;

// ---------------------------------------------------------------------------
// Signals
// ---------------------------------------------------------------------------

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
/** Linear ramp: 0 at `zero`, 1 at `one` (either direction). */
const ramp = (x: number, zero: number, one: number) => clamp01((x - zero) / (one - zero));

const plain = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(LIST_MARKERS, "")
    .replace(/[‘’]/g, "'")
    .trim();

const wordsOf = (s: string) => plain(s).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

function firstWord(s: string): string {
  return (wordsOf(s)[0] ?? "").toLowerCase().replace(/[^\p{L}']/gu, "");
}

/** Digits, capitalized words mid-sentence (names, places, products) and quoted spans. */
function specifics(s: string): number {
  const ws = wordsOf(s);
  let n = 0;
  ws.forEach((w, i) => {
    if (/\d/.test(w)) n++;
    else if (i > 0 && /^[A-Z][\p{L}'-]+/u.test(w) && !/^I$|^I'/.test(w)) n++;
  });
  n += (s.match(/"[^"]{3,}"|“[^”]{3,}”/g) ?? []).length;
  return n;
}

function lexiconHits(s: string): string[] {
  return [...plain(s).matchAll(LEXICON_RE)].map((m) => m[0].toLowerCase());
}

function tricolonCount(s: string): number {
  // Ignore lists of numbers ("2, 4, and 6 years") and named things: those are content, not decoration.
  return [...plain(s).matchAll(TRICOLON)].filter((m) => !/\d/.test(m[0]) && specifics(m[0]) < 2).length;
}

interface Features {
  values: Record<AiSignal, number>;
  words: number;
  sentences: number;
}

/** Feature values for a run of sentences (one passage or the whole document). */
export function features(sentences: string[]): Features {
  const lens = sentences.map((s) => wordsOf(s).length).filter((n) => n > 0);
  const words = lens.reduce((a, b) => a + b, 0);
  const n = Math.max(1, lens.length);
  const per100 = (x: number) => (words ? (x * 100) / words : 0);

  const mean = words / n;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const cv = mean ? sd / mean : 0;

  const lexicon = sentences.reduce((a, s) => a + lexiconHits(s).length, 0);
  const transitions = sentences.filter((s) => STOCK_OPENERS.test(plain(s))).length;
  const tricolons = sentences.reduce((a, s) => a + tricolonCount(s), 0);
  const openers = new Map<string, number>();
  for (const s of sentences) {
    const w = firstWord(s);
    if (w) openers.set(w, (openers.get(w) ?? 0) + 1);
  }
  const topOpener = Math.max(0, ...openers.values());
  const spec = sentences.reduce((a, s) => a + specifics(s), 0);
  const contractions = sentences.reduce((a, s) => a + (plain(s).match(CONTRACTION) ?? []).length, 0);
  const richPunct = sentences.filter((s) => RICH_PUNCTUATION.test(s)).length;

  return {
    words,
    sentences: lens.length,
    values: {
      // Human prose typically has a sentence-length CV of 0.5+; models sit near 0.2-0.35.
      uniform_rhythm: lens.length >= 3 ? ramp(cv, 0.55, 0.2) : 0,
      ai_lexicon: ramp(per100(lexicon), 0, 2.2),
      stock_transitions: ramp(transitions / n, 0, 0.3),
      tricolons: ramp(tricolons / n, 0.05, 0.4),
      repeated_openers: lens.length >= 4 ? ramp(topOpener / n, 0.25, 0.55) : 0,
      low_specificity: ramp(per100(spec), 4, 0.5),
      no_contractions: words >= 60 ? ramp(per100(contractions), 1.2, 0) : 0,
      flat_punctuation: lens.length >= 3 ? ramp(richPunct / n, 0.25, 0) : 0,
      average_length: lens.length >= 3 ? clamp01(1 - Math.abs(mean - 20) / 9) * ramp(cv, 0.6, 0.3) : 0,
    },
  };
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

/** The decision model: features in, a probability-style score and the signals behind it out. */
export function decide(f: Features): { probability: number; signals: SignalScore[] } {
  const signals = (Object.keys(WEIGHTS) as AiSignal[])
    .map((signal) => ({ signal, value: round2(f.values[signal]), contribution: round2(WEIGHTS[signal] * f.values[signal]) }))
    .sort((a, b) => b.contribution - a.contribution);
  const evidence = Math.min(1, f.words / FULL_EVIDENCE_WORDS);
  const raw = signals.reduce((a, s) => a + WEIGHTS[s.signal] * f.values[s.signal], 0);
  // Shrink toward the prior when there is little text: BIAS + evidence · Σ.
  const probability = sigmoid(BIAS + evidence * raw);
  return { probability: round2(probability), signals };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function labelFor(p: number): AiLabel {
  return p >= LIKELY_AI_AT ? "likely_ai" : p >= MIXED_AT ? "mixed" : "likely_human";
}

// ---------------------------------------------------------------------------
// Sentence-level reasons
// ---------------------------------------------------------------------------

/** Why one sentence reads as machine-written, given its passage. Empty when nothing stands out. */
export function sentenceReasons(text: string, prev: string | null, passage: Features): string[] {
  const reasons = machineTells(text);
  const w = firstWord(text);
  if (prev && w && w.length > 1 && w === firstWord(prev)) reasons.push(`opens with "${w}" like the sentence before`);
  const len = wordsOf(text).length;
  if (len >= 12 && specifics(text) === 0) reasons.push("generic: no name, number or example");
  if (passage.values.uniform_rhythm >= 0.6 && len >= 14 && len <= 26) reasons.push("same length as its neighbors; vary it");
  return reasons;
}

/**
 * The discrete tells in one sentence (wording, stock opener, triplet). The
 * Editor uses it to reject a rewrite that still carries one.
 */
export function machineTells(text: string): string[] {
  const out: string[] = [];
  const hits = [...new Set(lexiconHits(text))];
  if (hits.length) out.push(`AI-typical wording: ${hits.slice(0, 4).join(", ")}`);
  if (STOCK_OPENERS.test(plain(text))) out.push("opens with a stock transition");
  if (tricolonCount(text)) out.push("decorative three-item list");
  return out;
}

// ---------------------------------------------------------------------------
// Passages
// ---------------------------------------------------------------------------

interface ProseUnit {
  id: string;
  text: string;
  /** Index of the paragraph (or list) the unit belongs to. */
  group: number;
}

/** Prose units in order, grouped by paragraph; consecutive list items form one group. Headings and protected blocks are skipped. */
function proseUnits(seg: Segmented): ProseUnit[] {
  const out: ProseUnit[] = [];
  let group = -1;
  let prevKind: string | null = null;
  for (const b of seg.blocks) {
    if (b.kind === "heading" || b.kind === "protected") {
      prevKind = b.kind;
      continue;
    }
    if (!(b.kind === "list_item" && prevKind === "list_item")) group++;
    prevKind = b.kind;
    for (const u of b.units) out.push({ id: u.id, text: u.text, group });
  }
  return out;
}

/** Paragraphs merged forward until each passage has enough text to measure; a short tail joins the passage before it. */
function passages(units: ProseUnit[]): ProseUnit[][] {
  const groups: ProseUnit[][] = [];
  for (const u of units) {
    if (!groups.length || groups[groups.length - 1][0].group !== u.group) groups.push([]);
    groups[groups.length - 1].push(u);
  }
  const out: ProseUnit[][] = [];
  let cur: ProseUnit[] = [];
  const big = (p: ProseUnit[]) => p.length >= MIN_PASSAGE_SENTENCES && countWords(p.map((u) => u.text).join(" ")) >= MIN_PASSAGE_WORDS;
  for (const g of groups) {
    cur = cur.concat(g);
    if (big(cur)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) {
    if (out.length) out[out.length - 1] = out[out.length - 1].concat(cur);
    else out.push(cur);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export function detectAi(seg: Segmented): AiDetection {
  const units = proseUnits(seg);
  const doc = features(units.map((u) => u.text));
  const docDecision = decide(doc);

  const passageScores: PassageScore[] = [];
  const findings: SentenceFinding[] = [];
  let flaggedWords = 0;

  for (const p of passages(units)) {
    const f = features(p.map((u) => u.text));
    const { probability, signals } = decide(f);
    const enough = f.sentences >= MIN_PASSAGE_SENTENCES && f.words >= MIN_PASSAGE_WORDS;
    const flagged = enough && probability >= FLAG_AT;
    passageScores.push({
      unitIds: p.map((u) => u.id),
      words: f.words,
      probability,
      label: labelFor(probability),
      topSignals: signals.filter((s) => s.contribution >= 0.3).slice(0, 3),
      flagged,
    });
    if (!flagged) continue;
    flaggedWords += f.words;
    const ranked = p
      .map((u, i) => ({ u, reasons: sentenceReasons(u.text, i > 0 && p[i - 1].group === u.group ? p[i - 1].text : null, f) }))
      .filter((x) => x.reasons.length > 0)
      .sort((a, b) => b.reasons.length - a.reasons.length);
    const cap = Math.max(1, Math.ceil(p.length * MAX_SHARE_PER_PASSAGE));
    for (const x of ranked.slice(0, cap)) findings.push({ id: x.u.id, text: x.u.text, reasons: x.reasons });
  }

  const order = new Map(units.map((u, i) => [u.id, i]));
  findings.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

  // The document score averages the whole-text model with the word-weighted
  // passage scores: a half-human, half-machine post lands in "mixed" instead
  // of inheriting the machine half's wording density.
  const flaggedShare = doc.words ? flaggedWords / doc.words : 0;
  const scoredWords = passageScores.reduce((a, p) => a + p.words, 0);
  const passageMean = scoredWords ? passageScores.reduce((a, p) => a + p.probability * p.words, 0) / scoredWords : docDecision.probability;
  const blended = (docDecision.probability + passageMean) / 2;
  const confidence: Confidence = doc.words >= 400 ? "high" : doc.words >= 150 ? "medium" : "low";

  return {
    score: Math.round(blended * 100),
    label: labelFor(blended),
    confidence,
    wordCount: doc.words,
    flaggedShare: Math.round(flaggedShare * 100),
    signals: docDecision.signals.filter((s) => s.contribution > 0),
    passages: passageScores,
    sentences: findings,
    note:
      "A statistical estimate of how machine-like the writing reads (rhythm, wording, structure), not proof of who wrote it. " +
      "Plain or formulaic human writing can score high; edit flagged sentences rather than treating the score as a verdict.",
  };
}

/** Convenience for callers holding Markdown rather than a segmented document. */
export function detectAiInMarkdown(markdown: string): AiDetection {
  return detectAi(segment(markdown));
}
