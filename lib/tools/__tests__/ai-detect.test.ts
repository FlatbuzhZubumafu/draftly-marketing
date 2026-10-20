import { test } from "node:test";
import assert from "node:assert/strict";
import { BIAS, decide, detectAiInMarkdown, features, FLAG_AT, labelFor } from "../ai-detect/ai-detect.ts";
import { AI_SAMPLE, HUMAN_SAMPLE } from "../ai-detect/fixtures.ts";
import { readable, runDetector } from "../ai-detect/report.ts";
import { articleFromHtml, MAX_ARTICLE_CHARS } from "../checks/ai-detector.ts";

const MIXED = HUMAN_SAMPLE + "\n\n## Planning ahead\n\n" + AI_SAMPLE.split("\n").slice(2).join("\n");
const SHORT = "Additionally, it is essential to ensure a seamless experience. Furthermore, we leverage robust solutions.";

// ---- Same scores as the app ----
// Expected values come from running the app's own detector (draftly.blog
// supabase/functions/_shared/ai-detect.ts at 4ecf2cc1, under Deno) on the same
// fixtures. If one of these fails, the port has drifted from the app.

const summary = (md: string) => {
  const r = detectAiInMarkdown(md);
  return {
    score: r.score,
    label: r.label,
    confidence: r.confidence,
    wordCount: r.wordCount,
    flaggedShare: r.flaggedShare,
    passages: r.passages.map((p) => [p.unitIds.join(","), p.words, p.probability, p.flagged]),
    flagged: r.sentences.map((s) => s.id),
  };
};

test("app parity: AI sample", () => {
  assert.deepEqual(summary(AI_SAMPLE), {
    score: 90,
    label: "likely_ai",
    confidence: "low",
    wordCount: 128,
    flaggedShare: 63,
    passages: [
      ["u2,u3,u4,u5,u6,u7", 81, 0.97, true],
      ["u8,u9,u10", 47, 0.56, false],
    ],
    flagged: ["u2", "u4", "u5", "u7"],
  });
  const r = detectAiInMarkdown(AI_SAMPLE);
  assert.deepEqual(
    r.signals.map((s) => [s.signal, s.value, s.contribution]),
    [
      ["ai_lexicon", 1, 2.2],
      ["uniform_rhythm", 1, 1.6],
      ["stock_transitions", 1, 1.2],
      ["low_specificity", 1, 1.2],
      ["no_contractions", 1, 0.6],
      ["flat_punctuation", 1, 0.5],
      ["average_length", 0.36, 0.21],
      ["tricolons", 0.17, 0.17],
    ],
  );
  assert.deepEqual(r.sentences.find((s) => s.id === "u5")?.reasons, [
    "AI-typical wording: furthermore",
    "opens with a stock transition",
    "decorative three-item list",
    "generic: no name, number or example",
    "same length as its neighbors; vary it",
  ]);
});

test("app parity: human sample", () => {
  assert.deepEqual(summary(HUMAN_SAMPLE), {
    score: 8,
    label: "likely_human",
    confidence: "low",
    wordCount: 136,
    flaggedShare: 0,
    passages: [
      ["u2,u3,u4,u5,u6,u7", 77, 0.03, false],
      ["u8,u9,u10,u11", 59, 0.22, false],
    ],
    flagged: [],
  });
});

test("app parity: mixed post and short text", () => {
  assert.deepEqual(summary(MIXED), {
    score: 64,
    label: "mixed",
    confidence: "medium",
    wordCount: 264,
    flaggedShare: 31,
    passages: [
      ["u2,u3,u4,u5,u6,u7", 77, 0.03, false],
      ["u8,u9,u10,u11", 59, 0.22, false],
      ["u13,u14,u15,u16,u17,u18", 81, 0.97, true],
      ["u19,u20,u21", 47, 0.56, false],
    ],
    flagged: ["u13", "u15", "u16", "u18"],
  });
  assert.deepEqual(summary(SHORT), {
    score: 6,
    label: "likely_human",
    confidence: "low",
    wordCount: 14,
    flaggedShare: 0,
    passages: [["u1,u2", 14, 0.06, false]],
    flagged: [],
  });
});

// ---- The app's own Deno tests (ai-detect.test.ts), ported to node:test ----

test("machine-like copy scores likely_ai and its sentences are flagged", () => {
  const r = detectAiInMarkdown(AI_SAMPLE);
  assert.equal(r.label, "likely_ai", `score ${r.score}`);
  assert.ok(r.score >= 70, `score ${r.score}`);
  assert.ok(r.passages.some((p) => p.flagged), "at least one passage flagged");
  assert.ok(r.sentences.length >= 3, `flagged sentences: ${r.sentences.length}`);
  assert.ok(r.sentences.every((s) => s.reasons.length > 0), "every flagged sentence says why");
  assert.ok(r.sentences.some((s) => s.reasons.some((x) => x.startsWith("AI-typical wording"))));
});

