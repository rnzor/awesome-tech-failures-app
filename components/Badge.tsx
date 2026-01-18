import React from 'react';
import { Category, Severity } from '../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
  type?: 'category' | 'severity' | 'tag';
  value?: string;
}

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case Category.AI_SLOP: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case Category.PRODUCTION_OUTAGE: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case Category.SECURITY_INCIDENT: return 'bg-red-500/10 text-red-400 border-red-500/20';
    case Category.STARTUP_FAILURE: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    case Category.UX_DISASTER: return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  }
};

const getSeverityColor = (sev: string) => {
  switch (sev) {
    case Severity.CRITICAL: return 'text-red-500 border-red-500/50 bg-red-950/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse-slow';
    case Severity.HIGH: return 'text-orange-500 border-orange-500/50 bg-orange-950/30';
    case Severity.MEDIUM: return 'text-yellow-500 border-yellow-500/50 bg-yellow-950/30';
    default: return 'text-green-500 border-green-500/50 bg-green-950/30';
  }
};

export const Badge: React.FC<BadgeProps> = ({ children, className = '', type, value }) => {
  let colorClass = 'bg-zinc-800 text-zinc-300 border-zinc-700';

  if (type === 'category' && value) {
    colorClass = getCategoryColor(value);
  } else if (type === 'severity' && value) {
    colorClass = getSeverityColor(value);
  } else if (type === 'tag') {
    colorClass = 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:border-zinc-500 hover:text-zinc-200 transition-colors';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass} ${className}`}>
      {children}
    </span>
  );
};