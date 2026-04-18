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
  const ogEmiImage = `${SITE_URL}/og-image-emi-calculator.svg`;
  const ogEmiSquare = `${SITE_URL}/og-image-emi-calculator-square.svg`;

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
        'en-IN': canonicalUrl,
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
          alt: `${tool.title} - EMI calculator`,
          type: 'image/jpeg',
          secureUrl: ogImageUrl,
        },
        {
          url: `${SITE_URL}/og-image-square.jpg`,
          width: 800,
          height: 800,
          alt: `${tool.title} - EMI calculator`,
          type: 'image/jpeg',
        },
        {
          url: ogEmiImage,
          width: 1200,
          height: 630,
          alt: `${tool.title} - EMI calculator preview`,
          type: 'image/svg+xml',
        },
        {
          url: ogEmiSquare,
          width: 800,
          height: 800,
          alt: `${tool.title} - EMI calculator square preview`,
          type: 'image/svg+xml',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.title} - Free Calculator`,
      description: tool.description,
      images: [ogImageUrl, ogEmiImage],
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
    },
  };
}
