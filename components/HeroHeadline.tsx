import { SquiggleUnderline } from "./SquiggleUnderline";

/*
 * The homepage headline. The category ("AI blog writer") is in the h1 itself so a
 * first-time visitor learns what Draftly is without reading the eyebrow.
 */
export function HeroHeadline() {
  return (
    <h1 className="page-heading hero-heading mb-8">
      <span className="eyebrow font-sans block mb-5" style={{ lineHeight: 1.4 }}>
        For small businesses and marketing teams
      </span>{" "}
      <span className="whitespace-nowrap">The AI Blog Writer</span>
      <br />
      <span className="whitespace-nowrap">
        That{" "}
        <span className="relative inline-block">
          <em className="italic" style={{ color: "var(--color-accent)" }}>Hates AI Copy</em>
          <SquiggleUnderline variant="basic" color="#ffce59" />
        </span>
        .
      </span>
    </h1>
  );
}
