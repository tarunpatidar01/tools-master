import './styles/globals.css'
import type { Metadata, Viewport } from 'next'
import Footer from '@/app/components/Footer'
import { SpeedInsights } from '@vercel/speed-insights/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export const metadata: Metadata = {
  title: 'EMI Tools — Free Online EMI Calculator',
  description: 'Free online EMI calculator for home, car, and personal loans. Instant results with amortization schedules and downloadable reports.',
  keywords: ['EMI calculator', 'loan EMI calculator', 'home loan EMI', 'car loan EMI', 'personal loan EMI', 'education loan calculator', 'gold loan calculator', 'bike loan calculator', 'simple interest calculator', 'compound interest calculator', 'monthly EMI calculator', 'free EMI calculator'],
  authors: [{ name: 'EMI Tools', url: SITE_URL }],
  creator: 'EMI Tools',
  publisher: 'EMI Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  category: 'Finance',
  classification: 'Financial Calculator',
  referrer: 'strict-origin-when-cross-origin',
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-IN': SITE_URL,
      'hi-IN': `${SITE_URL}/hi`,
      'x-default': SITE_URL,
    },
  },
  openGraph: {
    title: 'EMI Calculator - Free Loan EMI Calculation Tool | Instant Results',
    description: 'Calculate EMI for home loans, car loans, personal loans online. Get instant EMI with amortization schedule and interest breakdown. Trusted by 100,000+ users.',
    type: 'website',
    url: SITE_URL,
    siteName: 'EMI Tools Calculator',
    locale: 'en_IN',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'EMI Calculator - Free Loan EMI Calculation Tool',
        type: 'image/jpeg',
        secureUrl: `${SITE_URL}/og-image.jpg`,
      },
      {
        url: `${SITE_URL}/og-image-square.jpg`,
        width: 800,
        height: 800,
        alt: 'EMI Tools - Loan Calculator',
        type: 'image/jpeg',
      },
      {
        url: `${SITE_URL}/og-image-emi-calculator.svg`,
        width: 1200,
        height: 630,
        alt: 'EMI calculator - EMI Tools preview image',
        type: 'image/svg+xml',
      },
      {
        url: `${SITE_URL}/og-image-emi-calculator-square.svg`,
        width: 800,
        height: 800,
        alt: 'EMI calculator - square preview',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMI Calculator - Free Loan EMI Calculation | Instant Results',
    description: 'Calculate EMI for all types of loans instantly with our free online calculator. Accurate, reliable, and trusted.',
    images: [`${SITE_URL}/og-image.jpg`,`${SITE_URL}/og-image-emi-calculator.svg`],
    creator: '@emitools',
    site: '@emitools',
    siteId: '1234567890',
    creatorId: '0987654321',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EMI Tools',
    startupImage: '/apple-startup.png',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'nBlk1diO030v9sQNDFG2fPVQxyY9NHZhdJeSWJ3UAPI',
    yandex: 'yandex-verification-code-here',
    me: [SITE_URL],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        {/* Charset and Compatibility */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta httpEquiv="content-language" content="en-IN" />

        {/* Performance & Security Headers */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />

        {/* Mobile Optimization */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* Google AdSense Account */}
        <meta name="google-adsense-account" content="ca-pub-7888362617210799" />

        {/* DNS Prefetch & Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" />

        {/* Preload Critical Resources */}
        <link rel="preload" as="image" href="/og-image.jpg" />
        {/* Default OG/Twitter image alt for better image SEO */}
        <meta property="og:image:alt" content="EMI calculator - Free online EMI calculator" />
        <meta name="twitter:image:alt" content="EMI calculator - Free online EMI calculator" />

        {/* Alternate Language Links */}
        <link rel="alternate" hrefLang="en-IN" href={SITE_URL} />
        <link rel="alternate" hrefLang="hi-IN" href={`${SITE_URL}/hi`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        {/* Self-referential canonical */}
        <link rel="canonical" href={SITE_URL} />

        {/* Sitemap Link */}
        <link rel="sitemap" type="application/xml" href={`${SITE_URL}/sitemap.xml`} />

        {/* JSON+LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EMI Tools',
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description: 'Free online EMI calculator for loans',
              sameAs: [
                'https://www.facebook.com/emitools',
                'https://twitter.com/emitools',
                'https://www.linkedin.com/company/emitools',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
                email: 'support@emitools.com',
                url: `${SITE_URL}/contact`,
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'IN',
                addressLocality: 'India',
              },
            }),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              url: SITE_URL,
              name: 'EMI Tools Calculator',
              description: 'Free online EMI calculator for all types of loans',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx" crossOrigin="anonymous"></script>
      </head>
      <body className="bg-gray-50 text-gray-900">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg sticky top-0 z-50" role="banner">
          <div className="max-w-7xl mx-auto">
            <div className="text-2xl font-bold" aria-label="Site title">EMI Tools Calculator</div>
            <p className="text-blue-100 text-sm">Fast & Accurate Loan Calculations</p>
          </div>
        </header>
        <main className="p-4 max-w-7xl mx-auto min-h-screen">{children}</main>
        <Footer />
        {/* Vercel Speed Insights (renders site performance card) */}
        <SpeedInsights />
      </body>
    </html>
  )
}
