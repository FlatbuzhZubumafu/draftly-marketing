import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { BENCHMARK, BENCHMARK_DATE, seoScore } from "@/lib/benchmark";
import { APP_MODEL_COUNT } from "@/lib/app-models";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { ProductFigure } from "@/components/ProductFigure";
import { BarChart } from "@/components/BarChart";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import { CHECKED, DRAFTLY, PICKS, SOURCES, type Source } from "@/lib/best-ai-for-seo";
import { pageImages } from "@/lib/og";
import { AccentText } from "@/components/AccentText";

export const revalidate = 3600;

// Targets "best ai for seo" (Ahrefs US: 400/mo, KD 0) and "best ai tool for seo" (600, KD 0),
// checked 2026-10-16. The SERP is "best AI SEO tools" listicles, so the page sorts tools by
// the SEO job they do. Third-party facts live in lib/best-ai-for-seo.ts, each read on the
// company's own page. Model scores come from lib/benchmark.ts (Edition 1). No new test was run.
const PATH = "/best-ai-for-seo";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Best AI for SEO in 2026: The Right Tool for Each Job";
const DESCRIPTION =
  "The best AI for SEO depends on the job. Our picks for keyword research, blog writing, optimization, AI visibility and technical SEO, with prices checked October 2026.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` }),
};

const { solo: SOLO, growth: GROWTH } = DRAFTLY;
const model = (name: string) => BENCHMARK.find((r) => r.model === name)!;
const TOP = BENCHMARK[0];
const OPUS = model("Claude Opus 5.5");
const SONNET = model("Claude Sonnet 5.5");
const MINI = model("GPT 5.4 Mini");
const GPT55 = model("GPT 5.5");
const HAIKU = model("Claude Haiku 4.5");
const CENTS = (n: number) => `${(n * 100).toFixed(1)} cents`;

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };

function SourceLinks({ items }: { items: Source[] }) {
  if (!items.length) return null;
  return (
    <span className="text-sm" style={muted}>
      {" "}
      (
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 ? ", " : ""}
          <a href={s.href} rel="nofollow noopener" target="_blank" className="underline">
            {s.label}
          </a>
        </span>
      ))}
      , as of {CHECKED.month})
    </span>
  );
}

const FAQS: Faq[] = [
  {
    q: "What is the best AI for SEO?",
    a: "It depends on the job. Ahrefs or Semrush for keyword research, Draftly for writing and publishing blog posts, Surfer or Clearscope for optimizing pages against the top results, and Google Search Console for technical checks.",
  },
  {
    q: "Can ChatGPT do SEO?",
    a: `It can write drafts, outlines and meta descriptions, but it has no live search volume or ranking data of its own. In our ${BENCHMARK.length}-model test, GPT 5.4 Mini, one of the GPT models behind ChatGPT, scored ${MINI.overall} on blog posts and passed ${seoScore(MINI)} of 18 SEO checks.`,
  },
  {
    q: "Which AI model writes the best SEO content?",
    a: `In Draftly's ${BENCHMARK_DATE} benchmark, ${TOP.model} scored highest at ${TOP.overall}, followed by Kimi K3 and Claude Opus 5.5 at ${OPUS.overall}. Claude Sonnet 5.5 scored ${SONNET.overall} at about half Opus's cost per post.`,
  },
  {
    q: "Is there a free AI tool for SEO?",
    a: "Google Search Console and Ahrefs Free cost nothing for sites you verify. Draftly's free SEO tools check AI crawler access, on-page SEO, E-E-A-T signals and stale content with no sign-up, and Draftly writes your first blog post free.",
  },
  {
    q: "Does AI-written content rank on Google?",
    a: "It can. Google says its ranking systems reward original, high-quality content however it is produced, and that using AI mainly to manipulate rankings breaks its spam policies. Posts that answer the search well, checked by someone who knows the business, are the ones that rank.",
  },
  {
    q: "What's the cheapest AI SEO setup for a small business?",
    a: `Google Search Console and Ahrefs Free for data, Draftly's free checkers for on-page fixes, and Draftly Solopreneur at $${SOLO.price} a month for posts. That's $${SOLO.price} a month in total.`,
  },
];

