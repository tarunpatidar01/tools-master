import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export const metadata: Metadata = {
  title: 'EMI Tools Blog — Loan, Investment, and Tax Guides',
  description:
    'In-depth guides on EMI calculation, home loans, personal loans, SIP vs lump sum investing, tax benefits, and strategies to reduce EMI. Written for Indian borrowers and investors.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'EMI Tools Blog — Loan, Investment, and Tax Guides',
    description:
      'In-depth guides on EMI calculation, home loans, SIP, and tax planning for Indian borrowers and investors.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();

  const blogListSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'EMI Tools Blog',
    url: `${SITE_URL}/blog`,
    blogPost: articles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      description: a.description,
      url: `${SITE_URL}/blog/${a.slug}`,
      datePublished: a.publishedAt,
      dateModified: a.updatedAt,
      keywords: a.keywords.join(', '),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-blue-100">
            <Link href="/" className="hover:underline">
              Home
            </Link>{' '}
            / <span>Blog</span>
          </nav>
          <h1 className="text-4xl font-bold mb-2">EMI Tools Blog</h1>
          <p className="text-blue-100">
            Practical guides on loans, investing, and tax planning — written for Indian readers.
          </p>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((a) => (
              <article
                key={a.slug}
                className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {a.category}
                  </span>
                  <span>·</span>
                  <span>{a.readingTimeMinutes} min read</span>
                  <span>·</span>
                  <time dateTime={a.updatedAt}>{a.updatedAt}</time>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
                  <Link href={`/blog/${a.slug}`} className="hover:text-blue-700">
                    {a.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">{a.description}</p>
                <Link
                  href={`/blog/${a.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  Read article →
                </Link>
              </article>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
