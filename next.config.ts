import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Azure standalone deployment
  output: "standalone",

  trailingSlash: false,

  images: {
    unoptimized: true,
  },

  // Do not fail builds because of ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;