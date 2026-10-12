import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";

// WordPress's own resized copies of the 2560px original (273 KB), so phones and
// the half-width desktop column load 45-130 KB instead.
const PORTRAIT_BASE = "https://wp.draftly.blog/wp-content/uploads/2025/10/DSC03429-Edit-1";
const PORTRAIT_URL = `${PORTRAIT_BASE}-1024x683.jpg`;
const PORTRAIT_SRCSET = [768, 1024, 1536].map((w) => `${PORTRAIT_BASE}-${w}x${Math.round((w * 2) / 3)}.jpg ${w}w`).join(", ");

export async function PersonalStory() {
  const { marketingSettings: s } = await getHomepageData();
  const paragraphs = s.personalStoryBody.split("\n\n");

  return (
    <section className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Portrait */}
          <div className="reveal relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-deep)" }}
            >
              <img
                src={PORTRAIT_URL}
                srcSet={PORTRAIT_SRCSET}
                sizes="(min-width: 1024px) 470px, calc(100vw - 32px)"
                width={1024}
                height={683}
                alt="Preston Vawdrey, founder of Draftly"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div
              className="absolute -inset-4 -z-10 rounded-3xl"
              style={{ background: "var(--gradient-accent)", opacity: 0.06 }}
            />
          </div>

          {/* Text */}
          <div>
            <div className="reveal mb-6">
              <h2 className="text-3xl sm:text-4xl font-medium" style={{ letterSpacing: "-0.03em" }}>
                I built this because I{" "}
                <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
                  needed it
                </AccentText>
              </h2>
            </div>
            <div className="max-w-none">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="reveal mb-4 text-base leading-relaxed"
                  style={{ color: "var(--color-text-secondary)", transitionDelay: `${i * 0.06}s` }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
