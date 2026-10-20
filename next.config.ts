import type { NextConfig } from "next";
import { FEATURE_SLUG_REDIRECTS } from "./lib/feature-redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "draftly.blog" },
      { protocol: "https", hostname: "wp.draftly.blog" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
  async headers() {
    return [
      // MCP Registry domain proof for the blog.draftly/* namespace (public key only).
      {
        source: "/.well-known/mcp-registry-auth",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      // Only www.draftly.blog should be indexed. Vercel aliases such as
      // draftly-marketing.vercel.app serve the same pages, so keep them out of search.
      {
        source: "/:path*",
        missing: [{ type: "host", value: "www\\.draftly\\.blog" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    return [
      // HeyCatch short links: single-character paths (/a-/z, /0-/9) are reserved for
      // channel attribution. Listed first so they never fall through to app/[slug].
      // No real single-character routes exist in app/.
      {
        source: "/:l([a-z0-9])",
        destination: "/?utm_source=heycatch&utm_campaign=:l",
        permanent: false,
      },
      {
        source: "/draftly-blog-shifts-from-agency-to-customer-focus",
        destination: "/blog/draftly-blog-shifts-from-agency-to-customer-focus",
        permanent: true,
      },
      {
        source: "/the-death-of-keyword-how-aeo-aio-is-leaving-keywords-behind",
        destination: "/blog/the-death-of-keyword-how-aeo-aio-is-leaving-keywords-behind",
        permanent: true,
      },
      {
        source: "/how-i-accidentally-built-an-ai-content-platform-while-trying-to-save-my-companys-seo",
        destination: "/blog/how-i-accidentally-built-an-ai-content-platform-while-trying-to-save-my-companys-seo",
        permanent: true,
      },
      {
        source: "/best-ai-models-for-blogging",
        destination: "/best-ai-for-writing",
        permanent: true,
      },
      {
        source: "/jasper-alternatives",
        destination: "/jasper-vs-draftly",
        permanent: true,
      },
      // Feature pages renamed for search on launch day (lib/feature-redirects.ts).
      ...Object.entries(FEATURE_SLUG_REDIRECTS).map(([from, to]) => ({
        source: `/feature/${from}`,
        destination: `/feature/${to}`,
        permanent: true,
      })),
      {
        source: "/faq",
        destination: "/#faq",
        permanent: true,
      },
      // wp.draftly.blog 301s every path to the same path here, so WordPress's own
      // archive and sitemap URLs land on this site. Send them somewhere real.
      // (Root-level post slugs are handled by app/[slug]/page.tsx.)
      { source: "/category/:path*", destination: "/blog", permanent: true },
      { source: "/tag/:path*", destination: "/blog", permanent: true },
      { source: "/author/:path*", destination: "/blog", permanent: true },
      { source: "/:year(\\d{4})/:path*", destination: "/blog", permanent: true },
      { source: "/feed", destination: "/feed.xml", permanent: true },
      { source: "/wp-sitemap:rest(.*)", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default nextConfig;
