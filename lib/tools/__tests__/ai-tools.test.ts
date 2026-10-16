import { test } from "node:test";
import assert from "node:assert/strict";
import { ToolError } from "../ssrf.ts";
import { DailyBudget, aiPerMinute } from "../ai/limits.ts";
import { SlidingLimiter } from "../rate-limit.ts";
import { cleanOut, validatePhrase } from "../ai/text.ts";
import { chatJson, estimateCost } from "../ai/gateway.ts";
import { keywordStuffed, needsRetry, parseBrief, runBrief, validateBriefInput, type BriefInput } from "../ai/brief.ts";
import { dedupeIdeas, looksLikeUrl, parseIdeas, runIdeas, validateIdeasInput } from "../ai/ideas.ts";
import { pickPages, type SiteContext } from "../ai/site.ts";
import { handleAiTool } from "../ai/api.ts";

const throwsTool = (fn: () => unknown, re?: RegExp) =>
  assert.throws(fn, (e: unknown) => e instanceof ToolError && (!re || re.test(e.publicMessage)));

// ---------- inputs ----------

test("validatePhrase accepts short keywords and rejects junk", () => {
  assert.equal(validatePhrase("  water   heater repair\tcost ", "keyword"), "water heater repair cost");
  throwsTool(() => validatePhrase("", "keyword"), /Enter a keyword/);
  throwsTool(() => validatePhrase("a", "keyword"));
  throwsTool(() => validatePhrase("12345 678", "keyword"), /at least one word/);
  throwsTool(() => validatePhrase("x".repeat(81), "keyword"), /under 80/);
  throwsTool(() => validatePhrase("one two three four five six seven eight nine ten eleven", "keyword"), /10 words/);
  throwsTool(() => validatePhrase("see https://evil.example", "keyword"), /plain words/);
  throwsTool(() => validatePhrase("<script>alert(1)</script>", "keyword"), /plain words/);
});

test("validateBriefInput checks the optional URL and audience", () => {
  assert.deepEqual(validateBriefInput({ keyword: "drain cleaning cost" }), { keyword: "drain cleaning cost", url: null, audience: null });
  assert.equal(validateBriefInput({ keyword: "drain cleaning cost", url: "example.com" }).url, "https://example.com/");
  throwsTool(() => validateBriefInput({ keyword: "drain cleaning cost", url: "http://127.0.0.1/admin" }));
  throwsTool(() => validateBriefInput({ keyword: "drain cleaning cost", audience: "x".repeat(130) }), /audience/);
  throwsTool(() => validateBriefInput({ keyword: 42 }));
});

test("validateIdeasInput takes a website or a topic", () => {
  assert.deepEqual(validateIdeasInput({ topic: "residential plumbing" }), { url: null, topic: "residential plumbing" });
  assert.equal(validateIdeasInput({ url: "www.example.com" }).url, "https://www.example.com/");
  throwsTool(() => validateIdeasInput({}), /website or a topic/);
  throwsTool(() => validateIdeasInput({ url: "http://localhost:3000" }));
  assert.equal(looksLikeUrl("acmeplumbing.com"), true);
  assert.equal(looksLikeUrl("https://acme.com/blog"), true);
  assert.equal(looksLikeUrl("residential plumbing"), false);
  assert.equal(looksLikeUrl("dentist"), false);
});

// ---------- limits ----------

test("DailyBudget caps runs and spend per UTC day and resets", () => {
  const day1 = Date.UTC(2026, 9, 16, 12);
  const b = new DailyBudget(2, 0.01);
  assert.equal(b.take(day1), true);
  assert.equal(b.take(day1), true);
  assert.equal(b.take(day1), false, "run cap");
  b.refund(day1);
  assert.equal(b.take(day1), true, "refund frees a run");
  const day2 = day1 + 86_400_000;
  assert.equal(b.take(day2), true, "new day resets");
  b.spend(0.02, day2);
  assert.equal(b.take(day2), false, "spend cap");
  b.spend(Number.NaN, day2);
  assert.equal(b.state.spent, 0.02);
});

test("per-IP limiter allows a short burst then blocks", () => {
  const l = new SlidingLimiter(3, 60_000);
  const t = 1_000_000;
  assert.equal(l.hit("ip", t), 0);
  assert.equal(l.hit("ip", t), 0);
  assert.equal(l.hit("ip", t), 0);
  assert.ok(l.hit("ip", t) > 0);
  assert.equal(l.hit("other", t), 0);
  assert.equal(l.hit("ip", t + 60_001), 0, "window resets");
});

// ---------- output validation ----------

