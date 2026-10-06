import { Check } from "lucide-react";

// Mirrors the app's source of truth: src/config/pricing.ts, the credit_costs table
// and model_catalog in the draftly.blog repo. Change those first, then this.
export type Plan = {
  name: string;
  price: number;
  credits: string;
  posts: string;
  pitch: string;
  includesFrom?: string;
  features: string[];
  highlight?: string;
};

export const PLANS: Plan[] = [
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
      "MCP connector for Claude, ChatGPT and Cursor, with your Search Console and GA4 data (coming soon)",
      "Import your own keyword lists and brand docs (coming soon)",
      "Keyword data: search volume, difficulty, intent and related keywords, 40 lookups a month (coming soon)",
    ],
  },
  {
    name: "Growth",
    price: 69,
    credits: "35,000 credits a month",
    posts: "About 140 posts a month",
    pitch: "For teams and agencies publishing most days of the week.",
    includesFrom: "Solopreneur",
    features: [
      "AI-generated images inside your posts",
      "Email notifications when posts are ready",
      "Live top 10 results, People Also Ask and domain data for your site and competitors, 150 data calls a month (coming soon)",
    ],
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
      "Every SEO dataset, including keyword gaps against competitors and backlinks, 300 data calls a month (coming soon)",
    ],
  },
];

/**
 * The four plan cards. Shared by /pricing and the homepage so the two can never
 * disagree. `cardHeading` keeps the heading outline valid on each page.
 */
export function PricingPlans({
  registerUrl,
  freeCtaText,
  cardHeading = "h3",
}: {
  registerUrl: string;
  freeCtaText: string;
  cardHeading?: "h2" | "h3";
}) {
  const CardHeading = cardHeading;
  return (
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
            <CardHeading className="text-xl font-semibold">{plan.name}</CardHeading>
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
              {plan.price === 0 ? freeCtaText : `Start on ${plan.name}`}
            </a>
          </div>
        ))}
      </div>
  );
}
