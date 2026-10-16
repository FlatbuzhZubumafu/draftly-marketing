import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /writesonic-alternatives, in the same frame as the tool pages.
export const alt = "Writesonic alternatives for SEO blog posts: Draftly, Koala, SEOWriting.ai, Jasper and Copy.ai compared on price and publishing";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Comparison", lead: "Writesonic alternatives", accent: "for SEO blog posts", line: "Prices checked October 2026" });
}
