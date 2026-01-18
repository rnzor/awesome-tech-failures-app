import React, { useMemo } from 'react';
import { FailureEntry, Category, Severity } from '../types';

interface Props {
  entries: FailureEntry[];
}

export const StatsDashboard: React.FC<Props> = ({ entries }) => {
  
  // Calculate Distributions
  const severityDist = useMemo(() => {
    const counts = { [Severity.CRITICAL]: 0, [Severity.HIGH]: 0, [Severity.MEDIUM]: 0, [Severity.LOW]: 0, [Severity.INFO]: 0 };
    entries.forEach(e => counts[e.severity] = (counts[e.severity] || 0) + 1);
    return Object.entries(counts).map(([k, v]) => ({ label: k, value: v, percent: (v / entries.length) * 100 }));
  }, [entries]);

  const categoryDist = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(Category).forEach(c => counts[c] = 0);
    entries.forEach(e => counts[e.category] = (counts[e.category] || 0) + 1);
    return Object.entries(counts).map(([k, v]) => ({ label: k, value: v, percent: (v / entries.length) * 100 })).sort((a,b) => b.value - a.value);
  }, [entries]);

  const yearsDist = useMemo(() => {
     const counts: Record<string, number> = {};
     entries.forEach(e => {
         const y = e.date.split('-')[0];
         counts[y] = (counts[y] || 0) + 1;
     });
     // Sort years
     return Object.entries(counts).sort((a,b) => parseInt(a[0]) - parseInt(b[0]));
  }, [entries]);

  const getSeverityColor = (sev: string) => {
      switch(sev) {
          case Severity.CRITICAL: return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
          case Severity.HIGH: return 'bg-orange-500';
          case Severity.MEDIUM: return 'bg-yellow-500';
          case Severity.LOW: return 'bg-blue-500';
          default: return 'bg-zinc-500';
      }
  };

  const getSeverityTextColor = (sev: string) => {
      switch(sev) {
          case Severity.CRITICAL: return 'text-red-500';
          case Severity.HIGH: return 'text-orange-500';
          case Severity.MEDIUM: return 'text-yellow-500';
          case Severity.LOW: return 'text-blue-500';
          default: return 'text-zinc-500';
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Analytics Dashboard</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Statistical breakdown of the failure index database.</p>
            </div>
            <div className="text-right hidden md:block">
                 <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Total Incidents</div>
                 <div className="text-4xl font-black text-zinc-900 dark:text-white">{entries.length}</div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Severity Breakdown */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Severity Distribution</h3>
                </div>
                
                <div className="space-y-6">
                    {severityDist.map((item) => (
                        <div key={item.label} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <span className={`text-sm font-bold ${getSeverityTextColor(item.label)}`}>{item.label}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-zinc-900 dark:text-white font-mono font-bold">{item.value}</span>
                                    <span className="text-xs text-zinc-400 font-mono">({Math.round(item.percent)}%)</span>
                                </div>
                            </div>
                            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${getSeverityColor(item.label)}`} 
                                    style={{ width: `${Math.max(item.percent, 2)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Breakdown (Horizontal Bars) */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
                 <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Failures by Category</h3>
                </div>

                <div className="space-y-5">
                    {categoryDist.map((item) => (
                        <div key={item.label} className="group relative">
                            {/* Label Row */}
                            <div className="flex justify-between items-center mb-1.5 z-10 relative">
                                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tight">{item.label}</span>
                                <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">{item.value}</span>
                            </div>
                            
                            {/* Bar Container */}
                            <div className="relative h-8 w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 rounded flex items-center px-2 overflow-hidden">
                                {/* Bar Fill */}
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-blue-500/10 dark:bg-blue-500/20 border-r border-blue-500/50 transition-all duration-1000 group-hover:bg-blue-500/30"
                                    style={{ width: `${Math.max(item.percent, 1)}%` }}
                                ></div>
                                {/* Percentage Label inside bar if needed, or visual effect */}
                                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-400 font-mono">
                                    {item.percent.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Timeline Volume */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-sm">
             <div className="flex items-center gap-2 mb-8">
                 <div className="w-2 h-2 rounded-full bg-zinc-400"></div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Incident Volume by Year</h3>
             </div>
             
             <div className="flex items-end justify-between gap-4 h-48 w-full border-b border-zinc-200 dark:border-zinc-800 pb-0 pt-4">
                 {yearsDist.map(([year, count]) => {
                     // Calculate height percentage relative to max
                     const max = Math.max(...yearsDist.map(y => y[1]));
                     const height = (count / max) * 100;
                     
                     return (
                         <div key={year} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                             {/* Tooltip */}
                             <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-zinc-900 text-white text-xs py-1 px-2 rounded mb-2 font-mono whitespace-nowrap z-20 pointer-events-none">
                                 {count} Incidents
                             </div>
                             
                             {/* Bar */}
                             <div 
                                className="w-full max-w-[40px] bg-zinc-200 dark:bg-zinc-800 rounded-t-sm hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors relative"
                                style={{ height: `${height}%` }}
                             >
                                 <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-400 dark:bg-zinc-500 opacity-50"></div>
                             </div>
                             
                             {/* Label */}
                             <div className="mt-4 text-xs font-bold font-mono text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{year}</div>
                         </div>
                     );
                 })}
             </div>
        </div>
    </div>
  );
};