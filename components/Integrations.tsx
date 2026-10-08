import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";
import { ProductFigure } from "./ProductFigure";
import { INTEGRATIONS_SHOT } from "@/lib/product-shots";

export async function Integrations() {
  const { integrations } = await getHomepageData();

  return (
    <section id="integrations" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-4xl text-center">
        <div className="reveal">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Publish directly to{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#9b5fcf">
              your blog.
            </AccentText>
          </h2>
          <p className="max-w-xl mx-auto mb-12 text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Connect your CMS in Settings and go from draft to published in one click. Every integration is on every plan, free included.
          </p>
        </div>
        <ProductFigure
          shot={INTEGRATIONS_SHOT}
          framed={false}
          className="reveal max-w-3xl mx-auto"
          caption={<>Publish to {integrations.nodes.map((p) => p.title).join(", ").replace(/, ([^,]*)$/, " or $1")}.</>}
        />
      </div>
    </section>
  );
}
