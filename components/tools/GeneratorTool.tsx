"use client";

import { useRef, useState } from "react";
import { analytics } from "@heycatch/sdk";
import type { GeneratorId } from "@/lib/free-tools";
import type { Brief } from "@/lib/tools/ai/brief";
import type { IdeasResult } from "@/lib/tools/ai/ideas";
import { APP_URL } from "@/lib/site";

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const card = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" };
const errorStyle = { background: "rgba(220, 38, 38, 0.10)", color: "#b91c1c" };

/** Same test the API uses to tell a website from a topic in the ideas box. */
const looksLikeUrl = (s: string) => /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(s.trim());

type Props = {
  tool: GeneratorId;
  label: string;
  placeholder: string;
  button: string;
  extra?: { label: string; placeholder: string };
  /** False when the AI tools are switched off: the form is disabled and the example shows. */
  enabled: boolean;
  sampleBrief?: Brief;
  sampleIdeas?: IdeasResult;
};

export function GeneratorTool({ tool, label, placeholder, button, extra, enabled, sampleBrief, sampleIdeas }: Props) {
  const [value, setValue] = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [ideas, setIdeas] = useState<IdeasResult | null>(null);
  const [off, setOff] = useState(!enabled);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || state === "running" || off) return;
    setState("running");
    setError("");
    try {
      analytics.trackEvent("free_tool_used", { tool }); // Tool name only, never the input.
    } catch {}
    const body =
      tool === "content-brief"
        ? { keyword: value, url: extraValue, company }
        : looksLikeUrl(value)
          ? { url: value, company }
          : { topic: value, company };
    try {
      const res = await fetch(`/api/tools/${tool}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; unavailable?: boolean };
      if (!res.ok || data.error) {
        if (data.unavailable) setOff(true);
        setError(data.error || "Something went wrong. Try again.");
        setState("error");
        return;
      }
      if (tool === "content-brief") setBrief(data as Brief);
      else setIdeas(data as IdeasResult);
      setState("done");
      requestAnimationFrame(() => resultsRef.current?.focus());
    } catch {
      setError("Couldn't reach the tool. Check your connection and try again.");
      setState("error");
    }
  }

  const showingSample = state !== "done";
  const shownBrief = brief ?? (showingSample ? sampleBrief : undefined);
  const shownIdeas = ideas ?? (showingSample ? sampleIdeas : undefined);
  // The app's register page picks up ?url= and starts the first post from that site.
  const site = brief?.site ?? ideas?.site ?? null;
  const registerUrl = site ? `${APP_URL}/register?url=${encodeURIComponent(site)}` : `${APP_URL}/register`;

  return (
    <div className="ph-no-capture">
      <form onSubmit={onSubmit} className="rounded-2xl p-5 sm:p-6" style={card}>
        <div className={`grid gap-3 ${extra ? "sm:grid-cols-[1.4fr_1fr_auto]" : "sm:grid-cols-[1fr_auto]"} items-end`}>
          <Field id={`${tool}-input`} label={label} placeholder={placeholder} value={value} onChange={setValue} disabled={state === "running" || off} required />
          {extra ? <Field id={`${tool}-extra`} label={extra.label} placeholder={extra.placeholder} value={extraValue} onChange={setExtraValue} disabled={state === "running" || off} /> : null}
          <button type="submit" className="btn btn-primary justify-center" disabled={state === "running" || off} style={state === "running" || off ? { opacity: 0.7, cursor: off ? "not-allowed" : "wait" } : undefined}>
            {state === "running" ? "Writing..." : button}
          </button>
        </div>
        {/* Honeypot: hidden from people and screen readers. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor={`${tool}-company`}>Company</label>
          <input id={`${tool}-company`} tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <p className="mt-3 text-xs" style={muted}>
          {off
            ? "The AI generator is switched off right now. The example and template below still work."
            : "Free, no sign-up. Written by an AI model from what you enter. We don't store your input or the results."}
        </p>
      </form>

      <div aria-live="polite">
        {state === "running" ? (
          <p className="mt-6 text-sm" style={secondary} role="status">
            {tool === "content-brief" ? "Reading your site and writing the brief." : "Reading your site and picking ideas."} This usually takes 10 to 30 seconds.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="mt-6 rounded-xl px-4 py-3 text-sm font-medium" role="alert" style={errorStyle}>
            {error}
          </p>
        ) : null}
      </div>

      <div ref={resultsRef} tabIndex={-1} className="mt-8 outline-none">
        {shownBrief ? <BriefView brief={shownBrief} sample={!brief} registerUrl={registerUrl} /> : null}
        {shownIdeas ? <IdeasView result={shownIdeas} sample={!ideas} registerUrl={registerUrl} /> : null}
      </div>
    </div>
  );
}

function Field(props: { id: string; label: string; placeholder: string; value: string; onChange: (v: string) => void; disabled: boolean; required?: boolean }) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-semibold mb-1.5">
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        inputMode="text"
        autoComplete="off"
        spellCheck={false}
        maxLength={200}
        required={props.required}
        disabled={props.disabled}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-base outline-none focus:ring-2"
        style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}
      />
    </div>
  );
}

function SampleTag({ sample, what }: { sample: boolean; what: string }) {
  if (!sample) return null;
  return (
    <p className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--color-blue-muted)", color: "var(--color-blue)" }}>
      Example {what}. Run the tool to get your own.
    </p>
  );
}

function InlineCta({ registerUrl, heading, body }: { registerUrl: string; heading: string; body: string }) {
  return (
    <aside aria-label="Try Draftly" className="my-8 rounded-2xl p-6" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}>
      <p className="text-xl font-medium mb-2" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </p>
      <p className="leading-relaxed mb-5" style={secondary}>
        {body}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href={registerUrl} className="btn btn-primary">
          Write my first post free
        </a>
        <span className="text-sm" style={muted}>
          No credit card.
        </span>
      </div>
    </aside>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </section>
  );
}

export function briefToMarkdown(b: Brief): string {
  const lines = [
    `# Content brief: ${b.keyword}`,
    "",
    `**Search intent:** ${b.intent.type}. ${b.intent.summary}`,
    `**Audience:** ${b.audience}`,
    `**Title:** ${b.title}`,
    `**Meta description:** ${b.meta}`,
    `**Word count:** ${b.wordCount.min} to ${b.wordCount.max}`,
    "",
    "## Outline",
    ...b.outline.flatMap((s) => [`### ${s.h2}`, ...s.points.map((p) => `- ${p}`), ""]),
    "## Questions to answer",
    ...b.questions.map((q) => `- ${q}`),
    "",
    "## What ranking pages cover",
    ...b.mustCover.map((m) => `- ${m}`),
    "",
    "## Sources to cite",
    ...b.sources.map((s) => `- ${s}`),
  ];
  if (b.internalLinks.length) lines.push("", "## Internal links", ...b.internalLinks.map((l) => `- [${l.anchor}](${l.url}): ${l.why}`));
  return lines.join("\n") + "\n";
}

