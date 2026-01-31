'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
              <p className="text-blue-100">Last updated: January 2026</p>
            </div>
          </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
          {/* Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing and using EMI Tools Calculator website and services, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions contained herein. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          {/* Use License */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on EMI Tools Calculator for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              The materials on EMI Tools Calculator are provided on an as-is basis. EMI Tools Calculator makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Important Disclaimer:</strong> All calculations provided by EMI Tools Calculator are for educational and informational purposes only. The results are estimates and approximations based on the information you provide.
            </p>
            <p className="text-gray-700">
              Actual EMI may vary significantly based on:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
              <li>Bank policies and processing fees</li>
              <li>Current and future interest rates</li>
              <li>Loan agreement terms and conditions</li>
              <li>Regulatory changes and tax implications</li>
              <li>Individual creditworthiness and eligibility</li>
            </ul>
          </section>

          {/* Limitations of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations of Liability</h2>
            <p className="text-gray-700">
              In no event shall EMI Tools Calculator or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EMI Tools Calculator, even if EMI Tools Calculator or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-700">
              The materials appearing on EMI Tools Calculator could include technical, typographical, or photographic errors. EMI Tools Calculator does not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.
            </p>
          </section>

          {/* Links */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
            <p className="text-gray-700">
              EMI Tools Calculator has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EMI Tools Calculator of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>
          </section>

          {/* Modifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
            <p className="text-gray-700">
              EMI Tools Calculator may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-700">
              The materials on EMI Tools Calculator are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          {/* User Obligations */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Obligations</h2>
            <p className="text-gray-700 mb-4">You agree that you will not:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Harass, threaten, defame, or abuse any person or entity</li>
              <li>Post hateful, obscene, threatening, or abusive content</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on any intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools or scripts to scrape our website</li>
            </ul>
          </section>

          {/* Intellectual Property Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property Rights</h2>
            <p className="text-gray-700">
              All content on EMI Tools Calculator, including text, graphics, logos, images, and software, is the property of EMI Tools Calculator or its suppliers and is protected by international copyright laws. Any unauthorized use of the content is prohibited.
            </p>
          </section>

          {/* Advertisements and Google AdSense */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Advertisements and Google AdSense</h2>
            <p className="text-gray-700 mb-4">
              EMI Tools Calculator displays advertisements through Google AdSense and other advertising partners. These third parties may use cookies and other tracking technologies to serve advertisements based on your interests.
            </p>
            <p className="text-gray-700">
              We are not responsible for the content, accuracy, or practices of advertisements displayed on our website. Please review the privacy policies of these advertising partners for more information about their data practices.
            </p>
          </section>

          {/* Third-Party Content */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Content</h2>
            <p className="text-gray-700">
              We may link to third-party websites and services. We are not responsible for the content, accuracy, or practices of these third parties. Your use of third-party websites is governed by their terms and conditions.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-700">
              EMI Tools Calculator may terminate your access to our website at any time without notice if you violate these terms and conditions or any applicable laws.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700">
              If any provision of these terms and conditions is found to be invalid or unenforceable, that provision shall be severed and the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
            <p className="text-gray-700">
              These terms and conditions constitute the entire agreement between you and EMI Tools Calculator regarding your use of our website and supersede any prior agreements or understandings.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:help.apniwebsite@gmail.com" className="text-blue-600 hover:text-blue-800">help.apniwebsite@gmail.com</a>
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> <Link href="/" className="text-blue-600 hover:text-blue-800">EMI Tools Calculator</Link>
              </p>
            </div>
          </section>
        </div>

          <div className="mt-12 border-t border-gray-200 pt-8 mb-12">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
