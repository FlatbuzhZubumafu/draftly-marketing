import { getHomepageData } from "@/lib/graphql";
import type { LucideIcon } from "lucide-react";
import { Target, PenTool, Zap, Globe, Clock, TrendingUp, Cpu, Gauge, RefreshCw } from "lucide-react";
import { AccentText } from "./AccentText";
import { FeatureCarousel } from "./FeatureCarousel";
import { FEATURE_SLIDES } from "@/lib/product-shots";

const ICON_MAP: Record<string, LucideIcon> = { Target, PenTool, Zap, Globe, Clock, TrendingUp, Cpu, Gauge, RefreshCw };

// Card copy lives in WordPress; these override lines that no longer match the product.
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  Analytics: "Connect Google Analytics and Search Console, free on every plan, to see what your content earns.",
};

export async function Features() {
  const { features } = await getHomepageData();

  return (
    <section id="features" className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-12">
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            Everything Between a Blank Page and a{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              Published Post
            </AccentText>
          </h2>
        </div>

        <FeatureCarousel slides={FEATURE_SLIDES} />

        <h3 className="text-2xl font-medium text-center mt-20 mb-10" style={{ letterSpacing: "-0.03em" }}>
          And much, much more
        </h3>
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
                <h4 className="font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {DESCRIPTION_OVERRIDES[feature.title] ?? feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
