"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LOGO_SRC } from "@/lib/site";

// Shown when a page throws, most often because WordPress didn't answer for a blog
// post. It's a Client Component, so it can't use the async Header and Footer.
export default function Error({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  useEffect(() => {
    // The digest matches the server log line for the same failure.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center px-4 py-24" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <img src={LOGO_SRC} alt="" width={64} height={64} className="h-8 w-auto" />
          <span className="text-[26px] font-bold lowercase" style={{ letterSpacing: "var(--tracking-logo)", color: "var(--color-text-primary)" }}>
            draftly
          </span>
        </Link>
        <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2rem, 5vw, 48px)" }}>
          This Page Didn&apos;t Load
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          Something went wrong on our side. Try again, and if it keeps happening, the rest of the site is a click away.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => unstable_retry()} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Go to the homepage
          </Link>
        </div>
        {error.digest && (
          <p className="mt-8 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
