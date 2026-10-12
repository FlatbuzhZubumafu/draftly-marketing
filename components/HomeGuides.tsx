import Link from "next/link";
import { PILLARS } from "@/lib/related";
import { GUIDE_THUMBS } from "@/lib/product-shots";

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
            View all posts <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => {
            const thumb = GUIDE_THUMBS[c.href];
            return (
              <li key={c.href}>
                <a
                  href={c.href}
                  className="guide-card flex flex-col h-full rounded-xl overflow-hidden transition-shadow"
                  style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      width={thumb.width}
                      height={thumb.height}
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-auto"
                      style={{ aspectRatio: "16 / 10", borderBottom: "1px solid var(--color-border)" }}
                    />
                  ) : null}
                  <span className="flex flex-col flex-1 p-5">
                    <span className="eyebrow" style={{ color: "var(--color-text-muted)" }}>
                      {c.tag}
                    </span>
                    <span className="block mt-2 text-lg font-semibold leading-snug" style={{ color: "var(--color-text-primary)" }}>
                      {c.title}
                    </span>
                    <span className="block mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                      {c.blurb}
                    </span>
                    <span className="mt-auto pt-4 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                      Read the {c.tag.toLowerCase()} <span aria-hidden="true">&rarr;</span>
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
