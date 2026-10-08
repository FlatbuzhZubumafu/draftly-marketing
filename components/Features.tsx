import { getHomepageData } from "@/lib/graphql";
import type { LucideIcon } from "lucide-react";
import { Target, PenTool, Zap, Globe, Clock, TrendingUp, Cpu, Gauge, RefreshCw } from "lucide-react";
import { AccentText } from "./AccentText";
import { ProductFigure } from "./ProductFigure";
import { FEATURE_SHOTS } from "@/lib/product-shots";

const ICON_MAP: Record<string, LucideIcon> = { Target, PenTool, Zap, Globe, Clock, TrendingUp, Cpu, Gauge, RefreshCw };

export async function Features() {
  const { features } = await getHomepageData();

  return (
    <section id="features" className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-14">
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            Everything Between a Blank Page and a{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              Published Post
            </AccentText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {FEATURE_SHOTS.slice(0, 2).map((shot) => (
            <ProductFigure key={shot.src} shot={shot} aspect="900 / 728" fit="contain" className="reveal min-w-0" />
          ))}
          <ProductFigure shot={FEATURE_SHOTS[2]} className="reveal min-w-0 md:col-span-2 md:max-w-3xl md:mx-auto md:w-full" />
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
