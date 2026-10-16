import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /copy-ai-alternatives, in the same frame as the tool pages.
export const alt = "Copy.ai alternatives for blog posts and marketing: Draftly, Jasper, Writesonic, Koala and Claude compared on price and publishing";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Comparison", lead: "Copy.ai alternatives", accent: "for blog posts and marketing", line: "Prices checked October 2026" });
}
