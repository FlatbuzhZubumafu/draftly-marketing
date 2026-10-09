"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { WP_FEATURES, WP_PLANS, WP_SIGNUP_URL } from "@/lib/wordpress-plugin";

/** Plan cards for the WordPress plugin, with a monthly/annual switch that starts on annual. */
export function WordPressPlans() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex justify-center mb-10">
        <div role="group" aria-label="Billing period" className="inline-flex p-1 rounded-full" style={{ background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)" }}>
          {[
            { value: true, label: "Annual", note: "save 20%" },
            { value: false, label: "Monthly" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              aria-pressed={annual === opt.value}
              onClick={() => setAnnual(opt.value)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
              style={
                annual === opt.value
                  ? { background: "var(--color-text-primary)", color: "var(--color-bg-primary)" }
                  : { color: "var(--color-text-secondary)" }
              }
            >
              {opt.label}
              {opt.note ? <span className="ml-1.5 font-normal opacity-80">{opt.note}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {WP_PLANS.map((plan) => {
          const perMonth = annual ? plan.yearly / 12 : plan.monthly;
          return (
            <div
              key={plan.id}
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
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ letterSpacing: "-0.03em" }}>
                  ${perMonth}
                </span>
                <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  /month
                </span>
              </p>
              <p className="text-xs mt-1 min-h-[1rem]" style={{ color: "var(--color-text-muted)" }}>
                {plan.monthly === 0 ? "Free with the plugin" : annual ? `$${plan.yearly} billed once a year` : "Billed monthly"}
              </p>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                {plan.pitch}
              </p>

              <ul className="mt-5 space-y-3 text-sm leading-relaxed flex-1">
                {WP_FEATURES.map((f, i) => {
                  const value = plan.values[i];
                  return (
                    <li key={f.label} className="flex gap-2" style={{ color: value ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>
                      {value ? (
                        <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--color-accent)" }} aria-hidden="true" />
                      ) : (
                        <span className="w-4 mt-[9px] h-px flex-shrink-0" style={{ background: "var(--color-border-strong)" }} aria-hidden="true" />
                      )}
                      <span>
                        <span className={value ? "font-semibold" : ""} style={value ? { color: "var(--color-text-primary)" } : undefined}>
                          {f.label}
                        </span>
                        {value ? <>: {value}</> : <span className="sr-only">: not included</span>}
                        {value && f.status === "soon" ? (
                          <span className="ml-1.5 inline-block px-1.5 rounded text-[11px] font-semibold align-middle" style={{ background: "#fff3d6", color: "#7a5300" }}>
                            Coming soon
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* TODO: paid plans go to Stripe checkout once the WordPress price IDs exist. Until then every plan starts with a free account. */}
              <a
                href={WP_SIGNUP_URL}
                className={`btn mt-6 justify-center text-sm ${plan.highlight ? "btn-primary" : ""}`}
                style={plan.highlight ? undefined : { border: "1px solid var(--color-border-strong)", color: "var(--color-text-primary)" }}
              >
                {plan.monthly === 0 ? "Get it free" : `Join the beta`}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
