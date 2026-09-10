import React from 'react';
import { SplitSquareHorizontal, ShieldAlert, ArrowRightLeft } from 'lucide-react';

export const ParallelTimelineTracker: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-2">
          <SplitSquareHorizontal className="w-5 h-5 text-amber-400" /> Parallel Timeline & Custody Tracker
        </h2>
        <p className="text-sm text-stone-400 mb-6">Monitoring split missions to prevent impossible knowledge transfer. Synchronizing reunification requirements.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-800 hidden lg:block border-dashed"></div>
          
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800">
            <h3 className="font-bold text-stone-200 mb-4 border-b border-stone-800 pb-2">Subgroup A: Mineral Investigation</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Members</span>
                <span className="text-amber-400 font-bold">Katia, Veerle, Inga</span>
              </div>
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Custody</span>
                <span className="text-stone-300">Obsidian Eye, Mining Charts</span>
              </div>
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Objective</span>
                <span className="text-stone-300 text-right max-w-[200px]">Extract raw material from verified deposit</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800">
            <h3 className="font-bold text-stone-200 mb-4 border-b border-stone-800 pb-2">Subgroup B: Myth Confrontation</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Members</span>
                <span className="text-indigo-400 font-bold">Geronimo, Maris, André</span>
              </div>
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Custody</span>
                <span className="text-stone-300">Sentina Vessel, Communications</span>
              </div>
              <div className="flex justify-between text-xs font-mono border-b border-stone-800/50 pb-2">
                <span className="text-stone-500">Objective</span>
                <span className="text-stone-300 text-right max-w-[200px]">Hold perimeter against active myth manifestation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-stone-950 p-4 rounded-xl border border-amber-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs text-stone-500 font-mono block">Reunion Constraint</span>
              <span className="text-sm font-bold text-stone-200">Intersection pending at Node: ARR (Grotta di Nettuno)</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded bg-rose-950/30 text-rose-400 text-xs font-mono border border-rose-900/50">NO COMMS ALLOWED</span>
        </div>
      </div>
    </div>
  );
};
