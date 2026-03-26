'use client';

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Droplets, Sprout, CloudRain, Layers } from 'lucide-react';
import type { MapOverlay } from '@/lib/types';

const OVERLAYS: { id: MapOverlay; label: string; icon: typeof Layers }[] = [
  { id: 'cropland', label: 'Cropland', icon: Sprout },
  { id: 'water_quality', label: 'Water Quality', icon: Droplets },
  { id: 'precipitation', label: 'Precipitation', icon: CloudRain },
  { id: 'soil_health', label: 'Soil Health', icon: Layers },
];

export function MetricsOverlay() {
  const { activeOverlays, toggleOverlay } = useAppStore();

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
      {OVERLAYS.map((overlay) => {
        const Icon = overlay.icon;
        const active = activeOverlays.includes(overlay.id);
        return (
          <button
            key={overlay.id}
            onClick={() => toggleOverlay(overlay.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all backdrop-blur-sm',
              active
                ? 'bg-earth-800/90 text-white shadow-md'
                : 'bg-white/80 text-earth-600 hover:bg-white/95'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {overlay.label}
          </button>
        );
      })}
    </div>
  );
}