const INPUT: BriefInput = { keyword: "water heater repair cost", url: null, audience: null };
const SITE: SiteContext = {
  origin: "https://acme.example",
  host: "acme.example",
  title: "Acme Plumbing",
  description: "",
  headings: [],
  text: "",
  pages: [
    { url: "https://acme.example/blog/tankless-water-heaters", title: "tankless water heaters" },
    { url: "https://acme.example/services/water-heaters", title: "water heaters" },
  ],
  postCount: 1,
};

function goodBrief(over: Record<string, unknown> = {}) {
  return {
    intent: { type: "commercial", summary: "They want a price range and whether to repair or replace." },
    audience: "Homeowners with a failing heater",
    title: "Water Heater Repair Cost: What You'll Pay",
    meta: "What common water heater repairs cost, what drives the price and when replacing the tank is the better deal for your home.",
    wordCount: { min: 1200, max: 1800 },
    outline: [
      { h2: "What most repairs cost", points: ["Ranges for common repairs", "What's included"] },
      { h2: "Gas and electric units fail differently", points: ["Thermocouples", "Elements"] },
      { h2: "What pushes the price up", points: ["After-hours visits"] },
      { h2: "Repair or replace", points: ["Age rule"] },
      { h2: "Checks before you call", points: ["Pilot light"] },
    ],
    questions: ["Is it worth repairing an old heater?", "How long does a repair take?", "Why is it leaking?"],
    mustCover: ["Price by repair type", "Gas versus electric"],
    sources: ["Manufacturer warranty pages for lifespan"],
    internalLinks: [
      { url: "https://acme.example/blog/tankless-water-heaters/", anchor: "tankless water heaters", why: "In the replace section" },
      { url: "https://made-up.example/page", anchor: "made up", why: "Invented" },
    ],
    ...over,
  };
}

test("parseBrief keeps a valid brief, cleans dashes and drops invented links", () => {
  const b = parseBrief(goodBrief({ title: "Water Heater Repair Cost — What You'll Pay" }), INPUT, SITE);
  assert.equal(b.title, "Water Heater Repair Cost, What You'll Pay");
  assert.equal(b.outline.length, 5);
  assert.deepEqual(
    b.internalLinks.map((l) => l.url),
    ["https://acme.example/blog/tankless-water-heaters"],
    "only sitemap URLs survive",
  );
  assert.equal(b.site, "https://acme.example");
});

test("parseBrief drops all internal links when there is no site", () => {
  assert.equal(parseBrief(goodBrief(), INPUT, null).internalLinks.length, 0);
});

test("parseBrief clamps the word count and fixes a bad intent", () => {
  const b = parseBrief(goodBrief({ wordCount: { min: 50, max: 99999 }, intent: { type: "weird", summary: "x wants y" } }), INPUT, null);
  assert.deepEqual(b.wordCount, { min: 900, max: 3000 }, "a nonsense minimum falls back to 900");
  assert.deepEqual(parseBrief(goodBrief({ wordCount: { min: 400, max: 500 } }), INPUT, null).wordCount, { min: 600, max: 800 });
  assert.equal(b.intent.type, "informational");
});

test("parseBrief rejects incomplete output", () => {
  throwsTool(() => parseBrief(goodBrief({ outline: [{ h2: "Only one", points: ["x y z"] }] }), INPUT, null), /incomplete/);
  throwsTool(() => parseBrief(goodBrief({ title: "" }), INPUT, null), /incomplete/);
  throwsTool(() => parseBrief("not an object", INPUT, null), /incomplete/);
});

test("keyword stuffing and banned words trigger a retry", () => {
  const stuffed = parseBrief(
    goodBrief({
      outline: ["Water heater repair cost basics", "Water heater repair cost by type", "Water heater repair cost factors", "Water heater repair cost tips", "Other"].map((h2) => ({ h2, points: ["a point"] })),
    }),
    INPUT,
    null,
  );
  assert.equal(keywordStuffed(stuffed.outline, INPUT.keyword), true);
  assert.equal(needsRetry(stuffed), true);
  assert.equal(needsRetry(parseBrief(goodBrief({ title: "The Ultimate Guide to Repair Costs" }), INPUT, null)), true);
  assert.equal(needsRetry(parseBrief(goodBrief(), INPUT, null)), false);
});

const idea = (title: string) => ({ title, angle: "A specific angle for the reader.", type: "how-to", reader: "Homeowners" });

