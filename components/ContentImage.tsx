import Image from "next/image";
import type { ReactNode } from "react";
import type { StockImage } from "@/lib/stock-images";

/** A rounded stock photo with an optional caption and a small photographer credit. Lazy-loaded, sized to the 3xl text column. */
export function ContentImage({ image, caption, className = "" }: { image: StockImage; caption?: ReactNode; className?: string }) {
  return (
    <figure className={`max-w-3xl ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 768px, 100vw"
        loading="lazy"
        className="w-full h-auto block rounded-xl"
        style={{ border: "1px solid var(--color-border)" }}
      />
      <figcaption className="text-sm mt-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {caption ? <>{caption} </> : null}
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Photo:{" "}
          <a href={image.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {image.photographer} on Unsplash
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
