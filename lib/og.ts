import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { OG_IMAGES } from "@/lib/og-images";

// Per-page share images (1200x630 JPEG in public/images/og/): the page's headline with its
// own photo, product shot or tool still. Built by ~/draftly-work/visuals/og2/build-og.mjs,
// which also writes lib/og-images.ts. A page without an entry falls back to the site
// default, app/opengraph-image.jpg.
export type OgImage = { url: string; width: number; height: number; alt: string };

export const PAGE_OG: Record<string, OgImage> = Object.fromEntries(
  Object.entries(OG_IMAGES).map(([path, { file, alt }]) => [path, { url: `/images/og/${file}`, width: 1200, height: 630, alt }]),
);

/**
 * openGraph and twitter metadata for a page, with its own share image. Both are set
 * because a page's openGraph object replaces the root layout's, image included.
 */
export function pageImages(
  path: string,
  { title, description, url, type = "article" }: { title: string; description: string; url: string; type?: "article" | "website" },
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = PAGE_OG[path] ?? DEFAULT_OG_IMAGE;
  return {
    openGraph: { title, description, type, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] },
  };
}
