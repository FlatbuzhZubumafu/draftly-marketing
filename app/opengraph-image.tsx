import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

// Default share image for every page that does not set its own. Uses the site's
// colors (globals.css), the pencil-and-notepad icon and the lowercase wordmark.
export const alt = DEFAULT_OG_IMAGE.alt;
export const size = { width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };
export const contentType = "image/png";

const ACCENT = "#ff6b3d";
const YELLOW = "#ffce59";
const TEXT = "#111111";
const MUTED = "#555555";

export default async function OpengraphImage() {
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
            AI blog writer for small businesses
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 92, lineHeight: 1.05 }}>
            <span>Your Next Blog Post,</span>
            <div style={{ display: "flex" }}>
              <span>Already&nbsp;</span>
              <span style={{ display: "flex", flexDirection: "column", color: ACCENT }}>
                Written
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
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>Your first post is free. www.draftly.blog</div>
        </div>
      </div>
    ),
    size,
  );
}
