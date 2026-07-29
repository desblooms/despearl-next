import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.18.180'],
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'embla-carousel-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
