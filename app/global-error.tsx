"use client";

import "./globals.css";

// Replaces the root layout when the layout itself throws, so it brings its own
// <html> and <body> and fetches nothing. Plain styles keep it working even if
// the rest of the app's code is what broke.
export default function GlobalError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#ffffff", color: "#111111", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
        <title>Something Went Wrong | Draftly</title>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "96px 16px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 40px" }}>draftly</p>
            <h1 style={{ fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.03em", fontWeight: 500, margin: "0 0 20px" }}>The Site Didn&apos;t Load</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#555555", margin: 0 }}>
              Something went wrong on our side. Try again in a moment, or email preston@draftly.blog if it keeps happening.
            </p>
            <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{ background: "#ff6b3d", color: "#ffffff", border: 0, borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
              >
                Try again
              </button>
              {/* A full page load, not a client navigation: the app that just crashed shouldn't be reused. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: "12px 20px", fontSize: 15, fontWeight: 600, color: "#111111", textDecoration: "none" }}>
                Go to the homepage
              </a>
            </div>
            {error.digest && <p style={{ marginTop: 32, fontSize: 12, color: "#8a8a8a" }}>Error reference: {error.digest}</p>}
          </div>
        </main>
      </body>
    </html>
  );
}
