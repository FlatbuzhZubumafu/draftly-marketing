"use client";

import { useRef, useState } from "react";
import { analytics } from "@heycatch/sdk";
import type { CheckerId } from "@/lib/free-tools";

type Status = "pass" | "warn" | "fail" | "info";
type Item = {
  id: string;
  label: string;
  status: Status;
  detail: string;
  why: string;
  fix?: string;
  list?: { text: string; href?: string; note?: string }[];
};
type Report = { checked: string; items: Item[]; summary: { pass: number; warn: number; fail: number }; notes: string[] };

const STATUS: Record<Status, { label: string; bg: string; fg: string; mark: string }> = {
  pass: { label: "Pass", bg: "#e7f6ec", fg: "#17803d", mark: "✓" },
  warn: { label: "Warning", bg: "var(--color-yellow-muted)", fg: "#9a6b00", mark: "!" },
  fail: { label: "Fail", bg: "rgba(220, 38, 38, 0.10)", fg: "#b91c1c", mark: "✗" },
  info: { label: "Info", bg: "var(--color-blue-muted)", fg: "var(--color-blue)", mark: "i" },
};
const ORDER: Record<Status, number> = { fail: 0, warn: 1, info: 2, pass: 3 };

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };

export function ToolChecker({
  tool,
  label,
  placeholder,
  button,
  extra,
}: {
  tool: CheckerId;
  label: string;
  placeholder: string;
  button: string;
  extra?: { label: string; placeholder: string };
}) {
  const [url, setUrl] = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || state === "running") return;
    setState("running");
    setError("");
    setReport(null);
    // Tool name only. The URL never goes to analytics.
    try {
      analytics.trackEvent("free_tool_used", { tool });
    } catch {}
    try {
      const res = await fetch(`/api/tools/${tool}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extra ? { url, homepage: extraValue } : { url }),
      });
      const data = (await res.json().catch(() => ({}))) as Report & { error?: string };
      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Try again.");
        setState("error");
        return;
      }
      setReport(data);
      setState("done");
      requestAnimationFrame(() => resultsRef.current?.focus());
    } catch {
      setError("Couldn't reach the checker. Check your connection and try again.");
      setState("error");
    }
  }

  const items = report ? [...report.items].sort((a, b) => ORDER[a.status] - ORDER[b.status]) : [];

  // ph-no-capture keeps HeyCatch autocapture away from the form and results,
  // so clicks on result links never send a checked URL to analytics.
  return (
    <div className="ph-no-capture">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className={`grid gap-3 ${extra ? "sm:grid-cols-[1.4fr_1fr_auto]" : "sm:grid-cols-[1fr_auto]"} items-end`}>
          <Field id={`${tool}-url`} label={label} placeholder={placeholder} value={url} onChange={setUrl} disabled={state === "running"} required />
          {extra ? (
            <Field id={`${tool}-extra`} label={extra.label} placeholder={extra.placeholder} value={extraValue} onChange={setExtraValue} disabled={state === "running"} />
          ) : null}
          <button type="submit" className="btn btn-primary justify-center" disabled={state === "running"} style={state === "running" ? { opacity: 0.7, cursor: "wait" } : undefined}>
            {state === "running" ? "Checking..." : button}
          </button>
        </div>
        <p className="mt-3 text-xs" style={muted}>
          Free, no sign-up. We don&apos;t store the URL or the results, and no AI model reads your pages.
        </p>
      </form>

      <div aria-live="polite">
        {state === "running" ? (
          <p className="mt-6 text-sm" style={secondary} role="status">
            Fetching pages and running the checks. This usually takes 5 to 30 seconds.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="mt-6 rounded-xl px-4 py-3 text-sm font-medium" role="alert" style={{ background: STATUS.fail.bg, color: STATUS.fail.fg }}>
            {error}
          </p>
        ) : null}
      </div>

      {report ? (
        <div ref={resultsRef} tabIndex={-1} className="mt-8 outline-none" aria-labelledby={`${tool}-results-heading`}>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id={`${tool}-results-heading`} className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
              Results
            </h2>
            <p className="text-sm break-all" style={muted}>
              Checked {report.checked}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["fail", "warn", "pass"] as const).map((s) => (
              <span key={s} className="rounded-full px-3 py-1 text-sm font-semibold" style={{ background: STATUS[s].bg, color: STATUS[s].fg }}>
                {report.summary[s]} {s === "pass" ? "passed" : s === "warn" ? (report.summary.warn === 1 ? "warning" : "warnings") : "failed"}
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-3">
            {items.map((item) => (
              <ResultItem key={item.id} item={item} />
            ))}
          </ul>

          {report.notes.length ? (
            <div className="mt-6 text-sm space-y-1" style={muted}>
              {report.notes.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  required?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="url"
        autoComplete="url"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={2048}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg px-4 py-3 text-base outline-none transition-colors focus:ring-2"
        style={{
          background: "var(--color-bg-primary)",
          color: "var(--color-text-primary)",
          border: "1px solid var(--color-border-strong)",
          ["--tw-ring-color" as string]: "var(--color-border-accent)",
        }}
      />
    </div>
  );
}

function ResultItem({ item }: { item: Item }) {
  const s = STATUS[item.status];
  const [open, setOpen] = useState(item.status === "fail" || item.status === "warn");
  return (
    <li className="rounded-xl" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="w-full flex items-start gap-3 p-4 text-left">
        <span
          className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: s.bg, color: s.fg }}
          aria-hidden="true"
        >
          {s.mark}
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-x-2">
            <span className="font-semibold">{item.label}</span>
            <span className="text-xs font-semibold" style={{ color: s.fg }}>
              {s.label}
            </span>
          </span>
          <span className="block text-sm mt-1 break-words" style={secondary}>
            {item.detail}
          </span>
        </span>
        <span className="text-sm flex-shrink-0 mt-0.5" style={muted} aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div className="px-4 pb-4 pl-[3.25rem] text-sm space-y-3 leading-relaxed">
          <p style={secondary}>
            <strong style={{ color: "var(--color-text-primary)" }}>Why it matters: </strong>
            {item.why}
          </p>
          {item.fix ? (
            <p style={secondary}>
              <strong style={{ color: "var(--color-text-primary)" }}>How to fix it: </strong>
              {item.fix}
            </p>
          ) : null}
          {item.list?.length ? (
            <ul className="space-y-1.5 rounded-lg p-3" style={{ background: "var(--color-bg-surface)" }}>
              {item.list.map((row, i) => (
                <li key={`${row.text}-${i}`} className="break-words">
                  {row.href && /^https?:\/\//i.test(row.href) ? (
                    <a href={row.href} target="_blank" rel="nofollow noopener noreferrer" className="underline" style={{ color: "var(--color-text-primary)" }}>
                      {row.text}
                    </a>
                  ) : (
                    <span style={{ color: "var(--color-text-primary)" }}>{row.text}</span>
                  )}
                  {row.note ? <span style={muted}> · {row.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
