import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.18.180'],
  compress: true,
  reactStrictMode: true,
  // swcMinify removed (unsupported in Next.js 16)
  experimental: {
    optimizePackageImports: ['lucide-react', 'embla-carousel-react'],
  },
  images: {
    deviceSizes: [640, 1024, 1440],
    imageSizes: [400, 800, 1200],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.despearl.com',
      },
      {
        protocol: 'https',
        hostname: 'app.votee.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'despearl.com',
      },
    ],
  },
};

export default nextConfig;
