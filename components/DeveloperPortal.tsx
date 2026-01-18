import React, { useState, useMemo } from 'react';
import { API_SPEC_MOCK, RAG_GUIDE_CODE } from '../services/devResources';
import { FailureEntry } from '../types';
import { loadFailures } from '../services/dataService';

export const DeveloperPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'rag' | 'search'>('api');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<FailureEntry[]>([]);

  // Load data for the search simulator
  React.useEffect(() => {
    loadFailures().then(setEntries);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAG_GUIDE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate semantic retrieval by searching tags and description
  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries.slice(0, 2);
    return entries.filter(e => 
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit to top 5 "chunks"
  }, [entries, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Developer Portal</h2>
        <p className="text-zinc-400">Resources for building agents, RAG pipelines, and integrations.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 mb-8 inline-flex">
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'api' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          API Reference
        </button>
        <button
          onClick={() => setActiveTab('rag')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'rag' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          RAG Guide
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'search' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Data Explorer
        </button>
      </div>

      {/* API Content */}
      {activeTab === 'api' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold">{API_SPEC_MOCK.info.title}</h3>
                <p className="text-zinc-500 text-xs">v{API_SPEC_MOCK.info.version}</p>
              </div>
              <div className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">Base URL: {API_SPEC_MOCK.servers[0].url}</div>
            </div>
            
            <div className="divide-y divide-zinc-800">
              {API_SPEC_MOCK.paths.map((endpoint, idx) => (
                <div key={idx} className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-zinc-200 font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">{endpoint.description}</p>
                  
                  {endpoint.params.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Parameters</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-400">
                          <thead>
                            <tr className="border-b border-zinc-800">
                              <th className="pb-2 font-medium">Name</th>
                              <th className="pb-2 font-medium">In</th>
                              <th className="pb-2 font-medium">Type</th>
                              <th className="pb-2 font-medium">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {endpoint.params.map((param, pIdx) => (
                              <tr key={pIdx}>
                                <td className="py-2 font-mono text-zinc-300">{param.name}{param.required && <span className="text-red-400">*</span>}</td>
                                <td className="py-2 text-zinc-500">{param.in}</td>
                                <td className="py-2 text-blue-400/80">{param.type}</td>
                                <td className="py-2">{param.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {endpoint.body && (
                      <div className="mt-4 bg-black/30 p-3 rounded border border-zinc-800">
                          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Body</h4>
                          <pre className="text-xs text-zinc-300 font-mono">{JSON.stringify(endpoint.body, null, 2)}</pre>
                      </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RAG Guide Content */}
      {activeTab === 'rag' && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Embeddings Integration</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  How to retrieve failure context for your AI Agents using LangChain.
                </p>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition-colors"
              >
                {copied ? (
                  <><span className="text-green-400">✓</span> Copied</>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Snippet
                  </>
                )}
              </button>
            </div>

            <div className="relative group">
              <div className="absolute top-0 right-0 p-2 text-xs text-zinc-600 font-mono">python</div>
              <pre className="bg-[#0d0d0d] p-4 rounded-lg border border-zinc-800 overflow-x-auto text-sm font-mono leading-relaxed text-blue-100">
                <code>{RAG_GUIDE_CODE}</code>
              </pre>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                  <h4 className="font-bold text-white text-sm mb-2">Vector Schema</h4>
                  <ul className="text-xs text-zinc-400 space-y-1 list-disc pl-4">
                      <li><strong>id</strong>: Failure ID</li>
                      <li><strong>vector</strong>: 1536-dim (text-embedding-3-small)</li>
                      <li><strong>metadata</strong>: title, tags, severity, date</li>
                  </ul>
               </div>
               <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                  <h4 className="font-bold text-white text-sm mb-2">Chunking Strategy</h4>
                  <p className="text-xs text-zinc-400">
                      Entries are chunked by the <code>description</code> and <code>impact</code> fields to ensure high semantic relevance during retrieval.
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Simulator Content */}
      {activeTab === 'search' && (
        <div className="animate-in fade-in duration-300">
             <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Simulator: Agent Context Retrieval</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by root cause (e.g., 'typo', 'dns', 'battery')..."
                        className="block w-full pl-10 pr-4 py-3 border border-zinc-700 rounded-lg bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <p className="mt-2 text-xs text-zinc-500">
                    This tool simulates how an agent "sees" the data: retrieving raw JSON objects based on semantic relevance tags.
                </p>
            </div>

            <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                    filteredEntries.map(entry => (
                        <div key={entry.id} className="bg-[#0d0d0d] rounded-lg border border-zinc-800 p-4 font-mono text-xs overflow-x-auto relative group">
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] uppercase">
                                Match Score: {searchQuery ? ((Math.random() * 0.15) + 0.85).toFixed(4) : '1.000'}
                            </div>
                            <pre className="text-zinc-300">
{JSON.stringify({
    id: entry.id,
    vector_content: `${entry.title}: ${entry.description}`,
    metadata: {
        severity: entry.severity,
        tags: entry.tags
    }
}, null, 2)}
                            </pre>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-zinc-800 border-dashed rounded-lg">
                        <p className="text-zinc-500">No context found for query.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};