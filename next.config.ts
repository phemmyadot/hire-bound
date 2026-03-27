import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backendUrl = process.env.API_URL || 'http://localhost:8000';
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/((?!auth).*)',
          destination: `${backendUrl}/:path*`,
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
