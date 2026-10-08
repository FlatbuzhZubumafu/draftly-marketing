import { SHOWCASE_TALL, SHOWCASE_WIDE } from "@/lib/product-shots";

/** Right under the hero: the real input and the real output, side by side. */
export function ProductShowcase() {
  return (
    <section aria-labelledby="showcase-heading" className="pb-20 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-5xl">
        <h2 id="showcase-heading" className="sr-only">What Draftly produces from a URL</h2>
        <figure className="reveal">
          <picture>
            <source media="(max-width: 639px)" srcSet={SHOWCASE_TALL.src} width={SHOWCASE_TALL.width} height={SHOWCASE_TALL.height} />
            <img
              src={SHOWCASE_WIDE.src}
              alt={SHOWCASE_WIDE.alt}
              width={SHOWCASE_WIDE.width}
              height={SHOWCASE_WIDE.height}
              decoding="async"
              className="w-full h-auto block"
            />
          </picture>
        </figure>
      </div>
    </section>
  );
}
