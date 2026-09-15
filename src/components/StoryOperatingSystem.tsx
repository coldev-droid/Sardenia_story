import React, { useState } from 'react';
import { 
  Cpu, 
  GitMerge, 
  Database, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  Lock, 
  Layers, 
  Play, 
  ArrowRight, 
  FileText, 
  Terminal, 
  Search, 
  Sparkles,
  GitPullRequest
} from 'lucide-react';

export interface RouteCard {
  episodeId: string; // e.g. B2-E07
  bookTitle: string;
  purpose: string;
  startsFrom: string;
  requiredEvents: string[];
  mustNotReveal: string[];
  payoffs: Array<{ setupFrom: string }>;
  newSetups: Array<{ target: string }>;
  endingState: {
    location: string;
    emotionalShift: string;
  };
  pipelineStatus: 'QUEUED' | 'RETRIEVING_CANON' | 'OUTLINING' | 'DRAFTING' | 'INSPECTOR_SWARM' | 'LOCKED_MEMORY';
  blockerCount: number;
}

export interface FiveMemoryLayer {
  layerName: string;
  updateRule: string;
  recordCount: number;
  lastValidated: string;
  sampleJsonRecord: string;
}

const SAMPLE_ROUTE_CARDS: RouteCard[] = [
  {
    episodeId: "B1-E01",
    bookTitle: "Book I: S'Urtzu & The Awakening",
    purpose: "Sentina arrives off Capo Caccia; Geronimo detects subterranean electromagnetic pulse near Grotta di Nettuno.",
    startsFrom: "Barcelona Maritime Departure",
    requiredEvents: [
      "Sentina drops anchor near Capo Caccia cliffs",
      "Geronimo boots custom radio array detecting 784 Hz pulse",
      "Mia and Tina display low-frequency auditory tension"
    ],
    mustNotReveal: [
      "André's maritime map origins",
      "True nature of Obsidian Amulet #01"
    ],
    payoffs: [],
    newSetups: [
      { target: "B1-E03" },
      { target: "B3-E07" }
    ],
    endingState: {
      location: "Capo Caccia Coastal Anchorage",
      emotionalShift: "Cautious anticipation to acute curiosity"
    },
    pipelineStatus: "LOCKED_MEMORY",
    blockerCount: 0
  },
  {
    episodeId: "B2-E07",
    bookTitle: "Book II: The Obsidian Labyrinth",
    purpose: "Geronimo & Katia discover that Monte Arci obsidian shards preserve stolen Nuragic memories.",
    startsFrom: "B2-E06 (Monte Arci Quarry Entrance)",
    requiredEvents: [
      "Geronimo enters Monte Arci obsidian quarry chamber",
      "The scar on his palm resonates with volcanic glass wall",
      "Ina conceals what she recognizes in the ancient petroglyph"
    ],
    mustNotReveal: [
      "Ina is the Gatekeeper of the 12th Amulet",
      "True identity of the Baunei chasm entity"
    ],
    payoffs: [
      { setupFrom: "B1-E03" }
    ],
    newSetups: [
      { target: "B4-E09" }
    ],
    endingState: {
      location: "Underground Obsidian Sanctuary",
      emotionalShift: "Distrust to fragile alliance"
    },
    pipelineStatus: "INSPECTOR_SWARM",
    blockerCount: 0
  },
  {
    episodeId: "B3-E04",
    bookTitle: "Book III: Giants' Tomb Resonance",
    purpose: "Parallel team (Maris & André) measures lunar equinox alignment at Santa Cristina sacred well.",
    startsFrom: "B3-E03 (Paulilatino Departure)",
    requiredEvents: [
      "Maris aligns laser rangefinder down keyhole stairwell",
      "Subterranean halite water reflects inverted moon",
      "André receives encrypted maritime ping on radio"
    ],
    mustNotReveal: [
      "Exact location of Amulet #08"
    ],
    payoffs: [
      { setupFrom: "B1-E01" }
    ],
    newSetups: [
      { target: "B5-E12" }
    ],
    endingState: {
      location: "Santa Cristina Subterranean Well Chamber",
      emotionalShift: "Awe to heightened vigilance"
    },
    pipelineStatus: "QUEUED",
    blockerCount: 0
  }
];

