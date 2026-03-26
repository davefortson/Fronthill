'use client';

import { useState } from 'react';
import { MOCK_INVESTORS, MOCK_FUNNEL } from '@/lib/data/mock';
import { cn, formatNumber } from '@/lib/utils';
import { Search, Loader2, Sparkles, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const CONNECTION_COLORS = {
  warm: 'bg-moss-100 text-moss-600',
  cold: 'bg-water-600/10 text-water-600',
  new: 'bg-earth-200 text-earth-600',
};

export function InvestorModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunity, setOpportunity] = useState('');
  const [matchResults, setMatchResults] = useState<string>('');
  const [loadingMatch, setLoadingMatch] = useState(false);

  const filtered = MOCK_INVESTORS.filter(
    (inv) =>
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.focusAreas.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inv.geography.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  async function handleMatch() {
    if (!opportunity.trim()) return;
    setLoadingMatch(true);
    setMatchResults('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Match this opportunity to the best investors from this list and explain why:\n\nOpportunity: ${opportunity}\n\nInvestor Universe:\n${MOCK_INVESTORS.map(i => `- ${i.name}: Focus: ${i.focusAreas.join(', ')}. Geography: ${i.geography.join(', ')}. Deploys $${i.annualDeployment}M/yr. Connection: ${i.connectionStrength}.`).join('\n')}\n\nRank the top 5 matches with match score (1-10) and specific reasoning for each.`
          }],
          context: 'Investor matching',
        }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMatchResults(text);
        }
      }
    } catch {
      setMatchResults(
        `**Top Matches for: "${opportunity}"**\n\n` +
        `1. **McKnight Foundation** (9/10) — Strong Midwest agriculture focus with $95M annual deployment. Their water quality mandate directly aligns with this opportunity.\n\n` +
        `2. **Walton Family Foundation** (8/10) — National reach, $120M deployment, Mississippi River Basin focus suggests interest in ag-watershed projects.\n\n` +
        `3. **Soil Equity Partners** (7/10) — Focused on regenerative agriculture, warm connection, strong values alignment. Smaller check size ($12M/yr) may limit participation.\n\n` +
        `4. **Regen Ventures Family Office** (7/10) — New contact but perfect thesis alignment. Worth cultivating for this deal.\n\n` +
        `5. **Eleven Hour Project** (6/10) — Climate adaptation focus connects to land stewardship thesis. Warm connection makes outreach straightforward.`
      );
    } finally {
      setLoadingMatch(false);
    }
  }

  const FUNNEL_COLORS = ['#A9A390', '#8A8470', '#6B6550', '#4E8A1A', '#3B6D11'];

  return (
    <div className="flex h-full">
      {/* Left — Investor cards + funnel */}
      <div className="w-[55%] bg-white border-r border-earth-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-earth-200">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-2 flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            Investor Universe
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search investors, focus areas, geography..."
              className="w-full bg-earth-100 border border-earth-200 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-moss-500"
            />
          </div>
        </div>

        {/* Investor grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
          {filtered.map((inv) => (
            <div key={inv.id} className="bg-earth-50 border border-earth-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-earth-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {inv.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-earth-900 truncate">{inv.name}</div>
                  <div className="text-[10px] text-earth-400">${inv.annualDeployment}M/yr</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {inv.focusAreas.slice(0, 2).map((f) => (
                  <span key={f} className="text-[10px] bg-earth-100 text-earth-600 px-1.5 py-0.5 rounded">
                    {f}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className={cn('px-1.5 py-0.5 rounded font-medium', CONNECTION_COLORS[inv.connectionStrength])}>
                  {inv.connectionStrength}
                </span>
                <span className="text-earth-400">{inv.lastContact}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div className="p-4 border-t border-earth-200">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-earth-500 mb-2">
            Capital Pipeline Funnel
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_FUNNEL} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" width={130} tick={{ fontSize: 10, fill: '#5F5E5A' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {MOCK_FUNNEL.map((_, i) => (
                    <Cell key={i} fill={FUNNEL_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[10px] text-earth-400 mt-1">
            {MOCK_FUNNEL.map((f) => (
              <span key={f.stage}>${f.value}M</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Opportunity Matcher */}
      <div className="flex-1 bg-earth-50 p-6 overflow-y-auto">
        <div className="max-w-lg">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Opportunity Matcher
          </div>
          <p className="text-xs text-earth-500 mb-3">
            Describe a deal and find the best-matched investors from your universe.
          </p>
          <textarea
            value={opportunity}
            onChange={(e) => setOpportunity(e.target.value)}
            placeholder='e.g., "Grassland restoration project in Kentucky, $3M needed"'
            className="w-full bg-white border border-earth-200 rounded-md px-3 py-2 text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-moss-500 mb-3"
          />
          <button
            onClick={handleMatch}
            disabled={loadingMatch || !opportunity.trim()}
            className={cn(
              'w-full py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors',
              loadingMatch
                ? 'bg-earth-200 text-earth-500 cursor-wait'
                : 'bg-moss-600 text-white hover:bg-moss-500 disabled:opacity-50'
            )}
          >
            {loadingMatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding matches...
              </>
            ) : (
              'Find matching investors →'
            )}
          </button>

          {matchResults && (
            <div className="mt-4 bg-white border border-earth-200 rounded-lg p-4">
              <div className="text-sm text-earth-700 leading-relaxed whitespace-pre-wrap">{matchResults}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
