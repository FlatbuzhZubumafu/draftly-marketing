import { methodNotAllowed } from "@/lib/tools/api";
import { handleAiTool } from "@/lib/tools/ai/api";

// Reads the visitor's site (optional) through the SSRF-guarded fetcher, then makes one
// GPT 6 Luna call through the AI Gateway. Off unless TOOLS_AI_GATEWAY_API_KEY is set (previews use OIDC).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function POST(req: Request) {
  return handleAiTool("blog-ideas", req);
}

export const GET = methodNotAllowed;
