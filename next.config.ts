import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Always build standalone for Azure deployment
  output: "standalone",

  // Required for monorepo (apps/web, apps/api, etc.)
  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  trailingSlash: false,

  // Keep images unoptimized for now
  images: {
    unoptimized: true,
  },

  // Do not block builds on ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;