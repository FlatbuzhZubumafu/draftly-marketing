import { handleTool, methodNotAllowed } from "@/lib/tools/api";

// Fetches the visitor's URL server-side through the SSRF-guarded fetcher in lib/tools.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export function POST(req: Request) {
  return handleTool("content-refresh", req);
}

export const GET = methodNotAllowed;
