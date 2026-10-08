import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { getPost, getPosts } from "@/lib/graphql";
import { sanitizeHtml, tidyPostHtml } from "@/lib/sanitize";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function plainExcerpt(html: string | undefined, max = 160): string {
  const text = (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\[(?:&hellip;|&#8230;|…)\]|&hellip;|&#8230;/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
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
  const image = post.featuredImage?.node?.sourceUrl;
  return {
    title: seoTitle(post.title),
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post.author?.node?.name ? [post.author.node.name] : undefined,
      images: image ? [image] : [DEFAULT_OG_IMAGE],
    },
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
        headline: post.title,
        description: plainExcerpt(post.excerpt),
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.modified || post.date,
        image: post.featuredImage?.node?.sourceUrl,
        author: post.author?.node?.name ? { "@type": "Person", name: post.author.node.name } : undefined,
        publisher: { "@type": "Organization", name: "Draftly", url: "https://www.draftly.blog" },
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
        <article className="max-w-2xl mx-auto px-4 py-20">
          <a href="/blog" className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block">
            ← Back to blog
          </a>
          <p className="text-xs text-gray-400 mb-2">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          {post.featuredImage?.node?.sourceUrl && (
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              className="w-full h-72 object-cover rounded-xl mb-8"
            />
          )}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tidyPostHtml(sanitizeHtml(post.content), post.title) }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
