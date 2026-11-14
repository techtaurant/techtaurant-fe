import type { NextConfig } from 'next';

import { IS_PRODUCTION } from '@/shared/config';

const SITEMAP_BUCKET = IS_PRODUCTION ? 'prod' : 'dev';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: [
    '@mdit/helper',
    '@mdit/plugin-tex',
    'dom-serializer',
    'domelementtype',
    'domhandler',
    'domutils',
    'entities',
    'htmlparser2',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap/:path*',
        destination: `https://techtaurant-public-${SITEMAP_BUCKET}.s3.ap-northeast-2.amazonaws.com/sitemap/:path*`,
      },
    ];
  },
};

export default nextConfig;
