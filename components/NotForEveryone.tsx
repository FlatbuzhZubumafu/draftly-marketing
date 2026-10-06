import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";

const MOBILE_SCREENSHOT_URL = "https://wp.draftly.blog/wp-content/uploads/2025/10/Draftly.blog-Mobile-2.png";

export async function NotForEveryone() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;
  const points = s.notForEveryoneBody
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p && !p.endsWith(":"));

  return (
    <section className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="reveal mb-8">
              <h2 className="text-3xl sm:text-4xl font-medium" style={{ letterSpacing: "-0.03em" }}>
                Who Draftly Is{" "}
                <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ff6b3d">
                  Built For
                </AccentText>
              </h2>
            </div>
            <div className="reveal rounded-xl p-8 card-depth" style={{ background: "var(--color-bg-primary)", transitionDelay: "0.1s" }}>
              <p className="text-sm font-semibold mb-4">Draftly is built for people who:</p>
              <div className="space-y-3 mb-6">
                {points.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="mt-[11px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium pt-4" style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-text-primary)" }}>
                {s.notForEveryoneUrgency}
              </p>
            </div>
            <div className="reveal text-center lg:text-left mt-8" style={{ transitionDelay: "0.2s" }}>
              <a href={registerUrl} className="btn btn-primary">
                {s.heroCtaText}
              </a>
            </div>
          </div>

          {/* Mobile screenshot */}
          <div className="order-1 lg:order-2 reveal">
            <div
              className="rounded-2xl overflow-hidden mx-auto"
              style={{ boxShadow: "var(--shadow-deep)", maxWidth: "400px" }}
            >
              <img
                src={MOBILE_SCREENSHOT_URL}
                alt="Draftly mobile interface"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
