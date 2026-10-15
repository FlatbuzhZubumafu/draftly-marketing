// Mirrors the app's source of truth: src/config/pricing.ts, the credit_costs table
// and model_catalog in the draftly.blog repo. Change those first, then this.
import { APP_MODEL_COUNT } from "./app-models";

export type Plan = {
  name: string;
  price: number;
  credits: string;
  posts: string;
  /** People who can sign in to the account, owner included. null = unlimited. Mirrors subscription_plans.seat_limit in the app. */
  seats: number | null;
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
    seats: 1,
    pitch: "See what Draftly writes for your site before you pay anything.",
    features: [
      "Your first full blog post, free",
      "Brand voice built from your website",
      "Publish to all 6 CMS integrations",
      "Your free post comes with its thumbnail; outlines and topic ideas use your monthly credits",
      "Google Analytics and Search Console reports",
      "Connect Claude, ChatGPT or Cursor and write one more post with your own AI",
    ],
  },
  {
    name: "Solopreneur",
    price: 29,
    credits: "10,000 credits a month",
    posts: "About 66 posts a month",
    seats: 2,
    pitch: "For one person running one blog who wants to publish every week.",
    includesFrom: "Free",
    features: [
      `Pick from ${APP_MODEL_COUNT} AI models, including Claude, GPT, Gemini, Kimi and DeepSeek`,
      "Outlines and topic refreshes use no credits",
      "AI images inside your posts, from a suggested visual for each section (53 credits an image)",
      "Keep writing posts with your own AI through the Draftly connector for Claude, ChatGPT and Cursor",
      "Import your own keyword lists and brand docs (coming soon)",
      "Keyword data through the connector: search volume, difficulty, intent and related keywords, 40 lookups a month",
    ],
  },
  {
    name: "Growth",
    price: 69,
    credits: "35,000 credits a month",
    posts: "About 233 posts a month",
    seats: 5,
    pitch: "For teams and agencies publishing most days of the week.",
    includesFrom: "Solopreneur",
    features: [
      "Email notifications when posts are ready",
      "Live Google results, People Also Ask and domain data for your site and competitors, 150 data calls a month",
    ],
    highlight: "Lowest cost per post",
  },
  {
    name: "Autopilot",
    price: 100,
    credits: "50,000 credits a month",
    posts: "About 333 posts a month",
    seats: null,
    pitch: "Set a schedule once and Draftly keeps your blog publishing.",
    includesFrom: "Growth",
    features: [
      "Posting schedules: Draftly picks topics, writes and publishes on your cadence",
      "Automatic publishing to WordPress and Shopify",
      "Weekly digest email of everything it published",
      "Every SEO dataset, including keyword gaps against competitors and backlinks, 300 data calls a month",
    ],
  },
];

/** "Team members: 2", "Team members: Unlimited". */
export const teamMembersLabel = (plan: Plan) => `Team members: ${plan.seats ?? "Unlimited"}`;

/** "1 / 2 / 5 / Unlimited", in plan order. */
export const teamMembersList = () => PLANS.map((p) => p.seats ?? "Unlimited").join(" / ");

/**
 * Team seats (app: subscription_plans.seat_limit). The owner counts as one,
 * everyone shares the plan's credits, and there is no per-seat price or seat add-on.
 */
export const TEAM_NOTE =
  "Team members means people who can sign in to your account, you included. Everyone shares the plan's credits. No per-seat charge.";

/**
 * Additional websites. Mirrors supabase/functions/_shared/site-addons.ts in the app
 * (checked 2026-10-15): $29 a month per extra website on Solopreneur, Growth or
 * Autopilot, each with its own 10,000 monthly credits. Free and the WordPress
 * plugin and Shopify app plans keep one website.
 */
export const SITE_ADDON = { price: 29, credits: "10,000" };

/** The paid plans, cheapest first. */
export const PAID_PLANS = PLANS.filter((p) => p.price > 0);

/** "a, b and c" */
export function joinList(items: string[]): string {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : items.join("");
}

/** "$29, $69 and $100", built from PLANS so copy stays in step with the plan cards. */
export const paidPriceList = () => joinList(PAID_PLANS.map((p) => `$${p.price}`));

/** "66, 233 and 333", the approximate monthly post counts of the paid plans. */
export const paidPostCounts = () => joinList(PAID_PLANS.map((p) => p.posts.replace(/\D+/g, "")));

/**
 * First-month offer. Checked against the app on 2026-10-12: stripe-checkout
 * attaches STRIPE_FIRST_MONTH_COUPON (live coupon FIRSTMONTH50, 50% off,
 * duration "once") automatically to a customer's first subscription on
 * Solopreneur, Growth or Autopilot (_shared/first-month-offer.ts). WordPress
 * plugin plans and credit packs never get it. If the secret is unset, remove this.
 */
export const FIRST_MONTH_OFFER = {
  badge: "First month 50% off any paid plan",
  note: "Taken off automatically at checkout on your first paid subscription.",
};

/**
 * Cancelling: Settings > Billing > Manage subscription opens the Stripe portal,
 * where cancellation is on and takes effect at the end of the paid period.
 * Subscriptions are not refundable (terms section 4), so no money-back promise.
 */
export const CANCEL_NOTE = "Cancel any time from Settings.";
export const BILLING_TERMS_HREF = "/terms-and-conditions#billing-cancellation-and-refunds";

/** Value anchor under the cheapest paid plan (site audit D4.3). */
export function valueAnchor(plan: Plan): string {
  const posts = plan.posts.replace(/\D+/g, "");
  return `About ${posts} posts for $${plan.price}. A freelance writer charges more than that for one article.`;
}
