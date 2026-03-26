'use client';

import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  source: string;
  isLive?: boolean;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

export function MetricCard({ label, value, unit, source, isLive = false, trend, className }: MetricCardProps) {
  return (
    <div className={cn('bg-earth-100 border border-earth-200 rounded-lg p-3', className)}>
      <div className="text-xs font-medium text-earth-500 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-semibold font-mono text-earth-900">{value}</span>
        {unit && <span className="text-sm text-earth-500">{unit}</span>}
        {trend && (
          <span className={cn(
            'text-xs font-medium ml-auto',
            trend === 'up' ? 'text-moss-600' : trend === 'down' ? 'text-red-500' : 'text-earth-500'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      <DataBadge source={source} isLive={isLive} />
    </div>
  );
}

export function DataBadge({ source, isLive = false }: { source: string; isLive?: boolean }) {
  return (
    <div className="mt-2 flex items-center gap-1.5">
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-moss-500 animate-pulse" />}
      <span className="text-[10px] font-medium text-earth-400">
        {isLive ? 'Live' : 'Illustrative'} · {source}
      </span>
    </div>
  );
}
