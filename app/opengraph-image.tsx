import { ImageResponse } from 'next/og';
import { getAllTools } from '@/lib/seo';

export const alt = 'EMI Tools — free EMI, loan, tax and investment calculators';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const toolCount = getAllTools().length;

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
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, lineHeight: 1.1, marginTop: 20 }}>
          Loan, tax &amp; investment calculators
        </div>
        <div style={{ display: 'flex', fontSize: 34, opacity: 0.9, marginTop: 28 }}>
          {`${toolCount}+ free tools · Instant results · No signup`}
        </div>
      </div>
    ),
    size
  );
}
