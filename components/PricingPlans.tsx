import { Check } from "lucide-react";
import { PLANS } from "@/lib/pricing";

/**
 * The four plan cards. Shared by /pricing and the homepage so the two can never
 * disagree. `cardHeading` keeps the heading outline valid on each page.
 */
export function PricingPlans({
  registerUrl,
  freeCtaText,
  cardHeading = "h3",
}: {
  registerUrl: string;
  freeCtaText: string;
  cardHeading?: "h2" | "h3";
}) {
  const CardHeading = cardHeading;
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="relative flex flex-col p-6 rounded-xl card-depth"
            style={{
              background: plan.highlight ? "var(--color-bg-primary)" : "var(--color-bg-surface)",
              border: plan.highlight ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
            }}
          >
            {plan.highlight && (
              <span
                className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: "var(--color-accent)", color: "var(--color-text-inverted)" }}
              >
                {plan.highlight}
              </span>
            )}
            <CardHeading className="text-xl font-semibold">{plan.name}</CardHeading>
            <p className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold" style={{ letterSpacing: "-0.03em" }}>
                ${plan.price}
              </span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                /month
              </span>
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
              {plan.posts}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {plan.credits}
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {plan.pitch}
            </p>

            <ul className="mt-5 space-y-2.5 text-sm leading-relaxed flex-1">
              {plan.includesFrom && (
                <li className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  Everything in {plan.includesFrom}, plus:
                </li>
              )}
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2" style={{ color: "var(--color-text-secondary)" }}>
                  <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--color-accent)" }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={registerUrl}
              className={`btn mt-6 justify-center text-sm ${plan.highlight ? "btn-primary" : ""}`}
              style={
                plan.highlight
                  ? undefined
                  : { border: "1px solid var(--color-border-strong)", color: "var(--color-text-primary)" }
              }
            >
              {plan.price === 0 ? freeCtaText : `Start on ${plan.name}`}
            </a>
          </div>
        ))}
      </div>
  );
}
