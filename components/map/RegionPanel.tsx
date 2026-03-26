'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MetricCard, DataBadge } from '@/components/shared/MetricCard';
import { ScenarioBuilder } from '@/components/shared/ScenarioBuilder';
import { AIInsightPanel } from '@/components/shared/AIInsightPanel';
import { getLandscapeOutcomeStatus } from '@/lib/data/mock';
import { formatAcres, formatPercent, cn } from '@/lib/utils';
import { MapPin, X, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function RegionPanel() {
  const { selectedRegion, setSelectedRegion, setDrawnPolygon } = useAppStore();
  const [regionName, setRegionName] = useState(selectedRegion?.label || 'Custom Region');

  if (!selectedRegion) return null;

  const outcomeStatuses = getLandscapeOutcomeStatus(selectedRegion);

  const primaryCrop = Object.entries(selectedRegion.crops).sort((a, b) => b[1] - a[1])[0];

  function handleClose() {
    setSelectedRegion(null);
    setDrawnPolygon(null);
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-earth-200">
        <div className="flex items-start justify-between mb-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600">
            Region Analysis
          </div>
          <button onClick={handleClose} className="text-earth-400 hover:text-earth-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          className="text-lg font-semibold text-earth-900 bg-transparent border-none outline-none w-full placeholder:text-earth-300"
          placeholder="Name this region..."
        />
        <div className="flex items-center gap-2 mt-1 text-xs text-earth-500">
          <MapPin className="w-3 h-3" />
          <span>~{formatAcres(selectedRegion.areaAcres)} analyzed</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-moss-500 animate-pulse" />
            Live data
          </span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <MetricCard
          label="Primary crop"
          value={`${primaryCrop[0].charAt(0).toUpperCase() + primaryCrop[0].slice(1)} (${Math.round(primaryCrop[1] * 100)}%)`}
          source="USDA NASS"
          isLive
        />
        <MetricCard
          label="Water quality"
          value={`${selectedRegion.watershedQuality.impaired}%`}
          unit="impaired"
          source="EPA ATTAINS"
          isLive
        />
        <MetricCard
          label="Soil OM"
          value={`${selectedRegion.soilOM}%`}
          unit="avg"
          source="USDA SSURGO"
          isLive
        />
        <MetricCard
          label="Precip anomaly"
          value={formatPercent(selectedRegion.precipAnomaly, true)}
          unit="vs 10yr avg"
          source="NOAA"
          isLive
        />
      </div>

      {/* Regen 10 Outcomes */}
      <div className="px-4 pb-4">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-earth-500 mb-2">
          Regen 10 Landscape Outcomes
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {outcomeStatuses.map((outcome) => (
            <div
              key={outcome.id}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-earth-100 rounded text-xs"
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  outcome.status === 'good' && 'bg-moss-500',
                  outcome.status === 'moderate' && 'bg-amber-500',
                  outcome.status === 'poor' && 'bg-red-500'
                )}
              />
              <span className="text-earth-700 truncate flex-1">{outcome.name}</span>
              {outcome.trend === 'improving' && <TrendingUp className="w-3 h-3 text-moss-500 shrink-0" />}
              {outcome.trend === 'declining' && <TrendingDown className="w-3 h-3 text-red-500 shrink-0" />}
              {outcome.trend === 'stable' && <Minus className="w-3 h-3 text-earth-400 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="mt-1.5">
          <DataBadge source="Multiple sources" isLive />
        </div>
      </div>

      {/* Scenario Builder */}
      <div className="border-t border-earth-200">
        <ScenarioBuilder region={selectedRegion} />
      </div>

      {/* AI Insight */}
      <div className="border-t border-earth-200">
        <AIInsightPanel region={selectedRegion} />
      </div>
    </div>
  );
}
