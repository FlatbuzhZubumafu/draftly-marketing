"use client";

import { useState } from "react";
import type { MarketingSettings } from "@/lib/graphql";
import { Globe, Loader2, ArrowRight } from "lucide-react";
import { SquiggleUnderline } from "./SquiggleUnderline";

export function HeroDemo({ settings }: { settings: MarketingSettings }) {
  const s = settings;
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    window.location.href = `${s.appName}/register?url=${encodeURIComponent(trimmed)}`;
  };

  return (
    <section
      id="hero"
      className="relative flex items-center overflow-hidden pt-24 pb-16 px-4"
      style={{ background: "var(--color-bg-primary)", minHeight: "90vh" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background: "radial-gradient(ellipse, rgba(255, 107, 61, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container-draftly relative z-10 max-w-4xl text-center">
        <div className="reveal">
          <h1 className="page-heading mb-2">Stop Writing for Algorithms…</h1>
          <h1 className="page-heading mb-8">
            Start Writing for{" "}
            <span className="relative inline-block">
              <em className="italic" style={{ color: "var(--color-accent)" }}>Humans</em>
              <SquiggleUnderline variant="basic" color="#ffce59" />
            </span>
            .
          </h1>
        </div>

        <div className="reveal" style={{ transitionDelay: "0.1s" }}>
          <p className="text-lg leading-relaxed mb-8 max-w-xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            {s.heroSubhead}
          </p>

          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourbusiness.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-base outline-none transition-all"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  boxShadow: "var(--shadow-card)",
                }}
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary whitespace-nowrap">
              {submitting ? (
                <>Taking you to Draftly <Loader2 className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Generate Free Post <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-sm mt-4" style={{ color: "var(--color-text-muted)" }}>{s.heroNote}</p>
        </div>
      </div>
    </section>
  );
}
