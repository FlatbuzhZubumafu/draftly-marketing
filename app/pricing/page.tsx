import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { Check } from "lucide-react";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccentText } from "@/components/AccentText";
import { PricingPlans } from "@/components/PricingPlans";
import { PAID_PLANS, paidPostCounts, paidPriceList } from "@/lib/pricing";
import { jsonLdHtml, softwareApplicationJsonLd } from "@/lib/schema";

export const revalidate = 3600;

const TITLE = `Draftly Pricing: Free, ${paidPriceList()} Plans`;
const DESCRIPTION = `Your first Draftly post is free. Paid plans run ${paidPriceList()} a month for about ${paidPostCounts()} blog posts written in your brand's voice.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/pricing",
    images: [DEFAULT_OG_IMAGE],
  },
};

const EVERY_PLAN = [
  {
    title: "Brand Voice and Memory",
    body: "Draftly reads your site, then you tune tone sliders, vocabulary and writing samples. It learns from the feedback you give on each post.",
  },
  {
    title: "Newsroom Topics",
    body: "Curated industry RSS feeds and news, turned into blog topics for your site every day.",
  },
  {
    title: "Human-Voice Score",
    body: "Every post gets a 0 to 100 score from a 13-point check for phrasing that reads as machine-written.",
  },
  {
    title: "SEO Basics on Every Post",
    body: "Slug, meta title, meta description and target keywords are written with the post.",
  },
  {
    title: "Rewrites on Request",
    body: "Tell Draftly what to change and it rewrites the post on the model that wrote it. Your free post includes 2 rewrites.",
  },
  {
    title: "One-Click Publishing",
    body: "WordPress, Shopify, Ghost, Webflow, HubSpot and Squarespace.",
  },
];

const CREDIT_COSTS = [
  { action: "Blog post", credits: "150 (250 on premium models such as Claude Sonnet 5.5)" },
  { action: "Thumbnail image", credits: "50" },
  { action: "Outline", credits: "15 (free on paid plans)" },
  { action: "Topic refresh", credits: "10 (free on paid plans)" },
  { action: "Rewrite", credits: "30 (50 on premium models). 2 free on your first post" },
];

const MODELS = ["GPT 5.4 Mini (default, best value)", "Claude Sonnet 5.5 (recommended premium)", "Claude Sonnet 4.6", "Claude Haiku 4.5", "GPT 5.4", "Gemini 3 Flash", "DeepSeek V3.2"];

export default async function PricingPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(softwareApplicationJsonLd) }} />
        <section className="container-draftly max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.25rem, 5.5vw, 64px)" }}>
              Better AI Blogs
              <br />
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                Starting at ${Math.min(...PAID_PLANS.map((p) => p.price))}/mo
              </em>
            </h1>
            <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Every plan writes in your brand&apos;s voice and publishes straight to your CMS. Paid plans add volume,
              your choice of AI model and, on Autopilot, a blog that runs on a schedule.
            </p>
          </div>

          <PricingPlans registerUrl={registerUrl} freeCtaText={s.heroCtaText} cardHeading="h2" />

          <p className="mt-6 text-sm text-center max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Post counts assume the default model, GPT 5.4 Mini, which led our{" "}
            <a href="/best-ai-for-writing" style={{ color: "var(--color-accent)" }}>
              blogging benchmark
            </a>{" "}
            on value. Premium models such as Claude Sonnet 5.5 use about 1.7x the credits per post, so a plan covers fewer posts
            on them. SEO data calls come
            from a separate monthly allowance, with data packs of 100 extra calls for $10. Start free and upgrade any
            time from Settings inside the app.
          </p>
        </section>

        <section className="container-draftly max-w-5xl mt-24">
          <h2 className="text-3xl font-medium text-center mb-10" style={{ letterSpacing: "-0.03em" }}>
            Included on{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              Every Plan
            </AccentText>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EVERY_PLAN.map((item) => (
              <div key={item.title} className="p-6 card-depth" style={{ background: "var(--color-bg-surface)" }}>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="container-draftly max-w-5xl mt-24 rounded-2xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 items-center"
          style={{ background: "#111", color: "var(--color-text-inverted)" }}
        >
          <div className="min-w-0">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Draftly Inside{" "}
            <em className="italic" style={{ color: "#ffce59" }}>
              Claude, ChatGPT and Cursor
            </em>
          </h2>
          <div className="max-w-2xl space-y-4 text-base leading-relaxed" style={{ color: "#bbb" }}>
            <p>
              Connect Draftly to Claude, ChatGPT or Cursor with one URL. Your assistant reads your brand voice, your
              posts and your topic ideas, and pulls live SEO data while it plans and writes with you.
            </p>
            <p>
              Every paid plan includes keyword data. Growth adds the live top 10 and domain data, and Autopilot opens
              every dataset, including keyword gaps and backlinks. Need more lookups? Add a data pack any time.
            </p>
            <p className="font-semibold text-white">
              Included with every paid plan.{" "}
              <a href="/mcp" className="underline" style={{ color: "#ffce59" }}>
                Read the setup guide
              </a>
            </p>
          </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mcp-connections.png"
            alt="Claude, ChatGPT, Grok, Cursor, OpenClaw and Hermes Agent connect to Draftly, which publishes to WordPress, Shopify, Wix and Webflow"
            width={979}
            height={551}
            loading="lazy"
            className="w-full h-auto"
          />
        </section>

        <section className="container-draftly max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              How Credits Work
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
              Each plan comes with a monthly credit balance. Actions spend credits at these rates.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                  <th className="text-left py-2 font-semibold">Action</th>
                  <th className="text-right py-2 font-semibold">Credits</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_COSTS.map((row) => (
                  <tr key={row.action} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td className="py-2" style={{ color: "var(--color-text-secondary)" }}>
                      {row.action}
                    </td>
                    <td className="py-2 text-right" style={{ color: "var(--color-text-secondary)" }}>
                      {row.credits}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              The Models You Can Pick
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
              Free accounts write with GPT 5.4 Mini. Paid plans choose per post from the full list.
            </p>
            <ul className="space-y-2 text-sm">
              {MODELS.map((m) => (
                <li key={m} className="flex gap-2" style={{ color: "var(--color-text-secondary)" }}>
                  <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--color-accent)" }} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="container-draftly max-w-2xl mt-24 text-center">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Start With One Free Post
          </h2>
          <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Paste your URL and Draftly writes your first post. No credit card required.
          </p>
          <a href={registerUrl} className="btn btn-primary">
            {s.heroCtaText}
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
