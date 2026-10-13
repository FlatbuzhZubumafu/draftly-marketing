// Copy and settings for the free SEO tools at /tools. One source for the pages,
// the /tools hub, the sitemap, llms.txt and the share images. The checks
// themselves live in lib/tools (server only).
//
// Slugs follow US search demand (Ahrefs, 2026-10-13): ai visibility checker 1,600
// (KD 2), ai search visibility checker 600, llm visibility checker 450; blog seo
// checker 400, blog post seo checker 90; content refresh 350; e-e-a-t checker 100,
// eeat checker 50, eeat audit 40. Each tool is deterministic: no AI model sees the
// URL or the results.
import type { Faq } from "@/components/ArticleParts";

export type ToolId = "ai-visibility" | "blog-seo" | "content-refresh" | "eeat";

export type FreeTool = {
  id: ToolId;
  path: string;
  /** Short name for cards and nav. */
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  /** Italic accent word(s) at the end of the H1. */
  h1Accent: string;
  /** Answer-first intro: what the tool does, in two or three short sentences. */
  intro: string;
  input: { label: string; placeholder: string; button: string; extra?: { label: string; placeholder: string } };
  /** One line per check, for the "What it checks" list. */
  checks: { label: string; text: string }[];
  /** How Draftly relates to what this tool finds. Only facts the app supports. */
  draftly: { title: string; points: string[]; cta: string };
  faqs: Faq[];
  ogAlt: string;
  ogLine: string;
};

export const TOOLS_DATE = { iso: "2026-10-13", label: "October 2026" };

