import { getAllTools } from '@/lib/seo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export async function GET() {
  const tools = getAllTools();
  const lastmod = new Date().toISOString();

  const urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/tools`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/privacy-policy`,
    `${BASE_URL}/terms`,
    `${BASE_URL}/about`,
    // Add each tool page
    ...tools.map(t => `${BASE_URL}/tools/${t.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n') +
    `\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      // Cache in CDN for 1 hour, but always serve fresh from origin
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
