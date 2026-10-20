// Copy and settings for the free SEO tools at /tools. One source for the pages,
// the /tools hub, the sitemap, llms.txt and the share images. The checks
// themselves live in lib/tools (server only).
//
// Slugs follow US search demand (Ahrefs, 2026-10-13): ai visibility checker 1,600
// (KD 2), ai search visibility checker 600, llm visibility checker 450; blog seo
// checker 400, blog post seo checker 90; content refresh 350; e-e-a-t checker 100,
// eeat checker 50, eeat audit 40; faq schema generator 600 (KD 4, 2026-10-15); seo
// content brief template 700 (KD 7), ai content brief generator 300 (KD 3), content
// brief generator 200 (KD 5); blog ideas generator 300 (KD 18), blog topic generator 80;
// ai content detector 14,800 (KD 79), ai detector and humanizer 1,900 (KD 51) (DataForSEO,
// 2026-10-20). The AI content detector is the app's statistical detector, ported to
// lib/tools/ai-detect and run in the browser; its URL mode only fetches the article text.
// The four checkers are deterministic: no AI model sees the URL or the results. The FAQ
// schema generator runs entirely in the browser (lib/tools/faq-schema.ts). The content
// brief and blog ideas generators make one GPT 6 Luna call each and are off unless
// TOOLS_AI_GATEWAY_API_KEY is set.
import type { Faq } from "@/components/ArticleParts";

export type CheckerId = "ai-visibility" | "blog-seo" | "content-refresh" | "eeat";
/** The AI-written generators. The FAQ schema generator is a browser-only generator. */
export type GeneratorId = "content-brief" | "blog-ideas";
export type ToolId = CheckerId | GeneratorId | "faq-schema" | "ai-detector";

export type FreeTool = {
  id: ToolId;
  /** "checker" (default) fetches a URL through /api/tools; "generator" runs in the browser; "detector" scores text in the browser. */
  kind?: "checker" | "generator" | "detector";
  /** Sign-up link intent (?intent=...), so the app can open on the right screen. */
  registerIntent?: string;
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
  /** Checker form. A generator only uses `button`, as the call to action on its /tools card. */
  input: { label: string; placeholder: string; button: string; extra?: { label: string; placeholder: string } };
  /** One line per check (or feature, for a generator), for the "What it checks" list. */
  checks: { label: string; text: string }[];
  checksHeading?: string;
  checksNote?: string;
  /** How Draftly relates to what this tool finds. Only facts the app supports. */
  draftly: { title: string; points: string[]; cta: string; /** Button label; defaults to the site's hero CTA. */ button?: string };
  /** Optional extra sections shown after "What this checker looks at". */
  sections?: { id: string; heading: string; paragraphs: string[]; sources?: { label: string; href: string }[] }[];
  faqs: Faq[];
  ogAlt: string;
  ogLine: string;
};

export const TOOLS_DATE = { iso: "2026-10-13", label: "October 2026" };

