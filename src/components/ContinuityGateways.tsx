import React from 'react';
import { FileKey, DoorOpen } from 'lucide-react';

export const ContinuityGateways: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-2">
          <DoorOpen className="w-5 h-5 text-indigo-400" /> Chapter Continuity Gateways
        </h2>
        <p className="text-sm text-stone-400 mb-6">Pre-flight and Post-flight document constraints. State machine requires these forms before generating prose or locking.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800">
            <h3 className="font-bold text-stone-200 mb-4 border-b border-stone-800 pb-2 text-sm flex items-center gap-2">
              <FileKey className="w-4 h-4 text-amber-500" /> 00_chapter_direction_guide.md
            </h3>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Previous-chapter continuity</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Myth Continuity Note</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> New myth direction (Pending)</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Location intelligence dossier</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Local human integration</li>
            </ul>
          </div>

          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800">
            <h3 className="font-bold text-stone-200 mb-4 border-b border-stone-800 pb-2 text-sm flex items-center gap-2">
              <FileKey className="w-4 h-4 text-indigo-500" /> 06_myth_amulet_continuity_note.md
            </h3>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Story state validation</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Myth state validation</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Amulet state validation</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone-700"></div> Narrative debt ledger</li>
            </ul>
            <div className="mt-4 p-2 bg-rose-950/20 border border-rose-900/30 rounded text-[11px] text-rose-400 font-mono">
              STATUS: BLOCKED (Awaiting Prose Generation)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
