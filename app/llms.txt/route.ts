import { buildLlmsTxt } from "@/lib/llms";

// Built at deploy time from the pricing, MCP and benchmark data the pages use.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
