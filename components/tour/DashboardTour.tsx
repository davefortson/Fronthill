'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TourSpotlight } from './TourSpotlight';
import { TourTooltip } from './TourTooltip';
import { useTour } from '@/hooks/useTour';

interface TourStep {
  id: number;
  targetSelector: string | null;
  position: 'center' | 'right' | 'left' | 'bottom' | 'top';
  title: string;
  body: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 0,
    targetSelector: null,
    position: 'center',
    title: 'Welcome to Fronthill Intelligence',
    body: 'This platform gives you a living, AI-powered view of your regenerative agriculture portfolio — across ecology, deals, and capital. Let\'s take a quick tour.',
  },
  {
    id: 1,
    targetSelector: '[data-tour="tab-ecological"]',
    position: 'bottom',
    title: 'Ecological Intelligence',
    body: 'Real-time ecological monitoring across your land holdings. Track soil carbon, biodiversity scores, water quality, and climate resilience — scored against the Regen10 framework.',
  },
  {
    id: 2,
    targetSelector: '[data-tour="map-panel"]',
    position: 'right',
    title: 'Interactive Land Map',
    body: 'Explore your properties on a satellite base map. Draw polygons to define regions of interest, toggle overlays for cropland, carbon sequestration potential, and watershed boundaries.',
  },
  {
    id: 3,
    targetSelector: '[data-tour="tab-pipeline"]',
    position: 'bottom',
    title: 'Deal Pipeline',
    body: 'Track prospective investments from sourcing through due diligence to close. Each project shows ecological scores alongside financial metrics so you can assess impact and returns together.',
  },
  {
    id: 4,
    targetSelector: '[data-tour="tab-investors"]',
    position: 'bottom',
    title: 'Investor Relations',
    body: 'Your LP network at a glance. Track commitments, impact alignment scores, and communication cadence. See which investors are most aligned with each ecological outcome.',
  },
  {
    id: 5,
    targetSelector: '[data-tour="chat-fab"]',
    position: 'left',
    title: 'RegenAI Assistant',
    body: 'Ask anything about your portfolio in plain language. "What\'s the carbon trajectory of the Iowa properties?" or "Which pipeline deals score highest on water quality?" — context-aware answers in seconds.',
  },
  {
    id: 6,
    targetSelector: null,
    position: 'center',
    title: 'You\'re ready',
    body: 'Fronthill Intelligence updates as new data arrives. You can re-launch this tour anytime from the header. Explore at your own pace — and let the AI assistant guide you deeper.',
  },
];

export function DashboardTour() {
  const { tourActive, currentStep, startTour, nextStep, prevStep, endTour } = useTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateTargetRect = useCallback(() => {
    const step = TOUR_STEPS[currentStep];
    if (!step || !step.targetSelector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    if (!tourActive) return;
    updateTargetRect();

    // Re-measure on resize / scroll
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [tourActive, currentStep, updateTargetRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!tourActive) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
      if (e.key === 'Escape') endTour();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tourActive, nextStep, prevStep, endTour]);

  if (!mounted || !tourActive) return null;

  const step = TOUR_STEPS[currentStep];
  if (!step) return null;

  return createPortal(
    <>
      <TourSpotlight targetRect={targetRect} onClose={endTour} />
      <TourTooltip
        title={step.title}
        body={step.body}
        step={currentStep}
        totalSteps={TOUR_STEPS.length}
        position={step.position}
        targetRect={targetRect}
        onNext={nextStep}
        onPrev={prevStep}
        onClose={endTour}
        ctaLabel={step.ctaLabel}
        onCtaClick={step.onCtaClick}
      />
    </>,
    document.body
  );
}
