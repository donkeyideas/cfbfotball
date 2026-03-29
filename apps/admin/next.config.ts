import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cfb-social/types', '@cfb-social/api'],
};

export default nextConfig;
