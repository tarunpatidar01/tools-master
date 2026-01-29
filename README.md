# EMI Tools Calculator

A production-ready, SEO-optimized web application for calculating Equated Monthly Installments (EMI) for various types of loans.

## Features

- **15+ Loan Calculators**: Home loans, car loans, personal loans, education loans, gold loans, bike loans, and more
- **Bank-Specific Calculators**: SBI, HDFC Bank, ICICI Bank, Axis Bank EMI calculators
- **Interest Calculators**: Simple interest and compound interest calculators
- **Real-time Calculations**: Instant EMI computation using the reducing balance formula
- **Detailed Amortization Schedules**: Month-by-month payment breakdown
- **Bilingual Support**: English and Hindi language support
- **Responsive Design**: Mobile-first, fully responsive UI
- **SEO Optimized**: Schema markup, structured data, and optimized metadata
- **AdSense Integration**: Multiple ad slots for monetization
- **Dynamic Routing**: Individual pages for each calculator tool
- **Full-Text Search**: Real-time search across all tools

## Tech Stack

- **Framework**: Next.js 16.1.3 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.18
- **Build Tool**: Turbopack
- **Runtime**: React 19.2.3

## Project Structure

```
emi-tools-app/
├── app/
│   ├── components/          # Reusable React components
│   ├── tools/[slug]/        # Dynamic tool pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout with SEO metadata
│   ├── page.tsx             # Homepage
│   └── styles/              # Global CSS
├── lib/
│   ├── emi.ts               # EMI calculation engine
│   └── seo.ts               # SEO utilities and tool management
├── data/
│   ├── tools.json           # 15 tools database
│   └── keywords.json        # Keyword reference data
├── i18n/
│   ├── en.json              # English translations
│   └── hi.json              # Hindi translations
└── public/                  # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Available Tools (15 Calculators)

1. EMI Calculator (74K/month searches)
2. Home Loan EMI Calculator (49K/month)
3. Car Loan EMI Calculator (27K/month)
4. Personal Loan EMI Calculator (18K/month)
5. SBI EMI Calculator (12.1K/month)
6. Education Loan EMI Calculator (22K/month)
7. Gold Loan EMI Calculator (19K/month)
8. Vehicle Loan Calculator (15K/month)
9. Axis Bank Loan EMI Calculator (14K/month)
10. Simple Interest Calculator (11K/month)
11. Compound Interest Calculator (13K/month)
12. Bike Loan EMI Calculator (16.5K/month)
13. HDFC Bank Loan EMI Calculator (12.5K/month)
14. ICICI Bank Loan EMI Calculator (10.5K/month)
15. Loan Amount Calculator (9.5K/month)

## Calculation Formula

Reducing Balance Method:
```
EMI = P × R × (1 + R)^N / ((1 + R)^N - 1)
```

Where:
- P = Principal (loan amount)
- R = Monthly interest rate
- N = Number of months

## SEO Features

- Dynamic sitemap generation
- JSON-LD schema markup
- FAQSchema for rich snippets
- BreadcrumbSchema
- Open Graph and Twitter Card metadata
- robots.txt configuration
- Canonical URLs
- hreflang tags for multilingual support

## License

MIT
