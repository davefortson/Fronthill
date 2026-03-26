'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { MOCK_UPPER_MIDWEST } from '@/lib/data/mock';
import { MetricsOverlay } from './MetricsOverlay';
import type { MapOverlay } from '@/lib/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Crop colors for overlay
const CROP_COLORS: Record<string, string> = {
  corn: '#ECC94B',
  soy: '#48BB78',
  wheat: '#D69E2E',
  oats: '#9AE6B4',
  almonds: '#B7791F',
  grapes: '#805AD5',
  pistachios: '#38A169',
  tomatoes: '#E53E3E',
  sunflower: '#F6AD55',
  other: '#A0AEC0',
};

export default function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draw = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const { setSelectedRegion, setDrawnPolygon, activeOverlays, selectedRegion } = useAppStore();

  const handlePolygonCreate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const polygon = e.features[0];
      if (!polygon || polygon.geometry.type !== 'Polygon') return;

      import('@turf/turf').then((turf) => {
        const area = turf.area(polygon);
        const areaAcres = Math.round(area / 4047);
        const bbox = turf.bbox(polygon) as [number, number, number, number];

        setDrawnPolygon(polygon);

        const centerLng = (bbox[0] + bbox[2]) / 2;
        const centerLat = (bbox[1] + bbox[3]) / 2;

        let regionLabel = 'Custom Region';
        const mockBase = MOCK_UPPER_MIDWEST;

        if (centerLat > 42 && centerLng > -100 && centerLng < -85) {
          regionLabel = 'Upper Midwest Region';
        } else if (centerLat > 40 && centerLng < -100) {
          regionLabel = 'Northern Plains Region';
        } else if (centerLat < 40 && centerLng < -115) {
          regionLabel = 'Western Region';
        }

        setSelectedRegion({
          ...mockBase,
          label: regionLabel,
          areaAcres,
          bounds: { west: bbox[0], south: bbox[1], east: bbox[2], north: bbox[3] },
        });

        map.current?.fitBounds(bbox, { padding: 80, duration: 1000 });
      });
    },
    [setSelectedRegion, setDrawnPolygon]
  );

  useEffect(() => {
    if (!mapContainer.current || map.current || !MAPBOX_TOKEN) return;

    let cancelled = false;

    // Dynamic import to avoid module-level crash when token is missing
    Promise.all([
      import('mapbox-gl'),
      import('@mapbox/mapbox-gl-draw'),
    ]).then(([mapboxglModule, MapboxDrawModule]) => {
      if (cancelled || !mapContainer.current) return;

      const mapboxgl = mapboxglModule.default;
      const MapboxDraw = MapboxDrawModule.default;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: [-93.5, 41.5],
        zoom: 5,
        attributionControl: false,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
      map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
        defaultMode: 'simple_select',
      });
      map.current.addControl(draw.current, 'top-right');

      map.current.on('load', () => {
        if (!cancelled) {
          setMapLoaded(true);
          setMapReady(true);
          addCroplandLayer();
        }
      });

      map.current.on('draw.create', handlePolygonCreate);
      map.current.on('draw.update', handlePolygonCreate);
      map.current.on('draw.delete', () => {
        setSelectedRegion(null);
        setDrawnPolygon(null);
      });
    }).catch((err) => {
      console.error('Failed to load map:', err);
    });

    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, [handlePolygonCreate, setSelectedRegion, setDrawnPolygon]);

  function addCroplandLayer() {
    if (!map.current) return;
    const states = [
      { id: 'iowa', center: [-93.5, 42.0], crop: 'corn' },
      { id: 'illinois', center: [-89.4, 40.0], crop: 'corn' },
      { id: 'indiana', center: [-86.1, 39.8], crop: 'soy' },
      { id: 'minnesota', center: [-94.3, 46.0], crop: 'wheat' },
      { id: 'nebraska', center: [-99.8, 41.5], crop: 'corn' },
      { id: 'ohio', center: [-82.8, 40.3], crop: 'soy' },
    ];

    const features = states.map((s) => ({
      type: 'Feature' as const,
      properties: { crop: s.crop, color: CROP_COLORS[s.crop] || '#A0AEC0' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [s.center[0] - 1.5, s.center[1] - 1],
            [s.center[0] + 1.5, s.center[1] - 1],
            [s.center[0] + 1.5, s.center[1] + 1],
            [s.center[0] - 1.5, s.center[1] + 1],
            [s.center[0] - 1.5, s.center[1] - 1],
          ],
        ],
      },
    }));

    try {
      map.current.addSource('cropland', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features },
      });

      map.current.addLayer({
        id: 'cropland-fill',
        type: 'fill',
        source: 'cropland',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.3,
        },
      });

      map.current.addLayer({
        id: 'cropland-outline',
        type: 'line',
        source: 'cropland',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': 0.6,
        },
      });
    } catch {
      // Layer may already exist
    }
  }

  // Toggle overlays based on store state
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const overlayLayers: Record<MapOverlay, string[]> = {
      cropland: ['cropland-fill', 'cropland-outline'],
      water_quality: [],
      precipitation: [],
      soil_health: [],
    };

    Object.entries(overlayLayers).forEach(([overlay, layers]) => {
      layers.forEach((layerId) => {
        try {
          const visibility = activeOverlays.includes(overlay as MapOverlay) ? 'visible' : 'none';
          map.current?.setLayoutProperty(layerId, 'visibility', visibility);
        } catch {
          // Layer may not exist yet
        }
      });
    });
  }, [activeOverlays, mapLoaded]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full h-full bg-earth-800 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-earth-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Map Requires Configuration</h3>
          <p className="text-sm text-earth-400 mb-4">
            Set the <code className="bg-earth-700 px-1.5 py-0.5 rounded text-earth-300 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code> environment variable in Vercel to enable the satellite map.
          </p>
          <p className="text-xs text-earth-500">
            Use the preset regions in the sidebar to explore data without the map.
          </p>
        </div>
        <MetricsOverlay />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {!mapReady && (
        <div className="absolute inset-0 bg-earth-800 flex items-center justify-center">
          <div className="text-earth-400 text-sm animate-pulse">Loading map...</div>
        </div>
      )}

      {/* Draw prompt */}
      {mapLoaded && !selectedRegion && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-earth-800/90 text-white px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2 pointer-events-none">
          <svg className="w-4 h-4 text-moss-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Draw a region to analyze
        </div>
      )}

      {/* Layer toggles */}
      <MetricsOverlay />
    </div>
  );
}
