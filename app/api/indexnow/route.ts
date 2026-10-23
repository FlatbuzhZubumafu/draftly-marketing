import sitemap from "@/app/sitemap";
import { submitToIndexNow } from "@/lib/indexnow";

// Daily Vercel cron (vercel.json): submits sitemap URLs modified in the last two
// days to IndexNow, so the window overlaps if one run is missed. ?all=1 submits
// every sitemap URL, for a one-off backfill.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

export async function GET(req: Request) {
  // Vercel sends CRON_SECRET as a bearer token on cron invocations.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.VERCEL_ENV !== "production") {
    return Response.json({ skipped: "not production" });
  }

  const all = new URL(req.url).searchParams.get("all") === "1";
  const since = Date.now() - WINDOW_MS;
  const entries = await sitemap();
  const urls = entries
    .filter((e) => all || (e.lastModified !== undefined && new Date(e.lastModified).getTime() >= since))
    .map((e) => e.url);

  const result = await submitToIndexNow(urls);
  return Response.json(result, { status: result.status >= 400 ? 502 : 200 });
}
