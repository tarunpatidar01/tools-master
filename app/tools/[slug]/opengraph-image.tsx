import { ImageResponse } from 'next/og';
import { getAllTools, getToolBySlug } from '@/lib/seo';

export const alt = 'Free online calculator on EMI Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export default async function ToolOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const heading = tool?.content?.h1 || tool?.keyword || 'EMI Calculator';
  const subheading = tool?.content?.h2 || 'Free online calculator';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.85, letterSpacing: 2 }}>EMI TOOLS</div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, lineHeight: 1.12, marginTop: 20 }}>
          {heading}
        </div>
        <div style={{ display: 'flex', fontSize: 34, opacity: 0.9, marginTop: 24, lineHeight: 1.3 }}>
          {subheading}
        </div>
        <div style={{ display: 'flex', fontSize: 26, opacity: 0.8, marginTop: 40 }}>
          Free · Instant results · No signup
        </div>
      </div>
    ),
    size
  );
}
