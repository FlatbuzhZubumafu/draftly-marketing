// In-memory rate limits for the free tools. Each server instance keeps its own
// counters, so the real ceiling is (limit x warm instances). That's acceptable for
// cheap, capped scans; move to a shared store (Upstash/Vercel KV) or a Vercel
// Firewall rate-limit rule if abuse shows up.

type Window = { count: number; resetAt: number };

export class SlidingLimiter {
  private hits = new Map<string, Window>();
  private readonly limit: number;
  private readonly windowMs: number;
  // Plain fields, not parameter properties, so node's type stripping can load this file in tests.
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /** Records a hit. Returns seconds to wait when over the limit, else 0. */
  hit(key: string, now = Date.now()): number {
    if (this.hits.size > 10_000) this.sweep(now);
    const w = this.hits.get(key);
    if (!w || w.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return 0;
    }
    if (w.count >= this.limit) return Math.ceil((w.resetAt - now) / 1000);
    w.count++;
    return 0;
  }

  private sweep(now: number) {
    for (const [k, w] of this.hits) if (w.resetAt <= now) this.hits.delete(k);
    // Still huge (a flood of unique keys): start over rather than grow without bound.
    if (this.hits.size > 10_000) this.hits.clear();
  }
}

/** Per visitor IP: a short burst limit and an hourly cap. */
export const perMinute = new SlidingLimiter(5, 60_000);
export const perHour = new SlidingLimiter(30, 3_600_000);
/** Per target site, so the tools can't be pointed at one site over and over. */
export const perTarget = new SlidingLimiter(20, 600_000);

let inFlight = 0;
export const MAX_IN_FLIGHT = 8;

export function acquireSlot(): boolean {
  if (inFlight >= MAX_IN_FLIGHT) return false;
  inFlight++;
  return true;
}
export function releaseSlot() {
  inFlight = Math.max(0, inFlight - 1);
}
