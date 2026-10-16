import Image from "next/image";
import type { IndustryPhoto } from "@/lib/industries";

/** A stock photo framed like the site's product figures, with a small photo credit. */
export function StockPhoto({ photo, className = "", sizes = "(min-width: 768px) 768px, 100vw" }: { photo: IndustryPhoto; className?: string; sizes?: string }) {
  return (
    <figure className={className}>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)", background: "#f0efed" }}>
        <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes={sizes} className="w-full h-auto block" />
      </div>
      <figcaption className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
        Photo:{" "}
        <a href={photo.credit.href} rel="nofollow noopener" target="_blank" className="underline" style={{ color: "inherit" }}>
          {photo.credit.name}
        </a>{" "}
        on Unsplash
      </figcaption>
    </figure>
  );
}
