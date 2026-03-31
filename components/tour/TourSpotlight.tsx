'use client';

interface TourSpotlightProps {
  targetRect: DOMRect | null;
  onClose: () => void;
}

const SPOTLIGHT_PADDING = 12;
const BORDER_RADIUS = 8;

export function TourSpotlight({ targetRect, onClose }: TourSpotlightProps) {
  if (!targetRect) {
    // No target — just a semi-transparent full overlay
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 26, 20, 0.72)',
          zIndex: 9999,
          transition: 'background 200ms ease-out',
          pointerEvents: 'auto',
        }}
      />
    );
  }

  const x = targetRect.left - SPOTLIGHT_PADDING;
  const y = targetRect.top - SPOTLIGHT_PADDING;
  const w = targetRect.width + SPOTLIGHT_PADDING * 2;
  const h = targetRect.height + SPOTLIGHT_PADDING * 2;

  return (
    <>
      {/* Full-screen click-to-close overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
      />
      {/* Spotlight hole — absolutely positioned box with huge box-shadow */}
      <div
        style={{
          position: 'fixed',
          top: y,
          left: x,
          width: w,
          height: h,
          borderRadius: BORDER_RADIUS,
          boxShadow: '0 0 0 10000px rgba(28, 26, 20, 0.72)',
          zIndex: 10000,
          pointerEvents: 'none',
          transition: 'top 200ms ease-out, left 200ms ease-out, width 200ms ease-out, height 200ms ease-out',
        }}
      />
    </>
  );
}
