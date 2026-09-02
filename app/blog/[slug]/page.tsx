import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllArticles, getArticleBySlug } from '@/lib/articles';
import { getToolBySlug } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article not found' };

  const canonical = `${SITE_URL}/blog/${article.slug}`;
  return {
    title: `${article.title} | EMI Tools Blog`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const canonical = `${SITE_URL}/blog/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: canonical,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    keywords: article.keywords.join(', '),
    author: { '@type': 'Organization', name: 'EMI Tools', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'EMI Tools',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: canonical,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
    ],
  };

  const relatedTools = article.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<ReturnType<typeof getToolBySlug>> => Boolean(t));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-blue-100">
            <Link href="/" className="hover:underline">
              Home
            </Link>{' '}
            /{' '}
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>{' '}
            / <span>{article.category}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-blue-100">
            <span className="bg-white/10 px-2 py-1 rounded">{article.category}</span>
            <span>· {article.readingTimeMinutes} min read</span>
            <span>
              · Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time>
            </span>
          </div>
        </div>
      </div>

      <article className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
            {article.description}
          </p>

          <div className="space-y-8">
            {article.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">
                  {section.heading}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          {relatedTools.length > 0 && (
            <aside className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="bg-white border border-gray-200 hover:border-blue-500 rounded-lg p-3 transition"
                  >
                    <p className="font-semibold text-gray-900 text-sm">{tool.keyword}</p>
                    <p className="text-xs text-gray-500 mt-1">{tool.category}</p>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded p-5 text-sm text-gray-700">
            <strong>Disclaimer:</strong> This article is for educational purposes only and does
            not constitute financial, legal, or tax advice. Interest rates, tax rules, and
            regulations can change. Consult a qualified financial advisor or chartered accountant
            before making any decision.
          </div>

          <div className="border-t border-gray-200 pt-6 mt-10 flex flex-wrap items-center justify-between gap-3">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← All articles
            </Link>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              Back to Home →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
