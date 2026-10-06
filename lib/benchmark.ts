// Draftly blogging benchmark, edition 1 (run 2026-10-06).
// Source: ~/draftly-work/bakeoff (bakeoff.mjs + benchmark-v1.json). Each model wrote the
// same three briefs under Draftly's production writing rules; drafts were scored by code.
// Cost is the real per-post charge billed by the Vercel AI Gateway.

export type BenchmarkRow = {
  model: string;
  provider: string;
  format: number; // mean compliance score, 0-100
  low: number; // worst of the three drafts
  high: number; // best of the three drafts
  words: number; // mean words per post
  emDashes: number; // across all three posts
  contrast: number; // "not X, it's Y" style phrases across all three posts
  faq: number; // posts with an FAQ section, of 3
  cta: number; // posts that ended on the requested CTA, of 3
  cost: number; // USD per post
  seconds: number; // mean generation time
};

export const BENCHMARK_DATE = "October 6, 2026";
export const BENCHMARK_ISO = "2026-10-06";

export const BENCHMARK: BenchmarkRow[] = [
  { model: "Claude Opus 5.5", provider: "Anthropic", format: 95, low: 95, high: 96, words: 1214, emDashes: 0, contrast: 2, faq: 3, cta: 3, cost: 0.0993, seconds: 50 },
  { model: "GPT 5.4 Mini", provider: "OpenAI", format: 94, low: 92, high: 97, words: 1275, emDashes: 3, contrast: 2, faq: 3, cta: 3, cost: 0.0092, seconds: 13 },
  { model: "Gemini 3.8 Flash", provider: "Google", format: 93, low: 88, high: 100, words: 1125, emDashes: 0, contrast: 3, faq: 3, cta: 3, cost: 0.0191, seconds: 47 },
  { model: "Claude Sonnet 5.5", provider: "Anthropic", format: 91, low: 90, high: 92, words: 1008, emDashes: 0, contrast: 2, faq: 3, cta: 3, cost: 0.0492, seconds: 37 },
  { model: "Gemini 3 Flash", provider: "Google", format: 90, low: 89, high: 92, words: 1149, emDashes: 2, contrast: 2, faq: 3, cta: 3, cost: 0.0095, seconds: 19 },
  { model: "DeepSeek V3.2", provider: "DeepSeek", format: 88, low: 84, high: 94, words: 1120, emDashes: 4, contrast: 1, faq: 2, cta: 2, cost: 0.0038, seconds: 31 },
  { model: "GPT 5.4", provider: "OpenAI", format: 85, low: 83, high: 87, words: 1429, emDashes: 0, contrast: 5, faq: 3, cta: 3, cost: 0.0343, seconds: 40 },
  { model: "GPT 5.5", provider: "OpenAI", format: 85, low: 81, high: 90, words: 1774, emDashes: 0, contrast: 5, faq: 3, cta: 3, cost: 0.1134, seconds: 51 },
  { model: "Gemini 3.1 Pro (preview)", provider: "Google", format: 82, low: 64, high: 95, words: 936, emDashes: 0, contrast: 2, faq: 1, cta: 2, cost: 0.0795, seconds: 50 },
  { model: "Claude Sonnet 4.6", provider: "Anthropic", format: 79, low: 74, high: 86, words: 924, emDashes: 9, contrast: 6, faq: 3, cta: 3, cost: 0.0273, seconds: 38 },
  { model: "Claude Haiku 4.5", provider: "Anthropic", format: 68, low: 55, high: 76, words: 1098, emDashes: 29, contrast: 2, faq: 3, cta: 2, cost: 0.01, seconds: 20 },
];
