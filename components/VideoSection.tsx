import { getHomepageData } from "@/lib/graphql";
import { AccentText } from "./AccentText";

export async function VideoSection() {
  const { marketingSettings: s } = await getHomepageData();

  return (
    <section
      id="video"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: "var(--color-bg-surface)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,61,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container-draftly relative z-10 flex flex-col items-center text-center">
        <div className="reveal mb-6">
          <p className="eyebrow mb-3">See it in action</p>
          <h2 className="text-3xl sm:text-4xl font-medium max-w-2xl" style={{ letterSpacing: "-0.03em" }}>
            Watch how Draftly goes from{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              blank page to published
            </AccentText>{" "}
            in under two minutes.
          </h2>
        </div>

        {s.heroVideoUrl && (
          <div className="reveal mt-10 w-full max-w-3xl" style={{ transitionDelay: "0.15s" }}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ boxShadow: "var(--shadow-deep)", background: "#000" }}
            >
              <video
                className="w-full h-auto block"
                style={{ aspectRatio: "16 / 9" }}
                controls
                playsInline
                preload="metadata"
                controlsList="nodownload"
              >
                <source src={s.heroVideoUrl} type="video/mp4" />
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
