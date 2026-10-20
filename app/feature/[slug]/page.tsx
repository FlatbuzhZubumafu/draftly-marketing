import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, FaqList, faqJsonLd } from "@/components/ArticleParts";
import { CtaBand } from "@/components/CtaBand";
import { FeatureTile } from "@/components/FeatureTile";
import { FeatureArt, isArtName } from "@/components/feature-art/FeatureArt";
import { ProductFigure } from "@/components/ProductFigure";
import { ThumbCard } from "@/components/ThumbCard";
import { CATEGORIES, FEATURES, FEATURES_HUB, compareBasis, featurePath, featuresIn, getFeature } from "@/lib/features";
import { DIFFERENCE } from "@/lib/feature-pages";
import { TINTS, tintVars } from "@/lib/feature-tints";
import { getHomepageData } from "@/lib/graphql";
import { GUIDES } from "@/lib/related";
import { GUIDE_THUMBS, imageObjectJsonLd } from "@/lib/product-shots";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { pageImages } from "@/lib/og";

export const revalidate = 3600;
export const dynamicParams = false;

// One page per feature in lib/features.ts. Layout, top to bottom: hero on the category's
// graph paper, the difference, where it fits in the Draftly flow, numbered how-it-works
// blocks, FAQ, related features, a closing band, the footer CTA.
export function generateStaticParams() {
  return FEATURES.map((f) => ({ slug: f.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const feature = getFeature((await params).slug);
  if (!feature) return {};
  const path = featurePath(feature);
  return {
    title: { absolute: feature.title },
    description: feature.description,
    alternates: { canonical: path },
    ...pageImages(path, { title: feature.title, description: feature.description, type: "website", url: `${SITE_URL}${path}` }),
  };
}

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const h2Style = { letterSpacing: "-0.03em", lineHeight: 1.15 };

/** Small tinted number chip: "001". */
const NumberChip = ({ n, bg }: { n: number; bg: string }) => (
  <span className="inline-block font-mono text-xs font-semibold rounded-md px-2.5 py-1 mb-5" style={{ background: bg, border: "1px solid rgba(0,0,0,0.12)" }}>
    {String(n).padStart(3, "0")}
  </span>
);

const Dot = () => <span className="mt-[11px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} aria-hidden="true" />;

export default async function FeaturePage({ params }: Props) {
  const feature = getFeature((await params).slug);
  if (!feature) notFound();
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  const path = featurePath(feature);
  const category = CATEGORIES.find((c) => c.id === feature.category);
  const tint = TINTS[feature.category];
  const diff = DIFFERENCE[feature.slug];
  const related = feature.related.map(getFeature).filter((f) => f !== undefined);
  const guide = feature.guide ? GUIDES.find((g) => g.href === feature.guide!.href) : undefined;
  const guideThumb = feature.guide ? GUIDE_THUMBS[feature.guide.href] : undefined;
  const [introLead, ...introRest] = feature.intro;

  const jsonLd = jsonLdHtml(
    {
      "@type": "WebPage",
      name: feature.title,
      description: feature.description,
      url: `${SITE_URL}${path}`,
      about: { "@type": "SoftwareApplication", name: "Draftly", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: SITE_URL },
      ...(feature.shot ? { primaryImageOfPage: imageObjectJsonLd(feature.shot) } : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Features", item: `${SITE_URL}${FEATURES_HUB.path}` },
        { "@type": "ListItem", position: 2, name: feature.name, item: `${SITE_URL}${path}` },
      ],
    },
    faqJsonLd(feature.faqs),
  );

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        {/* 1. Hero on the category's graph paper */}
        <section className="graph-paper pt-28 sm:pt-32 pb-16 sm:pb-20 px-4" style={{ ...tintVars(feature.category), ["--tint-band" as string]: tint.bg }}>
          <div className="container-draftly max-w-6xl">
            <p className="text-sm mb-8" style={{ color: "#555" }}>
              <a href={FEATURES_HUB.path} className="underline underline-offset-2" style={{ color: "inherit" }}>
                Features
              </a>{" "}
              / {category?.name} / {feature.name}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.14em] mb-5" style={{ color: "#333" }}>
                  {category?.name}
                </p>
                <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.3rem, 5vw, 64px)" }}>
                  {feature.h1.lead} <em>{feature.h1.accent}</em>
                </h1>
                <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "#3a3a3a" }}>
                  {introLead}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/pricing" className="btn btn-secondary" style={{ background: "rgba(255,255,255,0.7)" }}>
                    See pricing
                  </Link>
                  <a href={registerUrl} className="btn btn-primary">
                    {s.heroCtaText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="min-w-0">
                <div className="rounded-2xl p-4 sm:p-8" style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid #111", boxShadow: `8px 8px 0 ${tint.fill}` }}>
                  <FeatureArt name={isArtName(feature.slug) ? feature.slug : "writing-rules"} className="max-w-[520px] mx-auto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. The difference */}
        {diff ? (
          <section id="difference" aria-labelledby="difference-heading" className="py-20 sm:py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
            <div className="container-draftly max-w-3xl">
              <p className="eyebrow mb-4">The difference</p>
              <h2 id="difference-heading" className="text-3xl sm:text-4xl font-medium mb-6" style={h2Style}>
                Why it works <em className="italic" style={{ color: "var(--color-accent)" }}>differently</em>
              </h2>
              <p className="text-lg leading-relaxed mb-4" style={secondary}>
                {diff.problem}
              </p>
              <p className="text-lg leading-relaxed font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
                {diff.approach}
              </p>
              <p className="font-semibold mb-3">{diff.lead}</p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-6">
                {diff.points.map((p) => (
                  <li key={p} className="flex gap-3 rounded-xl p-4 leading-relaxed" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                    <Dot />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg leading-relaxed" style={secondary}>
                {diff.close}
              </p>

              {feature.compare ? (
                <div id="vs-jasper" className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">How it compares to Jasper</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl p-5" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-accent-hover)" }}>
                        Draftly
                      </p>
                      <p style={{ color: "var(--color-text-primary)" }}>{feature.compare.draftly}</p>
                    </div>
                    <div className="rounded-2xl p-5" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                      <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                        Jasper
                      </p>
                      <p style={secondary}>{feature.compare.jasper}</p>
                    </div>
                  </div>
                  <p className="text-sm mt-3" style={muted}>
                    {compareBasis(feature.compare)} More in <A href="/jasper-vs-draftly">Jasper vs Draftly</A>.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* 3. Where it fits in the Draftly flow */}
        <section id="where-it-fits" aria-labelledby="fits-heading" className="py-20 sm:py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div className="container-draftly max-w-4xl">
            <div className="text-center mb-10">
              <p className="inline-block font-mono text-xs uppercase tracking-[0.14em] rounded-md px-2.5 py-1 mb-4" style={{ background: tint.soft }}>
                Where it fits
              </p>
              <h2 id="fits-heading" className="text-3xl sm:text-4xl font-medium" style={h2Style}>
                One step in getting a post published
              </h2>
            </div>
            <ol className="space-y-3">
              {CATEGORIES.map((c, i) => {
                const here = c.id === feature.category;
                const t = TINTS[c.id];
                return (
                  <li
                    key={c.id}
                    aria-current={here ? "step" : undefined}
                    className="rounded-2xl px-5 py-4 sm:px-7 sm:py-5 grid sm:grid-cols-[minmax(0,15rem)_1fr] gap-x-6 gap-y-1 items-baseline"
                    style={{ background: t.bg, border: here ? "2px solid #111" : `1px solid ${t.grid}`, boxShadow: here ? `6px 6px 0 ${t.fill}` : undefined }}
                  >
                    <p className="font-semibold text-lg" style={{ letterSpacing: "-0.02em" }}>
                      <span className="font-mono text-sm mr-2" style={{ color: "#555" }}>
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {c.name}
                      {here ? (
                        <span className="ml-3 align-middle inline-block text-[11px] font-mono uppercase tracking-[0.1em] rounded-full px-2 py-0.5" style={{ background: "#111", color: "#fff" }}>
                          This feature
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#3a3a3a" }}>
                      {c.blurb}{" "}
                      {featuresIn(c.id).map((f, j, all) => (
                        <span key={f.slug}>
                          {f.slug === feature.slug ? (
                            <strong style={{ color: "#111" }}>{f.name}</strong>
                          ) : (
                            <a href={featurePath(f)} className="underline underline-offset-2" style={{ color: "#111" }}>
                              {f.name}
                            </a>
                          )}
                          {j < all.length - 1 ? ", " : "."}
                        </span>
                      ))}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* 4. How it works: numbered blocks, text and graphic alternating */}
        <section id="how-it-works" aria-label="How it works" className="pb-8 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div className="container-draftly max-w-6xl space-y-20 sm:space-y-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="min-w-0">
                <NumberChip n={1} bg={tint.soft} />
                <h2 className="text-3xl sm:text-4xl font-medium mb-5" style={h2Style}>
                  How it works
                </h2>
                {introRest.map((p) => (
                  <p key={p.slice(0, 24)} className="text-lg leading-relaxed mb-4" style={secondary}>
                    {p}
                  </p>
                ))}
                <ol className="space-y-4 mt-6">
                  {feature.steps.map((st, i) => (
                    <li key={st.title} className="flex gap-4">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold tabular-nums" style={{ background: tint.soft, border: "1.5px solid #111" }} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed" style={secondary}>
                        <strong style={{ color: "var(--color-text-primary)" }}>{st.title}</strong>
                        <span className="block mt-1">{st.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="min-w-0 graph-paper rounded-2xl p-4 sm:p-7" style={{ ...tintVars(feature.category), border: `1px solid ${tint.grid}` }}>
                {feature.shot ? (
                  <ProductFigure shot={feature.shot} />
                ) : (
                  <div className="rounded-xl p-4 sm:p-6" style={{ background: tint.bg, border: `1px solid ${tint.grid}` }}>
                    <FeatureArt name={isArtName(feature.slug) ? feature.slug : "writing-rules"} className="max-w-[440px] mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="min-w-0 lg:order-2">
                <NumberChip n={2} bg={tint.soft} />
                <h2 id="plans" className="text-3xl sm:text-4xl font-medium mb-5 scroll-mt-24" style={h2Style}>
                  Which plans include it
                </h2>
                <p className="text-lg leading-relaxed mb-4" style={secondary}>
                  {feature.plans}
                </p>
                <p className="leading-relaxed mb-8" style={secondary}>
                  Prices and credits for each plan are on the <A href="/pricing">pricing page</A>.
                </p>
                <h3 id="limits" className="text-xl font-semibold mb-3 scroll-mt-24">
                  What it doesn&apos;t do
                </h3>
                <ul className="space-y-2 leading-relaxed" style={secondary}>
                  {feature.limits.map((l) => (
                    <li key={l} className="flex gap-3">
                      <Dot />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
                {feature.guide && !(guide && guideThumb) ? (
                  <p className="leading-relaxed mt-6" style={secondary}>
                    Read the full <A href={feature.guide.href}>{feature.guide.label}</A>.
                  </p>
                ) : null}
                {feature.tool ? (
                  <p className="leading-relaxed mt-6" style={secondary}>
                    Try part of it without signing up: the <A href={feature.tool.href}>{feature.tool.label}</A>.
                  </p>
                ) : null}
              </div>
              <div className="min-w-0 lg:order-1">
                {guide && guideThumb ? (
                  <div className="graph-paper rounded-2xl p-4 sm:p-7" style={{ ...tintVars(feature.category), border: `1px solid ${tint.grid}` }}>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] mb-3" style={{ color: "#333" }}>
                      Go further
                    </p>
                    <ThumbCard href={guide.href} tag="Guide" title={guide.title} blurb={guide.blurb} image={guideThumb} cta={`Read the ${feature.guide!.label}`} titleClass="text-lg" sizes="(min-width: 1024px) 480px, 100vw" />
                  </div>
                ) : (
                  <div className="rounded-2xl p-6 sm:p-8" style={{ background: tint.bg, border: `1px solid ${tint.grid}` }}>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] mb-3" style={{ color: "#333" }}>
                      Your first post
                    </p>
                    <p className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.02em" }}>
                      Try it on your own site
                    </p>
                    <p className="leading-relaxed mb-6" style={{ color: "#3a3a3a" }}>
                      Paste your URL and Draftly writes a post in your brand&apos;s voice. The first one is free, with no credit card.
                    </p>
                    <a href={registerUrl} className="btn btn-primary">
                      {s.heroCtaText} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
          <div className="container-draftly max-w-6xl">
            <FaqList faqs={feature.faqs} />
          </div>
        </section>

        {/* 5. Related features */}
        {related.length ? (
          <section data-toc-skip aria-labelledby="related-heading" className="py-20 sm:py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
            <div className="container-draftly max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <h2 id="related-heading" className="text-3xl font-medium" style={h2Style}>
                  Related features
                </h2>
                <a href={FEATURES_HUB.path} className="font-semibold text-sm inline-flex items-center gap-1.5" style={{ color: "var(--color-accent-hover)" }}>
                  Explore all {FEATURES.length} features <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((f) => (
                  <li key={f.slug}>
                    <FeatureTile feature={f} compact />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* 6. Closing statement, then the standard footer CTA */}
        <section className="py-16 sm:py-20 px-4" style={{ background: "#111", color: "#fff" }}>
          <div className="container-draftly max-w-4xl text-center">
            <h2 className="font-medium mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", ...h2Style }}>
              From topic to <em className="italic" style={{ color: "#ffce59" }}>published post</em>
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: "#bbb" }}>
              Every feature is one step from a topic to a post on your blog, written in your brand&apos;s voice.
            </p>
            <a href={FEATURES_HUB.path} className="inline-flex items-center gap-2 font-semibold" style={{ color: "#fff" }}>
              See how the features fit together <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </section>
        <CtaBand
          tone="accent"
          heading={<>Your first post <em className="italic" style={{ color: "var(--color-accent)" }}>is on us</em></>}
          body="Paste your URL, read the draft, then decide."
          secondary={{ href: FEATURES_HUB.path, label: "See all features" }}
        />
      </main>
      <Footer />
    </>
  );
}
