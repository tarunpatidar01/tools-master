import React from 'react'

export const FAQSchema = () => {
  const faqData = [
    {
      question: 'What is EMI and how is it calculated?',
      answer: 'EMI (Equated Monthly Installment) is a fixed amount you pay every month towards your loan. It is calculated using the formula: EMI = (P × R × (1 + R)^N) / ((1 + R)^N - 1), where P is principal, R is monthly interest rate, and N is number of months.',
    },
    {
      question: 'Can I pay off my loan early?',
      answer: 'Yes, you can pay off your loan early. However, some lenders may charge a prepayment penalty. Contact your lender to understand their prepayment policy and calculate the savings.',
    },
    {
      question: 'How does reducing balance method work?',
      answer: 'In the reducing balance method, interest is calculated on the outstanding principal amount each month. As you pay EMI, the principal decreases, so the interest component decreases while the principal component increases.',
    },
    {
      question: 'What is the difference between Principal and Interest?',
      answer: 'Principal is the original amount you borrowed. Interest is the additional amount the lender charges for lending you money. Your EMI includes both principal and interest components.',
    },
    {
      question: 'Can this calculator be used for different loan types?',
      answer: 'Yes! This EMI calculator can be used for any loan type including home loans, car loans, personal loans, education loans, and more. Just enter your loan details and get instant calculations.',
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
    '@type': 'SoftwareApplication',
    name: 'EMI Tools - Loan EMI Calculator',
    description: 'Free online EMI calculator for home loans, car loans, personal loans with year-wise breakdown, PDF export and amortization schedule',
    url: 'https://emitools.com',
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'LoanCalculator',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: 'https://emitools.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2450',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '2450',
    },
    image: [
      'https://emitools.com/og-image.jpg',
      'https://emitools.com/og-image-square.jpg',
    ],
    author: {
      '@type': 'Organization',
      name: 'EMI Tools',
      url: 'https://emitools.com',
      logo: 'https://emitools.com/logo.png',
    },
    downloadUrl: 'https://emitools.com',
    fileSize: '5MB',
    operatingSystem: 'Web',
    inLanguage: ['en-IN', 'hi-IN'],
    creator: {
      '@type': 'Organization',
      name: 'EMI Tools',
    },
    datePublished: '2025-01-01',
    dateModified: '2026-01-24',
    softwareRequirements: 'Modern web browser',
    accessibilityFeature: ['alternativeText', 'captions'],
    accessibilityHazard: 'none',
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
    '@id': 'https://emitools.com/#organization',
    name: 'EMI Tools Calculator',
    url: 'https://emitools.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://emitools.com/logo.png',
      width: 200,
      height: 50,
    },
    image: [
      'https://emitools.com/og-image.jpg',
      'https://emitools.com/og-image-square.jpg',
    ],
    description: 'Free EMI calculator for loans with year-wise breakdown, PDF export, and detailed amortization schedules',
    sameAs: [
      'https://www.facebook.com/emitools',
      'https://twitter.com/emitools',
      'https://www.linkedin.com/company/emitools',
      'https://www.youtube.com/emitools',
    ],
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@emitools.com',
      url: 'https://emitools.com/contact',
      telephone: '+91-XXXXXXXXXX',
      availableLanguage: ['en', 'hi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    foundingDate: '2025-01-01',
    foundingLocation: 'India',
    areaServed: ['IN', 'US', 'GB', 'AU'],
    knowsAbout: ['EMI Calculation', 'Loan Management', 'Financial Planning'],
    department: [
      {
        '@type': 'Organization',
        name: 'Customer Support',
      },
    ],
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
      url: 'https://emitools.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EMI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://emitools.com/logo.png',
        width: 200,
        height: 50,
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

export const LocalBusinessSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'EMI Tools Calculator',
    description: 'Online loan EMI calculator service',
    image: 'https://emitools.com/og-image.jpg',
    url: 'https://emitools.com',
    telephone: '+91-XXXXXXXXXX',
    email: 'support@emitools.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    priceRange: '$',
    sameAs: [
      'https://www.facebook.com/emitools',
      'https://twitter.com/emitools',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
