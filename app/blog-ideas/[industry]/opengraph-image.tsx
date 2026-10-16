import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";
import { INDUSTRIES, getIndustry } from "@/lib/industries";

// Share image for each /blog-ideas/<industry> page, in the same frame as the tool pages.
export const alt = "Blog topic ideas for one industry, grouped by what readers need, with the rules to check before publishing";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export default async function Image({ params }: { params: Promise<{ industry: string }> }) {
  const industry = getIndustry((await params).industry) ?? INDUSTRIES[0];
  return toolOgImage({ label: "Blog ideas", lead: industry.h1.lead, accent: industry.h1.accent, line: industry.ogLine });
}
