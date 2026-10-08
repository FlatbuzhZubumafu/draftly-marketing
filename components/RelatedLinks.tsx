import type { Pillar } from "@/lib/related";

/** "Keep reading" cards linking to pillar pages. Left out of the On-this-page list. */
export function RelatedLinks({ items, heading = "Keep reading", className = "mt-16" }: { items: Pillar[]; heading?: string; className?: string }) {
  return (
    <section data-toc-skip aria-labelledby="related-heading" className={className}>
      <h2 id="related-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((p) => (
          <li key={p.href}>
            <a
              href={p.href}
              className="block h-full rounded-xl p-5 transition-colors"
              style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
            >
              <span className="block font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {p.title}
              </span>
              <span className="block mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {p.blurb}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
