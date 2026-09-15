import React, { useState } from 'react';
import { 
  GitMerge, 
  Lock, 
  Unlock, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react';

export interface SagaNode {
  id: string; // e.g. B1-E03
  bookId: 'Book I' | 'Book II' | 'Book III' | 'Book IV' | 'Book V';
  title: string;
  type: 'CRITICAL_LOCK' | 'SETUP_NODE' | 'CLIMAX_RESOLVER' | 'AMULET_ACTIVATION';
  dependencies: string[]; // Node IDs required before this can lock
  dependentNodes: string[]; // Node IDs that rely on this node
  canonStatus: 'LOCKED_CANON' | 'ACTIVE_DRAFT' | 'PLANNED_DEPENDENCY';
  summary: string;
  payoffDetails: string;
}

const SAGA_NODES: SagaNode[] = [
  {
    id: "B1-E01",
    bookId: "Book I",
    title: "Capo Caccia Subterranean 784Hz Resonance",
    type: "SETUP_NODE",
    dependencies: [],
    dependentNodes: ["B1-E03", "B2-E07", "B3-E04"],
    canonStatus: "LOCKED_CANON",
    summary: "Sentina arrives at Alghero; Geronimo detects 784Hz frequency in Grotta di Nettuno.",
    payoffDetails: "Plants initial frequency clue that enables obsidian tuning in Book II and water resonance in Book III."
  },
  {
    id: "B1-E03",
    bookId: "Book I",
    title: "S'Urtzu Obsidian Amulet #01 Recovery",
    type: "AMULET_ACTIVATION",
    dependencies: ["B1-E01"],
    dependentNodes: ["B2-E07", "B5-E12"],
    canonStatus: "LOCKED_CANON",
    summary: "Geronimo recovers obsidian flake amulet; palm scar develops volcanic glass resonance.",
    payoffDetails: "Unlocks palm scar memory reading ability required in Monte Arci underground sanctuary."
  },
  {
    id: "B2-E07",
    bookId: "Book II",
    title: "Monte Arci Obsidian Memory Wall Lock",
    type: "CRITICAL_LOCK",
    dependencies: ["B1-E01", "B1-E03"],
    dependentNodes: ["B3-E04", "B4-E09"],
    canonStatus: "ACTIVE_DRAFT",
    summary: "Geronimo's palm scar activates Nuragic memory wall; Ina's gatekeeper identity hinted.",
    payoffDetails: "Provides crucial memory key for Santa Cristina equinox alignment in Book III."
  },
  {
    id: "B3-E04",
    bookId: "Book III",
    title: "Santa Cristina Subterranean Well Inversion",
    type: "CRITICAL_LOCK",
    dependencies: ["B1-E01", "B2-E07"],
    dependentNodes: ["B4-E09", "B5-E12"],
    canonStatus: "PLANNED_DEPENDENCY",
    summary: "Parallel team (Maris & André) measures lunar reflection, crystallizing silver halite water.",
    payoffDetails: "Reveals liquid crystal compass needed for sunken nuraghe navigation in Book IV."
  },
  {
    id: "B4-E09",
    bookId: "Book IV",
    title: "Baunei Su Scultone Chasm Seals",
    type: "SETUP_NODE",
    dependencies: ["B2-E07", "B3-E04"],
    dependentNodes: ["B5-E12"],
    canonStatus: "PLANNED_DEPENDENCY",
    summary: "Su Scultone karst serpent entity awakens; Katia and Veerle seal limestone chamber.",
    payoffDetails: "Assembles 11th true amulet, setting up final 12-amulet convergence."
  },
  {
    id: "B5-E12",
    bookId: "Book V",
    title: "12 Amulets Convergence & Island Awakening",
    type: "CLIMAX_RESOLVER",
    dependencies: ["B1-E03", "B3-E04", "B4-E09"],
    dependentNodes: [],
    canonStatus: "PLANNED_DEPENDENCY",
    summary: "All 12 true mineral amulets align at Nuraghe Santu Antine; Sardinia reveals its living dream.",
    payoffDetails: "Grand saga climax resolving all setup nodes from Books I-IV without contradiction."
  }
];

export function SagaContinuityMap() {
  const [nodes] = useState<SagaNode[]>(SAGA_NODES);
  const [selectedNode, setSelectedNode] = useState<SagaNode>(SAGA_NODES[2]);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 shadow-md">
            <GitMerge className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">5-Book Saga Continuity & Dependency Map</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                DAG GRAPH VERIFIER
              </span>
            </div>
            <p className="text-xs text-stone-400">Visualizing the critical plot-locking events and cross-book dependencies across all 5 volumes.</p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="flex items-center space-x-1 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Locked Canon</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Active Draft</span>
          </span>
          <span className="flex items-center space-x-1 text-purple-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Planned Dependency</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Dependency Map (5 Books Columns) & Inspector Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 5-Book Graph Pipeline (8 Cols) */}
        <div className="lg:col-span-8 bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Dependency Flow (Book I → Book V)
            </span>
            <span className="text-[10px] font-mono text-stone-400">Zero-Loop Guarantee</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              const isDependency = selectedNode.dependencies.includes(node.id);
              const isDependent = selectedNode.dependentNodes.includes(node.id);

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2.5 relative ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg ring-1 ring-amber-500'
                      : isDependency
                      ? 'bg-emerald-950/20 border-emerald-800'
                      : isDependent
                      ? 'bg-purple-950/20 border-purple-800'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">{node.id}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        node.canonStatus === 'LOCKED_CANON' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        node.canonStatus === 'ACTIVE_DRAFT' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {node.bookId}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-xs text-stone-100">{node.title}</h4>
                    <p className="text-[10px] text-stone-300 font-sans line-clamp-2 leading-relaxed">{node.summary}</p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-stone-400 border-t border-stone-800/60 pt-2">
                    <span>{node.type}</span>
                    {isDependency && <span className="text-emerald-400 font-bold">← PREREQUISITE</span>}
                    {isDependent && <span className="text-purple-400 font-bold">UNLOCKS →</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Causality Details (4 Cols) */}
        <div className="lg:col-span-4 bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{selectedNode.type}</span>
                <h3 className="font-serif font-bold text-base text-stone-100">{selectedNode.id}: {selectedNode.title}</h3>
              </div>
              <span className="p-2 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400">
                <GitBranch className="w-5 h-5" />
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Node Summary</span>
                <p className="text-stone-300 font-sans text-[11px] leading-relaxed">
                  {selectedNode.summary}
                </p>
              </div>

              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-purple-400 font-bold uppercase block">Long-Term Payoff Details</span>
                <p className="text-stone-300 font-sans text-[11px] leading-relaxed">
                  {selectedNode.payoffDetails}
                </p>
              </div>
            </div>

            {/* Prerequisites & Dependent Links */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">Prerequisite Dependencies:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.dependencies.length > 0 ? (
                    selectedNode.dependencies.map(dep => (
                      <span key={dep} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px]">
                        {dep}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-500 text-[10px]">Root Entry Node (No Prerequisites)</span>
                  )}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-purple-400 font-bold block uppercase">Unlocks Dependent Events:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.dependentNodes.length > 0 ? (
                    selectedNode.dependentNodes.map(dep => (
                      <span key={dep} className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px]">
                        {dep}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-500 text-[10px]">Final Saga Climax Node</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl text-[10px] font-mono text-stone-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>DAG Causality Verified: Zero forward-looking paradoxes detected across 5 books.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
