import { GUIDES, guideTag, relatedPillars, type Pillar } from "@/lib/related";
import { GUIDE_THUMBS } from "@/lib/product-shots";
import { plainExcerpt } from "@/lib/text";
import { ThumbCard } from "@/components/ThumbCard";
import { pickRelatedPosts, postImage } from "@/components/RelatedPosts";

/**
 * One "Keep reading" row: three thumbnail cards mixing guide pages and blog posts,
 * never the current page. `guides` picks the guides by hand; otherwise they are
 * scored against `topic`, the same way the posts are.
 */
export async function KeepReading({
  topic,
  guideTopic,
  exclude,
  guides,
  guideCount = 2,
  postCount = 1,
  heading = "Keep reading",
  className = "mt-16",
}: {
  topic: string;
  /** Text to score guides against when it should differ from `topic` (e.g. a post's full body). */
  guideTopic?: string;
  /** The current page: a guide path such as "/mcp", or "/blog/<slug>" on a post. */
  exclude?: string;
  guides?: string[];
  guideCount?: number;
  postCount?: number;
  heading?: string;
  className?: string;
}) {
  const guideItems: Pillar[] = guides
    ? guides.map((href) => GUIDES.find((g) => g.href === href)).filter((g): g is Pillar => !!g && g.href !== exclude)
    : relatedPillars(guideTopic ?? topic, exclude, guideCount, GUIDES);
  const excludeSlug = exclude?.startsWith("/blog/") ? exclude.slice("/blog/".length) : undefined;
  const posts = await pickRelatedPosts(topic, excludeSlug, postCount);

  const cards = [
    ...guideItems.slice(0, guides ? undefined : guideCount).map((g) => ({
      href: g.href, tag: guideTag(g.href), title: g.title, blurb: g.blurb, image: GUIDE_THUMBS[g.href] ?? null,
    })),
    ...posts.map((p) => ({
      href: `/blog/${p.slug}`, tag: "Blog post", title: plainExcerpt(p.title, 1000), blurb: plainExcerpt(p.excerpt, 120), image: postImage(p),
    })),
  ];
  if (cards.length === 0) return null;

  return (
    <section data-toc-skip aria-labelledby="keep-reading-heading" className={className}>
      <h2 id="keep-reading-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c) => (
          <li key={c.href}>
            <ThumbCard {...c} sizes="(min-width: 768px) 260px, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
