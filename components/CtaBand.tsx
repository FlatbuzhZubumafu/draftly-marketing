import { getHomepageData } from "@/lib/graphql";

type Props = {
  heading: React.ReactNode;
  body: string;
  /** Secondary link next to the main button. */
  secondary?: { href: string; label: string };
  tone?: "light" | "accent";
};

/**
 * A call to action between homepage sections. The main button always starts
 * the free first post, so every band leads to the same next step.
 */
export async function CtaBand({ heading, body, secondary, tone = "light" }: Props) {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;
  const accent = tone === "accent";

  return (
    <section className="px-4 py-16 sm:py-20" style={{ background: accent ? "var(--color-accent-muted)" : "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-3xl text-center reveal">
        <h2 className="font-medium mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
          {heading}
        </h2>
        <p className="text-base sm:text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
          {body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={registerUrl} className="btn btn-primary">
            {s.heroCtaText}
          </a>
          {secondary ? (
            <a href={secondary.href} className="btn btn-secondary">
              {secondary.label}
            </a>
          ) : null}
        </div>
        <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Free first post. No credit card.
        </p>
      </div>
    </section>
  );
}
