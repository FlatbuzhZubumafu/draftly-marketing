import { getPosts, type WPPost } from "@/lib/graphql";
import { NOINDEX_POST_SLUGS } from "@/lib/related";
import { plainExcerpt } from "@/lib/text";
import { ThumbCard, type CardImage } from "@/components/ThumbCard";

/** The newest indexable posts. */
export async function latestPosts(count: number) {
  return (await getPosts()).filter((p) => !NOINDEX_POST_SLUGS.has(p.slug)).slice(0, count);
}

const STOPWORDS = new Set(["about", "after", "their", "there", "these", "this", "that", "with", "from", "your", "what", "when", "which", "while", "into", "than", "then", "them", "they", "will", "have", "does", "draftly"]);

const words = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9]{4,}/g)?.filter((w) => !STOPWORDS.has(w)) ?? []);

/** Indexable posts that share the most words with `topic`, newest first on ties. */
export async function pickRelatedPosts(topic: string, exclude?: string, count = 2): Promise<WPPost[]> {
  const wanted = words(topic);
  return (await getPosts())
    .filter((p) => p.slug !== exclude && !NOINDEX_POST_SLUGS.has(p.slug))
    .map((p, i) => {
      const have = words(`${plainExcerpt(p.title, 1000)} ${plainExcerpt(p.excerpt, 1000)}`);
      return { p, i, score: [...wanted].filter((w) => have.has(w)).length };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p);
}

/** A post's card thumbnail: its WordPress featured image, or the generated share image. */
export function postImage(p: WPPost): CardImage {
  const title = plainExcerpt(p.title, 1000);
  const img = p.featuredImage?.node;
  return img?.sourceUrl ? { src: img.sourceUrl, alt: img.altText || title } : { src: `/og/blog/${p.slug}`, alt: title };
}

/**
 * Blog posts related to `topic`, as thumbnail cards. Pages now use <KeepReading>,
 * which mixes guides and posts in one row; this stays for pages that still call it.
 */
export async function RelatedPosts({
  topic,
  exclude,
  count = 2,
  heading = "From the blog",
  className = "mt-12",
}: {
  topic: string;
  exclude?: string;
  count?: number;
  heading?: string;
  className?: string;
}) {
  const posts = await pickRelatedPosts(topic, exclude, count);
  if (posts.length === 0) return null;

  return (
    <section data-toc-skip aria-labelledby="related-posts-heading" className={className}>
      <h2 id="related-posts-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {posts.map((p) => (
          <li key={p.slug}>
            <ThumbCard href={`/blog/${p.slug}`} tag="Blog post" title={plainExcerpt(p.title, 1000)} blurb={plainExcerpt(p.excerpt, 140)} image={postImage(p)} sizes="(min-width: 640px) 400px, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
