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
  "showcase-wide.webp", 1600, 934,
  "Draftly's setup screen with draftly.blog entered as the website URL, and the finished blog post it produced: a featured image, 1,296 words, an SEO score of 75 out of 100, and the opening section of the article",
  "A real first run. We entered a URL and Draftly returned a 1,296-word draft with a featured image, SEO meta and an SEO score.",
);
export const SHOWCASE_TALL = shot("showcase-tall.webp", 800, 1225, SHOWCASE_WIDE.alt, SHOWCASE_WIDE.caption);

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

export const FEATURE_SHOTS: ProductShot[] = [
  shot("feature-brand-voice.webp", 900, 728,
    "Draftly's Voice and Tone sliders: Friendly 75, Authoritative 80, Formal 40, Technical 55 and Empathetic 85",
    "Brand voice sliders, set from your site and adjustable any time."),
  shot("feature-models.webp", 900, 653,
    "Draftly's Create Blog Post screen with a topic box and a model picker listing GPT, Claude, Gemini and DeepSeek models",
    "Pick the model per post. Paid plans unlock Claude, Gemini and DeepSeek."),
  shot("feature-seo-meta.webp", 1000, 179,
    "SEO fields Draftly wrote for a post: URL slug, meta title and meta description",
    "Slug, meta title and meta description come with every draft."),
];

export const INTEGRATIONS_SHOT = shot(
  "integrations.webp", 1400, 616,
  "Draftly connected to six publishing platforms: WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
  "One draft, six places it can go.",
);

/** 16:9 graphics for the long-form guide pages (/ai-copywriter, /seo-copywriting, /ai-seo-agency-vs-tool). */
export const GUIDE_SHOTS = {
  urlToPost: shot("guide-url-to-post.webp", 1600, 900,
    "Draftly's setup screen with a website URL entered, and the finished post it produced: featured image, 1,296 words, SEO score 75/100 and the opening of the article",
    "A real first run: a URL in, a 1,296-word draft with SEO meta out."),
  genericVsDraftly: shot("guide-generic-vs-draftly-copy.webp", 1600, 900,
    "A generic AI paragraph with flagged phrases highlighted (banned_vocabulary, contrast_phrasing, hedging, mechanical_openers) beside the opening of a real Draftly post that triggers none of them",
    "Draftly's checker flags four rules in the generic paragraph and none in the Draftly draft."),
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

export const ALL_PRODUCT_SHOTS = [SHOWCASE_WIDE, ...STEP_SHOTS, ...FEATURE_SHOTS, INTEGRATIONS_SHOT];

export function imageObjectJsonLd(s: ProductShot) {
  return {
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${s.src}`,
    width: s.width,
    height: s.height,
    caption: s.caption,
    description: s.alt,
  };
}
