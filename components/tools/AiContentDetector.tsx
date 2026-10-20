"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { analytics } from "@heycatch/sdk";
import { countWords, type Block } from "@/lib/tools/ai-detect/editor-text";
import { AI_SAMPLE, HUMAN_SAMPLE } from "@/lib/tools/ai-detect/fixtures";
import {
  CONFIDENCE_TEXT,
  LABELS,
  MAX_INPUT_CHARS,
  MIN_SENTENCES,
  MIN_WORDS,
  SIGNAL_INFO,
  needleAngle,
  readable,
  runDetector,
  type DetectorResult,
} from "@/lib/tools/ai-detect/report";

// The free AI content detector. Pasted text is scored right here, in the browser,
// with the detector ported from the app (lib/tools/ai-detect). URL mode asks
// /api/tools/ai-detector for the page's article text, then scores it the same way.

type Mode = "text" | "url";
type Source = { kind: "text" } | { kind: "url"; checked: string; title: string | null; notes: string[] };
type Outcome = { result: DetectorResult; source: Source };

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const surface = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" };
const fieldStyle = {
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-strong)",
  ["--tw-ring-color" as string]: "var(--color-border-accent)",
};
const errorStyle = { background: "rgba(220, 38, 38, 0.10)", color: "#b91c1c" };

const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

