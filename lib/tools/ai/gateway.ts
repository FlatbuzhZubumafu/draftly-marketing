// One JSON-mode chat call to the Vercel AI Gateway for the free AI tools (content
// brief and blog ideas generators). Server only. The key is a dedicated gateway key
// (TOOLS_AI_GATEWAY_API_KEY), separate from the app's, so tool spend is easy to see
// and to revoke. Without it the tools are switched off and the pages show the static
// template and example output instead. Preview deployments can run without the key:
// they sign in with the deployment's own Vercel OIDC token, so a PR can be tried on
// real output before anyone makes a key. Production never uses the OIDC fallback.
import { AsyncLocalStorage } from "node:async_hooks";
import { ToolError } from "../ssrf.ts";

const GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions";

/** GPT 6 Luna: the app's default writer. $0.10 in / $0.50 out per million tokens (model_catalog, 2026-10-08). */
export const DEFAULT_MODEL = "openai/gpt-6-luna";
const PRICE_PER_M = { input: 0.1, output: 0.5 };

export function aiToolsEnabled(): boolean {
  return Boolean(process.env.TOOLS_AI_GATEWAY_API_KEY) || previewOidc();
}

/** True on Vercel preview deployments when no dedicated key is set. */
export function previewOidc(): boolean {
  return !process.env.TOOLS_AI_GATEWAY_API_KEY && process.env.VERCEL_ENV === "preview";
}

/** The request's OIDC token (from the x-vercel-oidc-token header), set by the API handler on previews. */
export const oidcToken = new AsyncLocalStorage<string>();

export type ChatResult = { json: unknown; costUsd: number };

export type ChatOptions = {
  system: string;
  user: string;
  /** Includes hidden reasoning tokens on reasoning models, so leave room. */
  maxTokens: number;
  timeoutMs?: number;
  /** For tests. */
  fetchImpl?: typeof fetch;
};

/** Cost when the gateway doesn't report usage.cost: list price on the token counts. */
export function estimateCost(tokensIn: number, tokensOut: number): number {
  return (tokensIn * PRICE_PER_M.input + tokensOut * PRICE_PER_M.output) / 1_000_000;
}

export async function chatJson(opts: ChatOptions): Promise<ChatResult> {
  const key = process.env.TOOLS_AI_GATEWAY_API_KEY || (previewOidc() ? oidcToken.getStore() : undefined);
  if (!key) throw new ToolError("This tool is switched off right now. Try the template below.", 503);
  const model = process.env.TOOLS_AI_MODEL || DEFAULT_MODEL;

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
    response_format: { type: "json_object" },
    max_tokens: opts.maxTokens,
  };
  // Reasoning models spend max_tokens on hidden reasoning first; keep it short.
  if (model.startsWith("openai/")) body.reasoning_effort = "low";

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 25_000);
  let res: Response;
  try {
    // TOOLS_AI_GATEWAY_URL is for local testing against a mock; production leaves it unset.
    res = await (opts.fetchImpl ?? fetch)(process.env.TOOLS_AI_GATEWAY_URL || GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch {
    throw new ToolError("The writer took too long to answer. Try again.", 504);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    console.error(`[tools-ai] gateway ${res.status}`);
    throw new ToolError(res.status === 429 ? "The tool is busy. Try again in a minute." : "The writer had a problem. Try again.", 502);
  }

  const data = (await res.json().catch(() => null)) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number };
  } | null;
  const text = data?.choices?.[0]?.message?.content ?? "";
  const reported = Number(data?.usage?.cost);
  const costUsd = Number.isFinite(reported) && reported > 0 ? reported : estimateCost(data?.usage?.prompt_tokens ?? 0, data?.usage?.completion_tokens ?? 0);

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ToolError("The writer sent back something we couldn't read. Try again.", 502);
  }
  return { json, costUsd };
}
