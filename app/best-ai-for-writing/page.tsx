import type { Metadata } from "next";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BENCHMARK, BENCHMARK_DATE, BENCHMARK_ISO, seoScore, type BenchmarkRow } from "@/lib/benchmark";

export const revalidate = 3600;

// Targets the "best AI for writing" cluster (Ahrefs, US, Oct 2026): "what is the best ai
// for writing" / "which ai is best for writing" (600 each), "which ai tool is best for
// content writing" (1,200), "best llm for writing" (300), "best ai model for writing"
// (200), "best ai for content writing", "best ai for blog writing", "is chatgpt still
// the best ai". Each one has a section that answers it in its first sentence.
const TITLE = "Best AI for Writing in 2026: We Tested 11 Models on Real Blog Posts";
const DESCRIPTION =
  "Which AI is best for writing? We had 11 AI models write the same three blog posts under one set of writing rules and scored every draft. GPT 5.4 Mini is the best value; Claude Opus 5.5 scored highest.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/best-ai-for-writing" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: "https://draftly.blog/best-ai-for-writing" },
};

const top = BENCHMARK[0];
const mini = BENCHMARK.find((r) => r.model === "GPT 5.4 Mini")!;

const PICKS = [
  {
    label: "Best value",
    model: "GPT 5.4 Mini",
    stat: "94 / 100 for under a cent a post",
    body: "Second-highest score, the fastest model we tested (13 seconds a post) and about one-tenth the cost of the top scorer. It is now Draftly's default model.",
  },
  {
    label: "Highest score",
    model: "Claude Opus 5.5",
    stat: "95 / 100, the most consistent",
    body: "All three drafts landed within one point of each other, with zero em dashes. At about $0.10 a post, it is the premium pick.",
  },
  {
    label: "Cleanest punctuation",
    model: "Gemini 3.8 Flash",
    stat: "The only perfect 100",
    body: "No em dashes in any draft and one post that passed every check. Scores swung more between briefs than the two leaders.",
  },
  {
    label: "Lowest cost",
    model: "DeepSeek V3.2",
    stat: "88 / 100 for $0.004 a post",
    body: "The cheapest model in the test still finished sixth. It missed the FAQ section and the closing CTA on one of three posts.",
  },
];

const CHECKS = [
  "Length between 950 and 1,500 words",
  "Em dashes kept to about one per 300 words",
  "No AI vocabulary such as seamless, leverage, delve or landscape",
  "No \"it's not X, it's Y\" contrast phrasing",
  "No mechanical openers such as Additionally or Furthermore",
  "One H1, at least three H2s, and no section titled Introduction or Conclusion",
  "No paragraph over 120 words",
  "An FAQ section answering the brief's questions",
  "Target keyword in the title, the first 100 words and an H2",
  "Meta title and meta description at the right length",
  "The post ends on the call to action from the brief",
  "No emoji",
];

const FAQS = [
  {
    q: "What is the best AI for writing?",
    a: "Claude Opus 5.5 scored highest in our 2026 writing test (95 out of 100), and GPT 5.4 Mini scored 94 at about one-tenth the cost. For most people writing regularly, GPT 5.4 Mini is the best AI for writing.",
  },
  {
    q: "Which AI tool is best for content writing?",
    a: "Pick the tool for the workflow and the model for the writing. A content tool like Draftly adds topic research, brand voice and one-click publishing, then writes with a model such as GPT 5.4 Mini, the best value in our test.",
  },
  {
    q: "What is the best LLM for writing?",
    a: "Claude Opus 5.5 and GPT 5.4 Mini, in that order. Gemini 3.8 Flash and Claude Sonnet 5.5 round out the top four, all scoring 91 or higher out of 100.",
  },
  {
    q: "Is ChatGPT still the best AI for writing?",
    a: "OpenAI's GPT 5.4 Mini, one of the models behind ChatGPT, took second place. The larger GPT 5.4 and GPT 5.5 finished seventh and eighth, mostly for running long and using contrast phrasing.",
  },
  {
    q: "What is the best AI for SEO writing?",
    a: "Claude Opus 5.5 and GPT 5.5 passed all 18 on-page SEO checks in our test: keyword placement, meta title and description length, and an FAQ section. Gemini 3.8 Flash and Claude Sonnet 5.5 passed 17.",
  },
  {
    q: "What is the cheapest AI that still writes well?",
    a: "DeepSeek V3.2 cost $0.004 per post and scored 88. GPT 5.4 Mini cost $0.009 and scored 94, the stronger value for a fraction of a cent more.",
  },
  {
    q: "Do newer AI models write better?",
    a: "Usually. Claude Sonnet 5.5 scored 91 where the older Sonnet 4.6 scored 79, and the newer model costs less per token. GPT 5.5 is the exception worth knowing about: it averaged 1,774 words against a 1,000 to 1,200 word brief.",
  },
];

