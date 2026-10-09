import { AccentText } from "./AccentText";

// The flags below are what Draftly's post checker (supabase/functions/_shared/post-checks.ts
// in the app repo) reports for the left paragraph. The right paragraph is the opening of an
// example post Claude Sonnet 5.5 wrote with Draftly's writer prompt for a fictional plumber
// (evals/content-quality pipeline, 2026-10-09). The checker reports none of these four rules on it,
// and the whole post passed every rule.
const RULES = [
  { id: "banned_vocabulary", label: "Overused AI words", bg: "#ffe1d6" },
  { id: "contrast_phrasing", label: "\"Not just X\" framing", bg: "#efe2ff" },
  { id: "hedging", label: "Hedges", bg: "#fff1bf" },
  { id: "mechanical_openers", label: "Stock transitions", bg: "#d9ecff" },
] as const;

type Rule = (typeof RULES)[number]["id"];
const bg = (r: Rule) => RULES.find((x) => x.id === r)!.bg;
const Flag = ({ r, children }: { r: Rule; children: string }) => (
  <mark title={r} className="rounded px-0.5" style={{ background: bg(r), color: "inherit" }}>{children}</mark>
);

export function BeforeAfter() {
  return (
    <section id="before-after" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-12">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Every Draft Gets{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              Checked
            </AccentText>
          </h2>
          <p className="max-w-xl mx-auto text-lg" style={{ color: "var(--color-text-secondary)" }}>
            Draftly runs each post through a rule checker before you see it. Here is what it catches in a typical AI paragraph.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <figure className="reveal p-6 card-depth min-w-0" style={{ background: "var(--color-bg-surface)" }}>
            <figcaption className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#d64545" }} aria-hidden /> Generic AI draft
            </figcaption>
            <blockquote className="leading-relaxed">
              In today&apos;s <Flag r="banned_vocabulary">ever-evolving</Flag> <Flag r="banned_vocabulary">landscape</Flag>, Google search is
              changing fast. <Flag r="mechanical_openers">Additionally</Flag>, it&apos;s <Flag r="contrast_phrasing">not just</Flag> about
              keywords — it&apos;s about creating a <Flag r="banned_vocabulary">seamless</Flag> <Flag r="banned_vocabulary">journey</Flag> for
              your readers. This <Flag r="banned_vocabulary">comprehensive</Flag> guide <Flag r="hedging">may help</Flag> you navigate the
              changes and <Flag r="banned_vocabulary">unlock</Flag> the full potential of your content!
            </blockquote>
            <ul className="flex flex-wrap gap-2 mt-5" aria-label="Rules flagged">
              {RULES.map((r) => (
                <li key={r.id} className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ background: r.bg }}>
                  {r.label} <code className="font-mono font-normal opacity-70">{r.id}</code>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold" style={{ color: "#c03a2b" }}>4 rules flagged</p>
          </figure>
          <figure className="reveal p-6 card-depth min-w-0" style={{ background: "var(--color-bg-surface)", transitionDelay: "0.08s" }}>
            <figcaption className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1a9c6b" }} aria-hidden /> Draftly draft
            </figcaption>
            <blockquote className="leading-relaxed">
              Many homeowners flush a tank water heater about once a year, but the right interval depends on your model and your
              water. Start with the maintenance section of your manual, because it overrides any rule of thumb you read online.
            </blockquote>
            <p className="mt-5 text-sm font-semibold" style={{ color: "#13805a" }}>None of these four rules flagged</p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Example: the opening of a post Claude Sonnet 5.5, Draftly&apos;s default writer, wrote for Harbor &amp; Pine
              Plumbing, a made-up local business. No human edits.
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}
