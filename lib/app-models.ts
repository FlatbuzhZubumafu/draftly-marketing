// The writing models a Draftly user can pick, mirroring model_catalog in the
// draftly.blog repo (enabled rows only, in the app's sort order). A blog post
// costs 250 credits x credit_multiplier: 0.2 = 50, 0.6 = 150, 1.0 = 250.
// Checked against production on 2026-10-12. Change model_catalog first, then this.
// Qwen 3.8 Max is in the catalog but disabled, so it is not listed.

export type AppModel = {
  name: string;
  /** Credits for one blog post on this model. */
  credits: number;
  note?: string;
};

export const APP_MODELS: AppModel[] = [
  { name: "Claude Sonnet 5.5", credits: 150, note: "default, best quality" },
  { name: "GPT 6 Luna", credits: 50, note: "budget" },
  { name: "GPT 5.4 Mini", credits: 150 },
  { name: "Claude Opus 5.5", credits: 250 },
  { name: "Kimi K3", credits: 250 },
  { name: "Claude Haiku 4.5", credits: 150 },
  { name: "Claude Sonnet 4.6", credits: 250 },
  { name: "GPT 5.4", credits: 250 },
  { name: "GPT 5.5", credits: 250 },
  { name: "Gemini 3.8 Flash", credits: 150 },
  { name: "Gemini 3 Flash", credits: 150 },
  { name: "DeepSeek V4 Pro", credits: 150 },
  { name: "DeepSeek V3.2", credits: 150 },
];

export const APP_MODEL_COUNT = APP_MODELS.length;

/** Credits per post in Draftly, or undefined when the model isn't offered. */
export function draftlyCredits(model: string): number | undefined {
  return APP_MODELS.find((m) => m.name === model)?.credits;
}
