import { create } from 'zustand';
import type { RegionData, DashboardTab, MapOverlay, PipelineProject } from '@/lib/types';
import { MOCK_UPPER_MIDWEST } from '@/lib/data/mock';

interface AppState {
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

export const useAppStore = create<AppState>((set) => ({
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
