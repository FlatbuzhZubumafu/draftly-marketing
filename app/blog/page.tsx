import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GUIDES, NOINDEX_POST_SLUGS, guideTag } from "@/lib/related";
import { GUIDE_THUMBS } from "@/lib/product-shots";
import { pageImages } from "@/lib/og";
import { plainExcerpt } from "@/lib/text";
import { jsonLdHtml } from "@/lib/schema";
import { ThumbCard } from "@/components/ThumbCard";
import { postImage } from "@/components/RelatedPosts";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SignupCta } from "@/components/SignupCta";

export const revalidate = 60;

// The hub for everything written on the site: every guide page, then every
// WordPress post, newest first. The footer links here as "Guides" and "Blog".
const TITLE = "Draftly Guides and Blog: AI Writing and SEO";
const DESCRIPTION =
  "Guides and posts from Draftly on AI writing, SEO copywriting, AEO and getting cited by AI search, plus our AI model benchmark and tool comparisons.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/feed.xml" } },
  ...pageImages("/blog", { title: TITLE, description: DESCRIPTION, url: "/blog", type: "website" }),
};

const dateLabel = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function BlogPage() {
  const posts = await getPosts();
  const indexed = posts.filter((p) => !NOINDEX_POST_SLUGS.has(p.slug));

  const blogJsonLd = {
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    name: "The Draftly Blog",
    url: `${SITE_URL}/blog`,
    description: DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: indexed.map((p) => ({
      "@type": "BlogPosting",
      headline: plainExcerpt(p.title, 110),
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.modified || p.date,
      ...(p.featuredImage?.node?.sourceUrl ? { image: p.featuredImage.node.sourceUrl } : {}),
    })),
  };
  const collectionJsonLd = {
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog#page`,
    name: TITLE,
    url: `${SITE_URL}/blog`,
    description: DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      name: "Draftly guides and blog posts",
      itemListElement: [
        ...GUIDES.map((g) => ({ name: g.title, url: `${SITE_URL}${g.href}` })),
        ...indexed.map((p) => ({ name: plainExcerpt(p.title, 1000), url: `${SITE_URL}/blog/${p.slug}` })),
      ].map((item, i) => ({ "@type": "ListItem", position: i + 1, ...item })),
    },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(collectionJsonLd, blogJsonLd) }} />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <div className="container-draftly max-w-6xl">
          <header className="max-w-3xl">
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              Guides and Posts on AI Writing and SEO
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              What we learn building Draftly: how to write with AI so it sounds like you, rank in Google and get cited by AI search.
            </p>
          </header>

          <section id="guides" aria-labelledby="guides-heading" className="mt-14 scroll-mt-28">
            <h2 id="guides-heading" className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              Guides
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDES.map((g) => (
                <li key={g.href}>
                  <ThumbCard href={g.href} tag={guideTag(g.href)} title={g.title} blurb={g.blurb} image={GUIDE_THUMBS[g.href]} titleClass="text-lg" sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </section>

          <section id="posts" aria-labelledby="posts-heading" className="mt-20 scroll-mt-28">
            <h2 id="posts-heading" className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              Latest Posts
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...posts]
                .sort((a, b) => +new Date(b.date) - +new Date(a.date))
                .map((p) => (
                  <li key={p.id}>
                    <ThumbCard
                      href={`/blog/${p.slug}`}
                      tag={dateLabel(p.date)}
                      title={plainExcerpt(p.title, 1000)}
                      blurb={plainExcerpt(p.excerpt, 160)}
                      image={postImage(p)}
                      titleClass="text-lg"
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    />
                  </li>
                ))}
            </ul>
          </section>

          <SignupCta className="mt-20 max-w-3xl" />
          <NewsletterSignup location="blog_index" className="mt-12 max-w-3xl" />
        </div>
      </main>
      <Footer />
    </>
  );
}
