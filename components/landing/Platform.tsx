const MODULES = [
  {
    icon: '🌱',
    label: 'Ecological',
    headline: 'Living ecological intelligence',
    description:
      'Real-time soil carbon, biodiversity, water quality, and climate resilience scores — mapped against the Regen10 framework — across every property in the portfolio.',
    accent: '#4E8A1A',
    bg: '#EAF3DE',
  },
  {
    icon: '📋',
    label: 'Pipeline',
    headline: 'Deal flow meets impact scoring',
    description:
      'Track prospective investments from sourcing through close. Each deal shows ecological potential alongside financial metrics — so impact and returns are evaluated together.',
    accent: '#185FA5',
    bg: '#E8F0FC',
  },
  {
    icon: '🤝',
    label: 'Investors',
    headline: 'LP relationships in context',
    description:
      'Your investor network aligned to portfolio outcomes. Track commitments, impact priorities, and communication cadence — so every LP conversation is backed by current data.',
    accent: '#8B5E3C',
    bg: '#F5EDE4',
  },
];

export function Platform() {
  return (
    <section
      style={{
        background: '#1C1A14',
        padding: 'clamp(80px, 12vw, 140px) 32px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8EC050',
              fontFamily: 'var(--font-geist-mono), monospace',
              marginBottom: 20,
            }}
          >
            What we built
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 600,
              color: '#FAFAF6',
              lineHeight: 1.2,
              maxWidth: 640,
              marginBottom: 20,
            }}
          >
            Three modules. One intelligence layer.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: '#8A8470',
              lineHeight: 1.65,
              maxWidth: 540,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Each module is a standalone view. Together they form a coherent portfolio
            picture — updated continuously by AI that understands your thesis.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {MODULES.map((mod) => (
            <div
              key={mod.label}
              style={{
                background: '#2D2B1F',
                borderRadius: 12,
                padding: '32px 28px',
                borderTop: `3px solid ${mod.accent}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: mod.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 20,
                }}
              >
                {mod.icon}
              </div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: mod.accent === '#4E8A1A' ? '#8EC050' : mod.accent === '#185FA5' ? '#3A8ADA' : '#A67448',
                  fontFamily: 'var(--font-geist-mono), monospace',
                  marginBottom: 10,
                }}
              >
                {mod.label}
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#FAFAF6',
                  marginBottom: 12,
                  lineHeight: 1.3,
                }}
              >
                {mod.headline}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: '#A9A390',
                  lineHeight: 1.65,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {mod.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
