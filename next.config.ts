import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "draftly.blog" },
      { protocol: "https", hostname: "wp.draftly.blog" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
  async redirects() {
    return [
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
        source: "/faq",
        destination: "/#faq",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
