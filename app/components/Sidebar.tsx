'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
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
} from 'lucide-react';
import { getAllToolsMeta, getMetaCategories } from '@/lib/toolsMeta';
import { translate, translateCategory, type Language } from '@/lib/i18n';

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

export default function Sidebar({ language = 'en' }: { language?: Language }) {
  const tools = getAllToolsMeta();
  const categories = getMetaCategories();
  const pathname = usePathname();
  const t = (path: string, vars?: Record<string, string | number>) =>
    translate(language, path, vars);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  type Tool = ReturnType<typeof getAllToolsMeta>[0];

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = tools.filter((t) => t.category === cat);
    return acc;
  }, {} as Record<string, Tool[]>);

  const toggle = (cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <aside className="h-full min-h-screen bg-white text-slate-800 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              {t('sidebar.eyebrow')}
            </p>
            <p className="text-lg font-bold text-slate-900 leading-tight">
              {t('sidebar.allCalculators')}
            </p>
          </div>
          <span className="chip">{tools.length}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat] || Tag;
          const isOpen = !collapsed.has(cat);
          const catTools = grouped[cat] || [];
          return (
            <div key={cat} className="mb-1">
              <button
                onClick={() => toggle(cat)}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-[13px] font-semibold text-slate-800 hover:bg-slate-50 transition"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-blue-50 text-blue-700">
                    <Icon size={13} />
                  </span>
                  <span>{translateCategory(language, cat)}</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {catTools.length}
                  </span>
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition ${isOpen ? '' : '-rotate-90'}`}
                />
              </button>

              {isOpen && (
                <ul className="mt-0.5 mb-2 ml-8 border-l border-slate-100 pl-2 space-y-0.5">
                  {catTools.map((tool) => {
                    const href = `/tools/${tool.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={tool.slug}>
                        <Link
                          href={href}
                          className={`block px-2.5 py-1.5 rounded-md text-[12.5px] leading-snug transition ${
                            active
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {language === 'hi' && tool.hindi ? tool.hindi : tool.keyword}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/60">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {t('sidebar.note')}
        </p>
      </div>
    </aside>
  );
}
