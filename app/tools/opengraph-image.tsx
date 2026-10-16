import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

export const alt = "Free SEO tools from Draftly: AI visibility, blog post SEO, content refresh and E-E-A-T checkers, plus an FAQ schema generator";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Free SEO tools", lead: "Free tools for", accent: "your blog", line: "AI visibility, blog SEO, refresh, E-E-A-T, FAQ schema" });
}
