import type { Metadata } from "next";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BENCHMARK, BENCHMARK_DATE, BENCHMARK_ISO } from "@/lib/benchmark";

export const revalidate = 3600;

const TITLE = "Best AI Models for Blogging: Our 2026 Writing Benchmark";
const DESCRIPTION =
  "We had 11 AI models write the same three blog posts under one set of writing rules, then scored every draft. GPT 5.4 Mini gave the best quality for the money; Claude Opus 5.5 scored highest.";

export const metadata: Metadata = {
  title: "Best AI Models for Blogging (2026 Benchmark)",
  description: DESCRIPTION,
  alternates: { canonical: "/best-ai-models-for-blogging" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: "https://draftly.blog/best-ai-models-for-blogging" },
};

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
    q: "What is the best AI model for writing blog posts?",
    a: "In our test, Claude Opus 5.5 scored highest (95 out of 100) and GPT 5.4 Mini came a point behind at about one-tenth the cost. For most blogs, GPT 5.4 Mini is the better buy.",
  },
  {
    q: "Is Claude or ChatGPT better for blogging?",
    a: "It depends on the model more than the company. Claude Opus 5.5 and OpenAI's GPT 5.4 Mini took the top two spots, while Claude Haiku 4.5 finished last, mostly because of heavy em dash use.",
  },
  {
    q: "What is the cheapest AI model that still writes a good blog post?",
    a: "DeepSeek V3.2 cost $0.004 per post and scored 88. GPT 5.4 Mini cost $0.009 and scored 94, which is the stronger value if you can spend a fraction of a cent more.",
  },
  {
    q: "Do newer AI models write better blog posts?",
    a: "Usually. Claude Sonnet 5.5 scored 91 where the older Sonnet 4.6 scored 79, and the newer model also costs less per token. GPT 5.5 is the exception worth knowing about: it ran long, averaging 1,774 words against a 1,000 to 1,200 word brief.",
  },
];

const money = (n: number) => (n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(3)}`);

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
              Best AI Models for Blogging
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              GPT 5.4 Mini writes the best blog posts for the money, and Claude Opus 5.5 writes the best blog posts,
              period. We gave 11 models the same three briefs and the same writing rules, then scored all 33 drafts.
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Edition 1. Tested {BENCHMARK_DATE} by{" "}
              <a href="https://prestonvawdrey.com" style={{ color: "var(--color-accent)" }}>
                Preston Vawdrey
              </a>{" "}
              at Draftly.
            </p>
          </header>

          <section className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PICKS.map((p) => (
              <div key={p.label} className="p-6 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {p.label}
                </h2>
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

          <section className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              The Full Leaderboard
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Score is the average of three drafts, out of 100. The range shows the worst and best draft, which tells
              you how much a model wobbles from one topic to the next.
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

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              What the Results Show
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                <strong style={{ color: "var(--color-text-primary)" }}>Price and quality barely track each other.</strong>{" "}
                The two most expensive models, GPT 5.5 and Claude Opus 5.5, finished eighth and first. GPT 5.4 Mini beat
                eight models that cost more per post.
              </p>
              <p>
                <strong style={{ color: "var(--color-text-primary)" }}>Upgrade within a family when you can.</strong>{" "}
                Claude Sonnet 5.5 scored 12 points higher than Sonnet 4.6. The older model used nine em dashes across three
                posts and the most contrast phrasing of any model we tested.
              </p>
              <p>
                <strong style={{ color: "var(--color-text-primary)" }}>Em dashes are the most common AI tell.</strong> Claude
                Haiku 4.5 used 29 of them in three posts, even with a rule asking it to ration them. That one habit cost it
                more points than anything else.
              </p>
              <p>
                <strong style={{ color: "var(--color-text-primary)" }}>Bigger models ignore length limits.</strong> GPT 5.5
                averaged 1,774 words against a brief that asked for 1,000 to 1,200. More words cost more and take longer to
                edit, and they rarely help a reader.
              </p>
            </div>
          </section>

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              How We Ran the Test
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

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              What This Test Measures, and Its Limits
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                This benchmark measures how well a model follows a clear set of writing and SEO rules. That is the hard
                part of using AI for a real blog, and it is what Draftly cares about. It does not measure how persuasive or
                accurate a post is.
              </p>
              <p>
                Three briefs per model is a small sample, so treat a two or three point gap as a tie. Three reasoning
                models (Kimi K3, Qwen 3.8 Max and DeepSeek V4 Pro) and a reader-voice score judged by multiple models are
                coming in the next edition, along with more briefs per model.
              </p>
            </div>
          </section>

          <section className="mt-20 max-w-3xl">
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
              Draftly writes with GPT 5.4 Mini by default and applies these same writing rules to every post. Paid plans
              can switch to any model on this list. Your first post is free.
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
