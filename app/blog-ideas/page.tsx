import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { INDUSTRIES, INDUSTRIES_HUB, industryPath, topicCount } from "@/lib/industries";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Hub for the /blog-ideas/<industry> pages, so each one is a click from the
// blog hub and they share authority.
export const metadata: Metadata = {
  title: { absolute: INDUSTRIES_HUB.title },
  description: INDUSTRIES_HUB.description,
  alternates: { canonical: INDUSTRIES_HUB.path },
  openGraph: { title: INDUSTRIES_HUB.title, description: INDUSTRIES_HUB.description, type: "website", url: `${SITE_URL}${INDUSTRIES_HUB.path}` },
};

export default function BlogIdeasHub() {
  const jsonLd = jsonLdHtml({
    "@type": "CollectionPage",
    name: INDUSTRIES_HUB.title,
    description: INDUSTRIES_HUB.description,
    url: `${SITE_URL}${INDUSTRIES_HUB.path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: INDUSTRIES.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: i.title, url: `${SITE_URL}${industryPath(i)}` })),
    },
  });

  return (
    <>
      <Header />
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-4xl">
          <header className="max-w-3xl">
            <p className="eyebrow mb-4">Blog ideas</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 64px)" }}>
              Blog ideas{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                by industry
              </em>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Each page lists topics grouped by what the reader is going through, with a note on what makes each post
              worth writing. Each one also covers the rules that industry&apos;s posts have to follow, like fair housing
              wording for agents and bar advertising rules for lawyers.
            </p>
          </header>

          <ul className="mt-12 grid sm:grid-cols-2 gap-5">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <a href={industryPath(i)} className="block h-full rounded-2xl p-6 card-depth" style={{ color: "var(--color-text-primary)" }}>
                  <span className="eyebrow">{i.name}</span>
                  <span className="block text-xl font-semibold mt-3">{i.title}</span>
                  <span className="block text-sm mt-2 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {i.description}
                  </span>
                  <span className="block text-sm font-semibold mt-4" style={{ color: "var(--color-accent)" }}>
                    See {topicCount(i)} topics
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <SignupCta
            className="mt-16 max-w-3xl"
            heading="Turn one of these ideas into a post"
            body="Paste your URL and Draftly writes a full post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot."
          />

          <KeepReading exclude={INDUSTRIES_HUB.path} guides={["/seo-copywriting", "/ai-copywriter"]} topic="small business blog topics local service" />
        </div>
      </main>
      <Footer />
    </>
  );
}
