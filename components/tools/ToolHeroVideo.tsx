"use client";

import { useEffect, useRef, useState } from "react";

// Silent 10-second loop that shows the tool at work on a made-up plumber's site. Built in
// Remotion (draftly-work/video-remotion, compositions under ToolHeroes, ids = tool slugs).
// Plays only while on screen; with reduced motion it stays on the poster, which shows the results.
export function ToolHeroVideo({ slug, label }: { slug: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    observer.observe(v);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const base = `/videos/tools/${slug}`;
  return (
    <div
      className="relative w-full aspect-square overflow-hidden rounded-3xl"
      style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}
    >
      {reducedMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${base}-poster.jpg`} alt={label} width={720} height={720} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          poster={`${base}-poster.jpg`}
          width={720}
          height={720}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
