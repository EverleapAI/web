import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable SSR/APIs by NOT using static export
  // output: "export",
  trailingSlash: false, // optional; omit to use Next.js default
  images: { unoptimized: true }, // keep if you don't want Next/Image optimization routes
};

export default nextConfig;
