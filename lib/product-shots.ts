import { SITE_URL } from "@/lib/site";

/** Real screenshots of app.draftly.blog (demo account, October 2026) and graphics built from them. */
export interface ProductShot {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

const shot = (file: string, width: number, height: number, alt: string, caption: string): ProductShot => ({
  src: `/images/product/${file}`,
  width,
  height,
  alt,
  caption,
});

export const SHOWCASE_WIDE = shot(
  "showcase-wide.webp", 1600, 574,
  "Draftly's setup screen with draftly.blog entered as the website URL, and the finished blog post it produced one to two minutes later: 1,296 words, an SEO score of 75 out of 100, and the opening section of the article",
  "A website URL in, a 1,296-word draft with an SEO score out, in one to two minutes.",
);
export const SHOWCASE_TALL = shot("showcase-tall.webp", 800, 1125, SHOWCASE_WIDE.alt, SHOWCASE_WIDE.caption);

/** One per How It Works step, in step order. */
export const STEP_SHOTS: ProductShot[] = [
  shot("how-1-url.webp", 900, 574,
    "Draftly's Set Up Your Website screen asking for a website URL, with the steps Reads your site, Finds this week's relevant headlines and Writes your post",
    "Paste your URL. Draftly reads your homepage first."),
  shot("how-2-topics.webp", 900, 588,
    "Draftly's Blog Inspiration panel listing trending industry articles from Search Engine Journal, each with an Add Your Take button",
    "Trending articles from your industry, each one a click away from a post."),
  shot("how-3-post.webp", 900, 614,
    "A Draftly draft titled Google ranking without an index: what it means for your SEO, with question-style subheadings and a linked source",
    "The draft: question-style headings, a cited source and plain sentences."),
];

/** The homepage feature carousel: number, title and description sit above each equal-size (4:3) image. */
export interface FeatureSlide {
  title: string;
  description: string;
  shot: ProductShot;
}
export const FEATURE_SLIDES: FeatureSlide[] = [
  {
    title: "Your brand voice, dialed in",
    description: "Draftly sets your tone sliders from your own website. Move any of them and every new post follows.",
    shot: shot("feature-slide-voice.webp", 1600, 1200,
      "Draftly's Voice and Tone sliders: Friendly 75, Authoritative 80, Formal 40, Technical 55 and Empathetic 85",
      "Brand voice sliders, set from your site and adjustable any time."),
  },
  {
    title: "Your topic, your model",
    description: "Type any topic and pick the model that writes it. GPT 6 Luna is the default, and paid plans unlock Claude, Gemini and DeepSeek.",
    shot: shot("feature-slide-models.webp", 1600, 1200,
      "Draftly's Write Your Own Topic screen with a topic box and a model picker: GPT 6 Luna (default), GPT 5.4 Mini, Claude Sonnet 5.5, Claude Haiku 4.5, Claude Sonnet 4.6, GPT 5.4, Gemini 3 Flash and DeepSeek V3.2",
      "Pick the model per post. Paid plans unlock Claude, Gemini and DeepSeek."),
  },
  {
    title: "SEO meta, drafted every time",
    description: "Every draft comes with a URL slug, a meta title and a meta description, sized for how they show in Google.",
    shot: shot("feature-slide-meta.webp", 1600, 1200,
      "SEO fields Draftly wrote for a post (URL slug, meta title and meta description) and a preview of how that title and description can appear in a Google result",
      "Slug, meta title and meta description come with every draft."),
  },
];

/** Equal 16:10 thumbnails for the homepage guide cards, keyed by destination. */
export const GUIDE_THUMBS: Record<string, ProductShot> = {
  "/ai-copywriter": shot("guide-thumb-ai-copywriter.webp", 1280, 800,
    "Preview of the AI copywriter page: a website URL going into Draftly and a finished 1,296-word draft coming out", ""),
  "/seo-copywriting": shot("guide-thumb-seo-copywriting.webp", 1280, 800,
    "Preview of the SEO copywriting rules page: a generic AI paragraph with four flagged rules beside a Draftly draft with none", ""),
  "/best-ai-for-writing": shot("guide-thumb-best-ai.webp", 1280, 800,
    "Preview of the Best AI for writing page: the leaderboard of 14 models scored on formatting, voice and cost", ""),
  "/mcp": shot("guide-thumb-mcp.webp", 1280, 800,
    "Preview of the SEO MCP page: Claude, ChatGPT, Grok, Cursor, OpenClaw and Hermes Agent connecting to Draftly, which publishes to six CMSs", ""),
  "/ai-seo-agency-vs-tool": shot("guide-thumb-agency-vs-tool.webp", 1280, 800,
    "Preview of the AI SEO agency vs tool page: a table matching business situations to an agency, a tool or both", ""),
  "/pricing": shot("guide-thumb-pricing.webp", 1280, 800,
    "Preview of the pricing page: Free, Solopreneur at $29, Growth at $69 and Autopilot at $100 a month", ""),
};

export const INTEGRATIONS_SHOT = shot(
  "integrations.webp", 1400, 616,
  "Draftly connected to six publishing platforms: WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
  "One draft, six places it can go.",
);

/** 16:9 graphics for the long-form guide pages (/ai-copywriter, /seo-copywriting, /ai-seo-agency-vs-tool). */
export const GUIDE_SHOTS = {
  urlToPost: shot("guide-url-to-post.webp", 1600, 900,
    "Draftly's setup screen with a website URL entered, and the finished post it produced: 1,296 words, SEO score 75/100, Draft status and the opening of the article",
    "A real first run: a URL in, a 1,296-word draft with SEO meta out."),
  genericVsDraftly: shot("guide-generic-vs-draftly-copy.webp", 1600, 900,
    "A generic AI paragraph with flagged phrases highlighted (banned_vocabulary, contrast_phrasing, hedging, mechanical_openers) beside the opening of an example Draftly post about flushing a water heater, written by Claude Sonnet 5.5 for a made-up plumber, that triggers none of them",
    "Draftly's checker flags four rules in the generic paragraph and none in the example Draftly draft."),
  brandVoice: shot("guide-brand-voice-sliders.webp", 1600, 900,
    "Draftly's Voice and Tone sliders: Friendly 75, Authoritative 80, Formal 40, Technical 55 and Empathetic 85",
    "Brand voice sliders, set from your site and adjustable any time."),
  seoMeta: shot("guide-seo-meta-fields.webp", 1600, 900,
    "SEO fields Draftly wrote for a post: URL slug, meta title and meta description",
    "Slug, meta title and meta description come with every draft."),
  modelPicker: shot("guide-model-picker.webp", 1600, 900,
    "Draftly's Create Blog Post screen with a model picker listing GPT, Claude, Gemini and DeepSeek models and their credit cost",
    "Pick the model per post. Paid plans unlock Claude, Gemini and DeepSeek."),
} satisfies Record<string, ProductShot>;

export const ALL_PRODUCT_SHOTS = [SHOWCASE_WIDE, ...STEP_SHOTS, ...FEATURE_SLIDES.map((f) => f.shot), INTEGRATIONS_SHOT];

export function imageObjectJsonLd(s: ProductShot) {
  return {
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${s.src}`,
    width: s.width,
    height: s.height,
    ...(s.caption ? { caption: s.caption } : {}),
    description: s.alt,
  };
}
