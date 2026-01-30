import { Analytics } from '@vercel/analytics/next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getToolBySlug } from '@/lib/seo';
import ToolPageClient from './ToolPageClient';

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';
  const canonicalUrl = `${SITE_URL}/tools/${slug}`;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.title, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: canonicalUrl,
    name: tool.title,
    description: tool.description,
    mainEntity: {
      '@type': 'WebPageElement',
      name: tool.title,
    },
    breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
  };

  return (
    <>
      {/* SEO Structured Data (server-rendered) */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-IN" href={`${canonicalUrl}?lang=en-in`} />
      <link rel="alternate" hrefLang="hi-IN" href={`${canonicalUrl}?lang=hi-in`} />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      {/* Accessibility: Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>

      {/* Visible breadcrumb for users */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li>/</li>
          <li><a href="/tools" className="hover:underline">Tools</a></li>
          <li>/</li>
          <li aria-current="page" className="font-semibold text-gray-900">{tool.title}</li>
        </ol>
      </nav>

      <main id="main">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading calculator...</div>}>
          <ToolPageClient tool={tool} key={slug} />
          <Analytics />
        </Suspense>
      </main>
    </>
  );
}
