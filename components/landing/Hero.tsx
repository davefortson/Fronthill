import Link from 'next/link';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const MAP_BG = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-93.5,41.5,5,0/1400x700@2x?access_token=${MAPBOX_TOKEN}`
  : null;

export function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#1C1A14',
      }}
    >
      {/* Satellite background */}
      {MAP_BG && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${MAP_BG}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.55,
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(28,26,20,0.3) 0%, rgba(28,26,20,0.6) 60%, rgba(28,26,20,0.9) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 780,
          padding: '0 32px',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#8EC050',
            fontFamily: 'var(--font-geist-mono), monospace',
            marginBottom: 24,
          }}
        >
          Fronthill Intelligence Platform
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(42px, 6vw, 72px)',
            fontWeight: 600,
            color: '#FAFAF6',
            lineHeight: 1.12,
            marginBottom: 28,
            letterSpacing: '-0.01em',
          }}
        >
          The intelligence layer
          <br />
          regenerative agriculture
          <br />
          has been waiting for.
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#C8C2B0',
            lineHeight: 1.65,
            maxWidth: 560,
            margin: '0 auto 40px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Built for James Cutler and the Fronthill team — a living dashboard that turns
          ecological signals, deal flow, and LP relationships into one coherent picture.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#4E8A1A',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: 6,
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            transition: 'background 150ms',
          }}
        >
          Enter the platform →
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: '#6B6550',
          fontSize: 11,
          letterSpacing: '0.1em',
          fontFamily: 'var(--font-geist-mono), monospace',
        }}
      >
        <span style={{ textTransform: 'uppercase' }}>Scroll</span>
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, #4E8A1A, transparent)',
          }}
        />
      </div>
    </section>
  );
}
