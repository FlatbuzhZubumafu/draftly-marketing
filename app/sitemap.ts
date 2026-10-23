import type { MetadataRoute } from "next";
import { getPage, getPosts } from "@/lib/graphql";
import { NOINDEX_POST_SLUGS } from "@/lib/related";
import { FREE_TOOLS, TOOLS_DATE, TOOLS_HUB } from "@/lib/free-tools";
import { INDUSTRIES, INDUSTRIES_DATE, INDUSTRIES_HUB, industryPath } from "@/lib/industries";
import { FEATURES, FEATURES_DATE, FEATURES_HUB, featurePath } from "@/lib/features";

export const revalidate = 3600;

// Legal copy lives in WordPress, so its edit date is the page's `modified` field.
const legalModified = (page: { modified: string } | null, fallback: string) => new Date(page?.modified || fallback);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, privacy, terms] = await Promise.all([getPosts(), getPage("privacy-policy"), getPage("terms-and-conditions")]);
  const baseUrl = "https://www.draftly.blog";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date("2026-10-11"), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date("2026-10-09"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/wordpress-ai-plugin`, lastModified: new Date("2026-10-09"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/mcp`, lastModified: new Date("2026-10-09"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/best-ai-for-writing`, lastModified: new Date("2026-10-08"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/ai-copywriter`, lastModified: new Date("2026-10-08"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/seo-copywriting`, lastModified: new Date("2026-10-08"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/ai-seo-agency-vs-tool`, lastModified: new Date("2026-10-08"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/jasper-vs-draftly`, lastModified: new Date("2026-10-12"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog-writing-service`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/for-teams`, lastModified: new Date("2026-10-15"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/claude-vs-chatgpt-for-writing`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/writesonic-alternatives`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/writesonic-vs-draftly`, lastModified: new Date("2026-10-23"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/best-ai-for-seo`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/koala-ai-review`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/arvow-review`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/copy-ai-alternatives`, lastModified: new Date("2026-10-16"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}${FEATURES_HUB.path}`, lastModified: new Date(FEATURES_DATE.iso), changeFrequency: "monthly", priority: 0.8 },
    ...FEATURES.map((f) => ({ url: `${baseUrl}${featurePath(f)}`, lastModified: new Date(FEATURES_DATE.iso), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${baseUrl}${TOOLS_HUB.path}`, lastModified: new Date(TOOLS_DATE.iso), changeFrequency: "monthly", priority: 0.7 },
    ...FREE_TOOLS.map((t) => ({ url: `${baseUrl}${t.path}`, lastModified: new Date(TOOLS_DATE.iso), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${baseUrl}${INDUSTRIES_HUB.path}`, lastModified: new Date(INDUSTRIES_DATE.iso), changeFrequency: "monthly", priority: 0.6 },
    ...INDUSTRIES.map((i) => ({ url: `${baseUrl}${industryPath(i)}`, lastModified: new Date(INDUSTRIES_DATE.iso), changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${baseUrl}/about`, lastModified: new Date("2026-10-13"), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-10-13"), changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/blog`, lastModified: posts[0] ? new Date(posts[0].modified || posts[0].date) : new Date("2026-10-06"), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, lastModified: legalModified(privacy, "2026-10-09"), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: legalModified(terms, "2026-10-09"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.filter((post) => !NOINDEX_POST_SLUGS.has(post.slug)).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
