import './styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Footer from '@/app/components/Footer'
import SiteHeader from '@/app/components/SiteHeader'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

// Self-hosted at build time. The previous setup preloaded a Google Fonts
// stylesheet that was never applied, so Inter never actually loaded and the
// request was pure overhead. next/font also removes the render-blocking
// round-trip to fonts.googleapis.com entirely.
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

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
  openGraph: {
    title: 'EMI Calculator - Free Loan EMI Calculation Tool | Instant Results',
    description: 'Calculate EMI for home loans, car loans, personal loans online. Get instant EMI with amortization schedule and interest breakdown. Trusted by 100,000+ users.',
    type: 'website',
    url: SITE_URL,
    siteName: 'EMI Tools Calculator',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMI Calculator - Free Loan EMI Calculation | Instant Results',
    description: 'Calculate EMI for all types of loans instantly with our free online calculator. Accurate, reliable, and trusted.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EMI Tools',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'nBlk1diO030v9sQNDFG2fPVQxyY9NHZhdJeSWJ3UAPI',
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
    <html lang="en-IN" className={inter.variable}>
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

        {/* DNS Prefetch & Preconnect (fonts are self-hosted via next/font) */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* NOTE: canonical + hreflang are intentionally NOT set here.
            This <head> renders on every route, so a hardcoded canonical pointed
            every tool page and blog post at the homepage. Each page declares its
            own via `alternates.canonical` in its metadata export. */}

        {/* Sitemap Link */}
        <link rel="sitemap" type="application/xml" href={`${SITE_URL}/sitemap.xml`} />

        {/* JSON+LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              '@id': `${SITE_URL}/#organization`,
              name: 'EMI Tools',
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              description: 'Free online EMI calculator for loans',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Support',
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
              '@id': `${SITE_URL}/#website`,
              url: SITE_URL,
              name: 'EMI Tools Calculator',
              description: 'Free online EMI calculator for all types of loans',
              inLanguage: 'en-IN',
              publisher: { '@id': `${SITE_URL}/#organization` },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/tools?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7888362617210799" crossOrigin="anonymous"></script>
      </head>
      <body>
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
