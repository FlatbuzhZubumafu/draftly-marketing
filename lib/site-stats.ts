// Live usage numbers from the app: the public-site-stats edge function in the
// draftly.blog repo (public.public_site_stats(), aggregates only, owner and test
// accounts left out). Cached for an hour. Any failure returns null and the
// homepage hides the usage block, so it never shows a made-up or stale-zero number.

const STATS_URL =
  process.env.DRAFTLY_STATS_URL || "https://oejdjmpgxqtnakoamsjh.supabase.co/functions/v1/public-site-stats";

export type SiteStats = {
  totalPosts: number;
  postsLast7Days: number;
  businesses: number;
};

const count = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : null);

export async function getSiteStats(): Promise<SiteStats | null> {
  try {
    const res = await fetch(STATS_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const json = await res.json();
    const totalPosts = count(json?.total_posts);
    const postsLast7Days = count(json?.posts_last_7_days);
    const businesses = count(json?.businesses);
    if (totalPosts === null || postsLast7Days === null || businesses === null) return null;
    return { totalPosts, postsLast7Days, businesses };
  } catch {
    return null;
  }
}
