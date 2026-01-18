import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
}

const CHECKLIST_DATA: ChecklistItem[] = [
  { id: 'sec-1', category: 'Security & Safety', text: 'Prompt Injection guardrails tested' },
  { id: 'sec-2', category: 'Security & Safety', text: 'PII redaction enabled on inputs/outputs' },
  { id: 'sec-3', category: 'Security & Safety', text: 'Rate limiting applied per user/IP' },
  { id: 'rel-1', category: 'Reliability', text: 'Fallback model configured (e.g., if Primary fails)' },
  { id: 'rel-2', category: 'Reliability', text: 'Timeout logic implemented (>30s)' },
  { id: 'rel-3', category: 'Reliability', text: 'Retry mechanism with exponential backoff' },
  { id: 'com-1', category: 'Compliance', text: 'User consent/disclaimer visible' },
  { id: 'com-2', category: 'Compliance', text: 'Audit logs for all LLM interactions' },
  { id: 'qa-1', category: 'Quality Assurance', text: 'Evaluated against "Golden Set" of queries' },
  { id: 'qa-2', category: 'Quality Assurance', text: 'Hallucination detection layer active' },
];

export const AgentChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('agent-checklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('agent-checklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleReset = () => {
    if(confirm("Are you sure you want to clear your checklist?")) {
        setCheckedItems({});
    }
  };

  const categories = Array.from(new Set(CHECKLIST_DATA.map(i => i.category)));
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = Math.round((completedCount / CHECKLIST_DATA.length) * 100);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-6">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Agent Readiness</h2>
            <p className="text-zinc-400">Interactive deployment gate. Status is persisted locally.</p>
        </div>
        <div className="text-right">
            <div className={`text-4xl font-mono font-bold transition-colors duration-500 ${progress === 100 ? 'text-green-400' : 'text-blue-400'}`}>
                {progress}<span className="text-lg align-top opacity-50">%</span>
            </div>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="flex gap-1 h-3 mb-10 w-full bg-zinc-950 p-1 rounded-md border border-zinc-800">
        {CHECKLIST_DATA.map((_, i) => (
             <div 
                key={i}
                className={`flex-1 rounded-sm transition-all duration-300 ${
                    i < completedCount 
                        ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' 
                        : 'bg-zinc-800/30'
                }`}
            />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat} className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-800/50 pb-2">
                {cat}
            </h3>
            <div className="space-y-3">
              {CHECKLIST_DATA.filter(i => i.category === cat).map(item => (
                <label key={item.id} className="flex items-start cursor-pointer group select-none">
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-zinc-700 bg-zinc-900 checked:border-cyan-500 checked:bg-cyan-500/20 transition-all hover:border-zinc-500"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleItem(item.id)}
                    />
                     <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-cyan-400 transition-opacity drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className={`ml-3 text-sm transition-all duration-200 ${checkedItems[item.id] ? 'text-zinc-600 line-through' : 'text-zinc-300 group-hover:text-white'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
            onClick={handleReset}
            className="text-xs font-mono text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
            [ Reset Checklist ]
        </button>
      </div>
    </div>
  );
};