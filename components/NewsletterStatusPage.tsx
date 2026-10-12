import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/** Landing pages for the newsletter confirm and unsubscribe links (noindex). */
export function NewsletterStatusPage({ title, body, links }: { title: string; body: string; links: { href: string; label: string; primary?: boolean }[] }) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="font-medium mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            {title}
          </h1>
          <p className="text-base sm:text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
            {body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} className={`btn ${l.primary ? "btn-primary" : "btn-secondary"}`}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
