// Shared POST handler for the free tools' API routes. Validates input, applies
// rate limits, runs one tool, and returns JSON. Nothing about the request or the
// result is stored or logged beyond the error class.
import { checkUrl, ToolError } from "./ssrf.ts";
import { acquireSlot, perHour, perMinute, perTarget, releaseSlot } from "./rate-limit.ts";
import type { ToolReport } from "./types.ts";
import { runAiVisibility } from "./checks/ai-visibility.ts";
import { runBlogSeo } from "./checks/blog-seo.ts";
import { runContentRefresh } from "./checks/content-refresh.ts";
import { runEeat } from "./checks/eeat.ts";

export type ToolId = "ai-visibility" | "blog-seo" | "content-refresh" | "eeat";

const RUNNERS: Record<ToolId, (url: string, extra?: string) => Promise<ToolReport>> = {
  "ai-visibility": (u) => runAiVisibility(u),
  "blog-seo": (u) => runBlogSeo(u),
  "content-refresh": (u) => runContentRefresh(u),
  eeat: (u, home) => runEeat(u, home),
};

const MAX_BODY = 4096;
const HARD_TIMEOUT_MS = 55_000;

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...extra },
  });
}

function clientIp(req: Request): string {
  // On Vercel the first x-forwarded-for entry is the visitor; x-real-ip is the same.
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "unknown";
}

/** Browsers send Origin on POST. Refuse cross-site calls so other sites can't embed the API. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // curl and server-to-server; still rate limited
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function handleTool(tool: ToolId, req: Request): Promise<Response> {
  if (!sameOrigin(req)) return json({ error: "Cross-site requests aren't allowed." }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "Send JSON." }, 415);
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return json({ error: "Request too large." }, 413);

  let body: { url?: unknown; homepage?: unknown };
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "Request too large." }, 413);
    body = JSON.parse(text);
  } catch {
    return json({ error: "Send JSON like {\"url\": \"https://example.com\"}." }, 400);
  }
  if (typeof body.url !== "string" || (body.homepage !== undefined && typeof body.homepage !== "string")) {
    return json({ error: "Enter a URL to check." }, 400);
  }

  let target: URL;
  try {
    target = checkUrl(body.url, { allowBare: true });
    if (typeof body.homepage === "string" && body.homepage.trim()) checkUrl(body.homepage, { allowBare: true });
  } catch (e) {
    return json({ error: e instanceof ToolError ? e.publicMessage : "That doesn't look like a valid URL." }, 400);
  }

  const ip = clientIp(req);
  const wait = perMinute.hit(ip) || perHour.hit(ip);
  if (wait) return json({ error: `You've run a lot of checks. Try again in ${wait < 120 ? `${wait} seconds` : `${Math.ceil(wait / 60)} minutes`}.` }, 429, { "Retry-After": String(wait) });
  const targetWait = perTarget.hit(target.hostname.replace(/^www\./, ""));
  if (targetWait) return json({ error: "That site has been checked many times in the last few minutes. Try again shortly." }, 429, { "Retry-After": String(targetWait) });
  if (!acquireSlot()) return json({ error: "The checker is busy. Try again in a few seconds." }, 503, { "Retry-After": "5" });

  try {
    const report = await Promise.race([
      RUNNERS[tool](body.url, typeof body.homepage === "string" ? body.homepage : undefined),
      new Promise<never>((_, reject) => setTimeout(() => reject(new ToolError("The check took too long. Try again, or try a single page.", 504)), HARD_TIMEOUT_MS)),
    ]);
    return json(report);
  } catch (e) {
    if (e instanceof ToolError) return json({ error: e.publicMessage }, e.status);
    console.error(`[tools] ${tool} failed:`, e instanceof Error ? e.name : "unknown");
    return json({ error: "Something went wrong running the check. Try again." }, 500);
  } finally {
    releaseSlot();
  }
}

/** GET and other methods: point people at the page. */
export function methodNotAllowed(): Response {
  return json({ error: "Use POST with {\"url\": \"...\"}." }, 405, { Allow: "POST" });
}
