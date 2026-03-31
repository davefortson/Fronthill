import { Hero } from '@/components/landing/Hero';
import { Challenge } from '@/components/landing/Challenge';
import { Platform } from '@/components/landing/Platform';
import { Approach } from '@/components/landing/Approach';
import { DurableValue } from '@/components/landing/DurableValue';
import { EnterCTA } from '@/components/landing/EnterCTA';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Hero />
      <Challenge />
      <Platform />
      <Approach />
      <DurableValue />
      <EnterCTA />

      {/* Footer */}
      <footer
        style={{
          background: '#1C1A14',
          borderTop: '1px solid #2D2B1F',
          padding: '32px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: '#4E8A1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            🌱
          </div>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono), monospace',
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#6B6550',
            }}
          >
            Fronthill Intelligence Platform
          </span>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link
            href="/dashboard"
            style={{
              fontSize: 13,
              color: '#8A8470',
              textDecoration: 'none',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Dashboard →
          </Link>
          <span
            style={{
              fontSize: 12,
              color: '#4A4630',
              fontFamily: 'var(--font-geist-mono), monospace',
            }}
          >
            © 2026 Fronthill
          </span>
        </div>
      </footer>
    </main>
  );
}
