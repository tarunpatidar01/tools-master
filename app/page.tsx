'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  BarChart3,
  GitCompareArrows,
  BookOpen,
  Info,
  Mail,
  Shield,
  Scale,
  Search,
  ArrowRight,
  Home,
  Car,
  Wallet,
  TrendingUp,
  Landmark,
  Receipt,
  Briefcase,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import ToolSearch from '@/app/components/ToolSearch';
import {
  FAQSchema,
  SoftwareApplicationSchema,
  OrganizationSchema,
  BreadcrumbSchema,
} from '@/app/components/SchemaMarkup';
import { getAllTools, getCategories } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

const FAQ_DATA = [
  {
    q: 'What is EMI?',
    a: 'EMI (Equated Monthly Installment) is a fixed amount you pay to the lender every month. It includes principal repayment and interest on the outstanding balance, spread evenly across the loan tenure.',
  },
  {
    q: 'How accurate is this calculator?',
    a: 'Our calculators use the standard reducing-balance formula used by every bank in India. Results match the lender sanction letter within rupees; small differences come from bank rounding and processing fees.',
  },
  {
    q: 'Can I download the calculation?',
    a: 'Yes. Every tool lets you download the full amortization schedule as PDF or Excel, and also share a URL with pre-filled values for collaboration.',
  },
  {
    q: 'Is everything really free?',
    a: 'Yes. All 31 calculators and tools are 100% free, with no signup, no limits, and no paid tier. Your inputs stay on your device — we do not store calculations.',
  },
];

const FEATURE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Loan: Wallet,
  Vehicle: Car,
  Investment: TrendingUp,
  Savings: Landmark,
  Tax: Receipt,
  Salary: Briefcase,
  Banking: Building2,
};

