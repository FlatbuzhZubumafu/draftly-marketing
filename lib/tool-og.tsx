import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

// Share image for the free tools, built like app/wordpress-ai-plugin/opengraph-image.tsx:
// site colors, a "Free tool" label, the page headline and the wordmark.
export const TOOL_OG_SIZE = { width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };

const ACCENT = "#ff6b3d";
const YELLOW = "#ffce59";
const TEXT = "#111111";
const MUTED = "#555555";

export async function toolOgImage({ label, lead, accent, line }: { label: string; lead: string; accent: string; line: string }) {
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
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: "0.12em", color: ACCENT, textTransform: "uppercase" }}>{label}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 84, lineHeight: 1.05 }}>
            <span>{lead}</span>
            <div style={{ display: "flex" }}>
              <span style={{ display: "flex", flexDirection: "column", color: ACCENT }}>
                {accent}
                <span style={{ height: 10, marginTop: -6, borderRadius: 6, background: YELLOW }} />
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={iconSrc} width={72} height={72} alt="" />
            <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>draftly</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>{line}</div>
        </div>
      </div>
    ),
    TOOL_OG_SIZE,
  );
}
