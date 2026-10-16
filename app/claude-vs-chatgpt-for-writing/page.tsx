import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { BENCHMARK, BENCHMARK_DATE, COPY_BENCHMARK, seoScore, type BenchmarkRow, type CopyRow } from "@/lib/benchmark";
import { money } from "@/lib/benchmarkTables";
import { draftlyCredits } from "@/lib/app-models";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { ModelName } from "@/components/ProviderLogo";
import { SignupCta } from "@/components/SignupCta";

export const revalidate = 3600;

// Targets "claude vs chatgpt for writing" (Ahrefs US: 450/mo, KD 9) and "is claude better
// than chatgpt for writing" (150), checked 2026-10-15. Every score comes from lib/benchmark.ts,
// the same Edition 1 run as /best-ai-for-writing: the Anthropic rows are "Claude" and the
// OpenAI rows are "ChatGPT" (the GPT models behind it). No new test was run for this page.
const PATH = "/claude-vs-chatgpt-for-writing";
const PUBLISHED = { iso: "2026-10-16", label: "October 16, 2026" };
const TITLE = "Claude vs ChatGPT for Writing: 7 Models Tested";
const DESCRIPTION =
  "Is Claude better than ChatGPT for writing? We scored 4 Claude and 3 GPT models on the same blog posts and copy. Here are the scores, costs and which to pick.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const isClaude = (r: { provider: string }) => r.provider === "Anthropic";
const isGpt = (r: { provider: string }) => r.provider === "OpenAI";

const BLOG = BENCHMARK.filter((r) => isClaude(r) || isGpt(r)).sort((a, b) => b.overall - a.overall);
const COPY = COPY_BENCHMARK.filter((r) => isClaude(r) || isGpt(r)).sort((a, b) => b.overall - a.overall);

const blog = (model: string) => BENCHMARK.find((r) => r.model === model)!;
const copy = (model: string) => COPY_BENCHMARK.find((r) => r.model === model)!;
const ordinal = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;
const rank = (model: string) => ordinal(BENCHMARK.findIndex((r) => r.model === model) + 1);

const OPUS = blog("Claude Opus 5.5");
const SONNET = blog("Claude Sonnet 5.5");
const SONNET46 = blog("Claude Sonnet 4.6");
const HAIKU = blog("Claude Haiku 4.5");
const MINI = blog("GPT 5.4 Mini");
const GPT55 = blog("GPT 5.5");
const GPT54 = blog("GPT 5.4");
const TOP_VOICE = Math.max(...BENCHMARK.map((r) => r.voice));
const CENTS = (n: number) => `${(n * 100).toFixed(1)} cents`;

type Col<T> = { label: string; value: (r: T) => string | number; strong?: boolean };

const BLOG_COLS: Col<BenchmarkRow>[] = [
  { label: "Overall", value: (r) => r.overall, strong: true },
  { label: "Formatting", value: (r) => r.format },
  { label: "Voice", value: (r) => r.voice },
  { label: "SEO checks (of 18)", value: (r) => seoScore(r) },
  { label: "Cost per post", value: (r) => money(r.cost) },
  { label: "Seconds", value: (r) => r.seconds },
  { label: "Avg words", value: (r) => r.words.toLocaleString("en-US") },
];

const HABIT_COLS: Col<BenchmarkRow>[] = [
  { label: "Em dashes", value: (r) => r.emDashes, strong: true },
  { label: "Contrast phrases", value: (r) => r.contrast, strong: true },
  { label: "AI vocabulary", value: (r) => r.aiWords },
  { label: "Posts in word range", value: (r) => `${r.inRange} of 3` },
];

const COPY_COLS: Col<CopyRow>[] = [
  { label: "Overall", value: (r) => r.overall, strong: true },
  { label: "Clarity", value: (r) => r.clarity },
  { label: "Persuasion", value: (r) => r.persuasion },
  { label: "Voice", value: (r) => r.voice },
  { label: "Specificity", value: (r) => r.specificity },
  { label: "Ad limits met", value: (r) => `${r.adLimits} of 15` },
  { label: "Cost per pack", value: (r) => money(r.cost) },
];

