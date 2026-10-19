// Site-wide constants shared by metadata, structured data and the text routes.
export const SITE_URL = "https://www.draftly.blog";
export const APP_URL = "https://app.draftly.blog";
// The logo WordPress serves as marketingSettings.logoUrl (shown in the header).
export const LOGO_URL = "https://wp.draftly.blog/wp-content/uploads/2025/10/Draftly.blog_.png";
// The same logo at 64x64 (2x its 32px header size), 1.4 KB, for the header and footer.
// The 1024px original (146 KB) stays the schema logo; React preloads header images,
// so a small local file keeps that preload cheap on every page.
export const LOGO_SRC = "/brand/draftly-logo-64.webp";

export const HOME_TITLE = "Draftly: AI Blog Writer That Sounds Like Your Brand";
export const HOME_DESCRIPTION =
  "Draftly is an AI blog writer for small businesses. Paste your URL and get SEO-ready posts in your brand's voice, free of AI filler. Your first post is free.";

// The site's default share image: the homepage's, also served as app/opengraph-image.jpg.
// Pages below the root that set their own openGraph object list an image explicitly,
// because that object replaces the root's Open Graph tags, image included.
export const DEFAULT_OG_IMAGE = {
  url: "/images/og/home.jpg",
  width: 1200,
  height: 630,
  alt: "Draftly: the AI blog writer that hates AI copy, for small businesses and marketing teams.",
};
