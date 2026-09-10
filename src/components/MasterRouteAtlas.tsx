import React from 'react';
import { Map, MapPin, Anchor, Navigation, AlertTriangle } from 'lucide-react';

export const MasterRouteAtlas: React.FC = () => {
  const routeNodes = [
    { id: 'DEP', label: 'Departure', location: 'Barcelona Port Vell', coords: '41.3784° N, 2.1925° E', status: 'COMPLETED' },
    { id: 'TRN', label: 'Transit', location: 'Balearic Sea', coords: 'Mid-crossing', status: 'COMPLETED', note: 'Spatial quarantine engaged. Sentina damaged.' },
    { id: 'INT', label: 'Intermediate Position', location: 'Submarine Trench', coords: 'Approaching Capo Caccia', status: 'ACTIVE', note: 'Below sea level. Avoid radar detection.' },
    { id: 'ARR', label: 'Arrival', location: 'Grotta di Nettuno (Alghero)', coords: '40.5674° N, 8.1583° E', status: 'PENDING' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-2">
          <Map className="w-5 h-5 text-indigo-400" /> Master Route Atlas
        </h2>
        <p className="text-sm text-stone-400 mb-6">Strict geographic enforcement: DEPARTURE → TRANSIT → INTERMEDIATE → ARRIVAL. No unexplained relocation.</p>
        
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-800 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {routeNodes.map((node, i) => (
              <div key={node.id} className="bg-stone-950 border border-stone-700 p-4 rounded-xl shadow-lg relative">
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-stone-950 flex items-center justify-center ${
                  node.status === 'COMPLETED' ? 'bg-emerald-500' :
                  node.status === 'ACTIVE' ? 'bg-amber-500 animate-pulse' : 'bg-stone-700'
                }`}>
                  {node.status === 'ACTIVE' && <Navigation className="w-3 h-3 text-stone-900" />}
                </div>
                <div className="text-center mt-3">
                  <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider">{node.label}</span>
                  <h4 className="font-bold text-stone-200 mt-1 mb-2">{node.location}</h4>
                  <div className="bg-stone-900 rounded p-2 text-xs font-mono text-stone-400 flex items-center justify-center gap-2">
                    <MapPin className="w-3 h-3" /> {node.coords}
                  </div>
                  {node.note && (
                    <div className="mt-3 text-[11px] text-amber-400/80 bg-amber-950/20 p-2 rounded flex items-start gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span className="text-left">{node.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
