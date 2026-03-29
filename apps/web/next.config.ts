import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@cfb-social/types', '@cfb-social/api'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
