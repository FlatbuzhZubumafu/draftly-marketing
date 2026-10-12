import type { WPFaq } from "./graphql";
import { APP_MODELS } from "./app-models";
import { PAID_PLANS } from "./pricing";

// Homepage questions that live in code because their answers come from data
// here (credit prices) or from the app's writing rules. The rest of the FAQ is
// edited in WordPress. A WordPress question with the same title replaces one of these.

const defaultModel = APP_MODELS.find((m) => m.note?.startsWith("default")) ?? APP_MODELS[0];
const premium = Math.max(...APP_MODELS.map((m) => m.credits));
const budget = APP_MODELS.reduce((a, b) => (b.credits < a.credits ? b : a));
const starter = PAID_PLANS[0];
const starterCredits = starter.credits.replace(/ credits.*/, "");
const starterPosts = starter.posts.replace(/\D+/g, "");

export const CODE_FAQS: WPFaq[] = [
  {
    // Credit prices: model_catalog and credit_costs in production, mirrored in lib/app-models.ts.
    title: "How far do my credits go?",
    answer:
      `A post on the default model, ${defaultModel.name}, uses ${defaultModel.credits} credits, so ${starter.name}'s ` +
      `${starterCredits} monthly credits cover about ${starterPosts} posts. Premium models such as Claude Opus 5.5 and ` +
      `GPT 5.5 use ${premium} credits a post, about ${(premium / defaultModel.credits).toFixed(1)} times as much, and ` +
      `${budget.name} uses ${budget.credits}. An AI image inside a post costs 53 credits. The pricing page lists every cost.`,
  },
  {
    // What the app actually does: the no_fabrication and attribution prompt rules
    // (supabase/functions/_shared/writing-rules.ts) and the unsourced_numbers and
    // link_unlisted_external checks with one repair call (_shared/post-checks.ts).
    title: "Are the facts checked?",
    answer:
      "Draftly tells the writer never to invent statistics, studies, quotes or details about your business, and to " +
      "name the source of any figure in the sentence that uses it. After the draft is written, a checker compares " +
      "the figures in the post with the news story and site material the writer was given, and flags links to " +
      "outside pages that weren't among those sources. Draftly makes one repair pass on anything flagged. The checker " +
      "can't confirm that every sentence is true, so read the post before you publish.",
  },
];

/** WordPress FAQs followed by the code ones, without repeating a question. */
export function withCodeFaqs(wp: WPFaq[]): WPFaq[] {
  const titles = new Set(wp.map((f) => f.title.trim().toLowerCase()));
  return [...wp, ...CODE_FAQS.filter((f) => !titles.has(f.title.trim().toLowerCase()))];
}