const MEMORY_LAYERS: FiveMemoryLayer[] = [
  {
    layerName: "1. Canon Vault (PostgreSQL + pgvector)",
    updateRule: "Human / Canon Gatekeeper approved changes only",
    recordCount: 1420,
    lastValidated: "2026-09-10 17:35:00",
    sampleJsonRecord: `{\n  "claim": "Obsidian from Monte Arci cannot be forged using modern steel chisels.",\n  "source_id": "rule_geology_042",\n  "introduced_in": "B1-E04",\n  "last_verified_against": "B2-E07"\n}`
  },
  {
    layerName: "2. Character Ledger (Immutable Provenance)",
    updateRule: "Automatically updated after every scene execution",
    recordCount: 6,
    lastValidated: "2026-09-10 17:36:12",
    sampleJsonRecord: `{\n  "id": "char_geronimo",\n  "immutable": { "origin": "Barcelona", "role": "Programmer / Inventor" },\n  "current_state": { "location": "Monte Arci Sanctuary", "injury": "palm_obsidian_scar" },\n  "knowledge": ["obsidian_memory_resonance"],\n  "does_not_know": ["ina_is_gatekeeper"]\n}`
  },
  {
    layerName: "3. Timeline Matrix & Geography",
    updateRule: "Automatically validated against real Sardinian distances",
    recordCount: 380,
    lastValidated: "2026-09-10 17:30:45",
    sampleJsonRecord: `{\n  "route": "Alghero -> Paulilatino -> Monte Arci",\n  "transit_time_hours": 2.4,\n  "vehicle": "Sentina Support Land Rover",\n  "geography_firewall": "PASS"\n}`
  },
  {
    layerName: "4. Narrative Setup/Payoff Ledger",
    updateRule: "Every setup requires an approved destination book/episode",
    recordCount: 84,
    lastValidated: "2026-09-10 17:32:00",
    sampleJsonRecord: `{\n  "setup_id": "SET-B1-E03",\n  "description": "Obsidian palm scar resonance",\n  "created_in": "B1-E03",\n  "target_payoff": "B2-E07",\n  "status": "PAYOFF_RESOLVED_IN_B2-E07"\n}`
  },
  {
    layerName: "5. Episode State & Inventory",
    updateRule: "Updated after every episode pipeline lock",
    recordCount: 15,
    lastValidated: "2026-09-10 17:36:45",
    sampleJsonRecord: `{\n  "episode_id": "B2-E07",\n  "amulet_custody": { "amulet_01": "Geronimo", "amulet_02": "Maris" },\n  "vessel_status": "Anchored at Oristano",\n  "dogs_status": "Calm on deck"\n}`
  }
];

