// Data for /jasper-vs-draftly. Every Jasper fact here was read on Jasper's own
// public pages on CHECKED (jasper.ai/pricing, /free-trial, /integrations,
// /solutions/seo-aeo-geo, /agents, /brand-voice and the help-center MCP article).
// If a Jasper fact can't be re-confirmed on Jasper's site, delete it rather than
// guess. Draftly's side must match lib/pricing.ts and the app.

export const CHECKED = { iso: "2026-10-12", label: "October 12, 2026", month: "October 2026" };

export type Source = { label: string; href: string };

export const JASPER_SOURCES = {
  pricing: { label: "Jasper pricing", href: "https://www.jasper.ai/pricing" },
  trial: { label: "Jasper free trial", href: "https://www.jasper.ai/free-trial" },
  integrations: { label: "Jasper integrations", href: "https://www.jasper.ai/integrations" },
  seo: { label: "Jasper for SEO, AEO and GEO", href: "https://www.jasper.ai/solutions/seo-aeo-geo" },
  mcp: { label: "Jasper help: MCP server", href: "https://help.jasper.ai/hc/en-us/articles/39658912106779-Jasper-Model-Context-Provider-MCP-Server" },
  home: { label: "jasper.ai", href: "https://www.jasper.ai/" },
} satisfies Record<string, Source>;

/** The page's share image and homepage card source (public/images/og). */
export const OG_IMAGE = {
  url: "/images/og/jasper-vs-draftly.png",
  width: 1200,
  height: 630,
  alt: "Jasper vs Draftly comparison table: pricing, brand voice, writing checks, publishing and the Claude and ChatGPT connector",
};

/** Jasper's list prices as published on jasper.ai/pricing on CHECKED. */
export const JASPER_PRO = { monthly: 69, yearly: 59 } as const;

export type Edge = "draftly" | "jasper" | "tie";
export type Row = { label: string; draftly: string; jasper: string; edge: Edge };

export const ROWS: Row[] = [
  {
    label: "Built for",
    draftly: "Small-business blogs, from topic to published post",
    jasper: "Marketing teams running campaigns across many channels",
    edge: "tie",
  },
  {
    label: "Lowest paid plan",
    draftly: "$29 a month (Solopreneur)",
    jasper: `$${JASPER_PRO.monthly} per seat a month (Pro), $${JASPER_PRO.yearly} billed yearly`,
    edge: "draftly",
  },
  {
    label: "Free way to try it",
    draftly: "First full post free, no credit card",
    jasper: "7-day free trial of Pro",
    edge: "draftly",
  },
  {
    label: "Brand voice",
    draftly: "Built from your website URL on every plan, adjustable with sliders",
    jasper: "2 brand voices on Pro, unlimited on Business",
    edge: "draftly",
  },
  {
    label: "Checks drafts for AI-sounding writing",
    draftly: "Every post checked against writing rules and fixed before you see it",
    jasper: "Style Guide on the Business plan",
    edge: "draftly",
  },
  {
    label: "Publishing",
    draftly: "One click to WordPress, Shopify, Webflow, Ghost, HubSpot and Squarespace",
    jasper: "Webflow app; WordPress isn't on its integrations page",
    edge: "draftly",
  },
  {
    label: "Scheduled auto-publishing",
    draftly: "Autopilot plan, $100 a month (WordPress and Shopify)",
    jasper: "Not listed",
    edge: "draftly",
  },
  {
    label: "Claude and ChatGPT connector (MCP)",
    draftly: "Every plan, Free included",
    jasper: "Business plan only, needs API access",
    edge: "draftly",
  },
  {
    label: "Content types",
    draftly: "Blog posts only",
    jasper: "100+ marketing agents: ads, emails, product copy, blog posts and more",
    edge: "jasper",
  },
  {
    label: "Languages and regions",
    draftly: "US businesses only",
    jasper: "30+ languages",
    edge: "jasper",
  },
  {
    label: "Team controls",
    draftly: "No SSO or team roles",
    jasper: "SSO, SCIM, roles and admin controls on Business",
    edge: "jasper",
  },
];
