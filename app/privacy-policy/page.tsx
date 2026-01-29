'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-blue-100">Last updated: January 2026</p>
            </div>
          </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              EMI Tools Calculator ("Company," "we," "us," or "our") operates the website and mobile application. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-700">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services. By accessing and using EMI Tools Calculator, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect personal information that you voluntarily provide, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Name and email address (if you contact us)</li>
              <li>Phone number (if provided voluntarily)</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">
              When you visit our website, we automatically collect certain information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on each page</li>
              <li>Referral source and search terms used</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Calculator Data</h3>
            <p className="text-gray-700">
              The loan amounts, interest rates, and tenure values you enter in our calculators are not stored on our servers unless you explicitly save or download them. These calculations are performed locally in your browser.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your inquiries and customer service requests</li>
              <li>Send administrative information and updates</li>
              <li>Analyze usage patterns and optimize our website</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
              <li>Display relevant advertisements through Google AdSense</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us remember your preferences and track your activity.
            </p>
            <p className="text-gray-700 mb-4">
              Third-party services, including Google AdSense and Google Analytics, may use cookies to serve advertisements based on your previous visits to our website and other websites.
            </p>
            <p className="text-gray-700">
              You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              Our website uses third-party services that may collect information about you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Google AdSense:</strong> Displays personalized advertisements</li>
              <li><strong>Google Analytics:</strong> Analyzes website traffic and user behavior</li>
              <li><strong>Next.js:</strong> Web application framework and hosting</li>
            </ul>
            <p className="text-gray-700 mt-4">
              These services have their own privacy policies. We encourage you to review their privacy policies as we are not responsible for their practices.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure.
            </p>
            <p className="text-gray-700">
              We cannot guarantee absolute security of your information. You use our services at your own risk and are responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700">
              We retain personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. Automatically collected information such as cookies and analytics data are typically retained for up to 24 months unless extended by law.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to request deletion of your data</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise any of these rights, please contact us at the contact information provided at the end of this policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              EMI Tools Calculator is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information promptly.
            </p>
          </section>

          {/* Updates to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Updates to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of our services after any modifications indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:help.apniwebsite@gmail.com" className="text-blue-600 hover:text-blue-800">help.apniwebsite@gmail.com</a>
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> <a href="/" className="text-blue-600 hover:text-blue-800">EMI Tools Calculator</a>
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
