import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPost } from "@/lib/graphql";
import { plainExcerpt } from "@/lib/text";

// Share image and card thumbnail for a blog post that has no featured image in
// WordPress: the post title and the Draftly mark, in the style of app/opengraph-image.tsx.
export const revalidate = 3600;

const ACCENT = "#ff6b3d";
const TEXT = "#111111";
const MUTED = "#555555";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  const title = plainExcerpt(post.title, 110);
  const icon = await readFile(join(process.cwd(), "app/apple-icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;
  const date = new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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
            The Draftly Blog
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: title.length > 60 ? 64 : 80, lineHeight: 1.08, letterSpacing: "-0.02em" }}>{title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={iconSrc} width={72} height={72} alt="" />
            <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>draftly</span>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>{date}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
