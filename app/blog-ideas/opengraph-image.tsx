import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";
import { INDUSTRIES } from "@/lib/industries";

// Share image for /blog-ideas, in the same frame as the tool pages.
export const alt = "Blog ideas by industry: topics and publishing rules for plumbers, HVAC companies, real estate agents and law firms";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Blog ideas", lead: "Blog ideas", accent: "by industry", line: `${INDUSTRIES.length} industries, with the rules for each` });
}
