import { getPosts } from "@/lib/graphql";
import { NOINDEX_POST_SLUGS } from "@/lib/related";
import { SITE_URL } from "@/lib/site";
import { plainExcerpt } from "@/lib/text";

// RSS for the blog. Google and feed readers pick up new posts from it faster than
// from the sitemap alone. Rebuilt hourly, like the sitemap.
export const revalidate = 3600;

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const posts = (await getPosts()).filter((p) => !NOINDEX_POST_SLUGS.has(p.slug));
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      return `    <item>
      <title>${escapeXml(plainExcerpt(p.title, 1000))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(plainExcerpt(p.excerpt, 300))}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Draftly Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Notes from building Draftly, an AI blog writer for small businesses.</description>
    <language>en-us</language>
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].modified || posts[0].date).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
