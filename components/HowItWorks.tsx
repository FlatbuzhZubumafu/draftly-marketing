import { getHomepageData } from "@/lib/graphql";
import type { LucideIcon } from "lucide-react";
import { Target, Rss, PenTool } from "lucide-react";
import { AccentText } from "./AccentText";

const ICON_MAP: Record<string, LucideIcon> = { Target, Rss, PenTool };

const SCREENSHOT_URL = "https://draftly.blog/wp-content/uploads/2025/10/Screenshot-2025-10-15-at-11.26.01-AM.png";

export async function HowItWorks() {
  const { steps, marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  return (
    <section id="how-it-works" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-10">
          <p className="eyebrow mb-3">How it works</p>
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            How Draftly Actually{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              Works
            </AccentText>
          </h2>
        </div>

        {/* Product screenshot */}
        <div className="reveal mb-14 max-w-3xl mx-auto" style={{ transitionDelay: "0.1s" }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-deep)" }}
          >
            <img
              src={SCREENSHOT_URL}
              alt="Draftly topic discovery interface"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.nodes.map((step, index) => {
            const Icon = ICON_MAP[step.iconName] || Target;
            return (
              <div
                key={step.stepNumber}
                className="reveal rounded-xl p-8 card-depth"
                style={{
                  borderLeft: "3px solid transparent",
                  borderImage: "var(--gradient-accent) 1",
                  background: "var(--color-bg-surface)",
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ background: "var(--color-accent-muted)" }}>
                    <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                  {step.stepDescription}
                </p>
              </div>
            );
          })}
        </div>
        <div className="reveal text-center mt-12" style={{ transitionDelay: "0.3s" }}>
          <a href={registerUrl} className="btn btn-primary">
            {s.heroCtaText}
          </a>
        </div>
      </div>
    </section>
  );
}
