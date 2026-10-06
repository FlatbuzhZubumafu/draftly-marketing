import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccentText } from "@/components/AccentText";
import { PricingPlans } from "@/components/PricingPlans";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Your first Draftly post is free. Paid plans run $29, $69 and $100 a month for about 66, 233 and 333 blog posts written in your brand's voice.",
  alternates: { canonical: "/pricing" },
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
    title: "Rewrites Without Credits",
    body: "Tell Draftly what to change and it rewrites the post. Rewrites never touch your balance.",
  },
  {
    title: "One-Click Publishing",
    body: "WordPress, Shopify, Ghost, Webflow, HubSpot and Squarespace.",
  },
];

const CREDIT_COSTS = [
  { action: "Blog post", credits: "150 (250 on Sonnet 4.6 and GPT 5.4)" },
  { action: "Thumbnail image", credits: "50" },
  { action: "Outline", credits: "15 (free on paid plans)" },
  { action: "Topic refresh", credits: "10 (free on paid plans)" },
  { action: "Rewrite", credits: "0" },
];

const MODELS = ["GPT 5.4 Mini (default)", "Claude Sonnet 4.6", "Claude Haiku 4.5", "GPT 5.4", "Gemini 3 Flash", "DeepSeek V3.2"];

export default async function PricingPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <section className="container-draftly max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.25rem, 5.5vw, 64px)" }}>
              Pay for the Posts
              <br />
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                You Publish
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
            on value. Claude Sonnet 4.6 and GPT 5.4 use about 1.7x the credits per post, so a plan covers fewer posts
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
          className="container-draftly max-w-5xl mt-24 rounded-2xl p-8 sm:p-12"
          style={{ background: "#111", color: "var(--color-text-inverted)" }}
        >
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Coming Soon: Draftly Inside{" "}
            <em className="italic" style={{ color: "#ffce59" }}>
              Claude and ChatGPT
            </em>
          </h2>
          <div className="max-w-2xl space-y-4 text-base leading-relaxed" style={{ color: "#bbb" }}>
            <p>
              Connect Draftly to Claude, ChatGPT or Cursor through MCP. Your assistant gets your brand memory, your
              Search Console and GA4 numbers, and Draftly&apos;s editing checks, then helps you decide what to write and
              writes it with you.
            </p>
            <p>Draftly picks the best model for each step, or your own assistant does the writing. Your call.</p>
            <p>
              Every paid plan includes keyword data. Growth adds the live top 10 and domain data, and Autopilot opens
              every dataset, including keyword gaps and backlinks. Need more lookups? Add a data pack any time.
            </p>
            <p className="font-semibold text-white">Included with every paid plan when it launches.</p>
          </div>
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
