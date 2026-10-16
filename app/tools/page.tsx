import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { FREE_TOOLS, TOOLS_HUB } from "@/lib/free-tools";
import { jsonLdHtml } from "@/lib/schema";
import { APP_URL, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Hub for the free tools. Targets "free seo tools" (9,500/mo US, KD 44) as a
// stretch, and links each tool page so they share authority.
export const metadata: Metadata = {
  title: { absolute: TOOLS_HUB.title },
  description: TOOLS_HUB.description,
  alternates: { canonical: TOOLS_HUB.path },
  openGraph: { title: TOOLS_HUB.title, description: TOOLS_HUB.description, type: "website", url: `${SITE_URL}${TOOLS_HUB.path}` },
};

const FAQS: Faq[] = [
  {
    q: "Are these SEO tools really free?",
    a: "Yes, with no sign-up. To keep them fast for everyone, each visitor can run a few checks a minute and about 30 an hour. The two AI generators cost us a little per run, so they allow about 10 runs an hour and 20 a day.",
  },
  {
    q: "Do you store the URLs I check?",
    a: "No. We fetch the pages, build your report and drop both. Anonymous usage analytics record which tool was used, never the URL or what you typed.",
  },
  {
    q: "Do these tools use AI?",
    a: "The four checkers and the FAQ schema generator don't. Every check is a fixed rule run on your live pages, so the same page gets the same result each time, and the FAQ schema generator only formats what you type. The content brief and blog ideas generators do: an AI model (GPT 6 Luna) writes from what you enter, so read the results with your own judgment.",
  },
  {
    q: "Which tool should I start with?",
    a: "Start with the AI visibility checker on your homepage. If AI and search bots can read the site, run the blog SEO checker and E-E-A-T checker on your best post, then the content refresh checker on the whole blog. When you're ready for new posts, get ideas from the blog ideas generator and plan each one with the content brief generator.",
  },
];

export default function ToolsHub() {
  const jsonLd = jsonLdHtml(
    {
      "@type": "CollectionPage",
      name: TOOLS_HUB.title,
      description: TOOLS_HUB.description,
      url: `${SITE_URL}${TOOLS_HUB.path}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: FREE_TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${SITE_URL}${t.path}` })),
      },
    },
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-4xl">
          <header className="max-w-3xl">
            <p className="eyebrow mb-4">Free SEO tools</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 64px)" }}>
              Free tools for{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                your blog
              </em>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Free tools for small-business blogs. Find out if AI assistants can read your site, score one post for SEO, find old posts to refresh, test a post for author trust signals and build FAQ schema. Then get post ideas for your site and a content brief for each one. No sign-up, and nothing you enter is stored.
            </p>
          </header>

          <ul className="mt-12 grid sm:grid-cols-2 gap-5">
            {FREE_TOOLS.map((t) => (
              <li key={t.path}>
                <a href={t.path} className="block h-full rounded-2xl p-6 card-depth" style={{ color: "var(--color-text-primary)" }}>
                  <span className="eyebrow">{t.eyebrow}</span>
                  <span className="block text-xl font-semibold mt-3">
                    {t.h1} {t.h1Accent}
                  </span>
                  <span className="block text-sm mt-2 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {t.description}
                  </span>
                  <span className="block text-sm font-semibold mt-4" style={{ color: "var(--color-accent)" }}>
                    {t.input.button}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-5" style={{ letterSpacing: "-0.03em" }}>
              What to do with the results
            </h2>
            <div className="space-y-4 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Fix the failures first. Each one comes with the reason it matters and the steps to fix it. Most take a few minutes in your CMS or SEO plugin.
              </p>
              <p>
                If the checks show your blog has gone quiet or your posts are thin, that&apos;s the part Draftly does. It writes SEO-ready posts in your brand&apos;s voice and publishes them to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.{" "}
                <a href={`${APP_URL}/register`} style={{ color: "var(--color-accent)" }}>
                  Your first post is free
                </a>
                .
              </p>
            </div>
          </section>

          <SignupCta
            className="mt-16 max-w-3xl"
            heading="Next step: a fresh post for your blog"
            body="Your blog needs fresh posts that answer real questions. Paste your URL and Draftly writes one in your brand's voice, with the meta title, description and slug filled in."
          />

          <FaqList faqs={FAQS} />
          <KeepReading exclude={TOOLS_HUB.path} topic="seo ai search blog posts aeo" />
        </div>
      </main>
      <Footer />
    </>
  );
}
