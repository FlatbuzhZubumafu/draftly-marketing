import type { Metadata } from "next";
import Link from "next/link";
import { pageImages } from "@/lib/og";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BENCHMARK, BENCHMARK_DATE, BENCHMARK_ISO, type BenchmarkRow, type CopyRow } from "@/lib/benchmark";
import { draftlyCredits } from "@/lib/app-models";
import {
  BLOG_TABLE,
  CHATGPT_TABLE,
  CONTENT_TABLE,
  COPY_TABLE,
  LEADERBOARD_TABLE,
  SEO_TABLE,
  type BenchmarkTable,
} from "@/lib/benchmarkTables";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { ModelName } from "@/components/ProviderLogo";
import { CriterionExamples } from "@/components/CriterionExamples";
import {
  AUDIT_POINTS,
  AUDIT_READS,
  BLOG_CRITERIA,
  CHECK_GROUPS,
  CONTENT_CRITERIA,
  COPY_CRITERIA,
  JUDGE_CRITERIA,
  SEO_CRITERIA,
} from "@/lib/benchmarkExamples";
import { authorRef } from "@/lib/schema";

export const revalidate = 3600;

// Targets the "best AI for writing" cluster (Ahrefs, US, Oct 2026): "what is the best ai
// for writing" / "which ai is best for writing" (600 each), "which ai tool is best for
// content writing" (1,200), "best llm for writing" (300), "best ai model for writing"
// (200), "best ai for content writing", "best ai for blog writing", "best ai for
// copywriting" (250), "is chatgpt still the best ai". Each one has a section that answers
// it in its first sentence, with a table ranked on what that question cares about.
// Every number below comes from lib/benchmark.ts (generated from the run files).
const TITLE = "Best AI for Writing in 2026: We Tested 14 Models";
const DESCRIPTION =
  "Which is the best AI for writing? We tested 14 AI models on the same blog posts and copy to find the best LLM for writing, for SEO, for copywriting and value.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/best-ai-for-writing" },
  ...pageImages("/best-ai-for-writing", { title: TITLE, description: DESCRIPTION, type: "article", url: "https://www.draftly.blog/best-ai-for-writing" }),
};

const PICKS = [
  {
    label: "Highest overall score",
    model: "Qwen 3.8 Max",
    stat: "95.1 overall, perfect formatting on every post",
    body: "The only model to pass every formatting check on all three posts. It is also the slowest we tested, at about three minutes a post, and it sometimes spends its whole budget thinking and returns nothing.",
  },
  {
    label: "Most human-sounding",
    model: "Claude Sonnet 5.5",
    stat: "Top voice score: 95 out of 100",
    body: "Both judges rated it among the most natural writers of the 14, and its average voice score was the highest, at about $0.05 a post. It is Draftly's default writer.",
  },
  {
    label: "Best value",
    model: "GPT 5.4 Mini",
    stat: "90.2 overall for under a cent a post",
    body: "Fifth overall, the fastest model in the test at 13 seconds a post, and about a tenth of the cost of the top three. Draftly now writes with Claude Sonnet 5.5 by default: in a later 20-brief test, 95% of its posts with Draftly's quality check passed our reader-quality bar.",
  },
  {
    label: "Best for copywriting",
    model: "Gemini 3.8 Flash",
    stat: "Tied for first in copy, under a cent a pack",
    body: "Matched Claude Opus 5.5 at the top of our copywriting test for about a sixth of the cost, and hit every Google Ads character limit.",
  },
];

/** Tested models a Draftly user can pick, best overall score first, with credits per post. */
const IN_DRAFTLY = BENCHMARK.flatMap((r) => {
  const credits = draftlyCredits(r.model);
  return credits === undefined ? [] : [{ ...r, credits }];
}).sort((a, b) => b.overall - a.overall);

const NEW_IN_DRAFTLY = ["Qwen 3.8 Max", "Claude Opus 5.5", "Kimi K3", "GPT 5.5", "DeepSeek V4 Pro", "Gemini 3.8 Flash"];

