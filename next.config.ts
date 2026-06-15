import type { NextConfig } from "next";
import path from "path";

const isCI = process.env.CI === "true";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  async rewrites() {
    if (!apiBaseUrl) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;