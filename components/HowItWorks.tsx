import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";
import { ProductFigure } from "./ProductFigure";
import { STEP_SHOTS } from "@/lib/product-shots";

export async function HowItWorks() {
  const { steps, marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  return (
    <section id="how-it-works" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-10">
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            How Draftly Actually{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              Works
            </AccentText>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.nodes.map((step, index) => {
            const shot = STEP_SHOTS[index];
            return (
              <div
                key={step.stepNumber}
                className="reveal p-6 card-depth min-w-0"
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                {shot ? <ProductFigure shot={shot} aspect="3 / 2" className="mb-6" showCaption={false} /> : null}
                <h3 className="font-semibold mb-2">{step.title}</h3>
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
