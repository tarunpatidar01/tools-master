'use client';

import { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar';
import LanguageToggle from '@/app/components/LanguageToggle';
import ToolSearch from '@/app/components/ToolSearch';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

// Lazy load all calculator components (kept business logic unchanged)
const EmiCalculator = dynamic(() => import('@/app/components/EmiCalculator'), { ssr: true });
const SimpleInterestCalculator = dynamic(() => import('@/app/components/SimpleInterestCalculator'), { ssr: true });
const CompoundInterestCalculator = dynamic(() => import('@/app/components/CompoundInterestCalculator'), { ssr: true });
const LoanEligibilityCalculator = dynamic(() => import('@/app/components/LoanEligibilityCalculator'), { ssr: true });
const PersonalLoanCalculator = dynamic(() => import('@/app/components/PersonalLoanCalculator'), { ssr: true });
const CreditCardEmiCalculator = dynamic(() => import('@/app/components/CreditCardEmiCalculator'), { ssr: true });
const SipCalculator = dynamic(() => import('@/app/components/SipCalculator'), { ssr: true });
const LumpsumCalculator = dynamic(() => import('@/app/components/LumpsumCalculator'), { ssr: true });
const MutualFundCalculator = dynamic(() => import('@/app/components/MutualFundCalculator'), { ssr: true });
const FdCalculator = dynamic(() => import('@/app/components/FdCalculator'), { ssr: true });
const RdCalculator = dynamic(() => import('@/app/components/RdCalculator'), { ssr: true });
const PpfCalculator = dynamic(() => import('@/app/components/PpfCalculator'), { ssr: true });
const NpsCalculator = dynamic(() => import('@/app/components/NpsCalculator'), { ssr: true });
const IncomeCalculator = dynamic(() => import('@/app/components/IncomeCalculator'), { ssr: true });
const GstCalculator = dynamic(() => import('@/app/components/GstCalculator'), { ssr: true });
const SalaryCalculator = dynamic(() => import('@/app/components/SalaryCalculator'), { ssr: true });
const GratuityCalculator = dynamic(() => import('@/app/components/GratuityCalculator'), { ssr: true });
const HraCalculator = dynamic(() => import('@/app/components/HraCalculator'), { ssr: true });

type FAQItem = { question: string; answer: string };

type Tool = {
  slug: string;
  keyword: string;
  title?: string;
  initialRate?: number;
  description?: string;
  content?: {
    sections?: { heading: string; content: string }[];
    faq?: FAQItem[];
    h1?: string;
    h2?: string;
  };
};

interface ToolPageClientProps {
  tool: Tool;
  // FAQ list is passed from server (page.tsx) to keep a single source of truth
  faqList?: FAQItem[];
} 

const CALCULATOR_MAP = {
  'simple-interest': SimpleInterestCalculator,
  'compound-interest': CompoundInterestCalculator,
  'loan-eligibility': LoanEligibilityCalculator,
  'personal-loan': PersonalLoanCalculator,
  'credit-card-emi': CreditCardEmiCalculator,
  'sip': SipCalculator,
  'lumpsum-investment': LumpsumCalculator,
  'mutual-fund': MutualFundCalculator,
  'fd-calculator': FdCalculator,
  'rd-calculator': RdCalculator,
  'ppf': PpfCalculator,
  'nps': NpsCalculator,
  'income-tax': IncomeCalculator,
  'gst': GstCalculator,
  'salary': SalaryCalculator,
  'gratuity': GratuityCalculator,
  'hra': HraCalculator,
} as const;

function ToolPageClientComponent({ tool, faqList = [] }: ToolPageClientProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  // `tool` is strongly typed now — helps avoid `any` lint errors and improves maintainability.
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const t = language === 'en' ? en : hi;

  // Decide which calculator component to render based on slug (business logic preserved)
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const CalculatorElement = useMemo(() => {
    for (const [key, Component] of Object.entries(CALCULATOR_MAP)) {
      if (tool.slug.includes(key)) {
        return <Component toolName={tool.keyword} />;
      }
    }
    return <EmiCalculator toolName={tool.keyword} initialRate={tool.initialRate || 8.5} />;
  }, [tool.slug, tool.keyword, tool.initialRate]);

  // FAQ is provided by the server via props; local defaults removed to avoid duplication


  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only p-2">Skip to main content</a>

      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        {/* Sidebar as complementary landmark */}
        <aside
          role="complementary"
          aria-label="Tools and calculators navigation"
          className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto bg-gray-50 border-r border-gray-200`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tools & Calculators</h2>
            <nav aria-label="Tools list">
              <Sidebar />
            </nav>
          </div>

          {/* Visible Close Button for small screens with accessible text */}
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden w-full p-4 bg-gray-900 text-white text-center font-semibold hover:bg-gray-800"
              aria-label="Close tools menu"
            >
              Close
            </button>
          )}
        </aside>

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 overflow-y-auto" role="main">
          {/* Local header for the tool page (exactly one H1 on this page) */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                aria-label={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
                aria-expanded={showSidebar}
                aria-controls="tools-sidebar"
              >
                <span aria-hidden>☰</span>
              </button>

              {/* Primary page title — H1 should be unique and descriptive */}
              <h1 className="text-2xl font-bold text-gray-900 flex-1 ml-4 lg:ml-0">{tool.title || tool.keyword}</h1>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSearch(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  aria-label="Open search"
                >
                  <span aria-hidden>🔍</span>
                </button>

                {/* Language toggle component (assumed accessible) */}
                <LanguageToggle currentLanguage={language} onChange={setLanguage} />
              </div>
            </div>
          </header>

          {/* Short intro explanatory section above the calculator */}
          <section aria-labelledby="intro-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 id="intro-heading" className="text-xl font-semibold text-gray-800">About this calculator</h2>
            <p className="mt-2 text-gray-600">Use the <strong>{tool.title || tool.keyword}</strong> to quickly estimate results. Enter the inputs and review the calculated output below. This tool is for guidance and educational purposes only.</p>
          </section>

          {/* Calculator area (main interactive content) */}
          <article aria-labelledby="calculator-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 id="calculator-heading" className="sr-only">Calculator</h2>

            <Suspense fallback={<div className="text-center py-12" role="status" aria-live="polite">Loading calculator...</div>}>
              {CalculatorElement}
            </Suspense>

            {/* Notes or result explanation below the calculator */}
            <section aria-labelledby="results-heading" className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
              <h2 id="results-heading" className="text-lg font-semibold text-gray-800">Understanding the results</h2>
              <p className="mt-2 text-gray-600">The results show estimated values based on your inputs. Check the values and adjust inputs if you need different scenarios.</p>
            </section>
          </article>

          {/* Tool Description — preserved structure, semantic headings */}
          {tool.content?.sections && (
            <section aria-labelledby="description-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 id="description-heading" className="text-xl font-semibold text-gray-800">More about this tool</h2>
              <div className="mt-4 space-y-8">
                {tool.content.sections.map((section: { heading: string; content: string }, idx: number) => (
                  <section key={idx} aria-labelledby={`section-${idx}-heading`}>
                    <h3 id={`section-${idx}-heading`} className="text-lg font-medium text-gray-900">{section.heading}</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{section.content}</p>
                  </section>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section (visible content + structured data) */}
          <section aria-labelledby="faq-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 id="faq-heading" className="text-xl font-semibold text-gray-800">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              {faqList.map((f: FAQItem, idx: number) => (
                <div key={idx}>
                  <h3 className="text-lg font-medium text-gray-900">{f.question}</h3>
                  <p className="mt-1 text-gray-600">{f.answer}</p>
                </div>
              ))}
            </div>

          </section>
        </main>
      </div>

      {/* Search Modal (kept unchanged) */}
      <ToolSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
      />
    </>
  );
}

export default ToolPageClientComponent;
