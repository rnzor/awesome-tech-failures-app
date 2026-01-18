import React, { useEffect, useState } from 'react';
import { FailureEntry, Severity } from '../types';
import { IncidentHeatmap } from './IncidentHeatmap';

interface Props {
  onNavigate: (view: any) => void;
  entries: FailureEntry[];
}

const TERMINAL_LINES = [
  "Initializing failure_index.db...",
  "Loading severity_protocols...",
  "Analyzing 21+ post-mortems...",
  "System Ready."
];

// News Ticker Component
const Ticker: React.FC<{ entries: FailureEntry[] }> = ({ entries }) => {
    return (
        <div className="w-full bg-zinc-100 dark:bg-black border-y border-zinc-200 dark:border-zinc-800 py-2 overflow-hidden relative flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-100 dark:from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-100 dark:from-black to-transparent z-10"></div>
            
            <div className="whitespace-nowrap animate-[marquee_40s_linear_infinite] flex items-center gap-8 px-4 will-change-transform">
                {entries.concat(entries).map((entry, i) => (
                    <div key={`${entry.id}-${i}`} className="flex items-center gap-2 text-xs font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            entry.severity === Severity.CRITICAL ? 'bg-red-500 animate-pulse' : 
                            entry.severity === Severity.HIGH ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></span>
                        <span className="text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{entry.date}</span>
                        <span className="text-zinc-900 dark:text-zinc-200 font-bold">[{entry.companies[0]}] {entry.title}</span>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export const LandingPage: React.FC<Props> = ({ onNavigate, entries }) => {
  const [typedText, setTypedText] = useState('');
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);
  
  const fullText = "Studying failure is a competitive advantage.";
  
  const criticalCount = entries.filter(e => e.severity === Severity.CRITICAL).length;
  const lastIncident = entries[0]; // Assuming sorted

  // Typewriter effect for main tagline
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [typedText]);

  // Mock terminal loader
  useEffect(() => {
    if (terminalLineIndex < TERMINAL_LINES.length - 1) {
      const timeout = setTimeout(() => {
        setTerminalLineIndex(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [terminalLineIndex]);

  // Premium Glitch Styles
  const glitchStyles = `
    .glitch-text {
      position: relative;
      display: inline-block;
    }
    
    /* Create two duplicate layers for the glitch effect */
    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    /* Red Layer */
    .group:hover .glitch-text::before {
      color: #ff003c;
      z-index: 1;
      opacity: 1;
      animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
      mix-blend-mode: hard-light;
    }

    /* Blue Layer */
    .group:hover .glitch-text::after {
      color: #00f0ff;
      z-index: 2;
      opacity: 1;
      animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
      mix-blend-mode: hard-light;
    }

    @keyframes glitch-anim-1 {
      0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
      20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
      40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
      80% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
      100% { clip-path: inset(30% 0 20% 0); transform: translate(1px, -1px); }
    }
    
    @keyframes glitch-anim-2 {
      0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
      20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
      40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
      60% { clip-path: inset(10% 0 80% 0); transform: translate(-1px, -2px); }
      80% { clip-path: inset(40% 0 40% 0); transform: translate(1px, 2px); }
      100% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 1px); }
    }
  `;

  return (
    <div className="flex flex-col items-center min-h-[80vh] animate-in fade-in duration-700 relative w-full pt-10 md:pt-20">
      <style>{glitchStyles}</style>
      
      {/* Decorative blurred glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>SYSTEM ONLINE</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span className="text-zinc-500">INDEXING {entries.length} FAILURES</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white tracking-tighter leading-[0.9] select-none group cursor-default">
                <div className="inline-block relative">
                   <span className="block glitch-text" data-text="FAILURE">FAILURE</span>
                </div>
                <br />
                <div className="inline-block relative">
                   <span className="block glitch-text" data-text="IS">IS</span>
                </div>
                <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-500 dark:via-purple-500 dark:to-pink-500 animate-pulse-slow group-hover:animate-none transition-all">
                    DATA.
                </span>
            </h1>
            
            <div className="h-8 flex items-center justify-center">
                <p className="text-xl text-zinc-500 dark:text-zinc-400 font-light font-mono flex items-center">
                <span className="text-blue-600 dark:text-blue-500 mr-2">root@index:~#</span>
                {typedText}
                <span className="animate-pulse ml-1 inline-block w-2.5 h-5 bg-blue-600 dark:bg-blue-500 align-middle"></span>
                </p>
            </div>
        </div>

        {/* Ticker integration */}
        <div className="w-full -mx-4 md:mx-0">
             <Ticker entries={entries} />
        </div>

        {/* Heatmap Section */}
        <div className="bg-white/50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
            <IncidentHeatmap entries={entries} />
        </div>
        
        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => onNavigate('feed')}
            className="group relative px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-2">
                Explore Index
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </span>
          </button>
          <button 
            onClick={() => onNavigate('dev-portal')}
            className="px-8 py-4 bg-white/50 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 font-bold text-lg rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            API Docs
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="p-4 bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-lg text-center hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-colors">
                <div className="text-2xl font-black text-zinc-900 dark:text-white">{entries.length}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Incidents</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-lg text-center hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-colors">
                <div className="text-2xl font-black text-red-600 dark:text-red-500">{criticalCount}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Critical Level</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-lg text-center hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-colors">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">100%</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Data Integrity</div>
            </div>
            <div className="p-4 bg-white/50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/50 rounded-lg text-center hover:bg-white/80 dark:hover:bg-zinc-900/40 transition-colors">
                <div className="text-2xl font-black text-zinc-900 dark:text-white">{lastIncident ? new Date(lastIncident.date).getFullYear() : '2026'}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Latest Entry</div>
            </div>
        </div>
      </div>
    </div>
  );
};