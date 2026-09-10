import React, { useState, useEffect, useMemo } from 'react';
import { ChecksumValidationLogs } from './ChecksumValidationLogs';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, BarChart2, CheckCircle, Globe } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell, ReferenceLine, PieChart, Pie } from 'recharts';

export function AuditDashboard() {
  const [rawFiles, setRawFiles] = useState<Record<string, string>>({});
  const [claims, setClaims] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [computedHashes, setComputedHashes] = useState<Record<string, string>>({});
  const [pastedHashes, setPastedHashes] = useState<Record<string, string>>({
    '01_Batch_1_Locations.json': '',
    '02_Batch_1_Myths.json': '',
    '03_Batch_1_Routes.json': '',
    '04_Batch_1_Source_Ledger.json': '',
    '05_Batch_1_Chapter_Matrix.json': ''
  });

  useEffect(() => {
    const fetchAsText = async (url: string) => {
      try {
        const res = await fetch(url);
        return await res.text();
      } catch (e) {
        return '';
      }
    };

    Promise.all([
      fetchAsText('/01_Batch_1_Locations.json'),
      fetchAsText('/02_Batch_1_Myths.json'),
      fetchAsText('/03_Batch_1_Routes.json'),
      fetchAsText('/04_Batch_1_Source_Ledger.json'),
      fetchAsText('/05_Batch_1_Chapter_Matrix.json'),
      fetchAsText('/15_regional_coverage.json')
    ]).then(([locsRaw, mythsRaw, routesRaw, claimsRaw, matrixRaw, regionsRaw]) => {
      const rawMap = {
        '01_Batch_1_Locations.json': locsRaw,
        '02_Batch_1_Myths.json': mythsRaw,
        '03_Batch_1_Routes.json': routesRaw,
        '04_Batch_1_Source_Ledger.json': claimsRaw,
        '05_Batch_1_Chapter_Matrix.json': matrixRaw
      };
      setRawFiles(rawMap);

      try { setClaims(claimsRaw ? JSON.parse(claimsRaw) : []); } catch(e) {}
      try { setRegions(regionsRaw ? JSON.parse(regionsRaw) : []); } catch(e) {}

      const computeHashes = async () => {
        const hashes: Record<string, string> = {};
        const encoder = new TextEncoder();
        for (const [key, content] of Object.entries(rawMap)) {
          if (content) {
            const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(content));
            const hashArray = Array.from(new Uint8Array(buffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            hashes[key] = hashHex;
          }
        }
        setComputedHashes(hashes);
      };
      computeHashes();
    });
  }, []);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    claims.forEach(c => {
      if (c.sources) {
        c.sources.forEach((s: any) => {
          try {
            const url = new URL(s.url);
            const domain = url.hostname.replace(/^www\./, '');
            counts[domain] = (counts[domain] || 0) + 1;
          } catch (e) {}
        });
      }
    });
    return Object.keys(counts).map(k => ({ name: k, count: counts[k] })).sort((a, b) => b.count - a.count).slice(0, 15);
  }, [claims]);

  const completenessData = useMemo(() => {
    let twoOrMore = 0;
    let lessThanTwo = 0;
    claims.forEach(c => {
      if (c.sources && c.sources.length >= 2) twoOrMore++;
      else lessThanTwo++;
    });
    return { twoOrMore, lessThanTwo, total: claims.length };
  }, [claims]);

  return (
    <div className="p-6 bg-stone-900 text-stone-100 min-h-screen space-y-8 animate-in fade-in duration-300">
      
      <header className="border-b border-stone-800 pb-4">
        <h2 className="text-2xl font-serif font-bold text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6" /> Internal Audit Dashboard: Sardinia Master Atlas
        </h2>
        <p className="text-stone-400 text-sm mt-2">Zero-Invention Research Firewall strict enforcement logs.</p>
      </header>

      <ChecksumValidationLogs />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evidence Completeness Gate Component */}
        <section className="bg-stone-950 p-6 rounded-xl border border-stone-800 shadow-inner">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> EvidenceCompletenessGate
          </h3>
          <p className="text-stone-400 text-sm mb-6">Ratio of two-source verification across {completenessData.total} claims.</p>
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: '2+ Sources (Compliant)', value: completenessData.twoOrMore },
                      { name: '< 2 Sources (Deficient)', value: completenessData.lessThanTwo }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#f5f5f4' }}
                    itemStyle={{ color: '#d6d3d1' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            <div className={`p-3 rounded border flex justify-between items-center ${completenessData.twoOrMore > 0 ? 'bg-emerald-900/20 border-emerald-800/50 text-emerald-300' : 'bg-stone-800 border-stone-700'}`}>
              <span>Compliant (2+ Sources)</span>
              <span className="font-bold">{completenessData.twoOrMore} claims</span>
            </div>
            <div className={`p-3 rounded border flex justify-between items-center ${completenessData.lessThanTwo > 0 ? 'bg-rose-900/20 border-rose-800/50 text-rose-300' : 'bg-stone-800 border-stone-700'}`}>
              <span>Deficient (&lt; 2 Sources)</span>
              <span className="font-bold">{completenessData.lessThanTwo} claims</span>
            </div>
          </div>
        </section>

        {/* Regional Coverage Chart */}
        <section className="bg-stone-950 p-6 rounded-xl border border-stone-800 shadow-inner">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-400" /> Heritage Site Regional Registration
          </h3>
          <p className="text-stone-400 text-sm mb-6">Mandatory baseline research requires a minimum of 10 heritage sites per region.</p>
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
                    <Cell key={`cell-${index}`} fill={entry.sites >= 10 ? '#f97316' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      

    </div>
  );
}
