import { Analytics } from '@vercel/analytics/next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getToolBySlug } from '@/lib/seo';
import ToolPageClient from './ToolPageClient';

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading calculator...</div>}>
      <ToolPageClient tool={tool} key={slug} />
    </Suspense>
  );
}
