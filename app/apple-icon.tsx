import { ImageResponse } from 'next/og';

// public/apple-touch-icon.png was a 1x1 placeholder, so iOS home-screen installs
// got a blank tile. Generated at build time instead, same as the OG images.
// Drawn with plain boxes rather than text: ImageResponse has to fetch a font for
// any non-Latin glyph (the rupee sign included), which fails in offline builds.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const key = (extra: Record<string, string | number> = {}) => ({
  background: '#ffffff',
  borderRadius: 6,
  ...extra,
});

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: 'linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)',
        }}
      >
        {/* display bar */}
        <div style={key({ width: 104, height: 30, opacity: 0.95 })} />
        {/* keypad */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={key({ width: 47, height: 22 })} />
          <div style={key({ width: 47, height: 22 })} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={key({ width: 47, height: 22 })} />
          <div style={key({ width: 47, height: 22 })} />
        </div>
      </div>
    ),
    size
  );
}
