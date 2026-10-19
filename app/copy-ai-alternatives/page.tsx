import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { ProductFigure } from "@/components/ProductFigure";
import { BarChart } from "@/components/BarChart";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";
import { SourceLinks } from "@/components/SourceLinks";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import { JASPER_PRO } from "@/lib/jasper-vs-draftly";
import { CHECKED, COPYAI_ALTERNATIVES, COPYAI_PLANS, GROWTH, SOURCES } from "@/lib/competitor-reviews";

export const revalidate = 3600;

// Targets "copy ai alternatives" (Ahrefs US: 100/mo, KD 0, traffic potential 400), "copy ai
// alternative" (80, KD 0) and "copy.ai alternative" (40), checked 2026-10-16. The SERP is
// alternatives lists. The "Jasper vs Copy.ai" section covers "jasper vs copy ai" (100, KD 1)
// and "copy ai vs jasper" (100, KD 4). Competitor facts live in lib/competitor-reviews.ts.
const PATH = "/copy-ai-alternatives";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Copy.ai Alternatives for Blog Posts and Marketing in 2026";
const DESCRIPTION =
  "Copy.ai is now a go-to-market platform with plans from $29 to $3,000 a month. Compare Draftly, Jasper, Writesonic, Koala and Claude, plus Jasper vs Copy.ai.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const [CHAT, CA_GROWTH] = COPYAI_PLANS;
const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const src = (items: { label: string; href: string }[]) => <SourceLinks items={items} month={CHECKED.month} />;

const FAQS: Faq[] = [
  {
    q: "What is the best Copy.ai alternative?",
    a: "It depends on what you used Copy.ai for. For SEO blog posts in your brand voice, published to your CMS, Draftly. For marketing copy across ads, email and social, Jasper. For bulk articles priced by the word, Koala.",
  },
  {
    q: "How much does Copy.ai cost?",
    a: `As listed on copy.ai in ${CHECKED.month}, Chat is $${CHAT.monthly} a month, or $${CHAT.yearlyMonthly} billed yearly, for ${CHAT.seats} seats. Growth is ${money(CA_GROWTH.monthly)} a month billed yearly, and the plans go up to ${money(3000)} a month.`,
  },
  {
    q: "Is Copy.ai free?",
    a: "Its pricing page has a Try for free button but doesn't list a free plan or trial terms. Draftly writes your first full blog post free, with no credit card.",
  },
  {
    q: "Is Jasper better than Copy.ai?",
    a: `For marketing content, Jasper is the closer fit today: it's built around writing for every channel in your brand voice. Copy.ai now focuses on sales and go-to-market workflows. Jasper costs more per person, at $${JASPER_PRO.monthly} per seat a month.`,
  },
  {
    q: "Does Copy.ai write blog posts?",
    a: "Its homepage lists content creation, including SEO, as one marketing use case. Its pricing page doesn't name a CMS integration, so you copy posts into your site yourself.",
  },
  {
    q: "Is Copy.ai better than ChatGPT?",
    a: `They do different jobs. Copy.ai Chat gives ${CHAT.seats} seats access to OpenAI, Anthropic and Gemini models for $${CHAT.monthly} a month. Its bigger plans add sales and marketing workflows that a chat app doesn't have.`,
  },
];

