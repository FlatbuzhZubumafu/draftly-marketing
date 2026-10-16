// Two-column comparison ("Koala" vs "Draftly") used by the review pages. Cards on phones,
// a table from the sm breakpoint up, matching the at-a-glance tables on the comparison pages.
export type CompareRow = { label: string; them: string; draftly: string };

const secondary = { color: "var(--color-text-secondary)" };
const border = "1px solid var(--color-border)";

export function CompareTable({ them, rows }: { them: string; rows: CompareRow[] }) {
  return (
    <>
      <div className="sm:hidden space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border }}>
            <p className="font-semibold">{r.label}</p>
            <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={secondary}>
              <div>
                <dt className="font-medium" style={{ color: "var(--color-text-primary)" }}>{them}</dt>
                <dd>{r.them}</dd>
              </div>
              <div>
                <dt className="font-medium" style={{ color: "var(--color-accent)" }}>Draftly</dt>
                <dd>{r.draftly}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto rounded-xl" style={{ border }}>
        <table className="w-full text-sm min-w-[640px]">
          <thead style={{ background: "var(--color-bg-surface)" }}>
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold w-1/4" scope="col"><span className="sr-only">Feature</span></th>
              <th className="px-4 py-2 font-semibold" scope="col">{them}</th>
              <th className="px-4 py-2 font-semibold" scope="col" style={{ color: "var(--color-accent)" }}>Draftly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} style={{ borderTop: border }}>
                <th scope="row" className="px-4 py-3 align-top text-left font-semibold">{r.label}</th>
                <td className="px-4 py-3 align-top" style={secondary}>{r.them}</td>
                <td className="px-4 py-3 align-top" style={secondary}>{r.draftly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
