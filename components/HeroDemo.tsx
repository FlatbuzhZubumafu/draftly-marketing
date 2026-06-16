"use client";

import { useState } from "react";
import type { MarketingSettings } from "@/lib/graphql";
import { Globe, Loader2, ArrowRight, Check, FileText, BarChart3, Sparkles } from "lucide-react";
import { SquiggleUnderline } from "./SquiggleUnderline";

const LOADING_STAGES = [
  { message: "Reading your homepage copy...", duration: 2200 },
  { message: "Mapping your product to search intent...", duration: 1800 },
  { message: "Pulling this week's relevant headlines...", duration: 2000 },
  { message: "Writing the draft...", duration: 2500 },
  { message: "Tightening the intro...", duration: 1500 },
];

const DEMO_POST = {
  title: "Why Your Blog Isn't Getting Traffic (And the Fix Most Businesses Miss)",
  metaDescription:
    "Most small business blogs fail for the same quiet reason — the content answers questions nobody asked. Here's how to turn that around without writing more.",
  intro: `Here's the uncomfortable truth about most business blogs: they're written for the owner, not the reader.

The topics feel important internally. The writing is competent. But Google doesn't send traffic to content that talks about your company — it sends traffic to content that answers real questions people are already searching for.

That gap between "content we felt like writing" and "content people are actually looking for" is where most blogs quietly die. And closing it doesn't require writing more. It requires writing differently.`,
  sections: [
    {
      heading: "The problem isn't volume — it's alignment",
      body: `Publishing more often doesn't fix a misaligned content strategy. It just produces more of the wrong thing faster.`,
    },
  ],
};

