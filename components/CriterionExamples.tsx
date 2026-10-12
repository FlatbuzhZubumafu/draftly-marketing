import { ModelName } from "@/components/ProviderLogo";
import type { Criterion, Example } from "@/lib/benchmarkExamples";

// Pass/miss examples for each scored criterion on /best-ai-for-writing.
// The colors match the "Generic AI draft" / "Draftly draft" dots in BeforeAfter.
const TONE = {
  pass: { ink: "#13774f", chip: "rgba(26, 156, 107, 0.12)", mark: "rgba(26, 156, 107, 0.18)" },
  miss: { ink: "#c03a2b", chip: "rgba(192, 58, 43, 0.10)", mark: "#ffe1d6" },
};

const BUSINESS = { "Boise roofer": "Boise roofer", "AP software": "AP software company", "Phoenix dentist": "Phoenix dentist" };

/** Renders text with [[marked]] spans highlighted in the example's tone. */
function Marked({ text, verdict }: { text: string; verdict: Example["verdict"] }) {
  const parts = text.split(/\[\[|\]\]/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <mark
            key={i}
            className="rounded px-0.5"
            style={{
              background: TONE[verdict].mark,
              color: "inherit",
              textDecoration: verdict === "miss" ? "underline wavy" : undefined,
              textDecorationColor: verdict === "miss" ? TONE.miss.ink : undefined,
              textUnderlineOffset: 3,
            }}
          >
            {p}
          </mark>
        ) : (
          p
        ),
      )}
    </>
  );
}

function Chip({ verdict, label }: { verdict: Example["verdict"]; label?: string }) {
  const t = TONE[verdict];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap" style={{ background: t.chip, color: t.ink }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.ink }} aria-hidden="true" />
      {label ?? (verdict === "pass" ? "Pass" : "Miss")}
    </span>
  );
}

/** Post length against the 1,000 to 1,200 word brief, on a 0 to 2,000 word track. */
function LengthBar({ words, verdict }: { words: number; verdict: Example["verdict"] }) {
  const pct = (n: number) => `${Math.min(100, (n / 2000) * 100)}%`;
  return (
    <div className="mt-4">
      <p className="text-2xl font-semibold tabular-nums" style={{ color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
        {words.toLocaleString("en-US")} words
      </p>
      <div className="relative mt-3 h-2.5 rounded-full" style={{ background: "var(--color-bg-subtle)" }} aria-hidden="true">
        <div className="absolute inset-y-0 rounded-full" style={{ left: pct(1000), width: "10%", background: "rgba(26, 156, 107, 0.35)" }} />
        <div className="absolute -top-1 -bottom-1 w-1 rounded-full -ml-0.5" style={{ left: pct(words), background: TONE[verdict].ink }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
        <span>0</span>
        <span>Brief: 1,000 to 1,200</span>
        <span>2,000</span>
      </div>
    </div>
  );
}

function ExampleCard({ ex, source }: { ex: Example; source: string }) {
  return (
    <figure className="p-5 rounded-xl card-depth min-w-0 flex flex-col" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          <ModelName model={ex.model} size={18} />
        </span>
        <Chip verdict={ex.verdict} label={ex.label} />
      </figcaption>
      <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        {source} for the {BUSINESS[ex.business]}
      </p>
      {ex.words ? <LengthBar words={ex.words} verdict={ex.verdict} /> : null}
      {ex.lines?.length ? (
        <div className="mt-4 space-y-3">
          {ex.lines.map((l, i) => (
            <div key={i} className="pl-3 border-l-2" style={{ borderColor: "var(--color-border-strong)" }}>
              {l.tag ? (
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {l.tag}
                </p>
              ) : null}
              <blockquote className="text-[15px] leading-relaxed break-words" style={{ color: "var(--color-text-primary)" }}>
                <Marked text={l.text} verdict={ex.verdict} />
              </blockquote>
              {l.note ? (
                <p className="mt-1 text-xs font-medium tabular-nums" style={{ color: TONE[ex.verdict].ink }}>
                  {l.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {ex.note ? (
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {ex.note}
        </p>
      ) : null}
    </figure>
  );
}

/** A made-up line showing the habit, and the same line written plainly. */
function BeforeAfterLine({ before, after }: { before: string; after: string }) {
  const rows = [
    { verdict: "miss" as const, label: "AI habit", text: before },
    { verdict: "pass" as const, label: "Plain version", text: after },
  ];
  return (
    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[15px] leading-relaxed">
      {rows.map((r) => (
        <div key={r.verdict} className="rounded-lg px-3.5 py-3 min-w-0" style={{ background: TONE[r.verdict].chip }}>
          <dt className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: TONE[r.verdict].ink }}>
            {r.label}
          </dt>
          <dd className="mt-0.5 break-words" style={{ color: "var(--color-text-primary)" }}>
            {r.text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * One H3 per criterion: the copy principle and why models break it, then real pass and
 * miss examples from the benchmark run, then what Draftly does about it.
 */
export function CriterionExamples({
  items,
  source,
  intro,
  children,
}: {
  items: Criterion[];
  /** "Blog post" or "Copy pack", shown above each quote with the business. */
  source: string;
  intro?: React.ReactNode;
  /** Extra content rendered under a criterion, keyed by its id. */
  children?: Partial<Record<string, React.ReactNode>>;
}) {
  return (
    <div className="mt-10 max-w-3xl" data-lint-skip="">
      {intro ? (
        <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {intro}
        </p>
      ) : null}
      {items.map((c) => (
        <div key={c.id} id={c.id} className="mt-12 scroll-mt-28">
          <h3 className="text-xl font-medium mb-3" style={{ letterSpacing: "-0.02em" }}>
            {c.title}
          </h3>
          <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {c.lesson}
          </p>
          {c.example ? <BeforeAfterLine {...c.example} /> : null}
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
              In our test:{" "}
            </span>
            {c.body}
          </p>
          {children?.[c.id]}
          <div className={`mt-5 grid grid-cols-1 gap-4 ${c.examples.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {c.examples.map((ex, i) => (
              <ExampleCard key={i} ex={ex} source={source} />
            ))}
          </div>
          {c.draftly ? (
            <aside
              className="mt-4 rounded-xl px-4 py-3.5 sm:px-5 border-l-4"
              style={{ background: "var(--color-bg-subtle)", borderColor: "var(--color-accent)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                How Draftly handles it
              </p>
              {c.draftly.split("\n\n").map((para, i) => (
                <p key={i} className={`${i ? "mt-2" : "mt-1"} text-sm leading-relaxed`} style={{ color: "var(--color-text-secondary)" }}>
                  {para}
                </p>
              ))}
            </aside>
          ) : null}
        </div>
      ))}
    </div>
  );
}
