import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Turbopack configuration
  // Disabled due to Turbopack build instability on local environment
  // Removed invalid boolean setting to avoid Next.js config errors
  // turbopack: false,
  // Optimize for performance
  compress: true,
  // Enable static generation
  staticPageGenerationTimeout: 120,
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.emitools.com',
      },
    ],
  },
  // Performance headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        // Security headers
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        // Performance headers
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
        // SEO headers
        {
          key: 'Link',
          value: '</sitemap.xml>; rel="sitemap", </robots.txt>; rel="robots"',
        },
      ],
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
  ],
  // Redirects for SEO
  redirects: async () => [
    {
      source: '/index',
      destination: '/',
      permanent: true,
    },
  ],
  // Rewrites
  rewrites: async () => ([]),
};

export default nextConfig;
