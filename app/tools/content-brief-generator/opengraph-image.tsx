import { toolById } from "@/lib/free-tools";
import { TOOL_OG_SIZE, toolOgImage } from "@/lib/tool-og";

const TOOL = toolById("content-brief");
export const alt = TOOL.ogAlt;
export const size = TOOL_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return toolOgImage({ label: TOOL.eyebrow, lead: TOOL.h1, accent: TOOL.h1Accent, line: TOOL.ogLine });
}