export default function BestAiForSeoPage() {
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
      image: [imageObjectJsonLd(GUIDE_SHOTS.urlToPost), imageObjectJsonLd(GUIDE_SHOTS.seoMeta)],
      citation: Object.values(SOURCES).map((s) => s.href),
    },
    {
      "@type": "ItemList",
      name: "Best AI for SEO, by job",
      itemListElement: PICKS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: `${p.job}: ${p.pick}`, url: `${SITE_URL}${PATH}#${p.id}` })),
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
              Best AI for SEO,{" "}
              <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                picked by job
              </AccentText>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              SEO is five or six different jobs, and each AI tool is good at one or two of them. Ahrefs and Semrush own
              keyword research. Surfer and Clearscope grade a page against what already ranks. Draftly writes and
              publishes the blog posts. Google Search Console is still the free source of truth for how your site does in
              search.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, so weigh my take on it accordingly. Every other price links to that company&apos;s own
              page, checked {CHECKED.label}.
            </p>
          </header>

          <section id="at-a-glance" className="mt-16">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              The picks at a glance
            </h2>
            <div className="sm:hidden space-y-3">
              {PICKS.map((p) => (
                <div key={p.id} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="font-semibold">
                    <a href={`#${p.id}`} className="underline">{p.job}</a>
                  </p>
                  <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={secondary}>
                    {[
                      ["Best pick", p.pick],
                      ["Price", p.price],
                      ["Free option", p.free],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-medium" style={{ color: "var(--color-text-primary)" }}>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[720px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">SEO job</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Best pick</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Price</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Free option</th>
                  </tr>
                </thead>
                <tbody>
                  {PICKS.map((p) => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-semibold">
                        <a href={`#${p.id}`} className="underline">{p.job}</a>
                      </th>
                      <td className="px-4 py-3 align-top">{p.pick}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{p.price}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{p.free}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              Prices from each company&apos;s pricing page as of {CHECKED.month}. They change, so check before you buy.
            </p>
          </section>

          <Section id="keyword-research" title="Keyword research: Ahrefs or Semrush">
            <p>
              Picking what to write about is where the money is, and it takes real search volume and difficulty data.
              Ahrefs and Semrush both run their own keyword databases and track competitors&apos; rankings.
            </p>
            <p>
              <B>Ahrefs</B> Lite is $129 a month and includes Keywords Explorer and Site Audit. There&apos;s also a $29
              Starter plan sold for &quot;See what people search and spy on competitors.&quot;
              <SourceLinks items={[SOURCES.ahrefsPricing]} />
            </p>
            <p>
              <B>Semrush</B>&apos;s SEO plan is $139 a month, or $117.33 a month billed yearly. There&apos;s a free plan
              with no credit card and a 7-day trial of the paid plans.
              <SourceLinks items={[SOURCES.semrushPricing]} />
            </p>
            <p>
              Both are good. I use Ahrefs for Draftly&apos;s own keyword work, and the numbers on this page came from it.
              If you only need a handful of lookups a month, Draftly Solopreneur includes {DRAFTLY.keywordLookups} keyword
              lookups (volume, difficulty, intent and related terms) through its connector for Claude and ChatGPT.
            </p>
            <ContentImage
              image={STOCK.analyticsOnLaptop}
              caption="Search volume and difficulty data tell you which posts are worth writing."
            />
          </Section>

          <Section id="writing" title="Writing blog posts: Draftly">
            <p>
              Draftly reads your website, builds your brand voice from it, picks topics and writes the post. Every post
              is checked against <A href="/seo-copywriting">SEO copywriting rules</A> and for AI-sounding writing before
              you see it, then publishes in one click to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.
            </p>
            <p>
              Solopreneur is ${SOLO.price} a month for {SOLO.posts.toLowerCase()} with {SOLO.seats} team members. Growth
              is ${GROWTH.price} a month with {GROWTH.seats} team members and no per-seat charge. Your first post is free.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
            <ProductFigure shot={GUIDE_SHOTS.seoMeta} className="mt-2" />
            <p>
              <B>Skip it if</B> you need posts in languages other than English or you&apos;re outside the US. Draftly
              also doesn&apos;t do keyword research at Ahrefs depth, build links or track rankings.
            </p>
            <p>Two cheaper options sell by volume:</p>
            <Bullets
              items={[
                <>
                  <B>Koala</B> is $25 a month for 45,000 words and publishes to WordPress, Shopify, Webflow and Ghost.
                  <SourceLinks items={[SOURCES.koala]} /> More in the <A href="/koala-ai-review">Koala AI review</A>.
                </>,
                <>
                  <B>SEOWriting.ai</B> is $19 a month, or $14 billed yearly, for up to 50 articles, publishing to WordPress
                  and Shopify.
                  <SourceLinks items={[SOURCES.seowriting]} />
                </>,
              ]}
            />
            <p>
              The <A href="/writesonic-alternatives">Writesonic alternatives</A> page compares these writers in more
              detail.
            </p>
          </Section>

          <Section id="which-model" title="Which AI model writes the best SEO content">
            <p>
              Most of these tools let you pick the model, or pick it for you. We tested {BENCHMARK.length} models on the
              same three blog briefs under the same rules on {BENCHMARK_DATE}, scoring formatting, human voice and 18 SEO
              checks (keyword placement, meta title, meta description and FAQ).
            </p>
            <Bullets
              items={[
                <>
                  <B>{TOP.model}</B> scored highest at {TOP.overall} and passed {seoScore(TOP)} of 18 SEO checks.
                </>,
                <>
                  <B>Claude Opus 5.5</B> scored {OPUS.overall} with {seoScore(OPUS)} of 18, at {CENTS(OPUS.cost)} a post.
                </>,
                <>
                  <B>Claude Sonnet 5.5</B> scored {SONNET.overall} with {seoScore(SONNET)} of 18, at {CENTS(SONNET.cost)} a
                  post. It&apos;s Draftly&apos;s default.
                </>,
                <>
                  <B>GPT 5.4 Mini</B> scored {MINI.overall} at {CENTS(MINI.cost)} a post, the best result for the money.
                </>,
              ]}
            />
            <p>
              The newest model in a family can lose to a smaller one. GPT 5.5 scored {GPT55.overall}, below GPT 5.4 Mini,
              after losing points for length and contrast phrasing. Claude Haiku 4.5 came last at {HAIKU.overall} with {HAIKU.emDashes} em dashes across three posts.
            </p>
            <BarChart
              title="On-page SEO checks passed, out of 18, all 14 models"
              rows={[...BENCHMARK].sort((a, b) => seoScore(b) - seoScore(a) || b.overall - a.overall).map((r) => ({ key: r.model, label: r.model, value: seoScore(r) }))}
              max={18}
              note={`Keyword placement, meta title, meta description and FAQ, checked by code on three posts per model. Benchmark run ${BENCHMARK_DATE}.`}
            />
            <p>
              Full results are on the <A href="/best-ai-for-writing">best AI for writing</A> benchmark, and{" "}
              <A href="/claude-vs-chatgpt-for-writing">Claude vs ChatGPT for writing</A> puts the two families side by
              side. Draftly lets you pick from all {APP_MODEL_COUNT} models on paid plans.
            </p>
            <p>
              If you&apos;d rather write in a chat app, Claude Pro is $20 a month, or $17 a month billed yearly.
              <SourceLinks items={[SOURCES.claudePricing]} />
            </p>
          </Section>

          <Section id="optimizing" title="Optimizing pages: Surfer or Clearscope">
            <p>
              These tools compare your page with the pages already ranking and tell you which terms and topics you&apos;re
              missing. They&apos;re most useful on posts that rank on page two.
            </p>
            <p>
              <B>Surfer</B> Discovery is $49 a month billed yearly for 120 documents with AI SEO guidelines. Standard is
              $99 a month billed yearly for 360 documents, AI visibility tracking and WordPress and Google Docs
              integrations.
              <SourceLinks items={[SOURCES.surferPricing]} />
            </p>
            <p>
              <B>Clearscope</B> Essentials is $129 a month for 50 pages, 20 drafts a month and unlimited users, with a
              14-day trial and no minimum contract.
              <SourceLinks items={[SOURCES.clearscopePricing]} />
            </p>
            <p>
              For older posts on WordPress, the <A href="/wordpress-ai-plugin">Draftly WordPress plugin</A> checks posts
              you already have and saves approved edits as revisions. The free{" "}
              <A href="/tools/content-refresh-checker">content refresh checker</A> flags which posts are going stale.
            </p>
          </Section>

          <Section id="ai-visibility" title="Tracking AI search visibility">
            <p>
              The question everyone is asking now: does ChatGPT or Gemini mention you? Most of the big tools have added
              tracking for it, so check what you already pay for first.
            </p>
            <Bullets
              items={[
                <>
                  <B>Semrush</B> includes AI search tracking on its plans, with 50 prompts tracked daily on Starter ($199 a
                  month).
                  <SourceLinks items={[SOURCES.semrushPricing]} />
                </>,
                <>
                  <B>Clearscope</B> tracks queries across ChatGPT and Gemini on every plan.
                  <SourceLinks items={[SOURCES.clearscopePricing]} />
                </>,
                <>
                  <B>Surfer</B> sells AI Search Analytics on its own at $82 a month billed yearly for 50 prompts.
                  <SourceLinks items={[SOURCES.surferPricing]} />
                </>,
                <>
                  <B>Ahrefs</B> Lite includes 5 tracked AI prompts. Its Brand Radar AI add-on starts at $199 a month.
                  <SourceLinks items={[SOURCES.ahrefsPricing]} />
                </>,
              ]}
            />
            <p>
              Before you pay for tracking, run the free <A href="/tools/ai-visibility-checker">AI visibility checker</A>.
              It tells you whether AI crawlers can read your site at all. Draftly doesn&apos;t track mentions.
            </p>
          </Section>

          <Section id="technical" title="Technical SEO: start with the free tools">
            <p>
              Google Search Console is a free Google service. It shows which queries bring people to your site, which
              pages are indexed and your Core Web Vitals on mobile and desktop.
              <SourceLinks items={[SOURCES.searchConsole, SOURCES.searchConsoleHelp]} />
            </p>
            <p>
              Ahrefs Free audits your own verified sites for 170+ technical and on-page issues, with 5,000 crawl credits
              per project a month, and shows up to 1,000 of your backlinks and keywords.
              <SourceLinks items={[SOURCES.ahrefsFree]} />
            </p>
            <p>
              For a single post, the free <A href="/tools/blog-seo-checker">blog post SEO checker</A> and{" "}
              <A href="/tools/faq-schema-generator">FAQ schema generator</A> cover the on-page basics without a sign-up.
            </p>
          </Section>

          <Section id="stacks" title="Two setups that work">
            <p>
              <B>A small business on a budget, ${SOLO.price} a month.</B> Google Search Console and Ahrefs Free for data,
              Draftly&apos;s free checkers for on-page fixes, and Draftly Solopreneur for one or two posts a week.
            </p>
            <p>
              <B>A marketing team.</B> Ahrefs Lite or Semrush for research and AI tracking, Surfer or Clearscope for
              refreshing pages that slipped, and Draftly Growth at ${GROWTH.price} a month so {GROWTH.seats} people write
              in one brand voice. See <A href="/for-teams">Draftly for teams</A> for how seats and client sites work.
            </p>
            <p>
              Google&apos;s own guidance is that it rewards high-quality content however it&apos;s produced.
              <SourceLinks items={[SOURCES.googleAiContent]} />
            </p>
            <p>
              Whatever you pick, have someone who knows the business read every post before it goes live. They&apos;ll
              catch the wrong price or the service you stopped offering, which no SEO tool will.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="Try the writing part free"
              body="Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/best-ai-for-writing", "/ai-seo-agency-vs-tool"]} topic="best AI SEO tools keyword research writing optimization" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
