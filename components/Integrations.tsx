import { getHomepageData } from "@/lib/graphql";
import {
  SiWordpress,
  SiShopify,
  SiGhost,
  SiWebflow,
  SiHubspot,
  SiSquarespace,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { AccentText } from "./AccentText";

const ICON_MAP: Record<string, IconType> = {
  WordPress: SiWordpress,
  Shopify: SiShopify,
  Ghost: SiGhost,
  Webflow: SiWebflow,
  HubSpot: SiHubspot,
  Squarespace: SiSquarespace,
};

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
        <div className="reveal flex flex-wrap justify-center gap-3" style={{ transitionDelay: "0.15s" }}>
          {integrations.nodes.map((p) => {
            const Icon = ICON_MAP[p.title];
            return (
              <div
                key={p.title}
                className="flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--color-bg-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                {Icon ? (
                  <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                ) : null}
                {p.title}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
