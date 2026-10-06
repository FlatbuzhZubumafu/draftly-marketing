import type { Metadata } from "next";
import { getPosts } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const revalidate = 60;

const DESCRIPTION =
  "Notes from building Draftly on AI writing, SEO and AEO, and getting content cited by AI search.";

export const metadata: Metadata = {
  title: { absolute: "The Draftly Blog: AI Content and SEO Notes" },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: "The Draftly Blog", description: DESCRIPTION, type: "website", url: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
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
                      className="w-full h-56 object-cover rounded-xl mb-4"
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
        </div>
      </main>
      <Footer />
    </>
  );
}
