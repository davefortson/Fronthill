import type { RegionData, PipelineProject, Investor, Regen10Framework } from '@/lib/types';

// Regen10 framework dimensions with colors (inline for SSR/build compatibility)
export const REGEN10_DIMENSIONS = [
  { id: 'd01', name: 'Air & Climate', color: '#5B9BD5', api_available: true, data_source: 'NOAA CDO' },
  { id: 'd02', name: 'Biodiversity', color: '#70AD47', api_available: false, data_source: 'USGS GAP' },
  { id: 'd03', name: 'Soil', color: '#8B6914', api_available: true, data_source: 'USDA SSURGO' },
  { id: 'd04', name: 'Water', color: '#4472C4', api_available: true, data_source: 'EPA ATTAINS' },
  { id: 'd05', name: 'Livestock', color: '#C55A11', api_available: true, data_source: 'USDA NASS' },
  { id: 'd06', name: 'Crops & Pasture', color: '#548235', api_available: true, data_source: 'USDA NASS' },
  { id: 'd07', name: 'Community', color: '#BF8F00', api_available: true, data_source: 'USDA Ag Census' },
  { id: 'd08', name: 'Farmers & Workers', color: '#ED7D31', api_available: true, data_source: 'USDA NASS' },
  { id: 'd09', name: 'Governance', color: '#7030A0', api_available: false, data_source: 'Survey data' },
  { id: 'd10', name: 'Economics & Finance', color: '#2E75B6', api_available: true, data_source: 'USDA ERS' },
  { id: 'd11', name: 'Agricultural Inputs', color: '#FF6B6B', api_available: true, data_source: 'USDA NASS' },
  { id: 'd12', name: 'Infrastructure', color: '#A5A5A5', api_available: false, data_source: 'USDA Rural Development' },
] as const;

// ── Region Mock Data ──────────────────────────────────────────
export const MOCK_UPPER_MIDWEST: RegionData = {
  label: 'Upper Midwest — Corn Belt',
  areaAcres: 2_340_000,
  crops: { corn: 0.61, soy: 0.28, oats: 0.04, other: 0.07 },
  watershedQuality: { good: 31, impaired: 62, unknown: 7 },
  soilOM: 3.8,
  precipAnomaly: 12,
  nitrogenLoading: 14.2,
  regenPracticeAdoption: 0.18,
};

export const MOCK_NORTHERN_PLAINS: RegionData = {
  label: 'Northern Plains',
  areaAcres: 4_800_000,
  crops: { wheat: 0.38, soy: 0.22, corn: 0.19, sunflower: 0.11, other: 0.10 },
  watershedQuality: { good: 52, impaired: 38, unknown: 10 },
  soilOM: 4.6,
  precipAnomaly: -8,
  nitrogenLoading: 8.4,
  regenPracticeAdoption: 0.24,
};

export const MOCK_CENTRAL_VALLEY: RegionData = {
  label: 'California Central Valley',
  areaAcres: 890_000,
  crops: { almonds: 0.22, grapes: 0.18, pistachios: 0.14, tomatoes: 0.12, other: 0.34 },
  watershedQuality: { good: 22, impaired: 71, unknown: 7 },
  soilOM: 1.4,
  precipAnomaly: -31,
  nitrogenLoading: 22.1,
  regenPracticeAdoption: 0.09,
};

export const MOCK_NATIONAL_SUMMARY = {
  totalCroplandAcres: 392_000_000,
  avgSoilOM: 3.2,
  impairedWatersheds: 54,
  precipAnomaly: 6,
};

