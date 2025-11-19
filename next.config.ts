import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Run as a Next.js server app
  output: "standalone",

  // Because you’re in a monorepo (apps/web, apps/api, etc.)
  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  trailingSlash: false,
  images: { unoptimized: true },

  // Don’t let ESLint block builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
