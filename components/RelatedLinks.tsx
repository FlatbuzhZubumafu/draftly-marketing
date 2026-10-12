import type { Pillar } from "@/lib/related";
import { guideTag } from "@/lib/related";
import { GUIDE_THUMBS } from "@/lib/product-shots";
import { ThumbCard } from "@/components/ThumbCard";

/** Thumbnail cards linking to guide pages. Left out of the On-this-page list. */
export function RelatedLinks({ items, heading = "Keep reading", className = "mt-16" }: { items: Pillar[]; heading?: string; className?: string }) {
  return (
    <section data-toc-skip aria-labelledby="related-heading" className={className}>
      <h2 id="related-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((p) => (
          <li key={p.href}>
            <ThumbCard href={p.href} tag={guideTag(p.href)} title={p.title} blurb={p.blurb} image={GUIDE_THUMBS[p.href]} sizes="(min-width: 640px) 400px, 100vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
