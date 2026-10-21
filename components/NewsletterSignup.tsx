"use client";

import { useState, type FormEvent } from "react";
import { NEWSLETTER_CONSENT_VERSION, NEWSLETTER_ENDPOINT, type NewsletterLocation } from "@/lib/newsletter";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  location: NewsletterLocation;
  /** "dark" sits on the black footer. */
  tone?: "light" | "dark";
  /** One heading line and the form, no subhead: for the footer. */
  compact?: boolean;
  className?: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function currentUtm(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value.slice(0, 100);
  }
  return utm;
}

/**
 * Newsletter signup (double opt-in). Posts to the newsletter-subscribe edge
 * function, which emails a confirmation link; nobody is added until they click it.
 * The consent line below the field is stored with the signup (consent_version),
 * so change NEWSLETTER_CONSENT_VERSION and the server text together.
 */
export function NewsletterSignup({ location, tone = "light", compact = false, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const dark = tone === "dark";
  const headingId = `newsletter-heading-${location}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          location,
          page: window.location.pathname,
          utm: currentUtm(),
          consent_version: NEWSLETTER_CONSENT_VERSION,
          website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      window.gtag?.("event", "newsletter_signup", { location });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const muted = dark ? "#888" : "var(--color-text-secondary)";
  const faint = dark ? "#666" : "var(--color-text-muted)";

  return (
    <section
      data-toc-skip
      aria-labelledby={headingId}
      data-newsletter-location={location}
      className={`${dark ? "" : "rounded-xl p-6 sm:p-8"} ${className}`}
      style={dark ? undefined : { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
    >
      <h2
        id={headingId}
        className="font-medium"
        style={{
          fontSize: compact ? "1rem" : dark ? "1.375rem" : "1.5rem",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: dark ? "#fff" : "var(--color-text-primary)",
        }}
      >
        One practical SEO-writing tip, every other week
      </h2>
      {compact ? null : (
        <p className="mt-2 text-base" style={{ color: muted }}>
          One tip per email. Unsubscribe anytime.
        </p>
      )}

      {status === "success" ? (
        <p role="status" className={`${compact ? "mt-3" : "mt-5"} rounded-lg px-4 py-3 text-base font-medium`} style={{ background: dark ? "rgba(255,255,255,0.06)" : "var(--color-accent-muted)", color: dark ? "#fff" : "var(--color-text-primary)" }}>
          Check your inbox to confirm. The link is in an email from hello@draftly.blog.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate={false} className={compact ? "mt-3" : "mt-5"}>
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor={`newsletter-email-${location}`} className="sr-only">
              Email address
            </label>
            <input
              id={`newsletter-email-${location}`}
              type="email"
              name="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "submitting"}
              aria-invalid={status === "error" ? true : undefined}
              aria-describedby={status === "error" ? `newsletter-error-${location}` : undefined}
              className={`w-full sm:flex-1 min-w-0 rounded-lg px-4 ${compact ? "py-2.5" : "py-3"} text-base outline-none transition-colors focus:ring-2`}
              style={{
                background: dark ? "#111" : "var(--color-bg-primary)",
                color: dark ? "#fff" : "var(--color-text-primary)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.16)" : "var(--color-border-strong)"}`,
                // Tailwind's ring colour, via the brand accent.
                ["--tw-ring-color" as string]: "var(--color-border-accent)",
              }}
            />
            {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label htmlFor={`newsletter-website-${location}`}>Website</label>
              <input id={`newsletter-website-${location}`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            <button type="submit" className="btn btn-primary justify-center" disabled={status === "submitting"} style={{ ...(compact ? { paddingTop: 10, paddingBottom: 10, fontSize: 15 } : {}), ...(status === "submitting" ? { opacity: 0.7, cursor: "wait" } : {}) }}>
              {status === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {status === "error" ? (
            <p id={`newsletter-error-${location}`} role="alert" className="mt-3 text-sm" style={{ color: dark ? "#ff9b7a" : "#c2410c" }}>
              {error}
            </p>
          ) : null}
        </form>
      )}

      <p className="mt-3 text-xs leading-relaxed" style={{ color: faint }}>
        We&apos;ll email you once to confirm. By subscribing you agree to our{" "}
        <a href="/privacy-policy" className="underline underline-offset-2" style={{ color: dark ? "#888" : "var(--color-text-secondary)" }}>
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
}
