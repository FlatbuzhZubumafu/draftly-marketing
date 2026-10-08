import type { ReactNode } from "react";
import type { ProductShot } from "@/lib/product-shots";

/** A framed product screenshot with a visible caption. `aspect` crops to a fixed ratio from the top so sibling figures line up. */
export function ProductFigure({ shot, className = "", framed = true, aspect, fit = "cover", caption, showCaption = true }: { shot: ProductShot; className?: string; framed?: boolean; aspect?: string; fit?: "cover" | "contain"; caption?: ReactNode; showCaption?: boolean }) {
  return (
    <figure className={className}>
      <div
        className={framed ? "rounded-xl overflow-hidden" : ""}
        style={{ ...(framed ? { background: "#fff", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" } : {}), ...(aspect ? { aspectRatio: aspect } : {}) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" className={aspect ? `w-full h-full block object-top ${fit === "contain" ? "object-contain" : "object-cover"}` : "w-full h-auto block"} />
      </div>
      {showCaption ? (
        <figcaption className="text-sm mt-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {caption ?? shot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
