// Feature page slugs used at launch (2026-10-20), mapped to the slugs chosen in the
// keyword audit the same day. next.config.ts turns each into a permanent (308) redirect.
// No imports here, so next.config.ts can load this file directly.
// Add a line when a /feature/ slug changes; never reuse an old slug for another page.
export const FEATURE_SLUG_REDIRECTS: Record<string, string> = {
  "topic-ideas": "blog-topic-ideas",
  "seo-research": "keyword-research",
  editor: "ai-copy-editor",
  autopilot: "automated-blogging",
  analytics: "blog-analytics",
};
