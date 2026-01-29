'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold mb-2">About EMI Tools Calculator</h1>
              <p className="text-blue-100">Making Financial Calculations Simple and Accessible</p>
            </div>
          </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            EMI Tools Calculator is dedicated to empowering individuals and families with accurate, easy-to-use financial calculation tools. Our mission is to make complex financial decisions simple and accessible to everyone, regardless of their financial expertise.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We believe that everyone deserves access to reliable tools that help them understand their loan obligations, investments, and financial planning without confusion or unnecessary costs.
          </p>
        </section>

        {/* About Us */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            EMI Tools Calculator is a comprehensive platform providing free financial calculators for a variety of financial scenarios. Our team consists of finance experts, software developers, and designers committed to delivering accurate, user-friendly tools.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            We have developed and maintained calculators for:
          </p>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2 mb-4">
            <li>Home Loan EMI Calculations</li>
            <li>Car Loan EMI Calculations</li>
            <li>Personal Loan EMI Calculations</li>
            <li>Education Loan EMI Calculations</li>
            <li>Gold Loan EMI Calculations</li>
            <li>Investment Calculators (SIP, Lumpsum, FD, RD, PPF, NPS)</li>
            <li>Tax Calculators (HRA, GST, Income Tax)</li>
            <li>Salary and Gratuity Calculators</li>
          </ul>
          <p className="text-gray-700 text-lg leading-relaxed">
            All calculators are designed with accuracy and user experience in mind.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose EMI Tools Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free</h3>
              <p className="text-gray-700">
                All our calculators are completely free. No hidden charges, no registration required.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accurate Calculations</h3>
              <p className="text-gray-700">
                Our algorithms use industry-standard formulas for precise financial calculations.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-Friendly Interface</h3>
              <p className="text-gray-700">
                Intuitive design with real-time results, charts, and detailed breakdowns.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Friendly</h3>
              <p className="text-gray-700">
                Fully responsive design works seamlessly on all devices and screen sizes.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Export & Share</h3>
              <p className="text-gray-700">
                Download calculations as PDF or Excel, and share with pre-filled values.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Scenarios</h3>
              <p className="text-gray-700">
                Compare different loan options to make informed financial decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Our Features */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Features</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Instant EMI Calculation</h3>
                <p className="text-gray-700">Get real-time calculations as you adjust loan parameters with interactive sliders.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Detailed Payment Schedule</h3>
                <p className="text-gray-700">View year-wise and month-wise payment schedules with principal and interest breakdown.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Visual Charts</h3>
                <p className="text-gray-700">Understand your loan with intuitive pie charts and graphs showing principal vs interest.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PDF & Excel Export</h3>
                <p className="text-gray-700">Download your complete calculation report in PDF or Excel format for records.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Shareable Links</h3>
                <p className="text-gray-700">Generate shareable links with pre-filled values for easy collaboration and comparison.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            All calculations provided by EMI Tools Calculator are for educational and informational purposes only. Results are estimates based on the information you provide and may not represent actual amounts.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Actual EMI may vary significantly</strong> based on:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Bank policies, processing fees, and charges</li>
            <li>Current and future interest rates</li>
            <li>Specific loan agreement terms</li>
            <li>Applicable taxes and regulatory changes</li>
            <li>Your creditworthiness and eligibility</li>
          </ul>
          <p className="text-gray-700">
            <strong>Always consult your bank or financial advisor</strong> before making any financial decisions based on our calculator results.
          </p>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <p className="text-gray-700 text-lg mb-6">
            Have questions, suggestions, or need assistance? We'd love to hear from you!
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-3">
              <strong>Email:</strong> <a href="mailto:help.apniwebsite@gmail.com" className="text-blue-600 hover:text-blue-800">help.apniwebsite@gmail.com</a>
            </p>
            <p className="text-gray-700">
              <strong>Website:</strong> <a href="/" className="text-blue-600 hover:text-blue-800">EMI Tools Calculator</a>
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accuracy</h3>
              <p className="text-gray-700">We prioritize accuracy in all our calculations and ensure they follow industry standards.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-700">We are transparent about our methods, data usage, and any limitations of our tools.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">♿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-700">We believe financial tools should be accessible to everyone, free of charge.</p>
            </div>
          </div>
        </section>

          {/* Back Link */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

