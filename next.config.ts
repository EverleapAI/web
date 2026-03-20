import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Required for Azure standalone deployment
  output: "standalone",

  // Ensure tracing resolves from the monorepo/workspace root
  outputFileTracingRoot: path.join(__dirname, "../../"),

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