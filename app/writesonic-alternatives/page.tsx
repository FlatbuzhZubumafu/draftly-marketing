import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS } from "@/lib/pricing";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { ProductFigure } from "@/components/ProductFigure";
import { BarChart } from "@/components/BarChart";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import {
  ALTERNATIVES,
  CHECKED,
  DRAFTLY_PER_POST,
  SOURCES,
  WRITESONIC_MONTHLY_FROM,
  WRITESONIC_PER_ARTICLE,
  WRITESONIC_PLANS,
  type Source,
} from "@/lib/writesonic-alternatives";
import { pageImages } from "@/lib/og";

export const revalidate = 3600;

// Targets "writesonic alternatives" (Ahrefs US: 250/mo, KD 0) and "writesonic alternative"
// (150, KD 1), checked 2026-10-15. Competitor facts live in lib/writesonic-alternatives.ts,
// each read on the company's own pricing page. Draftly facts come from lib/pricing.ts.
const PATH = "/writesonic-alternatives";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Writesonic Alternatives for SEO Blog Posts in 2026";
const DESCRIPTION =
  "Writesonic now sells AI visibility first. If you mostly need blog posts, compare Draftly, Koala, SEOWriting.ai, Jasper and Copy.ai on price and publishing.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` }),
};

const [SOLO, GROWTH] = PAID_PLANS;
const [WS_STARTER, WS_BASIC, WS_GROWTH] = WRITESONIC_PLANS;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const cents = (n: number) => `${Math.round(n * 100)} cents`;

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
    q: "What is the best Writesonic alternative?",
    a: "It depends on what you used Writesonic for. For SEO blog posts in your brand voice, published to your CMS, Draftly. For bulk articles at the lowest price, Koala or SEOWriting.ai. For ads, emails and social posts across a marketing team, Jasper.",
  },
  {
    q: "Is there a free Writesonic alternative?",
    a: "Draftly writes your first full blog post free with no credit card. SEOWriting.ai gives 3 free articles and Koala gives 5,000 free words. None of them is free for ongoing use.",
  },
  {
    q: "How much does Writesonic cost?",
    a: `As listed on writesonic.com in ${CHECKED.month}, Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly ($${WS_STARTER.yearly.toLocaleString("en-US")} a year), Basic $${WS_BASIC.yearlyMonthly} and Growth $${WS_GROWTH.yearlyMonthly}. The page lists self-serve plans from $${WRITESONIC_MONTHLY_FROM} a month and a free trial with no credit card.`,
  },
  {
    q: "Does Writesonic still write blog posts?",
    a: `Yes. Its plans include ${WS_STARTER.articles}, ${WS_BASIC.articles} or ${WS_GROWTH.articles} AI articles a month and publish to WordPress. The plans are built around tracking how ChatGPT, Gemini and Google AI Overviews mention your brand.`,
  },
  {
    q: "Does Draftly track AI search visibility like Writesonic?",
    a: "No. Draftly writes and publishes blog posts. Its free AI visibility checker tells you whether AI crawlers can read your site, but it doesn't track whether ChatGPT or Gemini mention you. If you need that tracking, Writesonic does it.",
  },
  {
    q: "Is Writesonic worth it for a small business?",
    a: `If you need AI visibility tracking and site audits, it can be. If you mostly need blog posts, Starter works out to about ${usd2(WRITESONIC_PER_ARTICLE)} per article, while Draftly's $${SOLO.price} plan covers ${SOLO.posts.toLowerCase()}.`,
  },
];