function BriefView({ brief, sample, registerUrl }: { brief: Brief; sample: boolean; registerUrl: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(briefToMarkdown(brief));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <article aria-labelledby="brief-heading" className="rounded-2xl p-5 sm:p-8" style={card}>
      <SampleTag sample={sample} what="brief" />
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="brief-heading" className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
          Content brief: {brief.keyword}
        </h2>
        {!sample ? (
          <button type="button" onClick={copy} className="btn btn-secondary text-sm">
            {copied ? "Copied" : "Copy as Markdown"}
          </button>
        ) : null}
      </div>
      {brief.notes.map((n) => (
        <p key={n} className="mt-3 text-sm" style={muted}>
          {n}
        </p>
      ))}

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Fact label="Search intent" value={`${brief.intent.type[0].toUpperCase()}${brief.intent.type.slice(1)}. ${brief.intent.summary}`} />
        <Fact label="Audience" value={brief.audience} />
        <Fact label="Title" value={`${brief.title} (${brief.title.length} characters)`} />
        <Fact label="Meta description" value={`${brief.meta} (${brief.meta.length} characters)`} />
        <Fact label="Word count" value={`${brief.wordCount.min.toLocaleString()} to ${brief.wordCount.max.toLocaleString()} words`} />
      </dl>

      <Block title="Outline">
        <ol className="space-y-3">
          {brief.outline.map((s, i) => (
            <li key={s.h2}>
              <p className="font-semibold">
                <span style={{ color: "var(--color-accent)" }}>H2 {i + 1}.</span> {s.h2}
              </p>
              <ul className="mt-1 list-disc pl-5 space-y-0.5" style={secondary}>
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Block>

      <InlineCta
        registerUrl={registerUrl}
        heading="Want the post written for you?"
        body="Draftly writes the full post from your website in your brand's voice, checks it against your writing rules and publishes it to your blog."
      />

      <Block title="Questions to answer">
        <List items={brief.questions} />
      </Block>
      <Block title="What ranking pages usually cover">
        <List items={brief.mustCover} />
        <p className="mt-2 text-xs" style={muted}>
          From the model&apos;s general knowledge, not a live Google check. Compare with today&apos;s top results.
        </p>
      </Block>
      <Block title="Sources to cite">
        <List items={brief.sources} />
      </Block>
      {brief.internalLinks.length ? (
        <Block title="Internal links from your site">
          <ul className="space-y-2" style={secondary}>
            {brief.internalLinks.map((l) => (
              <li key={l.url}>
                <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  &ldquo;{l.anchor}&rdquo;
                </span>{" "}
                to{" "}
                <a href={l.url} rel="nofollow noopener" target="_blank" className="underline underline-offset-2 break-all">
                  {l.url}
                </a>
                . {l.why}
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
    </article>
  );
}

function IdeasView({ result, sample, registerUrl }: { result: IdeasResult; sample: boolean; registerUrl: string }) {
  const first = result.ideas.slice(0, 5);
  const rest = result.ideas.slice(5);
  return (
    <article aria-labelledby="ideas-heading" className="rounded-2xl p-5 sm:p-8" style={card}>
      <SampleTag sample={sample} what="ideas for a plumbing company" />
      <h2 id="ideas-heading" className="text-2xl font-medium" style={{ letterSpacing: "-0.02em" }}>
        {result.ideas.length} blog post ideas{result.site ? ` for ${new URL(result.site).hostname.replace(/^www\./, "")}` : result.topic ? ` for ${result.topic}` : ""}
      </h2>
      {result.business ? (
        <p className="mt-2 text-sm" style={muted}>
          What we understood: {result.business}
        </p>
      ) : null}
      {result.notes.map((n) => (
        <p key={n} className="mt-2 text-sm" style={muted}>
          {n}
        </p>
      ))}
      <IdeaList ideas={first} start={1} />
      <InlineCta
        registerUrl={registerUrl}
        heading="Pick one and Draftly writes it"
        body="Draftly reads your website, writes the post in your brand's voice and publishes it to your blog. Your first post is free."
      />
      <IdeaList ideas={rest} start={6} />
    </article>
  );
}

function IdeaList({ ideas, start }: { ideas: IdeasResult["ideas"]; start: number }) {
  if (!ideas.length) return null;
  return (
    <ol className="mt-5 space-y-4" start={start}>
      {ideas.map((idea, i) => (
        <li key={idea.title} className="flex gap-3">
          <span className="text-sm font-semibold tabular-nums pt-0.5" style={{ color: "var(--color-accent)" }}>
            {String(start + i).padStart(2, "0")}
          </span>
          <div>
            <p className="font-semibold">{idea.title}</p>
            <p className="mt-0.5 leading-relaxed" style={secondary}>
              {idea.angle}
            </p>
            <p className="mt-1 text-xs" style={muted}>
              {idea.type.replace("-", " ")} post{idea.reader ? ` · for ${idea.reader.charAt(0).toLowerCase()}${idea.reader.slice(1)}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
      <dt className="text-xs font-semibold uppercase tracking-wide" style={muted}>
        {label}
      </dt>
      <dd className="mt-1 leading-relaxed">{value}</dd>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1" style={secondary}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}
