import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccentText } from "@/components/AccentText";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Your first Draftly post is free. Paid plans run $29, $69 and $100 a month for about 40, 140 and 200 blog posts written in your brand's voice.",
  alternates: { canonical: "/pricing" },
};

// Mirrors the app's source of truth: src/config/pricing.ts, the credit_costs table
// and model_catalog in the draftly.blog repo. Change those first, then this.
type Plan = {
  name: string;
  price: number;
  credits: string;
  posts: string;
  pitch: string;
  includesFrom?: string;
  features: string[];
  highlight?: string;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    price: 0,
    credits: "1,000 credits a month",
    posts: "1 free blog post",
    pitch: "See what Draftly writes for your site before you pay anything.",
    features: [
      "Your first full blog post, free",
      "Brand voice built from your website",
      "Publish to all 6 CMS integrations",
      "Outlines, topic ideas and thumbnails from your monthly credits",
      "Google Analytics and Search Console reports",
    ],
  },
  {
    name: "Solopreneur",
    price: 29,
    credits: "10,000 credits a month",
    posts: "About 40 posts a month",
    pitch: "For one person running one blog who wants to publish every week.",
    includesFrom: "Free",
    features: [
      "Pick from 6 AI models, including Claude, GPT, Gemini and DeepSeek",
      "Outlines and topic refreshes use no credits",
      "MCP connector for Claude, ChatGPT and Cursor (coming soon)",
    ],
  },
  {
    name: "Growth",
    price: 69,
    credits: "35,000 credits a month",
    posts: "About 140 posts a month",
    pitch: "For teams and agencies publishing most days of the week.",
    includesFrom: "Solopreneur",
    features: ["AI-generated images inside your posts", "Email notifications when posts are ready"],
    highlight: "Lowest cost per post",
  },
  {
    name: "Autopilot",
    price: 100,
    credits: "50,000 credits a month",
    posts: "About 200 posts a month",
    pitch: "Set a schedule once and Draftly keeps your blog publishing.",
    includesFrom: "Growth",
    features: [
      "Posting schedules: Draftly picks topics, writes and publishes on your cadence",
      "Automatic publishing to WordPress and Shopify",
      "Weekly digest email of everything it published",
    ],
  },
];

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
  { action: "Blog post", credits: "250" },
  { action: "Thumbnail image", credits: "50" },
  { action: "Outline", credits: "15 (free on paid plans)" },
  { action: "Topic refresh", credits: "10 (free on paid plans)" },
  { action: "Rewrite", credits: "0" },
];

const MODELS = ["Claude Sonnet 4.6", "Claude Haiku 4.5", "GPT 5.4", "GPT 5.4 Mini", "Gemini 3 Flash", "DeepSeek V3.2"];

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col p-6 rounded-xl card-depth"
                style={{
                  background: plan.highlight ? "var(--color-bg-primary)" : "var(--color-bg-surface)",
                  border: plan.highlight ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                }}
              >
                {plan.highlight && (
                  <span
                    className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "var(--color-accent)", color: "var(--color-text-inverted)" }}
                  >
                    {plan.highlight}
                  </span>
                )}
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ letterSpacing: "-0.03em" }}>
                    ${plan.price}
                  </span>
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    /month
                  </span>
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                  {plan.posts}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {plan.credits}
                </p>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {plan.pitch}
                </p>

                <ul className="mt-5 space-y-2.5 text-sm leading-relaxed flex-1">
                  {plan.includesFrom && (
                    <li className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      Everything in {plan.includesFrom}, plus:
                    </li>
                  )}
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2" style={{ color: "var(--color-text-secondary)" }}>
                      <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--color-accent)" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={registerUrl}
                  className={`btn mt-6 justify-center text-sm ${plan.highlight ? "btn-primary" : ""}`}
                  style={
                    plan.highlight
                      ? undefined
                      : { border: "1px solid var(--color-border-strong)", color: "var(--color-text-primary)" }
                  }
                >
                  {plan.price === 0 ? s.heroCtaText : `Start on ${plan.name}`}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-center max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Post counts assume the default model, Claude Sonnet 4.6. Haiku, GPT 5.4 Mini, Gemini 3 Flash and
            DeepSeek cost 40% fewer credits per post, so your plan stretches further on them. Start free and upgrade
            any time from Settings inside the app.
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
              Connect Draftly to Claude, ChatGPT or Cursor through MCP. Your assistant gets your brand memory, live
              keyword research and Draftly&apos;s editing checks, then helps you decide what to write and writes it with
              you.
            </p>
            <p>Draftly picks the best model for each step, or your own assistant does the writing. Your call.</p>
            <p className="font-semibold text-white">Included with every paid plan when it launches.</p>
          </div>
        </section>

        <section className="container-draftly max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              How Credits Work
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--color-text-secondary)" }}>
              Each plan comes with a monthly credit balance. Actions spend credits at these rates on the default model.
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
              Free accounts write with Claude Sonnet 4.6. Paid plans choose per post from the full list.
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
