'use client';

import { useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar';
import LanguageToggle from '@/app/components/LanguageToggle';
import ToolSearch from '@/app/components/ToolSearch';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

// Lazy load all calculator components
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

interface ToolPageClientProps {
  tool: any;
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

function ToolPageClientComponent({ tool }: ToolPageClientProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const t = language === 'en' ? en : hi;

  const getCalculatorComponent = useMemo(() => {
    for (const [key, Component] of Object.entries(CALCULATOR_MAP)) {
      if (tool.slug.includes(key)) {
        return <Component toolName={tool.keyword} />;
      }
    }
    return <EmiCalculator toolName={tool.keyword} initialRate={tool.initialRate || 8.5} />;
  }, [tool.slug, tool.keyword, tool.initialRate]);

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto bg-gray-50 border-r border-gray-200`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tools & Calculators</h2>
            <Sidebar />
          </div>
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden w-full p-4 bg-gray-900 text-white text-center font-semibold hover:bg-gray-800"
            >
              Close
            </button>
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex-1 ml-4 lg:ml-0">{tool.keyword}</h1>
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                🔍
              </button>
              <LanguageToggle currentLanguage={language} onChange={setLanguage} />
            </div>
          </div>

          {/* Calculator Content */}
          <Suspense fallback={<div className="text-center py-12">Loading calculator...</div>}>
            {getCalculatorComponent}
          </Suspense>

          {/* Tool Description */}
          {tool.content?.sections && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-lg border border-gray-200">
              {tool.content.sections.map((section: any, idx: number) => (
                <div key={idx} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Search Modal */}
      <ToolSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
      />
    </>
  );
}

export default ToolPageClientComponent;
