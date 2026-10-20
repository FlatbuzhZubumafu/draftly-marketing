// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/writing-rules.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Only AI_VOCABULARY (lines 100-129), copied verbatim. ai-detect.ts builds its word list from it.
//
/**
 * The ai_vocabulary module's banned terms, written exactly as the system
 * prompt shows them. post-checks.ts derives its banned-vocabulary check from
 * these lists, so the prompt and the code check cannot drift apart.
 * Templated phrases ("X", "[X]", "a/b/c") need a matching pattern in
 * post-checks.ts; its tests fail if one is missing.
 */
export const AI_VOCABULARY = {
  adjectives: [
    'seamless', 'robust', 'cutting-edge', 'revolutionary', 'game-changing', 'transformative', 'best-in-class', 'world-class',
    'next-level', 'comprehensive', 'holistic', 'bespoke', 'curated', 'unparalleled', 'state-of-the-art', 'vibrant', 'crucial',
    'pivotal', 'dynamic', 'innovative', 'ever-evolving',
  ],
  verbs: [
    'leverage', 'elevate', 'unlock', 'empower', 'streamline', 'harness', 'foster', 'facilitate', 'spearhead', 'revolutionize',
    'supercharge', 'delve', 'embark', 'underscore', 'illuminate', 'bolster', 'dominate', 'crush', 'dive deep', 'shed light on',
    'navigate the landscape',
  ],
  nouns: [
    'solution(s)', 'ecosystem', 'synergy', 'landscape', 'journey', 'tapestry', 'testament', 'paradigm', 'game-changer',
    'powerhouse', 'realm', 'myriad', 'plethora', 'secret sauce', 'gold mine',
  ],
  phrases: [
    "in today's fast-paced/digital/ever-evolving world", 'in an age where', "whether you're a X or a Y", "let's dive in",
    "it's important to note", "it's worth noting", 'at the end of the day', 'look no further', "that's where [X] comes in",
    'when it comes to', 'at its core', 'that being said', 'to put it simply', 'a key takeaway is', 'the secret to',
    'food for thought', 'and that makes all the difference', 'Picture this', 'Great question',
  ],
} as const;

