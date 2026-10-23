// Data for /writesonic-vs-draftly. Writesonic's plans, prices and features come from
// lib/writesonic-alternatives.ts, read on writesonic.com on its CHECKED date. Only
// claims Writesonic's own pages make are listed for it: a row we couldn't confirm
// there is left out rather than marked "no". Draftly's side must match lib/pricing.ts
// and the app.

import { PAID_PLANS } from "./pricing";
import { JASPER_PRO } from "./jasper-vs-draftly";
import { WRITESONIC_MONTHLY_FROM, WRITESONIC_PLANS } from "./writesonic-alternatives";
import type { FeatureId } from "@/lib/features";

export { CHECKED, SOURCES, WRITESONIC_MONTHLY_FROM, WRITESONIC_PLANS } from "./writesonic-alternatives";

const [SOLO, GROWTH] = PAID_PLANS;
const [WS_STARTER, WS_BASIC, WS_GROWTH] = WRITESONIC_PLANS;

export const draftlyPosts = (posts: string) => Number(posts.replace(/\D+/g, ""));

/** Price per AI article on each Writesonic plan, billed yearly. */
export const WRITESONIC_PER_ARTICLE = WRITESONIC_PLANS.map((p) => ({ name: p.name, perArticle: p.yearly / (p.articles * 12) }));
/** Price per post on Draftly's two self-serve plans, billed monthly, at the default model's estimate. */
export const DRAFTLY_PER_POST = [SOLO, GROWTH].map((p) => ({ name: p.name, perPost: p.price / draftlyPosts(p.posts) }));

export type Cell = boolean | string;
export type TableRow = {
  label: string;
  feature?: FeatureId;
  draftly: Cell;
  draftlyNote?: string;
  writesonic: Cell;
  writesonicNote?: string;
};

export const TABLE: TableRow[] = [
  { label: "Built for", draftly: "Small-business blogs", writesonic: "AI search visibility" },
  {
    label: "Starting price",
    draftly: `$${SOLO.price} a month`,
    draftlyNote: "Billed monthly",
    writesonic: `$${WS_STARTER.yearlyMonthly} a month`,
    writesonicNote: `Billed yearly, or from $${WRITESONIC_MONTHLY_FROM} month to month`,
  },
  {
    label: "Blog posts a month, entry plan",
    draftly: `About ${draftlyPosts(SOLO.posts)}`,
    draftlyNote: "On the default model",
    writesonic: `${WS_STARTER.articles}`,
    writesonicNote: "AI articles on Starter",
  },
  {
    label: "People included",
    feature: "teams",
    draftly: `${SOLO.seats} on Solopreneur, ${GROWTH.seats} on Growth, unlimited on Autopilot`,
    writesonic: `${WS_STARTER.users} on Starter, ${WS_BASIC.users} on Basic, ${WS_GROWTH.users} on Growth`,
  },
  {
    label: "Brand voices",
    feature: "brand-voice",
    draftly: true,
    draftlyNote: "Built from your website, every plan",
    writesonic: `${WS_STARTER.voices} on Starter, ${WS_BASIC.voices} on Basic, ${WS_GROWTH.voices} on Growth`,
  },
  { label: "Try it free, no credit card", draftly: true, draftlyNote: "First post free", writesonic: true, writesonicNote: "Free trial" },
  { label: "Publish to WordPress", feature: "publishing", draftly: true, draftlyNote: "One click", writesonic: true },
  {
    label: "Tracks your brand in ChatGPT, Gemini and AI Overviews",
    draftly: false,
    draftlyNote: "Free AI crawler check only",
    writesonic: true,
    writesonicNote: "Every plan",
  },
  { label: "Site audits", draftly: false, writesonic: true },
  { label: "Ads monitoring", draftly: false, writesonic: true },
];

/** Writesonic Starter vs Jasper Pro for one person, both from their own pricing pages. */
export const VS_JASPER = {
  writesonic: { yearlyMonthly: WS_STARTER.yearlyMonthly, articles: WS_STARTER.articles, voices: WS_STARTER.voices },
  jasper: { monthly: JASPER_PRO.monthly, yearly: JASPER_PRO.yearly, voices: 2 },
};
