import { Check, Minus } from "lucide-react";
import { COMPARE_ROWS, PLANS } from "@/lib/pricing";

/** Plan-by-plan comparison under the cards on /pricing. Holds the detail the cards leave out. */
export function PlanCompare() {
  return (
    <div className="mt-16 overflow-x-auto">
      <h2 className="text-2xl font-medium mb-6 text-center" style={{ letterSpacing: "-0.03em" }}>
        Compare plans
      </h2>
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
            <th scope="col" className="text-left py-3 pr-4 font-semibold w-[34%]">
              <span className="sr-only">Feature</span>
            </th>
            {PLANS.map((p) => (
              <th key={p.name} scope="col" className="py-3 px-2 text-center font-semibold">
                {p.name}
                <span className="block text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>
                  ${p.price}/mo
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.label} style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th scope="row" className="text-left py-3 pr-4 font-normal" style={{ color: "var(--color-text-secondary)" }}>
                {row.label}
              </th>
              {row.values.map((v, i) => (
                <td key={PLANS[i].name} className="py-3 px-2 text-center">
                  {v === true ? (
                    <Check aria-label="Included" className="w-4 h-4 mx-auto" style={{ color: "var(--color-accent)" }} />
                  ) : v === false ? (
                    <Minus aria-label="Not included" className="w-4 h-4 mx-auto" style={{ color: "var(--color-text-muted)" }} />
                  ) : (
                    <span>{v}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
