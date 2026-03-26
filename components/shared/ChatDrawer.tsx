'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatDrawer() {
  const { chatOpen, setChatOpen, activeTab, selectedRegion } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getContext(): string {
    const parts: string[] = [`Active module: ${activeTab}`];
    if (selectedRegion) {
      parts.push(`Region: ${selectedRegion.label} (${selectedRegion.areaAcres.toLocaleString()} acres), Soil OM: ${selectedRegion.soilOM}%, Impaired: ${selectedRegion.watershedQuality.impaired}%`);
    }
    return parts.join('. ');
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const allMessages = [...messages, { role: 'user', content: userMessage }];
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages.slice(-10), context: getContext() }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const u = [...prev];
            u[u.length - 1] = { role: 'assistant', content: text };
            return u;
          });
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Unable to process. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  if (!chatOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white border-l border-earth-200 shadow-2xl z-40 flex flex-col">
      <div className="bg-earth-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-moss-400" />
          <span className="text-sm font-semibold">Fronthill AI</span>
        </div>
        <button onClick={() => setChatOpen(false)} className="text-earth-400 hover:text-white"><X className="w-4 h-4" /></button>
      </div>

      <div className="px-4 py-2 bg-earth-50 border-b border-earth-200 text-[10px] text-earth-500">
        Context: <span className="font-medium text-earth-600">{activeTab}</span>
        {selectedRegion && <> · {selectedRegion.label}</>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-earth-400 text-sm mt-8 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-earth-300" />
            <p className="font-medium text-earth-500">Impact Intelligence Assistant</p>
            <p className="text-xs max-w-[280px] mx-auto">Ask about regions, projects, investors, or the Regen10 Outcomes Framework.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed', msg.role === 'user' ? 'bg-moss-600 text-white' : 'bg-earth-100 text-earth-800 whitespace-pre-wrap')}>
              {msg.content}
              {msg.role === 'assistant' && loading && i === messages.length - 1 && <span className="ai-cursor" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-earth-200 shrink-0">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask anything..." className="flex-1 bg-earth-100 border border-earth-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-moss-500" disabled={loading} />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-moss-600 text-white p-2 rounded-md hover:bg-moss-500 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
