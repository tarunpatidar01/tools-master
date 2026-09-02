import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

/**
 * Generated so the sitemap/host lines always match the deployed domain.
 * (public/robots.txt used to hardcode the preview URL.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Query-string variants are share/pre-fill links, not distinct pages —
        // keeping them out of the index avoids duplicate-content dilution.
        disallow: ['/api/', '/*?'],
      },
      { userAgent: 'AhrefsBot', crawlDelay: 10, allow: '/' },
      { userAgent: 'SemrushBot', crawlDelay: 10, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
