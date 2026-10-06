import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";
import { PricingPlans } from "./PricingPlans";

export async function HomePricing() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  return (
    <section id="pricing" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-6xl">
        <div className="reveal text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Pick Your{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              Publishing Pace
            </AccentText>
          </h2>
          <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Start with one free post. Upgrade when you want more posts, your choice of AI model or a blog that runs on
            a schedule.
          </p>
        </div>
        <div className="reveal" style={{ transitionDelay: "0.1s" }}>
          <PricingPlans registerUrl={registerUrl} freeCtaText={s.heroCtaText} />
        </div>
        <p className="mt-8 text-center">
          <a href="/pricing" className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
            See full pricing and how credits work
          </a>
        </p>
      </div>
    </section>
  );
}
