import { buildLlmsFullTxt } from "@/lib/llms";

// Every benchmark results table in plain text, generated from lib/benchmark.ts.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
