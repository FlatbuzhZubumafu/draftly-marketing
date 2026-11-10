"use client";

import { useId, useState } from "react";
import { ArrowRight, Globe, Loader2 } from "lucide-react";
import { APP_URL } from "@/lib/site";
import { normalizeSiteUrl } from "@/lib/siteUrl";

type Props = {
  label: string;
  /** "dark" for the black DarkCta band, "light" everywhere else. */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * "Paste your URL" for comparison pages, reviews and in-post CTAs. Sends the
 * visitor to /register?url=<site>&ref=<this page>: the app keeps the site
 * through sign-up and starts the first post as soon as the account exists, so
 * the visitor never meets an empty "add your website" step. ref tells the
 * funnel which page sent them (the app reports it on register_viewed).
 * An empty box still goes to sign-up, so the button is never a dead end.
 */
export function SiteUrlForm({ label, variant = "light", className = "" }: Props) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const errorId = useId();
  const dark = variant === "dark";

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const params = new URLSearchParams();
    if (url.trim()) {
      const siteUrl = normalizeSiteUrl(url);
      if (!siteUrl) {
        setError("That doesn't look like a website address. Try something like yourbusiness.com.");
        return;
      }
      params.set("url", siteUrl);
    }
    params.set("ref", window.location.pathname);
    setError("");
    setSubmitting(true);
    // Same GA event the header and pricing links send (components/GoogleAnalytics.tsx).
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", "signup_click", {
      link_location: "url_form",
      link_url: window.location.pathname,
      signup_origin: "site",
      transport_type: "beacon",
    });
    // The app is another origin, so the router can't take this.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `${APP_URL}/register?${params.toString()}`;
  };

  return (
    <div className={className}>
      <form onSubmit={go} noValidate className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <div className="relative flex-1">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: dark ? "#888" : "var(--color-text-muted)" }} />
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Your website address"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="yourbusiness.com"
            className="w-full pl-11 pr-4 py-3 rounded-lg text-base outline-none"
            style={{
              background: dark ? "#1d1d1d" : "var(--color-bg-elevated)",
              border: error ? "1px solid #b42318" : dark ? "1px solid #333" : "1px solid var(--color-border)",
              color: dark ? "#fff" : "var(--color-text-primary)",
            }}
          />
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary whitespace-nowrap justify-center">
          {submitting ? (
            <>Taking you to Draftly <Loader2 className="w-4 h-4 animate-spin" /></>
          ) : (
            <>{label} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
      {error ? (
        <p id={errorId} role="alert" className="text-sm mt-2" style={{ color: dark ? "#ff8a80" : "#b42318" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
