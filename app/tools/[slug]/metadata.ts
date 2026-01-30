import { getAllTools } from '@/lib/seo';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map(tool => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tools = getAllTools();
  const tool = tools.find(t => t.slug === slug);
  
  if (!tool) {
    return {
      title: 'EMI Calculator | EMI Tools',
      description: 'Free online EMI calculator tool',
    };
  }

  const canonicalUrl = `${SITE_URL}/tools/${slug}`;
  const ogImageUrl = `${SITE_URL}/og-image.jpg`;

  return {
    title: `${tool.title} - Free Online Calculator | EMI Tools`,
    description: tool.description,
    keywords: [
      tool.keyword,
      'EMI calculator',
      'loan calculator',
      `${tool.keyword} calculator`,
      'free online calculator',
      'instant calculation',
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
        'en-IN': `${SITE_URL}/tools/${slug}?lang=en-in`,
        'hi-IN': `${SITE_URL}/tools/${slug}?lang=hi-in`,
        'en': canonicalUrl,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title: `${tool.title} - Free Online Calculator`,
      description: tool.description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'EMI Tools Calculator',
      locale: 'en_IN',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: tool.title,
          type: 'image/jpeg',
          secureUrl: ogImageUrl,
        },
        {
          url: `${SITE_URL}/og-image-square.jpg`,
          width: 800,
          height: 800,
          alt: tool.title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.title} - Free Calculator`,
      description: tool.description,
      images: [ogImageUrl],
      creator: '@emitools',
      site: '@emitools',
      siteId: '1234567890',
      creatorId: '0987654321',
    },
    robots: {
      index: true,
      follow: true,
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
      yandex: 'yandex-verification-code-here',
    },
  };
}
