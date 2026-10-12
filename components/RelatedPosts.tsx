import { getPosts } from "@/lib/graphql";
import { NOINDEX_POST_SLUGS } from "@/lib/related";
import { plainExcerpt } from "@/lib/text";

/** The newest indexable posts. The footer lists these so every page links to them. */
export async function latestPosts(count: number) {
  return (await getPosts()).filter((p) => !NOINDEX_POST_SLUGS.has(p.slug)).slice(0, count);
}

const STOPWORDS = new Set(["about", "after", "their", "there", "these", "this", "that", "with", "from", "your", "what", "when", "which", "while", "into", "than", "then", "them", "they", "will", "have", "does", "draftly"]);

const words = (text: string) => new Set(text.toLowerCase().match(/[a-z0-9]{4,}/g)?.filter((w) => !STOPWORDS.has(w)) ?? []);

/**
 * Blog posts that share the most words with `topic`, newest first on ties. Gives
 * each post contextual links from the guides, not just from /blog and the footer.
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
  const wanted = words(topic);
  const posts = (await getPosts())
    .filter((p) => p.slug !== exclude && !NOINDEX_POST_SLUGS.has(p.slug))
    .map((p, i) => {
      const have = words(`${plainExcerpt(p.title, 1000)} ${plainExcerpt(p.excerpt, 1000)}`);
      return { p, i, score: [...wanted].filter((w) => have.has(w)).length };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, count)
    .map(({ p }) => p);
  if (posts.length === 0) return null;

  return (
    <section data-toc-skip aria-labelledby="related-posts-heading" className={className}>
      <h2 id="related-posts-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={`/blog/${p.slug}`}
              className="block h-full rounded-xl p-5 transition-colors"
              style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
            >
              <span className="block font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {plainExcerpt(p.title, 1000)}
              </span>
              <span className="block mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {plainExcerpt(p.excerpt, 140)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
