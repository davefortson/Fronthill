import Link from 'next/link';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? '';
const MAP_BG = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-95,42,6,0/1400x600@2x?access_token=${MAPBOX_TOKEN}`
  : null;

export function EnterCTA() {
  return (
    <section
      style={{
        position: 'relative',
        background: '#1C1A14',
        padding: 'clamp(100px, 14vw, 160px) 32px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Satellite bg */}
      {MAP_BG && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${MAP_BG}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
      )}

      {/* Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(28,26,20,0.4) 0%, rgba(28,26,20,0.85) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 680,
        }}
      >
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
          The platform is live
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            fontWeight: 600,
            color: '#FAFAF6',
            lineHeight: 1.18,
            marginBottom: 24,
          }}
        >
          Your portfolio is already
          <br />
          inside. Ready when you are.
        </h2>

        <p
          style={{
            fontSize: 17,
            color: '#A9A390',
            lineHeight: 1.65,
            marginBottom: 44,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Explore the ecological, pipeline, and investor views. Ask the AI anything.
          The platform will grow with every data point you add.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: '#4E8A1A',
            color: '#ffffff',
            padding: '16px 40px',
            borderRadius: 6,
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
        >
          Enter Fronthill Intelligence →
        </Link>
      </div>
    </section>
  );
}
