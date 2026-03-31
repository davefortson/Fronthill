export function Challenge() {
  return (
    <section
      style={{
        background: '#FAFAF6',
        padding: 'clamp(80px, 12vw, 140px) 32px',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Section label */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#4E8A1A',
            fontFamily: 'var(--font-geist-mono), monospace',
            marginBottom: 48,
          }}
        >
          The challenge
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px 80px',
            alignItems: 'start',
          }}
        >
          {/* Pull quote */}
          <div>
            <blockquote
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 400,
                color: '#1C1A14',
                lineHeight: 1.4,
                borderLeft: '3px solid #4E8A1A',
                paddingLeft: 24,
                margin: 0,
              }}
            >
              "I have ecological data in three places, deal flow in a spreadsheet, and
              investor context in my head. None of it talks to each other."
            </blockquote>
            <p
              style={{
                marginTop: 20,
                fontSize: 13,
                color: '#8A8470',
                paddingLeft: 27,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              — James Cutler, Fronthill
            </p>
          </div>

          {/* Body */}
          <div>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: '#2D2B1F',
                marginBottom: 28,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Regenerative agriculture investing requires holding more complexity than
              conventional fund management. You need to track ecological outcomes across
              diverse geographies, evaluate deals against both financial and impact
              criteria, and tell a coherent story to LPs who care about both.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Ecological data is siloed in monitoring platforms, not connected to deal logic',
                'Impact reporting takes days to compile — and is outdated before it ships',
                'LP conversations happen without real-time portfolio intelligence at hand',
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    fontSize: 15,
                    color: '#4A4630',
                    lineHeight: 1.55,
                    fontFamily: 'system-ui, sans-serif',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#EAF3DE',
                      border: '1.5px solid #8EC050',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 2,
                      fontSize: 11,
                      color: '#4E8A1A',
                      fontFamily: 'var(--font-geist-mono), monospace',
                    }}
                  >
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
