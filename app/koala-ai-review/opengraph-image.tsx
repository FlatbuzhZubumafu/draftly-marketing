import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /koala-ai-review, in the same frame as the tool pages.
export const alt = "Koala AI review: pricing by the word, features by plan and who it fits, with prices checked October 2026";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Review", lead: "Koala AI review", accent: "pricing and who it fits", line: "Prices checked October 2026" });
}
