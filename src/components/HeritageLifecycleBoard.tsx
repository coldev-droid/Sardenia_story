import React from 'react';
import { Columns, Building2, Flame } from 'lucide-react';

export const HeritageLifecycleBoard: React.FC = () => {
  const columns = ['RESEARCHED', 'PLANNED', 'USED', 'CONSEQUENCE_ACTIVE', 'RESOLVED'];
  const sites = [
    { id: 'S-01', name: 'Grotta di Nettuno', type: 'Cave', status: 'CONSEQUENCE_ACTIVE' },
    { id: 'S-02', name: 'Su Nuraxi di Barumini', type: 'UNESCO', status: 'PLANNED' },
    { id: 'S-03', name: 'Torre del Porticciolo', type: 'Tower', status: 'USED' },
    { id: 'S-04', name: 'Tharros Ruins', type: 'Archaeological', status: 'RESEARCHED' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl overflow-x-auto">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-2">
          <Columns className="w-5 h-5 text-emerald-400" /> Heritage Coverage Lifecycle Board
        </h2>
        <p className="text-sm text-stone-400 mb-6 min-w-[800px]">Tracking strict usage lifecycle for historical sites to prevent missing UNESCO properties or unresolved narrative consequences.</p>

        <div className="flex gap-4 min-w-[1000px]">
          {columns.map(col => (
            <div key={col} className="flex-1 bg-stone-950 rounded-xl border border-stone-800 p-3 min-h-[400px]">
              <div className="text-[10px] font-mono font-bold text-stone-500 mb-4 pb-2 border-b border-stone-800">
                {col}
              </div>
              <div className="space-y-3">
                {sites.filter(s => s.status === col).map(site => (
                  <div key={site.id} className="bg-stone-900 p-3 rounded-lg border border-stone-700 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 border border-stone-800">{site.type}</span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-200 leading-tight">{site.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
