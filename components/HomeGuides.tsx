import Link from "next/link";
import { PILLARS } from "@/lib/related";
import { GUIDE_THUMBS } from "@/lib/product-shots";
import { ThumbCard } from "@/components/ThumbCard";

/** The three guides we most want read, shown blog-style. Every other guide is linked from the footer's Resources column. */
const FEATURED: { href: string; tag: string }[] = [
  { href: "/mcp", tag: "Guide" },
  { href: "/best-ai-for-writing", tag: "Benchmark" },
  { href: "/jasper-vs-draftly", tag: "Comparison" },
];

export function HomeGuides() {
  const cards = FEATURED.map((f) => ({ ...f, ...PILLARS.find((p) => p.href === f.href)! }));
  return (
    <section data-toc-skip aria-labelledby="guides-heading" className="py-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow mb-3">From the blog</p>
            <h2 id="guides-heading" className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
              Guides to writing with AI
            </h2>
          </div>
          <Link href="/blog" className="font-semibold text-sm" style={{ color: "var(--color-accent)" }}>
            All guides and posts <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <li key={c.href}>
              <ThumbCard href={c.href} tag={c.tag} title={c.title} blurb={c.blurb} image={GUIDE_THUMBS[c.href]} cta={`Read the ${c.tag.toLowerCase()}`} titleClass="text-lg" sizes="(min-width: 768px) 330px, 100vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
