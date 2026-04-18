import React from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

export const FAQSchema = () => {
  const faqData = [
    {
      question: 'What is EMI and how is it calculated?',
      answer: 'EMI (Equated Monthly Installment) is a fixed amount you pay every month towards your loan. It is calculated using the formula: EMI = (P × R × (1 + R)^N) / ((1 + R)^N - 1), where P is principal, R is monthly interest rate, and N is number of months.',
    },
    {
      question: 'Can I pay off my loan early?',
      answer: 'Yes, you can pay off your loan early. RBI has prohibited prepayment penalties on floating-rate loans to individual borrowers. Fixed-rate loans may still carry a 2% to 5% charge. Prepaying early in the tenure saves the most interest.',
    },
    {
      question: 'How does the reducing balance method work?',
      answer: 'In the reducing balance method, interest is calculated on the outstanding principal amount each month. As you pay EMI, the principal decreases, so the interest component decreases while the principal component grows.',
    },
    {
      question: 'What is the difference between principal and interest?',
      answer: 'Principal is the original amount you borrowed. Interest is the additional amount the lender charges for lending you money. Your EMI includes both principal and interest components.',
    },
    {
      question: 'Can this calculator be used for different loan types?',
      answer: 'Yes. This EMI calculator works for home loans, car loans, personal loans, education loans, and any other loan using the standard reducing-balance formula.',
    },
  ]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'EMI Calculator FAQ',
    description: 'Frequently Asked Questions about EMI calculation and loan management',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const SoftwareApplicationSchema = () => {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'WebApplication',
    name: 'EMI Tools — Loan EMI Calculator',
    description: 'Free online EMI calculator for home loans, car loans, personal loans with year-wise breakdown, PDF export and amortization schedule',
    url: SITE_URL,
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'LoanCalculator',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: SITE_URL,
    },
    image: [
      `${SITE_URL}/og-image.jpg`,
      `${SITE_URL}/og-image-emi-calculator.svg`,
    ],
    author: {
      '@type': 'Organization',
      name: 'EMI Tools',
      url: SITE_URL,
    },
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern browser with JavaScript enabled',
    inLanguage: 'en-IN',
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'EMI Tools',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/apple-touch-icon.png`,
    },
    image: `${SITE_URL}/og-image.jpg`,
    description: 'Free EMI calculator for loans with year-wise breakdown, PDF export, and detailed amortization schedules',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${SITE_URL}/contact`,
      availableLanguage: ['en', 'hi'],
    },
    areaServed: 'IN',
    knowsAbout: ['EMI Calculation', 'Loan Management', 'Financial Planning', 'Tax Planning', 'Indian Banking'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const ArticleSchema = ({
  title,
  description,
  image,
  author,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  image: string
  author: string
  datePublished: string
  dateModified: string
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Organization',
      name: author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'EMI Tools',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/apple-touch-icon.png`,
      },
    },
    datePublished: datePublished,
    dateModified: dateModified,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const HowToSchema = ({
  name,
  description,
  steps,
}: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime: 'PT1M',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// LocalBusinessSchema was removed — EMI Tools is an online service, not a local business.
// Using LocalBusiness incorrectly can trigger structured-data penalties in Google Search Console.
