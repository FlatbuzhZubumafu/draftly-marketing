import { AccentText } from "./AccentText";
import { DemoVideoPlayer, type DemoVideoSources } from "./DemoVideoPlayer";
import { jsonLdHtml } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

// The demo is an animated walkthrough built in Remotion (source: draftly-work/video-remotion). The homepage
// autoplays the short silent loop (DraftlyDemoLoop); "Watch with sound" swaps in the narrated cut (DraftlyDemo).
const VIDEO: DemoVideoSources = {
  loop: { mp4: "/videos/draftly-demo-loop.mp4", webm: "/videos/draftly-demo-loop.webm" },
  narrated: { mp4: "/videos/draftly-demo-narrated.mp4", webm: "/videos/draftly-demo-narrated.webm", captions: "/videos/draftly-demo.en.vtt" },
  poster: "/videos/draftly-demo-poster.jpg",
};

// The narrated voiceover, also used as the video's transcript.
const TRANSCRIPT = [
  "This is Draftly, the AI copywriter that absolutely hates AI copy! It was designed and built by SEO developers in Utah's Silicon Slopes to create content that actually ranks and reads well. Here's how it works.",
  "It all starts with your website. Think of it as your home address. It's where everything begins. Draftly reviews your site to see how you talk to your customers, and learns how you like to write.",
  "Then, using our blend of copywriting expertise and data, it tunes your brand voice to match how you write, and what you write about. All of that feeds into your Brand Voice: a custom set of controls for the tone of your writing, which you can adjust any time.",
  "Once Draftly knows how you like to write, it gets to work. Reading the news, checking keywords, and researching the latest trends in your industry, to find what you should be writing about, and how it affects your brand. It's all ready for you to approve on day one.",
  "Once you approve a topic, Draftly starts writing, using our own blend of AI copywriting tools to make your content sound human, stand out, and stay fresh. Then, to keep it unique to you, it runs a series of draft passes, reviewing every line for common AI phrases and tells. It removes them, while keeping your brand intact and your message on track.",
  "When you like what it wrote, it's ready to launch, with your SEO and GEO optimizations already in place.",
  "Then publish it in one click to WordPress, Shopify, Webflow, Ghost, Squarespace, or HubSpot. And if you'd rather plug Draftly into your own workflow, the Draftly MCP connector works with popular AI tools like Claude, ChatGPT, and Cursor, so you can start improving your content today.",
  "Get started with your first post free, at draftly.blog!",
].join(" ");

const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "How Draftly works, from your website to a published post",
  description:
    "A narrated walkthrough of Draftly: it learns your brand voice from your website, finds topics that fit, writes and checks each post for common AI phrases, adds SEO and GEO optimizations, and publishes to your CMS.",
  thumbnailUrl: `${SITE_URL}${VIDEO.poster}`,
  uploadDate: "2026-10-08",
  duration: "PT1M57S",
  contentUrl: `${SITE_URL}${VIDEO.narrated.mp4}`,
  transcript: TRANSCRIPT,
  inLanguage: "en",
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
          <DemoVideoPlayer sources={VIDEO} />
        </div>
      </div>
    </section>
  );
}
