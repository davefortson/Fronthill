'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { RegionPanel } from '@/components/map/RegionPanel';
import { NationalSummary } from '@/components/dashboard/NationalSummary';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const MapCanvas = dynamic(() => import('@/components/map/MapCanvas'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-earth-800 w-full h-full" />,
});

export function EcologicalModule() {
  const { selectedRegion } = useAppStore();

  return (
    <div className="flex h-full">
      {/* Sidebar — 35% */}
      <aside className="w-[35%] min-w-[340px] max-w-[480px] bg-white border-r border-earth-200 overflow-y-auto shrink-0">
        {selectedRegion ? <RegionPanel /> : <NationalSummary />}
      </aside>

      {/* Map — 65% */}
      <div className="flex-1 relative">
        <MapCanvas />
      </div>
    </div>
  );
}
