import React, { useState } from 'react';

const SEVERITY_LEVELS = [
  { level: 'SEV-1', title: 'Critical', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500', desc: 'Immediate executive response required. Core business halted.' },
  { level: 'SEV-2', title: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500', desc: 'Urgent response. Major functionality impaired.' },
  { level: 'SEV-3', title: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500', desc: 'Prioritized response. Minor degradation or workaround available.' },
  { level: 'SEV-4', title: 'Low', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500', desc: 'Planned response. Cosmetic issues or internal tools.' },
  { level: 'SEV-5', title: 'Info', color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700', desc: 'No immediate impact. Tracking only.' },
];

const MATRIX = [
  // Scope 1 (Local) -> Scope 4 (Global)
  // Impact 1 (Cosmetic)
  ['SEV-5', 'SEV-4', 'SEV-4', 'SEV-3'],
  // Impact 2 (Minor)
  ['SEV-4', 'SEV-3', 'SEV-3', 'SEV-2'],
  // Impact 3 (Major)
  ['SEV-3', 'SEV-2', 'SEV-2', 'SEV-1'],
  // Impact 4 (Data Loss)
  ['SEV-2', 'SEV-1', 'SEV-1', 'SEV-1']
];

// Reusable CyberSlider Component
const CyberSlider: React.FC<{
    label: string;
    value: number;
    max: number;
    onChange: (val: number) => void;
    labels: string[];
}> = ({ label, value, max, onChange, labels }) => {
    const percentage = ((value - 1) / (max - 1)) * 100;

    return (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden group hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-sm">
            <div className="flex justify-between items-end mb-6 relative z-10">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{label}</label>
                <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">Level {value}</span>
            </div>

            <div className="relative h-8 flex items-center mb-6 z-10">
                <div className="absolute left-0 right-0 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-200 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${percentage}%` }}></div>
                </div>

                <input 
                    type="range" min="1" max={max} step="1" 
                    value={value} onChange={(e) => onChange(parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                />

                <div 
                    className="absolute h-6 w-6 bg-white dark:bg-zinc-950 border-2 border-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)] pointer-events-none transition-all duration-200 ease-out flex items-center justify-center z-10"
                    style={{ left: `calc(${percentage}% - 12px)` }}
                >
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-white"></div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center relative z-10">
                {labels.map((l, i) => {
                    const isActive = (i + 1) === value;
                    return (
                        <div 
                            key={i} 
                            onClick={() => onChange(i + 1)}
                            className={`text-[10px] uppercase font-mono tracking-tighter cursor-pointer transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-cyan-400 font-bold' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        >
                            {l}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Risk Matrix Grid Component
const RiskMatrix: React.FC<{ impact: number, scope: number }> = ({ impact, scope }) => {
    return (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative">
             <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 text-center">Risk Matrix (Impact x Scope)</h4>
             <div className="grid grid-cols-5 gap-1">
                 {/* Y-Axis Label */}
                 <div className="col-span-1 flex flex-col justify-between py-2 text-[10px] font-mono text-zinc-400 text-right pr-2">
                     <span>Data Loss (4)</span>
                     <span>Major (3)</span>
                     <span>Minor (2)</span>
                     <span>Cosmetic (1)</span>
                 </div>
                 
                 {/* Matrix Cells */}
                 <div className="col-span-4 grid grid-cols-4 grid-rows-4 gap-1">
                     {/* We map in reverse row order for visualization (Impact 4 is top) */}
                     {[3, 2, 1, 0].map((impIdx) => (
                         <React.Fragment key={impIdx}>
                             {[0, 1, 2, 3].map((scoIdx) => {
                                 const sevCode = MATRIX[impIdx][scoIdx];
                                 const isSelected = (impact - 1) === impIdx && (scope - 1) === scoIdx;
                                 
                                 let color = 'bg-zinc-200 dark:bg-zinc-800';
                                 if (sevCode === 'SEV-1') color = 'bg-red-500/20 text-red-500 border border-red-500/30';
                                 if (sevCode === 'SEV-2') color = 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
                                 if (sevCode === 'SEV-3') color = 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
                                 if (sevCode === 'SEV-4') color = 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
                                 if (sevCode === 'SEV-5') color = 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500';

                                 return (
                                     <div 
                                        key={`${impIdx}-${scoIdx}`}
                                        className={`
                                            h-10 flex items-center justify-center text-[10px] font-bold rounded transition-all duration-300
                                            ${isSelected ? 'ring-2 ring-white dark:ring-white scale-110 z-10 shadow-lg ' + color.replace('/20', '') + ' !text-white' : color}
                                            ${!isSelected && 'opacity-60 grayscale-[0.5]'}
                                        `}
                                     >
                                         {sevCode}
                                     </div>
                                 )
                             })}
                         </React.Fragment>
                     ))}
                 </div>
             </div>
             {/* X-Axis Label */}
             <div className="flex justify-between pl-[20%] pt-2 text-[10px] font-mono text-zinc-400 text-center">
                 <span className="flex-1">Single</span>
                 <span className="flex-1">Team</span>
                 <span className="flex-1">Region</span>
                 <span className="flex-1">Global</span>
             </div>
             <div className="text-center text-[10px] font-bold uppercase text-zinc-500 mt-2">Scope Scale →</div>
        </div>
    );
};

export const SeverityCalculator: React.FC = () => {
  const [impact, setImpact] = useState(1);
  const [scope, setScope] = useState(1);
  const [workaround, setWorkaround] = useState(1); // Modifies final score slightly in real scenarios, keeping simple here

  const calculateSeverity = () => {
    // Simple lookup from matrix
    const sevCode = MATRIX[impact - 1][scope - 1];
    return SEVERITY_LEVELS.find(s => s.level === sevCode) || SEVERITY_LEVELS[4];
  };

  const result = calculateSeverity();

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">Incident Severity Calculator</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Determine the standardized risk score based on the <code className="text-blue-600 dark:text-blue-400">severity-system.md</code> protocol.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <CyberSlider 
            label="System Impact"
            value={impact}
            max={4}
            onChange={setImpact}
            labels={['Cosmetic', 'Minor', 'Major', 'Data Loss']}
          />
          <CyberSlider 
            label="User Scope"
            value={scope}
            max={4}
            onChange={setScope}
            labels={['Single', 'Team', 'Region', 'Global']}
          />
          
          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-lg text-xs text-blue-800 dark:text-blue-300">
             <strong>Note:</strong> Workaround availability is currently not factoring into the matrix visualization but should be considered for edge cases.
          </div>
        </div>

        {/* Matrix Visualization */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            <RiskMatrix impact={impact} scope={scope} />

            {/* Result Card */}
            <div className={`relative p-8 rounded-2xl border-2 ${result.bg} ${result.border} shadow-[0_0_30px_-10px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden group flex-1 flex flex-col justify-center`}>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-5xl md:text-6xl font-black ${result.color} tracking-tighter`}>{result.level}</h3>
                        <span className={`px-3 py-1.5 rounded text-sm font-bold uppercase tracking-widest ${result.color} bg-white/50 dark:bg-black/40 border border-current shadow-sm`}>{result.title}</span>
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-100 text-lg font-medium mb-6 leading-relaxed">{result.desc}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/5 dark:border-white/10">
                        <div className="bg-white/40 dark:bg-black/20 p-3 rounded">
                            <span className="block text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">Response SLA</span>
                            <span className="font-mono text-zinc-900 dark:text-white font-bold">{result.level === 'SEV-1' ? '15 min' : result.level === 'SEV-2' ? '1 hour' : '24 hours'}</span>
                        </div>
                        <div className="bg-white/40 dark:bg-black/20 p-3 rounded">
                            <span className="block text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider mb-1">Channel</span>
                            <span className="font-mono text-zinc-900 dark:text-white font-bold">{result.level === 'SEV-1' ? '#incident-crit' : '#dev-ops'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};