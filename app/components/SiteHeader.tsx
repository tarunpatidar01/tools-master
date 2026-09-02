'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Calculator, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Calculators', href: '/tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'IFSC Finder', href: '/tools/ifsc-code-finder' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="EMI Tools home">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm group-hover:shadow-md transition">
              <Calculator size={18} strokeWidth={2.2} />
            </span>
            <div className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-slate-900">
                EMI Tools
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                Loan · Tax · Investment
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/tools/emi-calculator" className="btn-primary text-sm px-4 py-2">
              Calculate EMI
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 pt-1 space-y-1 border-t border-slate-100">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/tools/emi-calculator"
              onClick={() => setOpen(false)}
              className="btn-primary w-full mt-2"
            >
              Calculate EMI
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
