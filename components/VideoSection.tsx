import { AccentText } from "./AccentText";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

// The demo is an animated walkthrough built in Remotion (source: draftly-work/video-remotion, composition DraftlyDemo),
// so it ships with the site instead of coming from WordPress.
const VIDEO = {
  mp4: "/videos/draftly-demo.mp4",
  webm: "/videos/draftly-demo.webm",
  poster: "/videos/draftly-demo-poster.jpg",
  duration: "PT1M3S",
};

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "How Draftly works, from URL to published post",
  description:
    "An animated walkthrough of Draftly: paste your URL, Draftly learns your brand voice, picks topics that fit, writes and checks the post, adds SEO meta and publishes to your CMS.",
  thumbnailUrl: `${SITE_URL}${VIDEO.poster}`,
  uploadDate: "2026-10-08",
  duration: VIDEO.duration,
  contentUrl: `${SITE_URL}${VIDEO.mp4}`,
};

export function VideoSection() {
  return (
    <section
      id="video"
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: "var(--color-bg-surface)" }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(videoJsonLd) }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,61,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="container-draftly relative z-10 flex flex-col items-center text-center">
        <div className="reveal mb-6">
          <h2 className="text-3xl sm:text-4xl font-medium max-w-2xl" style={{ letterSpacing: "-0.03em" }}>
            Watch how Draftly goes from{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              blank page to published
            </AccentText>{" "}
            in under two minutes.
          </h2>
        </div>

        <div className="reveal mt-10 w-full max-w-4xl" style={{ transitionDelay: "0.15s" }}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-deep)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
          >
            <video
              className="w-full h-auto block"
              style={{ aspectRatio: "16 / 9" }}
              controls
              muted
              playsInline
              preload="metadata"
              poster={VIDEO.poster}
              aria-label="Animated walkthrough of how Draftly works, from pasting a URL to publishing a post"
            >
              <source src={VIDEO.webm} type="video/webm" />
              <source src={VIDEO.mp4} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
