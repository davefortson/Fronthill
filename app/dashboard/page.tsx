'use client';

import { useAppStore } from '@/lib/store';
import { EcologicalModule } from '@/components/dashboard/EcologicalModule';
import { PipelineModule } from '@/components/dashboard/PipelineModule';
import { InvestorModule } from '@/components/dashboard/InvestorModule';
import { ChatDrawer } from '@/components/shared/ChatDrawer';
import { DashboardTour } from '@/components/tour/DashboardTour';
import { MessageCircle, Leaf, Briefcase, Users, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'ecological' as const, label: 'Ecological', icon: Leaf },
  { id: 'pipeline' as const, label: 'Pipeline', icon: Briefcase },
  { id: 'investors' as const, label: 'Investors', icon: Users },
];

export default function DashboardPage() {
  const { activeTab, setActiveTab, chatOpen, setChatOpen, startTour } = useAppStore();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-earth-800 text-white px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-moss-500 rounded-md flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide uppercase">Fronthill Intelligence</span>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-tour={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors',
                  activeTab === tab.id
                    ? 'bg-earth-700 text-white'
                    : 'text-earth-400 hover:text-white hover:bg-earth-700/50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center justify-end w-32">
          <button
            onClick={() => startTour()}
            className="text-xs text-earth-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <PlayCircle size={12} />
            Take the tour
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden" data-tour="map-panel">
        {activeTab === 'ecological' && <EcologicalModule />}
        {activeTab === 'pipeline' && <PipelineModule />}
        {activeTab === 'investors' && <InvestorModule />}
      </main>

      {/* Chat FAB */}
      <button
        data-tour="chat-fab"
        onClick={() => setChatOpen(!chatOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
          chatOpen
            ? 'bg-earth-700 text-white'
            : 'bg-moss-600 text-white hover:bg-moss-500'
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Drawer */}
      <ChatDrawer />

      {/* Dashboard Tour */}
      <DashboardTour />
    </div>
  );
}
