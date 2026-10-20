import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { FeatureCard } from "@/components/FeatureIcon";
import { SignupCta } from "@/components/SignupCta";
import { KeepReading } from "@/components/KeepReading";
import { CATEGORIES, FEATURES, FEATURES_HUB, featurePath, featuresIn } from "@/lib/features";
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
];

export default function FeaturesHub() {
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
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-5xl">
          <header className="max-w-3xl">
            <p className="eyebrow mb-4">Features</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 64px)" }}>
              Everything Draftly does,{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                one page each
              </em>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Draftly finds topics for your blog, writes them in your brand&apos;s voice, checks every draft and publishes it. Pick a feature to see how it works, what it costs and what it doesn&apos;t do.
            </p>
          </header>

          <nav aria-label="Feature groups" className="mt-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="text-sm font-medium rounded-full px-4 py-2" style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}>
                {c.name}
              </a>
            ))}
          </nav>

          {CATEGORIES.map((c) => {
            const items = featuresIn(c.id);
            if (!items.length) return null;
            return (
              <section key={c.id} id={c.id} className="mt-16 scroll-mt-28">
                <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
                  {c.name}
                </h2>
                <p className="mt-2 mb-6" style={{ color: "var(--color-text-secondary)" }}>
                  {c.blurb}
                </p>
                <ul className={`grid sm:grid-cols-2 gap-5 ${items.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
                  {items.map((f) => (
                    <li key={f.slug}>
                      <FeatureCard feature={f} href={featurePath(f)} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-5" style={{ letterSpacing: "-0.03em" }}>
              Draftly or Jasper?
            </h2>
            <div className="space-y-4 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Jasper covers ads, emails and social posts for marketing teams, in more than 30 languages. Draftly does one job: blog posts for small businesses, from the topic to the published post, at one price for the whole team.
              </p>
              <p>
                Each feature page has a short comparison with the Jasper tool closest to it, from Jasper&apos;s own pages or our own test of its app. The full write-up, with four real businesses, is <A href="/jasper-vs-draftly">Jasper vs Draftly</A>.
              </p>
            </div>
          </section>

          <SignupCta className="mt-16 max-w-3xl" heading="Try it on your own site" />

          <FaqList faqs={FAQS} />
          <KeepReading exclude={FEATURES_HUB.path} guides={["/ai-copywriter", "/pricing"]} topic="ai blog writer features brand voice publishing" />
        </div>
      </main>
      <Footer />
    </>
  );
}
