import type { Metadata } from "next";
import { APP_URL, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { BANNED_SAMPLE, EXAMPLES, RULE_CHECK_TEST as T } from "@/lib/ruleCheck";
import { BENCHMARK } from "@/lib/benchmark";
import { jsonLdHtml } from "@/lib/schema";

export const revalidate = 3600;

// Targets "seo copywriting" (Ahrefs US: 4,200/mo, KD 26), with "writing seo copy",
// "seo copywriting tips" and "seo copywriting examples" as secondaries. The rules
// are the ones the app checks (lib/ruleCheck.ts names the source files), and the
// examples are verbatim excerpts from the 2026-10-08 benchmark run.
const PATH = "/seo-copywriting";
const TITLE = "SEO Copywriting: The Rules Draftly Checks on Every Post";
const DESCRIPTION =
  "SEO copywriting tips from the rules Draftly checks on every post: headings, keyword placement, meta length and filler words, with before and after examples.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}`, images: [DEFAULT_OG_IMAGE] },
};

const BANNED_FAQ = "What words make writing sound like AI?";

const FAQS: Faq[] = [
  {
    q: "What is SEO copywriting?",
    a: "SEO copywriting is writing a page or post so search engines can tell which question it answers and readers trust it enough to act. It pairs on-page structure, such as headings and meta tags, with plain and specific writing.",
  },
  {
    q: "How long should a meta title and meta description be?",
    a: "Draftly aims for a meta title of 50 to 60 characters and a meta description of 150 to 160, spaces included. The target keyword goes in the first 120 characters of the description.",
  },
  {
    q: "How many times should I use my keyword?",
    a: "Use it in the first half of the title, in the first 100 words, in at least one H2 and in the meta description. After that, write for the question. Draftly sets no keyword density target.",
  },
  {
    q: BANNED_FAQ,
    a: "Filler words such as seamless, leverage, delve, landscape and game-changer are common tells. So are “it’s not X, it’s Y” phrasing and hedges like “may help”. Draftly bans them by default and checks each post for them.",
  },
  {
    q: "Can AI write good SEO copy?",
    a: `It can when the output is checked. In a ${T.briefs}-brief test, ${T.model} posts passed every hard rule ${T.passAfterFix}% of the time after one automatic fix pass, against ${T.previousPassAfterFix}% for ${T.previousModel}.`,
  },
];

