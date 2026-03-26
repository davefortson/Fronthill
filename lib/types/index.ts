// Region and map types
export interface RegionBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface RegionData {
  label: string;
  bounds?: RegionBounds;
  areaAcres: number;
  state?: string;
  crops: Record<string, number>;
  watershedQuality: { good: number; impaired: number; unknown: number };
  soilOM: number;
  precipAnomaly: number;
  nitrogenLoading: number;
  regenPracticeAdoption: number;
}

export interface CropAcreageData {
  commodity: string;
  acres: number;
  year: number;
  state?: string;
  county?: string;
}

export interface WatershedQuality {
  huc8Code: string;
  name: string;
  status: 'Good' | 'Impaired' | 'Unknown';
  causes?: string[];
}

// Scenario types
export interface ScenarioRequest {
  region: {
    bounds: [number, number, number, number];
    areaAcres: number;
    state?: string;
    description?: string;
  };
  currentMetrics: {
    cropAcreage: Record<string, number>;
    watershedQuality: { good: number; impaired: number; unknown: number };
    soilOM: number;
    precipAnomaly: number;
  };
  intervention: {
    type: 'cover_crop' | 'no_till' | 'riparian_buffer' | 'wetland_restoration' | 'custom';
    customDescription?: string;
    targetAcres: number;
  };
}

export interface ScenarioResponse {
  summary: string;
  predictions: {
    soilOMChange: { value: number; unit: string; confidence: 'high' | 'medium' | 'low'; timeframe: string };
    waterQualityChange: { value: number; unit: string; confidence: string; timeframe: string };
    carbonSeq: { value: number; unit: string; confidence: string };
    nitrogenReduction: { value: number; unit: string; confidence: string };
  };
  assumptions: string[];
  comparableProjects: { name: string; outcome: string; source: string }[];
  investmentImplication: string;
  dataGaps: string[];
}

// Pipeline types
export interface PipelineProject {
  id: string;
  name: string;
  type: 'Farm' | 'Fund' | 'Input company' | 'Infrastructure';
  state: string;
  stage: 'Screening' | 'Due diligence' | 'Term sheet' | 'Portfolio';
  impactScore: number;
  lastUpdated: string;
  revenue?: number[];
  description?: string;
}

// Investor types
export interface Investor {
  id: string;
  name: string;
  initials: string;
  focusAreas: string[];
  geography: string[];
  annualDeployment: number;
  stagePreference: string[];
  connectionStrength: 'warm' | 'cold' | 'new';
  lastContact: string;
}

// Regen 10 Outcomes
export interface RegenOutcome {
  id: string;
  name: string;
  category: string;
  unit: string;
  direction: 'higher_is_better' | 'lower_is_better' | 'stable_is_better';
  data_source: string;
  api_available?: boolean;
}

export interface RegenOutcomes {
  farm_level_outcomes: RegenOutcome[];
  landscape_level_outcomes: RegenOutcome[];
}

// Map overlay types
export type MapOverlay = 'cropland' | 'water_quality' | 'precipitation' | 'soil_health';

// Dashboard tab types
export type DashboardTab = 'ecological' | 'pipeline' | 'investors';
