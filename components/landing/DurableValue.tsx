const VALUE_PILLARS = [
  {
    number: '01',
    headline: 'Compounding data',
    body:
      'Every monitoring event, site visit, and ecological score is ingested and retained. The platform\'s intelligence compounds over time — the longer you use it, the sharper the picture.',
    accent: '#4E8A1A',
  },
  {
    number: '02',
    headline: 'Thesis-native AI',
    body:
      'The AI assistant is trained on your fund\'s thesis, your properties, and the Regen10 framework. It speaks your language — not generic finance or generic agriculture.',
    accent: '#185FA5',
  },
  {
    number: '03',
    headline: 'Investor-ready at all times',
    body:
      'LP updates that used to take days to compile are generated in minutes. The platform is always current, so your narrative is always grounded in what\'s actually happening on the land.',
    accent: '#8B5E3C',
  },
];

export function DurableValue() {
  return (
    <section
      style={{
        background: '#ffffff',
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
              color: '#4E8A1A',
              fontFamily: 'var(--font-geist-mono), monospace',
              marginBottom: 20,
            }}
          >
            Durable value
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: 600,
              color: '#1C1A14',
              lineHeight: 1.22,
              maxWidth: 580,
            }}
          >
            Built to compound — not to expire.
          </h2>
        </div>

        {/* Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
          }}
        >
          {VALUE_PILLARS.map((pillar) => (
            <div key={pillar.number}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontSize: 11,
                    color: '#C8C2B0',
                    letterSpacing: '0.1em',
                  }}
                >
                  {pillar.number}
                </span>
                <div
                  style={{
                    height: 1,
                    flex: 1,
                    background: pillar.accent,
                    opacity: 0.35,
                  }}
                />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#1C1A14',
                  marginBottom: 14,
                  lineHeight: 1.3,
                }}
              >
                {pillar.headline}
              </h3>

              <p
                style={{
                  fontSize: 15,
                  color: '#4A4630',
                  lineHeight: 1.75,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
