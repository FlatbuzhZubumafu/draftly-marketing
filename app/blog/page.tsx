import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import { getPosts } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NOINDEX_POST_SLUGS, PILLARS } from "@/lib/related";
import { RelatedLinks } from "@/components/RelatedLinks";
import { jsonLdHtml } from "@/lib/schema";

export const revalidate = 60;

const DESCRIPTION =
  "Notes from building Draftly, an AI blog writer for small businesses: AI writing, SEO and AEO, and how to get your content cited by AI search.";

export const metadata: Metadata = {
  title: { absolute: "The Draftly Blog: AI Content and SEO Notes" },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: "The Draftly Blog", description: DESCRIPTION, type: "website", url: "/blog", images: [DEFAULT_OG_IMAGE] },
};

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
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.modified || p.date,
    })),
  };
  const listJsonLd = {
    "@type": "ItemList",
    name: "Draftly blog posts",
    itemListElement: indexed.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/blog/${p.slug}` })),
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(blogJsonLd, listJsonLd) }} />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-12">Blog</h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="border-b border-gray-100 pb-8">
                {post.featuredImage?.node?.sourceUrl && (
                  <a href={`/blog/${post.slug}`}>
                    <img
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      className="w-full h-auto aspect-video object-cover rounded-xl mb-4"
                    />
                  </a>
                )}
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  <a href={`/blog/${post.slug}`} className="hover:text-draftly-accent transition-colors">
                    {post.title}
                  </a>
                </h2>
                <div
                  className="text-gray-500 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </article>
            ))}
          </div>
          <RelatedLinks items={PILLARS.slice(0, 4)} heading="Guides from the Draftly team" />
        </div>
      </main>
      <Footer />
    </>
  );
}
