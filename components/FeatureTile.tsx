import { ArrowRight } from "lucide-react";
import { FeatureArt, isArtName } from "@/components/feature-art/FeatureArt";
import { CATEGORIES, featurePath, type Feature } from "@/lib/features";
import { tintVars } from "@/lib/feature-tints";

/**
 * The pastel feature card: category label and title on top, the feature's looping
 * drawing on a graph-paper band, the one-line summary and a "See how it works" link.
 * The link's hit area covers the whole card. Tint comes from the feature's category.
 */
export function FeatureTile({ feature, as: Heading = "h3", compact = false }: { feature: Feature; as?: "h2" | "h3"; compact?: boolean }) {
  const category = CATEGORIES.find((c) => c.id === feature.category);
  return (
    <article className="feature-tile relative flex flex-col h-full" style={tintVars(feature.category)}>
      <div className={compact ? "px-5 pt-5 pb-4" : "px-6 pt-6 pb-5"}>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: "#4a4a4a" }}>
          {category?.name}
        </p>
        <Heading className="feature-tile-title" style={{ fontSize: compact ? "1.35rem" : "1.6rem" }}>
          {feature.name}
        </Heading>
      </div>
      <div className="graph-paper feature-tile-band">
        <FeatureArt name={isArtName(feature.id) ? feature.id : "writing-rules"} className={compact ? "max-w-[240px] mx-auto" : "max-w-[300px] mx-auto"} />
      </div>
      <div className={`flex flex-col flex-1 ${compact ? "p-5" : "p-6"}`}>
        <p className={`${compact ? "text-sm" : "text-[15px]"} leading-relaxed mb-5`} style={{ color: "#2b2b2b" }}>
          {feature.summary}
        </p>
        <a href={featurePath(feature)} className="feature-tile-link mt-auto" aria-label={`See how ${feature.name} works`}>
          <span>See how it works</span>
          <span className="feature-tile-arrow" aria-hidden="true">
            <ArrowRight className="w-4 h-4" />
          </span>
        </a>
      </div>
    </article>
  );
}
