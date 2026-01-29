'use client';

import React, { useMemo } from 'react';

interface AdsenseSlotProps {
  slotId: string;
  format?: 'horizontal' | 'vertical' | 'square' | 'leaderboard';
  responsive?: boolean;
}

export default function AdsenseSlot({ slotId, format = 'horizontal', responsive = true }: AdsenseSlotProps) {
  const adStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      textAlign: 'center' as const,
      margin: '20px 0',
    };

    const formatStyles = {
      horizontal: { minHeight: '90px' },
      vertical: { maxWidth: '300px', height: '600px' },
      square: { maxWidth: '300px', height: '300px' },
      leaderboard: { maxWidth: '728px', height: '90px' },
    };

    return { ...baseStyle, ...formatStyles[format] };
  }, [format]);

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.log('AdSense not ready');
    }
  }, []);

  return (
    <div style={adStyle} className="border border-gray-300 rounded bg-gray-100 flex items-center justify-center">
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', ...adStyle }}
        data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={slotId}
        data-ad-format={responsive ? 'auto' : format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
