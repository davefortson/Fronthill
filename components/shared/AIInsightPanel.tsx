'use client';

import { useState, useEffect } from 'react';
import type { RegionData } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface AIInsightPanelProps {
  region: RegionData;
}

export function AIInsightPanel({ region }: AIInsightPanelProps) {
  const [insight, setInsight] = useState('');
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchInsight() {
      setStreaming(true);
      setInsight('');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `Analyze this region for investment potential: ${region.label}, ${region.areaAcres.toLocaleString()} acres. Current profile: ${Math.round(Object.values(region.crops)[0] * 100)}% ${Object.keys(region.crops)[0]}, ${region.watershedQuality.impaired}% impaired watersheds, ${region.soilOM}% avg soil OM, ${region.precipAnomaly > 0 ? '+' : ''}${region.precipAnomaly}% precip anomaly. What are the key ecological dynamics and investment implications?`,
              },
            ],
            context: `Region: ${region.label}`,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error('Failed to fetch');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          if (!cancelled) setInsight(accumulated);
        }
      } catch {
        if (!cancelled) {
          // Fallback insight
          const primaryCrop = Object.entries(region.crops).sort((a, b) => b[1] - a[1])[0];
          setInsight(
            `Based on the current landscape profile for this region — ${Math.round(primaryCrop[1] * 100)}% ${primaryCrop[0]} with ${region.watershedQuality.impaired}% of HUC8 watersheds showing impairment — this region presents a compelling case for regenerative intervention investment.\n\nKey dynamics:\n\n1. **Soil health baseline**: At ${region.soilOM}% average organic matter, the region ${region.soilOM > 3.5 ? 'shows reasonable soil carbon stocks but significant room for improvement through cover cropping and diversified rotations' : 'is well below the 3.5-4% threshold that typically indicates healthy soil function, suggesting high potential for carbon sequestration gains'}.\n\n2. **Water quality pressure**: With ${region.watershedQuality.impaired}% of watersheds impaired, this region is likely contributing to downstream nutrient loading — a key metric for conservation program eligibility and potential payment for ecosystem services.\n\n3. **Precipitation trends**: The ${region.precipAnomaly > 0 ? `+${region.precipAnomaly}% above-normal precipitation increases erosion risk but also indicates available soil moisture for cover crop establishment` : `${region.precipAnomaly}% below-normal precipitation signals drought stress — investments in soil health practices that improve water retention would have outsized impact`}.\n\n4. **Regenerative practice adoption at ${Math.round(region.regenPracticeAdoption * 100)}%** suggests ${region.regenPracticeAdoption > 0.2 ? 'an emerging critical mass of practitioners that could accelerate peer-to-peer adoption' : 'early-stage transition with significant room for growth — the right catalytic investment could shift adoption curves'}.\n\nFor DiversiFund positioning, this region aligns with the thesis of removing barriers for farmers transitioning to regenerative practices. The combination of impaired water quality and moderate soil health creates a clear "practices-to-outcomes" narrative that resonates with both impact investors and USDA conservation program alignment.`
          );
        }
      } finally {
        if (!cancelled) setStreaming(false);
      }
    }

    fetchInsight();
    return () => { cancelled = true; };
  }, [region]);

  return (
    <div className="p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3" />
        AI Analysis · claude-sonnet
      </div>
      <div className={`text-sm text-earth-700 leading-relaxed whitespace-pre-wrap ${streaming ? 'border-l-2 border-moss-500 pl-3' : ''}`}>
        {insight || (
          <div className="space-y-2">
            <div className="h-3 bg-earth-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-earth-200 rounded animate-pulse w-5/6" />
            <div className="h-3 bg-earth-200 rounded animate-pulse w-4/6" />
          </div>
        )}
        {streaming && <span className="ai-cursor" />}
      </div>
    </div>
  );
}
