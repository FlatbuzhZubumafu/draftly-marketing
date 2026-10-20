import type { CSSProperties } from "react";
import type { CategoryId } from "@/lib/features";

/**
 * One pastel tint per feature category, built from the homepage palette
 * (accent orange, blue, yellow, purple, and the green used for "passed").
 * Cards, art bands and detail-page heroes read these as CSS variables, so the
 * hub grid reads as grouped by category.
 *
 * bg: the card. band: the graph-paper band (a shade darker). grid: the paper lines.
 * fill / soft: the saturated and light fills inside the ink drawings.
 * All text sits on bg or band in --tint-ink (#111), which passes AA on every bg here.
 */
export type Tint = { bg: string; band: string; grid: string; fill: string; soft: string; label: string };

export const TINTS: Record<CategoryId, Tint> = {
  topics: { bg: "#fff6db", band: "#ffeeb8", grid: "rgba(196, 150, 0, 0.16)", fill: "#ffc53d", soft: "#ffe39a", label: "Yellow" },
  write: { bg: "#f4ecfc", band: "#e9dbf8", grid: "rgba(110, 50, 170, 0.12)", fill: "#b483e6", soft: "#dcc5f4", label: "Purple" },
  check: { bg: "#ffece5", band: "#ffdccf", grid: "rgba(210, 70, 20, 0.12)", fill: "#ff7a4d", soft: "#ffc0a8", label: "Orange" },
  publish: { bg: "#e6f2fb", band: "#d3e7f7", grid: "rgba(30, 100, 160, 0.13)", fill: "#4ea5e0", soft: "#b4d9f2", label: "Blue" },
  anywhere: { bg: "#e5f5ec", band: "#d2ede0", grid: "rgba(20, 120, 80, 0.13)", fill: "#38b486", soft: "#a9e0c6", label: "Green" },
};

/** The CSS variables a tinted surface sets for its children (cards, art, chips). */
export function tintVars(c: CategoryId): CSSProperties {
  const t = TINTS[c];
  return {
    "--tint-bg": t.bg,
    "--tint-band": t.band,
    "--tint-grid": t.grid,
    "--art-fill": t.fill,
    "--art-soft": t.soft,
  } as CSSProperties;
}
