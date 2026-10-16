"use client";

import { useMemo, useRef, useState } from "react";
import { analytics } from "@heycatch/sdk";
import { completePairs, faqHtml, faqJsonLdScript, parseFaqJsonLd, validateFaqs, type FaqPair, type FaqWarning } from "@/lib/tools/faq-schema";

type Row = FaqPair & { key: number };
type Tab = "jsonld" | "html";

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const surface = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" };
const field = {
  background: "var(--color-bg-primary)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text-primary)",
};
const LEVEL: Record<FaqWarning["level"], { bg: string; fg: string; mark: string }> = {
  error: { bg: "rgba(220, 38, 38, 0.10)", fg: "#b91c1c", mark: "✗" },
  warn: { bg: "var(--color-yellow-muted)", fg: "#9a6b00", mark: "!" },
  info: { bg: "var(--color-blue-muted)", fg: "var(--color-blue)", mark: "i" },
};

const EXAMPLE: FaqPair[] = [
  { q: "How often should I flush my water heater?", a: "Once a year for most homes. Flush it every six months if you have hard water." },
  { q: "How long does a water heater last?", a: "Eight to twelve years for a tank model. Tankless units often last twenty years." },
  { q: "Why is my hot water running out so fast?", a: "Sediment at the bottom of the tank is the most common cause. A flush usually fixes it." },
];

let nextKey = 1;
const row = (p: FaqPair = { q: "", a: "" }): Row => ({ ...p, key: nextKey++ });

