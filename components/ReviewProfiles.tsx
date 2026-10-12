import { REVIEW_PROFILES, type ReviewProfile } from "@/lib/reviews";

function describe(p: ReviewProfile): string {
  if (p.rating !== undefined) {
    const reviews = p.reviewCount !== undefined ? ` from ${p.reviewCount.toLocaleString("en-US")} reviews` : "";
    return `${p.rating} out of ${p.outOf ?? 5}${reviews}`;
  }
  return p.label ?? "Read reviews";
}

/**
 * "Where Draftly is reviewed": links to real third-party listings from
 * lib/reviews.ts. Renders nothing until that list has an entry.
 * `tone="dark"` is the compact footer version.
 */
export function ReviewProfiles({ tone = "light" }: { tone?: "light" | "dark" }) {
  if (REVIEW_PROFILES.length === 0) return null;

  if (tone === "dark") {
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs" aria-label="Where Draftly is reviewed">
        {REVIEW_PROFILES.map((p) => (
          <li key={p.url}>
            <a href={p.url} rel="noopener" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: "#8a8a8a" }}>
              {p.site}: {describe(p)}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section aria-labelledby="reviewed-heading" className="px-4 pt-16" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-3xl text-center">
        <h2 id="reviewed-heading" className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--color-text-muted)" }}>
          Where Draftly is reviewed
        </h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {REVIEW_PROFILES.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm card-depth"
                style={{ background: "var(--color-bg-surface)", color: "var(--color-text-primary)" }}
              >
                <span className="font-semibold">{p.site}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>{describe(p)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