const CATEGORY_FEATURED: Record<string, string[]> = {
  Loan: ['emi-calculator', 'home-loan-emi-calculator', 'personal-loan-calculator'],
  Vehicle: ['car-loan-emi-calculator', 'bike-loan-emi-calculator'],
  Investment: ['sip-calculator', 'lumpsum-investment-calculator', 'mutual-fund-return-calculator'],
  Savings: ['fd-calculator', 'rd-calculator', 'ppf-calculator'],
  Tax: ['income-tax-calculator', 'gst-calculator', 'hra-calculator'],
  Salary: ['salary-calculator', 'gratuity-calculator'],
  Banking: ['ifsc-code-finder'],
};

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);

  const tools = useMemo(() => getAllTools(), []);
  const categories = useMemo(() => getCategories(), []);

  const toolsByCategory = useMemo(() => {
    const groups: Record<string, ReturnType<typeof getAllTools>> = {};
    categories.forEach((c) => {
      groups[c] = tools.filter((t) => t.category === c);
    });
    return groups;
  }, [categories, tools]);

  return (
    <>
      {/* Hero */}
      <section className="gradient-bg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 chip chip-brand mb-5">
              <Zap size={12} strokeWidth={2.5} /> Trusted by Indian borrowers since 2025
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05]">
              The complete toolkit for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                loans, tax, and investments.
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl">
              {tools.length} free calculators used by thousands every day. Real-time results, year-wise
              amortization, tax-regime comparison, and branch-level IFSC lookup — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowSearch(true)} className="btn-primary">
                <Search size={16} /> Find a calculator
              </button>
              <Link href="/tools/emi-calculator" className="btn-secondary">
                Try EMI Calculator <ArrowRight size={16} />
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              <Stat value={`${tools.length}+`} label="Calculators" />
              <Stat value="1.3L+" label="Branches indexed" />
              <Stat value="₹12L+" label="Monthly searches" />
            </dl>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Feature
            icon={Zap}
            title="Instant, accurate results"
            description="Every calculator runs client-side with the reducing-balance formula. Results match bank sanction letters to the rupee."
          />
          <Feature
            icon={BarChart3}
            title="Detailed breakdowns"
            description="Year-wise and month-wise amortization, interactive sliders, principal vs. interest splits, and downloadable PDF/Excel reports."
          />
          <Feature
            icon={GitCompareArrows}
            title="Compare scenarios"
            description="Test multiple tenures, rates, and prepayment plans side-by-side before committing to a loan or investment."
          />
        </div>
      </section>

      {/* All Tools by Category */}
      <section id="all-tools" className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                All calculators
              </h2>
              <p className="mt-1 text-slate-600">
                {tools.length} tools across {categories.length} categories — pick one to get started.
              </p>
            </div>
            <button
              onClick={() => setShowSearch(true)}
              className="btn-secondary text-sm"
            >
              <Search size={14} /> Search
            </button>
          </div>

          <div className="space-y-10">
            {categories.map((cat) => {
              const Icon = FEATURE_ICONS[cat] || Wallet;
              const featuredSlugs = new Set(CATEGORY_FEATURED[cat] || []);
              const catTools = toolsByCategory[cat] || [];
              const sorted = [...catTools].sort((a, b) => {
                const af = featuredSlugs.has(a.slug) ? 0 : 1;
                const bf = featuredSlugs.has(b.slug) ? 0 : 1;
                if (af !== bf) return af - bf;
                return b.monthlySearches - a.monthlySearches;
              });
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-700">
                      <Icon size={18} />
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">{cat}</h3>
                    <span className="text-xs text-slate-400 font-medium">
                      {catTools.length} tool{catTools.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {sorted.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="card-elevated p-4 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition leading-snug">
                            {tool.keyword}
                          </h4>
                          <ArrowRight
                            size={14}
                            className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition shrink-0 mt-0.5"
                          />
                        </div>
                        {tool.description && (
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
                            {tool.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">How it works</h2>
            <p className="mt-2 text-slate-600 max-w-lg">
              Each calculator is self-contained. Enter your numbers, see results instantly, adjust
              scenarios, and export the breakdown.
            </p>
            <ol className="mt-8 space-y-5">
              {[
                {
                  h: 'Enter loan or investment details',
                  p: 'Amount, interest rate, tenure — use sliders for quick scenario testing.',
                },
                {
                  h: 'Get instant calculations',
                  p: 'EMI, total interest, maturity value, and take-home salary update as you type.',
                },
                {
                  h: 'Analyze year-wise breakdowns',
                  p: 'See principal vs. interest each year, prepayment impact, and tax implications.',
                },
                {
                  h: 'Download or share',
                  p: 'Export as PDF/Excel, or share a URL that pre-fills all the values.',
                },
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{s.h}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="card-elevated p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="chip chip-success">
                <CheckCircle2 size={12} strokeWidth={2.5} /> Trusted data sources
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Why our numbers can be trusted</h3>
            <p className="mt-2 text-slate-600">
              Every calculator follows the standard formulas used by Indian banks, RBI, and tax
              authorities. We do not round aggressively or apply marketing adjustments.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <a
                    href="https://www.investopedia.com/articles/personal-finance/071016/how-calculate-your-emis.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-300 hover:text-blue-700"
                  >
                    Standard reducing-balance EMI formula
                  </a>
                  {' '}used by every major Indian lender
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Live IFSC data sourced from the public{' '}
                  <a
                    href="https://github.com/razorpay/ifsc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-300 hover:text-blue-700"
                  >
                    Razorpay IFSC dataset
                  </a>
                </span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Tax calculations match the latest Finance Act slabs and deductions</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>No user data stored — calculations run entirely in your browser</span>
              </li>
            </ul>

            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Embed in your blog</p>
              <pre className="text-[11px] text-slate-600 bg-white border border-slate-200 rounded p-2 overflow-auto">
                <code>{`<iframe src="${SITE_URL}/tools/emi-calculator" width="600" height="700" style="border:0;" loading="lazy"></iframe>`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-2 text-slate-600">
              Everything you need to know before using the calculators.
            </p>
          </div>
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => (
              <details
                key={i}
                className="group card-elevated p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                  <span className="ml-3 shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full border border-slate-200 text-slate-500 group-open:rotate-45 group-open:border-blue-200 group-open:text-blue-600 transition">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: '/blog', icon: BookOpen, label: 'Blog & guides' },
            { href: '/tools/ifsc-code-finder', icon: Building2, label: 'IFSC finder' },
            { href: '/tools/emi-calculator', icon: Home, label: 'EMI calculator' },
            { href: '/about', icon: Info, label: 'About' },
            { href: '/contact', icon: Mail, label: 'Contact' },
            { href: '/privacy-policy', icon: Shield, label: 'Privacy' },
          ].map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="card-elevated px-4 py-3 flex items-center gap-3 group"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                  <Icon size={15} />
                </span>
                <span className="text-sm font-medium text-slate-800">{l.label}</span>
              </Link>
            );
          })}
          <Link
            href="/terms"
            className="card-elevated px-4 py-3 flex items-center gap-3 group"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
              <Scale size={15} />
            </span>
            <span className="text-sm font-medium text-slate-800">Terms</span>
          </Link>
        </div>
      </section>

      <ToolSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

      <FAQSchema />
      <SoftwareApplicationSchema />
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: SITE_URL }]} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl md:text-3xl font-extrabold text-slate-900">{value}</dd>
      <dd className="text-xs text-slate-500 font-medium mt-0.5">{label}</dd>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="card-elevated p-6">
      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm mb-4">
        <Icon size={20} />
      </span>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
