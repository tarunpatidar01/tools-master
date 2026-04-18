import { Analytics } from '@vercel/analytics/next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getToolBySlug, getRelatedTools } from '@/lib/seo';
import ToolPageClient from './ToolPageClient';
import SocialShare from '@/app/components/SocialShare';

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

  // Prepare FAQ list and server-side FAQ JSON-LD for better SEO (server-rendered)
  type FAQItem = { question: string; answer: string };
  const toolWithContent = tool as unknown as { content?: { faq?: FAQItem[] } };
  const faqList: FAQItem[] = Array.isArray(toolWithContent.content?.faq) && toolWithContent.content!.faq!.length
    ? toolWithContent.content!.faq!
    : [
        {
          question: `${tool.title} - How accurate are the results?`,
          answer: 'Results are calculated using standard formulas for estimation. For financial decisions consult with a certified advisor.',
        },
        {
          question: `How to use ${tool.title}?`,
          answer: 'Enter the known values into the calculator fields and press calculate to see instant results. Adjust values to explore scenarios.',
        },
      ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((f: FAQItem) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${tool.title}`,
    description: `Steps to calculate ${tool.keyword.toLowerCase()} using the EMI Tools calculator.`,
    totalTime: 'PT1M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Enter the inputs',
        text: `Enter the principal amount, interest rate, and tenure into the ${tool.title} fields.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Review the output',
        text: 'The calculator instantly shows EMI, total interest, total payment, and a year-wise amortization schedule.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Compare scenarios',
        text: 'Adjust inputs using sliders or direct input to compare different loan amounts, rates, and tenures.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Download or share',
        text: 'Download the result as PDF or Excel, or share a URL that pre-fills the same values.',
      },
    ],
  };

  const relatedTools = getRelatedTools(tool.slug, 6);

  return (
    <>
      {/* SEO Structured Data (server-rendered) */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en-IN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* Open Graph / Twitter image alt meta tags for better image SEO */}
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app'}/og-image-emi-calculator.svg`} />
      <meta property="og:image:alt" content={`${tool.title} - EMI calculator`} />
      <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app'}/og-image-emi-calculator.svg`} />
      <meta name="twitter:image:alt" content={`${tool.title} - EMI calculator`} />

      {/* Accessibility: Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>

      {/* Visible breadcrumb for users */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li>/</li>
          <li><Link href="/tools" className="hover:underline">Tools</Link></li>
          <li>/</li>
          <li aria-current="page" className="font-semibold text-gray-900">{tool.title}</li>
        </ol>
      </nav>

      {/* Social Share for this tool */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SocialShare title={tool.title} text={tool.description} url={canonicalUrl} />

        {/* Resources & Embed for tool */}
        <section aria-labelledby="resources" className="mt-6 bg-gray-50 border border-gray-100 rounded p-4">
          <h2 id="resources" className="text-lg font-semibold mb-2">Resources & References</h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
            <li><a href="https://www.investopedia.com/terms/e/emi.asp" target="_blank" rel="noopener noreferrer">What is EMI? — Investopedia</a></li>
            <li><a href="https://rbi.org.in/" target="_blank" rel="noopener noreferrer">Reserve Bank of India — Financial Education</a></li>
            <li><a href="https://www.sebi.gov.in/investors/" target="_blank" rel="noopener noreferrer">SEBI — Investor Education</a></li>
          </ul>

          <div className="mt-3 bg-white border border-gray-100 rounded p-3">
            <h3 className="font-semibold text-sm mb-2">Embed this tool</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto"><code>{`<iframe src="${canonicalUrl}" width="600" height="700" style="border:0;" loading="lazy"></iframe>`}</code></pre>
          </div>
        </section>
      </div>

      <main id="main">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading calculator...</div>}>
          <ToolPageClient tool={tool} faqList={faqList} key={slug} />
          <Analytics />
        </Suspense>

        {relatedTools.length > 0 && (
          <section
            aria-labelledby="related-tools"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-100"
          >
            <h2 id="related-tools" className="text-2xl font-bold text-gray-900 mb-5">
              Related calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/tools/${rt.slug}`}
                  className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 transition"
                >
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                    {rt.keyword}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{rt.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
