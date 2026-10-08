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
      "Outlines, topic ideas and a thumbnail for each post from your monthly credits",
      "Google Analytics and Search Console reports",
    ],
  },
  {
    name: "Solopreneur",
    price: 29,
    credits: "10,000 credits a month",
    posts: "About 66 posts a month",
    pitch: "For one person running one blog who wants to publish every week.",
    includesFrom: "Free",
    features: [
      "Pick from 8 AI models, including Claude, GPT, Gemini and DeepSeek",
      "Outlines and topic refreshes use no credits",
      "AI images inside your posts, from a suggested visual for each section (50 credits an image)",
      "Draftly connector for Claude, ChatGPT and Cursor: your brand voice, posts and topic ideas inside your own AI",
      "Import your own keyword lists and brand docs (coming soon)",
      "Keyword data through the connector: search volume, difficulty, intent and related keywords, 40 lookups a month",
    ],
  },
  {
    name: "Growth",
    price: 69,
    credits: "35,000 credits a month",
    posts: "About 233 posts a month",
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
