import React from 'react';
import { Map, Flag, Compass, Landmark, Diamond } from 'lucide-react';

const routeElements = [
  { category: 'Amulets & Artifacts', items: ['Obsidian Eye (Secured)', 'Nuragic Bronze Boat (Target)', "Weaver's Needle (Unfound)"] },
  { category: 'Historical Figures', items: ['Maria Lai (Referenced)', 'Grazia Deledda (Guide)', "Eleonora d'Arborea (Upcoming)"] },
  { category: 'UNESCO & Archaeology', items: ['Su Nuraxi (Ch 4)', "Mont'e Prama (Ch 1)", 'Tharros Ruins (Planned)'] },
  { category: 'Natural Wonders & Caves', items: ['Gola di Gorropu (Active)', "Neptune's Grotto (Epilogue)", 'Gennargentu Peaks (Planned)'] },
  { category: 'Towns & Local Culture', items: ['Orgosolo (Murals)', 'Mamoiada (Masks)', 'Castelsardo (Weaving)'] },
  { category: 'Secret Places', items: ['Tiscali Sinkhole (Approaching)', 'Santa Cristina Well (Secured)', 'Domus de Janas (Active)'] }
];

export const RouteMasterPlanner: React.FC = () => {
  return (
    <div className="bg-stone-900 rounded-2xl border border-emerald-900/50 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-100">Expedition Route Planner</h2>
            <p className="text-xs text-stone-400 pt-1">Comprehensive checklist of all Sardinian elements to ensure zero omissions.</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-950 border border-emerald-900 rounded-lg text-emerald-400 font-mono text-xs flex items-center gap-2">
          <Compass className="w-4 h-4 animate-spin-slow" /> Route Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routeElements.map((group, idx) => (
          <div key={idx} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
            <h3 className="font-bold text-emerald-500 text-sm flex items-center gap-2 border-b border-stone-800 pb-2">
              {idx === 0 && <Diamond className="w-4 h-4" />}
              {idx === 1 && <Flag className="w-4 h-4" />}
              {idx > 1 && <Landmark className="w-4 h-4" />}
              {group.category}
            </h3>
            <ul className="space-y-2">
              {group.items.map((item, i) => {
                const isDone = item.includes('(Secured)') || item.includes('(Referenced)') || item.includes('(Ch ');
                const isActive = item.includes('(Active)') || item.includes('(Approaching)');
                return (
                  <li key={i} className={`flex items-start gap-2 text-xs font-mono ${isDone ? 'text-stone-600 line-through' : isActive ? 'text-amber-400' : 'text-stone-300'}`}>
                    <span className={`mt-0.5 ${isDone ? 'text-stone-700' : 'text-emerald-500'}`}>•</span>
                    <span>{item}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Next Waypoint Injection</h4>
        <p className="text-sm text-stone-300 font-mono leading-relaxed">
          Route requires immediate traversal to <span className="text-amber-400 font-bold">Tharros</span> to intercept the Nuragic Bronze Boat. Must incorporate local <span className="text-teal-400 font-bold">Phoenician historical layers</span> to satisfy the Geographical and Historical acquisition laws.
        </p>
      </div>
    </div>
  );
};
