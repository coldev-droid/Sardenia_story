import React, { useState, useEffect, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function SourceDomainDistribution() {
  const [claims, setClaims] = useState<any[]>([]);

  useEffect(() => {
    fetch('/04_Batch_1_Source_Ledger.json')
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(() => {});
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
    return Object.keys(counts)
      .map(k => ({ name: k, count: counts[k] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [claims]);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl mt-6">
      <h3 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-400" /> Source Domain Distribution
      </h3>
      <p className="text-stone-400 text-sm mb-6">Frequency of unique source domains to monitor institutional vs non-institutional reliance. This helps identify over-reliance on non-academic websites.</p>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={domainCounts} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#44403c" horizontal={false} />
            <XAxis type="number" stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 12}} />
            <YAxis dataKey="name" type="category" stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 11}} width={120} />
            <Tooltip 
              cursor={{fill: '#292524'}}
              contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#f5f5f4' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
