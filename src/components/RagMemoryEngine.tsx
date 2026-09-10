import React, { useState, useEffect } from 'react';
import { Database, Search, BrainCircuit, Activity } from 'lucide-react';

export const RagMemoryEngine: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setResults([
        { chapter: 2, distance: 0.12, text: "Geronimo handed Maris the fractured bisso core..." },
        { chapter: 1, distance: 0.34, text: "The team agreed that the amulet must never touch seawater..." }
      ]);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" /> Vector RAG Canon Memory
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-900/50">
            <Activity className="w-3 h-3" /> ENGINE ONLINE
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the canon (e.g. 'What did Geronimo say about the mineral?')"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 pl-11 text-stone-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <Search className="w-5 h-5 text-stone-500 absolute left-4 top-3.5" />
            <button 
              onClick={mockSearch}
              className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {isSearching ? <BrainCircuit className="w-4 h-4 animate-spin" /> : "Embed & Search"}
            </button>
          </div>

          <div className="space-y-3 mt-4">
            {results.map((r, i) => (
              <div key={i} className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex gap-4">
                <div className="flex flex-col items-center justify-center bg-indigo-950/30 text-indigo-400 border border-indigo-900/50 rounded-lg p-2 min-w-[60px]">
                  <span className="text-[10px] font-mono uppercase">Dist</span>
                  <span className="font-mono font-bold text-sm">{r.distance.toFixed(2)}</span>
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-500 mb-1">BOOK_I_CHAPTER_{r.chapter}</div>
                  <p className="text-sm text-stone-300">"...{r.text}..."</p>
                </div>
              </div>
            ))}
            {results.length === 0 && !isSearching && (
              <div className="text-center py-8 text-stone-500 text-sm italic">
                Awaiting semantic query. The vector space contains 14,978 embedded tokens.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