export const FREE_TOOLS: FreeTool[] = [
  {
    id: "ai-visibility",
    path: "/tools/ai-visibility-checker",
    name: "AI visibility checker",
    title: "Free AI Visibility Checker: Can ChatGPT and Claude Read Your Site?",
    description:
      "Check if ChatGPT, Claude, Perplexity and Google can crawl and cite your website. Free AI visibility checker for robots.txt, llms.txt, sitemap and schema.",
    eyebrow: "Free AI visibility checker",
    h1: "Can AI assistants read",
    h1Accent: "your site?",
    intro:
      "Enter your website and this checker tells you whether ChatGPT, Claude, Perplexity and Google can crawl it and cite it. It reads your robots.txt, sitemap, llms.txt and homepage markup, then loads your homepage as GPTBot and ClaudeBot to compare what they get with what a browser gets.",
    input: { label: "Your website", placeholder: "yourbusiness.com", button: "Check my site" },
    checks: [
      { label: "AI search bots in robots.txt", text: "Googlebot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User and PerplexityBot." },
      { label: "AI training bots in robots.txt", text: "GPTBot, ClaudeBot, Google-Extended and CCBot." },
      { label: "Same page for bots and browsers", text: "Status code and text length for a browser, GPTBot and ClaudeBot." },
      { label: "noindex and noai signals", text: "Robots meta tags and the X-Robots-Tag header on your homepage." },
      { label: "Homepage title and description", text: "Present, and long enough to describe the business." },
      { label: "Organization and WebSite schema", text: "JSON-LD that names your business and site." },
      { label: "XML sitemap", text: "Found, valid and listed in robots.txt." },
      { label: "Blog and newest post", text: "From sitemap dates or your RSS feed." },
      { label: "llms.txt", text: "Present at /llms.txt. Optional, and flagged as such." },
    ],
    draftly: {
      title: "A site AI can read still needs something worth citing",
      points: [
        "Draftly writes blog posts that answer the questions your customers ask, with question-style headings and a direct answer under each one.",
        "Every post comes with a meta title, meta description and slug.",
        "It publishes to WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot, so your newest-post date keeps moving.",
      ],
      cta: "Your first post is free. Paste your URL and Draftly writes it in your brand's voice.",
    },
    faqs: [
      {
        q: "What is an AI visibility checker?",
        a: "It checks whether AI assistants like ChatGPT, Claude and Perplexity can reach your website and use it in their answers. This one reads your robots.txt rules for each AI crawler, compares what bots and browsers get, and checks your sitemap, schema and noindex signals.",
      },
      {
        q: "Does blocking GPTBot stop ChatGPT from citing my site?",
        a: "Not on its own. GPTBot collects pages for model training. ChatGPT search uses OAI-SearchBot, and ChatGPT-User fetches pages a person asks about. Each one follows its own robots.txt rules, so you can block training and still allow search.",
      },
      {
        q: "Why does GPTBot get a 403 error when my browser doesn't?",
        a: "Usually a firewall, CDN or security plugin is blocking AI bots. Some firewalls only allow bots that come from the bot's real IP addresses. Our test can't use those addresses, so check your firewall logs before you change anything.",
      },
      {
        q: "Do I need an llms.txt file?",
        a: "It's optional. llms.txt is a short Markdown guide to your site for AI tools. No major assistant has said it uses the file for ranking, so this checker shows it as information only.",
      },
      {
        q: "Is this AI visibility check free?",
        a: "Yes. There's no sign-up, and we don't store the URL you enter or the results. The checks are plain rules run on your pages. No AI model reads your site.",
      },
    ],
    ogAlt: "Free AI visibility checker from Draftly: can ChatGPT, Claude, Perplexity and Google read your site?",
    ogLine: "robots.txt, bot access, sitemap, schema, llms.txt",
  },
  {
    id: "blog-seo",
    path: "/tools/blog-seo-checker",
    name: "Blog post SEO checker",
    title: "Free Blog SEO Checker: Score Any Blog Post in Seconds",
    description:
      "Paste a blog post URL and get a free SEO checklist: title, meta description, headings, word count, alt text, links, schema, canonical and broken links.",
    eyebrow: "Free blog SEO checker",
    h1: "Check one blog post",
    h1Accent: "for SEO",
    intro:
      "Paste the URL of one blog post and this checker runs 13 on-page SEO checks on it. You get a pass, warning or fail for each one, why it matters and how to fix it. It also tests up to 20 of the post's links to find broken ones.",
    input: { label: "Blog post URL", placeholder: "yourbusiness.com/blog/your-post", button: "Check this post" },
    checks: [
      { label: "Title length", text: "30 to 60 characters, so it fits in search results." },
      { label: "Meta description length", text: "120 to 160 characters." },
      { label: "Exactly one H1", text: "One clear headline for the post." },
      { label: "Heading order", text: "No skipped levels, like an H2 followed by an H4." },
      { label: "Word count", text: "Main content only, without menus and footers." },
      { label: "Image alt text", text: "Share of images with a description." },
      { label: "Internal links", text: "Links to other pages on your own site." },
      { label: "External links", text: "Links to sources on other sites." },
      { label: "Article or BlogPosting schema", text: "JSON-LD that describes the post." },
      { label: "Canonical URL", text: "Present and pointing at the post itself." },
      { label: "Open Graph image", text: "The picture shown when the post is shared." },
      { label: "Readability", text: "A Flesch reading ease estimate." },
      { label: "Broken links", text: "Up to 20 links, each tested with a short timeout." },
    ],
    draftly: {
      title: "Fix the next post before it's published",
      points: [
        "Draftly writes each post with a meta title, meta description and slug, and checks the title length as it goes.",
        "Posts use question-style H2 headings in order, link to your own pages and cite one or two real sources.",
        "Every draft gets a human-voice score from 0 to 100, so you can see AI-sounding phrasing before readers do.",
      ],
      cta: "Try it on your next topic. Your first post is free.",
    },
    faqs: [
      {
        q: "How do I check the SEO of a blog post?",
        a: "Paste the post's URL into the checker above. It reads the page the way a search engine does and checks the title, meta description, headings, word count, image alt text, links, schema, canonical tag, share image, readability and broken links.",
      },
      {
        q: "What is a good word count for a blog post?",
        a: "Long enough to answer the question fully. Word count isn't a ranking factor by itself. This checker passes posts over 800 words and warns under that, because short posts rarely cover the follow-up questions a reader has.",
      },
      {
        q: "How long should a meta description be?",
        a: "About 120 to 160 characters. Google cuts longer descriptions off, and very short ones leave out the reason to click.",
      },
      {
        q: "Why does it say a link couldn't be confirmed?",
        a: "Some sites block automated checks or take too long to answer. Those links may work fine in a browser, so we list them separately for you to open by hand.",
      },
      {
        q: "Does the blog SEO checker store my URL?",
        a: "No. The URL and results are used to build your report and then dropped. No AI model reads your post.",
      },
    ],
    ogAlt: "Free blog SEO checker from Draftly: 13 on-page checks for any blog post URL",
    ogLine: "Title, meta, headings, links, schema, readability",
  },
  {
    id: "content-refresh",
    path: "/tools/content-refresh-checker",
    name: "Content refresh checker",
    title: "Free Content Refresh Checker: Find Old and Overlapping Posts",
    description:
      "Find blog posts that need a content refresh. This free checker reads your sitemap, lists posts not updated in 12 months and flags overlapping posts to merge.",
    eyebrow: "Free content refresh checker",
    h1: "Which posts need",
    h1Accent: "a refresh?",
    intro:
      "Enter your website and this checker reads your sitemap, sorts your posts by their last update and flags every post not updated in 12 months or more. It also compares post titles to find posts that cover the same topic, then suggests which to refresh and which to merge.",
    input: { label: "Your website", placeholder: "yourbusiness.com", button: "Find old posts" },
    checks: [
      { label: "Sitemap", text: "Reads up to 200 posts from your sitemap or sitemap index." },
      { label: "Update dates", text: "How many posts have a lastmod date." },
      { label: "Posts not updated in 12+ months", text: "Listed oldest first." },
      { label: "Posts that overlap", text: "Title overlap across the posts, using up to 40 page titles." },
      { label: "Suggested refresh plan", text: "Merge overlapping posts first, then refresh the oldest." },
    ],
    draftly: {
      title: "Refresh old posts without starting from scratch",
      points: [
        "Draftly's WordPress plugin checks the posts you already have for human voice and readability, then suggests edits in your brand's voice.",
        "Edits you approve are saved as a WordPress revision, so you can undo any of them.",
        "Google Search Console and Analytics reports come free on every Draftly plan, so you can see which old posts still get traffic.",
      ],
      cta: "Connect your site free and see which posts still earn clicks.",
    },
    faqs: [
      {
        q: "What is a content refresh?",
        a: "Updating a post that's already published: new facts, current examples, fresh dates and answers to the questions people ask now. It keeps the URL and the links it has earned.",
      },
      {
        q: "How often should I refresh old blog posts?",
        a: "Review anything over a year old, starting with posts that still get traffic. This checker flags posts with no sitemap update in 12 months or more.",
      },
      {
        q: "Should I merge or refresh a post?",
        a: "Merge when two posts answer the same question, so they stop competing. Keep the stronger URL and 301 redirect the other. Refresh when a post is the only one on its topic and has gone out of date.",
      },
      {
        q: "How does the checker find overlapping posts?",
        a: "It reads the titles of up to 40 posts and compares the words they share after dropping filler words. Posts it didn't open are compared by their URL slug. It's a quick first pass, so read each pair before you merge.",
      },
      {
        q: "Why are some dates wrong?",
        a: "The dates come from your sitemap's lastmod field. Some platforms set every lastmod to the same day, or leave it out. If that happens, fix the sitemap so search engines see real update dates too.",
      },
    ],
    ogAlt: "Free content refresh checker from Draftly: find blog posts not updated in 12 months and posts to merge",
    ogLine: "Old posts, overlapping posts, refresh or merge",
  },
  {
    id: "eeat",
    path: "/tools/eeat-checker",
    name: "E-E-A-T checker",
    title: "Free E-E-A-T Checker: Test a Post for Author Expertise Signals",
    description:
      "Free E-E-A-T checker: see if a blog post shows a byline, author page, Person schema, dates, About and Contact pages and citations to trusted sources.",
    eyebrow: "Free E-E-A-T checker",
    h1: "Does your post show",
    h1Accent: "who wrote it?",
    intro:
      "Enter a blog post URL and this checker looks for the trust signals behind E-E-A-T: a visible byline, an author page, Person schema, publish and update dates, About and Contact pages, and links to authoritative sources. Each result explains why it matters and how to fix it.",
    input: {
      label: "Blog post URL",
      placeholder: "yourbusiness.com/blog/your-post",
      button: "Check this post",
      extra: { label: "Homepage (optional)", placeholder: "yourbusiness.com" },
    },
    checks: [
      { label: "Visible author byline", text: "A name on the page, near the post." },
      { label: "Author page", text: "The byline links to a page that loads." },
      { label: "Person schema", text: "Author markup with name, jobTitle and sameAs." },
      { label: "Published and updated dates", text: "On the page or in the article schema." },
      { label: "Citations", text: "Links to government, university, standards and major research sources." },
      { label: "About page", text: "Linked from the post or homepage, and reachable." },
      { label: "Contact page", text: "Linked from the post or homepage, and reachable." },
    ],
    draftly: {
      title: "Put a real author on every post",
      points: [
        "When Draftly publishes to WordPress, it can add an author byline with the writer's name, title, short bio and a link to their profile.",
        "Posts link one or two real sources and your own pages.",
        "Draftly learns your brand's voice from your website, so posts read like the people who run the business.",
      ],
      cta: "Your first post is free. See one written for your site.",
    },
    faqs: [
      {
        q: "What is E-E-A-T?",
        a: "Experience, Expertise, Authoritativeness and Trust. It comes from Google's Search Quality Rater Guidelines and describes what makes content trustworthy. Google says it isn't a ranking factor by itself. The signals behind it help readers, Google and AI tools decide who to trust.",
      },
      {
        q: "How do I show E-E-A-T on a blog post?",
        a: "Name the author, link to an author page with their real experience, date the post, cite your sources, and make it easy to see who runs the site through About and Contact pages.",
      },
      {
        q: "What counts as an authoritative source?",
        a: "This checker counts government, university, standards bodies and major research or news sources, such as .gov and .edu sites, Google's own documentation, Wikipedia and Reuters. A good industry source can be authoritative too, so treat a warning as a prompt to look.",
      },
      {
        q: "Why is my byline marked as missing when I can see it?",
        a: "The checker looks for markup that identifies an author, such as a class or rel=\"author\". If your theme shows the name as plain text, add rel=\"author\" to the link or an author class to the element.",
      },
      {
        q: "Is the E-E-A-T checker free?",
        a: "Yes, with no sign-up. We don't store the URLs you enter or the results, and no AI model reads your pages.",
      },
    ],
    ogAlt: "Free E-E-A-T checker from Draftly: byline, author page, Person schema, dates and citations",
    ogLine: "Byline, author page, schema, dates, citations",
  },
];

export const toolById = (id: ToolId) => FREE_TOOLS.find((t) => t.id === id)!;

export const TOOLS_HUB = {
  path: "/tools",
  title: "Free SEO Tools for Small Business Blogs",
  description:
    "Four free SEO tools for your blog: an AI visibility checker, a blog post SEO checker, a content refresh checker and an E-E-A-T checker. No sign-up.",
};
