import React, { useMemo, useState } from 'react';
import { FailureEntry, Severity } from '../types';

interface Props {
  entries: FailureEntry[];
}

export const IncidentHeatmap: React.FC<Props> = ({ entries }) => {
  const [hoveredCell, setHoveredCell] = useState<{date: string, count: number, topSeverity: string} | null>(null);

  // Generate last 365 days
  const calendarData = useMemo(() => {
    const today = new Date();
    const data = [];
    // Go back 52 weeks * 7 days
    for (let i = 0; i < 364; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - (363 - i));
        const dateStr = d.toISOString().split('T')[0];
        
        // Find entries for this date
        const daysEntries = entries.filter(e => e.date === dateStr);
        let severityScore = 0;
        let topSeverity = '';

        if (daysEntries.length > 0) {
            // Determine "heat" based on severity
            if (daysEntries.some(e => e.severity === Severity.CRITICAL)) {
                severityScore = 4;
                topSeverity = 'Critical';
            } else if (daysEntries.some(e => e.severity === Severity.HIGH)) {
                severityScore = 3;
                topSeverity = 'High';
            } else if (daysEntries.some(e => e.severity === Severity.MEDIUM)) {
                severityScore = 2;
                topSeverity = 'Medium';
            } else {
                severityScore = 1;
                topSeverity = 'Low';
            }
        }

        data.push({
            date: dateStr,
            count: daysEntries.length,
            score: severityScore,
            topSeverity
        });
    }
    return data;
  }, [entries]);

  // Group by weeks for vertical column layout
  const weeks = useMemo(() => {
    const w = [];
    for (let i = 0; i < calendarData.length; i += 7) {
        w.push(calendarData.slice(i, i + 7));
    }
    return w;
  }, [calendarData]);

  const getColor = (score: number) => {
      switch(score) {
          case 4: return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
          case 3: return 'bg-orange-500';
          case 2: return 'bg-yellow-500';
          case 1: return 'bg-blue-500';
          default: return 'bg-zinc-200 dark:bg-zinc-800/80'; // Empty state theme aware
      }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex flex-col gap-2 min-w-[800px]">
            <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">365-Day Incident Frequency</span>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                    <span>Less</span>
                    <div className="w-2 h-2 bg-zinc-200 dark:bg-zinc-900 rounded-sm"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-sm"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-sm shadow-[0_0_4px_red]"></div>
                    <span>More</span>
                </div>
            </div>
            
            <div className="flex gap-1">
                {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                        {week.map((day, dIdx) => (
                            <div 
                                key={day.date}
                                onMouseEnter={() => setHoveredCell(day.count > 0 ? day : null)}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`w-2.5 h-2.5 rounded-sm transition-all duration-200 ${getColor(day.score)} relative group cursor-default`}
                            >
                                {/* Only show tooltip if this specific cell is hovered */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Contextual Info Bar */}
            <div className="h-6 mt-1 text-xs font-mono text-zinc-400 flex items-center">
                {hoveredCell ? (
                    <span className="animate-in fade-in duration-200">
                        <span className="text-zinc-900 dark:text-white font-bold">{hoveredCell.date}</span>: {hoveredCell.count} Incident{hoveredCell.count !== 1 ? 's' : ''} recorded. Max Severity: <span className={hoveredCell.score === 4 ? 'text-red-500 dark:text-red-400' : 'text-blue-500 dark:text-blue-400'}>{hoveredCell.topSeverity}</span>
                    </span>
                ) : (
                    <span className="text-zinc-400 dark:text-zinc-600 opacity-50">Hover over the grid to view historical density...</span>
                )}
            </div>
        </div>
    </div>
  );
};