import { create } from 'zustand';
import type { RegionData, DashboardTab, MapOverlay, PipelineProject } from '@/lib/types';
import { MOCK_UPPER_MIDWEST } from '@/lib/data/mock';

interface AppState {
  // Tour
  tourActive: boolean;
  currentStep: number;
  tourCompleted: boolean;
  setTourActive: (active: boolean) => void;
  setCurrentStep: (step: number) => void;
  setTourCompleted: (completed: boolean) => void;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;

  // Dashboard
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;

  // Map
  activeOverlays: MapOverlay[];
  toggleOverlay: (overlay: MapOverlay) => void;

  // Region
  selectedRegion: RegionData | null;
  setSelectedRegion: (region: RegionData | null) => void;
  drawnPolygon: GeoJSON.Feature | null;
  setDrawnPolygon: (polygon: GeoJSON.Feature | null) => void;

  // Pipeline
  selectedProject: PipelineProject | null;
  setSelectedProject: (project: PipelineProject | null) => void;

  // Chat
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatContext: string;
  setChatContext: (context: string) => void;

  // Scenario
  isModelingScenario: boolean;
  setIsModelingScenario: (v: boolean) => void;

  // Quick demo: load a preset region
  loadPresetRegion: (region: RegionData) => void;
}

const TOUR_TOTAL_STEPS = 7;

export const useAppStore = create<AppState>((set, get) => ({
  // Tour
  tourActive: false,
  currentStep: 0,
  tourCompleted: false,
  setTourActive: (active) => set({ tourActive: active }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setTourCompleted: (completed) => set({ tourCompleted: completed }),
  startTour: () => set({ tourActive: true, currentStep: 0 }),
  nextStep: () => {
    const { currentStep } = get();
    const next = currentStep + 1;
    if (next >= TOUR_TOTAL_STEPS) {
      set({ tourActive: false, tourCompleted: true, currentStep: 0 });
      if (typeof window !== 'undefined') {
        localStorage.setItem('fronthill_tour_completed', 'true');
      }
    } else {
      set({ currentStep: next });
    }
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },
  endTour: () => {
    set({ tourActive: false, tourCompleted: true, currentStep: 0 });
    if (typeof window !== 'undefined') {
      localStorage.setItem('fronthill_tour_completed', 'true');
    }
  },

  // Dashboard
  activeTab: 'ecological',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeOverlays: ['cropland'],
  toggleOverlay: (overlay) =>
    set((state) => ({
      activeOverlays: state.activeOverlays.includes(overlay)
        ? state.activeOverlays.filter((o) => o !== overlay)
        : [...state.activeOverlays, overlay],
    })),

  selectedRegion: null,
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  drawnPolygon: null,
  setDrawnPolygon: (polygon) => set({ drawnPolygon: polygon }),

  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),

  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  chatContext: '',
  setChatContext: (context) => set({ chatContext: context }),

  isModelingScenario: false,
  setIsModelingScenario: (v) => set({ isModelingScenario: v }),

  loadPresetRegion: (region) => set({ selectedRegion: region }),
}));