export const FREE_TOOLS: FreeTool[] = [
  {
    id: "ai-detector",
    kind: "detector",
    registerIntent: "detector",
    path: "/tools/ai-content-detector",
    name: "AI content detector",
    title: "Free AI content detector: check if text reads like AI",
    description:
      "Free AI content detector and AI checker. Paste text or a URL to get a 0 to 100 score, the signals behind it and the sentences that read like AI. No sign-up.",
    eyebrow: "Free AI detector, no sign-up",
    h1: "Free AI content detector: does your text",
    h1Accent: "read like AI?",
    intro:
      "Paste your text or enter a URL and this free AI checker scores how much the writing reads like AI, from 0 to 100. It shows the signals behind the score and highlights the sentences that pull it up, with the reasons for each. Pasted text is scored in your browser and never leaves your device.",
    input: { label: "Text to check", placeholder: "Paste a blog post, page or email here.", button: "Check for AI writing" },
    checksHeading: "What the AI detector measures",
    checksNote:
      "A small statistical model weighs these signals. No AI model reads your text, so the same text always gets the same score. Treat the score as a list of sentences to reread: no detector can prove who wrote something.",
    checks: [
      { label: "Burstiness", text: "How much sentence lengths vary. People mix short and long sentences; unedited AI text keeps them even." },
      { label: "AI-typical words", text: "Crucial, ensure, leverage, seamless, \"plays a key role\" and over 100 more, counted per 100 words." },
      { label: "Stock transitions", text: "Sentences that open with Additionally, Moreover, Furthermore or Ultimately." },
      { label: "Three-item lists", text: "Lists of three short items used for rhythm, like \"comfort, safety, and peace of mind\"." },
      { label: "Repeated openers", text: "Many sentences that start with the same word." },
      { label: "Specifics", text: "Names, places, numbers and quotes. Generic sentences with none of them score higher." },
      { label: "Contractions and punctuation", text: "No don't or it's in a long text, and nothing but commas and periods." },
      { label: "Flagged sentences", text: "The sentences in high-scoring passages that carry the most tells, each with its reasons." },
    ],
    sections: [
      {
        id: "how-the-score-works",
        heading: "How the AI score works",
        paragraphs: [
          "The detector splits your text into passages of at least 45 words and three sentences, measures the signals above in each one and in the whole text, and turns them into a score from 0 to 100. Under 40 reads as likely human, 40 to 69 is mixed, and 70 or more reads as likely AI.",
          "A passage that scores 65 or more is flagged, and its sentences with the most tells are highlighted. Headings, block quotes, code and tables are skipped. With little text the score is pulled down toward human, so a two-sentence paragraph can never be called AI on its own.",
          "Confidence depends on length: low under 150 words, medium up to 399 and high from 400. It's the same detector Draftly runs in the app as the Reads as AI score, so a post scores the same here and there.",
        ],
      },
      {
        id: "can-a-detector-prove-ai",
        heading: "Can an AI detector prove who wrote something?",
        paragraphs: [
          "No. Detectors like this one measure how a text is written, and people write in many ways. Plain, formulaic or non-native English can score high even when a person wrote every word, and AI text that someone edited can score low.",
          "OpenAI withdrew its own AI text classifier in 2023 because of its low accuracy, and a Stanford study found popular detectors flagged essays by non-native English writers far more often than essays by native speakers.",
          "So don't use the score to accuse a student, a freelancer or an employee. Use it to find the sentences that sound generic, then rewrite them.",
        ],
        sources: [
          { label: "OpenAI on its AI classifier", href: "https://openai.com/index/new-ai-classifier-for-indicating-ai-written-text/" },
          { label: "Liang et al., GPT detectors are biased against non-native English writers", href: "https://arxiv.org/abs/2304.02819" },
        ],
      },
      {
        id: "ai-detector-and-humanizer",
        heading: "From AI detector to humanizer: fixing flagged sentences",
        paragraphs: [
          "Each flagged sentence comes with its reasons, and most fixes are small. Swap the stock word for the plain one. Cut the transition. Replace the three-item list with the one item that matters. Add the name, the number or the example only you know.",
          "Then vary the rhythm: split one long sentence, join two short ones. Paste the result back in and check again.",
          "Draftly's Editor does this for you. It runs the same check, rewrites only the flagged sentences and keeps numbers, quotes and links exactly as written. You keep or reject each change.",
        ],
      },
    ],
    draftly: {
      title: "Fix the flagged sentences in Draftly",
      points: [
        "Draftly runs this same detector as the Reads as AI score, next to Human voice, Readability and SEO scores.",
        "Edit rewrites only the flagged sentences. Numbers, quotes and links stay exactly as written, and you keep or reject each change.",
        "Bring in copy by pasting it, entering a page URL or pulling a post from your connected CMS.",
      ],
      cta: "Free first post. No credit card.",
      button: "Fix the flagged sentences",
    },
    faqs: [
      {
        q: "Is this AI content detector free?",
        a: "Yes, with no sign-up. Pasted text is scored in your browser, so there's no limit on how often you check it. Checking a URL uses our server to fetch the page, so each visitor can run a few URL checks a minute and about 30 an hour.",
      },
      {
        q: "How accurate is this AI detector?",
        a: "We haven't tested it against a public benchmark, so we don't quote an accuracy figure. It's a statistical model tuned by hand on sample texts. It's good at spotting unedited AI drafts and generic copy, and it can be wrong on plain human writing. Read it as a list of sentences to look at again.",
      },
      {
        q: "What does the AI detector look for?",
        a: "Sentence length variety (burstiness), AI-typical words and phrases, stock transitions like Additionally and Moreover, decorative three-item lists, sentences that open the same way, few names or numbers, no contractions, flat punctuation and sentences that all run about 20 words.",
      },
      {
        q: "What is burstiness in AI detection?",
        a: "How much sentence lengths vary. People write a four-word sentence, then a thirty-word one. Unedited AI text tends to keep every sentence about the same length, and this detector counts that as one of its strongest signals.",
      },
      {
        q: "Is my text stored or used for training?",
        a: "No. Pasted text is scored in your browser and never sent to Draftly. For a URL, our server fetches the page, pulls out the article text and sends it back to your browser to score. We don't store the URL, the text or the result, and no AI model reads it.",
      },
      {
        q: "Why does my own writing score as AI?",
        a: "Writing that is plain, even and generic shares traits with AI text: sentences of the same length, stock transitions, no names or numbers. Templates, product copy and non-native English often score higher for that reason. Short texts are less reliable too.",
      },
      {
        q: "How much text do I need?",
        a: "At least 45 words and three sentences. Under that, the tool says the text is too short to score reliably. 150 words gives medium confidence and 400 or more gives high confidence.",
      },
      {
        q: "Can it tell if text came from ChatGPT, Claude or Gemini?",
        a: "It doesn't name a model. It measures traits common in unedited output from any of them. Text that a person has edited, or a model told to write with specifics and varied sentences, can score as human.",
      },
    ],
    ogAlt: "Free AI content detector from Draftly: a Reads as AI score from 0 to 100 with the flagged sentences highlighted",
    ogLine: "A 0 to 100 AI score and the sentences behind it",
  },
  {
    id: "ai-visibility",
    path: "/tools/ai-visibility-checker",
    name: "AI visibility checker",
    title: "Free AI Visibility Checker: Can ChatGPT Read Your Site?",
    description:
      "Check if ChatGPT, Claude, Perplexity and Google AI Overviews can crawl and cite your site. Tests robots.txt, bot access, noindex, sitemap and schema.",
    eyebrow: "Free tool for ChatGPT, Claude and Google",
    h1: "AI Visibility Checker: can AI assistants read",
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
    sections: [
      {
        id: "ai-overview-checker",
        heading: "Is this an AI Overview checker?",
        paragraphs: [
          "Partly. Google builds AI Overviews from pages Googlebot crawls, so this checker tests the two things that keep a site out: a Googlebot block in robots.txt, and a noindex or nosnippet tag on the homepage.",
          "Google-Extended only controls Gemini training and grounding. AI Overviews follow Googlebot's rules, which is why the checker lists them separately.",
          "It won't tell you whether you show up in an AI Overview today, or what ChatGPT says about you. That takes a tracker that runs real searches. Run this first, though. If the bots can't read your site, there's nothing for a tracker to find.",
        ],
      },
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
        q: "Is this an AI Overview checker?",
        a: "It checks whether Google can use your homepage in AI Overviews: Googlebot access in robots.txt, plus noindex and nosnippet tags. It doesn't track whether you appear in an AI Overview for a search. That needs a rank tracker.",
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
    title: "Free E-E-A-T Checker: Test a Post for Author Signals",
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
  {
    id: "faq-schema",
    kind: "generator",
    path: "/tools/faq-schema-generator",
    name: "FAQ schema generator",
    title: "Free FAQ Schema Generator: FAQPage JSON-LD and HTML",
    description:
      "Build FAQPage JSON-LD and a matching FAQ block in HTML. Add, reorder and edit questions, then copy the code. Runs in your browser. Free, no sign-up.",
    eyebrow: "Free tool for FAQ sections",
    h1: "FAQ Schema Generator for",
    h1Accent: "any page",
    intro:
      "Type your questions and answers and this generator writes the FAQPage JSON-LD and a matching FAQ block in HTML. Paste both into your page. It runs in your browser, so nothing you type leaves it.",
    input: { label: "", placeholder: "", button: "Build my FAQ schema" },
    checksHeading: "What the generator does",
    checksNote: "Everything runs in your browser. Nothing you type is sent to Draftly or stored.",
    checks: [
      { label: "FAQPage JSON-LD", text: "A schema.org FAQPage with a Question and Answer for each pair, in a script tag ready to paste." },
      { label: "Matching visible HTML", text: "A details and summary block with the same questions and answers, so readers see what the markup says." },
      { label: "Clean answer HTML", text: "Keeps headings, paragraphs, line breaks, lists, links, bold and italic. Strips every other tag and attribute." },
      { label: "Escaped output", text: "Characters that could break the script tag or the page are escaped." },
      { label: "Warnings as you type", text: "Flags a question without an answer, repeated questions and answers over 120 words." },
      { label: "Edit existing markup", text: "Paste FAQ JSON-LD from any page to load it back in and change it." },
    ],
    sections: [
      {
        id: "google-faq-rich-results",
        heading: "Does Google still show FAQ rich results?",
        paragraphs: [
          "No. Google stopped showing FAQ rich results on May 7, 2026, and removed the FAQ documentation in June. Since 2023 they had only appeared for well-known government and health sites.",
          "So FAQ markup won't put expandable questions under your search result. If someone sells it to you that way, they're out of date.",
        ],
        sources: [{ label: "Google Search Central documentation changelog", href: "https://developers.google.com/search/updates" }],
      },
      {
        id: "why-add-faq-schema",
        heading: "Why add FAQ markup anyway",
        paragraphs: [
          "FAQPage is still a valid schema.org type. Any crawler that reads JSON-LD can pick out your questions and answers without guessing from the layout, and that includes the bots behind AI search tools.",
          "No search engine or AI company has promised to rank or cite a page more because of it. Think of the markup as a clear label on content that has to be good on its own.",
          "The part that does the work is the FAQ itself. Real questions your customers ask, each with a short, direct answer, are easy for a reader to scan and easy for an AI assistant to quote.",
        ],
      },
      {
        id: "how-to-add-faq-schema",
        heading: "How to add FAQ schema to a page",
        paragraphs: [
          "Add your questions and answers above. Copy the visible HTML into the page where you want the FAQ to show.",
          "Copy the JSON-LD script tag into the same page, in the head or anywhere in the body. In WordPress, a Custom HTML block works for both.",
          "Keep the two in sync. Google's structured data guidelines say markup should only describe content readers can see on the page, and that applies to every schema type.",
          "Then check the page with the Schema Markup Validator at validator.schema.org.",
        ],
        sources: [
          { label: "Google's general structured data guidelines", href: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies" },
          { label: "Schema Markup Validator", href: "https://validator.schema.org/" },
        ],
      },
    ],
    draftly: {
      title: "Draftly writes the post and its FAQ",
      points: [
        "Draftly writes blog posts in your brand's voice. With the FAQ setting on (it is by default), a post's FAQ uses questions readers actually ask, answered from the post itself.",
        "Every FAQ answer is checked for length. Answers over three sentences get flagged before you publish.",
        "Drop the finished FAQ into this generator for the schema, and publish the post to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.",
      ],
      cta: "Your first post is free. No credit card.",
    },
    faqs: [
      {
        q: "Is the FAQ schema generator free?",
        a: "Yes, with no sign-up. It runs in your browser, so nothing you type is sent to Draftly or stored.",
      },
      {
        q: "Does FAQ schema still work in Google?",
        a: "Google stopped showing FAQ rich results on May 7, 2026. The markup is still valid schema.org, and other crawlers, including AI search bots, can read it.",
      },
      {
        q: "Where do I put FAQ schema on a page?",
        a: "Paste the script tag into the page's HTML, in the head or the body. Put the visible FAQ where readers will see it. Both should have the same questions and answers.",
      },
      {
        q: "Can I use HTML in FAQ answers?",
        a: "A little. The generator keeps headings, paragraphs, line breaks, lists, links, bold and italic, the tags Google's FAQ documentation allowed. Other tags are removed and their text kept. Questions are plain text.",
      },
      {
        q: "How many questions should an FAQ have?",
        a: "Three to eight is typical. Use questions customers really ask you, and answer each one in one to three sentences.",
      },
      {
        q: "Can I add FAQ schema to every page?",
        a: "Only to pages with a real FAQ that readers can see. Questions invented to repeat a keyword don't help the reader, and they won't help the page.",
      },
    ],
    ogAlt: "Free FAQ schema generator from Draftly: FAQPage JSON-LD and matching FAQ HTML",
    ogLine: "FAQPage JSON-LD and matching FAQ HTML",
  },
  {
    id: "content-brief",
    kind: "generator",
    path: "/tools/content-brief-generator",
    name: "Content brief generator",
    title: "Free AI Content Brief Generator and SEO Brief Template",
    description:
      "Enter a keyword and get an SEO content brief: search intent, title, meta description, H2 outline, questions to answer and sources. Free template too.",
    eyebrow: "Free AI content brief generator",
    h1: "Content brief generator for",
    h1Accent: "your next post",
    intro:
      "Type the keyword you want to rank for and get a content brief a writer can work from. It gives you the search intent, a title and meta description, an H2 outline, the questions to answer and the sources to cite. Add your website and it suggests internal links from your own sitemap.",
    input: {
      label: "Target keyword",
      placeholder: "water heater repair cost",
      button: "Write my brief",
      extra: { label: "Your website (optional)", placeholder: "yourbusiness.com" },
    },
    checks: [
      { label: "Search intent", text: "What the person searching wants, and which kind of page fits." },
      { label: "Title and meta description", text: "A working title under 60 characters and a 120 to 155 character description." },
      { label: "H2 outline", text: "Five to seven sections in reading order, each with the points it has to make." },
      { label: "Questions to answer", text: "The follow-up questions people ask about the topic." },
      { label: "What ranking pages cover", text: "The subtopics a page usually needs to compete for the search." },
      { label: "Sources to cite", text: "Which claims need a source and where to find one. No made-up stats." },
      { label: "Word count range", text: "A realistic length for the search intent." },
      { label: "Internal links", text: "Pages from your own sitemap to link to, if you add your website." },
    ],
    sections: [
      {
        id: "where-the-brief-comes-from",
        heading: "Where the brief comes from",
        paragraphs: [
          "An AI model (GPT 6 Luna, the same default model Draftly uses to write posts) builds the brief from your keyword and, if you add it, your homepage and sitemap. Internal links are limited to real URLs from your sitemap, so it can't invent a page you don't have.",
          "It doesn't pull live Google results. The \"what ranking pages cover\" list comes from the model's general knowledge of the topic, so search the keyword yourself and check the outline against the top five pages before you write.",
          "It also won't make up numbers. Where the post needs a price, a statistic or a rule, the brief tells you what kind of source to cite.",
        ],
      },
    ],
    draftly: {
      title: "Draftly turns the brief into the post",
      points: [
        "Draftly writes the whole post in your brand's voice, built from your website.",
        "Every post is checked against your writing rules, like keyword placement, meta lengths, banned AI words and unsourced numbers, and gets one automatic fix pass.",
        "Growth and Autopilot plans add live Google results and People Also Ask data for your keywords.",
        "It publishes to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.",
      ],
      cta: "Your first post is free. Paste your URL and Draftly writes it in your brand's voice.",
    },
    faqs: [
      {
        q: "What is a content brief?",
        a: "A one-page plan for a single piece of content. It names the keyword and search intent, then gives the writer a title, an outline, the questions to answer and the sources to use, so the draft matches what people are searching for.",
      },
      {
        q: "What should an SEO content brief include?",
        a: "The target keyword and intent, a working title and meta description, a word count range, an H2 outline with the points each section makes, the questions to answer, what ranking pages cover, sources to cite and internal links. The free template on this page has a slot for each.",
      },
      {
        q: "Does this content brief generator use live Google results?",
        a: "No. An AI model writes the brief from your keyword and your site. Check the outline against the pages ranking today before you write. Draftly's Growth and Autopilot plans use live Google and People Also Ask data.",
      },
      {
        q: "Is the content brief generator free?",
        a: "Yes, with no sign-up. Each visitor can write a few briefs an hour and about 20 a day, because every brief costs us a little to run. We don't store your keyword, your URL or the brief.",
      },
      {
        q: "Can I use the template without the generator?",
        a: "Yes. Copy it or download it as a Markdown file and fill it in by hand. It has the same sections the generator fills in.",
      },
    ],
    ogAlt: "Free AI content brief generator from Draftly: search intent, outline, questions and sources for any keyword",
    ogLine: "Intent, outline, questions, sources, internal links",
  },
  {
    id: "blog-ideas",
    kind: "generator",
    path: "/tools/blog-ideas-generator",
    name: "Blog ideas generator",
    title: "Free Blog Ideas Generator: 10 Post Ideas for Your Site",
    description:
      "Enter your website or industry and get 10 blog post ideas fitted to your customers, including timely ones for the next three months. No sign-up.",
    eyebrow: "Free blog topic generator",
    h1: "Blog ideas generator:",
    h1Accent: "10 posts worth writing",
    intro:
      "Enter your website and this tool reads your homepage and sitemap, then suggests 10 blog post ideas your customers would search for. It skips topics you've already covered and adds a few timely ones for the next three months. No website yet? Type your industry instead.",
    input: { label: "Your website or industry", placeholder: "yourbusiness.com or plumbing", button: "Get 10 ideas" },
    checks: [
      { label: "Fitted to your business", text: "Ideas come from what your homepage says you do and who you serve." },
      { label: "Skips what you've written", text: "Ideas that repeat a post in your sitemap are dropped." },
      { label: "Timely ideas", text: "At least two tied to the next three months." },
      { label: "A mix of post types", text: "How-to, cost, comparison, checklist, mistakes, seasonal and FAQ posts." },
      { label: "An angle for each", text: "One sentence on the take that makes the post worth reading." },
      { label: "Who it's for", text: "The reader each post is written for." },
    ],
    sections: [
      {
        id: "how-the-ideas-are-picked",
        heading: "How the ideas are picked",
        paragraphs: [
          "An AI model (GPT 6 Luna) reads your homepage text, headings and the page list from your sitemap, then suggests posts your customers would look for. We compare its titles with your existing posts and drop close matches.",
          "It doesn't see your search data or live Google results, so treat the list as a starting point. If an idea fits your business, search it yourself to see what's already ranking.",
        ],
      },
    ],
    draftly: {
      title: "Pick an idea and Draftly writes it",
      points: [
        "Draftly suggests timely topics from your industry's news, scored for fit with your business.",
        "It writes the post in your brand's voice and checks it against your writing rules before you see it.",
        "It publishes to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.",
      ],
      cta: "Your first post is free. Paste your URL and Draftly writes it in your brand's voice.",
    },
    faqs: [
      {
        q: "How do I come up with blog post ideas for my business?",
        a: "Start with the questions customers ask before they buy: what it costs, how long it takes, which option fits them and what goes wrong. Add a few posts tied to the season. This generator does that from your website and drops ideas you've already written.",
      },
      {
        q: "Is the blog ideas generator free?",
        a: "Yes, with no sign-up. Each visitor can run it a few times an hour and about 20 times a day, because every run costs us a little. We don't store your URL, your topic or the ideas.",
      },
      {
        q: "Does it read my whole website?",
        a: "No. It reads your homepage and the list of pages in your sitemap, which is enough to tell what you do and what you've already written about.",
      },
      {
        q: "Are the ideas written by AI?",
        a: "Yes, by GPT 6 Luna. We check them for repeats and for filler words, but read them with your own judgment. You know your customers better than a model does.",
      },
    ],
    ogAlt: "Free blog ideas generator from Draftly: 10 post ideas fitted to your website",
    ogLine: "10 ideas from your website, with an angle for each",
  },
];

export const toolById = (id: ToolId) => FREE_TOOLS.find((t) => t.id === id)!;

export const TOOLS_HUB = {
  path: "/tools",
  title: "Free SEO Tools for Small Business Blogs",
  description:
    "Eight free blog tools: an AI content detector, AI visibility, blog SEO, content refresh and E-E-A-T checkers, plus FAQ schema, brief and blog ideas generators.",
};
