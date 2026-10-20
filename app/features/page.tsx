import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccentText } from "@/components/AccentText";
import { FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { CtaBand } from "@/components/CtaBand";
import { FeatureTile } from "@/components/FeatureTile";
import { FeatureArt, HeroFlowArt } from "@/components/feature-art/FeatureArt";
import { KeepReading } from "@/components/KeepReading";
import { ProductFigure } from "@/components/ProductFigure";
import { CATEGORIES, FEATURES, FEATURES_HUB, featurePath, getFeature } from "@/lib/features";
import { PAIN_POINTS, answerText, type PainPoint } from "@/lib/features-hub";
import { TINTS, tintVars } from "@/lib/feature-tints";
import { getHomepageData } from "@/lib/graphql";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { pageImages } from "@/lib/og";
import { paidPriceList } from "@/lib/pricing";

export const revalidate = 3600;

// Hub for every live feature in lib/features.ts. Each card links to /feature/[slug].
export const metadata: Metadata = {
  title: { absolute: FEATURES_HUB.title },
  description: FEATURES_HUB.description,
  alternates: { canonical: FEATURES_HUB.path },
  ...pageImages(FEATURES_HUB.path, { title: FEATURES_HUB.title, description: FEATURES_HUB.description, type: "website", url: `${SITE_URL}${FEATURES_HUB.path}` }),
};

const FAQS: Faq[] = [
  {
    q: "What does Draftly do?",
    a: "Draftly writes SEO blog posts in your brand's voice. It suggests topics from your industry, writes the post, checks it for AI filler and SEO basics, and publishes it to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.",
  },
  {
    q: "Which features are on the Free plan?",
    a: "Your first post, a brand voice built from your website, the writing checks, one-click publishing, the Claude and ChatGPT connector, and Google Analytics and Search Console reports. Paid plans add more models, SEO data, more posts and team members.",
  },
  {
    q: "How much does Draftly cost?",
    a: `Your first post is free. Paid plans cost ${paidPriceList()} a month, with no per-seat charge.`,
  },
  {
    q: "How does Draftly compare to Jasper?",
    a: "Jasper covers ads, emails and social posts for marketing teams, in more than 30 languages. Draftly does one job: blog posts for small businesses, from the topic to the published post, at one price for the whole team. Each feature page has a short comparison with the Jasper tool closest to it, from Jasper's own pages or our own test of its app. The full write-up, with four real businesses, is Jasper vs Draftly.",
  },
];

const secondary = { color: "var(--color-text-secondary)" };

/** Answer text with its feature links. */
function Answer({ p }: { p: PainPoint }) {
  return (
    <>
      {p.answer.map((para, i) => (
        <p key={i} className="text-lg leading-relaxed mb-4" style={secondary}>
          {para.map((s, j) =>
            typeof s === "string" ? (
              s
            ) : (
              <a key={j} href={`/feature/${s.slug}`} className="font-semibold underline underline-offset-4 decoration-1" style={{ color: "var(--color-accent-hover)" }}>
                {s.text}
              </a>
            ),
          )}
        </p>
      ))}
    </>
  );
}

function PainGraphic({ p }: { p: PainPoint }) {
  return (
    <div className="graph-paper rounded-2xl p-5 sm:p-8" style={{ ...tintVars(p.tint), border: `1px solid ${TINTS[p.tint].grid}` }}>
      {"shot" in p.graphic ? (
        <ProductFigure shot={p.graphic.shot} />
      ) : (
        <figure>
          <div className="rounded-xl p-4 sm:p-6" style={{ background: TINTS[p.tint].bg, border: `1px solid ${TINTS[p.tint].grid}` }}>
            <FeatureArt name={p.graphic.art} className="max-w-[420px] mx-auto" />
          </div>
          <figcaption className="text-sm mt-3 leading-relaxed" style={secondary}>
            {p.graphic.caption}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

export default async function FeaturesHub() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  const jsonLd = jsonLdHtml(
    {
      "@type": "CollectionPage",
      name: FEATURES_HUB.title,
      description: FEATURES_HUB.description,
      url: `${SITE_URL}${FEATURES_HUB.path}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: FEATURES.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.name, url: `${SITE_URL}${featurePath(f)}` })),
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Draftly",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      featureList: FEATURES.map((f) => f.name),
    },
    faqJsonLd([...PAIN_POINTS.map((p) => ({ q: p.question, a: answerText(p) })), ...FAQS]),
  );

  // Cards in category order, so each tint forms a run in the grid.
  const cards = CATEGORIES.flatMap((c) => FEATURES.filter((f) => f.category === c.id));

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        {/* Hero: heading, two lines, a button and a text link; the flow drawing on the right. */}
        <section className="relative overflow-hidden pt-28 sm:pt-32 pb-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div
            className="absolute pointer-events-none"
            aria-hidden="true"
            style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", width: "min(900px, 100%)", height: "600px", background: "radial-gradient(ellipse, rgba(255, 107, 61, 0.06) 0%, transparent 70%)" }}
          />
          <div className="container-draftly relative max-w-6xl grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="reveal">
              <p className="eyebrow mb-5">Features</p>
              <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.4rem, 5.2vw, 68px)" }}>
                Every feature, from topic to <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">published post</AccentText>
              </h1>
              <p className="text-lg leading-relaxed mb-8 max-w-xl" style={secondary}>
                Draftly finds a topic from your industry, writes it in your brand&apos;s voice, checks it for AI filler and SEO basics, then publishes it to your blog. These are the {FEATURES.length} features that do it.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href={registerUrl} className="btn btn-primary">
                  {s.heroCtaText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <Link href="/pricing" className="inline-flex items-center gap-2 font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  See pricing <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="text-sm mt-4" style={{ color: "var(--color-text-muted)" }}>
                Free first post. No credit card.
              </p>
            </div>
            <div className="reveal" style={{ transitionDelay: "0.1s" }}>
              <div className="graph-paper rounded-2xl p-4 sm:p-6" style={{ ["--tint-band" as string]: "#f7f7f5", ["--tint-grid" as string]: "rgba(0, 0, 0, 0.06)", border: "1px solid var(--color-border)" }}>
                <HeroFlowArt />
              </div>
            </div>
          </div>
        </section>

        {/* The card grid */}
        <section id="all-features" aria-labelledby="all-features-heading" className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
          <div className="container-draftly max-w-6xl">
            <div className="reveal text-center mb-10">
              <h2 id="all-features-heading" className="text-3xl sm:text-4xl font-medium" style={{ letterSpacing: "-0.03em" }}>
                {FEATURES.length} features, grouped by{" "}
                <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                  the job they do
                </AccentText>
              </h2>
              <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Feature groups">
                {CATEGORIES.map((c) => (
                  <li key={c.id} className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: TINTS[c.id].bg, border: `1px solid ${TINTS[c.id].grid}` }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: TINTS[c.id].fill, border: "1.5px solid #111" }} aria-hidden="true" />
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((f, i) => (
                <li key={f.slug} className="reveal" style={{ transitionDelay: `${(i % 3) * 0.06}s` }}>
                  <FeatureTile feature={f} />
                </li>
              ))}
              {cards.length % 3 === 2 ? (
                // Fills the last row on desktop only; at two columns the grid is already even.
                <li className="reveal hidden lg:block" style={{ transitionDelay: "0.12s" }}>
                  <div className="feature-tile relative flex flex-col h-full p-6" style={{ background: "#111", borderColor: "#111", color: "#fff" }}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: "#bbb" }}>
                      Plans
                    </p>
                    <h3 className="feature-tile-title" style={{ fontSize: "1.6rem", color: "#fff" }}>
                      Which plan has what
                    </h3>
                    <p className="text-[15px] leading-relaxed mt-4" style={{ color: "#ccc" }}>
                      Every plan starts with a free post and includes brand voice, the writing checks and one-click publishing. Paid plans cost {paidPriceList()} a month, with no per-seat charge.
                    </p>
                    <Link href="/pricing" className="feature-tile-link mt-auto pt-6" style={{ color: "#fff" }}>
                      <span>Compare plans</span>
                      <span className="feature-tile-arrow" aria-hidden="true" style={{ borderColor: "#fff" }}>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </li>
              ) : null}
            </ul>
            <div className="text-center mt-12">
              <a href={registerUrl} className="btn btn-primary">
                {s.heroCtaText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <p className="text-sm mt-3" style={{ color: "var(--color-text-muted)" }}>
                Every plan starts with a free post.
              </p>
            </div>
          </div>
        </section>

        {/* Questions people ask, answered with the features that solve them. Alternating sides. */}
        {PAIN_POINTS.map((p, i) => {
          const flip = i % 2 === 1;
          const chips = p.features.map(getFeature).filter((f) => f !== undefined);
          return (
            <section key={p.id} id={p.id} aria-labelledby={`${p.id}-heading`} className="py-20 sm:py-24 px-4 scroll-mt-24" style={{ background: i % 2 === 0 ? "var(--color-bg-primary)" : "var(--color-bg-surface)" }}>
              <div className="container-draftly max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className={`reveal min-w-0 ${flip ? "lg:order-2" : ""}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] mb-4" style={{ color: "var(--color-text-muted)" }}>
                    Asked a lot
                  </p>
                  <h2 id={`${p.id}-heading`} className="text-3xl sm:text-4xl font-medium mb-6" style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}>
                    {p.question}
                  </h2>
                  <Answer p={p} />
                  <ul className="flex flex-wrap gap-2 mt-6" aria-label="Features that help">
                    {chips.map((f) => (
                      <li key={f.slug}>
                        <a href={featurePath(f)} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold" style={{ background: TINTS[f.category].bg, border: `1px solid ${TINTS[f.category].grid}`, color: "var(--color-text-primary)" }}>
                          {f.name} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  {flip ? (
                    <a href={registerUrl} className="btn btn-primary mt-8">
                      {s.heroCtaText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                <div className={`reveal min-w-0 ${flip ? "lg:order-1" : ""}`} style={{ transitionDelay: "0.08s" }}>
                  <PainGraphic p={p} />
                </div>
              </div>
            </section>
          );
        })}

        <section className="pb-8 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div className="container-draftly max-w-5xl">
            <FaqList faqs={FAQS} />
            <p className="max-w-3xl mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Read the full comparison in{" "}
              <Link href="/jasper-vs-draftly" style={{ color: "var(--color-accent-hover)" }}>
                Jasper vs Draftly
              </Link>
              .
            </p>
          </div>
        </section>

        <section data-toc-skip className="py-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div className="container-draftly max-w-5xl">
            <p className="eyebrow mb-3">From the blog</p>
            <KeepReading
              heading="Guides to writing with AI"
              className=""
              exclude={FEATURES_HUB.path}
              guides={["/seo-copywriting", "/best-ai-for-writing"]}
              topic="ai blog writer brand voice sound human publish wordpress"
            />
          </div>
        </section>

        <CtaBand
          tone="accent"
          heading={<>Your first post <em className="italic" style={{ color: "var(--color-accent)" }}>is on us</em></>}
          body="Paste your URL. Draftly picks a topic, writes the post in your voice, checks it and gets it ready to publish."
          secondary={{ href: "/pricing", label: "See pricing" }}
        />
      </main>
      <Footer />
    </>
  );
}