export function AiContentDetector({ registerUrl, button }: { registerUrl: string; button: string }) {
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => (text.trim() ? countWords(text) : 0), [text]);

  function track(m: Mode) {
    // Tool name and mode only. The text and the URL never go to analytics.
    try {
      analytics.trackEvent("free_tool_used", { tool: "ai-detector", mode: m });
    } catch {}
  }

  function show(result: DetectorResult, source: Source) {
    setOutcome({ result, source });
    setState("done");
    requestAnimationFrame(() => resultsRef.current?.focus());
  }

  function checkText(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Paste some text to check.");
      setState("error");
      return;
    }
    setError("");
    track("text");
    show(runDetector(text), { kind: "text" });
  }

  async function checkUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    setOutcome(null);
    track("url");
    try {
      const res = await fetch("/api/tools/ai-detector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; markdown?: string; checked?: string; title?: string | null; notes?: string[] };
      if (!res.ok || data.error || typeof data.markdown !== "string") {
        setError(data.error || "Something went wrong. Try again.");
        setState("error");
        return;
      }
      show(runDetector(data.markdown), { kind: "url", checked: data.checked ?? url, title: data.title ?? null, notes: data.notes ?? [] });
    } catch {
      setError("Couldn't reach the checker. Check your connection and try again.");
      setState("error");
    }
  }

  function switchMode(m: Mode) {
    setMode(m);
    if (state === "error") setState("idle");
  }

  function loadSample(sample: string) {
    setMode("text");
    setText(sample);
    setError("");
    show(runDetector(sample), { kind: "text" });
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "text", label: "Paste text" },
    { id: "url", label: "Check a URL" },
  ];

  // ph-no-capture keeps HeyCatch autocapture away from the form and results,
  // so nothing a visitor types or checks is sent to analytics.
  return (
    <div className="ph-no-capture">
      <div className="rounded-2xl p-4 sm:p-6" style={surface}>
        <div role="tablist" aria-label="What to check" className="inline-flex rounded-full p-1 mb-4" style={{ background: "var(--color-bg-elevated)" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`detector-tab-${t.id}`}
              aria-controls={`detector-panel-${t.id}`}
              aria-selected={mode === t.id}
              onClick={() => switchMode(t.id)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  const next = mode === "text" ? "url" : "text";
                  switchMode(next);
                  document.getElementById(`detector-tab-${next}`)?.focus();
                }
              }}
              tabIndex={mode === t.id ? 0 : -1}
              className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
              style={mode === t.id ? { background: "var(--color-bg-primary)", color: "var(--color-text-primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" } : { color: "var(--color-text-secondary)" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <form id="detector-panel-text" role="tabpanel" aria-labelledby="detector-tab-text" onSubmit={checkText}>
            <label htmlFor="detector-text" className="sr-only">
              Text to check
            </label>
            <textarea
              id="detector-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX_INPUT_CHARS}
              rows={11}
              placeholder="Paste a blog post, a web page or an email here. At least 45 words and 3 sentences."
              className="w-full rounded-xl px-4 py-3 text-base leading-relaxed outline-none focus:ring-2 resize-y min-h-[220px]"
              style={fieldStyle}
              aria-describedby="detector-count detector-privacy"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
              <span id="detector-count" style={words && words < MIN_WORDS ? { color: "#9a6b00" } : muted} aria-live="polite">
                {plural(words, "word")}
                {words && words < MIN_WORDS ? `. Add ${MIN_WORDS - words} more for a score.` : words >= MIN_WORDS && words < 150 ? ". 150 or more gives a firmer score." : ""}
              </span>
              <span className="flex flex-wrap gap-x-3" style={muted}>
                Try a sample:
                <button type="button" className="underline underline-offset-2" style={secondary} onClick={() => loadSample(AI_SAMPLE)}>
                  AI-written
                </button>
                <button type="button" className="underline underline-offset-2" style={secondary} onClick={() => loadSample(HUMAN_SAMPLE)}>
                  human-written
                </button>
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <button type="submit" className="btn btn-primary justify-center">
                {button}
              </button>
              <p id="detector-privacy" className="text-xs max-w-md" style={muted}>
                Free, no sign-up. Your text is scored in your browser and never leaves your device. No AI model reads it.
              </p>
            </div>
          </form>
        ) : (
          <form id="detector-panel-url" role="tabpanel" aria-labelledby="detector-tab-url" onSubmit={checkUrl}>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
              <div className="min-w-0">
                <label htmlFor="detector-url" className="block text-sm font-semibold mb-1.5">
                  Page URL
                </label>
                <input
                  id="detector-url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={2048}
                  required
                  placeholder="yourbusiness.com/blog/your-post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={state === "running"}
                  className="w-full rounded-lg px-4 py-3 text-base outline-none transition-colors focus:ring-2"
                  style={fieldStyle}
                />
              </div>
              <button type="submit" className="btn btn-primary justify-center" disabled={state === "running"} style={state === "running" ? { opacity: 0.7, cursor: "wait" } : undefined}>
                {state === "running" ? "Checking..." : button}
              </button>
            </div>
            <p className="mt-3 text-xs" style={muted}>
              We fetch the page, pull out the article text and send it back to your browser to score. We don&apos;t store the URL, the text or the result.
            </p>
          </form>
        )}
      </div>

      <div aria-live="polite">
        {state === "running" ? (
          <p className="mt-6 text-sm" style={secondary} role="status">
            Fetching the page. This usually takes a few seconds.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="mt-6 rounded-xl px-4 py-3 text-sm font-medium" role="alert" style={errorStyle}>
            {error}
          </p>
        ) : null}
      </div>

      {outcome && state === "done" ? (
        <div ref={resultsRef} tabIndex={-1} className="mt-8 outline-none" aria-labelledby="detector-results-heading">
          <Results outcome={outcome} registerUrl={registerUrl} />
        </div>
      ) : null}
    </div>
  );
}

