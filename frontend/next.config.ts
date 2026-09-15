import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.BACKEND_URL &&
      !process.env.NEXT_PUBLIC_API_BASE_URL
    ) {
      return [];
    }
    const backend =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8081";
    return [
      {
        source: "/sba/:path*",
        destination: `${backend}/sba/:path*`,
      },
      {
        source: "/instances/:path*",
        destination: `${backend}/instances/:path*`,
      },
      {
        source: "/actuator/:path*",
        destination: `${backend}/actuator/:path*`,
      },
    ];
  },
};

export default nextConfig;
