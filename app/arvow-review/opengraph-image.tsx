import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /arvow-review, in the same frame as the tool pages.
export const alt = "Arvow review: pricing, features, the backlink exchange and who it fits, with prices checked October 2026";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Review", lead: "Arvow review", accent: "pricing and who it fits", line: "Prices checked October 2026" });
}
