// POST handler for the free AI tools. Same guards as the checkers (same-origin,
// JSON only, small bodies, per-IP limits, a concurrency cap) plus a honeypot field,
// tighter per-IP limits and a daily run and spend budget, because every run costs
// money. Inputs and results aren't stored or logged.
import { ToolError } from "../ssrf.ts";
import { acquireSlot, releaseSlot } from "../rate-limit.ts";
import { aiToolsEnabled } from "./gateway.ts";
import { aiPerDay, aiPerHour, aiPerMinute, dailyBudget } from "./limits.ts";
import { runBrief, validateBriefInput } from "./brief.ts";
import { runIdeas, validateIdeasInput } from "./ideas.ts";

export type AiToolId = "content-brief" | "blog-ideas";

const MAX_BODY = 2048;
const HARD_TIMEOUT_MS = 57_000;

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex", ...extra },
  });
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "unknown";
}

/** Unlike the checkers, the AI tools require a same-site browser Origin: no curl, no server-to-server. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

const waitText = (s: number) => (s < 120 ? `${s} seconds` : s < 7200 ? `${Math.ceil(s / 60)} minutes` : `${Math.ceil(s / 3600)} hours`);

export async function handleAiTool(tool: AiToolId, req: Request): Promise<Response> {
  if (!aiToolsEnabled()) return json({ error: "This tool is switched off right now. The template below still works.", unavailable: true }, 503);
  if (!sameOrigin(req)) return json({ error: "Use the form on draftly.blog to run this tool." }, 403);
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "Send JSON." }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return json({ error: "Request too large." }, 413);

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "Request too large." }, 413);
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed;
  } catch {
    return json({ error: "Send the form as JSON." }, 400);
  }
  // Honeypot: a hidden field people never fill in. Bots that fill every field get a quiet refusal.
  if (typeof body.company === "string" && body.company.trim()) return json({ error: "Something went wrong. Try again." }, 400);

  let run: (onCost: (usd: number) => void) => Promise<unknown>;
  try {
    if (tool === "content-brief") {
      const input = validateBriefInput(body);
      run = (c) => runBrief(input, c);
    } else {
      const input = validateIdeasInput(body);
      run = (c) => runIdeas(input, c);
    }
  } catch (e) {
    return json({ error: e instanceof ToolError ? e.publicMessage : "Check what you entered and try again." }, 400);
  }

  const ip = clientIp(req);
  const wait = aiPerMinute.hit(ip) || aiPerHour.hit(ip) || aiPerDay.hit(ip);
  if (wait) return json({ error: `You've run the free AI tools a lot. Try again in ${waitText(wait)}, or sign up and Draftly writes the posts for you.` }, 429, { "Retry-After": String(wait) });
  if (!dailyBudget.take()) return json({ error: "The free AI tools have hit today's limit. They reset at midnight UTC. The template below still works.", unavailable: true }, 503);
  if (!acquireSlot()) {
    dailyBudget.refund();
    return json({ error: "The tool is busy. Try again in a few seconds." }, 503, { "Retry-After": "5" });
  }

  try {
    const result = await Promise.race([
      run((usd) => dailyBudget.spend(usd)),
      new Promise<never>((_, reject) => setTimeout(() => reject(new ToolError("That took too long. Try again.", 504)), HARD_TIMEOUT_MS)),
    ]);
    return json(result);
  } catch (e) {
    if (e instanceof ToolError) return json({ error: e.publicMessage }, e.status);
    console.error(`[tools-ai] ${tool} failed:`, e instanceof Error ? e.name : "unknown");
    return json({ error: "Something went wrong. Try again." }, 500);
  } finally {
    releaseSlot();
  }
}
