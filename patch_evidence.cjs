const fs = require('fs');

const newCode = `import React, { useMemo, useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ShieldAlert, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';

interface SourceData {
  url: string;
  publisher: string;
}

interface ClaimData {
  id: string;
  entityId?: string;
  claim: string;
  status: string;
  writerVerdict?: string;
  auditorVerdict: string;
  sources: SourceData[];
}

export function EvidenceCompletenessGate() {
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [regions, setRegions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/04_Batch_1_Source_Ledger.json')
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(() => {});

    fetch('/15_regional_coverage.json')
      .then(res => res.json())
      .then(data => setRegions(data))
      .catch(() => {});
  }, []);

  const stats = useMemo(() => {
    let twoSourceCount = 0;
    let missingWriter = 0;
    let missingAuditor = 0;
    let passedVerdict = 0;
    
    claims.forEach(c => {
      const wSrc = c.sources && c.sources[0];
      const aSrc = c.sources && c.sources[1];
      if (wSrc && aSrc) twoSourceCount++;
      if (!wSrc) missingWriter++;
      if (!aSrc) missingAuditor++;
      if (c.auditorVerdict === 'PASS_INDEPENDENTLY_VERIFIED' || c.auditorVerdict === 'PASS') passedVerdict++;
    });
    
    const ratio = claims.length > 0 ? (twoSourceCount / claims.length) * 100 : 0;
    
    return {
      total: claims.length,
      twoSourceCount,
      missingWriter,
      missingAuditor,
      passedVerdict,
      ratio: ratio.toFixed(1)
    };
  }, [claims]);

  return (
    <div className="p-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Evidence Completeness Gate
            </h2>
            <p className="text-xs text-stone-400 pt-1">
              Zero-Invention Firewall enforcement: analyzing two-source verification ratios.
            </p>
          </div>
          <span className={\`px-3 py-1 rounded-full text-xs font-mono font-semibold border \${stats.ratio === '100.0' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}\`}>
            COMPLIANCE: {stats.ratio}%
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Total Claims</span>
            <div className="text-2xl font-bold font-mono text-stone-100">{stats.total}</div>
          </div>
          <div className="bg-stone-950 p-4 rounded-xl border border-emerald-900/50 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-mono block">Fully Verified (2+ Sources)</span>
            <div className="text-2xl font-bold font-mono text-emerald-100">{stats.twoSourceCount}</div>
          </div>
          <div className="bg-stone-950 p-4 rounded-xl border border-rose-900/50 space-y-1">
            <span className="text-[10px] text-rose-400 uppercase font-mono block">Missing Sources</span>
            <div className="text-2xl font-bold font-mono text-rose-100">{stats.missingWriter + stats.missingAuditor}</div>
          </div>
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Pass Verdicts</span>
            <div className="text-2xl font-bold font-mono text-stone-100">{stats.passedVerdict}</div>
          </div>
        </div>
        
        {/* Heritage Site Regional Registration Chart */}
        <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 shadow-inner mt-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-400" /> Heritage Site Regional Registration
          </h3>
          <p className="text-stone-400 text-sm mb-6">Visualizing regional distribution to ensure all areas meet the mandatory research baseline.</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#44403c" vertical={false} />
                <XAxis dataKey="name" stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 12}} angle={-45} textAnchor="end" />
                <YAxis stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#292524'}}
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#f5f5f4' }}
                />
                <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Mandatory Research Baseline (10)', fill: '#ef4444', fontSize: 12 }} />
                <Bar dataKey="sites" radius={[4, 4, 0, 0]}>
                  {regions.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.sites >= 10 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-serif font-bold text-sm text-stone-200">Claim Registry</h3>
          <div className="space-y-3">
            {claims.map(claim => {
              const writerSource = claim.sources && claim.sources[0] ? claim.sources[0].publisher : null;
              const auditorSource = claim.sources && claim.sources[1] ? claim.sources[1].publisher : null;
              const isPass = claim.auditorVerdict === 'PASS_INDEPENDENTLY_VERIFIED' || claim.auditorVerdict === 'PASS';
              
              return (
                <div 
                  key={claim.id} 
                  className={\`bg-stone-950 p-4 rounded-xl border \${isPass ? 'border-emerald-900/50' : 'border-rose-900/50'} space-y-3\`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-amber-400">{claim.id}</span>
                        {claim.entityId && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-900 text-stone-400 border border-stone-800">
                            {claim.entityId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-200 font-serif">{claim.claim}</p>
                    </div>
                    <div className={\`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border \${
                      isPass ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                      claim.auditorVerdict === 'FAIL' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      'bg-amber-950 text-amber-400 border-amber-800'
                    }\`}>
                      {claim.auditorVerdict.replace('_INDEPENDENTLY_VERIFIED', '')}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 pt-3 border-t border-stone-800/60">
                    <div className={\`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 \${writerSource ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-rose-950/30 border-rose-900/50 text-rose-400'}\`}>
                      {writerSource ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />}
                      <div>
                        <span className="block text-[10px] text-stone-500 uppercase mb-0.5">Writer Source</span>
                        {writerSource || 'MISSING SOURCE'}
                      </div>
                    </div>
                    <div className={\`p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 \${auditorSource ? 'bg-stone-900 border-stone-800 text-stone-300' : 'bg-amber-950/30 border-amber-900/50 text-amber-400'}\`}>
                      {auditorSource ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                      <div>
                        <span className="block text-[10px] text-stone-500 uppercase mb-0.5">Auditor Source</span>
                        {auditorSource || 'MISSING INDEPENDENT SOURCE'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/EvidenceCompletenessGate.tsx', newCode);
