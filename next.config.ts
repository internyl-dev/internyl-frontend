import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['http://192.168.1.159', 'http://localhost:3000'], 
  images: {
    domains: ['lh3.googleusercontent.com']
  }
};

export default nextConfig;
