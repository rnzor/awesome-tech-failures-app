import React, { useState } from 'react';

type NodeType = 'question' | 'solution' | 'failure';

interface Node {
  id: string;
  type: NodeType;
  text: string;
  details?: string;
  options?: { label: string; nextId: string }[];
}

const WIZARD_DATA: Record<string, Node> = {
  'start': {
    id: 'start',
    type: 'question',
    text: "What is the primary symptom?",
    options: [
      { label: "High Error Rate (5xx)", nextId: "check-errors" },
      { label: "High Latency / Timeout", nextId: "check-latency" },
      { label: "Incorrect Output / Hallucination", nextId: "check-output" }
    ]
  },
  // Error Path
  'check-errors': {
    id: 'check-errors',
    type: 'question',
    text: "Scope of errors?",
    options: [
      { label: "100% (Hard Down)", nextId: "check-deploy" },
      { label: "Intermittent / Flaky", nextId: "check-deps" }
    ]
  },
  'check-deploy': {
    id: 'check-deploy',
    type: 'question',
    text: "Recent deployment?",
    options: [
      { label: "Yes, < 1hr ago", nextId: "sol-rollback" },
      { label: "No changes made", nextId: "check-cert" }
    ]
  },
  'check-cert': {
    id: 'check-cert',
    type: 'question',
    text: "Check Certificates/DNS",
    options: [
      { label: "Expired / NXDOMAIN", nextId: "sol-infra" },
      { label: "Valid & Resolving", nextId: "sol-logs" }
    ]
  },
  // Latency Path
  'check-latency': {
    id: 'check-latency',
    type: 'question',
    text: "Database CPU status?",
    options: [
      { label: "Pegged (100%)", nextId: "sol-db-scale" },
      { label: "Normal Load", nextId: "check-network" }
    ]
  },
  'check-network': {
    id: 'check-network',
    type: 'question',
    text: "Geographic correlation?",
    options: [
      { label: "Specific Region", nextId: "sol-cdn" },
      { label: "Global Issue", nextId: "sol-app-profile" }
    ]
  },
  // Output Path
  'check-output': {
    id: 'check-output',
    type: 'question',
    text: "Component Type?",
    options: [
      { label: "LLM / AI Agent", nextId: "sol-prompt" },
      { label: "Standard Logic", nextId: "sol-bad-data" }
    ]
  },
  // Solutions
  'sol-rollback': { id: 'sol-rollback', type: 'solution', text: "Initiate Rollback", details: "High correlation with deployment. Revert to last known good artifact (LKG) immediately." },
  'sol-infra': { id: 'sol-infra', type: 'solution', text: "Infrastructure Failure", details: "Renew SSL certificates or purge DNS cache. Check cloud provider status page for outages." },
  'sol-logs': { id: 'sol-logs', type: 'failure', text: "Escalate to L2", details: "Deep log analysis required. Look for specific application exceptions or connection refusals." },
  'sol-db-scale': { id: 'sol-db-scale', type: 'solution', text: "Database Saturation", details: "Kill slow queries. Enable read-replicas. Consider vertical scaling if immediate relief needed." },
  'sol-cdn': { id: 'sol-cdn', type: 'solution', text: "Edge/CDN Incident", details: "Reroute traffic from affected PoP. Check CDN provider status." },
  'sol-app-profile': { id: 'sol-app-profile', type: 'failure', text: "Code Optimization", details: "Application profiling required. Suspected memory leak or thread pool starvation." },
  'sol-prompt': { id: 'sol-prompt', type: 'solution', text: "Model/Prompt Drift", details: "Check for prompt injection. Adjust temperature settings or system prompt guardrails." },
  'sol-bad-data': { id: 'sol-bad-data', type: 'solution', text: "Data Corruption", details: "Check upstream data pipelines. Verify schema validation rules." },
  'check-deps': { id: 'check-deps', type: 'question', text: "Dependency Failure?", options: [{ label: "Yes (3rd Party)", nextId: "sol-circuit-breaker"}, {label: "No (Internal)", nextId: "sol-logs"}]} ,
  'sol-circuit-breaker': { id: 'sol-circuit-breaker', type: 'solution', text: "Trip Circuit Breaker", details: "External dependency is failing. Disable calls to prevent cascading failure."}
};

export const TroubleshootingWizard: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['start']);
  const currentId = history[history.length - 1];
  const currentNode = WIZARD_DATA[currentId];

  const handleOptionClick = (nextId: string) => {
    setHistory([...history, nextId]);
  };

  const handleReset = () => {
    setHistory(['start']);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Neural Diagnosis Trace</h2>
            <p className="text-zinc-400">Interactive decision tree. Follow the signal path to isolate the root cause.</p>
        </div>
        <button 
            onClick={handleReset}
            className="text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors uppercase tracking-wider"
        >
            [ Reset Trace ]
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trace History (Left Column) */}
        <div className="lg:col-span-4 relative">
             <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800"></div>
             
             <div className="space-y-6">
                {history.map((stepId, idx) => {
                    const node = WIZARD_DATA[stepId];
                    const isLast = idx === history.length - 1;
                    const isSolution = node.type === 'solution' || node.type === 'failure';
                    
                    return (
                        <div key={idx} className={`relative pl-10 animate-in slide-in-from-left-2 duration-300 ${isLast ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`absolute left-[11px] top-2 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 z-10 ${
                                isSolution ? (node.type === 'solution' ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'
                            } ${isLast && !isSolution ? 'animate-pulse' : ''}`}></div>
                            
                            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-md">
                                <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">
                                    {node.type === 'question' ? `Step ${idx + 1}: Query` : 'Result'}
                                </span>
                                <div className="text-sm font-medium text-zinc-200">{node.text}</div>
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>

        {/* Active Node (Right Column) */}
        <div className="lg:col-span-8">
            <div className="sticky top-6">
                <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                currentNode.type === 'solution' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                currentNode.type === 'failure' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                                {currentNode.type === 'question' ? 'Awaiting Input' : 'Diagnosis Complete'}
                            </span>
                            <div className="h-px flex-1 bg-zinc-800"></div>
                            <span className="text-xs font-mono text-zinc-600">ID: {currentNode.id}</span>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{currentNode.text}</h3>
                        
                        {currentNode.details ? (
                             <div className={`p-6 rounded-lg border mb-6 ${
                                currentNode.type === 'solution' ? 'bg-green-950/20 border-green-500/30' : 'bg-red-950/20 border-red-500/30'
                             }`}>
                                <h4 className={`text-sm font-bold uppercase tracking-widest mb-2 ${
                                    currentNode.type === 'solution' ? 'text-green-400' : 'text-red-400'
                                }`}>Recommended Action</h4>
                                <p className="text-zinc-300 leading-relaxed">{currentNode.details}</p>
                             </div>
                        ) : (
                            <p className="text-zinc-400 mb-8">Select the observed behavior to proceed with the trace.</p>
                        )}

                        {currentNode.options ? (
                            <div className="grid grid-cols-1 gap-3">
                                {currentNode.options.map((opt) => (
                                    <button
                                        key={opt.nextId}
                                        onClick={() => handleOptionClick(opt.nextId)}
                                        className="group relative flex items-center justify-between p-5 bg-zinc-900 border border-zinc-700 rounded-lg hover:border-blue-500 hover:bg-zinc-800 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-blue-400 transition-colors"></div>
                                            <span className="font-medium text-zinc-200 group-hover:text-white text-lg">{opt.label}</span>
                                        </div>
                                        <svg className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <button
                                onClick={handleReset}
                                className="w-full py-4 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Restart Diagnostics
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};