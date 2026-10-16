import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

// Share image for /claude-vs-chatgpt-for-writing, in the same frame as the tool pages.
export const alt = "Claude vs ChatGPT for writing: 4 Claude and 3 GPT models scored on the same blog posts and copy in Draftly's benchmark";
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: "Benchmark", lead: "Claude vs ChatGPT", accent: "for writing", line: "7 models, 84 scored drafts" });
}
