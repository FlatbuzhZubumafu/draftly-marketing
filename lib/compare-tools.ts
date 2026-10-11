// Data for /jasper-alternatives: what people complain about in popular AI
// copywriting tools, and what Draftly does about each complaint.
//
// Every competitor claim carries the public source it came from. Sources were
// gathered by web search on 2026-10-11 (docs/competitive-research-2026.md in
// the draftly.blog repo); vendor pages could not be opened directly, so check
// each price and plan limit on the vendor's own site before publishing, and
// again whenever CHECKED changes. Draftly's side must stay true to
// lib/pricing.ts and the app: if a Draftly claim stops being true, delete it.

export const CHECKED = { iso: "2026-10-11", label: "October 11, 2026" };

export type Source = { label: string; href: string };

export type Complaint = {
  id: string;
  /** What users say, in plain words. */
  complaint: string;
  /** Which tools it's said about, and where. */
  about: { tool: string; detail: string; sources: Source[] }[];
  /** What Draftly does about it. Only shipped behavior. */
  draftly: string;
  /** Where Draftly falls short on this point, if anywhere. */
  caveat?: string;
};

export const COMPLAINTS: Complaint[] = [
  {
    id: "price",
    complaint: "It costs too much for one person or a small team",
    about: [
      {
        tool: "Jasper",
        detail: "Pro is listed at $69 per seat a month, billed monthly. Business is custom-priced with a 12-month commitment and usage credits. A common G2 review headline: \"Powerful for Marketing But Pricey.\"",
        sources: [
          { label: "Jasper pricing", href: "https://www.jasper.ai/pricing" },
          { label: "Jasper help: credits", href: "https://help.jasper.ai/hc/en-us/articles/46644376016923-Credits-Based-Pricing" },
          { label: "eesel review roundup", href: "https://www.eesel.ai/blog/jasper-ai-review" },
        ],
      },
    ],
    draftly: "Your first post is free. Paid plans start at $29 a month for one person running one blog, billed monthly with no annual contract.",
  },
  {
    id: "billing",
    complaint: "The free trial wanted my card, then charged me",
    about: [
      {
        tool: "Jasper",
        detail: "The 7-day trial asks for a card, and Trustpilot reviewers describe being charged when it ended and finding cancellation hard.",
        sources: [
          { label: "Jasper help: free trial", href: "https://help.jasper.ai/hc/en-us/articles/18618674196891-Free-Trial" },
          { label: "Jasper on Trustpilot", href: "https://jasper.ai/trustpilot" },
        ],
      },
      {
        tool: "Rytr",
        detail: "Reviewers report renewals without notice and no refunds.",
        sources: [{ label: "diyai review", href: "https://diyai.io/ai-tools/text-generation/reviews/rytr-ai-review/" }],
      },
    ],
    draftly: "Paste your URL and Draftly writes your first post with no credit card. When you do pay, you cancel from Settings in the app.",
  },
  {
    id: "robotic",
    complaint: "The output sounds like AI and I rewrite most of it",
    about: [
      {
        tool: "Jasper",
        detail: "Reviewers say long posts need heavy steering and editing.",
        sources: [{ label: "eesel review roundup", href: "https://www.eesel.ai/blog/jasper-ai-review" }],
      },
      {
        tool: "Writer",
        detail: "G2 reviews mention robotic output.",
        sources: [{ label: "Writer on G2", href: "https://g2.com/products/writer/reviews?page=2" }],
      },
      {
        tool: "Rytr",
        detail: "Reviewers call the output low quality and say it needs heavy editing.",
        sources: [{ label: "costbench review", href: "https://costbench.com/software/ai-writing-tools/rytr/" }],
      },
    ],
    draftly:
      "Every post is checked against writing rules for the habits that make copy read as machine-made: stock AI words, \"not just X\" framing, hedging, throat-clearing openers, em dashes and more. A post that breaks a rule gets a fix pass before you see it.",
    caveat: "Rules catch patterns, not taste. You should still read every post before it goes live.",
  },
  {
    id: "facts",
    complaint: "It states made-up facts with total confidence",
    about: [
      {
        tool: "Jasper",
        detail: "Confident inaccuracies are a recurring complaint in reviews.",
        sources: [{ label: "memeburn review", href: "https://memeburn.com/jasper-ai-review/" }],
      },
      {
        tool: "Koala",
        detail: "Reviewers say facts still need a human check.",
        sources: [{ label: "diyai review", href: "https://diyai.io/ai-tools/text-generation/reviews/koala-writer-review/" }],
      },
    ],
    draftly:
      "Draftly checks every number in a post against the material it wrote from: your website, your brand settings and the brief. A number it can't trace counts as a failure and goes back for a fix. Its editor keeps your numbers, quotes and links exactly as written and adds no new claims.",
    caveat: "It checks numbers and links, not every sentence. Claims without numbers still need your eye.",
  },
  {
    id: "voice",
    complaint: "It doesn't sound like my brand",
    about: [
      {
        tool: "Jasper",
        detail: "Trustpilot reviewers say output didn't match the brand voice they set up.",
        sources: [{ label: "Jasper on Trustpilot", href: "https://jasper.ai/trustpilot" }],
      },
    ],
    draftly:
      "Draftly builds your brand voice from your own website, shows it as sliders you can adjust, and learns from the edits you make before you publish. Every change it learns is listed in Brand memory, and you can undo any of them.",
  },
  {
    id: "credits",
    complaint: "Credits run out faster than the pricing page suggests",
    about: [
      {
        tool: "Koala",
        detail: "Premium models use words at twice the rate, which reviewers call a credit trap.",
        sources: [{ label: "eesel on Koala pricing", href: "https://www.eesel.ai/blog/koala-ai-pricing" }],
      },
      {
        tool: "Copy.ai",
        detail: "Users say they can't predict what a workflow will cost in credits.",
        sources: [{ label: "rfp.wiki review", href: "https://www.rfp.wiki/artificial-intelligence/copy-ai" }],
      },
    ],
    draftly:
      "Draftly's credit costs are listed on its pricing page, including that premium models use about 1.7 times the credits per post. Its editor tells you the exact price of a run before it starts.",
    caveat: "Premium models cost more on Draftly too. The difference is that the multiplier is published.",
  },
  {
    id: "publishing",
    complaint: "I still copy and paste everything into WordPress",
    about: [
      {
        tool: "Jasper",
        detail: "Jasper reaches WordPress through a browser extension. We found no WordPress plugin or one-click publishing.",
        sources: [{ label: "Jasper integrations", href: "https://jasper.ai/integrations" }],
      },
    ],
    draftly:
      "Draftly has a WordPress plugin and publishes in one click to WordPress, Shopify, Ghost, Webflow, HubSpot and Squarespace. The Autopilot plan publishes on a schedule.",
  },
  {
    id: "seo",
    complaint: "The SEO side feels thin",
    about: [
      {
        tool: "Jasper",
        detail: "Reviewers call its SEO surface-level next to specialist tools, and Surfer's docs list the Jasper integration as discontinued.",
        sources: [
          { label: "aitoolclinic comparison", href: "https://aitoolclinic.com/jasper-ai-vs-chatgpt-vs-claude-content-writing-2026/" },
          { label: "Surfer docs", href: "https://docs.surferseo.com/en/articles/5720825-surfer-x-jasper-integration" },
        ],
      },
    ],
    draftly:
      "Every plan shows your Google Analytics and Search Console reports and scores each post for SEO. Paid plans add SEO data through the Draftly connector: keyword volume, difficulty and intent from Solopreneur up, live Google results from Growth, keyword gaps and backlinks on Autopilot.",
    caveat: "Draftly doesn't track how often AI search tools like ChatGPT cite your site yet. Frase and Writesonic do.",
  },
  {
    id: "connector",
    complaint: "The Claude and ChatGPT connector is locked to the top plan",
    about: [
      {
        tool: "Jasper",
        detail: "Its MCP server is for Business plans only and needs API access.",
        sources: [{ label: "Jasper help: MCP server", href: "https://help.jasper.ai/hc/en-us/articles/39658912106779-Jasper-Model-Context-Provider-MCP-Server" }],
      },
      {
        tool: "Surfer",
        detail: "Its MCP launched in August 2026 as a beta for Pro plans and above.",
        sources: [{ label: "Surfer MCP announcement", href: "https://surferseo.com/events/introducing-surfer-mcp/" }],
      },
    ],
    draftly:
      "Every Draftly plan, Free included, can connect Claude, ChatGPT or Cursor. Your assistant reads your brand voice and writing rules, checks drafts against them and saves posts to Draftly. Free accounts can write one post this way.",
  },
];