export default async function SeoCopywritingPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: T.iso,
      dateModified: T.iso,
      author: { "@type": "Person", name: "Preston Vawdrey", url: "https://prestonvawdrey.com" },
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
    },
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <article className="container-draftly max-w-4xl">
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              SEO copywriting:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                the rules we check on every post
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              SEO copywriting is writing a web page so search engines can tell what it answers and readers trust it
              enough to call, book or buy. For a small business, that means a post that ranks for the question your
              customers ask and then gives them one clear next step. Below are the rules Draftly checks on every post it
              writes, with real before and after examples from our own tests.
            </p>
            <Byline verb="Tested" date={T.date} />
          </header>

          <Section id="structure" title="Structure tells search engines what the page answers">
            <p>
              The title, headings and meta tags tell a search engine what a page covers. These are the structure rules
              Draftly checks in code on each post.
            </p>
            <Bullets
              items={[
                <>
                  <B>One H1.</B> The post title is the only H1, and it carries the target keyword.
                </>,
                <>
                  <B>Headings that make a point.</B> Each H2 states a claim or asks the exact question a reader would
                  type, in sentence case. Labels like Introduction, Overview and Conclusion get flagged.
                </>,
                <>
                  <B>The keyword in four places, then stop.</B> Put it in the first half of the title, the first 100
                  words, at least one H2 and the first 120 characters of the meta description. There is no density
                  target, so nobody repeats the phrase to hit a number.
                </>,
                <>
                  <B>Meta title of 50 to 60 characters and meta description of 150 to 160.</B> Draftly counts spaces
                  too, and a miss in either sends the post back for a fix.
                </>,
                <>
                  <B>The answer comes first.</B> The first one or two sentences answer the question the post exists to
                  answer. Background comes after.
                </>,
                <>
                  <B>Short paragraphs.</B> No paragraph runs over 120 words, and most land between 40 and 80.
                </>,
              ]}
            />
          </Section>

          <Section id="trust" title="Readers trust copy that sounds like a person wrote it">
            <p>
              A post can be perfectly structured and still read like a template. The voice rules catch the habits that
              give machine-written copy away.
            </p>
            <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              No filler vocabulary
            </h3>
            <p>
              Draftly&apos;s default rules ban a list of filler words and phrases. When the model reaches for one, the
              rule asks it to write the literal thing it means. A sample of the list:
            </p>
          </Section>
          <div className="mt-6 max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4" data-lint-skip="">
            {BANNED_SAMPLE.map((group) => (
              <div key={group.label} className="p-5 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
                  {group.label}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {group.terms.map((t) => (
                    <li key={t} className="text-sm px-2.5 py-1 rounded-md line-through" style={{ background: "var(--color-bg-subtle)", color: "var(--color-text-secondary)" }}>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              No invented statistics
            </h3>
            <p>
              Every number needs a source from the material Draftly was given, such as your website or the brief. If the
              figure is missing, it stays out of the post. Sources are named inline, so you will not see &ldquo;experts
              say&rdquo; or &ldquo;studies show&rdquo;. Quotes use a person&apos;s exact words or do not appear at all.
            </p>
            <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              No contrast phrasing or hedges
            </h3>
            {/* Quotes the banned constructions on purpose. */}
            <p data-lint-skip="">
              &ldquo;It&apos;s not X, it&apos;s Y&rdquo;, &ldquo;not just&rdquo; and &ldquo;more than just&rdquo; all get
              flagged. Draftly also catches the quieter forms, &ldquo;rather than&rdquo; and &ldquo;instead
              of&rdquo;, and asks for the positive claim on its own. Hedges like &ldquo;may help&rdquo; and &ldquo;is
              designed to&rdquo; get the same treatment: say what the thing does.
            </p>
            <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Varied rhythm
            </h3>
            <p>
              A run of sentences that are all the same length lulls the reader. The rules ask for a short sentence after a
              long one. They also ban two sentences in a row that start with &ldquo;You&rdquo; and openers like
              Additionally or Furthermore.
            </p>
          </div>

          <Section id="conversion" title="One clear call to action closes the post">
            <p>
              The last section adds something new, such as a checklist or a next step, and ends on a single call to
              action. A recap of what the reader just read gets flagged. When a website sets a default offer, Draftly
              checks that its link appears once, in the final paragraph, and nowhere else.
            </p>
          </Section>

          <Section id="examples" title="SEO copywriting examples: three fixes from our tests">
            <p>
              These excerpts come from Draftly&apos;s benchmark run on {T.date}, where {T.model} wrote posts for{" "}
              {T.briefs} made-up small businesses. Each draft broke at least one rule, the automatic fix pass rewrote it, and the
              rewrite passed the check.
            </p>
          </Section>
          <div className="mt-8 max-w-3xl space-y-6" data-lint-skip="">
            {EXAMPLES.map((ex) => (
              <figure key={ex.rule} className="p-6 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  Rule broken: {ex.rule}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {ex.business}. {ex.detail}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed">
                  <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-subtle)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>
                      Draft
                    </p>
                    <blockquote style={{ color: "var(--color-text-secondary)" }}>{ex.before}</blockquote>
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: "var(--color-accent-muted)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>
                      After the fix pass
                    </p>
                    <blockquote style={{ color: "var(--color-text-primary)" }}>{ex.after}</blockquote>
                  </div>
                </div>
                {ex.note ? (
                  <figcaption className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {ex.note}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>

          <Section id="how-draftly-enforces" title="How Draftly enforces these rules automatically">
            <p>
              Draftly checks each post against your website&apos;s writing rules before you see it. If the post breaks
              any, Draftly sends it back to the model once with every violation listed, and keeps the rewrite when it has
              fewer problems.
            </p>
            <p>
              {T.model} is Draftly&apos;s default writer. In a {T.briefs}-brief test against Draftly&apos;s production
              rules, its posts passed every hard rule <B>{T.passAfterFix}% of the time</B> after the fix pass. The
              previous default, {T.previousModel}, passed {T.previousPassAfterFix}% of the time.
            </p>
            <p>
              You can switch most rules on or off for each website, so a brand that likes em dashes can keep them. To see
              how {BENCHMARK.length} AI models handled the same rules, read our{" "}
              <A href="/best-ai-for-writing">test of which AI writes best</A>. Plans and credit costs are on the{" "}
              <A href="/pricing">Draftly pricing page</A>.
            </p>
          </Section>

          <FaqList faqs={FAQS} skipLint={[BANNED_FAQ]} />

          <DarkCta
            title="Get a post that passes these rules"
            body="Paste your website URL and Draftly writes your first post free, in your brand's voice, checked against the rules on this page."
            href={registerUrl}
            label={s.heroCtaText}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
