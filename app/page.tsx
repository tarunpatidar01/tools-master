'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import ToolSearch from '@/app/components/ToolSearch';
import LanguageToggle from '@/app/components/LanguageToggle';
import { FAQSchema, SoftwareApplicationSchema, OrganizationSchema, BreadcrumbSchema, LocalBusinessSchema } from '@/app/components/SchemaMarkup';
import { getAllTools } from '@/lib/seo';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

const FAQ_DATA = [
  { q: "What is EMI?", a: "EMI (Equated Monthly Installment) is a fixed amount of money you pay to the lender each month. It includes both principal amount and interest components spread over the loan tenure." },
  { q: "How does our calculator work?", a: "Our calculator uses the standard reducing balance EMI formula to calculate accurate monthly payments based on principal, interest rate, and tenure. Results update in real-time as you adjust values." },
  { q: "Can I download my calculation?", a: "Yes! You can download your complete calculation as PDF or Excel file, or generate a shareable link with all pre-filled values." },
  { q: "Is this calculator free?", a: "Absolutely! All our calculators and tools are completely free to use. No registration or hidden fees required." },
];

export default function HomePage() {
  const [showSearch, setShowSearch] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showSidebar, setShowSidebar] = useState(false);
  
  const tools = getAllTools();
  const t = language === 'en' ? en : hi;

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
          {/* Header/Navigation */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                title="Toggle Sidebar"
              >
                ☰
              </button>
              
              <div className="flex-1 mx-4 hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t.home.searchPlaceholder}
                    onClick={() => setShowSearch(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
                    readOnly
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                </div>
              </div>

              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                title="Search Tools"
              >
                🔍
              </button>
              
              <LanguageToggle currentLanguage={language} onChange={setLanguage} />
            </div>
          </div>

          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                {t.home.title}
              </h1>
              <p className="text-lg font-semibold text-gray-700 mb-8 max-w-2xl">
                {t.home.description}
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => setShowSearch(true)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-center"
              >
                Start Calculating Now
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 hover:border-blue-600 text-gray-900 hover:text-blue-600 font-semibold rounded-lg transition text-center">
                Learn More
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-black text-lg text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-700 text-sm font-medium">Get accurate EMI calculations instantly with real-time sliders</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-black text-lg text-gray-900 mb-2">Detailed Analysis</h3>
                <p className="text-gray-700 text-sm font-medium">View payment schedules, charts, and breakdowns in seconds</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-black text-lg text-gray-900 mb-2">Compare Scenarios</h3>
                <p className="text-gray-700 text-sm font-medium">Compare different loan options to make informed decisions</p>
              </div>
            </div>
          </div>

          {/* All Tools Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-y border-gray-200 py-16 my-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Tools & Calculators ({tools.length})</h2>
              <p className="text-gray-600 mb-8">Complete collection of {tools.length} financial calculators</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-h-[600px]">
                {tools && tools.length > 0 ? (
                  tools.map((tool) => (
                    <a
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="bg-white border border-gray-300 hover:border-blue-600 hover:shadow-lg rounded-lg p-4 text-left transition hover:bg-blue-50"
                      title={tool.keyword}
                    >
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{tool.keyword}</h3>
                      <p className="text-xs text-gray-500 mt-2 bg-gray-100 inline-block px-2 py-1 rounded">{tool.category}</p>
                    </a>
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full">Loading {tools.length} calculators...</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Quick Links Section */}
            <div className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <a href="/blog" className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 text-center transition">
                  <div className="text-2xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-900 text-sm">Blog / Tools</h3>
                </a>
                <a href="/about" className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 text-center transition">
                  <div className="text-2xl mb-2">ℹ️</div>
                  <h3 className="font-semibold text-gray-900 text-sm">About Us</h3>
                </a>
                <a href="/contact" className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 text-center transition">
                  <div className="text-2xl mb-2">📧</div>
                  <h3 className="font-semibold text-gray-900 text-sm">Contact Us</h3>
                </a>
                <a href="/privacy-policy" className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 text-center transition">
                  <div className="text-2xl mb-2">🔒</div>
                  <h3 className="font-semibold text-gray-900 text-sm">Privacy Policy</h3>
                </a>
                <a href="/terms" className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md rounded-lg p-4 text-center transition">
                  <div className="text-2xl mb-2">⚖️</div>
                  <h3 className="font-semibold text-gray-900 text-sm">Terms & Conditions</h3>
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How Does It Work?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">1. Enter Loan Details</h3>
                  <p className="text-gray-600 mb-4">Input the loan amount, interest rate, and tenure using sliders or direct input fields</p>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-3 mt-6">2. Get Instant Results</h3>
                  <p className="text-gray-600 mb-4">View your monthly EMI, total interest, and total payment amount instantly</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">3. Analyze Payment Schedule</h3>
                  <p className="text-gray-600 mb-4">Review detailed payment schedules and visualizations of principal vs interest breakdown</p>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-3 mt-6">4. Download & Share</h3>
                  <p className="text-gray-600 mb-4">Download your calculation as PDF/Excel or share a link with pre-filled values</p>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ_DATA.map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <ToolSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)}
      />

      {/* Schema Markup for SEO */}
      <FAQSchema />
      <SoftwareApplicationSchema />
      <OrganizationSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://emitools.com' }]} />
      <LocalBusinessSchema />
    </>
  );
}
