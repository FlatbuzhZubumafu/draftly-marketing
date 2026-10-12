"use client";

import { useEffect, useState, type RefObject } from "react";
import { flushSync } from "react-dom";
import { SquiggleUnderline } from "./SquiggleUnderline";

/*
 * The homepage headline, shown first as the kind of bloated copy AI tools
 * write, then edited down by Draftly to "The AI Blog Writer That Hates AI Copy."
 * The category ("AI blog writer") is in the h1 itself so a first-time visitor
 * learns what Draftly is without reading the eyebrow.
 *
 * - The cut phrases live in CSS generated content (data-text), never in the
 *   DOM text, and are aria-hidden: search engines and screen readers only ever
 *   get the real headline.
 * - Reduced motion, or no JavaScript: CSS hides the phrases and the clean
 *   headline shows from the first paint (globals.css, "Homepage hero").
 * - The words that stay glide into place with transforms (FLIP), so the edit
 *   doesn't register as a layout shift.
 */

type CutId = "opener" | "pitch" | "filler" | "hype";

/** Each phrase is a habit Draftly's rule checker catches. Order = the order they're struck. */
const CUTS: Record<CutId, { text: string; label: string }> = {
  opener: { text: "In today’s fast-paced world, ", label: "Throat-clearing" },
  pitch: { text: " — a game-changing solution —", label: "Em dashes" },
  filler: { text: " truly, deeply", label: "Filler" },
  hype: { text: "!!!\u00a0🚀", label: "Hype" },
};
const ORDER: CutId[] = ["opener", "pitch", "filler", "hype"];

/** ms. START waits out the hero's own fade-in (.reveal, 0.6s). */
const START = 1100;
const STRIKE_EVERY = 420;
const HOLD = 500;
const FADE = 250;
const GLIDE = 600;
const SETTLE = 450;

/** Moves elements to where they now are from where they were, with transforms only. */
function glide(els: HTMLElement[], first: DOMRect[], ms: number, reflowRoot: HTMLElement) {
  els.forEach((el, i) => {
    const last = el.getBoundingClientRect();
    el.style.transition = "none";
    el.style.transform = `translate(${first[i].left - last.left}px, ${first[i].top - last.top}px)`;
  });
  void reflowRoot.offsetWidth; // commit the starting transforms before animating them away
  els.forEach((el) => {
    el.style.transition = `transform ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    el.style.transform = "";
  });
}

type Phase = "verbose" | "fading" | "done";

/**
 * Runs the edit once. `root` is the hero section. Every [data-flip] element in
 * it is measured before the phrases are removed and glides from there. The
 * [data-flip-root] box keeps its height through the cut, so nothing outside
 * it moves, then glides to its new, shorter centered position.
 */
export function useHeadlineEdit(root: RefObject<HTMLElement | null>) {
  const [phase, setPhase] = useState<Phase>("verbose");
  const [struck, setStruck] = useState(0);

  useEffect(() => {
    // Reduced motion: CSS already shows the clean headline (the phrases only render with
    // prefers-reduced-motion: no-preference), so there is nothing to play.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    ORDER.forEach((_, i) => at(START + i * STRIKE_EVERY, () => setStruck(i + 1)));
    const cutAt = START + ORDER.length * STRIKE_EVERY + HOLD;
    at(cutAt, () => setPhase("fading"));
    at(cutAt + FADE, () => {
      const section = root.current;
      const box = section?.querySelector<HTMLElement>("[data-flip-root]");
      if (!section || !box) return setPhase("done");
      const els = [...section.querySelectorAll<HTMLElement>("[data-flip]")];
      const first = els.map((el) => el.getBoundingClientRect());
      box.style.minHeight = `${box.offsetHeight}px`;
      flushSync(() => setPhase("done"));
      glide(els, first, GLIDE, section);
      at(GLIDE + 50, () => {
        els.forEach((el) => (el.style.transition = ""));
        const before = [box.getBoundingClientRect()];
        box.style.minHeight = "";
        glide([box], before, SETTLE, section);
        at(SETTLE + 50, () => (box.style.transition = ""));
      });
    });
    return () => timers.forEach(clearTimeout);
  }, [root]);

  return { phase, struck };
}

function Cut({ id, struck, fading }: { id: CutId; struck: boolean; fading: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`hero-cut${struck ? " is-struck" : ""}${fading ? " is-fading" : ""}`}
      data-text={CUTS[id].text}
      data-label={CUTS[id].label}
    />
  );
}

/** Without JavaScript nothing would ever cut the phrases, so show the clean headline. Keep it outside the h1. */
export function HeroHeadlineNoScript() {
  return (
    <noscript>
      <style>{".hero-verbose .hero-cut{display:none!important}.hero-verbose .hero-line{white-space:nowrap!important}.hero-verbose .hero-late{opacity:1!important}"}</style>
    </noscript>
  );
}

export function HeroHeadline({ phase, struck }: { phase: Phase; struck: number }) {
  const verbose = phase !== "done";
  const cut = (id: CutId) => <Cut id={id} struck={ORDER.indexOf(id) < struck} fading={phase === "fading"} />;

  return (
    <h1 className={`page-heading hero-heading mb-8${verbose ? " hero-verbose" : ""}`}>
      <span className="eyebrow font-sans block mb-5" style={{ lineHeight: 1.4 }} data-flip>
        For small businesses
      </span>{" "}
      {cut("opener")}
      <span className="hero-keep whitespace-nowrap" data-flip>The AI Blog Writer</span>
      {cut("pitch")}
      <br />
      <span className="hero-line">
        <span className="hero-keep" data-flip>That</span>
        {cut("filler")}{" "}
        <span className="relative inline-block" data-flip>
          <em className="italic" style={{ color: "var(--color-accent)" }}>Hates AI Copy</em>
          <SquiggleUnderline variant="basic" color="#ffce59" />
        </span>
        {cut("hype")}
        <span className="hero-keep hero-late" data-flip>.</span>
      </span>
    </h1>
  );
}
