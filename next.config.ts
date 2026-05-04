import type { NextConfig } from "next";
import path from "path";

const isCI = process.env.CI === "true";

const nextConfig: NextConfig = {
  output: isCI ? "standalone" : undefined,

  outputFileTracingRoot: path.join(__dirname, "../../"),

  trailingSlash: false,

  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;