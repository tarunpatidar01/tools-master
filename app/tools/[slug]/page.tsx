import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolBySlug, getRelatedTools } from '@/lib/seo';
import ToolPageClient from './ToolPageClient';
import CalculatorFor from './CalculatorFor';
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
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'All calculators', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.keyword, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: tool.title,
    description: tool.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
  };

  // Marks the page as an actual usable free tool, not just an article about one.
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${canonicalUrl}#app`,
    name: tool.keyword,
    url: canonicalUrl,
    description: tool.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any modern web browser',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    provider: { '@id': `${SITE_URL}/#organization` },
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
      {/* Structured data. Canonical, hreflang and OG tags are emitted by the
          metadata export in ./metadata.ts — duplicating them here produced two
          conflicting canonical links per page. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      {/* Accessibility: Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>

      {/* Visible breadcrumb for users */}
      <nav
        aria-label="Breadcrumb"
        className="bg-white border-b border-slate-100"
        id="breadcrumb"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-[13px] text-slate-500">
            <li><Link href="/" className="hover:text-blue-700 transition">Home</Link></li>
            <li className="text-slate-300">/</li>
            <li><Link href="/tools" className="hover:text-blue-700 transition">All calculators</Link></li>
            <li className="text-slate-300">/</li>
            <li aria-current="page" className="font-semibold text-slate-800 truncate max-w-[50ch]">
              {tool.keyword}
            </li>
          </ol>
        </div>
      </nav>

      {/* Social Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SocialShare title={tool.title} text={tool.description} url={canonicalUrl} />
      </div>

      <main id="main">
        {/* No Suspense boundary here on purpose. <Analytics /> from
            @vercel/analytics/next calls useSearchParams(), which forces its
            nearest Suspense boundary into a client-side-rendering bailout. With
            the calculator inside that same boundary, every tool page hydrated
            to a permanent "Loading calculator..." fallback and the calculator
            itself stayed display:none. Analytics now lives in the root layout. */}
        <ToolPageClient tool={tool} faqList={faqList} key={slug}>
          <CalculatorFor slug={slug} toolName={tool.keyword} />
        </ToolPageClient>

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
