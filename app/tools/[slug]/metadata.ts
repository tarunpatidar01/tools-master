import { getAllTools } from '@/lib/seo';
import type { Metadata } from 'next';

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

  const canonicalUrl = `https://emitools.com/tools/${slug}`;
  const ogImageUrl = `https://emitools.com/og-image.jpg`;

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
    authors: [{ name: 'EMI Tools', url: 'https://emitools.com' }],
    creator: 'EMI Tools',
    publisher: 'EMI Tools',
    category: 'Finance',
    classification: 'Financial Calculator',
    referrer: 'strict-origin-when-cross-origin',
    metadataBase: new URL('https://emitools.com'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-IN': `https://emitools.com/tools/${slug}?lang=en-in`,
        'hi-IN': `https://emitools.com/tools/${slug}?lang=hi-in`,
        'en': canonicalUrl,
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
          url: `https://emitools.com/og-image-square.jpg`,
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
      google: 'google-verification-code-here',
      yandex: 'yandex-verification-code-here',
    },
  };
}
