'use client';

import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface TourTooltipProps {
  title: string;
  body: string;
  step: number;
  totalSteps: number;
  position: 'center' | 'right' | 'left' | 'bottom' | 'top';
  targetRect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const TOOLTIP_WIDTH = 320;
const TOOLTIP_OFFSET = 16;

function computeTooltipStyle(
  position: TourTooltipProps['position'],
  rect: DOMRect | null
): React.CSSProperties {
  if (!rect || position === 'center') {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const padding = 12; // spotlight padding
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top: number;
  let left: number;

  switch (position) {
    case 'right':
      top = rect.top + padding + rect.height / 2;
      left = rect.right + padding + TOOLTIP_OFFSET;
      // Clamp horizontal
      if (left + TOOLTIP_WIDTH > vw - 16) left = rect.left - padding - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      break;
    case 'left':
      top = rect.top + padding + rect.height / 2;
      left = rect.left - padding - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      if (left < 16) left = rect.right + padding + TOOLTIP_OFFSET;
      break;
    case 'bottom':
      top = rect.bottom + padding + TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      if (top + 200 > vh - 16) top = rect.top - padding - 200 - TOOLTIP_OFFSET;
      break;
    case 'top':
    default:
      top = rect.top - padding - 200 - TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      if (top < 16) top = rect.bottom + padding + TOOLTIP_OFFSET;
      break;
  }

  // Clamp to viewport
  left = Math.max(16, Math.min(left, vw - TOOLTIP_WIDTH - 16));
  top = Math.max(16, top);

  return {
    position: 'fixed',
    top,
    left,
    transform: 'none',
  };
}

export function TourTooltip({
  title,
  body,
  step,
  totalSteps,
  position,
  targetRect,
  onNext,
  onPrev,
  onClose,
  ctaLabel,
  onCtaClick,
}: TourTooltipProps) {
  const style = computeTooltipStyle(position, targetRect);
  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  return (
    <div
      style={{
        ...style,
        width: TOOLTIP_WIDTH,
        zIndex: 10001,
        background: '#ffffff',
        borderLeft: '3px solid #4E8A1A',
        borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '20px 20px 16px',
        pointerEvents: 'auto',
      }}
    >
      {/* Step indicator + close */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{
          fontSize: 11,
          fontFamily: 'var(--font-geist-mono), monospace',
          color: '#8A8470',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {step + 1} / {totalSteps}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: '#A9A390',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Close tour"
        >
          <X size={14} />
        </button>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 16,
        fontFamily: '"Playfair Display", Georgia, serif',
        fontWeight: 600,
        color: '#1C1A14',
        marginBottom: 8,
        lineHeight: 1.3,
      }}>
        {title}
      </h3>

      {/* Body */}
      <p style={{
        fontSize: 14,
        fontFamily: 'system-ui, sans-serif',
        color: '#4A4630',
        lineHeight: 1.6,
        marginBottom: 16,
      }}>
        {body}
      </p>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onPrev}
          disabled={isFirst}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: isFirst ? '#C8C2B0' : '#6B6550',
            background: 'none',
            border: 'none',
            cursor: isFirst ? 'default' : 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
          }}
        >
          <ChevronLeft size={14} />
          Back
        </button>

        {ctaLabel && onCtaClick ? (
          <button
            onClick={onCtaClick}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#4E8A1A',
              background: 'none',
              border: '1px solid #4E8A1A',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 4,
            }}
          >
            {ctaLabel}
          </button>
        ) : (
          <button
            onClick={onNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: '#ffffff',
              background: '#4E8A1A',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 4,
            }}
          >
            {isLast ? 'Finish' : 'Next'}
            {!isLast && <ChevronRight size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