export function HeroDemo({ settings }: { settings: MarketingSettings }) {
  const s = settings;
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<"form" | "loading" | "preview">("form");
  const [loadingMessage, setLoadingMessage] = useState(LOADING_STAGES[0].message);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStage("loading");
    setLoadingProgress(0);
    let elapsed = 0;
    const totalDuration = LOADING_STAGES.reduce((sum, st) => sum + st.duration, 0);
    let stageIdx = 0;
    let stageElapsed = 0;
    const interval = setInterval(() => {
      elapsed += 80;
      stageElapsed += 80;
      setLoadingProgress(Math.min((elapsed / totalDuration) * 100, 98));
      if (stageElapsed >= LOADING_STAGES[stageIdx].duration) {
        stageElapsed = 0;
        stageIdx = Math.min(stageIdx + 1, LOADING_STAGES.length - 1);
        setLoadingMessage(LOADING_STAGES[stageIdx].message);
      }
    }, 80);
    await new Promise((r) => setTimeout(r, totalDuration));
    clearInterval(interval);
    setLoadingProgress(100);
    await new Promise((r) => setTimeout(r, 300));
    setStage("preview");
  };

  const handleRegister = () => {
    if (url.trim()) {
      try { localStorage.setItem("draftly_pending_url", url.trim()); } catch {}
    }
    window.location.href = "https://app.draftly.blog/register";
  };

  const registerUrl = `${s.appName}/register`;

  return (
    <section
      className="relative flex items-center overflow-hidden pt-24 pb-16 px-4"
      style={{ background: "var(--color-bg-primary)", minHeight: stage === "form" ? "90vh" : "auto" }}
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
        {/* === FORM STATE === */}
        {stage === "form" && (
          <>
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
                <button type="submit" className="btn btn-primary whitespace-nowrap">
                  Generate Free Post <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-sm mt-4" style={{ color: "var(--color-text-muted)" }}>{s.heroNote}</p>
            </div>
          </>
        )}

        {/* === LOADING STATE === */}
        {stage === "loading" && (
          <div className="max-w-md mx-auto py-12">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8"
                 style={{ background: "var(--color-accent-muted)" }}>
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: "var(--color-accent)" }} />
            </div>
            <h2 className="text-2xl font-semibold mb-3">{loadingMessage}</h2>
            <p className="mb-8 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Analyzing <span className="font-medium break-all" style={{ color: "var(--color-text-primary)" }}>{url}</span>
            </p>
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "var(--color-bg-subtle)" }}>
              <div className="h-full rounded-full transition-all duration-300 ease-out"
                   style={{ width: `${loadingProgress}%`, background: "var(--gradient-accent)" }} />
            </div>
            <div className="mt-10 space-y-3 text-left">
              {LOADING_STAGES.map((st, i) => {
                const currentIdx = LOADING_STAGES.findIndex((ls) => ls.message === loadingMessage);
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                    active ? "font-medium" : done ? "opacity-60" : "opacity-40"
                  }`}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {done ? (
                        <Check className="w-3 h-3" style={{ color: "var(--color-blue)" }} />
                      ) : active ? (
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-accent)" }} />
                      ) : (
                        <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-bg-subtle)" }} />
                      )}
                    </div>
                    {st.message}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === PREVIEW STATE === */}
        {stage === "preview" && (
          <div className="max-w-5xl mx-auto py-8">
            <div className="text-center mb-10">
              <span style={{
                display: "inline-flex", gap: "0.25rem", padding: "0.25rem 0.75rem",
                borderRadius: "9999px", fontSize: "12px", fontWeight: 600,
                background: "var(--color-accent-muted)", color: "var(--color-accent)",
              }}>
                <Check className="w-3.5 h-3.5" /> Your post is ready
              </span>
              <h2 className="text-3xl font-medium mt-4 mb-2">That's your post. Not a template.</h2>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Create a free account to read the full draft, edit it, and publish it directly to your blog.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <div className="rounded-xl overflow-hidden card-depth"
                     style={{ background: "var(--color-bg-surface)" }}>
                  <div className="px-8 pt-8 pb-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                      <span className="px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "var(--color-blue-muted)", color: "var(--color-blue)" }}>
                        Blog Post
                      </span>
                      <span>•</span><span>~1,400 words</span><span>•</span>
                      <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> SEO Score: 84</span>
                    </div>
                    <h3 className="text-2xl font-semibold leading-snug mb-3">{DEMO_POST.title}</h3>
                    <p className="text-sm italic" style={{ color: "var(--color-text-secondary)" }}>{DEMO_POST.metaDescription}</p>
                  </div>
                  <div className="relative">
                    <div className="px-8 py-6 select-none pointer-events-none">
                      <p className="leading-relaxed whitespace-pre-line blur-sm opacity-70">{DEMO_POST.intro}</p>
                      <div className="mt-6 blur-sm opacity-70">
                        <h4 className="text-lg font-semibold mb-3">{DEMO_POST.sections[0].heading}</h4>
                        <p className="leading-relaxed">{DEMO_POST.sections[0].body.slice(0, 200)}...</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: "linear-gradient(to bottom, transparent, rgba(247,247,245,0.6), var(--color-bg-surface))" }} />
                    <div className="absolute inset-x-0 bottom-4 flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                           style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", boxShadow: "var(--shadow-card)" }}>
                        <FileText className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                        <span>Create a free account to read the full post</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 lg:sticky lg:top-24">
                <div className="rounded-xl p-6 card-depth"
                     style={{ border: "2px solid var(--color-border-accent)", background: "var(--color-accent-muted)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--color-accent)" }}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Unlock your post — free</h3>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>No credit card required</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-5">
                    {["Full post access & editing", "Publish to any CMS platform", "1,000 free monthly credits"].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-blue)" }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button onClick={handleRegister} className="btn btn-primary w-full justify-center text-sm">
                    <Sparkles className="w-4 h-4" /> Create Free Account
                  </button>
                  <p className="text-center text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
                    Already have an account?{" "}
                    <a href={registerUrl} className="font-medium hover:underline" style={{ color: "var(--color-accent)" }}>Log in</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
