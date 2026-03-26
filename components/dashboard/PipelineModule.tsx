'use client';

import { useState } from 'react';
import { MOCK_PROJECTS } from '@/lib/data/mock';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import type { PipelineProject } from '@/lib/types';
import { Briefcase, TrendingUp, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const STAGE_COLORS: Record<string, string> = {
  Screening: 'bg-earth-200 text-earth-700',
  'Due diligence': 'bg-amber-500/20 text-amber-500',
  'Term sheet': 'bg-moss-100 text-moss-600',
  Portfolio: 'bg-moss-600 text-white',
};

const TYPE_COLORS: Record<string, string> = {
  Farm: 'bg-soil-600/10 text-soil-600',
  Fund: 'bg-water-600/10 text-water-600',
  'Input company': 'bg-moss-100 text-moss-600',
  Infrastructure: 'bg-earth-200 text-earth-600',
};

export function PipelineModule() {
  const [selectedProject, setSelectedProject] = useState<PipelineProject | null>(null);
  const [sortBy, setSortBy] = useState<'impactScore' | 'lastUpdated'>('impactScore');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  const sorted = [...MOCK_PROJECTS].sort((a, b) => {
    if (sortBy === 'impactScore') return b.impactScore - a.impactScore;
    return 0;
  });

  async function loadAnalysis(project: PipelineProject) {
    setSelectedProject(project);
    setAiAnalysis('');
    setChatResponse('');
    setLoadingAI(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Analyze this investment opportunity: ${project.name} (${project.type}) in ${project.state}. Stage: ${project.stage}. Impact score: ${project.impactScore}/10. Description: ${project.description}. Provide a brief impact assessment covering relevant Regen 10 Outcomes, risk indicators, and what additional data would strengthen the analysis.` }],
          context: `Pipeline project: ${project.name}`,
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
          setAiAnalysis(text);
        }
      }
    } catch {
      setAiAnalysis(`**Impact Assessment for ${project.name}**\n\nThis ${project.type.toLowerCase()} in ${project.state} at the ${project.stage.toLowerCase()} stage presents a ${project.impactScore > 7.5 ? 'strong' : 'moderate'} alignment with DiversiFund's regenerative agriculture thesis.\n\n**Relevant Regen 10 Outcomes:**\n- Soil organic matter improvement (f01)\n- Cover crop adoption acceleration (f04)\n- Net farm income enhancement (f08)\n\n**Risk Indicators:**\n- Market concentration in ${project.state} region\n- Scaling challenges beyond initial pilot\n\n**Data Needs:**\n- Field-level soil test data from pilot sites\n- Farmer retention and satisfaction metrics\n- Detailed unit economics at scale`);
    } finally {
      setLoadingAI(false);
    }
  }

  async function handleChat() {
    if (!question.trim() || !selectedProject) return;
    setLoadingChat(true);
    setChatResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `About ${selectedProject.name}: ${question}` }],
          context: `Pipeline project: ${selectedProject.name} (${selectedProject.type}, ${selectedProject.state}, ${selectedProject.stage})`,
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
          setChatResponse(text);
        }
      }
    } catch {
      setChatResponse('Unable to process your question at this time. Please try again.');
    } finally {
      setLoadingChat(false);
      setQuestion('');
    }
  }

  return (
    <div className="flex h-full">
      {/* Project List — Left */}
      <aside className="w-[40%] min-w-[360px] bg-white border-r border-earth-200 flex flex-col">
        <div className="p-4 border-b border-earth-200">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" />
            Investment Pipeline
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-earth-500">Sort by:</span>
            <button
              onClick={() => setSortBy('impactScore')}
              className={cn('px-2 py-0.5 rounded', sortBy === 'impactScore' ? 'bg-moss-100 text-moss-600 font-medium' : 'text-earth-400')}
            >
              Impact Score
            </button>
            <button
              onClick={() => setSortBy('lastUpdated')}
              className={cn('px-2 py-0.5 rounded', sortBy === 'lastUpdated' ? 'bg-moss-100 text-moss-600 font-medium' : 'text-earth-400')}
            >
              Last Updated
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sorted.map((project) => (
            <button
              key={project.id}
              onClick={() => loadAnalysis(project)}
              className={cn(
                'w-full px-4 py-3 border-b border-earth-100 text-left hover:bg-earth-50 transition-colors',
                selectedProject?.id === project.id && 'bg-moss-100/50'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-earth-900">{project.name}</span>
                <span className="font-mono text-sm font-semibold text-moss-600">{project.impactScore}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', TYPE_COLORS[project.type])}>
                  {project.type}
                </span>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium', STAGE_COLORS[project.stage])}>
                  {project.stage}
                </span>
                <span className="text-[10px] text-earth-400">{project.state}</span>
                <span className="text-[10px] text-earth-400 ml-auto">{project.lastUpdated}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Project Detail — Right */}
      <div className="flex-1 overflow-y-auto bg-earth-50">
        {selectedProject ? (
          <div className="p-6 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-earth-900">{selectedProject.name}</h2>
                <span className={cn('text-xs px-2 py-0.5 rounded font-medium', TYPE_COLORS[selectedProject.type])}>
                  {selectedProject.type}
                </span>
                <span className={cn('text-xs px-2 py-0.5 rounded font-medium', STAGE_COLORS[selectedProject.stage])}>
                  {selectedProject.stage}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-moss-600" />
                  <span className="font-mono text-lg font-bold text-moss-600">{selectedProject.impactScore}</span>
                  <span className="text-xs text-earth-500">/10 impact score</span>
                </div>
                <span className="text-xs text-earth-400">· {selectedProject.state} · Updated {selectedProject.lastUpdated}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-earth-600 leading-relaxed">{selectedProject.description}</p>

            {/* Revenue sparkline */}
            {selectedProject.revenue && (
              <div className="bg-white border border-earth-200 rounded-lg p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-earth-500 mb-2">
                  Revenue Trend (Illustrative)
                </div>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedProject.revenue.map((v, i) => ({ period: i, value: v }))}>
                      <defs>
                        <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4E8A1A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4E8A1A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#4E8A1A" fill="url(#revGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-earth-400 mt-1">Illustrative · Normalized per Fronthill template</div>
              </div>
            )}

            {/* AI Analysis */}
            <div className="bg-white border border-earth-200 rounded-lg p-4">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-moss-600 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                AI Impact Assessment
              </div>
              {loadingAI ? (
                <div className="space-y-2">
                  <div className="h-3 bg-earth-200 rounded animate-pulse w-full" />
                  <div className="h-3 bg-earth-200 rounded animate-pulse w-5/6" />
                  <div className="h-3 bg-earth-200 rounded animate-pulse w-4/6" />
                </div>
              ) : (
                <div className="text-sm text-earth-700 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</div>
              )}
            </div>

            {/* Chat response */}
            {chatResponse && (
              <div className="bg-white border border-earth-200 rounded-lg p-4">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-water-600 mb-2">
                  Response
                </div>
                <div className="text-sm text-earth-700 leading-relaxed whitespace-pre-wrap">{chatResponse}</div>
              </div>
            )}

            {/* Inline chat */}
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-earth-400 shrink-0" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about this project..."
                className="flex-1 bg-white border border-earth-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-moss-500"
              />
              <button
                onClick={handleChat}
                disabled={loadingChat || !question.trim()}
                className="bg-moss-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-moss-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-earth-400 text-sm">
            Select a project from the list to view details
          </div>
        )}
      </div>
    </div>
  );
}