export default function WritesonicAlternativesPage() {
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
      image: [imageObjectJsonLd(GUIDE_SHOTS.urlToPost)],
      citation: Object.values(SOURCES).map((s) => s.href),
    },
    {
      "@type": "ItemList",
      name: "Writesonic alternatives",
      itemListElement: ALTERNATIVES.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: `${SITE_URL}${PATH}#${a.id}` })),
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
              Writesonic alternatives{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                for SEO blog posts
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              Writesonic is now an AI search visibility platform first. Its plans start at ${WS_STARTER.yearlyMonthly} a
              month billed yearly and include {WS_STARTER.articles} AI articles a month. If blog posts are what you need,
              Draftly writes them in your brand voice from ${SOLO.price} a month, Koala and SEOWriting.ai sell bulk
              articles for less, and Jasper and Copy.ai cover wider marketing work.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, so weigh my take on it accordingly. Every competitor price below links to that
              company&apos;s own pricing page, checked {CHECKED.label}.
            </p>
          </header>

          <Section id="writesonic-now" title="What Writesonic sells now">
            <p>
              Writesonic&apos;s pricing page leads with &quot;Find which prompts recommend your competitors instead of
              you.&quot; Every self-serve plan tracks your brand in ChatGPT, Gemini and Google AI Overviews, runs site
              audits and monitors ads. Writing is one feature inside that.
              <SourceLinks items={[SOURCES.writesonicPricing, SOURCES.writesonicHome]} />
            </p>
            <Bullets
              items={WRITESONIC_PLANS.map((p) => (
                <>
                  <B>{p.name}:</B> ${p.yearlyMonthly} a month billed yearly, {p.users} {p.users === 1 ? "user" : "users"},{" "}
                  {p.articles} AI articles a month, {p.voices} brand {p.voices === 1 ? "voice" : "voices"}.
                </>
              ))}
            />
            <p>
              That&apos;s a good deal if you want the tracking. If you only use the articles, Starter works out to about{" "}
              {usd2(WRITESONIC_PER_ARTICLE)} per article over a year, which is why people go looking for something else.
            </p>
            <ContentImage
              image={STOCK.contentStrategyPlanner}
              caption="Before you switch, list what you actually use each month: articles, brand voices, tracking or audits."
            />
          </Section>

          <section id="at-a-glance" className="mt-16">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              The alternatives at a glance
            </h2>
            <div className="sm:hidden space-y-3">
              {ALTERNATIVES.map((a) => (
                <div key={a.id} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="font-semibold" style={a.draftly ? { color: "var(--color-accent)" } : undefined}>{a.name}</p>
                  <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={secondary}>
                    {[
                      ["Best for", a.bestFor],
                      ["Starting price", a.startingPrice],
                      ["Included", a.included],
                      ["Publishes to", a.publishing],
                      ["Free option", a.freeOption],
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
              <table className="w-full text-sm min-w-[760px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">Tool</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Best for</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Starting price</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Included</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Publishes to</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Free option</th>
                  </tr>
                </thead>
                <tbody>
                  {ALTERNATIVES.map((a) => (
                    <tr key={a.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-semibold" style={a.draftly ? { color: "var(--color-accent)" } : undefined}>
                        {a.name}
                      </th>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.bestFor}</td>
                      <td className="px-4 py-3 align-top">{a.startingPrice}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.included}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.publishing}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.freeOption}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              Competitor details from each company&apos;s pricing page as of {CHECKED.month}. Prices change, so check before
              you buy.
            </p>
          </section>

          {ALTERNATIVES.map((a, i) => (
            <Section key={a.id} id={a.id} title={`${i + 1}. ${a.name}: ${a.bestFor.charAt(0).toLowerCase()}${a.bestFor.slice(1)}`}>
              <p>
                {a.summary}
                <SourceLinks items={a.sources} />
              </p>
              <p>
                <B>Pick it if:</B> {a.pickIf}
              </p>
              <p>
                <B>Skip it if:</B> {a.skipIf}
              </p>
              {a.draftly && (
                <>
                  <p>
                    Draftly reads your website, sets your brand voice from it and picks topics from your industry&apos;s news.
                    Every post is checked against your <A href="/seo-copywriting">SEO copywriting rules</A> and for
                    AI-sounding writing before you see it. Growth adds room for {GROWTH.seats} team members at ${GROWTH.price}{" "}
                    a month with no per-seat charge.
                  </p>
                  <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
                </>
              )}
              {a.id === "koala" && (
                <p>
                  The <A href="/koala-ai-review">Koala AI review</A> covers each plan and how far the words go on each model.
                </p>
              )}
              {a.id === "copy-ai" && (
                <p>
                  For other ways out of Copy.ai, see <A href="/copy-ai-alternatives">Copy.ai alternatives</A>.
                </p>
              )}
            </Section>
          ))}

          <Section id="cost-per-post" title="Cost per post, Writesonic vs Draftly">
            <p>
              Writesonic Starter costs ${WS_STARTER.yearly.toLocaleString("en-US")} a year for {WS_STARTER.articles * 12}{" "}
              articles, about {usd2(WRITESONIC_PER_ARTICLE)} each. Draftly Solopreneur costs ${SOLO.price} a month for{" "}
              {SOLO.posts.toLowerCase()}, about {cents(DRAFTLY_PER_POST)} each, billed monthly.
            </p>
            <p>
              That comparison flatters Draftly, because Writesonic&apos;s price also pays for visibility tracking, site
              audits and ads monitoring. Count only what you&apos;d use.
            </p>
            <BarChart
              title="Price per article or post, entry plan"
              rows={[
                { key: "writesonic", label: `Writesonic ${WS_STARTER.name}`, value: WRITESONIC_PER_ARTICLE },
                { key: "draftly", label: `Draftly ${SOLO.name}`, value: DRAFTLY_PER_POST },
              ]}
              max={WRITESONIC_PER_ARTICLE}
              format={(n) => `$${n.toFixed(2)}`}
              note={`Writesonic billed yearly, Draftly billed monthly. Writesonic's price also covers tracking, audits and ads monitoring. Prices checked ${CHECKED.label}.`}
            />
          </Section>

          <Section id="stay-with-writesonic" title="When Writesonic is still the right pick">
            <p>
              Stay if you want to know which prompts in ChatGPT, Gemini or Google AI Overviews mention your competitors and
              not you, and you want one tool that audits the site and drafts the fixes. None of the writing tools above
              tracks that.
            </p>
            <p>
              Draftly&apos;s free <A href="/tools/ai-visibility-checker">AI visibility checker</A> covers a narrower
              question: whether AI crawlers can read your site at all. It&apos;s a good first check before you pay anyone for
              tracking.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="Try a Writesonic alternative for free"
              body="Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/jasper-vs-draftly", "/blog-writing-service"]} topic="writesonic alternative AI writing tool compare pricing" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
