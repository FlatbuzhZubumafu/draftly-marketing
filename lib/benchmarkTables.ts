import { BENCHMARK, COPY_BENCHMARK, seoScore, type BenchmarkRow, type CopyRow } from "@/lib/benchmark";

// The result tables on /best-ai-for-writing, defined once so the page and
// /llms-full.txt show the same rows, order and columns.

export type Column<T> = { label: string; value: (r: T) => string | number; strong?: boolean };
export type BenchmarkTable<T> = { caption: string; rows: T[]; columns: Column<T>[]; rank?: boolean };

export const money = (n: number) => (n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(3)}`);

const by = <T,>(...keys: ((r: T) => number)[]) => (a: T, b: T) => {
  for (const k of keys) { const d = k(a) - k(b); if (d) return d; }
  return 0;
};

const CONTENT_ROWS = [...BENCHMARK].sort(by<BenchmarkRow>((r) => -(r.faq + r.cta), (r) => r.contrast + r.aiWords + r.openers, (r) => r.cost));
const SEO_ROWS = [...BENCHMARK].sort(by<BenchmarkRow>((r) => -seoScore(r), (r) => r.cost));
const BLOG_ROWS = [...BENCHMARK].sort(by<BenchmarkRow>((r) => r.wordsOff, (r) => r.longParas));
const OPENAI_ROWS = BENCHMARK.filter((r) => r.provider === "OpenAI" || r === BENCHMARK[0]);

export const LEADERBOARD_TABLE: BenchmarkTable<BenchmarkRow> = {
  caption: "Blog writing: three posts per model",
  rank: true,
  rows: BENCHMARK,
  columns: [
    { label: "Overall", value: (r) => r.overall, strong: true },
    { label: "Formatting", value: (r) => r.format },
    { label: "Voice", value: (r) => r.voice },
    { label: "Cost per post", value: (r) => money(r.cost) },
    { label: "Seconds", value: (r) => r.seconds },
    { label: "Avg words", value: (r) => r.words.toLocaleString("en-US") },
  ],
};

export const CONTENT_TABLE: BenchmarkTable<BenchmarkRow> = {
  caption: "Content writing: structure kept and AI habits avoided (three posts per model, fewer tells is better)",
  rows: CONTENT_ROWS,
  columns: [
    { label: "FAQ included", value: (r) => `${r.faq} of 3`, strong: true },
    { label: "Ended on CTA", value: (r) => `${r.cta} of 3`, strong: true },
    { label: "Contrast phrases", value: (r) => r.contrast },
    { label: "AI vocabulary", value: (r) => r.aiWords },
    { label: "Mechanical openers", value: (r) => r.openers },
  ],
};

export const COPY_TABLE: BenchmarkTable<CopyRow> = {
  caption: "Copywriting: three copy packs per model (judge criteria out of 10)",
  rank: true,
  rows: COPY_BENCHMARK,
  columns: [
    { label: "Overall", value: (r) => r.overall, strong: true },
    { label: "Clarity", value: (r) => r.clarity },
    { label: "Persuasion", value: (r) => r.persuasion },
    { label: "Specificity", value: (r) => r.specificity },
    { label: "Ad limits met", value: (r) => `${r.adLimits} of 15` },
    { label: "Cost per pack", value: (r) => money(r.cost) },
  ],
};

export const SEO_TABLE: BenchmarkTable<BenchmarkRow> = {
  caption: "SEO writing: on-page SEO checks passed across three posts",
  rows: SEO_ROWS,
  columns: [
    { label: "SEO checks (of 18)", value: (r) => seoScore(r), strong: true },
    { label: "Keyword placed (of 9)", value: (r) => r.keyword },
    { label: "Meta title (of 3)", value: (r) => r.metaTitle },
    { label: "Meta description (of 3)", value: (r) => r.metaDesc },
    { label: "FAQ (of 3)", value: (r) => r.faq },
    { label: "Cost per post", value: (r) => money(r.cost) },
  ],
};

export const BLOG_TABLE: BenchmarkTable<BenchmarkRow> = {
  caption: "Blog writing: length discipline and consistency against a 1,000 to 1,200 word brief",
  rows: BLOG_ROWS,
  columns: [
    { label: "Avg words", value: (r) => r.words.toLocaleString("en-US") },
    { label: "Words off target", value: (r) => r.wordsOff, strong: true },
    { label: "Posts in range", value: (r) => `${r.inRange} of 3` },
    { label: "Paragraphs over 120 words", value: (r) => r.longParas },
    { label: "Formatting range", value: (r) => `${r.low} to ${r.high}` },
  ],
};

export const CHATGPT_TABLE: BenchmarkTable<BenchmarkRow> = {
  caption: "ChatGPT's GPT models against the top scorer",
  rows: OPENAI_ROWS,
  columns: [
    { label: "Overall", value: (r) => r.overall, strong: true },
    { label: "Voice", value: (r) => r.voice },
    { label: "Cost per post", value: (r) => money(r.cost) },
    { label: "Avg words", value: (r) => r.words.toLocaleString("en-US") },
    { label: "Contrast phrases", value: (r) => r.contrast },
  ],
};

/** A table as Markdown, for the plain-text routes. */
export function tableToMarkdown<T extends { model: string }>({ caption, rows, columns, rank }: BenchmarkTable<T>): string {
  const head = [...(rank ? ["Rank"] : []), "Model", ...columns.map((c) => c.label)];
  const body = rows.map((r, i) => [...(rank ? [String(i + 1)] : []), r.model, ...columns.map((c) => String(c.value(r)))]);
  const line = (cells: string[]) => `| ${cells.join(" | ")} |`;
  return [`${caption}`, "", line(head), line(head.map(() => "---")), ...body.map(line)].join("\n");
}
