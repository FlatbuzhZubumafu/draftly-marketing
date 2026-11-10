import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Unknown URLs and every notFound() call render this inside the root layout.
// Header and Footer are safe here: their WordPress data falls back to defaults.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const LINKS: [string, string, string][] = [
  ["/", "Home", "What Draftly does and how it writes."],
  ["/blog", "Blog and guides", "Every post and guide on AI writing and SEO."],
  ["/tools", "Free SEO tools", "Check a page for AI visibility, E-E-A-T and more."],
  ["/pricing", "Pricing", "Plans, starting with a free post."],
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <div className="container-draftly max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-accent)" }}>
            404
          </p>
          <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
            We Couldn&apos;t Find That Page
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            The link may be old, or the page may have moved. One of these should get you where you were going.
          </p>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LINKS.map(([href, label, blurb]) => (
              <li key={href}>
                <a href={href} className="block h-full rounded-xl p-5 card-depth transition-colors hover:border-[var(--color-accent)]">
                  <span className="block font-semibold" style={{ color: "var(--color-text-primary)" }}>{label}</span>
                  <span className="block mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
