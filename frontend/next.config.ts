import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    return [
      {
        source: '/sba/:path*',
        destination: 'http://localhost:8081/sba/:path*',
      },
      {
        source: '/instances/:path*',
        destination: 'http://localhost:8081/instances/:path*',
      },
      {
        source: '/actuator/:path*',
        destination: 'http://localhost:8081/actuator/:path*',
      },
    ];
  },
};

export default nextConfig;
