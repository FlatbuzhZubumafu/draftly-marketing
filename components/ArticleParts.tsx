// Building blocks for long-form marketing pages, lifted from the patterns in
// app/best-ai-for-writing and app/mcp so new pages match them exactly.

import { ChevronDown } from "lucide-react";
import { AccentText } from "./AccentText";

export type Faq = { q: string; a: string };

export function Section({ id, title, children }: { id?: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 max-w-3xl">
      <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
        {title}
      </h2>
      <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </div>
    </section>
  );
}

export const B = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: "var(--color-text-primary)" }}>{children}</strong>
);

export const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} style={{ color: "var(--color-accent)" }}>
    {children}
  </a>
);

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-[11px] h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Byline({ verb, date }: { verb: string; date: string }) {
  return (
    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
      {verb} {date} by{" "}
      <a href="/about" rel="author" style={{ color: "var(--color-accent)" }}>
        Preston Vawdrey
      </a>{" "}
      at Draftly.
    </p>
  );
}

/**
 * FAQs in the homepage's #faq style: one bordered card per question, the first
 * open. Native <details> so it works without JavaScript and every answer is in
 * the HTML for crawlers.
 */
export function FaqList({
  faqs,
  skipLint = [],
  title,
  className = "mt-20 max-w-3xl",
}: {
  faqs: Faq[];
  skipLint?: string[];
  /** Defaults to "Frequently asked questions" with the squiggle on the last word. */
  title?: React.ReactNode;
  className?: string;
}) {
  return (
    <section id="faq" className={className}>
      <h2 className="text-3xl font-medium mb-8" style={{ letterSpacing: "-0.03em" }}>
        {title ?? (
          <>
            Frequently asked{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              questions
            </AccentText>
          </>
        )}
      </h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className="group rounded-lg overflow-hidden transition-shadow hover:shadow-sm"
            style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
              <h3 className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>{f.q}</h3>
              <ChevronDown
                className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180"
                style={{ color: "var(--color-text-muted)" }}
                aria-hidden="true"
              />
            </summary>
            {/* data-lint-skip marks answers that quote banned words on purpose. */}
            <p
              className="px-5 pb-5 text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
              data-lint-skip={skipLint.includes(f.q) ? "" : undefined}
            >
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function DarkCta({ title, body, href, label, secondary }: { title: string; body: string; href: string; label: string; secondary?: { href: string; label: string } }) {
  return (
    <section data-toc-skip className="mt-20 rounded-2xl p-8 sm:p-12" style={{ background: "#111", color: "var(--color-text-inverted)" }}>
      <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
        {title}
      </h2>
      <p className="max-w-2xl mb-8 leading-relaxed" style={{ color: "#bbb" }}>
        {body}
      </p>
      <div className="flex flex-wrap gap-3">
        <a href={href} className="btn btn-primary">
          {label}
        </a>
        {secondary ? (
          <a href={secondary.href} className="underline self-center font-semibold" style={{ color: "#ffce59" }}>
            {secondary.label}
          </a>
        ) : null}
      </div>
    </section>
  );
}
