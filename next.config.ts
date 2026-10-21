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
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.despearl.com',
      },
      {
        protocol: 'http',
        hostname: 'admin.despearl.com',
      },
      {
        protocol: 'https',
        hostname: 'app.votee.in',
      },
      {
        protocol: 'http',
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
      {
        protocol: 'http',
        hostname: 'despearl.com',
      },
    ],
  },
};

export default nextConfig;
