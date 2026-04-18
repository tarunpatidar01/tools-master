import Link from 'next/link';
import { Calculator, CheckCircle2 } from 'lucide-react';

const popularCalculators = [
  { name: 'EMI Calculator', slug: 'emi-calculator' },
  { name: 'Home Loan EMI', slug: 'home-loan-emi-calculator' },
  { name: 'Car Loan EMI', slug: 'car-loan-emi-calculator' },
  { name: 'Personal Loan', slug: 'personal-loan-calculator' },
  { name: 'SIP Calculator', slug: 'sip-calculator' },
];

const moreTools = [
  { name: 'FD Calculator', slug: 'fd-calculator' },
  { name: 'PPF Calculator', slug: 'ppf-calculator' },
  { name: 'Income Tax', slug: 'income-tax-calculator' },
  { name: 'GST Calculator', slug: 'gst-calculator' },
  { name: 'IFSC Finder', slug: 'ifsc-code-finder' },
];

const helpLinks = [
  { name: 'Blog & Guides', href: '/blog' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Use', href: '/terms' },
];

const FEATURES = [
  'Standard RBI formulas',
  'Year-wise breakdown',
  'PDF and Excel export',
  'Share with pre-filled values',
  '1,32,000+ IFSC branches',
  '31 financial calculators',
  'Mobile-friendly UI',
  '100% free, no signup',
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
                <Calculator size={18} strokeWidth={2.2} />
              </span>
              <span className="text-white font-bold text-lg leading-none">EMI Tools</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Free, accurate loan EMI, tax, and investment calculators for India — plus a branch-level IFSC finder.
            </p>
          </div>

          <FooterCol title="Popular Calculators">
            {popularCalculators.map((c) => (
              <FooterLink key={c.slug} href={`/tools/${c.slug}`}>{c.name}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="More Tools">
            {moreTools.map((c) => (
              <FooterLink key={c.slug} href={`/tools/${c.slug}`}>{c.name}</FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Help & Legal">
            {helpLinks.map((l) => (
              <FooterLink key={l.href} href={l.href}>{l.name}</FooterLink>
            ))}
          </FooterCol>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
            What you get
          </h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoBlock title="Disclaimer">
            Results are estimates based on standard formulas. Actual EMI may vary with bank-specific
            rounding, processing fees, insurance premium, and changing interest rates.
          </InfoBlock>
          <InfoBlock title="Data sources">
            IFSC data is sourced from the public Razorpay IFSC dataset. Tax calculations follow the
            latest Finance Act slabs. All figures are updated as official sources change.
          </InfoBlock>
          <InfoBlock title="Support">
            For feature requests, bank coverage, or corrections, reach us through the{' '}
            <Link href="/contact" className="text-slate-200 hover:text-white underline decoration-slate-600">contact page</Link>.
          </InfoBlock>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EMI Tools. All rights reserved.</p>
          <p>
            Built for Indian borrowers and investors. Not affiliated with any bank or government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-slate-400 hover:text-white transition"
      >
        {children}
      </Link>
    </li>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
        {title}
      </h4>
      <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </div>
  );
}
