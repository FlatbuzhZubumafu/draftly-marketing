import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /best-ai-for-seo, in the same frame as the tool pages.
export const alt = "Best AI for SEO: the AI tools for keyword research, writing, optimization, AI visibility and technical SEO, with prices";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Guide", lead: "Best AI for SEO", accent: "picked by job", line: "Prices checked October 2026" });
}
