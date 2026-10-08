// Draftly's writing-rule check, as the marketing pages describe it.
//
// BANNED_SAMPLE mirrors part of AI_VOCABULARY in the app's
// supabase/functions/_shared/writing-rules.ts. The limits the pages quote (meta
// title 50 to 60 characters, meta description 150 to 160, one H1, keyword
// placement, the CTA link) come from supabase/functions/_shared/post-checks.ts in
// the draftly.blog repo. Change those first, then this.
//
// RULE_CHECK_TEST and the excerpts below come from the 20-brief run of
// 2026-10-08 (benchmark-runs/cheap-2026-10-08: summary.md, out/draft and
// out/repair-self). The businesses in that run are made up. Excerpts are verbatim.

export const RULE_CHECK_TEST = {
  date: "October 8, 2026",
  iso: "2026-10-08",
  briefs: 20,
  model: "GPT 6 Luna",
  passAfterFix: 95,
  previousModel: "GPT 5.4 Mini",
  previousPassAfterFix: 0,
} as const;

/** A sample of AI_VOCABULARY, the terms Draftly's default rules ban. */
export const BANNED_SAMPLE: { label: string; terms: string[] }[] = [
  { label: "Adjectives", terms: ["seamless", "robust", "cutting-edge", "game-changing", "comprehensive", "holistic", "crucial", "pivotal"] },
  { label: "Verbs", terms: ["leverage", "elevate", "unlock", "empower", "streamline", "harness", "delve", "underscore"] },
  { label: "Nouns", terms: ["solutions", "ecosystem", "synergy", "landscape", "journey", "tapestry", "testament", "game-changer"] },
  {
    label: "Phrases",
    terms: ["let's dive in", "it's worth noting", "at the end of the day", "when it comes to", "look no further", "in today's fast-paced world"],
  },
];

export type RuleExample = {
  rule: string;
  business: string;
  detail: string;
  before: string;
  after: string;
  note?: string;
};

export const EXAMPLES: RuleExample[] = [
  {
    rule: "Keyword in the first 100 words",
    business: "Summit Ridge Roofing, a made-up roofer in Boise",
    detail: "The target keyword, “roof replacement timeline”, was missing from the opening and from every H2.",
    before: "On Summit Ridge Roofing crews, most single-family asphalt tear-offs take one to two working days.",
    after:
      "The roof replacement timeline for most single-family asphalt tear-offs on Summit Ridge Roofing crews is one to two working days.",
    note: "The same fix pass added the keyword to an H2 and cut the meta description from 166 characters to 157.",
  },
  {
    rule: "Contrast phrasing",
    business: "Sunny Side Pediatrics, a made-up pediatric practice",
    detail: "The checker flagged two uses of “rather than” in the draft.",
    before:
      "If you’re unsure whether a reading counts as a fever, call your pediatrician and describe it rather than spending the night trying to compare readings from different methods.",
    after:
      "If you’re unsure how to interpret a reading, call your pediatrician and describe it. Comparing numbers taken with different methods can make the picture harder to interpret.",
  },
  {
    rule: "Two sentences in a row starting with “You”",
    business: "ClearPath HVAC, a made-up heating and cooling company",
    detail: "Back-to-back “You” sentences read like a sales script.",
    before:
      "You’re the one who lives with the cooling system and pays for the work. You deserve to understand the recommendation before you approve it.",
    after:
      "You live with the cooling system and pay for the work. The technician should explain the recommendation in terms you can follow before you approve it.",
  },
];

/** The opening of a GPT 6 Luna post from the same run, after its fix pass. */
export const SAMPLE_POST = {
  business: "Summit Ridge Roofing, a made-up roofer in Boise",
  title: "Roof replacement timeline: How long the job takes",
  intro:
    "The roof replacement timeline for most single-family asphalt tear-offs on Summit Ridge Roofing crews is one to two working days. Roof shape, the condition of the wood beneath the shingles, and weather all affect the schedule. Boise-area homeowners can use that range to plan around the work, with a few details to confirm before installation begins.",
  h2: "How long does a roof replacement take?",
  h2Body:
    "A typical single-family asphalt roof replacement on Summit Ridge Roofing crews takes one to two working days. That range includes removing the old shingles, preparing the roof, installing the new roofing, and cleanup. A steep or complex roof, or rotted decking that needs repair, adds time to the job.",
};
