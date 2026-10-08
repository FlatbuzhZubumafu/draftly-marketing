// Site-wide constants shared by metadata, structured data and the text routes.
export const SITE_URL = "https://www.draftly.blog";
export const APP_URL = "https://app.draftly.blog";
// The logo WordPress serves as marketingSettings.logoUrl (shown in the header).
export const LOGO_URL = "https://wp.draftly.blog/wp-content/uploads/2025/10/Draftly.blog_.png";

export const HOME_TITLE = "Draftly: AI Blog Writer That Sounds Like Your Brand";
export const HOME_DESCRIPTION =
  "Draftly is an AI blog writer for small businesses. Paste your URL and get SEO-ready posts in your brand's voice, free of AI filler. Your first post is free.";

// The share image from app/opengraph-image.tsx. Pages below the root that set their
// own openGraph object list it explicitly, because that object replaces the
// root's Open Graph tags, image included.
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Draftly: the AI copywriter that hates AI copy. An AI blog writer for small businesses.",
};
