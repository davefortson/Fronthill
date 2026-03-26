'use client';

import { MetricCard } from '@/components/shared/MetricCard';
import { MOCK_NATIONAL_SUMMARY, MOCK_UPPER_MIDWEST, MOCK_NORTHERN_PLAINS, MOCK_CENTRAL_VALLEY } from '@/lib/data/mock';
import { useAppStore } from '@/lib/store';
import { formatNumber, formatPercent } from '@/lib/utils';
import { Globe, MapPin } from 'lucide-react';

const PRESET_REGIONS = [
  { label: 'Upper Midwest — Corn Belt', data: MOCK_UPPER_MIDWEST },
  { label: 'Northern Plains', data: MOCK_NORTHERN_PLAINS },
  { label: 'California Central Valley', data: MOCK_CENTRAL_VALLEY },
];

export function NationalSummary() {
  const { loadPresetRegion, setSelectedRegion } = useAppStore();

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-1 flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          National Overview
        </div>
        <p className="text-xs text-earth-500">
          Draw a polygon on the map to analyze a specific region, or select a preset below.
        </p>
      </div>

      {/* National metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="US Cropland"
          value={formatNumber(MOCK_NATIONAL_SUMMARY.totalCroplandAcres)}
          unit="acres"
          source="USDA NASS"
          isLive
        />
        <MetricCard
          label="Avg Soil OM"
          value={`${MOCK_NATIONAL_SUMMARY.avgSoilOM}%`}
          unit="national avg"
          source="USDA SSURGO"
          isLive
        />
        <MetricCard
          label="Impaired Watersheds"
          value={`${MOCK_NATIONAL_SUMMARY.impairedWatersheds}%`}
          unit="of HUC8s"
          source="EPA ATTAINS"
          isLive
        />
        <MetricCard
          label="Precip Anomaly"
          value={formatPercent(MOCK_NATIONAL_SUMMARY.precipAnomaly, true)}
          unit="growing season"
          source="NOAA"
          isLive
        />
      </div>

      {/* Preset Regions */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-earth-500 mb-2">
          Quick-load Regions
        </div>
        <div className="space-y-1.5">
          {PRESET_REGIONS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setSelectedRegion(preset.data);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-earth-100 hover:bg-earth-200 rounded-lg text-left transition-colors group"
            >
              <MapPin className="w-4 h-4 text-earth-400 group-hover:text-moss-600 shrink-0" />
              <div>
                <div className="text-sm font-medium text-earth-800">{preset.label}</div>
                <div className="text-xs text-earth-500">
                  {formatNumber(preset.data.areaAcres)} acres · {Math.round(preset.data.regenPracticeAdoption * 100)}% regen adoption
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* About section */}
      <div className="bg-moss-100 border border-moss-200 rounded-lg p-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-1">
          About This Module
        </div>
        <p className="text-xs text-earth-600 leading-relaxed">
          The Ecological Intelligence module surfaces landscape-scale data from USDA, EPA, and NOAA to
          help evaluate regenerative investment opportunities. Draw a region on the map to see detailed
          metrics, Regen 10 Outcomes tracking, and AI-powered scenario modeling.
        </p>
      </div>
    </div>
  );
}
