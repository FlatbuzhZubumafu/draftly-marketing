// The /features hub's question sections. Each heading is a question people ask in
// search (People Also Ask, Reddit, Quora; sources below, checked 2026-10-20). Each
// answer only restates what lib/features.ts and the homepage already claim.
import type { ArtName } from "@/components/feature-art/FeatureArt";
import type { CategoryId, FeatureId } from "@/lib/features";
import { GUIDE_SHOTS, INTEGRATIONS_SHOT, STEP_SHOTS, type ProductShot } from "@/lib/product-shots";

/** A run of answer text: plain words, or a link to a feature page by feature id. */
export type Seg = string | { id: FeatureId; text: string };

export type PainPoint = {
  id: string;
  question: string;
  /** Answer-first paragraphs. */
  answer: Seg[][];
  /** Feature ids shown as chips under the answer. */
  features: FeatureId[];
  tint: CategoryId;
  graphic: { shot: ProductShot } | { art: ArtName; caption: string };
  /** Where the question came from, for the PR and future edits. Not rendered. */
  evidence: string[];
};

export const PAIN_POINTS: PainPoint[] = [
  {
    id: "sound-human",
    question: "How do I make AI writing sound human?",
    answer: [
      [
        "Remove the habits that give it away, then reread it. AI drafts lean on stock transitions, filler words, three-item lists and sentences that are all the same length.",
      ],
      [
        "Draftly checks every draft for those patterns before you see it, and a draft that fails a rule gets one automatic fix pass. That's the ",
        { id: "writing-rules", text: "writing rules checker" },
        ". For copy you already have, the ",
        { id: "ai-detector", text: "AI detection score" },
        " shows which passages read like AI, and the ",
        { id: "editor", text: "AI copy editor" },
        " rewrites only those sentences.",
      ],
    ],
    features: ["writing-rules", "ai-detector", "editor"],
    tint: "check",
    graphic: { shot: GUIDE_SHOTS.genericVsDraftly },
    evidence: [
      "Google SERP for \"how to make ai writing sound human\" (DataForSEO, 2026-10-20): PAA \"How do I humanize AI text manually?\" and \"Can you make AI sound more human?\"",
      "r/SEO thread ranking #2: https://www.reddit.com/r/SEO/comments/1dq1kvm/how_to_make_ai_content_pass_as_human_written/",
    ],
  },
  {
    id: "brand-voice",
    // Was "Can I train AI to write in my brand voice?". /feature/brand-voice now owns that
    // PAA question ("How to train AI on your brand voice"), so the hub takes its sibling.
    question: "How do I adapt AI writing to my brand voice?",
    answer: [
      [
        "Start from your own website. Draftly reads your website and sets eight tone sliders from it, then fills in what you sell and who you sell to. Every post and every edit uses that ",
        { id: "brand-voice", text: "brand voice" },
        ".",
      ],
      [
        "You can move any slider, list words you always or never use, and type changes in plain words. Your ratings and edits nudge the voice a few points at a time, and Brand Memory lets you undo any change. If you write in Claude or ChatGPT, the ",
        { id: "mcp", text: "Draftly connector" },
        " gives them the same voice.",
      ],
    ],
    features: ["brand-voice", "mcp"],
    tint: "write",
    graphic: { shot: GUIDE_SHOTS.brandVoice },
    evidence: [
      "Google SERP for \"how to make ai write in your brand voice\" (DataForSEO, 2026-10-20): PAA \"Is it how do I adapt AI written text to my brand voice?\" and \"Can I train an AI to use my voice?\"; related search \"How to make ai write in your brand voice reddit\"",
      "r/DigitalMarketing thread ranking #2: https://www.reddit.com/r/DigitalMarketing/comments/1kqj2s1/use_this_prompt_to_create_a_simple_brand_voice/",
    ],
  },
  {
    id: "find-topics",
    question: "How do I find blog topics for my business?",
    answer: [
      [
        "Start with what your customers are reading and searching for. Draftly reads your industry's news every day and, on paid plans, adds topics from real Google searches with the search volume and difficulty attached.",
      ],
      [
        "Each idea is checked against your website first, so old news, competitor announcements and off-topic ideas are dropped before you see them. Pick one of the ",
        { id: "topic-ideas", text: "blog topic ideas" },
        " and Draftly writes the post. To check a keyword before you write, use Draftly's ",
        { id: "seo-research", text: "keyword research" },
        ".",
      ],
    ],
    features: ["topic-ideas", "seo-research"],
    tint: "topics",
    graphic: { shot: STEP_SHOTS[1] },
    evidence: [
      "Google SERP for \"how to come up with blog topics for my business\" (DataForSEO, 2026-10-20): PAA \"How can I find blog topics?\"; related search \"How to come up with blog topics for my business reddit\"",
    ],
  },
  {
    id: "made-up-stats",
    question: "How do I stop AI from making up statistics?",
    answer: [
      [
        "Give the writer real sources and check every number against them. Draftly's ",
        { id: "writing-rules", text: "writing rules" },
        " fail any number with no source, and the checker compares the figures in a post with the sources the writer was given, so a made-up statistic gets flagged.",
      ],
      [
        "When the ",
        { id: "editor", text: "AI copy editor" },
        " rewrites a sentence, it drops any change to a number, quote or link. Someone who knows your business should still read each post before it goes live.",
      ],
    ],
    features: ["writing-rules", "editor"],
    tint: "check",
    graphic: { art: "stat-check", caption: "A number with no source fails the check before you see the draft." },
    evidence: [
      "Google SERP for \"chatgpt making up statistics in blog posts\" (DataForSEO, 2026-10-20): PAA \"Is ChatGPT good at statistics?\"",
      "OpenAI community thread \"Can you stop it from making up sources?\": https://community.openai.com/t/can-you-stop-it-from-making-up-sources/18600",
    ],
  },
  {
    id: "publish-wordpress",
    question: "Can AI write and publish posts to my WordPress site?",
    answer: [
      [
        "Yes. Connect WordPress once and Draftly ",
        { id: "publishing", text: "publishes a finished post" },
        " with its title, slug, meta title and meta description in place, or sends it as a draft for you to review first. Shopify, Webflow, Ghost, Squarespace and HubSpot work the same way.",
      ],
      [
        "On the Autopilot plan, ",
        { id: "autopilot", text: "automated blogging" },
        " picks the topics, writes the posts and publishes them to WordPress or Shopify on a schedule you set. A weekly email lists everything that went out.",
      ],
    ],
    features: ["publishing", "autopilot", "wordpress-plugin"],
    tint: "publish",
    graphic: { shot: INTEGRATIONS_SHOT },
    evidence: [
      "Quora question ranking #2 for \"how to automatically post blog to wordpress with ai\" (DataForSEO, 2026-10-20): \"Is there an AI software that will write content for my WordPress website and publish it automatically?\" https://www.quora.com/Is-there-an-AI-software-that-will-write-content-for-my-WordPress-website-and-publish-it-automatically",
    ],
  },
];

/** An answer as plain text, for FAQPage JSON-LD. */
export const answerText = (p: PainPoint) => p.answer.map((para) => para.map((s) => (typeof s === "string" ? s : s.text)).join("")).join(" ");