const FAQS = [
  {
    q: "What is the best AI for writing?",
    a: "Qwen 3.8 Max scored highest overall in our 2026 test (95.1 out of 100), with Kimi K3 and Claude Opus 5.5 close behind. For most people, Claude Sonnet 5.5 (the most human-sounding writer) or GPT 5.4 Mini (the best value) is the better day-to-day choice.",
  },
  {
    q: "Which AI tool is best for content writing?",
    a: "Draftly.blog is the best AI tool for writing. It lets you write with a range of the best copywriting models, and its built-in humanizer checks every draft for the common AI copy patterns that are easy to detect, then fixes them.",
  },
  {
    q: "What is the best LLM for writing?",
    a: "Qwen 3.8 Max, Kimi K3 and Claude Opus 5.5 took the top three spots, all above 93 out of 100. Claude Sonnet 5.5 had the best voice score of any model.",
  },
  {
    q: "What is the best AI for copywriting?",
    a: "Gemini 3.8 Flash and Claude Opus 5.5 tied for first in our copywriting test, and Gemini 3.8 Flash costs about a sixth as much. Claude Sonnet 4.6 and Claude Haiku 4.5 missed many Google Ads character limits.",
  },
  {
    q: "Is ChatGPT still the best AI for writing?",
    a: "OpenAI's GPT 5.4 Mini, one of the models behind ChatGPT, finished fifth of 14. The larger GPT 5.5 and GPT 5.4 finished seventh and tenth, mostly for running long and using contrast phrasing.",
  },
  {
    q: "Can I use these models in Draftly?",
    a: "Yes, most of them. Paid Draftly plans can pick Claude Opus 5.5, Kimi K3 or GPT 5.5 for 250 credits a post, and DeepSeek V4 Pro or Gemini 3.8 Flash for 150. Claude Sonnet 5.5, the default, costs 150 credits a post and also writes the free first post.",
  },
  {
    q: "What is the best AI for SEO writing?",
    a: "Qwen 3.8 Max, GPT 5.5, DeepSeek V4 Pro and Claude Opus 5.5 each passed all 18 on-page SEO checks in our test: keyword placement, meta title and description length, and an FAQ section.",
  },
];

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


