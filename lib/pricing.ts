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
    pitch: "Try Draftly on your own site first.",
    features: [
      "One full blog post",
      "Brand voice from your website",
      "Publish to 6 platforms",
      "Google Analytics and Search Console reports",
    ],
  },
  {
    name: "Solopreneur",
    price: 29,
    credits: "10,000 credits a month",
    posts: "About 66 posts a month",
    seats: 2,
    pitch: "One blog, a new post every week.",
    includesFrom: "Free",
    features: [
      `${APP_MODEL_COUNT} AI models to choose from`,
      "AI images inside your posts",
      "Keyword data, 40 lookups a month",
      "Keep writing with your own AI",
    ],
  },
  {
    name: "Growth",
    price: 69,
    credits: "35,000 credits a month",
    posts: "About 233 posts a month",
    seats: 5,
    pitch: "Teams and agencies posting most days.",
    includesFrom: "Solopreneur",
    features: [
      "Live Google results and competitor data",
      "Email alerts when posts are ready",
    ],
    highlight: "Lowest cost per post",
  },
  {
    name: "Autopilot",
    price: 100,
    credits: "50,000 credits a month",
    posts: "About 333 posts a month",
    seats: null,
    pitch: "Your blog runs on a schedule.",
    includesFrom: "Growth",
    features: [
      "Scheduled topics, writing and publishing",
      "Auto-publish to WordPress and Shopify",
      "Every SEO dataset, including backlinks",
    ],
  },
];

/**
 * The plan comparison table on /pricing: where the details trimmed from the cards live.
 * One value per plan, in PLANS order. true = included, false = not included.
 */
export const COMPARE_ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: "Posts a month", values: ["1", "About 66", "About 233", "About 333"] },
  { label: "Credits a month", values: ["1,000", "10,000", "35,000", "50,000"] },
  { label: "Team members", values: PLANS.map((p) => String(p.seats ?? "Unlimited")) },
  { label: "AI models", values: ["Claude Sonnet 5.5", `All ${APP_MODEL_COUNT}`, `All ${APP_MODEL_COUNT}`, `All ${APP_MODEL_COUNT}`] },
  { label: "Brand voice from your site", values: [true, true, true, true] },
  { label: "Publish to WordPress, Shopify, Webflow, Ghost, Squarespace, HubSpot", values: [true, true, true, true] },
  { label: "Google Analytics and Search Console reports", values: [true, true, true, true] },
  { label: "Write with your own AI (Claude, ChatGPT, Cursor)", values: ["1 post", true, true, true] },
  { label: "Outlines and topic refreshes", values: ["Use credits", "Free", "Free", "Free"] },
  { label: "AI images inside posts", values: ["Thumbnail on your free post", "53 credits each", "53 credits each", "53 credits each"] },
  { label: "SEO data calls a month", values: [false, "40, keyword data", "150, plus live Google and domain data", "300, every dataset"] },
  { label: "Email alerts when posts are ready", values: [false, false, true, true] },
  { label: "Posting schedules and auto-publishing", values: [false, false, false, true] },
  { label: "Weekly digest email", values: [false, false, false, true] },
];

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
