import { Check, X } from "lucide-react";
import {
  WP_COMPARE_NOTES,
  WP_COMPARE_ROWS,
  WP_COMPARE_TOOLS,
  WP_COMPARED_DATE,
  WP_COMPARED_ON,
  type Cell,
  type CellLine,
  type ToolId,
} from "@/lib/wordpress-compare";
import { WP_PLUGIN_VERSION } from "@/lib/wordpress-plugin";

// The Draftly vs. other WordPress AI plugins matrix. Rows are features, columns
// are tools; Draftly's column is tinted. On narrow screens the table scrolls
// sideways inside its own box while the feature column stays put.

const HIGHLIGHT: ToolId = "draftly";
const LABEL_COL = "w-[132px] min-w-[132px] sm:w-[200px] sm:min-w-[200px]";

function Badge({ children, tone }: { children: React.ReactNode; tone: "partial" | "soon" }) {
  const style =
    tone === "soon"
      ? { background: "#fff3d6", color: "#7a5300" }
      : { background: "var(--color-bg-subtle)", color: "var(--color-text-primary)" };
  return (
    <span className="inline-block px-1.5 rounded text-[11px] font-semibold whitespace-nowrap" style={style}>
      {children}
    </span>
  );
}

function Line({ line }: { line: CellLine }) {
  const { mark, text, note } = line;
  const sup = note ? (
    <sup className="ml-0.5">
      <a href={`#compare-note-${note}`} aria-label={`Note ${note}`} style={{ color: "var(--color-accent)" }}>
        {note}
      </a>
    </sup>
  ) : null;

  if (mark === "isSeoPlugin") {
    return <span style={{ color: "var(--color-text-secondary)" }}>Is the SEO plugin{sup}</span>;
  }
  if (mark === "notListed") {
    return (
      <span style={{ color: "var(--color-text-muted)" }}>
        {text ? `${text} ` : ""}Not listed{sup}
      </span>
    );
  }

  const icon =
    mark === "yes" ? (
      <>
        <Check className="inline w-4 h-4 -mt-0.5 mr-1" style={{ color: "var(--color-accent)" }} aria-hidden="true" />
        <span className="sr-only">Yes. </span>
      </>
    ) : mark === "no" ? (
      <>
        <X className="inline w-4 h-4 -mt-0.5 mr-1" style={{ color: "var(--color-text-muted)" }} aria-hidden="true" />
        <span className="sr-only">No. </span>
      </>
    ) : null;

  // "Bulk: Coming soon" reads label first, badge second.
  if (mark === "soon") {
    return (
      <span>
        {text ? <span style={{ color: "var(--color-text-secondary)" }}>{text} </span> : null}
        <Badge tone="soon">Coming soon</Badge>
        {sup}
      </span>
    );
  }

  return (
    <span>
      {icon}
      {mark === "partial" ? (
        <>
          <Badge tone="partial">Partial</Badge>{" "}
        </>
      ) : null}
      <span style={{ color: mark ? "var(--color-text-secondary)" : "var(--color-text-primary)" }}>{text}</span>
      {sup}
    </span>
  );
}

function CellBody({ cell }: { cell: Cell }) {
  const lines = Array.isArray(cell) ? cell : [cell];
  return (
    <div className="space-y-1.5">
      {lines.map((l, i) => (
        <div key={i}>
          <Line line={l} />
        </div>
      ))}
    </div>
  );
}