/** A leaderboard ranked for one question, with only the columns that question cares about. */
function QueryTable<T extends { model: string; provider?: string }>({ caption, rows, columns, rank }: BenchmarkTable<T>) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
      <table className="w-full text-sm min-w-[640px]">
        <caption className="text-left px-4 py-3 text-xs font-semibold" style={{ background: "var(--color-bg-surface)", color: "var(--color-text-secondary)" }}>
          {caption}
        </caption>
        <thead style={{ background: "var(--color-bg-surface)" }}>
          <tr className="text-left">
            {rank && <th className="px-4 py-2 font-semibold">Rank</th>}
            <th className="px-4 py-2 font-semibold">Model</th>
            {columns.map((c) => (
              <th key={c.label} className="px-4 py-2 font-semibold text-right">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.model} style={{ borderTop: "1px solid var(--color-border)" }}>
              {rank && <td className="px-4 py-2.5 tabular-nums">{i + 1}</td>}
              <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                <ModelName model={r.model} provider={r.provider} size={20} />
              </td>
              {columns.map((c) => (
                <td key={c.label} className={`px-4 py-2.5 text-right tabular-nums ${c.strong ? "font-semibold" : ""}`}>{c.value(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
        author: authorRef,
        publisher: { "@type": "Organization", name: "Draftly", url: "https://www.draftly.blog" },
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

        <TocLayout>
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              The Best AI for Writing in 2026, Tested
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              The best AI for writing depends on what you need. Qwen 3.8 Max scored highest overall, Claude Sonnet 5.5
              wrote the most human-sounding posts, and GPT 5.4 Mini gave the best quality for the money. We tested 14
              models on the same blog posts and marketing copy, then scored all 84 pieces.
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Edition 1. Tested {BENCHMARK_DATE} by{" "}
              <a href="/about" rel="author" style={{ color: "var(--color-accent)" }}>
                Preston Vawdrey
              </a>{" "}
              at Draftly.
            </p>
          </header>

          <Section title="Which AI Is Best for Writing?">
            <p>
              Qwen 3.8 Max is the best AI for writing on raw score, with perfect formatting and a voice score of 90. It is
              slow and occasionally returns nothing, so for everyday writing we recommend Claude Sonnet 5.5, which had the
              highest voice score, or GPT 5.4 Mini, which scored 90.2 for under a cent a post.
            </p>
          </Section>

          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PICKS.map((p) => (
              <div key={p.label} className="p-6 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {p.label}
                </h3>
                <p className="mt-2 text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                  <ModelName model={p.model} size={28} />
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
            <p className="mb-2 leading-relaxed max-w-3xl" style={{ color: "var(--color-text-secondary)" }}>
              Overall is the average of two scores out of 100. Formatting is scored by code against 12 writing and SEO
              rules. Voice is how human the writing sounds, judged by two AI models from different companies. Cost is what
              we were billed per post.
            </p>
            <QueryTable<BenchmarkRow> {...LEADERBOARD_TABLE} />
          </section>

          <Section id="content-writing" title="Best AI for Content Writing">
            <p>
              For content writing, the AI model matters less than how you use it. Content marketing needs a topic worth
              writing about, a consistent brand voice, SEO structure and a way to publish. A chat window gives you none of
              those, so the best AI tool for content writing pairs a strong model with that workflow.
            </p>
            <p>
              On the model side, Qwen 3.8 Max wrote the cleanest content, with an FAQ and the closing call to action in every
              post and zero AI tells across all three. Kimi K3, GPT 5.4 Mini, Claude Opus 5.5 and Claude Sonnet 5.5 followed
              with two or three tells each.
            </p>
            <p>
              Draftly is built around that pairing. It finds timely topics from your industry&apos;s news, writes in your
              brand voice with Claude Sonnet 5.5 by default (GPT 6 Luna on paid plans as a budget option), scores each draft for
              machine-sounding phrasing and publishes to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace. Here
              is{" "}
              <a href="/ai-copywriter" style={{ color: "var(--color-accent)" }}>
                how Draftly works as an AI copywriter
              </a>
              , from your URL to a published post.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable<BenchmarkRow> {...CONTENT_TABLE} />
          </div>
          <CriterionExamples
            items={CONTENT_CRITERIA}
            source="Blog post"
            intro="Each column above is a check the script ran on every post. Here is what each one looks for, with real lines from the test."
          />

          <Section id="copywriting" title="Best AI for Copywriting">
            <p>
              Gemini 3.8 Flash and Claude Opus 5.5 are the best AI for copywriting in our test, tied at 90.8. Gemini 3.8 Flash
              costs less than a cent per copy pack, about a sixth of Opus. Each model wrote the same three copy packs: five
              landing page headlines, a hero section, a Google search ad, three email subject lines with preview text, and
              three benefit bullets.
            </p>
            <p>
              The clearest split is on hard limits. Google rejects search ad headlines over 30 characters and descriptions
              over 90. Eleven of the 14 models hit all 15 of those limits. Claude Sonnet 4.6 hit 8, Claude Haiku 4.5 hit 7
              and DeepSeek V3.2 hit 11.
            </p>
            <p>
              Above that line, the top ten are close. Their judge scores span 74 to 82, so treat a gap of a point or two as a
              tie and choose on cost and speed.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable<CopyRow> {...COPY_TABLE} />
          </div>
          <CriterionExamples
            items={COPY_CRITERIA}
            source="Copy pack"
            intro="Code scored each pack on hard limits and the facts it used, and two judges scored the writing. Here is each part, with real lines from the packs."
          >
            {{
              "judge-criteria": (
                <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm leading-relaxed">
                  {JUDGE_CRITERIA.map((j) => (
                    <div key={j.name}>
                      <dt className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{j.name}</dt>
                      <dd style={{ color: "var(--color-text-secondary)" }}>{j.def}</dd>
                    </div>
                  ))}
                </dl>
              ),
            }}
          </CriterionExamples>

          <Section id="seo-writing" title="Best AI for SEO Writing">
            <p>
              Qwen 3.8 Max, GPT 5.5, DeepSeek V4 Pro and Claude Opus 5.5 are the best AI for SEO writing in our test, each
              passing all 18 on-page SEO checks. Those checks cover the target keyword in the title, the first 100 words and
              an H2, a meta title and meta description at the right length, and an FAQ section, across three posts.
            </p>
            <p>
              DeepSeek V4 Pro is the value pick here at under two cents a post. GPT 5.4 Mini passed 15: across three posts it
              missed one keyword placement, one meta title length and one meta description length. All three are quick fixes
              in review.
            </p>
            <p>
              Each of those checks is explained, with before and after examples, in our list of{" "}
              <a href="/seo-copywriting" style={{ color: "var(--color-accent)" }}>
                SEO copywriting rules Draftly checks on every post
              </a>
              .
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable<BenchmarkRow> {...SEO_TABLE} />
          </div>
          <CriterionExamples
            items={SEO_CRITERIA}
            source="Blog post"
            intro="The 18 SEO checks are six checks run on three posts. Here is each one, with a real pass and miss."
          />

          <Section id="blog-writing" title="Best AI for Blog Writing">
            <p>
              The best AI for blog writing holds a structure and a word count across a full post. DeepSeek V3.2, Kimi K3 and
              Gemini 3.8 Flash landed closest to the 1,000 to 1,200 word brief, averaging 20, 27 and 51 words from its
              midpoint. Gemini 3.1 Pro dropped the FAQ section on two of three posts, and its scores ranged from 64 to 95.
            </p>
            <p>
              GPT 5.5 averaged 1,774 words, which means more editing and a higher bill. GPT 5.4 Mini runs about 175 words
              long, enough to notice and easy to trim.
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable<BenchmarkRow> {...BLOG_TABLE} />
          </div>
          <CriterionExamples
            items={BLOG_CRITERIA}
            source="Blog post"
            intro="These checks show whether a model can carry a whole post. Here is each one, with real examples from the test."
          />

          <Section id="chatgpt" title="Is ChatGPT Still the Best AI for Writing?">
            <p>
              ChatGPT runs on OpenAI&apos;s GPT models, and none of them made the top three. GPT 5.4 Mini finished fifth of 14
              with 90.2 overall. GPT 5.5 finished seventh and GPT 5.4 tenth, losing points for contrast phrasing (&quot;it&apos;s
              not X, it&apos;s Y&quot;) and, in GPT 5.5&apos;s case, length.
            </p>
            <p>So the smallest OpenAI model wrote the best blog posts of the three, at the lowest cost.</p>
            <p>
              For the Claude models side by side with these three, see{" "}
              <a href="/claude-vs-chatgpt-for-writing" style={{ color: "var(--color-accent)" }}>
                Claude vs ChatGPT for writing
              </a>
              .
            </p>
            <p>
              If you already write in ChatGPT or Claude, the{" "}
              <a href="/mcp" style={{ color: "var(--color-accent)" }}>
                Draftly SEO MCP server
              </a>{" "}
              brings your brand voice, past posts and live keyword data into the chat. For the research and optimization
              side of SEO, see our picks for the{" "}
              <Link href="/best-ai-for-seo" style={{ color: "var(--color-accent)" }}>
                best AI for SEO
              </Link>
              .
            </p>
          </Section>
          <div className="max-w-4xl">
            <QueryTable<BenchmarkRow> {...CHATGPT_TABLE} />
          </div>

          <Section title="What the Results Show">
            <p>
              <B>Price and quality barely track each other.</B> GPT 5.5 cost the second most per post and finished seventh.
              GPT 5.4 Mini beat eight models that cost more per post.
            </p>
            <p>
              <B>Upgrade within a family when you can.</B> Claude Sonnet 5.5 scored 11 points higher overall than Sonnet 4.6
              and had the best voice score of any model. The older model used nine em dashes across three posts.
            </p>
            <p>
              <B>Em dashes are the most common AI tell.</B> Claude Haiku 4.5 used 29 of them in three posts, even with a rule
              asking it to ration them. That one habit cost it more points than anything else.
            </p>
            <p>
              <B>Reasoning models score high and cost time.</B> Qwen 3.8 Max and Kimi K3 took first and second, but Qwen
              averaged about three minutes a post and Kimi was the most expensive model we tested.
            </p>
          </Section>

          <section id="method" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              How We Tested the AI Models
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Every model wrote for three made-up businesses: a roofing company in Boise, a B2B software company that
                automates accounts payable, and a family dental practice in Phoenix. Each wrote one blog post and one copy
                pack per business, with a brand voice, facts it could use and a call to action.
              </p>
              <p>
                All 14 models got the same system prompt: the{" "}
                <a href="/seo-copywriting" style={{ color: "var(--color-accent)" }}>
                  writing rules Draftly uses in production
                </a>
                . We called each one
                through the Vercel AI Gateway, so the cost columns are what we were actually billed.
              </p>
              <p>
                For voice, two judge models from different companies (Gemini 3 Flash and GPT 5.4) scored every post with
                Draftly&apos;s 13-point human-voice audit, and we averaged them. Each judge scored its own model lower than the
                other judge did (Gemini 3 Flash 80 versus 88, GPT 5.4 77 versus 81), and averaging two judges from different
                companies limits any one family&apos;s bias.
              </p>
              <p>
                For formatting, a script scored every blog post against 12 checks, with points taken off for each miss.
                We grouped them by what they catch and linked each one to its example above, which keeps this part a
                quick reference.
              </p>
            </div>
            {CHECK_GROUPS.map((g) => (
              <div key={g.id} id={g.id} className="mt-10 scroll-mt-28">
                <h3 className="text-xl font-medium mb-4" style={{ letterSpacing: "-0.02em" }}>
                  {g.title}
                </h3>
                <dl className="rounded-xl overflow-hidden text-sm" style={{ border: "1px solid var(--color-border)" }}>
                  {g.checks.map((c, i) => (
                    <div
                      key={c.rule}
                      className="px-4 py-3 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)] sm:gap-6"
                      style={{ borderTop: i ? "1px solid var(--color-border)" : undefined, background: i % 2 ? undefined : "var(--color-bg-surface)" }}
                    >
                      <dt>
                        <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{c.rule}</span>
                        <span className="block text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Costs {c.cost}</span>
                      </dt>
                      <dd className="mt-1.5 sm:mt-0 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        {c.result}{" "}
                        {c.href ? (
                          <a href={c.href} className="whitespace-nowrap" style={{ color: "var(--color-accent)" }}>
                            See the example
                          </a>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            <div id="human-voice-audit" className="mt-10 scroll-mt-28">
              <h3 className="text-xl font-medium mb-3" style={{ letterSpacing: "-0.02em" }}>
                The 13-Point Human-Voice Audit
              </h3>
              <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                Each judge started every post at 100 and took off 12 points for a serious problem on any point below, or 5
                for a minor one. The list runs from the most flagged to the least, counted across {AUDIT_READS} judge reads
                (42 posts, two judges each). We kept it as one list so it reads as the single checklist the judges used.
              </p>
              <dl className="mt-5 rounded-xl overflow-hidden text-sm" style={{ border: "1px solid var(--color-border)" }} data-lint-skip="">
                {AUDIT_POINTS.map((a, i) => (
                  <div
                    key={a.name}
                    className="px-4 py-3 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 sm:grid-cols-[11rem_minmax(0,1fr)_auto]"
                    style={{ borderTop: i ? "1px solid var(--color-border)" : undefined, background: i % 2 ? undefined : "var(--color-bg-surface)" }}
                  >
                    <dt className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{a.name}</dt>
                    <dd className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-1 sm:col-start-2 mt-0.5 sm:mt-0 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {a.def}
                    </dd>
                    <dd className="col-start-2 row-start-1 sm:col-start-3 text-right tabular-nums whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                      <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{a.flagged}</span> of {AUDIT_READS}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <Section id="in-draftly" title="Which of These Models Can You Use in Draftly?">
            <p>
              {IN_DRAFTLY.length} of the {BENCHMARK.length} models we tested are available in Draftly. Six of them are new:
              Qwen 3.8 Max, Claude Opus 5.5, Kimi K3 and GPT 5.5 cost 250 credits a post, and DeepSeek V4 Pro and Gemini 3.8
              Flash cost 150. Paid plans pick the model for each post. Claude Sonnet 5.5 stays the default on every plan
              and writes the free first post.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm">
                <caption className="text-left px-4 py-3 text-xs font-semibold" style={{ background: "var(--color-bg-surface)", color: "var(--color-text-secondary)" }}>
                  Tested models available in Draftly, by overall score
                </caption>
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold">Model</th>
                    <th className="px-4 py-2 font-semibold text-right">Overall</th>
                    <th className="px-4 py-2 font-semibold text-right">Credits per post</th>
                  </tr>
                </thead>
                <tbody>
                  {IN_DRAFTLY.map((r) => (
                    <tr key={r.model} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <td className="px-4 py-2.5 font-medium whitespace-nowrap">
                        <ModelName model={r.model} provider={r.provider} size={20} />
                        {NEW_IN_DRAFTLY.includes(r.model) && (
                          <span className="ml-2 text-xs font-semibold" style={{ color: "var(--color-accent)" }}>New</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{r.overall.toFixed(1)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{r.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Credit prices and plan allowances are on the{" "}
              <Link href="/pricing" style={{ color: "var(--color-accent)" }}>
                pricing page
              </Link>
              .
            </p>
          </Section>

          <Section title="What This Test Measures, and Its Limits">
            <p>
              This benchmark measures how well an AI model follows clear writing and SEO rules, and how human the result
              sounds to two AI judges. That is the hard part of using AI for a real blog, and it is what Draftly cares about.
              It does not measure factual accuracy or real-world conversion.
            </p>
            <p>
              Three briefs per model is a small sample, so treat a two or three point gap as a tie. The next edition adds more
              briefs, harder copywriting tasks to separate the leaders, and a monthly re-run as new models launch.
            </p>
          </Section>

          <div className="max-w-3xl">
            <KeepReading exclude="/best-ai-for-writing" guides={["/seo-copywriting", "/ai-copywriter"]} topic="AI models Claude ChatGPT writing blog posts" />
          </div>
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

          <section data-toc-skip className="mt-20 rounded-2xl p-8 sm:p-12" style={{ background: "#111", color: "var(--color-text-inverted)" }}>
            <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
              Start Writing With the Best Models and Draftly&apos;s SEO-Optimized Copywriting Tools Today
            </h2>
            <p className="max-w-2xl mb-8 leading-relaxed" style={{ color: "#bbb" }}>
              Draftly writes with Claude Sonnet 5.5 by default. Paid plans can switch any post to Claude Opus 5.5, Kimi K3,
              GPT 5.5, DeepSeek V4 Pro, Gemini 3.8 Flash or GPT 6 Luna, the budget option, and every post gets the same
              writing rules. Your first post, written by Sonnet, is free.
            </p>
            <a href={registerUrl} className="btn btn-primary">
              {s.heroCtaText}
            </a>
          </section>
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