function Results({ outcome, registerUrl }: { outcome: Outcome; registerUrl: string }) {
  const { result, source } = outcome;
  const d = result.detection;
  const flagNumber = new Map(d.sentences.map((s, i) => [s.id, i + 1]));
  const [active, setActive] = useState<string | null>(null);
  const label = LABELS[d.label];

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="detector-results-heading" className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
          Results
        </h2>
        {source.kind === "url" ? (
          <p className="text-sm break-all" style={muted}>
            Checked {source.title ? `"${source.title}" at ` : ""}
            {source.checked}
          </p>
        ) : null}
      </div>

      {/* Score card */}
      <section aria-label="Score" className="mt-4 rounded-2xl p-5 sm:p-7 grid gap-6 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] items-center" style={surface}>
        <div className="w-full max-w-[260px] mx-auto">
          <Gauge score={result.enough ? d.score : null} />
        </div>
        {result.enough ? (
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.12em]" style={muted}>
              Reads as AI
            </p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              <span className="font-semibold tabular-nums" style={{ fontSize: "56px", lineHeight: 1, letterSpacing: "-0.04em" }}>
                {d.score}
                <span className="text-xl font-medium" style={muted}>
                  /100
                </span>
              </span>
              <span className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: label.bg, color: label.color }}>
                {label.text}
              </span>
            </p>
            <p className="mt-3 text-sm" style={secondary}>
              {CONFIDENCE_TEXT[d.confidence]}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Stat label="Words scored" value={d.wordCount.toLocaleString("en-US")} />
              <Stat label="Flagged sentences" value={String(d.sentences.length)} />
              <Stat label="Text in flagged passages" value={`${d.flaggedShare}%`} />
            </dl>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
              Too short to score reliably
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={secondary}>
              The detector needs at least {MIN_WORDS} words and {MIN_SENTENCES} sentences of prose to measure. This has {plural(d.wordCount, "word")} in{" "}
              {plural(result.sentences, "sentence")}. Headings, quotes, code and tables don&apos;t count. Add more text and check again.
            </p>
          </div>
        )}
      </section>

      {source.kind === "url" && source.notes.length ? (
        <div className="mt-3 text-sm space-y-1" style={muted}>
          {source.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      ) : null}

      {result.enough ? (
        <>
          {/* Signals */}
          <section className="mt-8" aria-labelledby="detector-signals-heading">
            <h3 id="detector-signals-heading" className="text-xl font-semibold">
              {d.signals.length ? `What pushed the score up` : "No machine-like signals stood out"}
            </h3>
            {d.signals.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {d.signals.map((s) => {
                  const info = SIGNAL_INFO[s.signal];
                  const pct = Math.round(s.value * 100);
                  return (
                    <li key={s.signal} className="rounded-xl p-4" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{info.name}</span>
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: s.value >= 0.66 ? "#b4380f" : s.value >= 0.33 ? "#9a6b00" : "var(--color-text-muted)" }}>
                          {s.value >= 0.66 ? "Strong" : s.value >= 0.33 ? "Some" : "Slight"}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-bg-elevated)" }} role="img" aria-label={`${pct} out of 100`}>
                        <div className="h-full rounded-full" style={{ width: `${Math.max(4, pct)}%`, background: s.value >= 0.66 ? "var(--color-accent)" : "#ffc53d" }} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed" style={secondary}>
                        {info.text}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-sm" style={secondary}>
                The rhythm, wording and structure all read like a person wrote them.
              </p>
            )}
          </section>

          {/* The text with flagged sentences highlighted */}
          <section className="mt-8" aria-labelledby="detector-text-heading">
            <h3 id="detector-text-heading" className="text-xl font-semibold">
              {d.sentences.length ? "Your text, with the flagged sentences highlighted" : "Your text"}
            </h3>
            <p className="mt-1 text-sm" style={muted}>
              {d.sentences.length
                ? "Hover over or tap a highlighted sentence to see why it was flagged. The full list is below."
                : d.score >= 40
                  ? "No passage scored high enough on its own to flag sentences in it."
                  : "Nothing was flagged."}
            </p>
            <div className="mt-4 rounded-2xl p-4 sm:p-6 sm:max-h-[640px] sm:overflow-y-auto text-base leading-[1.8] space-y-4" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
              {result.seg.blocks.map((b, i) => (
                <BlockView key={i} block={b} flagNumber={flagNumber} reasons={d.sentences} active={active} setActive={setActive} />
              ))}
            </div>
          </section>

          {d.sentences.length ? (
            <section className="mt-8" aria-labelledby="detector-flags-heading">
              <h3 id="detector-flags-heading" className="text-xl font-semibold">
                {plural(d.sentences.length, "flagged sentence")} and why
              </h3>
              <ol className="mt-4 space-y-3">
                {d.sentences.map((s, i) => (
                  <li key={s.id} id={`detector-flag-${i + 1}`} className="rounded-xl p-4 flex gap-3" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
                    <FlagBadge n={i + 1} />
                    <div className="min-w-0">
                      <p className="leading-relaxed break-words">{readable(s.text)}</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {s.reasons.map((r) => (
                          <li key={r} className="rounded-full px-2.5 py-0.5 text-xs font-medium break-words" style={{ background: "var(--color-accent-muted)", color: "#9c3412" }}>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <p className="mt-6 text-sm leading-relaxed" style={muted}>
            {d.note}
          </p>

          {/* Next step */}
          <section className="mt-8 rounded-2xl p-6 sm:p-8" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }} aria-labelledby="detector-next-heading">
            <h3 id="detector-next-heading" className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
              {d.sentences.length ? `Rewrite the ${plural(d.sentences.length, "flagged sentence")} in Draftly` : "Check and fix more copy in Draftly"}
            </h3>
            <p className="mt-2 leading-relaxed max-w-2xl" style={secondary}>
              Draftly&apos;s Editor runs this same check, then Edit rewrites only the flagged sentences. Numbers, quotes and links stay exactly as written, and you keep or reject each change.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a href={registerUrl} className="btn btn-primary">
                {d.sentences.length ? "Fix the flagged sentences" : "Try Draftly free"}
              </a>
              <span className="text-sm" style={secondary}>
                Free first post. No credit card.
              </span>
            </div>
            <p className="mt-4 text-sm" style={secondary}>
              Learn more:{" "}
              <Link href="/feature/ai-detector" className="underline underline-offset-2" style={{ color: "var(--color-text-primary)" }}>
                the AI detector in Draftly
              </Link>{" "}
              and{" "}
              <Link href="/feature/ai-copy-editor" className="underline underline-offset-2" style={{ color: "var(--color-text-primary)" }}>
                the AI copy editor
              </Link>
              .
            </p>
          </section>
        </>
      ) : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs leading-snug" style={muted}>
        {label}
      </dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function FlagBadge({ n }: { n: number }) {
  return (
    <span
      className="inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold tabular-nums"
      style={{ background: "var(--color-accent)", color: "#fff" }}
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

function BlockView({
  block,
  flagNumber,
  reasons,
  active,
  setActive,
}: {
  block: Block;
  flagNumber: Map<string, number>;
  reasons: { id: string; reasons: string[] }[];
  active: string | null;
  setActive: (id: string | null) => void;
}) {
  if (block.kind === "protected") {
    return (
      <p className="text-sm italic break-words" style={muted}>
        Not scored (quote, code or table): {readable(block.raw ?? "").replace(/\s+/g, " ").slice(0, 160)}
        {(block.raw ?? "").length > 160 ? "..." : ""}
      </p>
    );
  }
  const activeHere = active && block.units.some((u) => u.id === active) ? active : null;
  const body = block.units.map((u, k) => {
    const join = k === 0 ? "" : (block.joins?.[k] ?? " ");
    const n = flagNumber.get(u.id);
    const t = readable(u.text);
    return (
      <Fragment key={u.id}>
        {join}
        {n ? (
          <mark
            tabIndex={0}
            role="button"
            aria-expanded={active === u.id}
            aria-controls={`detector-why-${u.id}`}
            aria-label={`Flagged sentence ${n}: ${t}`}
            onMouseEnter={() => setActive(u.id)}
            onFocus={() => setActive(u.id)}
            onClick={() => setActive(u.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActive(active === u.id ? null : u.id);
              } else if (e.key === "Escape") setActive(null);
            }}
            className="cursor-pointer rounded-[4px] px-0.5 outline-none focus-visible:ring-2"
            style={{
              background: active === u.id ? "rgba(255, 107, 61, 0.32)" : "rgba(255, 107, 61, 0.16)",
              boxShadow: "inset 0 -2px 0 var(--color-accent)",
              color: "inherit",
              ["--tw-ring-color" as string]: "var(--color-accent)",
            }}
          >
            {t}
            <sup className="ml-0.5 text-[10px] font-bold" style={{ color: "#b4380f" }} aria-hidden="true">
              {n}
            </sup>
          </mark>
        ) : (
          t
        )}
      </Fragment>
    );
  });
  const why = activeHere ? reasons.find((r) => r.id === activeHere) : undefined;
  const content =
    block.kind === "heading" ? (
      <p className="font-semibold" style={{ fontSize: block.prefix.trim().length <= 2 ? "1.2rem" : "1.05rem" }}>
        {body}
        <span className="ml-2 text-xs font-normal" style={muted}>
          (heading, not scored)
        </span>
      </p>
    ) : block.kind === "list_item" ? (
      <p className="pl-5 relative break-words">
        <span className="absolute left-1" aria-hidden="true">
          •
        </span>
        {body}
      </p>
    ) : (
      <p className="break-words">{body}</p>
    );
  return (
    <div>
      {content}
      {why && activeHere ? (
        <div id={`detector-why-${activeHere}`} className="mt-2 rounded-xl p-3 text-sm" style={{ background: "#111", color: "#fff" }}>
          <p className="font-semibold mb-1">Why sentence {flagNumber.get(activeHere)} was flagged</p>
          <ul className="list-disc pl-5 space-y-0.5" style={{ color: "#e9e9e9" }}>
            {why.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** The detector gauge in the feature-art style: flat fills, ink outlines, a needle from human to AI. */
function Gauge({ score }: { score: number | null }) {
  const [shown, setShown] = useState(-90);
  useEffect(() => {
    // Start at "human" and swing to the score once mounted (CSS skips the swing with reduced motion).
    const id = requestAnimationFrame(() => setShown(score === null ? -90 : needleAngle(score)));
    return () => cancelAnimationFrame(id);
  }, [score]);
  const cx = 160;
  const cy = 156;
  const R = 128;
  const r = 70;
  const pt = (s: number, rad: number) => {
    const a = ((180 - s * 1.8) * Math.PI) / 180;
    return `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy - rad * Math.sin(a)).toFixed(2)}`;
  };
  const sector = (a: number, b: number) => `M${pt(a, R)} A${R} ${R} 0 0 1 ${pt(b, R)} L${pt(b, r)} A${r} ${r} 0 0 0 ${pt(a, r)} Z`;
  const dim = score === null ? 0.35 : 1;
  return (
    <svg viewBox="0 0 320 196" className="w-full h-auto" role="img" aria-label={score === null ? "Gauge with no score: too little text" : `Gauge reading ${score} out of 100`}>
      <g stroke="#111" strokeWidth="3" strokeLinejoin="round" opacity={dim}>
        <path d={sector(0, 40)} fill="#a9e0c6" />
        <path d={sector(40, 70)} fill="#ffe39a" />
        <path d={sector(70, 100)} fill="#ff7a4d" />
      </g>
      {score !== null ? (
        <g className="detector-needle" style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${shown}deg)` }}>
          <path d={`M${cx - 5} ${cy} L${cx} ${cy - 112} L${cx + 5} ${cy} Z`} fill="#111" />
        </g>
      ) : null}
      <circle cx={cx} cy={cy} r="11" fill="#fff" stroke="#111" strokeWidth="3" />
      <text x="34" y="186" fontSize="15" fontWeight="700" fill="#111" style={{ fontFamily: "var(--font-ui)" }}>
        Human
      </text>
      <text x="286" y="186" fontSize="15" fontWeight="700" fill="#111" textAnchor="end" style={{ fontFamily: "var(--font-ui)" }}>
        AI
      </text>
    </svg>
  );
}
