import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

// Per-page share images (1200x630 JPEG in public/images/og/), each built from the
// page's own key visual and framed like the guide thumbnails. Rendered by
// ~/draftly-work/visuals/mlt/build-og.mjs. A page without an entry falls back to
// the site default from app/opengraph-image.tsx.
export type OgImage = { url: string; width: number; height: number; alt: string };

const og = (file: string, alt: string): OgImage => ({ url: `/images/og/${file}`, width: 1200, height: 630, alt });

export const PAGE_OG: Record<string, OgImage> = {
  "/pricing": og("pricing.jpg", "Draftly pricing: Free, Solopreneur at $29, Growth at $69 and Autopilot at $100 a month"),
  "/ai-copywriter": og("ai-copywriter.jpg", "The AI copywriter for small-business blogs: a website URL going into Draftly and a finished 1,118-word draft coming out"),
  "/seo-copywriting": og("seo-copywriting.jpg", "SEO copywriting rules Draftly checks on every post: a generic AI paragraph with four flagged rules beside a Draftly draft with none"),
  "/best-ai-for-writing": og("best-ai-for-writing.jpg", "Best AI for writing in 2026: the leaderboard of 14 AI models scored on formatting, voice and cost"),
  "/mcp": og("mcp.jpg", "Draftly's SEO MCP server: Claude, ChatGPT, Grok, Cursor, OpenClaw and Hermes Agent connect to Draftly, which publishes to six CMSs"),
  "/ai-seo-agency-vs-tool": og("ai-seo-agency-vs-tool.jpg", "AI SEO agency or AI SEO tool: a table matching business situations to an agency, a tool or both"),
  "/blog": og("blog.jpg", "Draftly guides and blog posts on AI writing and SEO"),
  "/privacy-policy": og("privacy-policy.jpg", "Draftly privacy policy"),
  "/terms-and-conditions": og("terms-and-conditions.jpg", "Draftly terms and conditions"),
};

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