test("human copy with specifics and varied rhythm scores likely_human and flags nothing", () => {
  const r = detectAiInMarkdown(HUMAN_SAMPLE);
  assert.equal(r.label, "likely_human", `score ${r.score}`);
  assert.deepEqual(r.sentences, []);
  assert.ok(r.passages.every((p) => !p.flagged));
});

test("one machine-like section in a human post is found and only it is flagged", () => {
  const r = detectAiInMarkdown(MIXED);
  assert.notEqual(r.label, "likely_human", `score ${r.score}`);
  assert.ok(r.sentences.length > 0);
  for (const s of r.sentences) assert.ok(!HUMAN_SAMPLE.includes(s.text), `human sentence flagged: ${s.text}`);
});

test("too little text is never called AI", () => {
  const r = detectAiInMarkdown(SHORT);
  assert.equal(r.confidence, "low");
  assert.deepEqual(r.sentences, []);
  assert.ok(r.passages.every((p) => !p.flagged));
});

test("headings, quotes in blockquotes and code are not scored", () => {
  const md = ["# Additionally, Furthermore, Moreover", "", "> Additionally, it is essential to leverage seamless synergy.", "", "```", "ensure robust optimize", "```"].join("\n");
  const r = detectAiInMarkdown(md);
  assert.equal(r.wordCount, 0);
  assert.deepEqual(r.sentences, []);
});

test("decide: no signals sits at the prior; every signal maxed is near certain", () => {
  const none = features([]);
  assert.equal(decide(none).probability, Math.round((1 / (1 + Math.exp(-BIAS))) * 100) / 100);
  const maxed = { words: 400, sentences: 20, values: Object.fromEntries(Object.keys(none.values).map((k) => [k, 1])) } as typeof none;
  assert.ok(decide(maxed).probability > 0.99);
  assert.equal(labelFor(0.39), "likely_human");
  assert.equal(labelFor(0.5), "mixed");
  assert.equal(labelFor(0.7), "likely_ai");
  assert.ok(FLAG_AT < 0.7);
});

test("numbers and named items in a list are content, not a decorative triplet", () => {
  const f = features(["Most tanks last 8, 10, or 12 years.", "We stock Rheem, Bradford White, and A. O. Smith heaters.", "Call Dale."]);
  assert.equal(f.values.tricolons, 0);
});

// ---- The page's own helpers ----

test("runDetector: pasted text scores like the Markdown, and short text is not enough", () => {
  const pasted = runDetector(AI_SAMPLE.replace(/\n/g, "\r\n"));
  assert.equal(pasted.detection.score, 90);
  assert.equal(pasted.enough, true);
  assert.equal(pasted.sentences, 9);
  const short = runDetector(SHORT);
  assert.equal(short.enough, false);
  // Blank lines with stray spaces still separate paragraphs, as in the app.
  const spaced = runDetector(AI_SAMPLE.replace(/\n\n/g, "\n  \n"));
  assert.equal(spaced.detection.score, 90);
});

test("readable strips Markdown marks but keeps the words", () => {
  assert.equal(readable("See [our guide](https://x.com/a) for **real** numbers and `code`."), "See our guide for real numbers and code.");
  assert.equal(readable("An *aside* here, and snake_case_words stay."), "An aside here, and snake_case_words stay.");
});

test("articleFromHtml reads the article like the app's Editor, without page furniture", () => {
  const html = `<!doctype html><html><head><title>Water heaters | Acme</title></head><body>
    <nav><a href="/">Home</a> <a href="/blog">Blog</a></nav>
    <article>
      <h1>The Rheem in our basement lasted 14 years</h1>
      ${HUMAN_SAMPLE.split("\n\n").slice(1).map((p) => `<p>${p.replace(/"/g, "&quot;")}</p>`).join("\n")}
      <div class="related-posts"><p>Additionally, it is essential to ensure seamless solutions. Moreover, we leverage robust synergy.</p></div>
    </article>
    <footer>Copyright Acme Plumbing</footer>
  </body></html>`;
  const a = articleFromHtml(html, "https://acme.example.com/blog/rheem");
  assert.equal(a.title, "The Rheem in our basement lasted 14 years");
  assert.ok(a.markdown.startsWith("# The Rheem in our basement lasted 14 years\n\n"));
  assert.ok(!/related|Copyright|Additionally/.test(a.markdown), a.markdown);
  assert.equal(detectAiInMarkdown(a.markdown).score, detectAiInMarkdown(HUMAN_SAMPLE).score);
  assert.equal(a.words, 136 + 8);
});

test("articleFromHtml cuts very long articles at a paragraph break", () => {
  const para = "<p>" + "Dale fixed the 1998 Rheem tank in Boise for $240. ".repeat(20) + "</p>";
  const a = articleFromHtml(`<article>${para.repeat(80)}</article>`, "https://x.example.com/");
  assert.ok(a.markdown.length <= MAX_ARTICLE_CHARS);
  assert.ok(a.notes.some((n) => n.includes("very long")));
});
