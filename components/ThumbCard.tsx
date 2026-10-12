import Image from "next/image";

export type CardImage = { src: string; alt: string };

/**
 * A linked card with a 16:10 thumbnail on top, a small label, the title and a blurb.
 * Used by the homepage guides, "Keep reading" and the /blog hub so they all match.
 */
export function ThumbCard({
  href,
  tag,
  title,
  blurb,
  image,
  cta,
  sizes = "(min-width: 768px) 320px, 100vw",
  titleClass = "text-base",
}: {
  href: string;
  tag?: string;
  title: string;
  blurb?: string;
  image?: CardImage | null;
  cta?: string;
  sizes?: string;
  titleClass?: string;
}) {
  return (
    <a
      href={href}
      className="guide-card flex flex-col h-full rounded-xl overflow-hidden transition-shadow"
      style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
    >
      {image ? (
        <span className="relative block w-full" style={{ aspectRatio: "16 / 10", borderBottom: "1px solid var(--color-border)", background: "#f0efed" }}>
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover object-top" />
        </span>
      ) : null}
      <span className="flex flex-col flex-1 p-5">
        {tag ? (
          <span className="eyebrow" style={{ color: "var(--color-text-muted)" }}>
            {tag}
          </span>
        ) : null}
        <span className={`block ${tag ? "mt-2" : ""} ${titleClass} font-semibold leading-snug`} style={{ color: "var(--color-text-primary)" }}>
          {title}
        </span>
        {blurb ? (
          <span className="block mt-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {blurb}
          </span>
        ) : null}
        {cta ? (
          <span className="mt-auto pt-4 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
            {cta} <span aria-hidden="true">&rarr;</span>
          </span>
        ) : null}
      </span>
    </a>
  );
}
