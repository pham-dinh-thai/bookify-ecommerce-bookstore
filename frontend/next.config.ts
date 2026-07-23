import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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

export default withNextIntl(nextConfig);