export function StoryOperatingSystem() {
  const [routeCards, setRouteCards] = useState<RouteCard[]>(SAMPLE_ROUTE_CARDS);
  const [selectedCard, setSelectedCard] = useState<RouteCard>(SAMPLE_ROUTE_CARDS[1]);
  const [activeMemoryTab, setActiveMemoryTab] = useState<number>(0);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);

  const handleSimulatePipeline = (cardId: string) => {
    setPipelineRunning(true);
    setTimeout(() => {
      setRouteCards(prev => prev.map(c => {
        if (c.episodeId === cardId) {
          return {
            ...c,
            pipelineStatus: 'LOCKED_MEMORY',
            blockerCount: 0
          };
        }
        return c;
      }));
      setSelectedCard(prev => ({
        ...prev,
        pipelineStatus: 'LOCKED_MEMORY',
        blockerCount: 0
      }));
      setPipelineRunning(false);
    }, 1500);
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Story Operating System (5-Book Saga Pipeline)</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                TEMPORAL + PGVECTOR PIPELINE
              </span>
            </div>
            <p className="text-xs text-stone-400">Coordinates 5 books simultaneously via structured route cards, 5 separate memory layers, and Canon Gatekeeper approval gates.</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-stone-950 border border-stone-800 text-emerald-400 font-bold flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CANON GATEKEEPER ONLINE</span>
          </span>
        </div>
      </div>

      {/* 5-Layer Storyworld Memory Architecture */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-amber-400" />
            <span>5 Separate Memory Layers (PostgreSQL + pgvector + Temporal Job Queue)</span>
          </span>
          <span className="text-[10px] font-mono text-stone-400">Total Canon Records: 1,890</span>
        </div>

        {/* Memory Layer Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {MEMORY_LAYERS.map((layer, idx) => (
            <button
              key={layer.layerName}
              onClick={() => setActiveMemoryTab(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                activeMemoryTab === idx 
                  ? 'bg-amber-600 text-stone-100 font-bold shadow' 
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {layer.layerName.split(' ')[1]} {layer.layerName.split(' ')[2]}
            </button>
          ))}
        </div>

        {/* Active Memory Layer Record Inspection */}
        <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300">{MEMORY_LAYERS[activeMemoryTab].layerName}</span>
            <span className="text-emerald-400 text-[10px]">Rule: {MEMORY_LAYERS[activeMemoryTab].updateRule}</span>
          </div>
          <pre className="p-3 bg-stone-950 rounded border border-stone-800 text-[11px] text-amber-200 font-mono overflow-x-auto">
            {MEMORY_LAYERS[activeMemoryTab].sampleJsonRecord}
          </pre>
        </div>
      </div>

      {/* Episode Route Cards & Pipeline Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Route Cards Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
            <span>5-Book Route Cards Queue</span>
            <span>Click to inspect & trigger pipeline</span>
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {routeCards.map((card) => {
              const isSelected = selectedCard.episodeId === card.episodeId;
              return (
                <div
                  key={card.episodeId}
                  onClick={() => setSelectedCard(card)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-400">{card.episodeId}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      card.pipelineStatus === 'LOCKED_MEMORY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      card.pipelineStatus === 'INSPECTOR_SWARM' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      'bg-stone-900 text-stone-400 border border-stone-800'
                    }`}>
                      {card.pipelineStatus}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs text-stone-100">{card.bookTitle}</h4>
                  <p className="text-[11px] text-stone-300 font-sans line-clamp-2 leading-relaxed">{card.purpose}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-t border-stone-800/60 pt-2">
                    <span>From: {card.startsFrom}</span>
                    <span className="text-amber-400 font-bold">Route Card →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Route Card Pipeline Execution Detail (7 Cols) */}
        <div className="lg:col-span-7 bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{selectedCard.bookTitle}</span>
                <h3 className="font-serif font-bold text-base text-stone-100">Episode Route Card: {selectedCard.episodeId}</h3>
              </div>

              <button
                disabled={pipelineRunning || selectedCard.pipelineStatus === 'LOCKED_MEMORY'}
                onClick={() => handleSimulatePipeline(selectedCard.episodeId)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center space-x-2 ${
                  selectedCard.pipelineStatus === 'LOCKED_MEMORY'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-stone-100 hover:from-amber-500 hover:to-amber-600 shadow-md'
                }`}
              >
                {pipelineRunning ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Running Swarm Pipeline...</span>
                  </>
                ) : selectedCard.pipelineStatus === 'LOCKED_MEMORY' ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Locked in Canon Vault</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Pipeline & Gatekeeper Approval</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-stone-300 font-sans leading-relaxed bg-stone-900 p-3 rounded-lg border border-stone-800">
              <strong className="text-amber-400 font-mono block mb-1">Route Purpose:</strong>
              {selectedCard.purpose}
            </p>

            {/* Mandatory Events & Must Not Reveal Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1.5">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase">✓ Mandatory Route Events</span>
                <ul className="space-y-1 text-[11px] text-stone-300">
                  {selectedCard.requiredEvents.map(ev => (
                    <li key={ev} className="flex items-start space-x-1.5">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1.5">
                <span className="text-red-400 font-bold block text-[10px] uppercase">✕ Must Not Reveal (Spoilers)</span>
                <ul className="space-y-1 text-[11px] text-stone-300">
                  {selectedCard.mustNotReveal.map(rev => (
                    <li key={rev} className="flex items-start space-x-1.5">
                      <span className="text-red-400 shrink-0">•</span>
                      <span>{rev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ending State Transition */}
            <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1 text-xs font-mono">
              <span className="text-purple-400 font-bold text-[10px] uppercase block">Target Ending State Shift</span>
              <div className="flex items-center justify-between text-[11px] text-stone-200">
                <span>Location: <strong className="text-amber-300">{selectedCard.endingState.location}</strong></span>
                <span>Shift: <strong className="text-purple-300">{selectedCard.endingState.emotionalShift}</strong></span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-[10px] font-mono text-stone-400 flex items-center justify-between">
            <span>Provenance Claim: Introduced in {selectedCard.episodeId} • Canon Gatekeeper Verification ID #8910</span>
            <span className="text-emerald-400 font-bold">BLOCKER COUNT: {selectedCard.blockerCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
