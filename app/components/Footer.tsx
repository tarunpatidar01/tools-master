import React from 'react';

export default function Footer() {
  const popularCalculators = [
    { name: 'EMI Calculator', slug: 'emi-calculator' },
    { name: 'Home Loan EMI Calculator', slug: 'home-loan-emi-calculator' },
    { name: 'Car Loan EMI Calculator', slug: 'car-loan-emi-calculator' },
    { name: 'Education Loan EMI Calculator', slug: 'education-loan-emi-calculator' },
    { name: 'Gold Loan EMI Calculator', slug: 'gold-loan-emi-calculator' },
  ];

  const moreTools = [
    { name: 'Personal Loan EMI Calculator', slug: 'personal-loan-emi-calculator' },
    { name: 'Bike Loan EMI Calculator', slug: 'bike-loan-emi-calculator' },
    { name: 'Vehicle Loan Calculator', slug: 'vehicle-loan-calculator' },
    { name: 'Axis Bank Loan EMI Calculator', slug: 'axis-bank-loan-emi-calculator' },
    { name: 'Compound Interest Calculator', slug: 'compound-interest-calculator' },
  ];

  const helpLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Use', href: '/terms' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Popular Calculators */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Popular Calculators</h3>
            <ul className="space-y-2">
              {popularCalculators.map((calc, idx) => (
                <li key={idx}>
                  <a
                    href={`/tools/${calc.slug}`}
                    className="text-gray-400 text-sm hover:text-blue-400 transition"
                  >
                    {calc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">More Tools</h3>
            <ul className="space-y-2">
              {moreTools.map((tool, idx) => (
                <li key={idx}>
                  <a
                    href={`/tools/${tool.slug}`}
                    className="text-gray-400 text-sm hover:text-blue-400 transition"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Help & Legal</h3>
            <ul className="space-y-2">
              {helpLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-blue-400 transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          {/* Features */}
          <div className="mb-8">
            <h4 className="text-sm font-bold mb-4 text-white">Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                'Instant EMI Calculation',
                'Year-wise Breakdown',
                'PDF/Excel Export',
                'Share with Pre-filled Values',
                'Multiple Loan Types',
                'Support for Indian Loans',
                'Mobile Friendly',
                'Completely Free'
              ].map((feature, idx) => (
                <div key={idx} className="text-gray-400 text-xs flex items-center gap-2">
                  <span className="text-blue-400">✓</span> <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Sections */}
          <div className="border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-bold mb-3 text-white">About</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  EMI Tools Calculator provides fast, accurate loan EMI calculations for home, car, personal, and education loans.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold mb-3 text-white">Disclaimer</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Calculations are for reference only. Actual EMI may vary based on bank policies, processing fees, and current interest rates.
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold mb-3 text-white">Support</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  For accurate calculations, always consult your bank or financial institution before taking any financial decision.
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-400 text-xs">
                &copy; 2026 EMI Tools Calculator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
