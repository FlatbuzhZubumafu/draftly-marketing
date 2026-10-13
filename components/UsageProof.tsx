import { getSiteStats } from "@/lib/site-stats";

/**
 * A signup who agreed to have their face on the site. None have yet: collect
 * permission (and a square photo) before passing any, never use stock faces.
 */
export type UsageAvatar = { name: string; photoUrl: string };

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * Below this many posts the count reads as "barely used" rather than proof,
 * so the strip stays hidden until real usage passes it, then appears on its own.
 */
const MIN_POSTS_TO_SHOW = 500;

/**
 * Real usage under the hero showcase (site audit D3.1): posts Draftly has
 * written and for how many websites, read live from the app. Renders nothing
 * when the numbers can't be fetched or are below MIN_POSTS_TO_SHOW. The weekly line
 * only shows when there were posts this week.
 */
export async function UsageProof({ avatars = [] }: { avatars?: UsageAvatar[] }) {
  const stats = await getSiteStats();
  if (!stats || stats.totalPosts < MIN_POSTS_TO_SHOW) return null;

  return (
    <section aria-label="Draftly usage" className="px-4 py-10" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly flex justify-center">
        <div
          className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl sm:gap-6 text-center sm:text-left rounded-xl px-6 py-5"
          style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
        >
          {avatars.length > 0 && (
            <ul className="flex -space-x-2 flex-shrink-0" aria-label="Some of the people using Draftly">
              {avatars.slice(0, 5).map((a) => (
                <li key={a.photoUrl}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.photoUrl}
                    alt={a.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    className="w-9 h-9 rounded-full object-cover"
                    style={{ border: "2px solid var(--color-bg-surface)" }}
                  />
                </li>
              ))}
            </ul>
          )}
          <p className="text-base leading-snug">
            <span className="text-3xl font-bold align-middle mr-2" style={{ letterSpacing: "-0.03em", color: "var(--color-accent)" }}>
              {fmt(stats.totalPosts)}
            </span>
            <span className="align-middle">
              blog posts written for {fmt(stats.businesses)} {stats.businesses === 1 ? "website" : "websites"} so far
              {stats.postsLast7Days > 0 && (
                <>
                  , <strong>{fmt(stats.postsLast7Days)} this week</strong>
                </>
              )}
              .
            </span>
          </p>
          <p className="text-xs sm:max-w-[11rem]" style={{ color: "var(--color-text-muted)" }}>
            Live count from Draftly&apos;s database, updated hourly. Our own test accounts aren&apos;t counted.
          </p>
        </div>
      </div>
    </section>
  );
}
