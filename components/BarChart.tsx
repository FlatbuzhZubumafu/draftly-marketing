import type { ReactNode } from "react";

export type BarGroup = { label: string; color: string };
export type BarRow = { label: ReactNode; key: string; value: number; group?: string };

/**
 * Horizontal bars from 0 to `max`, with every value printed beside its bar so the chart
 * never relies on color or bar length alone. Groups (e.g. Claude vs ChatGPT) get a legend
 * and the group name in each row's tooltip. Plain HTML, no client JS.
 */
export function BarChart({
  title,
  note,
  rows,
  groups,
  max = 100,
  format = (n) => String(n),
  defaultColor = "var(--color-accent)",
}: {
  title: string;
  note?: ReactNode;
  rows: BarRow[];
  groups?: Record<string, BarGroup>;
  max?: number;
  format?: (n: number) => string;
  defaultColor?: string;
}) {
  return (
    <figure className="max-w-3xl mt-8 p-5 sm:p-6 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
      <figcaption className="mb-4">
        <span className="block text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{title}</span>
        {groups ? (
          <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {Object.values(groups).map((g) => (
              <span key={g.label} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="inline-block w-3 h-3 rounded-sm" style={{ background: g.color }} />
                {g.label}
              </span>
            ))}
          </span>
        ) : null}
      </figcaption>
      <ul className="space-y-2.5" role="list">
        {rows.map((r) => {
          const g = r.group && groups ? groups[r.group] : undefined;
          const pct = Math.max(0, Math.min(100, (r.value / max) * 100));
          return (
            <li key={r.key} className="grid items-center gap-x-3 gap-y-1 grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_3.5rem]" title={g ? `${g.label}: ${format(r.value)}` : format(r.value)}>
              <span className="text-sm truncate" style={{ color: "var(--color-text-primary)" }}>{r.label}</span>
              <span className="text-sm font-semibold tabular-nums text-right sm:order-last" style={{ color: "var(--color-text-primary)" }}>
                {format(r.value)}
                {g ? <span className="sr-only"> ({g.label})</span> : null}
              </span>
              <span aria-hidden className="col-span-2 sm:col-span-1 h-3 rounded-r" style={{ background: "var(--color-bg-subtle)" }}>
                <span className="block h-3 rounded-r" style={{ width: `${pct}%`, background: g?.color ?? defaultColor }} />
              </span>
            </li>
          );
        })}
      </ul>
      {note ? <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{note}</p> : null}
    </figure>
  );
}