/** Where another tool is the better pick. Fairness makes the rest of the page believable. */
export const WHEN_OTHERS_WIN: { tool: string; when: string; source?: Source }[] = [
  {
    tool: "Jasper",
    when: "You run a marketing team that writes ads, emails, social posts and campaigns across many channels and needs shared workspaces and approvals. Draftly writes blog posts only.",
  },
  {
    tool: "Surfer or Clearscope",
    when: "Your writers already draft by hand and you want detailed on-page scoring against the pages that rank today.",
  },
  {
    tool: "Koala",
    when: "Your main goal is the lowest monthly price for bulk articles and you plan to edit every one yourself.",
    source: { label: "eesel on Koala pricing", href: "https://www.eesel.ai/blog/koala-ai-pricing" },
  },
  {
    tool: "Frase or Writesonic",
    when: "You need to track whether ChatGPT, Perplexity and Gemini mention your brand. Draftly doesn't track this yet.",
    source: { label: "Frase MCP and GEO", href: "https://www.frase.io/blog/mcp-servers-for-seo" },
  },
  {
    tool: "Grammarly",
    when: "You want writing help inside every app you use, from email to documents, more than finished blog posts.",
  },
];

/** The at-a-glance table. "?" cells are left out on purpose: we only list what we could source. */
export type Cell = { text: string; good?: boolean };
export const TABLE_TOOLS = ["Draftly", "Jasper", "Surfer", "Koala", "Copy.ai"] as const;
export const TABLE_ROWS: { label: string; cells: Record<(typeof TABLE_TOOLS)[number], Cell> }[] = [
  {
    label: "Built mainly for",
    cells: {
      Draftly: { text: "Small-business blogs" },
      Jasper: { text: "Marketing teams" },
      Surfer: { text: "SEO content teams" },
      Koala: { text: "Bulk SEO articles" },
      "Copy.ai": { text: "Sales and go-to-market" },
    },
  },
  {
    label: "Lowest paid plan, billed monthly",
    cells: {
      Draftly: { text: "$29 a month", good: true },
      Jasper: { text: "$69 per seat a month" },
      Surfer: { text: "$59 a month (Discovery)" },
      Koala: { text: "$9 a month", good: true },
      "Copy.ai": { text: "$29 a month for 5 seats (Chat)" },
    },
  },
  {
    label: "Try it without a credit card",
    cells: {
      Draftly: { text: "Yes, first post free", good: true },
      Jasper: { text: "No, card for the 7-day trial" },
      Surfer: { text: "Not listed" },
      Koala: { text: "Not listed" },
      "Copy.ai": { text: "Not listed" },
    },
  },
  {
    label: "Publishes to WordPress",
    cells: {
      Draftly: { text: "Yes, plugin plus 5 other platforms", good: true },
      Jasper: { text: "Browser extension only" },
      Surfer: { text: "Yes, WordPress integration", good: true },
      Koala: { text: "Yes, auto-publish", good: true },
      "Copy.ai": { text: "Not found" },
    },
  },
  {
    label: "Connector for Claude and ChatGPT (MCP)",
    cells: {
      Draftly: { text: "Every plan, Free included", good: true },
      Jasper: { text: "Business plan only" },
      Surfer: { text: "Beta, Pro plans and up" },
      Koala: { text: "Not found" },
      "Copy.ai": { text: "Not found" },
    },
  },
  {
    label: "Checks drafts against writing rules",
    cells: {
      Draftly: { text: "Every post, every plan", good: true },
      Jasper: { text: "Style Guide, Business plan" },
      Surfer: { text: "AI detector and humanizer" },
      Koala: { text: "Not found" },
      "Copy.ai": { text: "Not found" },
    },
  },
];

export const TABLE_SOURCES: Source[] = [
  { label: "Jasper pricing", href: "https://www.jasper.ai/pricing" },
  { label: "Jasper help: free trial", href: "https://help.jasper.ai/hc/en-us/articles/18618674196891-Free-Trial" },
  { label: "Jasper help: MCP server", href: "https://help.jasper.ai/hc/en-us/articles/39658912106779-Jasper-Model-Context-Provider-MCP-Server" },
  { label: "Jasper Style Guide plans (activepieces)", href: "https://www.activepieces.com/blog/jasper-pricing-which-plan-is-worth-buying-in-2026" },
  { label: "Surfer pricing (comparedge)", href: "https://comparedge.com/tools/surfer-seo/pricing" },
  { label: "Surfer AI detector and humanizer", href: "https://docs.surferseo.com/en/articles/9396434-surfer-s-humanizer-and-ai-detector" },
  { label: "Koala pricing (eesel)", href: "https://www.eesel.ai/blog/koala-ai-pricing" },
  { label: "Copy.ai pricing", href: "https://www.copy.ai/blog/copy-ai-pricing" },
];
