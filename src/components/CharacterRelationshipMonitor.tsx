import React from 'react';
import { Users, Heart, Zap, AlertCircle } from 'lucide-react';

export const CharacterRelationshipMonitor: React.FC = () => {
  const relationships = [
    { type: 'Blood Family', members: 'Geronimo, Veerle, Katia', description: 'Biological siblings. Shared memories and protective instincts.', status: 'STABLE' },
    { type: 'Blood Family', members: 'Maris, Inga', description: 'Brother and sister. Risk calculation vs trusting behavior.', status: 'TENSION', note: 'Maris calculating Inga\'s risks' },
    { type: 'Marriage', members: 'Inga, André', description: 'Husband and wife. Concealed history unfolds slowly.', status: 'STABLE' },
    { type: 'Professional', members: 'Geronimo, Maris', description: 'Future-project partners. Visionary (Geronimo) vs Pragmatic Calculator (Maris).', status: 'STABLE' },
    { type: 'Business', members: 'Geronimo, André', description: 'Barcelona company co-owners. Legitimate operational foundation.', status: 'STABLE' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-rose-400" /> Character Relationship Monitor
        </h2>
        <p className="text-sm text-stone-400 mb-6">Enforcing locked relationship matrices. Inspecting prose for psychological continuity and preventing degradation into generic friendships.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relationships.map((rel, i) => (
            <div key={i} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                    {rel.type}
                  </span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    rel.status === 'STABLE' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' : 'bg-amber-950/30 text-amber-400 border-amber-900/50'
                  }`}>
                    {rel.status}
                  </span>
                </div>
                <h3 className="font-bold text-stone-200 mb-1">{rel.members}</h3>
                <p className="text-xs text-stone-400">{rel.description}</p>
              </div>
              {rel.note && (
                <div className="mt-4 pt-3 border-t border-stone-800 flex items-start gap-2 text-[11px] text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{rel.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
