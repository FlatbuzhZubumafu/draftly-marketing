// Limits for the free AI tools, which cost money per run (about $0.001 to $0.003
// on GPT 6 Luna). Same in-memory approach as the checkers (lib/tools/rate-limit.ts):
// each warm server instance keeps its own counters, so the real ceilings are these
// numbers times the number of warm instances. The daily caps below bound the worst
// case; a Vercel Firewall rate-limit rule on /api/tools/* or a shared store
// (Upstash/Vercel KV) makes them global if abuse shows up.
import { SlidingLimiter } from "../rate-limit.ts";

const DAY_MS = 86_400_000;

/** Per visitor IP, shared by both AI tools. */
export const aiPerMinute = new SlidingLimiter(3, 60_000);
export const aiPerHour = new SlidingLimiter(10, 3_600_000);
export const aiPerDay = new SlidingLimiter(20, DAY_MS);

/** Runs and dollars per UTC day for this server instance. Fails closed once either is used up. */
export class DailyBudget {
  private day = "";
  private runs = 0;
  private spent = 0;
  private readonly maxRuns: number;
  private readonly maxUsd: number;
  constructor(maxRuns: number, maxUsd: number) {
    this.maxRuns = maxRuns;
    this.maxUsd = maxUsd;
  }

  private roll(now: number) {
    const d = new Date(now).toISOString().slice(0, 10);
    if (d !== this.day) {
      this.day = d;
      this.runs = 0;
      this.spent = 0;
    }
  }

  /** Reserves one run. False when today's runs or spend are used up. */
  take(now = Date.now()): boolean {
    this.roll(now);
    if (this.runs >= this.maxRuns || this.spent >= this.maxUsd) return false;
    this.runs++;
    return true;
  }

  /** Records what a run actually cost. */
  spend(usd: number, now = Date.now()) {
    this.roll(now);
    if (Number.isFinite(usd) && usd > 0) this.spent += usd;
  }

  /** Gives a reserved run back (the call failed before reaching the model). */
  refund(now = Date.now()) {
    this.roll(now);
    this.runs = Math.max(0, this.runs - 1);
  }

  get state() {
    return { day: this.day, runs: this.runs, spent: this.spent };
  }
}

function envNumber(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** 300 runs or $1 a day per instance by default; override with TOOLS_AI_DAILY_RUNS / TOOLS_AI_DAILY_USD. */
export const dailyBudget = new DailyBudget(envNumber("TOOLS_AI_DAILY_RUNS", 300), envNumber("TOOLS_AI_DAILY_USD", 1));
