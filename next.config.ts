import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Next.js picks up a stray lockfile in the home directory otherwise.
  outputFileTracingRoot: __dirname,
  experimental: {
    // Rewrites `import { Icon } from 'lucide-react'` to per-icon deep imports
    // so pages only bundle the icons they actually render.
    optimizePackageImports: ['lucide-react'],
  },
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
        hostname: '**.vercel.app',
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
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        // SEO headers
        {
          key: 'Link',
          value: '</sitemap.xml>; rel="sitemap", </robots.txt>; rel="robots"',
        },
      ],
    },
    {
      // HTML must stay revalidatable. A blanket `immutable, max-age=31536000`
      // on /:path* previously froze every page in the browser cache for a year,
      // so content and pricing updates never reached returning visitors.
      source: '/((?!_next/static|data/ifsc).*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
    {
      // Content-hashed build output — safe to cache forever.
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Bank branch datasets are versioned by content and rarely change.
      source: '/data/ifsc/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800',
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
