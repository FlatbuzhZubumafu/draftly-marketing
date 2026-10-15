import type { Metadata } from "next";
import { LOGO_URL, SITE_URL } from "@/lib/site";
import { plainExcerpt } from "@/lib/text";
import { getPost, getPosts } from "@/lib/graphql";
import { sanitizeHtml, tidyPostHtml } from "@/lib/sanitize";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import { KeepReading } from "@/components/KeepReading";
import { OnThisPage } from "@/components/OnThisPage";
import { NOINDEX_POST_SLUGS } from "@/lib/related";
import { PostByline, postAuthorJsonLd } from "@/components/PostByline";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SignupCta } from "@/components/SignupCta";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

const TITLE_SUFFIX = " | Draftly";
const MAX_TITLE = 60;

/**
 * Keeps the <title> within 60 characters: "Post Title | Draftly" when it fits, the
 * bare post title when only that fits, and otherwise the title cut at a word.
 */
function seoTitle(rawTitle: string): Metadata["title"] {
  const title = plainExcerpt(rawTitle, 1000).replace(/\.$/, "");
  if (title.length + TITLE_SUFFIX.length <= MAX_TITLE) return title;
  if (title.length <= MAX_TITLE) return { absolute: title };
  const cut = title.slice(0, MAX_TITLE + 1);
  return { absolute: cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const description = plainExcerpt(post.excerpt);
  // The featured image from WordPress, or a generated title card when there is none.
  const featured = post.featuredImage?.node;
  const shareImage = featured?.sourceUrl
    ? { url: featured.sourceUrl, alt: featured.altText || plainExcerpt(post.title, 1000) }
    : { url: `/og/blog/${slug}`, width: 1200, height: 630, alt: plainExcerpt(post.title, 1000) };
  return {
    title: seoTitle(post.title),
    description,
    alternates: { canonical: `/blog/${slug}` },
    ...(NOINDEX_POST_SLUGS.has(slug) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: post.title, description, images: [shareImage] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const url = `https://www.draftly.blog/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: plainExcerpt(post.title, 110),
        description: plainExcerpt(post.excerpt),
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.modified || post.date,
        image: post.featuredImage?.node?.sourceUrl ?? `${SITE_URL}/og/blog/${slug}`,
        author: postAuthorJsonLd(post.author?.node?.name),
        // Resolves to the Organization node (with logo) that the root layout renders.
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Draftly", url: SITE_URL, logo: LOGO_URL },
        isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blog#blog` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.draftly.blog" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.draftly.blog/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <main className="pt-16 min-h-screen bg-white">
        <div className="mx-auto px-4 py-20 max-w-2xl lg:max-w-[61.5rem] lg:grid lg:grid-cols-[minmax(0,42rem)_14rem] lg:gap-14">
        <article data-toc-root className="min-w-0">
          <a href="/blog" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block">
            ← Back to blog
          </a>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
            {post.title}
          </h1>
          <PostByline authorName={post.author?.node?.name} published={post.date} modified={post.modified} />
          {post.featuredImage?.node?.sourceUrl && (
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full h-auto aspect-video object-cover rounded-xl mb-8"
            />
          )}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tidyPostHtml(sanitizeHtml(post.content), post.title) }}
          />
          <SignupCta className="mt-16" />
          <NewsletterSignup location="blog_post" className="mt-16" />
          <KeepReading
            topic={`${post.title} ${post.excerpt}`}
            guideTopic={`${post.title} ${post.content.replace(/<[^>]*>/g, " ")}`}
            exclude={`/blog/${post.slug}`}
            guideCount={1}
            postCount={2}
          />
        </article>
        <OnThisPage />
        </div>
      </main>
      <Footer />
    </>
  );
}
