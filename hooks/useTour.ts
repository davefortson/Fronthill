'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function useTour() {
  const {
    tourActive,
    currentStep,
    tourCompleted,
    setTourCompleted,
    startTour,
    nextStep,
    prevStep,
    endTour,
  } = useAppStore();

  // On mount, read localStorage to set tourCompleted state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('fronthill_tour_completed') === 'true';
      if (completed) {
        setTourCompleted(true);
      }
    }
  }, [setTourCompleted]);

  // Auto-start on first visit (after 1.5s delay)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem('fronthill_tour_completed') === 'true';
      if (!completed) {
        const timer = setTimeout(() => startTour(), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    tourActive,
    currentStep,
    tourCompleted,
    startTour,
    nextStep,
    prevStep,
    endTour,
  };
}
