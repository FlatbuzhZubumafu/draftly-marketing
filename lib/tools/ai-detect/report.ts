// What the free AI content detector page shows, built on the detector ported from the
// app (ai-detect.ts, editor-text.ts). This file is the marketing site's own: the
// labels, the plain explanations and the "too short" rule. It runs in the browser,
// so pasted text never leaves the visitor's device.
import { detectAi, MIN_PASSAGE_SENTENCES, MIN_PASSAGE_WORDS, type AiDetection, type AiLabel, type AiSignal } from "./ai-detect.ts";
import { normalizeInput, segment, type Segmented } from "./editor-text.ts";

/** Longest text we score in one go (about 25,000 words). */
export const MAX_INPUT_CHARS = 150_000;

export type DetectorResult = {
  detection: AiDetection;
  seg: Segmented;
  /** Prose sentences scored (headings, quotes, code and tables are skipped). */
  sentences: number;
  /** False when there is too little prose for a score to mean anything. */
  enough: boolean;
};

/** Pasted text or fetched Markdown in, the detector's result out. Same steps as the app's Editor. */
export function runDetector(raw: string): DetectorResult {
  const seg = segment(normalizeInput(raw.slice(0, MAX_INPUT_CHARS)));
  const detection = detectAi(seg);
  const sentences = detection.passages.reduce((a, p) => a + p.unitIds.length, 0);
  return { detection, seg, sentences, enough: detection.wordCount >= MIN_PASSAGE_WORDS && sentences >= MIN_PASSAGE_SENTENCES };
}

export const MIN_WORDS = MIN_PASSAGE_WORDS;
export const MIN_SENTENCES = MIN_PASSAGE_SENTENCES;

export const LABELS: Record<AiLabel, { text: string; short: string; color: string; bg: string }> = {
  likely_human: { text: "Likely human", short: "Human", color: "#17803d", bg: "#e7f6ec" },
  mixed: { text: "Mixed", short: "Mixed", color: "#9a6b00", bg: "var(--color-yellow-muted)" },
  likely_ai: { text: "Likely AI", short: "AI", color: "#b4380f", bg: "rgba(255, 107, 61, 0.14)" },
};

export const CONFIDENCE_TEXT: Record<AiDetection["confidence"], string> = {
  low: "Low confidence: under 150 words, so a few sentences can swing the score.",
  medium: "Medium confidence: 150 to 399 words.",
  high: "High confidence: 400 words or more.",
};

/** One line per signal, in plain words, for the "why" list under the score. */
export const SIGNAL_INFO: Record<AiSignal, { name: string; text: string }> = {
  uniform_rhythm: {
    name: "Sentence lengths barely vary",
    text: "People mix short sentences with long ones. When nearly every sentence is about the same length (low burstiness), the text reads machine-made.",
  },
  ai_lexicon: {
    name: "AI-typical words and phrases",
    text: "Words models lean on, like crucial, ensure, leverage, seamless and \"plays a key role\", counted per 100 words.",
  },
  stock_transitions: {
    name: "Stock transitions",
    text: "Sentences that open with Additionally, Moreover, Furthermore, Ultimately or \"When it comes to\".",
  },
  tricolons: {
    name: "Three-item lists",
    text: "Lists of three short items that add rhythm and little meaning, like \"comfort, safety, and peace of mind\".",
  },
  repeated_openers: {
    name: "Sentences open the same way",
    text: "A large share of sentences start with the same word.",
  },
  low_specificity: {
    name: "Few names, numbers or examples",
    text: "Names, places, figures and quotes per 100 words. Generic sentences that could fit any business score high here.",
  },
  no_contractions: {
    name: "No contractions",
    text: "Over 60 words without a single don't, it's or you're.",
  },
  flat_punctuation: {
    name: "Only commas and periods",
    text: "No questions, colons, semicolons, brackets or quotes anywhere.",
  },
  average_length: {
    name: "Every sentence is mid-length",
    text: "Sentences cluster around 20 words, with little above or below.",
  },
};

/** Unit text as a reader sees it: Markdown links, emphasis and code marks removed. */
export function readable(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])[*_](\S(?:.*?\S)?)[*_](?=[\s).,;:!?]|$)/g, "$1$2")
    .replace(/`([^`]*)`/g, "$1");
}

/** Gauge needle angle in degrees: -90 at 0 (human, left) to 90 at 100 (AI, right). */
export const needleAngle = (score: number) => Math.max(-90, Math.min(90, (score / 100) * 180 - 90));
