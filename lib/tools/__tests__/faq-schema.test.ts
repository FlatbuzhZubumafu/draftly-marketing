import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildFaqJsonLd,
  cleanAnswerHtml,
  completePairs,
  faqHtml,
  faqJsonLdScript,
  hasDisallowedHtml,
  parseFaqJsonLd,
  validateFaqs,
} from "../faq-schema.ts";

test("buildFaqJsonLd drops empty and half-filled pairs", () => {
  const ld = buildFaqJsonLd([
    { q: "How long does a water heater last?", a: "Eight to twelve years for most tank models." },
    { q: "", a: "" },
    { q: "Orphan question?", a: "   " },
    { q: "", a: "Orphan answer." },
  ]);
  assert.equal(ld["@type"], "FAQPage");
  assert.equal(ld["@context"], "https://schema.org");
  assert.equal(ld.mainEntity.length, 1);
  assert.deepEqual(ld.mainEntity[0], {
    "@type": "Question",
    name: "How long does a water heater last?",
    acceptedAnswer: { "@type": "Answer", text: "Eight to twelve years for most tank models." },
  });
});

test("questions become plain text", () => {
  const [pair] = completePairs([{ q: "  What is <b>AEO</b>?  ", a: "Answer engine optimization." }]);
  assert.equal(pair.q, "What is AEO?");
});

test("faqJsonLdScript escapes anything that could close the script tag", () => {
  const out = faqJsonLdScript([{ q: "Is 2 < 3 & 4 > 1?", a: "Yes <b>it is</b>.</script><script>alert(1)</script>" }]);
  const inner = out.replace(/^<script type="application\/ld\+json">\n/, "").replace(/\n<\/script>$/, "");
  assert.ok(!inner.includes("<"), "no raw < inside the script body");
  assert.ok(!inner.includes(">"), "no raw > inside the script body");
  assert.ok(!inner.includes("&"), "no raw & inside the script body");
  const parsed = JSON.parse(inner);
  assert.equal(parsed.mainEntity[0].name, "Is 2 < 3 & 4 > 1?");
  assert.equal(parsed.mainEntity[0].acceptedAnswer.text, "Yes <b>it is</b>.");
});

test("cleanAnswerHtml keeps allowed tags and strips the rest", () => {
  assert.equal(cleanAnswerHtml('<p class="x">Hi <span>there</span><br/>friend</p>'), "<p>Hi there<br>friend</p>");
  assert.equal(cleanAnswerHtml("<script>alert(1)</script><em>ok</em>"), "<em>ok</em>");
  assert.equal(cleanAnswerHtml('<a href="https://example.com/a?b=1&c=2" target="_blank">x</a>'), '<a href="https://example.com/a?b=1&amp;c=2">x</a>');
  assert.equal(cleanAnswerHtml('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(cleanAnswerHtml("3 < 5 and <strong>bold</strong>"), "3 &lt; 5 and <strong>bold</strong>");
});

test("hasDisallowedHtml ignores allowed tags written differently", () => {
  assert.equal(hasDisallowedHtml("<P>One<BR/>two</P>"), false);
  assert.equal(hasDisallowedHtml('<a href="/pricing">plans</a>'), false);
  assert.equal(hasDisallowedHtml('<a href="/x" target="_blank">x</a>'), true);
  assert.equal(hasDisallowedHtml('<a href="javascript:void(0)">x</a>'), true);
  assert.equal(hasDisallowedHtml("<span>x</span>"), true);
});

test("faqHtml escapes questions and wraps bare answers in a paragraph", () => {
  const html = faqHtml([{ q: "Is 2 < 3?", a: "Yes." }, { q: "Lists?", a: "<ul><li>One</li></ul>" }]);
  assert.match(html, /<summary>Is 2 &lt; 3\?<\/summary>/);
  assert.match(html, /<p>Yes\.<\/p>/);
  assert.match(html, /\n    <ul><li>One<\/li><\/ul>\n/);
});

test("validateFaqs flags missing halves, duplicates and long answers", () => {
  const long = Array.from({ length: 130 }, () => "word").join(" ");
  const warnings = validateFaqs([
    { q: "What does it cost?", a: "Twenty dollars." },
    { q: "What does it cost", a: "Same question again." },
    { q: "No answer here?", a: "" },
    { q: "Long one?", a: long },
    { q: "", a: "" },
  ]);
  const text = warnings.map((w) => w.text).join("\n");
  assert.match(text, /Question 2 repeats question 1/);
  assert.match(text, /Question 3 has no answer/);
  assert.match(text, /Answer 4 is 130 words/);
  assert.ok(!/Question 5/.test(text), "a fully empty row is ignored");
});

test("parseFaqJsonLd reads a script tag, an array or an @graph", () => {
  const script = faqJsonLdScript([{ q: "A?", a: "B." }]);
  assert.deepEqual(parseFaqJsonLd(script), [{ q: "A?", a: "B." }]);
  const graph = JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage" }, buildFaqJsonLd([{ q: "C?", a: "D." }])] });
  assert.deepEqual(parseFaqJsonLd(graph), [{ q: "C?", a: "D." }]);
  assert.throws(() => parseFaqJsonLd('{"@type":"Article"}'), /No FAQPage markup found/);
});