test("parseIdeas dedupes against existing posts and each other", () => {
  const raw = {
    business: "A plumber",
    ideas: [
      idea("Tankless Water Heaters Explained"), // repeats an existing post
      idea("How to Keep Pipes From Freezing"),
      idea("How to Keep Your Pipes From Freezing"), // repeats the one above
      idea("What a Drain Cleaning Visit Costs"),
      idea("Signs Your Sewer Line Needs Replacing"),
      idea("When to Replace a Garbage Disposal"),
      idea("How to Find Your Main Water Shutoff"),
      idea("Fixing a Running Toilet Yourself"),
      idea("Questions to Ask Before Hiring a Plumber"),
    ],
  };
  const r = parseIdeas(raw, { url: SITE.origin, topic: null }, SITE);
  const titles = r.ideas.map((i) => i.title);
  assert.ok(!titles.includes("Tankless Water Heaters Explained"));
  assert.equal(titles.filter((t) => /Freezing/.test(t)).length, 1);
  assert.equal(r.ideas.length, 7);
});

test("parseIdeas rejects thin output", () => {
  throwsTool(() => parseIdeas({ ideas: [idea("Only One Idea Here")] }, { url: null, topic: "plumbing" }, null), /thin/);
});

test("dedupeIdeas keeps distinct titles", () => {
  const kept = dedupeIdeas([idea("Tank or Tankless Water Heater"), idea("What Drain Cleaning Costs")] as never, ["water softener installation"]);
  assert.equal(kept.length, 2);
});

test("cleanOut swaps em and en dashes", () => {
  assert.equal(cleanOut("Costs — and why", 100), "Costs, and why");
  assert.equal(cleanOut("Pages 3–5", 100), "Pages 3-5");
});

test("pickPages prefers posts and skips archives", () => {
  const { pages, postCount } = pickPages(
    [
      { loc: "https://acme.example/", lastmod: null },
      { loc: "https://acme.example/category/news/", lastmod: null },
      { loc: "https://acme.example/blog/how-to-fix-a-leak", lastmod: null },
      { loc: "https://acme.example/services/drain-cleaning", lastmod: null },
      { loc: "https://other.example/blog/elsewhere", lastmod: null },
    ],
    "acme.example",
  );
  assert.deepEqual(
    pages.map((p) => p.title),
    ["how to fix a leak", "drain cleaning"],
  );
  assert.equal(postCount, 1);
});

// ---------- gateway and runs (mocked; no network) ----------

function mockGateway(responses: unknown[]) {
  const calls: unknown[] = [];
  const original = globalThis.fetch;
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    calls.push(JSON.parse(String(init?.body)));
    const next = responses[Math.min(calls.length - 1, responses.length - 1)];
    return new Response(JSON.stringify({ choices: [{ message: { content: typeof next === "string" ? next : JSON.stringify(next) } }], usage: { prompt_tokens: 1000, completion_tokens: 2000, cost: 0.0012 } }), { status: 200 });
  }) as typeof fetch;
  return { calls, restore: () => (globalThis.fetch = original) };
}

test("chatJson sends a JSON-mode request and reports cost", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const m = mockGateway([{ ok: true }]);
  try {
    const r = await chatJson({ system: "s", user: "u", maxTokens: 100 });
    assert.deepEqual(r.json, { ok: true });
    assert.equal(r.costUsd, 0.0012);
    const body = m.calls[0] as Record<string, unknown>;
    assert.equal(body.model, "openai/gpt-6-luna");
    assert.deepEqual(body.response_format, { type: "json_object" });
    assert.equal(body.reasoning_effort, "low");
  } finally {
    m.restore();
  }
});

test("chatJson turns unreadable output into a ToolError", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const m = mockGateway(["this is not json"]);
  try {
    await assert.rejects(chatJson({ system: "s", user: "u", maxTokens: 100 }), (e: unknown) => e instanceof ToolError);
  } finally {
    m.restore();
  }
});

test("estimateCost uses Luna list prices", () => {
  assert.equal(Number(estimateCost(1_000_000, 1_000_000).toFixed(2)), 0.6);
  assert.ok(estimateCost(1500, 2500) < 0.002);
});

test("runBrief retries once when the first brief is stuffed", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const stuffed = goodBrief({ outline: [1, 2, 3, 4, 5].map((i) => ({ h2: `Water heater repair cost part ${i}`, points: ["a point"] })) });
  const m = mockGateway([stuffed, goodBrief()]);
  let spent = 0;
  try {
    const b = await runBrief(INPUT, (c) => (spent += c), "2026-10-16");
    assert.equal(m.calls.length, 2);
    assert.equal(b.outline[0].h2, "What most repairs cost");
    assert.ok(Math.abs(spent - 0.0024) < 1e-9, "both calls are counted");
  } finally {
    m.restore();
  }
});

