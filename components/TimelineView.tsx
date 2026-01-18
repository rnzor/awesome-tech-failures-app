import React from 'react';
import { FailureEntry, Severity } from '../types';
import { Badge } from './Badge';

interface Props {
  entries: FailureEntry[];
  onSelect: (entry: FailureEntry) => void;
}

export const TimelineView: React.FC<Props> = ({ entries, onSelect }) => {
  // Sort entries chronologically descending
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="relative py-10 px-4 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-700 to-transparent md:-translate-x-1/2"></div>

      <div className="space-y-12">
        {sorted.map((entry, idx) => {
          const isLeft = idx % 2 === 0;
          const severityColor = 
            entry.severity === Severity.CRITICAL ? 'bg-red-500 shadow-red-500/50' :
            entry.severity === Severity.HIGH ? 'bg-orange-500 shadow-orange-500/50' :
            entry.severity === Severity.MEDIUM ? 'bg-yellow-500 shadow-yellow-500/50' :
            'bg-blue-500 shadow-blue-500/50';

          return (
            <div key={entry.id} className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:flex-row-reverse' : ''} group`}>
              
              {/* Date Marker (Opposite side) */}
              <div className={`hidden md:block w-1/2 px-8 ${isLeft ? 'text-left' : 'text-right'}`}>
                 <div className="font-mono text-xs text-zinc-500 mb-1">{entry.date}</div>
                 <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    {entry.companies[0]}
                 </div>
              </div>

              {/* Center Node */}
              <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#050505] z-10 md:-translate-x-1/2 flex items-center justify-center">
                 <div className={`w-2.5 h-2.5 rounded-full ${severityColor} shadow-[0_0_10px_2px_rgba(0,0,0,0.3)] group-hover:scale-150 transition-transform duration-300`}></div>
              </div>

              {/* Mobile Date */}
              <div className="md:hidden pl-12 w-full mb-2 flex items-center gap-3">
                 <span className="text-xs font-mono text-zinc-500">{entry.date}</span>
                 <div className={`h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent`}></div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                 <div 
                    onClick={() => onSelect(entry)}
                    className="bg-zinc-900/40 border border-zinc-800/50 rounded-lg p-5 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer relative overflow-hidden group-card backdrop-blur-sm"
                 >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <Badge type="category" value={entry.category} className="text-[10px] py-0">{entry.category}</Badge>
                        {entry.severity === Severity.CRITICAL && (
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-blue-300 transition-colors">{entry.title}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
                        {entry.description}
                    </p>

                    <div className="flex items-center text-[10px] text-zinc-500 font-mono uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                        <span>Read Report</span>
                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-center mt-12 mb-8">
          <div className="inline-block p-2 rounded-full border border-zinc-800 bg-black/50 text-zinc-600 text-xs font-mono">
              END OF TIMELINE
          </div>
      </div>
    </div>
  );
};