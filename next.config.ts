import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Disabled for QA deploy (Windows + pnpm symlink issue)
  // output: "standalone",

  // Still useful for tracing in monorepo (safe to keep)
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