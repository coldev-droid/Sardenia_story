import React, { useState } from 'react';
import { SARDINIA_LORE_LOCATIONS } from '../data/sardiniaData';
import { Compass, MapPin, Sparkles, ShieldAlert } from 'lucide-react';

export const SardiniaLoreExplorer: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState(SARDINIA_LORE_LOCATIONS[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 p-8 rounded-2xl border border-amber-900/40 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Compass className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            Sardinia Myth & Lore Explorer
          </h1>
        </div>
        <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
          Discover the ancient historical and mystical backdrop of your 5 award-winning adventure books. Each site anchors your characters in authentic Sardinian heritage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Locations List */}
        <div className="lg:col-span-5 space-y-3">
          {SARDINIA_LORE_LOCATIONS.map((loc) => {
            const isSelected = selectedLoc.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isSelected
                    ? 'bg-amber-600/20 border-amber-500/60 shadow-lg text-stone-100'
                    : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-950 text-amber-400 border border-stone-800">
                    {loc.type}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{loc.region}</span>
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-100 mb-1">{loc.name}</h3>
                <p className="text-xs text-stone-400 line-clamp-2">{loc.description}</p>
              </div>
            );
          })}
        </div>

        {/* Location Detail View */}
        <div className="lg:col-span-7">
          <div className="bg-stone-950 rounded-2xl border border-stone-800 p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  {selectedLoc.region}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
                  {selectedLoc.name}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-xs font-medium">
                {selectedLoc.type}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Historical & Geographical Overview
                </h4>
                <p className="text-stone-200 leading-relaxed text-sm sm:text-base font-serif">
                  {selectedLoc.description}
                </p>
              </div>

              <div className="p-5 bg-stone-900 rounded-xl border border-amber-900/30">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Magical Saga Secret</span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed italic">
                  "{selectedLoc.magicalSecret}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