// ── Pipeline Mock Data ──────────────────────────────────────────
export const MOCK_PROJECTS: PipelineProject[] = [
  {
    id: 'p1',
    name: 'Practical Soil Co.',
    type: 'Input company',
    state: 'Iowa',
    stage: 'Due diligence',
    impactScore: 7.4,
    lastUpdated: '3 days ago',
    revenue: [1200, 1800, 2400, 3100, 3800, 4200],
    description: 'Biological soil amendment manufacturer targeting commodity corn/soy farms transitioning to reduced-input practices. Patent-pending microbial formulation shows 12-18% yield stability improvement in drought years.',
  },
  {
    id: 'p2',
    name: 'Upper Midwest Grain',
    type: 'Farm',
    state: 'Minnesota',
    stage: 'Screening',
    impactScore: 6.1,
    lastUpdated: '1 week ago',
    revenue: [8500, 8200, 9100, 8800, 7900, 8400],
    description: '12,000 acre diversified grain operation. Currently 40% no-till, exploring cover crop integration. Strong water stewardship record — sits in critical Raccoon River watershed.',
  },
  {
    id: 'p3',
    name: 'RPI Fund III',
    type: 'Fund',
    state: 'National',
    stage: 'Term sheet',
    impactScore: 8.8,
    lastUpdated: 'Yesterday',
    revenue: [45000, 52000, 61000, 58000, 67000, 72000],
    description: 'Third vintage of the Regenerative Partners Initiative. $250M target, investing across the regenerative supply chain. Track record: 22% IRR on Fund II with measurable soil health improvement across 180K acres.',
  },
  {
    id: 'p4',
    name: 'Mustard Seed Inputs',
    type: 'Input company',
    state: 'California',
    stage: 'Screening',
    impactScore: 7.2,
    lastUpdated: '2 days ago',
    revenue: [600, 900, 1500, 2200, 3400, 4800],
    description: 'Cover crop seed blends optimized for permanent crop alleys (orchards, vineyards). Rapid growth in Central Valley and Pacific Northwest.',
  },
  {
    id: 'p5',
    name: 'Prairie Restoration LLC',
    type: 'Infrastructure',
    state: 'Kansas',
    stage: 'Screening',
    impactScore: 6.8,
    lastUpdated: '5 days ago',
    revenue: [2000, 2200, 2600, 3000, 3200, 3800],
    description: 'Native prairie restoration contractor with carbon credit generation. 40,000 acres under management across Kansas and Oklahoma.',
  },
  {
    id: 'p6',
    name: 'Heartland Dairy Collective',
    type: 'Farm',
    state: 'Wisconsin',
    stage: 'Due diligence',
    impactScore: 7.9,
    lastUpdated: '4 days ago',
    revenue: [12000, 11500, 13200, 14800, 15100, 16400],
    description: 'Cooperative of 28 dairy farms transitioning to managed grazing. Methane reduction program shows 34% emissions decrease over 3 years.',
  },
  {
    id: 'p7',
    name: 'AgriTech Sensors',
    type: 'Input company',
    state: 'Colorado',
    stage: 'Portfolio',
    impactScore: 8.1,
    lastUpdated: '1 day ago',
    revenue: [3200, 4800, 7200, 11000, 16500, 24000],
    description: 'IoT soil health monitoring platform. Real-time SOM, moisture, and microbial activity data. 2,400 farm deployments across 15 states.',
  },
];

// ── Investor Mock Data ──────────────────────────────────────────
export const MOCK_INVESTORS: Investor[] = [
  {
    id: 'i1',
    name: 'Walton Family Foundation',
    initials: 'WF',
    focusAreas: ['Sustainable agriculture', 'Water quality', 'River systems'],
    geography: ['National', 'Mississippi River Basin'],
    annualDeployment: 120,
    stagePreference: ['Growth', 'Established'],
    connectionStrength: 'warm',
    lastContact: '2 weeks ago',
  },
  {
    id: 'i2',
    name: 'The Grantham Foundation',
    initials: 'GF',
    focusAreas: ['Climate change', 'Regenerative agriculture'],
    geography: ['Global', 'US focus'],
    annualDeployment: 80,
    stagePreference: ['Early', 'Growth'],
    connectionStrength: 'warm',
    lastContact: '1 month ago',
  },
  {
    id: 'i3',
    name: 'Croatan Institute',
    initials: 'CI',
    focusAreas: ['Soil health', 'Just transition', 'Impact investing'],
    geography: ['Southeast US'],
    annualDeployment: 25,
    stagePreference: ['Seed', 'Early'],
    connectionStrength: 'cold',
    lastContact: '3 months ago',
  },
  {
    id: 'i4',
    name: 'McKnight Foundation',
    initials: 'MK',
    focusAreas: ['Midwest agriculture', 'Water quality', 'Climate'],
    geography: ['Upper Midwest'],
    annualDeployment: 95,
    stagePreference: ['Growth', 'Established'],
    connectionStrength: 'warm',
    lastContact: '1 week ago',
  },
  {
    id: 'i5',
    name: 'Regen Ventures Family Office',
    initials: 'RV',
    focusAreas: ['Regenerative agriculture', 'Carbon markets', 'AgTech'],
    geography: ['National'],
    annualDeployment: 40,
    stagePreference: ['Seed', 'Early', 'Growth'],
    connectionStrength: 'new',
    lastContact: 'Never',
  },
  {
    id: 'i6',
    name: 'Blue Haven Initiative',
    initials: 'BH',
    focusAreas: ['Impact investing', 'Food systems', 'Conservation'],
    geography: ['Western US', 'National'],
    annualDeployment: 55,
    stagePreference: ['Growth', 'Established'],
    connectionStrength: 'cold',
    lastContact: '6 months ago',
  },
  {
    id: 'i7',
    name: 'Eleven Hour Project',
    initials: 'EH',
    focusAreas: ['Climate adaptation', 'Land stewardship'],
    geography: ['National'],
    annualDeployment: 35,
    stagePreference: ['Early', 'Growth'],
    connectionStrength: 'warm',
    lastContact: '3 weeks ago',
  },
  {
    id: 'i8',
    name: 'Northern Plains Capital',
    initials: 'NP',
    focusAreas: ['Agriculture', 'Rural development', 'Soil health'],
    geography: ['Northern Plains', 'Midwest'],
    annualDeployment: 18,
    stagePreference: ['Seed', 'Early'],
    connectionStrength: 'new',
    lastContact: 'Never',
  },
  {
    id: 'i9',
    name: 'Cedar Creek Endowment',
    initials: 'CC',
    focusAreas: ['Watershed restoration', 'Biodiversity', 'Climate'],
    geography: ['Pacific Northwest', 'California'],
    annualDeployment: 30,
    stagePreference: ['Growth'],
    connectionStrength: 'cold',
    lastContact: '2 months ago',
  },
  {
    id: 'i10',
    name: 'Soil Equity Partners',
    initials: 'SE',
    focusAreas: ['Regenerative agriculture', 'BIPOC farmers', 'Land access'],
    geography: ['Southeast', 'Midwest'],
    annualDeployment: 12,
    stagePreference: ['Seed', 'Early'],
    connectionStrength: 'warm',
    lastContact: '5 days ago',
  },
];

