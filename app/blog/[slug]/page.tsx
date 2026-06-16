import { getPost, getPosts } from "@/lib/graphql";
import { sanitizeHtml } from "@/lib/sanitize";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Header />
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
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
