import React from 'react';
import { MapPin, AlertTriangle, Radar } from 'lucide-react';

export const MythicProximityAlert: React.FC = () => {
  return (
    <div className="bg-red-950/20 rounded-2xl border border-red-900/50 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600/80 animate-pulse"></div>
      <div className="flex items-center gap-3 border-b border-red-900/50 pb-4 mb-4">
        <div className="p-2 rounded-lg bg-red-900/30 text-red-400">
          <Radar className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg text-red-400 flex items-center gap-2">
            Mythic Proximity Alert
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-900/50 text-red-200 font-mono tracking-wider">ACTIVE HAZARD</span>
          </h3>
          <p className="text-xs text-red-300/70 pt-1">Geographical convergence detected near an unresolved mythological node.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-950/50 p-4 rounded-xl border border-red-900/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-stone-500">Current Setting:</span>
            <span className="text-stone-200">Balearic Sea (Aboard the Sentina)</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono border-t border-stone-800/50 pt-2">
            <span className="text-stone-500">Unresolved Node:</span>
            <span className="text-orange-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Submarine Approach (Grotta di Nettuno, Alghero)</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono border-t border-stone-800/50 pt-2">
            <span className="text-stone-500">Dormant Entity:</span>
            <span className="text-red-400 font-bold">Cogas (Identity Thieves)</span>
          </div>
        </div>
        
        <div className="bg-red-900/10 p-4 rounded-xl border border-red-900/30 flex flex-col justify-center">
          <p className="text-xs text-red-300 leading-relaxed font-mono">
            <AlertTriangle className="w-4 h-4 inline mr-2 text-red-500" />
            <strong className="text-red-400">WARNING:</strong> The Sentina has survived the Coga assault via spatial quarantine, but is heavily damaged. The yacht has dropped beneath the sea floor, approaching Alghero's ancient stalactite caverns from a deep-water trench.
          </p>
        </div>
      </div>
    </div>
  );
};
