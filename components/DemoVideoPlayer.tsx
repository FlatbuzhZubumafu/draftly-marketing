"use client";

import { useEffect, useRef, useState } from "react";

export type DemoVideoSources = {
  loop: { mp4: string; webm: string };
  narrated: { mp4: string; webm: string; captions: string };
  poster: string;
};

const PlayIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M8 5.5v13a1 1 0 0 0 1.52.85l10.4-6.5a1 1 0 0 0 0-1.7L9.52 4.65A1 1 0 0 0 8 5.5Z" />
  </svg>
);

/**
 * Homepage demo: a short silent loop that plays muted only while it's on screen (paused otherwise, and not
 * autoplayed for reduced motion), plus a "Watch with sound" swap to the narrated cut with controls and captions.
 */
export function DemoVideoPlayer({ sources }: { sources: DemoVideoSources }) {
  const [mode, setMode] = useState<"loop" | "narrated">("loop");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loopStarted, setLoopStarted] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const narratedRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Play the loop only while it's in view; reduced motion waits for an explicit play.
  useEffect(() => {
    const video = loopRef.current;
    if (!video || mode !== "loop") return;
    if (reducedMotion && !loopStarted) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [mode, reducedMotion, loopStarted]);

  useEffect(() => {
    if (mode !== "narrated") return;
    const video = narratedRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    video.play().catch(() => {});
    video.focus();
  }, [mode]);

  const backToLoop = () => {
    narratedRef.current?.pause();
    setMode("loop");
  };

  return (
    <div className="w-full">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-deep)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", aspectRatio: "16 / 9" }}
      >
        {mode === "loop" ? (
          <>
            <video
              key="loop"
              ref={loopRef}
              className="w-full h-full block"
              muted
              loop
              playsInline
              autoPlay={!reducedMotion}
              preload={reducedMotion ? "none" : "metadata"}
              poster={sources.poster}
              aria-label="Silent looping preview of how Draftly works, from your website to a published post"
            >
              <source src={sources.loop.webm} type="video/webm" />
              <source src={sources.loop.mp4} type="video/mp4" />
            </video>
            {reducedMotion && !loopStarted ? (
              <button
                type="button"
                onClick={() => {
                  setLoopStarted(true);
                  loopRef.current?.play().catch(() => {});
                }}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play the silent preview"
              >
                <span className="flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full text-white" style={{ background: "var(--color-accent)", boxShadow: "0 10px 30px rgba(255,107,61,0.35)" }}>
                  <PlayIcon size={30} />
                </span>
              </button>
            ) : null}
          </>
        ) : (
          <video
            key="narrated"
            ref={narratedRef}
            className="w-full h-full block"
            controls
            playsInline
            preload="auto"
            poster={sources.poster}
            aria-label="How Draftly works, narrated walkthrough"
          >
            <source src={sources.narrated.webm} type="video/webm" />
            <source src={sources.narrated.mp4} type="video/mp4" />
            <track kind="captions" src={sources.narrated.captions} srcLang="en" label="English" default />
          </video>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        {mode === "loop" ? (
          <button type="button" className="btn btn-primary" onClick={() => setMode("narrated")}>
            <PlayIcon />
            Watch with sound
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={backToLoop}>
            Back to the silent preview
          </button>
        )}
      </div>
    </div>
  );
}
