import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, FaqList, Section, faqJsonLd } from "@/components/ArticleParts";
import { FeatureCard, FeatureIcon } from "@/components/FeatureIcon";
import { ProductFigure } from "@/components/ProductFigure";
import { SignupCta } from "@/components/SignupCta";
import { CATEGORIES, FEATURES, FEATURES_HUB, compareBasis, featurePath, getFeature } from "@/lib/features";
import { imageObjectJsonLd } from "@/lib/product-shots";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { pageImages } from "@/lib/og";

export const revalidate = 3600;
export const dynamicParams = false;

// One page per feature in lib/features.ts.
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

export default async function FeaturePage({ params }: Props) {
  const feature = getFeature((await params).slug);
  if (!feature) notFound();

  const path = featurePath(feature);
  const category = CATEGORIES.find((c) => c.id === feature.category);
  const related = feature.related.map(getFeature).filter((f) => f !== undefined);

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
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-5xl">
          <header className="max-w-3xl">
            <p className="text-sm mb-6" style={muted}>
              <a href={FEATURES_HUB.path} className="underline" style={{ color: "inherit" }}>
                Features
              </a>{" "}
              / {category?.name} / {feature.name}
            </p>
            <div className="flex items-center gap-3 mb-5">
              <FeatureIcon icon={feature.icon} size="lg" />
              <span className="eyebrow">{feature.name}</span>
            </div>
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              {feature.h1.lead}{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                {feature.h1.accent}
              </em>
            </h1>
            {feature.intro.map((p) => (
              <p key={p.slice(0, 24)} className="text-lg leading-relaxed mb-4" style={secondary}>
                {p}
              </p>
            ))}
          </header>

          {feature.shot ? <ProductFigure shot={feature.shot} className="max-w-3xl mt-10" /> : null}

          <Section id="how-it-works" title="How it works">
            <ol className="space-y-5">
              {feature.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold tabular-nums"
                    style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <B>{s.title}</B>
                    <span className="block mt-1">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="plans" title="Which plans include it">
            <p>{feature.plans}</p>
            <p>
              Prices and credits for each plan are on the <A href="/pricing">pricing page</A>.
            </p>
          </Section>

          {feature.compare ? (
            <Section id="vs-jasper" title="How it compares to Jasper">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
                    Draftly
                  </p>
                  <p style={{ color: "var(--color-text-primary)" }}>{feature.compare.draftly}</p>
                </div>
                <div className="rounded-2xl p-5" style={{ border: "1px solid var(--color-border)" }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
                    Jasper
                  </p>
                  <p>{feature.compare.jasper}</p>
                </div>
              </div>
              <p className="text-sm" style={muted}>
                {compareBasis(feature.compare)} More in <A href="/jasper-vs-draftly">Jasper vs Draftly</A>.
              </p>
            </Section>
          ) : null}

          <Section id="limits" title="What it doesn't do">
            <Bullets items={feature.limits} />
          </Section>

          {feature.guide || feature.tool ? (
            <Section id="more" title="Go further">
              {feature.guide ? (
                <p>
                  Read the full <A href={feature.guide.href}>{feature.guide.label}</A>.
                </p>
              ) : null}
              {feature.tool ? (
                <p>
                  Try part of it without signing up: the <A href={feature.tool.href}>{feature.tool.label}</A>.
                </p>
              ) : null}
            </Section>
          ) : null}

          <SignupCta className="mt-16 max-w-3xl" />

          <FaqList faqs={feature.faqs} />

          {related.length ? (
            <section data-toc-skip className="mt-20">
              <h2 className="text-2xl font-medium mb-6" style={{ letterSpacing: "-0.02em" }}>
                Related features
              </h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((f) => (
                  <li key={f.slug}>
                    <FeatureCard feature={f} href={featurePath(f)} />
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                <A href={FEATURES_HUB.path}>See all {FEATURES.length} features</A>
              </p>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
