import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  ShieldCheck,
  Compass,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export interface MotifItem {
  id: string;
  name: string;
  sardinianName: string;
  category: 'BRONZETTO' | 'SACRED_WATER' | 'MEGALITHIC' | 'MINERAL_SYMBOL' | 'FAUNA_FOLKLORE';
  icon: string;
  bookOccurrences: { bookI: number; bookII: number; bookIII: number; bookIV: number; bookV: number };
  totalCount: number;
  symbolicMeaning: string;
  primaryLocation: string;
  thematicHealth: 'OPTIMAL' | 'UNDER_REPRESENTED' | 'OVER_SATURATED';
  latestPassage: string;
}

const INITIAL_MOTIFS: MotifItem[] = [
  {
    id: "MOTIF-01",
    name: "Nuragic Bronze Statuette (Bronzetto)",
    sardinianName: "Bronzetto Nuragico",
    category: "BRONZETTO",
    icon: "🗿",
    bookOccurrences: { bookI: 12, bookII: 15, bookIII: 18, bookIV: 14, bookV: 20 },
    totalCount: 79,
    symbolicMeaning: "Ancestral military & spiritual lineage; physical anchor for ancient Nuragic memory.",
    primaryLocation: "National Archaeological Museum of Cagliari & Teti",
    thematicHealth: "OPTIMAL",
    latestPassage: "Geronimo examined the bronze archer's weathered patina under LED torchlight, noting the double-horned helmet emblem."
  },
  {
    id: "MOTIF-02",
    name: "Sacred Water Well (Pozzo Sacro)",
    sardinianName: "Pozzo Sacro di Santa Cristina",
    category: "SACRED_WATER",
    icon: "💧",
    bookOccurrences: { bookI: 8, bookII: 14, bookIII: 16, bookIV: 19, bookV: 22 },
    totalCount: 79,
    symbolicMeaning: "Subterranean reflection, lunar equinox alignment, and subterranean acoustic gateway.",
    primaryLocation: "Paulilatino & Santa Cristina",
    thematicHealth: "OPTIMAL",
    latestPassage: "The upside-down reflection of the lunar alignment shimmered on the dark water surface inside the keyhole stairwell."
  },
  {
    id: "MOTIF-03",
    name: "Giant's Tomb Megalith (Tomba dei Giganti)",
    sardinianName: "Tomba dei Giganti Su Mont'e s'Abe",
    category: "MEGALITHIC",
    icon: "🏛️",
    bookOccurrences: { bookI: 10, bookII: 12, bookIII: 15, bookIV: 11, bookV: 14 },
    totalCount: 62,
    symbolicMeaning: "Communal rebirth, telluric magnetic energy, and stone stele doorway.",
    primaryLocation: "Olbia & Arzachena",
    thematicHealth: "OPTIMAL",
    latestPassage: "The arched central stele radiated a faint electromagnetic pulse that disrupted Maris's digital compass."
  },
  {
    id: "MOTIF-04",
    name: "Monte Arci Obsidian Glass",
    sardinianName: "Obsidiana de Monte Arci",
    category: "MINERAL_SYMBOL",
    icon: "💎",
    bookOccurrences: { bookI: 18, bookII: 22, bookIII: 19, bookIV: 25, bookV: 30 },
    totalCount: 114,
    symbolicMeaning: "Volcanic darkness, truth-cutting clarity, and primary mineral matrix for true amulets.",
    primaryLocation: "Pau & Monte Arci Mineral Reserves",
    thematicHealth: "OPTIMAL",
    latestPassage: "Veerle ran her finger along the razor-sharp obsidian flake, watching light fracture into violet hues."
  },
  {
    id: "MOTIF-05",
    name: "Olive-Wood Mercy Hammer",
    sardinianName: "Mazzolu de s'Accabadora",
    category: "SARDINIAN_DIALECT" as any,
    icon: "🔨",
    bookOccurrences: { bookI: 3, bookII: 8, bookIII: 10, bookIV: 7, bookV: 9 },
    totalCount: 37,
    symbolicMeaning: "Mercy, inevitable transition, and ancient agrarian spiritual law.",
    primaryLocation: "Luras & Gallura Region",
    thematicHealth: "UNDER_REPRESENTED",
    latestPassage: "In the Luras museum case, the gnarled olive-wood mallet rested beside wild linen ribbons."
  }
];

export function NarrativeMotifTracker() {
  const [motifs, setMotifs] = useState<MotifItem[]>(INITIAL_MOTIFS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMotif, setSelectedMotif] = useState<MotifItem>(INITIAL_MOTIFS[0]);

  const filteredMotifs = motifs.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sardinianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.symbolicMeaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Data for Recharts BarChart comparing motif occurrences across Books I to V
  const chartData = [
    { book: "Book I", count: selectedMotif.bookOccurrences.bookI },
    { book: "Book II", count: selectedMotif.bookOccurrences.bookII },
    { book: "Book III", count: selectedMotif.bookOccurrences.bookIII },
    { book: "Book IV", count: selectedMotif.bookOccurrences.bookIV },
    { book: "Book V", count: selectedMotif.bookOccurrences.bookV },
  ];

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-lg text-stone-100">Narrative Motif & Symbol Tracker</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                5-BOOK CANON AUDIT
              </span>
            </div>
            <p className="text-xs text-stone-400">Scans candidate prose for recurring Sardinian magical symbols to guarantee thematic continuity across all 5 books.</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search motif or symbol..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Grid: Motif Roster List & Occurrence Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Motif Cards List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
            <span>Tracking {filteredMotifs.length} Core Sardinian Motifs</span>
            <span>Click to inspect occurrence trend</span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredMotifs.map((motif) => {
              const isSelected = selectedMotif.id === motif.id;
              return (
                <div
                  key={motif.id}
                  onClick={() => setSelectedMotif(motif)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{motif.icon}</span>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-stone-100">{motif.name}</h4>
                        <span className="text-[10px] font-mono text-amber-400">{motif.sardinianName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-stone-200 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                        {motif.totalCount} mentions
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        motif.thematicHealth === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {motif.thematicHealth}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-300 font-sans leading-relaxed">{motif.symbolicMeaning}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-t border-stone-800/60 pt-2">
                    <span className="truncate">Primary Site: {motif.primaryLocation}</span>
                    <span className="text-amber-400 shrink-0">Click to view 5-Book Curve →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 5-Book Motif Frequency Curve (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>5-Book Progression: {selectedMotif.name}</span>
              </div>
              <span className="text-2xl">{selectedMotif.icon}</span>
            </div>

            <div className="h-48 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="book" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={10} allowDecimals={false} tickLine={false} />
                  <Tooltip 
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-stone-900 border border-stone-700 p-2 rounded text-xs font-mono text-amber-400">
                            {payload[0].payload.book}: <strong className="text-stone-100">{payload[0].value} mentions</strong>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#f59e0b" maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1.5 text-xs font-mono">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Latest Scanned Prose Passage</span>
            <p className="text-stone-300 italic text-[11px] leading-relaxed font-serif">
              "{selectedMotif.latestPassage}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
