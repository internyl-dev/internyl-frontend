import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://192.168.1.159', 'http://localhost:3000'], 
};

export default nextConfig;
