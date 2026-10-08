import { PILLARS } from "@/lib/related";
import { PAID_PLANS } from "@/lib/pricing";

/** Homepage links to the pillar pages, in body content so search engines see them as more than footer links. */
export function HomeGuides() {
  const cards = [
    ...PILLARS,
    {
      href: "/pricing",
      title: "Plans and pricing",
      blurb: `Your first post is free. Paid plans start at $${PAID_PLANS[0].price} a month.`,
    },
  ];
  return (
    <section data-toc-skip aria-labelledby="guides-heading" className="py-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <h2 id="guides-heading" className="text-3xl font-medium text-center mb-3" style={{ letterSpacing: "-0.03em" }}>
          Guides to how Draftly writes
        </h2>
        <p className="text-center mb-10 max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
          The rules every post follows, the models we tested, and how Draftly fits next to the tools you already use.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                className="block h-full rounded-xl p-5 transition-colors"
                style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
              >
                <span className="block font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {c.title}
                </span>
                <span className="block mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {c.blurb}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