test("runIdeas with a topic makes one call when the result is good", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const titles = ["Freeze-Proof Your Pipes", "Tank or Tankless", "Drain Cleaning Costs", "Before the Plumber Arrives", "Popping Water Heater", "Thanksgiving Drain Tips", "DIY Fixes That Backfire", "Find Your Main Shutoff", "Running Toilet Costs", "Hiring a Plumber"];
  const m = mockGateway([{ business: "Plumbing", ideas: titles.map((t) => idea(`${t} for Homeowners`)) }]);
  try {
    const r = await runIdeas({ url: null, topic: "residential plumbing" }, () => {}, "2026-10-16");
    assert.equal(m.calls.length, 1);
    assert.equal(r.ideas.length, 10);
    const user = ((m.calls[0] as { messages: { content: string }[] }).messages[1]).content;
    assert.match(user, /Today is 2026-10-16/);
    assert.match(user, /residential plumbing/);
  } finally {
    m.restore();
  }
});

// ---------- API guards ----------

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://www.draftly.blog/api/tools/blog-ideas", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://www.draftly.blog", host: "www.draftly.blog", "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 200)}`, ...headers },
    body: JSON.stringify(body),
  });

test("API is off without a key", async () => {
  delete process.env.TOOLS_AI_GATEWAY_API_KEY;
  const res = await handleAiTool("blog-ideas", req({ topic: "plumbing" }));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).unavailable, true);
});

test("API refuses missing Origin, honeypot hits and bad input", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const noOrigin = new Request("https://www.draftly.blog/api/tools/blog-ideas", { method: "POST", headers: { "content-type": "application/json", host: "www.draftly.blog" }, body: "{}" });
  assert.equal((await handleAiTool("blog-ideas", noOrigin)).status, 403);
  assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing" }, { origin: "https://evil.example" }))).status, 403);
  assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing", company: "Spam LLC" }))).status, 400);
  assert.equal((await handleAiTool("blog-ideas", req({}))).status, 400);
  assert.equal((await handleAiTool("content-brief", req({ keyword: "" }))).status, 400);
});

test("API rate limits one IP", async () => {
  process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
  const titles = ["Freeze-Proof Your Pipes", "Tank or Tankless", "Drain Cleaning Costs", "Before the Plumber Arrives", "Popping Water Heater", "Thanksgiving Drain Tips", "DIY Fixes That Backfire", "Find Your Main Shutoff", "Running Toilet Costs", "Hiring a Plumber"];
  const m = mockGateway([{ business: "Plumbing", ideas: titles.map((t) => idea(`${t} for Homeowners`)) }]);
  try {
    const ip = { "x-forwarded-for": "198.51.100.7" };
    const statuses: number[] = [];
    for (let i = 0; i < 4; i++) statuses.push((await handleAiTool("blog-ideas", req({ topic: "plumbing" }, ip))).status);
    assert.deepEqual(statuses, [200, 200, 200, 429]);
    assert.ok(aiPerMinute);
  } finally {
    m.restore();
  }
});

test("previews without a key sign in with the request's OIDC token; production stays off", async () => {
  delete process.env.TOOLS_AI_GATEWAY_API_KEY;
  const original = globalThis.fetch;
  const auths: string[] = [];
  const titles = ["Freeze-Proof Your Pipes", "Tank or Tankless", "Drain Cleaning Costs", "Before the Plumber Arrives", "Popping Water Heater", "Thanksgiving Drain Tips", "DIY Fixes That Backfire", "Find Your Main Shutoff", "Running Toilet Costs", "Hiring a Plumber"];
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    auths.push(String((init.headers as Record<string, string>).Authorization));
    const content = JSON.stringify({ business: "Plumbing", ideas: titles.map((t) => idea(`${t} for Homeowners`)) });
    return new Response(JSON.stringify({ choices: [{ message: { content } }], usage: { cost: 0.001 } }), { status: 200 });
  }) as typeof fetch;
  try {
    process.env.VERCEL_ENV = "production";
    assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing" }, { "x-vercel-oidc-token": "oidc-123" }))).status, 503);

    process.env.VERCEL_ENV = "preview";
    assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing" }, { "x-vercel-oidc-token": "oidc-123" }))).status, 200);
    assert.deepEqual(auths, ["Bearer oidc-123"]);
    assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing" }))).status, 503, "no token, no call");
    assert.equal(auths.length, 1);

    process.env.TOOLS_AI_GATEWAY_API_KEY = "test-key";
    assert.equal((await handleAiTool("blog-ideas", req({ topic: "plumbing" }, { "x-vercel-oidc-token": "oidc-123" }))).status, 200);
    assert.equal(auths[1], "Bearer test-key", "a real key wins over OIDC");
  } finally {
    globalThis.fetch = original;
    delete process.env.VERCEL_ENV;
  }
});
