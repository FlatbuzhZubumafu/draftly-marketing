import { getHomepageData } from "@/lib/graphql";
import type { LucideIcon } from "lucide-react";
import { Target, PenTool, Zap, Globe, Clock, TrendingUp } from "lucide-react";
import { AccentText } from "./AccentText";

const ICON_MAP: Record<string, LucideIcon> = { Target, PenTool, Zap, Globe, Clock, TrendingUp };

export async function Features() {
  const { features } = await getHomepageData();

  return (
    <section id="features" className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-14">
          <p className="eyebrow mb-3">Features</p>
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            Everything a growing blog needs,{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              nothing it doesn't.
            </AccentText>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.nodes.map((feature, index) => {
            const Icon = ICON_MAP[feature.iconName] || Zap;
            return (
              <div
                key={feature.title}
                className="reveal p-6 card-depth"
                style={{ background: "var(--color-bg-primary)", transitionDelay: `${index * 0.08}s` }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                     style={{ background: "var(--color-accent-muted)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
