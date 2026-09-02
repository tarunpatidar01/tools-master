import { getAllTools } from '@/lib/seo';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map(tool => ({
    slug: tool.slug,
  }));
}

/**
 * tool.title is already a full SEO title (often 60-75 chars and containing its
 * own pipe, e.g. "EMI Calculator – Calculate Loan EMI Online | Updated Rates").
 * Appending "- Free Online Calculator | EMI Tools" pushed every tag past 100
 * characters, so Google truncated them mid-phrase. Keep the authored title and
 * only add the brand when there is room for it.
 */
const buildTitle = (title: string) => {
  const brand = ' | EMI Tools';
  if (title.includes('|')) return title;
  return title.length + brand.length <= 65 ? `${title}${brand}` : title;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tools = getAllTools();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    return {
      title: 'Calculator not found | EMI Tools',
      description: 'This calculator does not exist. Browse all free EMI Tools calculators instead.',
      robots: { index: false, follow: true },
    };
  }

  const canonicalUrl = `${SITE_URL}/tools/${slug}`;

  return {
    title: buildTitle(tool.title),
    description: tool.description,
    keywords: [
      tool.keyword,
      tool.hindi,
      `${tool.keyword} online`,
      `free ${tool.keyword.toLowerCase()}`,
      `${tool.category.toLowerCase()} calculator`,
      'India',
    ],
    authors: [{ name: 'EMI Tools', url: SITE_URL }],
    creator: 'EMI Tools',
    publisher: 'EMI Tools',
    category: 'Finance',
    classification: 'Financial Calculator',
    referrer: 'strict-origin-when-cross-origin',
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-IN': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      // Images come from app/tools/[slug]/opengraph-image.tsx, which renders a
      // real 1200x630 PNG per tool. The previous static files were 1x1 pixels.
      title: tool.title,
      description: tool.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'EMI Tools',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.keyword,
      description: tool.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: tool.keyword,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || 'nBlk1diO030v9sQNDFG2fPVQxyY9NHZhdJeSWJ3UAPI',
    },
  };
}
