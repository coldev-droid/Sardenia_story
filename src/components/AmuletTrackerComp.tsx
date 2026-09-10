import React from 'react';
import { SARDINIA_AMULETS } from '../data/sardiniaData';
import { Shield, Sparkles, CheckCircle2, Circle } from 'lucide-react';

export const AmuletTrackerComp: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 p-8 rounded-2xl border border-amber-900/40 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            Amulets & Artifacts Tracker
          </h1>
        </div>
        <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
          The 12 legendary bronze and obsidian amulets of the Nuraghic Kings that your heroes must discover across the 5 Sardinia adventure books.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SARDINIA_AMULETS.map((amulet) => (
          <div
            key={amulet.id}
            className={`rounded-2xl p-6 border shadow-xl flex flex-col justify-between transition ${
              amulet.discovered
                ? 'bg-stone-900 border-amber-500/40'
                : 'bg-stone-950/80 border-stone-800 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-950 text-amber-300 border border-stone-800">
                  {amulet.bookSource}
                </span>
                {amulet.discovered ? (
                  <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Discovered</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-xs text-stone-400 font-medium">
                    <Circle className="w-4 h-4" />
                    <span>Hidden</span>
                  </span>
                )}
              </div>

              <h3 className="font-serif font-bold text-lg text-stone-100 mb-0.5">{amulet.name}</h3>
              <p className="text-xs font-medium text-amber-400 italic mb-3">{amulet.sardinianName}</p>

              <p className="text-stone-300 text-xs leading-relaxed mb-4">{amulet.description}</p>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Magical Power</span>
              </div>
              <p className="text-xs text-stone-400">{amulet.power}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