const money = (n: number) => (n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(3)}`);

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 max-w-3xl">
      <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
        {title}
      </h2>
      <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

type Column = { label: string; value: (r: BenchmarkRow) => string | number; strong?: boolean };

/** A leaderboard ranked for one question, with only the columns that question cares about. */
function QueryTable({ caption, rows, columns }: { caption: string; rows: BenchmarkRow[]; columns: Column[] }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
      <table className="w-full text-sm min-w-[600px]">
        <caption className="text-left px-4 py-3 text-xs font-semibold" style={{ background: "var(--color-bg-surface)", color: "var(--color-text-secondary)" }}>
          {caption}
        </caption>
        <thead style={{ background: "var(--color-bg-surface)" }}>
          <tr className="text-left">
            <th className="px-4 py-2 font-semibold">Model</th>
            {columns.map((c) => (
              <th key={c.label} className="px-4 py-2 font-semibold text-right">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model} style={{ borderTop: "1px solid var(--color-border)" }}>
              <td className="px-4 py-2.5 font-medium">{r.model}</td>
              {columns.map((c) => (
                <td key={c.label} className={`px-4 py-2.5 text-right ${c.strong ? "font-semibold" : ""}`}>{c.value(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const by = (...keys: ((r: BenchmarkRow) => number)[]) => (a: BenchmarkRow, b: BenchmarkRow) => {
  for (const k of keys) { const d = k(a) - k(b); if (d) return d; }
  return 0;
};

const CONTENT_ROWS = [...BENCHMARK].sort(by((r) => -(r.faq + r.cta), (r) => r.contrast + r.aiWords + r.openers, (r) => r.cost));
const SEO_ROWS = [...BENCHMARK].sort(by((r) => -seoScore(r), (r) => r.cost));
const BLOG_ROWS = [...BENCHMARK].sort(by((r) => r.wordsOff, (r) => r.longParas));
const OPENAI_ROWS = BENCHMARK.filter((r) => r.provider === "OpenAI" || r === BENCHMARK[0]);

const B = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: "var(--color-text-primary)" }}>{children}</strong>
);

export default async function BenchmarkPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESCRIPTION,
        datePublished: BENCHMARK_ISO,
        dateModified: BENCHMARK_ISO,
        author: { "@type": "Person", name: "Preston Vawdrey", url: "https://prestonvawdrey.com" },
        publisher: { "@type": "Organization", name: "Draftly", url: "https://draftly.blog" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="container-draftly max-w-4xl">
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              The Best AI for Writing in 2026, Tested
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              The best AI for writing is GPT 5.4 Mini if you care about cost, and Claude Opus 5.5 if you want the
              highest quality. We gave 11 AI models the same three blog briefs and the same writing rules, then scored
              all 33 drafts on structure, style and SEO.
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Edition 1. Tested {BENCHMARK_DATE} by{" "}
              <a href="https://prestonvawdrey.com" style={{ color: "var(--color-accent)" }}>
                Preston Vawdrey
              </a>{" "}
              at Draftly.
            </p>
          </header>

          <Section title="Which AI Is Best for Writing?">
            <p>
              Claude Opus 5.5 is the best AI for writing on quality alone: {top.format} out of 100, with all three drafts
              within a point of each other. GPT 5.4 Mini scored {mini.format} for {money(mini.cost)} a post, which makes it
              the best AI for writing when you publish often and pay per post. Here is how the top picks compare.
            </p>
          </Section>

          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PICKS.map((p) => (
              <div key={p.label} className="p-6 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {p.label}
                </h3>
                <p className="mt-1 text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                  {p.model}
                </p>
                <p className="mt-1 text-sm font-medium">{p.stat}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </section>

          <section id="leaderboard" className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              The Best LLM for Writing: Full Leaderboard
            </h2>
            <p className="mb-6 leading-relaxed max-w-3xl" style={{ color: "var(--color-text-secondary)" }}>
              Score is the average of three drafts, out of 100. The range shows the worst and best draft, which tells you
              how much a model wobbles from one topic to the next. Cost is what we were billed per post.
            </p>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[720px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold">Rank</th>
                    <th className="px-4 py-3 font-semibold">Model</th>
                    <th className="px-4 py-3 font-semibold text-right">Score</th>
                    <th className="px-4 py-3 font-semibold text-right">Range</th>
                    <th className="px-4 py-3 font-semibold text-right">Cost per post</th>
                    <th className="px-4 py-3 font-semibold text-right">Seconds</th>
                    <th className="px-4 py-3 font-semibold text-right">Avg words</th>
                    <th className="px-4 py-3 font-semibold text-right">Em dashes</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK.map((r, i) => (
                    <tr key={r.model} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{r.model}</span>
                        <span className="ml-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {r.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{r.format}</td>
                      <td className="px-4 py-3 text-right" style={{ color: "var(--color-text-secondary)" }}>
                        {r.low} to {r.high}
                      </td>
                      <td className="px-4 py-3 text-right">{money(r.cost)}</td>
                      <td className="px-4 py-3 text-right">{r.seconds}</td>
                      <td className="px-4 py-3 text-right">{r.words.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{r.emDashes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Section id="content-writing" title="Best AI for Content Writing">
            <p>
              For content writing, the AI model matters less than how you use it. Content marketing needs a topic worth
              writing about, a consistent brand voice, SEO structure and a way to publish. A chat window gives you none of
              those, so the best AI tool for content writing pairs a strong model with that workflow.
            </p>
            <p>
              On the model side, our results point to GPT 5.4 Mini for volume and Claude Opus 5.5 for flagship pieces.
              Both wrote an FAQ section and ended on the brief&apos;s call to action in all three posts, with almost no
              AI vocabulary or mechanical openers. The table ranks every model on those content habits.
            </p>
            <p>
              Draftly is built around that pairing. It finds timely topics from your industry&apos;s news, writes in your
              brand voice with GPT 5.4 Mini by default, scores each draft for machine-sounding phrasing and publishes to
              WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable
              caption="Content writing: structure kept and AI habits avoided (three posts per model, fewer tells is better)"
              rows={CONTENT_ROWS}
              columns={[
                { label: "FAQ included", value: (r) => `${r.faq} of 3`, strong: true },
                { label: "Ended on CTA", value: (r) => `${r.cta} of 3`, strong: true },
                { label: "Contrast phrases", value: (r) => r.contrast },
                { label: "AI vocabulary", value: (r) => r.aiWords },
                { label: "Mechanical openers", value: (r) => r.openers },
              ]}
            />
          </div>

          <Section id="seo-writing" title="Best AI for SEO Writing">
            <p>
              Claude Opus 5.5 and GPT 5.5 are the best AI for SEO writing in our test, each passing all 18 on-page SEO
              checks. Those checks cover the target keyword in the title, the first 100 words and an H2, a meta title and
              meta description at the right length, and an FAQ section, across three posts.
            </p>
            <p>
              The value picks trade a little SEO precision for cost. Gemini 3.8 Flash and Claude Sonnet 5.5 passed 17.
              GPT 5.4 Mini passed 15: across three posts it missed one keyword placement, one meta title length and one
              meta description length. All three are quick fixes in review.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable
              caption="SEO writing: on-page SEO checks passed across three posts"
              rows={SEO_ROWS}
              columns={[
                { label: "SEO checks (of 18)", value: (r) => seoScore(r), strong: true },
                { label: "Keyword placed (of 9)", value: (r) => r.keyword },
                { label: "Meta title (of 3)", value: (r) => r.metaTitle },
                { label: "Meta description (of 3)", value: (r) => r.metaDesc },
                { label: "FAQ (of 3)", value: (r) => r.faq },
                { label: "Cost per post", value: (r) => money(r.cost) },
              ]}
            />
          </div>

          <Section id="blog-writing" title="Best AI for Blog Writing">
            <p>
              The best AI for blog writing is the one that holds a structure across a 1,000-word post. That is where the
              models split. Claude Opus 5.5, GPT 5.4 Mini, Gemini 3.8 Flash and Claude Sonnet 5.5 kept every post inside
              the brief&apos;s shape. Gemini 3.1 Pro dropped the FAQ section on two of three posts, and its scores ranged
              from 64 to 95.
            </p>
            <p>
              Length discipline matters for blogs too. DeepSeek V3.2 and Gemini 3.8 Flash landed closest to the 1,000 to
              1,200 word brief, averaging 20 and 51 words from its midpoint. GPT 5.5 averaged 1,774 words, which means more
              editing and a higher bill. GPT 5.4 Mini runs about 175 words long, enough to notice and easy to trim.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable
              caption="Blog writing: length discipline and consistency against a 1,000 to 1,200 word brief"
              rows={BLOG_ROWS}
              columns={[
                { label: "Avg words", value: (r) => r.words.toLocaleString() },
                { label: "Words off target", value: (r) => r.wordsOff, strong: true },
                { label: "Posts in range", value: (r) => `${r.inRange} of 3` },
                { label: "Paragraphs over 120 words", value: (r) => r.longParas },
                { label: "Score range", value: (r) => `${r.low} to ${r.high}` },
              ]}
            />
          </div>

          <Section id="chatgpt" title="Is ChatGPT Still the Best AI for Writing?">
            <p>
              ChatGPT runs on OpenAI&apos;s GPT models, and they landed in two places. GPT 5.4 Mini took second overall with
              94. The larger GPT 5.4 and GPT 5.5 tied at 85 for seventh and eighth, losing points for contrast phrasing
              (&quot;it&apos;s not X, it&apos;s Y&quot;) and, in GPT 5.5&apos;s case, length.
            </p>
            <p>
              So the smaller OpenAI model wrote cleaner blog posts than the bigger ones in this test. Anthropic&apos;s Claude
              Opus 5.5 edged out every OpenAI model by a point.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable
              caption="ChatGPT's GPT models against the top scorer"
              rows={OPENAI_ROWS}
              columns={[
                { label: "Score", value: (r) => r.format, strong: true },
                { label: "Cost per post", value: (r) => money(r.cost) },
                { label: "Avg words", value: (r) => r.words.toLocaleString() },
                { label: "Contrast phrases", value: (r) => r.contrast },
                { label: "Seconds", value: (r) => r.seconds },
              ]}
            />
          </div>

          <Section title="What the Results Show">
            <p>
              <B>Price and quality barely track each other.</B> The two most expensive models, GPT 5.5 and Claude Opus 5.5,
              finished eighth and first. GPT 5.4 Mini beat eight models that cost more per post.
            </p>
            <p>
              <B>Upgrade within a family when you can.</B> Claude Sonnet 5.5 scored 12 points higher than Sonnet 4.6. The
              older model used nine em dashes across three posts and the most contrast phrasing of any model we tested.
            </p>
            <p>
              <B>Em dashes are the most common AI tell.</B> Claude Haiku 4.5 used 29 of them in three posts, even with a rule
              asking it to ration them. That one habit cost it more points than anything else.
            </p>
          </Section>

          <section id="method" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              How We Tested the AI Models
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Every model wrote three posts for three made-up businesses: a roofing company in Boise, a B2B software
                company that automates accounts payable, and a family dental practice in Phoenix. Each brief included a
                brand voice, a target keyword, three reader questions and a call to action.
              </p>
              <p>
                All 11 models got the same system prompt: the writing rules Draftly uses in production. We called each one
                through the Vercel AI Gateway, so the cost column is what we were actually billed per post.
              </p>
              <p>A script scored every draft against 12 checks, with points taken off for each miss:</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {CHECKS.map((c) => (
                <li key={c} className="flex gap-3">
                  <span className="mt-[9px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} aria-hidden="true" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <Section title="What This Test Measures, and Its Limits">
            <p>
              This benchmark measures how well an AI model follows a clear set of writing and SEO rules. That is the hard
              part of using AI for a real blog, and it is what Draftly cares about. It does not measure how persuasive or
              accurate a post is.
            </p>
            <p>
              Three briefs per model is a small sample, so treat a two or three point gap as a tie. Three reasoning models
              (Kimi K3, Qwen 3.8 Max and DeepSeek V4 Pro) and a reader-voice score judged by multiple models are coming in
              the next edition, along with more briefs per model.
            </p>
          </Section>

          <section id="faq" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 rounded-2xl p-8 sm:p-12" style={{ background: "#111", color: "var(--color-text-inverted)" }}>
            <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
              Write With the Winner
            </h2>
            <p className="max-w-2xl mb-8 leading-relaxed" style={{ color: "#bbb" }}>
              Draftly writes with GPT 5.4 Mini by default and applies these same writing rules to every post. Paid plans can
              switch to any model on this list. Your first post is free.
            </p>
            <a href={registerUrl} className="btn btn-primary">
              {s.heroCtaText}
            </a>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