export function WordPressCompare() {
  const last = WP_COMPARE_ROWS.length - 1;
  const hl = (id: ToolId, extra: React.CSSProperties = {}): React.CSSProperties =>
    id === HIGHLIGHT
      ? {
          background: "var(--color-accent-muted)",
          borderLeft: "2px solid var(--color-accent)",
          borderRight: "2px solid var(--color-accent)",
          ...extra,
        }
      : extra;

  return (
    <div>
      <div className="relative overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
        <table className="w-full text-sm min-w-[880px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <caption className="sr-only">
            Draftly AI Post Optimizer compared with Rank Math Content AI, Yoast SEO Premium, All in One SEO and GetGenie,
            checked {WP_COMPARED_ON}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className={`sticky left-0 z-10 text-left align-bottom p-3 font-semibold ${LABEL_COL}`}
                style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-strong)" }}
              >
                <span className="sr-only">Feature</span>
              </th>
              {WP_COMPARE_TOOLS.map((t) => (
                <th
                  key={t.id}
                  scope="col"
                  className="text-left align-bottom p-3 w-[150px]"
                  style={hl(t.id, {
                    borderBottom: "1px solid var(--color-border-strong)",
                    ...(t.id === HIGHLIGHT ? { borderTop: "2px solid var(--color-accent)" } : {}),
                  })}
                >
                  {t.id === HIGHLIGHT ? (
                    <span
                      className="inline-block mb-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ background: "var(--color-accent)", color: "var(--color-text-inverted)" }}
                    >
                      This plugin
                    </span>
                  ) : null}
                  <span className="block font-semibold leading-snug">{t.name}</span>
                  <span className="block text-xs font-normal leading-snug" style={{ color: "var(--color-text-muted)" }}>
                    {t.product}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WP_COMPARE_ROWS.map((row, i) => {
              const rowBorder = i === last ? {} : { borderBottom: "1px solid var(--color-border)" };
              return (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 text-left align-top p-3 font-semibold leading-snug ${LABEL_COL}`}
                    style={{ background: "var(--color-bg-surface)", ...rowBorder }}
                  >
                    {row.label}
                  </th>
                  {WP_COMPARE_TOOLS.map((t) => (
                    <td
                      key={t.id}
                      className="align-top p-3 leading-snug"
                      style={hl(t.id, {
                        ...rowBorder,
                        ...(t.id === HIGHLIGHT && i === last ? { borderBottom: "2px solid var(--color-accent)" } : {}),
                      })}
                    >
                      <CellBody cell={row.cells[t.id]} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs sm:hidden" style={{ color: "var(--color-text-muted)" }}>
        Scroll the table sideways to see every plugin.
      </p>

      <ol className="mt-6 space-y-2 text-xs leading-relaxed list-none max-w-4xl" style={{ color: "var(--color-text-muted)" }}>
        {WP_COMPARE_NOTES.map((n, i) => (
          <li key={i} id={`compare-note-${i + 1}`} className="flex gap-2">
            <span className="font-semibold" style={{ color: "var(--color-text-secondary)" }}>
              {i + 1}.
            </span>
            <span>{n}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs leading-relaxed max-w-4xl" style={{ color: "var(--color-text-muted)" }}>
        Compared on <time dateTime={WP_COMPARED_DATE}>{WP_COMPARED_ON}</time>{" "}
        from each vendor&apos;s own pricing and
        feature pages. &ldquo;Not listed&rdquo; means we couldn&apos;t find the feature on those pages. Prices and features
        change, so check before you buy. <span style={{ color: "var(--color-text-secondary)" }}>Sources:</span>{" "}
        {WP_COMPARE_TOOLS.filter((t) => t.sources.length).map((t, i, arr) => (
          <span key={t.id}>
            {t.name}{" "}
            {t.sources.map((s, j) => (
              <span key={s.href}>
                <a href={s.href} rel="nofollow noopener" target="_blank" style={{ color: "var(--color-accent)" }}>
                  {s.label}
                </a>
                {j < t.sources.length - 1 ? ", " : ""}
              </span>
            ))}
            {i < arr.length - 1 ? "; " : ". "}
          </span>
        ))}
        Draftly: plugin version {WP_PLUGIN_VERSION} and the <a href="#pricing" style={{ color: "var(--color-accent)" }}>plans above</a>.
      </p>
    </div>
  );
}
