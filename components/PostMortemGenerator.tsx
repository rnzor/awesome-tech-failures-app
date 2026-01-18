import React, { useState } from 'react';

export const PostMortemGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    authors: '',
    status: 'Resolved',
    summary: '',
    impact: '',
    rootCause: '',
    trigger: '',
    resolution: '',
    lessons: ''
  });
  
  const [generated, setGenerated] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateReport = () => {
    const md = `
# Incident Post-Mortem: ${formData.title}

**Date:** ${formData.date}
**Authors:** ${formData.authors}
**Status:** ${formData.status}

## Executive Summary
${formData.summary}

## Impact
${formData.impact}

## Root Cause
${formData.rootCause}

## Trigger
${formData.trigger}

## Resolution
${formData.resolution}

## Lessons Learned
${formData.lessons}

---
*Generated via Awesome Tech Failures*
    `.trim();
    setGenerated(md);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
       <div className="space-y-6">
           <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Post-Mortem Generator</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Create standard SRE incident reports quickly.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Title</label>
                  <input name="title" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm" placeholder="e.g. API Latency Spike" onChange={handleChange} />
              </div>
              <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Status</label>
                  <select name="status" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm" onChange={handleChange}>
                      <option>Resolved</option>
                      <option>Monitoring</option>
                      <option>Investigating</option>
                  </select>
              </div>
           </div>

           <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Executive Summary</label>
                <textarea name="summary" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm h-20" placeholder="High level overview..." onChange={handleChange}></textarea>
           </div>

           <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Root Cause & Trigger</label>
                <div className="grid grid-cols-2 gap-4">
                    <input name="rootCause" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm" placeholder="The underlying issue..." onChange={handleChange} />
                    <input name="trigger" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm" placeholder="What set it off..." onChange={handleChange} />
                </div>
           </div>

           <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Resolution & Recovery</label>
                <textarea name="resolution" className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded p-2 text-sm h-20" placeholder="How was it fixed?" onChange={handleChange}></textarea>
           </div>

           <button onClick={generateReport} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-lg transition-all">
               Generate Report
           </button>
       </div>

       <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 relative flex flex-col h-full">
           <div className="absolute top-4 right-4 text-xs text-zinc-400 font-mono">PREVIEW.md</div>
           <textarea 
             className="flex-1 bg-transparent border-none resize-none font-mono text-sm text-zinc-800 dark:text-zinc-300 focus:ring-0 p-0" 
             value={generated} 
             readOnly
             placeholder="Report preview will appear here..."
           ></textarea>
           {generated && (
               <button 
                onClick={() => navigator.clipboard.writeText(generated)}
                className="mt-4 py-2 px-4 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold uppercase rounded transition-colors"
               >
                   Copy to Clipboard
               </button>
           )}
       </div>
    </div>
  );
};