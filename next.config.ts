import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://192.168.1.159', 'http://localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'lh3.googleusercontent.com',
      pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
