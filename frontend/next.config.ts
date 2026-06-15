import type { NextConfig } from 'next';

const apiInternalUrl = (
  process.env.API_INTERNAL_URL ?? 'http://localhost:3001/api'
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: '/api',
        destination: apiInternalUrl,
      },
      {
        source: '/api/:path*',
        destination: `${apiInternalUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
