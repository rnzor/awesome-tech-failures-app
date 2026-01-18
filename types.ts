export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info'
}

export enum Category {
  AI_SLOP = 'AI Slop',
  PRODUCTION_OUTAGE = 'Production Outage',
  SECURITY_INCIDENT = 'Security Incident',
  STARTUP_FAILURE = 'Startup Failure',
  UX_DISASTER = 'UX Disaster',
  HARDWARE_FAILURE = 'Hardware Failure'
}

export interface Link {
  title: string;
  url: string;
  type: 'post-mortem' | 'news' | 'github' | 'social';
}

export interface FailureEntry {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  category: Category;
  severity: Severity;
  companies: string[];
  description: string;
  impact?: string;
  tags: string[];
  links: Link[];
}