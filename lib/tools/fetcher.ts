// The only way the free tools touch the network. One Scan per visitor request:
// it caps the number of fetches and the total time, follows redirects by hand
// (re-checking each hop), caps response size after decompression, and connects
// through safeLookup so private addresses are refused at connect time.
import http from "node:http";
import https from "node:https";
import zlib from "node:zlib";
import { checkUrl, safeLookup, ToolError } from "./ssrf.ts";

export const UA = {
  tool: "Mozilla/5.0 (compatible; DraftlyChecker/1.0; +https://www.draftly.blog/tools)",
  browser:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  gptbot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  claudebot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
} as const;

export type Expect = "html" | "xml" | "text" | "any";

export type FetchOptions = {
  ua?: string;
  method?: "GET" | "HEAD";
  /** Read at most this many (decompressed) bytes; the rest is cut off. */
  maxBytes?: number;
  timeoutMs?: number;
  /** Content types we will read a body for. Others come back with body "". */
  expect?: Expect;
  /** Skip the body entirely (link checks). */
  headersOnly?: boolean;
  maxRedirects?: number;
};

export type FetchResult = {
  ok: boolean;
  status: number;
  url: string;
  finalUrl: string;
  redirects: number;
  contentType: string;
  headers: Record<string, string>;
  body: string;
  bytes: number;
  truncated: boolean;
  /** Set when no HTTP response came back (timeout, DNS, blocked, TLS...). */
  error?: string;
  /** True when the body was skipped because the content type didn't match `expect`. */
  wrongType?: boolean;
};

const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const DEFAULT_TIMEOUT = 8000;

const TYPE_OK: Record<Expect, (ct: string) => boolean> = {
  html: (ct) => !ct || /text\/html|application\/xhtml\+xml/.test(ct),
  xml: (ct) => !ct || /xml|text\/plain|gzip|octet-stream|rss|atom/.test(ct),
  text: (ct) => !ct || /^text\//.test(ct),
  any: (ct) => !/^(?:image|video|audio|font)\//.test(ct),
};

export class Scan {
  readonly deadline: number;
  readonly maxFetches: number;
  fetches = 0;

  constructor({ budgetMs, maxFetches }: { budgetMs: number; maxFetches: number }) {
    this.deadline = Date.now() + budgetMs;
    this.maxFetches = maxFetches;
  }

  remainingMs(): number {
    return this.deadline - Date.now();
  }

  /** True while there is time and fetch budget left for `n` more requests. */
  canFetch(n = 1): boolean {
    return this.fetches + n <= this.maxFetches && this.remainingMs() > 500;
  }

  /** Fetches a URL safely. Never throws for network problems; check `error`. Throws ToolError for blocked URLs. */
  async fetch(input: string | URL, opts: FetchOptions = {}): Promise<FetchResult> {
    let url = checkUrl(String(input));
    const maxRedirects = opts.maxRedirects ?? 5;
    let redirects = 0;
    for (;;) {
      if (!this.canFetch()) return failed(String(input), url.href, redirects, "Scan limit reached");
      this.fetches++;
      const timeoutMs = Math.max(500, Math.min(opts.timeoutMs ?? DEFAULT_TIMEOUT, this.remainingMs()));
      const res = await requestOnce(url, { ...opts, timeoutMs });
      res.url = String(input);
      res.redirects = redirects;
      const location = res.headers["location"];
      if (res.status >= 300 && res.status < 400 && location) {
        if (redirects >= maxRedirects) return { ...res, ok: false, error: "Too many redirects" };
        let next: URL;
        try {
          next = checkUrl(new URL(location, url).href);
        } catch (e) {
          const msg = e instanceof ToolError ? e.publicMessage : "Bad redirect";
          return { ...res, ok: false, error: `Redirect refused: ${msg}` };
        }
        url = next;
        redirects++;
        continue;
      }
      return res;
    }
  }
}

function failed(url: string, finalUrl: string, redirects: number, error: string): FetchResult {
  return { ok: false, status: 0, url, finalUrl, redirects, contentType: "", headers: {}, body: "", bytes: 0, truncated: false, error };
}

function friendlyError(err: NodeJS.ErrnoException): string {
  switch (err.code) {
    case "EBLOCKED":
      return "Refused: the site resolves to a private address";
    case "ENOTFOUND":
    case "EAI_AGAIN":
      return "Domain not found";
    case "ECONNREFUSED":
      return "Connection refused";
    case "ECONNRESET":
      return "Connection reset";
    case "ETIMEDOUT":
    case "ETIMEOUT":
      return "Timed out";
    default:
      if (/certificate|SSL|TLS/i.test(err.message)) return "TLS certificate problem";
      return "Couldn't connect";
  }
}

