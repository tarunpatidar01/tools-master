import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Wallet,
  Car,
  TrendingUp,
  Landmark,
  Receipt,
  Briefcase,
  Building2,
  CreditCard,
  PiggyBank,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { getAllTools, getCategories } from '@/lib/seo';
import ToolSearchLauncher from '@/app/components/ToolSearchLauncher';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';
const CANONICAL = `${SITE_URL}/tools`;

export const metadata: Metadata = {
  title: 'All Calculators — Loan, Tax, Investment & Salary Tools',
  description:
    'Browse every free EMI Tools calculator in one place: loan EMI, SIP, FD, RD, PPF, EPF, NPS, income tax, GST, salary, gratuity, HRA and IFSC lookup.',
  alternates: {
    canonical: CANONICAL,
    languages: { 'en-IN': CANONICAL, 'x-default': CANONICAL },
  },
  openGraph: {
    title: 'All Calculators — EMI Tools',
    description:
      'Every free loan, tax, investment and salary calculator on EMI Tools, grouped by category.',
    url: CANONICAL,
    type: 'website',
  },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Loan: Wallet,
  Vehicle: Car,
  Investment: TrendingUp,
  Savings: Landmark,
  Tax: Receipt,
  Salary: Briefcase,
  Banking: Building2,
  Credit: CreditCard,
  Retirement: PiggyBank,
};

const CATEGORY_BLURBS: Record<string, string> = {
  Loan: 'Work out the monthly instalment, total interest and amortization schedule before you sign a sanction letter.',
  Vehicle: 'Price a car or bike loan including down payment, tenure and on-road cost.',
  Investment: 'Project what a SIP, lumpsum or withdrawal plan grows to, adjusted for real returns.',
  Savings: 'Compare guaranteed-return schemes — FD, RD, PPF, EPF and Sukanya Samriddhi — on maturity value.',
  Tax: 'Compare the old and new regimes, check GST both ways, and size your HRA exemption.',
  Salary: 'Convert CTC to take-home pay and estimate the gratuity you have accrued.',
  Banking: 'Look up any branch by IFSC code, and price a loan against the published rates of individual banks.',
  Credit: 'Convert a credit card purchase into an EMI plan and see what the interest and processing fee really cost.',
  Retirement: 'Plan the corpus and pension you will need, and see what your NPS contributions grow into.',
};

export default function ToolsIndexPage() {
  const tools = getAllTools();
  const categories = getCategories();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'All EMI Tools calculators',
    description: `Complete list of ${tools.length} free financial calculators on EMI Tools.`,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.keyword,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${CANONICAL}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'All calculators', item: CANONICAL },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-2 text-[13px] text-slate-500">
            <li>
              <Link href="/" className="hover:text-blue-700 transition">
                Home
              </Link>
            </li>
            <li className="text-slate-300">/</li>
            <li aria-current="page" className="font-semibold text-slate-800">
              All calculators
            </li>
          </ol>
        </div>
      </nav>

      <section className="gradient-bg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            All calculators
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed">
            Every one of our {tools.length} free tools, grouped by what it helps you decide. Each
            calculator runs in your browser — nothing you type is sent to a server.
          </p>
          <div className="mt-7">
            <ToolSearchLauncher />
          </div>

          {/* Jump links double as an internal-linking hub for crawlers */}
          <ul className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <li key={cat}>
                <a href={`#${cat.toLowerCase()}`} className="chip hover:bg-blue-50 transition">
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Tag;
          const catTools = tools.filter((t) => t.category === cat);
          return (
            <section key={cat} id={cat.toLowerCase()} aria-labelledby={`${cat.toLowerCase()}-heading`}>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700">
                  <Icon size={19} />
                </span>
                <div>
                  <h2
                    id={`${cat.toLowerCase()}-heading`}
                    className="text-2xl font-bold text-slate-900 tracking-tight"
                  >
                    {cat} calculators
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {catTools.length} tool{catTools.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {CATEGORY_BLURBS[cat] && (
                <p className="mt-3 text-slate-600 max-w-3xl leading-relaxed">
                  {CATEGORY_BLURBS[cat]}
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="card-elevated p-4 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition leading-snug">
                        {tool.keyword}
                      </h3>
                      <ArrowRight
                        size={14}
                        className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0 mt-0.5"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
