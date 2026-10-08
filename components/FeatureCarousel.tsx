"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeatureSlide } from "@/lib/product-shots";

/** Horizontal, snap-scrolling feature panels: number, title and description above an equal-size image. */
export function FeatureCarousel({ slides }: { slides: FeatureSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const panel = el?.firstElementChild as HTMLElement | null;
    if (!el || !panel) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (panel.offsetWidth + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={update}
        className="feature-track"
        role="region"
        aria-roledescription="carousel"
        aria-label="Draftly features"
        tabIndex={0}
      >
        {slides.map((s, i) => (
          <article
            key={s.shot.src}
            className="feature-panel"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
          >
            <p className="feature-num">{String(i + 1).padStart(2, "0")}.</p>
            <h3 className="text-xl font-semibold mb-2" style={{ letterSpacing: "-0.02em" }}>
              {s.title}
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
              {s.description}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.shot.src}
              alt={s.shot.alt}
              width={s.shot.width}
              height={s.shot.height}
              loading="lazy"
              decoding="async"
              className="feature-img"
            />
          </article>
        ))}
      </div>
      <div className="flex justify-end gap-3 mt-5">
        <button type="button" className="carousel-btn" onClick={() => go(-1)} disabled={atStart} aria-label="Previous feature">
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <button type="button" className="carousel-btn" onClick={() => go(1)} disabled={atEnd} aria-label="Next feature">
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