function requestOnce(url: URL, opts: FetchOptions & { timeoutMs: number }): Promise<FetchResult> {
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;
  const expect = opts.expect ?? "any";
  const lib = url.protocol === "https:" ? https : http;

  return new Promise((resolve) => {
    let settled = false;
    const done = (r: FetchResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };

    const req = lib.request(
      url,
      {
        method: opts.method ?? "GET",
        lookup: safeLookup as never,
        agent: false,
        headers: {
          "User-Agent": opts.ua ?? UA.tool,
          Accept: expect === "xml" ? "application/xml,text/xml;q=0.9,*/*;q=0.5" : "text/html,application/xhtml+xml,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) if (v !== undefined) headers[k] = Array.isArray(v) ? v.join(", ") : v;
        const status = res.statusCode ?? 0;
        const contentType = (headers["content-type"] ?? "").toLowerCase();
        const base: FetchResult = {
          ok: status >= 200 && status < 300,
          status,
          url: url.href,
          finalUrl: url.href,
          redirects: 0,
          contentType,
          headers,
          body: "",
          bytes: 0,
          truncated: false,
        };
        const isRedirect = status >= 300 && status < 400 && !!headers["location"];
        if (opts.method === "HEAD" || opts.headersOnly || isRedirect) {
          res.destroy();
          return done(base);
        }
        if (!TYPE_OK[expect](contentType)) {
          res.destroy();
          return done({ ...base, wrongType: true });
        }

        const enc = (headers["content-encoding"] ?? "").toLowerCase().trim();
        const gzByName = /\.gz$/i.test(url.pathname) && !enc;
        let stream: NodeJS.ReadableStream = res;
        try {
          if (enc === "gzip" || enc === "x-gzip" || gzByName) stream = res.pipe(zlib.createGunzip());
          else if (enc === "deflate") stream = res.pipe(zlib.createInflate());
          else if (enc === "br") stream = res.pipe(zlib.createBrotliDecompress());
        } catch {
          res.destroy();
          return done({ ...base, ok: false, error: "Couldn't decode the response" });
        }

        const chunks: Buffer[] = [];
        let bytes = 0;
        let truncated = false;
        const finish = () => done({ ...base, body: Buffer.concat(chunks).toString("utf8"), bytes, truncated });
        stream.on("data", (chunk: Buffer) => {
          if (truncated) return;
          const room = maxBytes - bytes;
          if (chunk.length >= room) {
            chunks.push(chunk.subarray(0, room));
            bytes += room;
            truncated = true;
            res.destroy();
            finish();
            return;
          }
          chunks.push(chunk);
          bytes += chunk.length;
        });
        stream.on("end", finish);
        stream.on("error", () => (bytes > 0 ? finish() : done({ ...base, ok: false, error: "The response was cut off" })));
        res.on("aborted", finish);
      },
    );

    const timer = setTimeout(() => {
      req.destroy();
      done(failed(url.href, url.href, 0, "Timed out"));
    }, opts.timeoutMs);

    req.on("error", (err: NodeJS.ErrnoException) => done(failed(url.href, url.href, 0, friendlyError(err))));
    req.end();
  });
}

/** Name of the firewall that challenged or blocked this request, if the headers say so. */
export function firewallOf(res: FetchResult): string | null {
  const h = res.headers;
  if (res.status !== 403 && res.status !== 429 && res.status !== 503) return null;
  if (h["x-vercel-mitigated"]) return "Vercel";
  if (h["cf-mitigated"] || (h["server"] ?? "").toLowerCase() === "cloudflare") return "Cloudflare";
  if (h["x-sucuri-id"] || h["x-sucuri-block"]) return "Sucuri";
  if ((h["server"] ?? "").toLowerCase().includes("akamai")) return "Akamai";
  if (h["x-datadome"] || h["x-dd-b"]) return "DataDome";
  return null;
}

/** A visitor-facing reason a page couldn't be read. */
export function loadError(res: FetchResult, what = "page"): string {
  const fw = firewallOf(res);
  if (fw) return `The site's firewall (${fw}) blocked our checker with HTTP ${res.status}, so we couldn't read the ${what}. Real visitors and verified search bots may still get through. Try again in a minute, or check your firewall's bot settings.`;
  if (res.error) return `We couldn't load the ${what}: ${res.error}.`;
  if (res.wrongType) return "That URL didn't return a web page.";
  return `The ${what} returned HTTP ${res.status}.`;
}

/** Runs `fn` over `items` with at most `limit` in flight. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}
