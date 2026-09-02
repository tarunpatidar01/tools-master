'use client';

import { useState } from 'react';
import { Menu as MenuIcon, Search as SearchIcon } from 'lucide-react';
import { useLanguage, useTranslate } from '@/lib/i18n';
import Sidebar from '@/app/components/Sidebar';
import LanguageToggle from '@/app/components/LanguageToggle';
import ToolSearch from '@/app/components/ToolSearch';

type FAQItem = { question: string; answer: string };

type Tool = {
  slug: string;
  keyword: string;
  hindi?: string;
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
  // The calculator itself is chosen and rendered on the server (see
  // ./CalculatorFor.tsx) and passed through as children, so this component only
  // owns the surrounding UI state.
  children: React.ReactNode;
}



function ToolPageClientComponent({ tool, faqList = [], children }: ToolPageClientProps) {
  const [language, setLanguage] = useLanguage();
  const t = useTranslate(language);
  // tools.json carries a Hindi name per tool; use it once the reader switches.
  const toolLabel = (language === 'hi' && tool.hindi) || tool.title || tool.keyword;
  // Split the sentence around the tool name so it can be bolded without
  // embedding markup in the translation string.
  const [aboutBefore, aboutAfter] = t('toolPage.aboutBody', { tool: '|' }).split('|');
  // `tool` is strongly typed now — helps avoid `any` lint errors and improves maintainability.
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  


  // FAQ is provided by the server via props; local defaults removed to avoid duplication


  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only p-2">{t('nav.skipToContent')}</a>

      <div className="flex flex-col lg:flex-row min-h-screen bg-white">
        {/* Sidebar as complementary landmark */}
        <aside
          role="complementary"
          aria-label={t('nav.toolsNavigation')}
          className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto bg-gray-50 border-r border-gray-200`}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('sidebar.heading')}</h2>
            <nav aria-label={t('nav.toolsList')}>
              <Sidebar language={language} />
            </nav>
          </div>

          {/* Visible Close Button for small screens with accessible text */}
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden w-full p-4 bg-gray-900 text-white text-center font-semibold hover:bg-gray-800"
              aria-label={t('nav.closeSidebar')}
            >
              {t('nav.closeSidebar')}
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
                aria-label={showSidebar ? t('nav.hideSidebar') : t('nav.showSidebar')}
                aria-expanded={showSidebar}
                aria-controls="tools-sidebar"
              >
                <MenuIcon size={18} aria-hidden />
              </button>

              {/* Primary page title — H1 should be unique and descriptive */}
              <h1 className="text-2xl font-bold text-gray-900 flex-1 ml-4 lg:ml-0">{tool.title || tool.keyword}</h1>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSearch(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  aria-label={t('nav.openSearch')}
                >
                  <SearchIcon size={16} aria-hidden />
                </button>

                {/* Language toggle component (assumed accessible) */}
                <LanguageToggle currentLanguage={language} onChange={setLanguage} />
              </div>
            </div>
          </header>

          {/* Short intro explanatory section above the calculator */}
          <section aria-labelledby="intro-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 id="intro-heading" className="text-xl font-semibold text-gray-800">{t('toolPage.aboutHeading')}</h2>
            <p className="mt-2 text-gray-600">
              {aboutBefore}
              <strong>{toolLabel}</strong>
              {aboutAfter}
            </p>
          </section>

          {/* Calculator area (main interactive content) */}
          <article aria-labelledby="calculator-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 id="calculator-heading" className="sr-only">{t('toolPage.calculatorLabel')}</h2>

            {children}

            {/* Notes or result explanation below the calculator */}
            <section aria-labelledby="results-heading" className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
              <h2 id="results-heading" className="text-lg font-semibold text-gray-800">{t('toolPage.resultsHeading')}</h2>
              <p className="mt-2 text-gray-600">{t('toolPage.resultsBody')}</p>
            </section>
          </article>

          {/* Tool Description — preserved structure, semantic headings */}
          {tool.content?.sections && (
            <section aria-labelledby="description-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h2 id="description-heading" className="text-xl font-semibold text-gray-800">{t('toolPage.moreAboutHeading')}</h2>
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
            <h2 id="faq-heading" className="text-xl font-semibold text-gray-800">{t('toolPage.faqHeading')}</h2>
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
