import React, { useState, useEffect } from 'react';

export const DataIntegrityGauge: React.FC = () => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/04_Batch_1_Source_Ledger.json')
      .then(res => res.json())
      .then(data => {
        const verifiedCount = data.filter((c: any) => c.status === 'VERIFIED_FACT' || c.auditorVerdict === 'PASS_INDEPENDENTLY_VERIFIED').length;
        const total = data.length;
        setScore(total > 0 ? Math.round((verifiedCount / total) * 100) : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  const color = score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400';
  const strokeColor = score >= 90 ? '#34d399' : score >= 70 ? '#fbbf24' : '#fb7185';
  
  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800 shadow-inner">
      <div className="relative w-8 h-8 flex items-center justify-center">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle cx="16" cy="16" r="14" fill="transparent" stroke="#292524" strokeWidth="3" />
          <circle 
            cx="16" cy="16" r="14" fill="transparent" 
            stroke={strokeColor} strokeWidth="3" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            className="transition-all duration-1000 ease-out" 
            strokeLinecap="round" 
          />
        </svg>
        <span className={`absolute text-[9px] font-bold ${color}`}>{score}%</span>
      </div>
      <div className="flex flex-col pr-2">
        <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider leading-tight">Integrity Score</span>
        <span className={`text-[11px] font-bold leading-tight ${color}`}>
          {score >= 90 ? 'HEALTHY' : score >= 70 ? 'WARNING' : 'CRITICAL'}
        </span>
      </div>
    </div>
  );
};