export function FaqSchemaGenerator() {
  const [rows, setRows] = useState<Row[]>(() => [row(), row()]);
  const [tab, setTab] = useState<Tab>("jsonld");
  const [copied, setCopied] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const tracked = useRef(false);

  const complete = useMemo(() => completePairs(rows), [rows]);
  const warnings = useMemo(() => validateFaqs(rows), [rows]);
  const output = useMemo(() => (tab === "jsonld" ? faqJsonLdScript(rows) : faqHtml(rows)), [rows, tab]);

  const update = (key: number, patch: Partial<FaqPair>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const remove = (key: number) => setRows((rs) => (rs.length === 1 ? [row()] : rs.filter((r) => r.key !== key)));
  const move = (i: number, dir: -1 | 1) =>
    setRows((rs) => {
      const j = i + dir;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  function track(action: string) {
    // Tool name and action only. Nothing typed into the generator goes to analytics.
    if (tracked.current && action === "copy") return;
    if (action === "copy") tracked.current = true;
    try {
      analytics.trackEvent("free_tool_used", { tool: "faq-schema", action });
    } catch {}
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(tab);
      track("copy");
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("error");
    }
  }

  function loadImport() {
    try {
      const pairs = parseFaqJsonLd(importText);
      setRows(pairs.map((p) => row(p)));
      setImportError("");
      setImportOpen(false);
      setImportText("");
      track("import");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Couldn't read that markup.");
    }
  }

  return (
    <div className="ph-no-capture">
      <div className="rounded-2xl p-5 sm:p-6" style={surface}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold">Your questions and answers</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <button type="button" className="underline underline-offset-2" style={secondary} onClick={() => setRows(EXAMPLE.map((p) => row(p)))}>
              Load an example
            </button>
            <button type="button" className="underline underline-offset-2" style={secondary} onClick={() => setImportOpen((o) => !o)} aria-expanded={importOpen}>
              Edit existing markup
            </button>
          </div>
        </div>

        {importOpen ? (
          <div className="mb-5 rounded-xl p-4" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
            <label htmlFor="faq-import" className="block text-sm font-semibold mb-1.5">
              Paste FAQ JSON-LD or the whole script tag
            </label>
            <textarea
              id="faq-import"
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full rounded-lg px-3 py-2 font-mono text-sm outline-none focus:ring-2"
              style={field}
              spellCheck={false}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-primary" onClick={loadImport} disabled={!importText.trim()}>
                Load questions
              </button>
              <span className="text-xs" style={muted}>
                This replaces the questions below.
              </span>
            </div>
            {importError ? (
              <p className="mt-3 rounded-lg px-3 py-2 text-sm font-medium" role="alert" style={{ background: LEVEL.error.bg, color: LEVEL.error.fg }}>
                {importError}
              </p>
            ) : null}
          </div>
        ) : null}

        <ol className="space-y-4">
          {rows.map((r, i) => (
            <li key={r.key} className="rounded-xl p-4" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-accent)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <IconButton label={`Move question ${i + 1} up`} onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </IconButton>
                  <IconButton label={`Move question ${i + 1} down`} onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                    ↓
                  </IconButton>
                  <IconButton label={`Remove question ${i + 1}`} onClick={() => remove(r.key)}>
                    ✕
                  </IconButton>
                </div>
              </div>
              <label htmlFor={`faq-q-${r.key}`} className="block text-sm font-semibold mb-1.5">
                Question
              </label>
              <input
                id={`faq-q-${r.key}`}
                value={r.q}
                onChange={(e) => update(r.key, { q: e.target.value })}
                placeholder="How often should I flush my water heater?"
                className="w-full rounded-lg px-4 py-3 text-base outline-none focus:ring-2"
                style={field}
              />
              <label htmlFor={`faq-a-${r.key}`} className="block text-sm font-semibold mt-3 mb-1.5">
                Answer
              </label>
              <textarea
                id={`faq-a-${r.key}`}
                rows={3}
                value={r.a}
                onChange={(e) => update(r.key, { a: e.target.value })}
                placeholder="Once a year for most homes. Every six months if you have hard water."
                className="w-full rounded-lg px-4 py-3 text-base outline-none focus:ring-2"
                style={field}
              />
            </li>
          ))}
        </ol>

        <button type="button" className="btn btn-secondary mt-4" onClick={() => setRows((rs) => [...rs, row()])}>
          + Add a question
        </button>
        <p className="mt-3 text-xs" style={muted}>
          Answers can use p, br, ul, ol, li, a, b, strong, i, em and h1 to h6. Everything runs in your browser.
        </p>
      </div>

      {warnings.length ? (
        <ul className="mt-5 space-y-2" aria-label="Warnings">
          {warnings.map((w) => (
            <li key={w.text} className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: LEVEL[w.level].bg, color: LEVEL[w.level].fg }}>
              <span aria-hidden="true" className="font-bold">
                {LEVEL[w.level].mark}
              </span>
              <span>{w.text}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div role="tablist" aria-label="Output" className="inline-flex rounded-full p-1" style={surface}>
            {(
              [
                ["jsonld", "JSON-LD schema"],
                ["html", "Visible FAQ HTML"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                style={tab === id ? { background: "var(--color-text-primary)", color: "var(--color-bg-primary)" } : secondary}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={copy} disabled={!complete.length}>
            {copied === tab ? "Copied" : copied === "error" ? "Select and copy below" : "Copy code"}
          </button>
        </div>
        <p className="mt-3 text-sm" style={secondary}>
          {tab === "jsonld"
            ? `${complete.length} ${complete.length === 1 ? "question" : "questions"} in the markup. Paste this script tag in the page's head or body.`
            : "Paste this where the FAQ should appear. The schema should only describe questions and answers readers can see on the page."}
        </p>
        <pre
          className="mt-3 rounded-xl p-4 text-xs sm:text-sm overflow-x-auto max-h-[28rem]"
          style={{ background: "#111111", color: "#f5f5f5", whiteSpace: "pre" }}
          aria-live="polite"
        >
          <code>{complete.length ? output : "Add at least one question with an answer to see the code."}</code>
        </pre>
      </div>
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
      style={{ ...secondary, border: "1px solid var(--color-border)", opacity: disabled ? 0.35 : 1 }}
    >
      {children}
    </button>
  );
}
