import React, { useMemo, useState } from 'react';
import { FailureEntry, Category } from '../types';

interface Props {
    entries: FailureEntry[];
    onCellClick?: (params: { category?: Category; year?: number; severity?: string }) => void;
}

export const IncidentHeatmap: React.FC<Props> = ({ entries, onCellClick }) => {
    const [hoveredCell, setHoveredCell] = useState<{ label: string, count: number, score: number, topSeverity: string, year: number, category: Category } | null>(null);

    const CATEGORIES: { id: Category; label: string }[] = [
        { id: 'ai-slop', label: 'AI' },
        { id: 'outage', label: 'OUT' },
        { id: 'security', label: 'SEC' },
        { id: 'startup', label: 'SRT' },
        { id: 'product', label: 'PRD' },
        { id: 'decision', label: 'DEC' },
    ];

    // Get unique years, limit to last 8 years max for fit
    const YEARS = useMemo(() => {
        const allYears = Array.from(new Set(entries.map(e => e.year))).sort((a, b) => a - b);
        return allYears.slice(-8); // Keep last 8 years max
    }, [entries]);

    const gridData = useMemo(() => {
        const data: any[] = [];
        YEARS.forEach(year => {
            CATEGORIES.forEach(cat => {
                const matches = entries.filter(e => e.year === year && e.category === cat.id);
                let score = 0;
                let topSeverity = '';

                if (matches.length > 0) {
                    if (matches.some(e => e.severity?.level === 'critical')) {
                        score = 4;
                        topSeverity = 'Critical';
                    } else if (matches.some(e => e.severity?.level === 'high')) {
                        score = 3;
                        topSeverity = 'High';
                    } else if (matches.some(e => e.severity?.level === 'medium')) {
                        score = 2;
                        topSeverity = 'Medium';
                    } else {
                        score = 1;
                        topSeverity = 'Low';
                    }
                }

                data.push({
                    year,
                    category: cat.id,
                    count: matches.length,
                    score,
                    topSeverity,
                    label: `${year} // ${cat.label}`
                });
            });
        });
        return data;
    }, [entries, YEARS]);

    const getColor = (score: number) => {
        switch (score) {
            case 4: return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]';
            case 3: return 'bg-orange-500';
            case 2: return 'bg-yellow-500';
            case 1: return 'bg-blue-500';
            default: return 'bg-zinc-200 dark:bg-zinc-800/60';
        }
    };

    if (YEARS.length === 0) {
        return (
            <div className="w-full p-6 text-center text-zinc-500 text-sm font-mono">
                Loading incident data...
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col mb-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-zinc-500">
                        Temporal_Incident_Map
                    </span>
                    <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-500">
                        <button onClick={() => onCellClick?.({ severity: 'low' })} className="w-2.5 h-2.5 bg-blue-500 rounded-sm hover:scale-125 transition-transform" title="Filter Low"></button>
                        <button onClick={() => onCellClick?.({ severity: 'medium' })} className="w-2.5 h-2.5 bg-yellow-500 rounded-sm hover:scale-125 transition-transform" title="Filter Medium"></button>
                        <button onClick={() => onCellClick?.({ severity: 'high' })} className="w-2.5 h-2.5 bg-orange-500 rounded-sm hover:scale-125 transition-transform" title="Filter High"></button>
                        <button onClick={() => onCellClick?.({ severity: 'critical' })} className="w-2.5 h-2.5 bg-red-500 rounded-sm shadow-[0_0_3px_red] hover:scale-125 transition-transform" title="Filter Critical"></button>
                    </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600 mt-1 italic">
                    Incident density by category and year. Red = high severity.
                </p>
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1">
                {/* Y-Axis Labels (Categories) */}
                <div className="flex flex-col gap-1 justify-center">
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.id}
                            className="h-5 flex items-center justify-end pr-2"
                        >
                            <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Grid Cells */}
                <div className="flex-1 flex gap-1">
                    {YEARS.map((year) => (
                        <div key={year} className="flex-1 flex flex-col gap-1">
                            {CATEGORIES.map(cat => {
                                const cell = gridData.find(d => d.year === year && d.category === cat.id)!;
                                return (
                                    <button
                                        key={`${year}-${cat.id}`}
                                        onMouseEnter={() => setHoveredCell(cell.count > 0 ? cell : null)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                        onClick={() => cell.count > 0 && onCellClick?.({ category: cell.category, year: cell.year })}
                                        className={`h-5 w-full rounded transition-all duration-200 ${getColor(cell.score)} ${cell.count > 0 ? 'cursor-pointer hover:scale-110 hover:z-10 ring-blue-500/50 hover:ring-1' : 'cursor-default opacity-40'}`}
                                    />
                                );
                            })}
                            {/* Year label */}
                            <div className="h-4 flex items-center justify-center mt-1">
                                <span className="text-[8px] font-mono font-bold text-zinc-400">
                                    {String(year).slice(-2)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hover Info */}
            <div className="h-8 mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/50 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                {hoveredCell ? (
                    <div className="flex items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-zinc-900 dark:text-white font-black">{hoveredCell.label}</span>
                        <span className="text-zinc-400">•</span>
                        <span>{hoveredCell.count} incident{hoveredCell.count !== 1 ? 's' : ''}</span>
                        <span className="text-zinc-400">•</span>
                        <span className={hoveredCell.score === 4 ? 'text-red-500 font-bold' : hoveredCell.score === 3 ? 'text-orange-500 font-bold' : 'text-zinc-500'}>
                            {hoveredCell.topSeverity}
                        </span>
                    </div>
                ) : (
                    <span className="text-zinc-400 opacity-50 uppercase tracking-wider text-[9px]">
                        Hover for details • Click to filter
                    </span>
                )}
                {hoveredCell && (
                    <span className="text-[9px] text-blue-500 font-bold animate-pulse">CLICK_TO_DRILL_DOWN</span>
                )}
            </div>
        </div>
    );
};