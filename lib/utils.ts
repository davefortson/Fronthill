import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export function formatAcres(n: number): string {
  return `${formatNumber(n)} acres`;
}

export function formatPercent(n: number, includeSign = false): string {
  const sign = includeSign && n > 0 ? '+' : '';
  return `${sign}${n}%`;
}
