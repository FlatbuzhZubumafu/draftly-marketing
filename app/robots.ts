import type { MetadataRoute } from "next";

// AI search and assistant crawlers, allowed by name so the policy is explicit
// for each one. Everything else falls under the allow-all group.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://www.draftly.blog/sitemap.xml",
  };
}
