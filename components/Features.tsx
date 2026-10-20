import { AccentText } from "./AccentText";
import { FeatureCarousel } from "./FeatureCarousel";
import { FeatureTile } from "./FeatureTile";
import { FEATURE_SLIDES } from "@/lib/product-shots";
import { FEATURES, FEATURES_HUB, featurePath } from "@/lib/features";

// Cards that the carousel already covers are left out of the grid below it.
const IN_CAROUSEL = new Set(FEATURE_SLIDES.map((s) => s.href));
const GRID = FEATURES.filter((f) => !IN_CAROUSEL.has(featurePath(f))).slice(0, 9);

export function Features() {
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
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRID.map((f, index) => (
            <li key={f.slug} className="reveal" style={{ transitionDelay: `${index * 0.08}s` }}>
              <FeatureTile feature={f} compact />
            </li>
          ))}
        </ul>
        <div className="text-center mt-10">
          <a href={FEATURES_HUB.path} className="btn btn-secondary">
            See all {FEATURES.length} features
          </a>
        </div>
      </div>
    </section>
  );
}
