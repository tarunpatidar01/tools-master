'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send message');
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
              <p className="text-blue-100">We'd love to hear from you. Get in touch with our team.</p>
            </div>
          </div>

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Email */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">📧 Email</h3>
                <p className="text-gray-700">
                  For all inquiries:
                </p>
                <a href="mailto:help.apniwebsite@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
                  help.apniwebsite@gmail.com
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  We typically respond within 24 business hours.
                </p>
              </div>

              {/* Hours */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">⏰ Response Time</h3>
                <div className="text-gray-700 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                  <p>Saturday - Sunday: Email support only</p>
                  <p className="text-gray-600 text-sm mt-2">
                    We process all inquiries in order of receipt.
                  </p>
                </div>
              </div>

              {/* Website */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">🌐 Website</h3>
                <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-lg">
                  www.emitools.com
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  Visit our website to access all our financial calculators.
                </p>
              </div>

              {/* Additional Help */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <h4 className="font-bold text-gray-900 mb-2">💡 Need Help?</h4>
                <p className="text-gray-700 text-sm">
                  Check out our FAQ section on the home page for answers to common questions about our calculators.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-green-900 mb-1">✓ Message Sent Successfully!</h4>
                <p className="text-green-800 text-sm">
                  Thank you for contacting us. We'll get back to you shortly at {formData.email}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-red-900 mb-1">✗ Error</h4>
                <p className="text-red-800 text-sm">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Partnership">Partnership Opportunity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                  placeholder="Please share your message, feedback, or inquiry..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {/* Privacy Notice */}
              <p className="text-gray-600 text-xs">
                By submitting this form, you agree to our <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>. We'll only use your information to respond to your inquiry.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">How accurate are your calculations?</h3>
              <p className="text-gray-700 text-sm">
                Our calculations use industry-standard formulas and are highly accurate. However, actual EMI may vary based on bank policies and specific loan terms.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is there a mobile app available?</h3>
              <p className="text-gray-700 text-sm">
                Our website is fully responsive and works seamlessly on all mobile devices. No app download is required.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Do you store my calculation data?</h3>
              <p className="text-gray-700 text-sm">
                We don't store your calculation data on our servers. All calculations are performed locally on your device.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I export my calculations?</h3>
              <p className="text-gray-700 text-sm">
                Yes! You can download your calculations as PDF or Excel files and share them with pre-filled values.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Are there any hidden charges?</h3>
              <p className="text-gray-700 text-sm">
                No. All our calculators are completely free. There are no hidden charges or registration requirements.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">How do you use my personal data?</h3>
              <p className="text-gray-700 text-sm">
                We collect minimal data and use it only to improve our services. See our Privacy Policy for details.
              </p>
            </div>
          </div>
        </div>

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
