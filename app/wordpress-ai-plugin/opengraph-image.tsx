import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

// Share image for /wordpress-ai-plugin, built the same way as the site default
// (app/opengraph-image.tsx): site colors, icon and wordmark.
export const alt = "Draftly for WordPress: the AI plugin that fixes your posts in your voice. Works with Yoast SEO, Rank Math and All in One SEO.";
export const size = { width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };
export const contentType = "image/png";

const ACCENT = "#ff6b3d";
const YELLOW = "#ffce59";
const TEXT = "#111111";
const MUTED = "#555555";

export default async function WordPressOpengraphImage() {
  const icon = await readFile(join(process.cwd(), "app/apple-icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(255, 107, 61, 0.08) 0%, #ffffff 55%)",
          color: TEXT,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: "0.12em", color: ACCENT, textTransform: "uppercase" }}>
            AI plugin for WordPress
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 92, lineHeight: 1.05 }}>
            <span>Fix Your Posts</span>
            <div style={{ display: "flex" }}>
              <span>in&nbsp;</span>
              <span style={{ display: "flex", flexDirection: "column", color: ACCENT }}>
                Your Voice
                <span style={{ height: 10, marginTop: -6, borderRadius: 6, background: YELLOW }} />
              </span>
              <span>.</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={iconSrc} width={72} height={72} alt="" />
            <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>draftly</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>Works with Yoast, Rank Math and AIOSEO</div>
        </div>
      </div>
    ),
    size,
  );
}
