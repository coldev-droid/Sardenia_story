import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StatusLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-sm mt-4">
      <span className="text-sm font-serif font-bold text-stone-200 mr-2">Status Key:</span>
      <div className="flex items-center space-x-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-900/50">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-mono font-medium text-emerald-300">Approved</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/50">
        <XCircle className="w-4 h-4 text-rose-400" />
        <span className="text-xs font-mono font-medium text-rose-300">Rejected</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/50">
        <AlertCircle className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-mono font-medium text-amber-300">Disputed</span>
      </div>
    </div>
  );
};
