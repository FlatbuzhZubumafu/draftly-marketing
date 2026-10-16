// Inline source links for competitor facts on the comparison pages: "(Koala pricing, as of October 2026)".
export type SourceLink = { label: string; href: string };

export function SourceLinks({ items, month }: { items: SourceLink[]; month: string }) {
  if (!items.length) return null;
  return (
    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      {" "}
      (
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 ? ", " : ""}
          <a href={s.href} rel="nofollow noopener" target="_blank" className="underline">
            {s.label}
          </a>
        </span>
      ))}
      , as of {month})
    </span>
  );
}
