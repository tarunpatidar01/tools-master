import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-tools-master.vercel.app';

// app/contact/page.tsx is a client component (it owns the contact form state),
// so its metadata has to be declared here.
export const metadata: Metadata = {
  title: 'Contact EMI Tools — Questions, Corrections & Feedback',
  description:
    'Get in touch with the EMI Tools team about calculator accuracy, a missing tool, a data correction, or a partnership.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact EMI Tools',
    description: 'Questions, corrections and feedback about our free financial calculators.',
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
