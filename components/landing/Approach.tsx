const REGEN10_DIMENSIONS = [
  'Soil Health', 'Biodiversity', 'Water Cycle',
  'Carbon Sequestration', 'Farmer Wellbeing', 'Animal Welfare',
  'Community Vitality', 'Supply Chain Integrity', 'Economic Resilience', 'Energy & Climate',
  'Ecosystem Services', 'Land Stewardship',
];

export function Approach() {
  return (
    <section
      style={{
        background: '#F5F2EA',
        padding: 'clamp(80px, 12vw, 140px) 32px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '64px 80px',
            alignItems: 'start',
          }}
        >
          {/* Left: explanation */}
          <div>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#4E8A1A',
                fontFamily: 'var(--font-geist-mono), monospace',
                marginBottom: 24,
              }}
            >
              Our approach
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontWeight: 600,
                color: '#1C1A14',
                lineHeight: 1.25,
                marginBottom: 24,
              }}
            >
              Grounded in the Regen10 Outcomes Framework
            </h2>
            <p
              style={{
                fontSize: 16,
                color: '#2D2B1F',
                lineHeight: 1.75,
                marginBottom: 24,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              The Regen10 framework is a globally recognised standard for measuring
              outcomes across twelve interconnected dimensions of ecological and social
              health. Every metric, score, and AI interpretation in Fronthill Intelligence
              is grounded in this framework.
            </p>
            <p
              style={{
                fontSize: 16,
                color: '#2D2B1F',
                lineHeight: 1.75,
                marginBottom: 32,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              This means your portfolio language aligns with how the field is evolving —
              and your LP reporting speaks a shared vocabulary that stands up to scrutiny.
            </p>

            <blockquote
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 18,
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#4A4630',
                borderLeft: '3px solid #4E8A1A',
                paddingLeft: 20,
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              "Impact metrics should emerge from the land, not from a spreadsheet."
            </blockquote>
          </div>

          {/* Right: Regen10 grid */}
          <div>
            <p
              style={{
                fontSize: 12,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A8470',
                fontFamily: 'var(--font-geist-mono), monospace',
                marginBottom: 20,
              }}
            >
              12 dimensions tracked
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 10,
              }}
            >
              {REGEN10_DIMENSIONS.map((dim, i) => (
                <div
                  key={dim}
                  style={{
                    background: '#ffffff',
                    borderRadius: 6,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    border: '1px solid #E7E1D0',
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#EAF3DE',
                      border: '1px solid #8EC050',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: '#4E8A1A',
                      fontFamily: 'var(--font-geist-mono), monospace',
                      flexShrink: 0,
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: '#2D2B1F',
                      lineHeight: 1.3,
                      fontFamily: 'system-ui, sans-serif',
                    }}
                  >
                    {dim}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
