import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray pnpm-lock.yaml in the home dir makes
  // Turbopack infer the wrong root (/Users/kings) otherwise, which breaks
  // the RSC client manifest module resolution.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Sanity image CDN — served through next/image (see 07-images).
    remotePatterns: [{protocol: "https", hostname: "cdn.sanity.io"}],
  },
};

export default nextConfig;
