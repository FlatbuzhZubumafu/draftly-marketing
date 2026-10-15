import { AUTHOR_HEADSHOT, AUTHOR_URL, authorRef } from "@/lib/schema";

// Preston is the only WordPress author today. A post by anyone else gets a plain
// name byline (and a name-only Person in schema) until they have an author page.
const isPreston = (name: string | undefined) => !name || /preston/i.test(name);

/** The BlogPosting author for a WordPress author name. Missing names fall back to Preston. */
export function postAuthorJsonLd(name: string | undefined) {
  return isPreston(name) ? authorRef : { "@type": "Person", name };
}

const DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/**
 * "Updated" shows only when the post changed more than a day after it went out and
 * on a different calendar date, so same-day typo fixes don't read as revisions.
 */
export function updatedDate(published: string, modified: string | undefined): Date | null {
  if (!modified) return null;
  const p = new Date(published);
  const m = new Date(modified);
  if (Number.isNaN(p.getTime()) || Number.isNaN(m.getTime())) return null;
  return m.getTime() - p.getTime() > DAY_MS && formatDate(m) !== formatDate(p) ? m : null;
}

export function PostByline({ authorName, published, modified }: { authorName?: string; published: string; modified?: string }) {
  const preston = isPreston(authorName);
  const pub = new Date(published);
  const updated = updatedDate(published, modified);

  return (
    <div className="flex items-center gap-3 mb-8">
      {preston && (
        <a href={AUTHOR_URL} className="flex-shrink-0" tabIndex={-1} aria-hidden="true">
          <img src={AUTHOR_HEADSHOT} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        </a>
      )}
      <div className="text-sm leading-snug">
        <p className="byline text-gray-700">
          By{" "}
          {preston ? (
            <>
              <a href={AUTHOR_URL} rel="author" className="font-semibold text-gray-900 hover:underline">
                Preston Vawdrey
              </a>
              , Founder of Draftly
            </>
          ) : (
            <span className="font-semibold text-gray-900">{authorName}</span>
          )}
        </p>
        <p className="text-gray-400">
          <time dateTime={published}>{formatDate(pub)}</time>
          {updated && (
            <>
              {" · Updated "}
              <time dateTime={modified}>{formatDate(updated)}</time>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
