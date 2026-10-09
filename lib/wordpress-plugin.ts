import { APP_URL } from "@/lib/site";
import type { ProductShot } from "@/lib/product-shots";

// The Draftly WordPress plugin and its plans. These plans are sold only on
// /wordpress-ai-plugin, not on /pricing.
//
// Mirrors the app's source of truth in the draftly.blog repo:
// MARKETPLACE_TIERS / INSTALL_ALLOWANCE in src/config/pricing.ts and
// supabase/functions/_shared/allowances.ts, and the plugin itself in
// integrations/wordpress-plugin/draftly (readme.txt is where the data-sent copy comes from).
// Change those first, then this.

/** Free signup. The app's signup route is /register; `origin=wordpress` tags the account as a plugin signup. */
export const WP_SIGNUP_URL = `${APP_URL}/register?origin=wordpress`;

/**
 * A paid plan's button: signup (or sign-in) on the app, which then sends the
 * visitor straight to Stripe Checkout for this plan and billing period.
 */
export function wpPlanCheckoutUrl(plan: WpPlan, annual: boolean): string {
  if (!plan.tier) return WP_PLUGIN_DOWNLOAD_PATH;
  return `${WP_SIGNUP_URL}&plan=${plan.tier}&interval=${annual ? "year" : "month"}`;
}

export const WP_PLUGIN_PATH = "/wordpress-ai-plugin";

/** Product name shown on the page (the plugin's name in WordPress is "Draftly – AI Post Optimizer"). */
export const WP_PRODUCT_NAME = "Draftly AI Post Optimizer";

/**
 * Latest plugin release. To publish a new version: copy the release zip to
 * public/downloads/draftly-wordpress-plugin.zip (the stable link) and to
 * public/downloads/draftly-wordpress-plugin-<version>.zip, then bump this.
 */
export const WP_PLUGIN_VERSION = "1.1.0";
export const WP_PLUGIN_DOWNLOAD_PATH = "/downloads/draftly-wordpress-plugin.zip";

/** "live" ships in plugin 1.0.0 today. "soon" is in the plan entitlements but not built into the plugin yet. */
export type FeatureStatus = "live" | "soon";

export type WpFeature = { label: string; status: FeatureStatus };

export type WpPlan = {
  id: "free" | "optimize" | "deai" | "grow";
  /** The app's subscription_plans name, for checkout. Null for Free. */
  tier: "mkt_optimize" | "mkt_deai" | "mkt_grow" | null;
  name: string;
  monthly: number;
  /** Price billed once a year. */
  yearly: number;
  pitch: string;
  /** One value per WP_FEATURES row, in the same order; null means not included. */
  values: (string | null)[];
  highlight?: string;
};

export const WP_FEATURES: WpFeature[] = [
  { label: "Post optimizations", status: "live" },
  { label: "Bulk meta titles and descriptions", status: "soon" },
  { label: "Internal-link suggestions from your own pages", status: "soon" },
  { label: "De-AI your own writing", status: "soon" },
  { label: "Alt text for images", status: "soon" },
];

export const WP_PLANS: WpPlan[] = [
  {
    id: "free",
    tier: null,
    name: "Free",
    monthly: 0,
    yearly: 0,
    pitch: "Try every part of the plugin on your own posts.",
    values: ["5 posts", "3", null, "500-word sample", null],
  },
  {
    id: "optimize",
    tier: "mkt_optimize",
    name: "Optimize",
    monthly: 5,
    yearly: 48,
    pitch: "Clean up old posts and their meta, a few a day.",
    values: ["30 a month", "200 a month", "Included", null, null],
  },
  {
    id: "deai",
    tier: "mkt_deai",
    name: "De-AI",
    monthly: 10,
    yearly: 96,
    pitch: "Everything in Optimize, plus rewrites of your own drafts so they read like you.",
    values: ["30 a month", "200 a month", "Included", "50,000 words a month", null],
  },
  {
    id: "grow",
    tier: "mkt_grow",
    name: "Grow",
    monthly: 15,
    yearly: 144,
    pitch: "The whole site: more optimizations, all your meta and image alt text.",
    values: ["60 a month", "Whole site, up to 1,000 a month", "Included", "100,000 words a month", "300 images a month"],
  },
];

export const WP_TOP_UPS = "Credit top-ups are $5 for 1,500 credits or $10 for 3,000 credits, on any account, free ones included.";

/** Plugin screenshots from a local test site, "Roof Repair Blog", running plugin 1.0.0 (October 2026). */
const shot = (file: string, width: number, height: number, alt: string, caption: string): ProductShot => ({
  src: `/images/product/${file}`,
  width,
  height,
  alt,
  caption,
});

export const WP_SHOTS = {
  connect: shot("wp-plugin-connect.webp", 1280, 470,
    "The Draftly > Connection screen in WordPress admin with a Connect to Draftly button and a note listing what the site sends to Draftly when you click it",
    "Connect from Draftly > Connection. No WordPress or application password changes hands. Shown on Roof Repair Blog, an example test site."),
  review: shot("wp-plugin-review.webp", 1280, 1015,
    "Draftly > Optimize posts in WordPress admin: a post list with Check and Optimize buttons, and below it two suggested edits for How to tell if your roof needs repair, each with the before sentence struck through and the after sentence, plus Approve selected and Discard buttons",
    "Each suggested edit shows the sentence before and after. Tick the ones you want and approve. Example test site."),
  approved: shot("wp-plugin-approved.webp", 1280, 600,
    "The Optimize posts list after approval: How to tell if your roof needs repair now shows Human voice 88, SEO 66 and Readability 82, with a Revert link beside it",
    "After approval: new scores, a new WordPress revision and a Revert link. Example test site."),
  reverted: shot("wp-plugin-reverted.webp", 1280, 700,
    "The Optimize posts list with the notice Reverted to the version before Draftly changed it",
    "Revert puts the post back the way it was before Draftly touched it. Example test site."),
} satisfies Record<string, ProductShot>;