export default function CopyAiAlternativesPage() {
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
      citation: [SOURCES.copyaiPricing, SOURCES.copyaiHome, SOURCES.jasperPricing, SOURCES.jasperIntegrations, SOURCES.writesonicPricing, SOURCES.koalaPricing, SOURCES.claudePricing].map((s) => s.href),
    },
    {
      "@type": "ItemList",
      name: "Copy.ai alternatives",
      itemListElement: COPYAI_ALTERNATIVES.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name, url: `${SITE_URL}${PATH}#${a.id}` })),
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
              Copy.ai alternatives{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                for blog posts and marketing
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              Copy.ai now calls itself an AI-native go-to-market platform. Its Chat plan is ${CHAT.monthly} a month for{" "}
              {CHAT.seats} seats, and the next plan up is {money(CA_GROWTH.monthly)} a month. If you came to it for blog
              posts and marketing copy, Draftly, Jasper, Writesonic, Koala and Claude each cover part of that.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, so weigh my take on it accordingly. Every competitor price below links to that
              company&apos;s own page, checked in {CHECKED.month}.
            </p>
          </header>

          <Section id="copy-ai-now" title="What Copy.ai sells now">
            <p>
              Copy.ai&apos;s homepage leads with &quot;The First AI-Native GTM Platform.&quot; Its use cases are mostly
              sales and operations: prospecting, inbound lead processing, deal coaching and CRM enrichment. Content creation
              is one marketing use case among several.{src([SOURCES.copyaiHome])}
            </p>
            <Bullets
              items={COPYAI_PLANS.map((p) => (
                <>
                  <B>{p.name}:</B> ${p.monthly.toLocaleString("en-US")} a month
                  {p.yearlyMonthly ? `, or $${p.yearlyMonthly} billed yearly` : ""}, {p.seats} seats. {p.extra}.
                </>
              ))}
            />
            <p>
              The pricing page names no CMS integration.{src([SOURCES.copyaiPricing])} The jump from ${CHAT.monthly} to{" "}
              {money(CA_GROWTH.monthly)} a month is why small teams who want more than chat go looking.
            </p>
            <ContentImage
              image={STOCK.planningWithStickyNotes}
              caption="Copy.ai now builds for sales and go-to-market teams. If your team mostly plans and writes marketing content, the tools below fit better."
            />
          </Section>

          <section id="at-a-glance" className="mt-16">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              The alternatives at a glance
            </h2>
            <div className="sm:hidden space-y-3">
              {COPYAI_ALTERNATIVES.map((a) => (
                <div key={a.id} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="font-semibold" style={a.draftly ? { color: "var(--color-accent)" } : undefined}>{a.name}</p>
                  <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={secondary}>
                    {[
                      ["Best for", a.bestFor],
                      ["Starting price", a.startingPrice],
                      ["Publishes to", a.publishing],
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
              <table className="w-full text-sm min-w-[680px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">Tool</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Best for</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Starting price</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Publishes to</th>
                  </tr>
                </thead>
                <tbody>
                  {COPYAI_ALTERNATIVES.map((a) => (
                    <tr key={a.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-semibold" style={a.draftly ? { color: "var(--color-accent)" } : undefined}>
                        {a.name}
                      </th>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.bestFor}</td>
                      <td className="px-4 py-3 align-top">{a.startingPrice}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{a.publishing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              Competitor details from each company&apos;s own pages as of {CHECKED.month}. Prices change, so check before you
              buy.
            </p>
          </section>

          {COPYAI_ALTERNATIVES.map((a, i) => (
            <Section key={a.id} id={a.id} title={`${i + 1}. ${a.name}: ${a.bestFor.charAt(0).toLowerCase()}${a.bestFor.slice(1)}`}>
              <p>
                {a.summary}
                {src(a.sources)}
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
                    Every post is checked against your <A href="/seo-copywriting">SEO copywriting rules</A> and for
                    AI-sounding writing before you see it. Growth is ${GROWTH.price} a month for {GROWTH.seats} team members
                    with no per-seat charge.
                  </p>
                  <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
                </>
              )}
              {a.id === "koala" && (
                <p>
                  The <A href="/koala-ai-review">Koala AI review</A> covers each plan and how far the words go on each model.
                </p>
              )}
            </Section>
          ))}

          <Section id="jasper-vs-copy-ai" title="Jasper vs Copy.ai">
            <p>
              Jasper and Copy.ai now build for different teams. Jasper builds for marketing teams writing in a brand
              voice across channels. Copy.ai builds for sales and go-to-market teams automating
              prospecting and CRM work.{src([SOURCES.jasperPricing, SOURCES.copyaiHome])}
            </p>
            <Bullets
              items={[
                <>
                  <B>Price for one person:</B> Copy.ai Chat is ${CHAT.monthly} a month. Jasper Pro is $
                  {JASPER_PRO.monthly} a month.
                </>,
                <>
                  <B>Price for five people:</B> Copy.ai Chat is still ${CHAT.monthly}, since it includes {CHAT.seats} seats.
                  Jasper Pro is ${JASPER_PRO.monthly * 5} a month at ${JASPER_PRO.monthly} per seat.
                </>,
                <>
                  <B>Brand voice:</B> both offer one. Jasper Pro includes 2 brand voices. Copy.ai pairs its Brand Voice with
                  an Infobase of company information.
                </>,
                <>
                  <B>Publishing:</B> Jasper lists a Webflow app. Copy.ai&apos;s pricing page names no CMS.
                </>,
              ]}
            />
            <BarChart
              title="Monthly price for a team of five"
              rows={[
                { key: "copyai", label: `Copy.ai ${CHAT.name}`, value: CHAT.monthly },
                { key: "jasper", label: "Jasper Pro, 5 seats", value: JASPER_PRO.monthly * 5 },
              ]}
              max={JASPER_PRO.monthly * 5}
              format={(n) => `$${n}`}
              note={`Monthly billing, from each company's pricing page, checked ${CHECKED.label}.`}
            />
            <p>
              For marketing copy, pick Jasper. For sales workflows, Copy.ai. For a small team that mainly wants chat, Copy.ai
              Chat is the cheaper of the two. We tested Jasper against Draftly on real businesses in{" "}
              <A href="/jasper-vs-draftly">Jasper vs Draftly</A>.
            </p>
          </Section>

          <Section id="stay-with-copy-ai" title="When Copy.ai is still the right pick">
            <p>
              Stay on Chat if a team of up to five wants one AI chat with OpenAI, Anthropic and Gemini models. ${CHAT.monthly}{" "}
              a month for five seats is hard to beat.
            </p>
            <p>
              Move up to Growth if you run a sales team and want prospecting, lead processing and CRM enrichment automated.
              None of the tools above does that.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="Try a Copy.ai alternative for blog posts"
              body="Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/jasper-vs-draftly", "/writesonic-alternatives"]} topic="copy.ai alternative jasper compare pricing marketing" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
