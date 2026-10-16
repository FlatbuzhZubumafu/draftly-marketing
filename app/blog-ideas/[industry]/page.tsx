import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Byline, FaqList, Section, faqJsonLd } from "@/components/ArticleParts";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { ProductFigure } from "@/components/ProductFigure";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import { INDUSTRIES, INDUSTRIES_DATE, INDUSTRIES_HUB, INDUSTRY_PHOTOS, getIndustry, industryPath, topicCount, type IndustryPhoto, type Source } from "@/lib/industries";
import { StockPhoto } from "../StockPhoto";

export const revalidate = 3600;
export const dynamicParams = false;

// One page per industry in lib/industries.ts, which holds the copy, the keyword
// targets and the sources for each industry's rules.
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

type Props = { params: Promise<{ industry: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = getIndustry((await params).industry);
  if (!industry) return {};
  const path = industryPath(industry);
  return {
    title: { absolute: industry.title },
    description: industry.description,
    alternates: { canonical: path },
    openGraph: { title: industry.title, description: industry.description, type: "article", url: `${SITE_URL}${path}` },
    twitter: { card: "summary_large_image", title: industry.title, description: industry.description },
  };
}

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };

function photoJsonLd(p: IndustryPhoto) {
  return { "@type": "ImageObject", contentUrl: `${SITE_URL}${p.src}`, width: p.width, height: p.height, description: p.alt, creditText: `${p.credit.name} on Unsplash`, acquireLicensePage: "https://unsplash.com/license" };
}

function SourceLinks({ items }: { items?: Source[] }) {
  if (!items?.length) return null;
  return (
    <span className="block mt-1 text-sm" style={muted}>
      Source:{" "}
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 ? ", " : ""}
          <a href={s.href} rel="nofollow noopener" target="_blank" className="underline">
            {s.label}
          </a>
        </span>
      ))}
    </span>
  );
}

export default async function IndustryPage({ params }: Props) {
  const industry = getIndustry((await params).industry);
  if (!industry) notFound();

  const path = industryPath(industry);
  const shot = GUIDE_SHOTS[industry.shot];
  const count = topicCount(industry);
  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug);
  const photos = INDUSTRY_PHOTOS[industry.slug];

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: industry.title,
      description: industry.description,
      url: `${SITE_URL}${path}`,
      datePublished: INDUSTRIES_DATE.iso,
      dateModified: INDUSTRIES_DATE.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
      image: [imageObjectJsonLd(shot), ...(photos ? [photos.hero, ...Object.values(photos.groups), photos.rules].map(photoJsonLd) : [])],
      citation: industry.rules.flatMap((r) => r.sources ?? []).map((s) => s.href),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Blog ideas by industry", item: `${SITE_URL}${INDUSTRIES_HUB.path}` },
        { "@type": "ListItem", position: 2, name: industry.name, item: `${SITE_URL}${path}` },
      ],
    },
    faqJsonLd(industry.faqs),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <TocLayout>
          <header className="max-w-3xl">
            <p className="text-sm mb-4" style={muted}>
              <a href={INDUSTRIES_HUB.path} className="underline" style={{ color: "inherit" }}>Blog ideas by industry</a> / {industry.name}
            </p>
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              {industry.h1.lead}{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                {industry.h1.accent}
              </em>
            </h1>
            {industry.intro.map((p) => (
              <p key={p.slice(0, 24)} className="text-lg leading-relaxed mb-4" style={secondary}>
                {p}
              </p>
            ))}
            <p className="leading-relaxed mb-4" style={secondary}>
              {count} topics in {industry.groups.length} groups, then the rules to check before you publish.
            </p>
            <Byline verb="Written" date={INDUSTRIES_DATE.label} />
          </header>

          {photos ? <StockPhoto photo={photos.hero} className="max-w-3xl mt-10" /> : null}

          {industry.groups.map((g) => (
            <Section key={g.id} id={g.id} title={g.heading}>
              <p>{g.intro}</p>
              {photos?.groups[g.id] ? <StockPhoto photo={photos.groups[g.id]} /> : null}
              <ol className="space-y-4">
                {g.topics.map((t) => (
                  <li key={t.title} className="pl-4" style={{ borderLeft: "2px solid var(--color-border-accent)" }}>
                    <B>{t.title}</B>
                    <span className="block mt-1">{t.note}</span>
                  </li>
                ))}
              </ol>
            </Section>
          ))}

          <Section id="rules" title={industry.rulesHeading}>
            <p>{industry.rulesIntro}</p>
            {photos ? <StockPhoto photo={photos.rules} /> : null}
            {industry.rules.map((r) => (
              <div key={r.heading}>
                <h3 className="text-xl font-medium mb-2" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                  {r.heading}
                </h3>
                <p>
                  {r.body}
                  <SourceLinks items={r.sources} />
                </p>
              </div>
            ))}
            <p className="text-sm" style={muted}>
              This is a summary for planning posts, checked {INDUSTRIES_DATE.label}. It isn&apos;t legal advice, and rules
              change, so confirm the current version at each source.
            </p>
          </Section>

          <Section id="with-draftly" title={`Writing ${industry.postNoun} posts with Draftly`}>
            {industry.draftly.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <ProductFigure shot={shot} className="mt-2" />
            <p>
              Before you write anything new, try the free <A href={industry.tool.href}>{industry.tool.name}</A>.{" "}
              {industry.tool.why} The rest of the free tools are on the <A href="/tools">tools page</A>.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta heading={industry.cta.heading} body={industry.cta.body} />
          </div>

          <section data-toc-skip className="max-w-3xl mt-16">
            <h2 className="text-2xl font-medium mb-4" style={{ letterSpacing: "-0.02em" }}>
              Blog ideas for other industries
            </h2>
            <ul className="space-y-2 leading-relaxed" style={secondary}>
              {others.map((i) => (
                <li key={i.slug}>
                  <A href={industryPath(i)}>{i.title}</A>
                </li>
              ))}
            </ul>
          </section>

          <div className="max-w-3xl">
            <KeepReading exclude={INDUSTRIES_HUB.path} guides={["/seo-copywriting", "/blog-writing-service"]} topic={industry.readingTopic} />
          </div>
          <FaqList faqs={industry.faqs} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