export const MOCK_FUNNEL = [
  { stage: 'Identified universe', value: 480 },
  { stage: 'Warm contacts', value: 120 },
  { stage: 'Active conversations', value: 45 },
  { stage: 'Term sheets', value: 12 },
  { stage: 'Committed', value: 8 },
];

// ── Regen10 Dimension Status (for region analysis) ──────────────
export function getDimensionStatus(region: RegionData) {
  return REGEN10_DIMENSIONS.map((dim) => {
    let status: 'good' | 'moderate' | 'poor' = 'moderate';
    let trend: 'improving' | 'declining' | 'stable' | 'above' | 'below' = 'stable';
    let landscapeOutcome = '';

    switch (dim.id) {
      case 'd01': // Air & Climate
        status = Math.abs(region.precipAnomaly) < 10 ? 'good' : Math.abs(region.precipAnomaly) < 20 ? 'moderate' : 'poor';
        trend = region.precipAnomaly > 0 ? 'above' : 'below';
        landscapeOutcome = 'Improve regional air quality and climate resilience';
        break;
      case 'd02': // Biodiversity
        status = 'moderate';
        trend = 'declining';
        landscapeOutcome = 'Restore biodiversity corridor integrity and habitat';
        break;
      case 'd03': // Soil
        status = region.soilOM > 4 ? 'good' : region.soilOM > 2.5 ? 'moderate' : 'poor';
        trend = 'improving';
        landscapeOutcome = 'Increase regional soil carbon stocks, reduce erosion';
        break;
      case 'd04': // Water
        status = region.watershedQuality.good > 50 ? 'good' : region.watershedQuality.good > 30 ? 'moderate' : 'poor';
        trend = 'stable';
        landscapeOutcome = 'Improve watershed water quality and wetland coverage';
        break;
      case 'd05': // Livestock
        status = 'moderate';
        trend = 'stable';
        landscapeOutcome = 'Reduce methane intensity, improve grassland health';
        break;
      case 'd06': // Crops & Pasture
        status = Object.keys(region.crops).length > 4 ? 'good' : Object.keys(region.crops).length > 2 ? 'moderate' : 'poor';
        trend = 'improving';
        landscapeOutcome = 'Increase crop diversity and regen practice adoption';
        break;
      case 'd07': // Community
        status = 'moderate';
        trend = 'improving';
        landscapeOutcome = 'Strengthen local food economy and land ownership';
        break;
      case 'd08': // Farmers & Workers
        status = 'moderate';
        trend = 'stable';
        landscapeOutcome = 'Increase farm viability and farmer entry rates';
        break;
      case 'd09': // Governance
        status = 'moderate';
        trend = 'stable';
        landscapeOutcome = 'Strengthen farmer-led governance structures';
        break;
      case 'd10': // Economics & Finance
        status = 'moderate';
        trend = 'stable';
        landscapeOutcome = 'Increase regional farm profitability, economic resilience';
        break;
      case 'd11': // Agricultural Inputs
        status = region.nitrogenLoading > 15 ? 'poor' : region.nitrogenLoading > 10 ? 'moderate' : 'good';
        trend = 'stable';
        landscapeOutcome = 'Decrease aggregate chemical input loading regionally';
        break;
      case 'd12': // Infrastructure
        status = 'moderate';
        trend = 'stable';
        landscapeOutcome = 'Strengthen food processing and renewable energy infra';
        break;
    }

    return {
      id: dim.id,
      name: dim.name,
      color: dim.color,
      status,
      trend,
      landscapeOutcome,
      dataSource: dim.data_source,
      apiAvailable: dim.api_available,
    };
  });
}

// Legacy compat wrapper
export function getLandscapeOutcomeStatus(region: RegionData) {
  return getDimensionStatus(region).map((d) => ({
    id: d.id,
    name: d.name,
    status: d.status,
    trend: d.trend,
    source: d.dataSource,
  }));
}
