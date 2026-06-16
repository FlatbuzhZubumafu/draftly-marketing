import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "draftly.blog" },
      { protocol: "https", hostname: "wp.draftly.blog" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
};

export default nextConfig;
