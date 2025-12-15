import type { NextConfig } from "next";
import path from "path";

const isStandalone = process.env.NEXT_STANDALONE === "1";

const nextConfig: NextConfig = {
  /**
   * Only produce a standalone build when explicitly requested
   * (CI / Azure / Linux). This avoids Windows symlink issues
   * while keeping the production architecture correct.
   */
  output: isStandalone ? "standalone" : undefined,

  // Because you’re in a monorepo (apps/web, apps/api, etc.)
  outputFileTracingRoot: path.resolve(__dirname, "../../"),

  trailingSlash: false,

  /**
   * Keep images unoptimized for now.
   * (You can safely remove this later once sharp is fully approved.)
   */
  images: { unoptimized: true },

  // Don’t let ESLint block builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
