import { handleTool, methodNotAllowed } from "@/lib/tools/api";

// URL mode of the AI content detector: fetches the page server-side through the
// SSRF-guarded fetcher and returns the article text. The browser does the scoring.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export function POST(req: Request) {
  return handleTool("ai-detector", req);
}

export const GET = methodNotAllowed;