function ModelTable<T extends { model: string; provider: string }>({ caption, rows, cols }: { caption: string; rows: T[]; cols: Col<T>[] }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
      <table className="w-full text-sm min-w-[640px]">
        <caption className="text-left px-4 py-3 text-xs font-semibold" style={{ background: "var(--color-bg-surface)", color: "var(--color-text-secondary)" }}>
          {caption}
        </caption>
        <thead style={{ background: "var(--color-bg-surface)" }}>
          <tr className="text-left">
            <th className="px-4 py-2 font-semibold" scope="col">Model</th>
            <th className="px-4 py-2 font-semibold" scope="col">App</th>
            {cols.map((c) => (
              <th key={c.label} className="px-4 py-2 font-semibold text-right" scope="col">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.model} style={{ borderTop: "1px solid var(--color-border)" }}>
              <th scope="row" className="px-4 py-2.5 font-medium whitespace-nowrap text-left">
                <ModelName model={r.model} provider={r.provider} size={20} />
              </th>
              <td className="px-4 py-2.5" style={{ color: "var(--color-text-secondary)" }}>{isClaude(r) ? "Claude" : "ChatGPT"}</td>
              {cols.map((c) => (
                <td key={c.label} className={`px-4 py-2.5 text-right tabular-nums ${c.strong ? "font-semibold" : ""}`}>{c.value(r)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PICKS: { use: string; model: string; why: string }[] = [
  { use: "Everyday blog posts", model: SONNET.model, why: `Highest voice score of all 14 models (${SONNET.voice}) at ${CENTS(SONNET.cost)} a post.` },
  { use: "The best post, cost aside", model: OPUS.model, why: `${OPUS.overall} overall, the top Claude or GPT score, and all 18 SEO checks passed.` },
  { use: "Lots of posts on a small budget", model: MINI.model, why: `${MINI.overall} overall for ${CENTS(MINI.cost)} a post, done in ${MINI.seconds} seconds.` },
  { use: "Ads and short copy", model: copy("Claude Opus 5.5").model, why: `Top copy score here (${copy("Claude Opus 5.5").overall}) and every Google Ads limit met. Any GPT model also hit all 15.` },
];

const FAQS: Faq[] = [
  {
    q: "Is Claude better than ChatGPT for writing?",
    a: `For blog posts, yes, in our test. Claude Opus 5.5 scored ${OPUS.overall} and Claude Sonnet 5.5 ${SONNET.overall}, against ${MINI.overall} for the best GPT model, GPT 5.4 Mini. For copywriting the two were close: Claude Opus 5.5 scored ${copy("Claude Opus 5.5").overall} and GPT 5.5 ${copy("GPT 5.5").overall}.`,
  },
  {
    q: "Which Claude model is best for writing?",
    a: `Claude Opus 5.5 had the higher overall score (${OPUS.overall}). Claude Sonnet 5.5 had the best voice score of the 14 models we tested (${SONNET.voice}) at about half the cost per post, so it's the one we'd use day to day.`,
  },
  {
    q: "Which ChatGPT model is best for writing?",
    a: `GPT 5.4 Mini, at ${MINI.overall} overall. GPT 5.5 scored ${GPT55.overall} and GPT 5.4 ${GPT54.overall}. The bigger models lost points for running long and for contrast phrasing.`,
  },
  {
    q: "Is Claude or ChatGPT cheaper for writing blog posts?",
    a: `GPT 5.4 Mini is the cheapest, at ${CENTS(MINI.cost)} a post through the API. Claude Sonnet 5.5 cost ${CENTS(SONNET.cost)} and Claude Opus 5.5 ${CENTS(OPUS.cost)}. GPT 5.5 was the most expensive of the seven at ${CENTS(GPT55.cost)}.`,
  },
  {
    q: "Did you test the ChatGPT and Claude apps?",
    a: "No. We called each model through the Vercel AI Gateway with the same writing rules, so the scores show how each model follows instructions. The chat apps add their own instructions and choose models for you, so your results there can differ.",
  },
  {
    q: "Can I write with Claude and ChatGPT models in Draftly?",
    a: `Yes. Draftly writes with Claude Sonnet 5.5 by default, ${draftlyCredits(SONNET.model)} credits a post. Paid plans can switch any post to Claude Opus 5.5, GPT 5.5 or GPT 5.4 for ${draftlyCredits(OPUS.model)} credits, GPT 5.4 Mini or Claude Haiku 4.5 for ${draftlyCredits(MINI.model)}, or GPT 6 Luna for ${draftlyCredits("GPT 6 Luna")}.`,
  },
];

export default function ClaudeVsChatGptPage() {
  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: PUBLISHED.iso,
      dateModified: PUBLISHED.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
      isBasedOn: `${SITE_URL}/best-ai-for-writing`,
    },
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <TocLayout>
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              Claude vs ChatGPT for writing:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                what 84 scored drafts show
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Claude wrote better blog posts than ChatGPT&apos;s GPT models in our test. Claude Opus 5.5 scored{" "}
              {OPUS.overall} out of 100 and Claude Sonnet 5.5 scored {SONNET.overall}. The best GPT model, GPT 5.4 Mini,
              scored {MINI.overall}. For copywriting it&apos;s close to a tie, and GPT 5.4 Mini is the cheapest good writer
              of the seven at {CENTS(MINI.cost)} a post.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Every number here comes from our <A href="/best-ai-for-writing">14-model writing benchmark</A>, run{" "}
              {BENCHMARK_DATE}. Draftly offers both families, so either result works for me.
            </p>
          </header>

          <Section id="blog-posts" title="Blog posts: Claude's newest models lead">
            <p>
              Each model wrote three blog posts for three made-up businesses, under the same writing rules. A script scored
              formatting, two AI judges scored how human the writing sounds, and the overall score averages the two.
            </p>
            <p>
              Claude Opus 5.5 ranked {rank(OPUS.model)} of all 14 models and Claude Sonnet 5.5 ranked {rank(SONNET.model)}.
              GPT 5.4 Mini came {rank(MINI.model)}. The two bigger GPT models finished {rank(GPT55.model)} and{" "}
              {rank(GPT54.model)}.
            </p>
            <p>
              The version matters more than the brand. Claude Sonnet 4.6 scored {SONNET46.overall}, {(SONNET.overall - SONNET46.overall).toFixed(1)} points below
              Sonnet 5.5, and Claude Haiku 4.5 came last of the 14 at {HAIKU.overall}. If you write with an older Claude
              model, GPT 5.4 Mini beats it.
            </p>
          </Section>
          <div className="max-w-4xl">
            <ModelTable caption="Blog writing: three posts per model, Claude and GPT models only" rows={BLOG} cols={BLOG_COLS} />
          </div>

          <Section id="ai-habits" title="Where each one sounds like AI">
            <p>
              GPT 5.5 and GPT 5.4 each used {GPT55.contrast} contrast phrases (&quot;it&apos;s not X, it&apos;s Y&quot;)
              across three posts, against {SONNET.contrast} for each of the Claude 5.5 models. GPT 5.5 also ran long: it
              averaged {GPT55.words.toLocaleString("en-US")} words on a 1,000 to 1,200 word brief, and none of its three
              posts landed in range.
            </p>
            <p>
              The older Claude models have the worst em dash habit we saw. Claude Haiku 4.5 used {HAIKU.emDashes} of them in
              three posts and Sonnet 4.6 used {SONNET46.emDashes}, even with a rule telling them not to. Both Claude 5.5
              models used none.
            </p>
          </Section>
          <div className="max-w-4xl">
            <ModelTable caption="AI writing habits across three posts (lower is better, except posts in range)" rows={BLOG} cols={HABIT_COLS} />
          </div>

          <Section id="voice" title="Which sounds more human">
            <p>
              Claude Sonnet 5.5 had the highest voice score of all 14 models, at {TOP_VOICE}. Claude Opus 5.5 scored{" "}
              {OPUS.voice}. The best GPT voice score was GPT 5.5&apos;s {GPT55.voice}, and GPT 5.4 Mini scored {MINI.voice}.
            </p>
            <p>
              One of the two judges was GPT 5.4, an OpenAI model, which could tilt things toward GPT. It went the other way:
              each judge scored its own model lower than the other judge did. GPT 5.4 gave itself 77, and the Gemini judge
              gave it 81.
            </p>
          </Section>

          <Section id="copywriting" title="Copywriting: close to a tie">
            <p>
              Each model also wrote a five-part copy pack per business, including Google Ads headlines and descriptions.
              Claude Opus 5.5 scored {copy("Claude Opus 5.5").overall}, Claude Sonnet 5.5 {copy(SONNET.model).overall} and
              GPT 5.5 {copy(GPT55.model).overall}. With three packs per model, a gap that small is a tie.
            </p>
            <p>
              The real difference is character limits. Every GPT model and both Claude 5.5 models met all 15 Google Ads
              limits. Claude Sonnet 4.6 met {copy(SONNET46.model).adLimits} and Claude Haiku 4.5 met{" "}
              {copy(HAIKU.model).adLimits}, so their ads would need trimming before you could upload them.
            </p>
          </Section>
          <div className="max-w-4xl">
            <ModelTable caption="Copywriting: three copy packs per model (judge criteria out of 10)" rows={COPY} cols={COPY_COLS} />
          </div>

          <Section id="cost" title="Cost and speed">
            <p>
              GPT 5.4 Mini is the bargain. It cost {CENTS(MINI.cost)} a post and finished in {MINI.seconds} seconds, the
              fastest of all 14. Claude Sonnet 5.5 cost {CENTS(SONNET.cost)} and took {SONNET.seconds} seconds.
            </p>
            <p>
              Paying more didn&apos;t buy a better post on the GPT side. GPT 5.5 cost {CENTS(GPT55.cost)} a post, the most of
              these seven, and scored {(MINI.overall - GPT55.overall).toFixed(1)} points below GPT 5.4 Mini. These are API
              prices from our test, which is what a tool like Draftly pays. A ChatGPT or Claude subscription is a flat
              monthly fee.
            </p>
          </Section>

          <Section id="which-to-pick" title="Which to pick for each job">
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {PICKS.map((p) => (
                <div key={p.use} className="p-5 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>{p.use}</p>
                  <p className="mt-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>{p.model}</p>
                  <p className="mt-1 text-sm leading-relaxed">{p.why}</p>
                </div>
              ))}
            </div>
            <p>
              If you already pay for one app, stay there and switch models inside it. The version you pick moved the score
              more than the company did.
            </p>
          </Section>

          <Section id="limits" title="What this test can't tell you">
            <Bullets
              items={[
                <>
                  <B>It tested models, not apps.</B> We called each model through the Vercel AI Gateway with Draftly&apos;s
                  writing rules. ChatGPT and Claude add their own instructions and pick models for you.
                </>,
                <>
                  <B>Three briefs per model is a small sample.</B> Treat a gap of two or three points as a tie.
                </>,
                <>
                  <B>Models change fast.</B> This is Edition 1. OpenAI&apos;s GPT 6 models, including GPT 6 Luna, weren&apos;t
                  in it. The next edition adds them and more briefs.
                </>,
                <>
                  <B>It doesn&apos;t check facts or sales.</B> It scores rule-following and how human the writing sounds, not
                  whether the facts are right or whether readers buy.
                </>,
              ]}
            />
            <p>
              The full method, all 14 models and real excerpts are on the <A href="/best-ai-for-writing#method">benchmark page</A>.
            </p>
          </Section>

          <Section id="in-draftly" title="Write with either one in Draftly">
            <p>
              Draftly writes with Claude Sonnet 5.5 by default. Paid plans can switch any post to Claude Opus 5.5, Claude
              Haiku 4.5, Claude Sonnet 4.6, GPT 5.5, GPT 5.4, GPT 5.4 Mini or GPT 6 Luna, and every model gets the same
              writing rules and the same check for AI-sounding writing. Credits per post are on the{" "}
              <A href="/pricing">pricing page</A>.
            </p>
            <p>
              If you&apos;d rather keep writing in the Claude or ChatGPT app, the <A href="/mcp">Draftly MCP connector</A>{" "}
              brings your brand voice and past posts into the chat.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="See how Claude writes for your site"
              body="Paste your URL and Draftly writes your first blog post with Claude Sonnet 5.5, in your brand's voice, free."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/best-ai-for-writing", "/seo-copywriting"]} topic="Claude ChatGPT AI models writing blog posts" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
