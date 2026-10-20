// "The difference" band on each /feature/[slug] page. Every line restates a claim
// already made in lib/features.ts (same facts, same limits); nothing new is claimed here.
import type { FeatureId } from "@/lib/features";
import { SITE_ADDON } from "@/lib/pricing";

export type Difference = {
  /** The usual problem, in one or two sentences. */
  problem: string;
  /** Draftly's approach, in one bold line. */
  approach: string;
  /** Lead-in for the list, e.g. "Every topic is:". */
  lead: string;
  points: [string, string, string, string];
  close: string;
};

/** Keyed by feature id (lib/features.ts), which stays the same when a URL slug changes. */
export const DIFFERENCE: Record<FeatureId, Difference> = {
  "topic-ideas": {
    problem: "Most AI writing tools start with an empty box and ask what you want to write about. Coming up with a topic every week is the part that stalls a blog.",
    approach: "Draftly brings the topics to you, checked against your business first.",
    lead: "Every topic is:",
    points: [
      "Pulled from your industry's news, read every day",
      "Backed by real Google searches and People Also Ask questions on paid plans",
      "Checked against what your website says you sell",
      "Less than three weeks old",
    ],
    close: "Click Add Your Take on a headline and Draftly writes the post.",
  },
  "seo-research": {
    problem: "Keyword data usually lives in a separate SEO tool, with its own login and its own bill.",
    approach: "Draftly puts live search data next to your writing.",
    lead: "Every lookup can show:",
    points: [
      "Search volume, difficulty, intent and trend for a keyword",
      "Google's live first page and its People Also Ask questions",
      "The domains you compete with, found when you add your website",
      "Keyword gaps and backlinks, on Autopilot",
    ],
    close: "Results are cached for 30 days, and repeat lookups from the cache are free.",
  },
  "brand-voice": {
    problem: "A general AI tool writes the same way for everyone, so you end up rewriting each draft to sound like your business.",
    approach: "Draftly sets your voice from your own website on day one.",
    lead: "Every brand voice has:",
    points: [
      "Eight tone sliders, set from your site",
      "Words you always use and words you never use",
      "Your opinions and stances",
      "A history in Brand Memory, with an undo on every change",
    ],
    close: "Move a slider and the next post follows it.",
  },
  "ai-models": {
    problem: "Most writing tools choose one model for you and don't show what each post costs.",
    approach: "Draftly lets you pick the model for each post, with the price shown first.",
    lead: "Every model gets:",
    points: [
      "Your brand voice",
      "The same writing rules checks",
      "The same automatic fix pass",
      "Its credit price shown before you write",
    ],
    close: "Claude Sonnet 5.5 is the default because it sounded the most human in our tests.",
  },
  "writing-rules": {
    problem: "AI drafts repeat the same habits: filler words, numbers with no source, meta titles too long for Google.",
    approach: "Draftly checks every draft with code before you see it.",
    lead: "Every draft is checked for:",
    points: [
      "Banned AI words and phrases",
      "Numbers with no source",
      "Meta title and description lengths",
      "One H1, heading style and link placement",
    ],
    close: "A draft that fails a hard rule gets one automatic fix pass.",
  },
  "ai-detector": {
    problem: "A detector score alone leaves you hunting for the sentences that caused it.",
    approach: "Draftly shows the passages that read like AI and says why.",
    lead: "Every check shows:",
    points: [
      "A Reads as AI score from 0 to 100, lower is better",
      "The passages that pull the score up",
      "The reason for each one, like stock transitions or filler words",
      "Human voice, Readability and SEO scores beside it",
    ],
    close: "Edit then rewrites only the flagged sentences. Numbers, quotes and links stay exactly as written.",
  },
  editor: {
    problem: "Checking copy you already have usually means copying it out of your CMS, into a tool, and back again.",
    approach: "The Editor brings the copy in for you and fixes only what breaks a rule.",
    lead: "Every run:",
    points: [
      "Takes pasted text, a page URL or a post from your CMS",
      "Scores the copy against your writing rules and brand voice",
      "Rewrites only the flagged sentences",
      "Shows the price before it runs",
    ],
    close: "You accept or reject each change.",
  },
  "seo-meta": {
    problem: "Meta titles and descriptions are easy to forget, and easy to get the wrong length.",
    approach: "Draftly writes them with every draft and checks their length.",
    lead: "Every draft comes with:",
    points: [
      "A URL slug",
      "A meta title of 50 to 60 characters",
      "A meta description of 150 to 160 characters",
      "An SEO score out of 100",
    ],
    close: "When you publish, the meta goes to your CMS and SEO plugin with the post.",
  },
  publishing: {
    problem: "Getting a finished post onto your blog usually means copy, paste, reformatting and filling in the SEO fields by hand.",
    approach: "Draftly sends the post to your CMS with everything in place.",
    lead: "Every post goes out with:",
    points: [
      "Its title and body",
      "Its URL slug",
      "Its meta title and meta description",
      "A choice to publish now or send it as a draft",
    ],
    close: "Updating a live post never unpublishes it.",
  },
  autopilot: {
    problem: "A blog only works if it keeps publishing, and writing is the first thing to slip in a busy week.",
    approach: "Autopilot runs the whole job on a schedule you set.",
    lead: "Every scheduled post is:",
    points: [
      "On a topic Draftly picks for you",
      "Written in your brand voice",
      "Run through every check",
      "Published, or held as a draft for you to review",
    ],
    close: "A weekly email lists everything it published.",
  },
  analytics: {
    problem: "Most small-business blogs never learn which posts bring in readers, because the numbers sit in two other Google tools.",
    approach: "Draftly shows your Analytics and Search Console data next to the posts it wrote.",
    lead: "Every connection is:",
    points: [
      "Free on every plan, including Free",
      "Read-only access to your Google accounts",
      "Set up per website",
      "Shown beside the posts Draftly wrote",
    ],
    close: "See which searches bring people to your site and what they do next.",
  },
  mcp: {
    problem: "If you already write with Claude or ChatGPT, it doesn't know your brand voice, your topics or your rules.",
    approach: "The Draftly connector gives your AI all three.",
    lead: "Every connected AI gets:",
    points: [
      "Your brand voice",
      "Topic ideas for your business",
      "Your writing checks",
      "Live SEO data, on paid plans",
    ],
    close: "Drafts are checked against your rules and saved to Draftly, ready to publish.",
  },
  "wordpress-plugin": {
    problem: "Posts already in WordPress rarely get a second look, and fixing them means copying each one out to another tool.",
    approach: "The Draftly plugin checks and fixes posts inside WordPress.",
    lead: "Every suggestion is:",
    points: [
      "Checked against your writing rules",
      "Written in your brand voice",
      "Yours to approve or skip",
      "Undone exactly with Revert",
    ],
    close: "It works with Yoast SEO, Rank Math and All in One SEO.",
  },
  teams: {
    problem: "Per-seat pricing makes the bill grow every time someone joins.",
    approach: "Draftly includes your team in the plan price.",
    lead: "Every extra website gets:",
    points: [
      "Its own brand voice",
      "Its own writing rules",
      "Its own topics",
      `${SITE_ADDON.credits} monthly credits`,
    ],
    close: `Each extra website is $${SITE_ADDON.price} a month.`,
  },
};
