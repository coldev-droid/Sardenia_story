import React, { useState } from 'react';
import { 
  GitCommit, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  Database, 
  Zap, 
  Users, 
  MapPin, 
  Layers,
  FileCode
} from 'lucide-react';

export interface HypotheticalMutation {
  id: string;
  title: string;
  factType: 'HISTORICAL_FACT' | 'GEOGRAPHY' | 'ITEM_CUSTODY' | 'RELATIONSHIP';
  originalCanon: string;
  hypotheticalChange: string;
  impactedChapters: string[];
  impactedCharacters: string[];
  severity: 'CRITICAL_BLOCKER' | 'GEOGRAPHY_FIREWALL_FAIL' | 'TIMELINE_PARADOX';
  cascadeDescription: string;
  safeCorrectionPath: string;
}

const PRESET_MUTATIONS: HypotheticalMutation[] = [
  {
    id: "MUT-01",
    title: "Geronimo Fails to Recover S'Urtzu Obsidian Flake in B1-E03",
    factType: "ITEM_CUSTODY",
    originalCanon: "Geronimo recovers obsidian flake amulet #01 at Capo Caccia; palm scar develops volcanic glass resonance.",
    hypotheticalChange: "Geronimo leaves Capo Caccia without recovering the obsidian flake amulet.",
    impactedChapters: ["B2-E07", "B3-E04", "B5-E12"],
    impactedCharacters: ["Geronimo", "Ina", "Maris"],
    severity: "CRITICAL_BLOCKER",
    cascadeDescription: "In B2-E07, Geronimo's palm lacks obsidian resonance, preventing activation of the Monte Arci memory wall. In B3-E04, the team lacks the memory frequency needed to align the Santa Cristina well stairs.",
    safeCorrectionPath: "Restore S'Urtzu obsidian recovery in B1-E03 or introduce parallel mineral discovery in B2-E02 mine archive."
  },
  {
    id: "MUT-02",
    title: "Grotta di Nettuno Relocated to Deep-Sea Trench",
    factType: "GEOGRAPHY",
    originalCanon: "Grotta di Nettuno is a sea-level marine karst cave beneath Capo Caccia cliffs.",
    hypotheticalChange: "Grotta di Nettuno is described as an underwater deep-sea trench requiring deep dive gear.",
    impactedChapters: ["B1-E01", "B1-E02"],
    impactedCharacters: ["Geronimo", "André"],
    severity: "GEOGRAPHY_FIREWALL_FAIL",
    cascadeDescription: "Triggers GEOGRAPHY_FIREWALL_FAIL. Sentina vessel support boats cannot navigate underwater trenches without submarine equipment. Violates real Capo Caccia geography.",
    safeCorrectionPath: "Revert cave coordinates to sea-level entrance below Escala del Cabirol."
  },
  {
    id: "MUT-03",
    title: "André and Inga Sibling Relationship Inversion",
    factType: "RELATIONSHIP",
    originalCanon: "André is Inga's Colombian husband. Maris is Inga's biological brother.",
    hypotheticalChange: "André is written as Inga's biological brother instead of her husband.",
    impactedChapters: ["B1-E04", "B2-E09", "B4-E02"],
    impactedCharacters: ["André", "Inga", "Maris"],
    severity: "CRITICAL_BLOCKER",
    cascadeDescription: "Violates Locked Family Canon Matrix Rule 2. Breaks André's business partnership backstory with Geronimo and alters trust dynamics with Maris.",
    safeCorrectionPath: "Enforce strict blood-family matrix validation rule `MARRIAGE_INGA_ANDRE`."
  }
];

export function ContinuitySandbox() {
  const [selectedMutation, setSelectedMutation] = useState<HypotheticalMutation>(PRESET_MUTATIONS[0]);
  const [customChangeInput, setCustomChangeInput] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<HypotheticalMutation | null>(PRESET_MUTATIONS[0]);

  const handleRunSimulation = (mutation: HypotheticalMutation) => {
    setSimulating(true);
    setSelectedMutation(mutation);
    setTimeout(() => {
      setSimulationResult(mutation);
      setSimulating(false);
    }, 800);
  };

  const handleCustomSimulate = () => {
    if (!customChangeInput.trim()) return;
    setSimulating(true);
    setTimeout(() => {
      const customMut: HypotheticalMutation = {
        id: "MUT-CUSTOM",
        title: "Custom Mutation Simulation",
        factType: "HISTORICAL_FACT",
        originalCanon: "Canonical State in Memory Vault",
        hypotheticalChange: customChangeInput,
        impactedChapters: ["B2-E07", "B3-E04", "B4-E11"],
        impactedCharacters: ["Geronimo", "Katia", "Maris"],
        severity: "CRITICAL_BLOCKER",
        cascadeDescription: `Hypothetical change "${customChangeInput}" introduces a cascade mismatch in 3 downstream chapters, causing a setup/payoff discrepancy in Book III.`,
        safeCorrectionPath: "Revert custom change or register explicit ORIGINAL_FICTIONAL_TRANSFORMATION entry."
      };
      setSelectedMutation(customMut);
      setSimulationResult(customMut);
      setSimulating(false);
    }, 900);
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-100 shadow-md">
            <GitCommit className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Saga Continuity Sandbox (Ripple Effect Simulator)</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                HYPOTHETICAL CASCADE ENGINE
              </span>
            </div>
            <p className="text-xs text-stone-400">Simulate hypothetical canon fact alterations and inspect immediate downstream ripple effects across 5 books.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-stone-950 border border-stone-800 text-amber-400 font-bold flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>REAL-TIME CASCADE CHECKER</span>
          </span>
        </div>
      </div>

      {/* Preset Mutations Selection & Custom Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PRESET_MUTATIONS.map((mut) => {
          const isSelected = selectedMutation.id === mut.id;
          return (
            <div
              key={mut.id}
              onClick={() => handleRunSimulation(mut)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                  : 'bg-stone-950 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 block">{mut.id} • {mut.factType}</span>
                <h4 className="font-serif font-bold text-xs text-stone-100">{mut.title}</h4>
              </div>
              <span className="text-[9px] font-mono font-bold text-red-400 uppercase">{mut.severity}</span>
            </div>
          );
        })}
      </div>

      {/* Custom Mutation Test Input */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
        <span className="text-xs font-mono font-bold text-stone-300 block">Simulate Custom Hypothetical Mutation</span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customChangeInput}
            onChange={(e) => setCustomChangeInput(e.target.value)}
            placeholder="e.g. Inga discovers the 5th amulet inside the Bosa castle walls in B2-E04..."
            className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-sans text-stone-200 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleCustomSimulate}
            disabled={simulating || !customChangeInput.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-mono text-xs font-bold rounded-xl shadow transition shrink-0"
          >
            {simulating ? 'Simulating Ripple...' : 'Simulate Custom Change'}
          </button>
        </div>
      </div>

      {/* Simulation Ripple Results Display */}
      {simulationResult && (
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">{simulationResult.factType} MUTATION CASCADE</span>
              <h3 className="font-serif font-bold text-base text-stone-100">{simulationResult.title}</h3>
            </div>
            <span className="px-3 py-1 rounded bg-red-950 text-red-300 border border-red-800 font-mono text-xs font-bold">
              {simulationResult.severity}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">Original Canonical State</span>
              <p className="text-stone-300 font-sans text-xs leading-relaxed">{simulationResult.originalCanon}</p>
            </div>

            <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Hypothetical Alteration</span>
              <p className="text-stone-200 font-sans text-xs leading-relaxed">{simulationResult.hypotheticalChange}</p>
            </div>
          </div>

          {/* Ripple Impact Details */}
          <div className="bg-stone-900 p-4 rounded-lg border border-stone-800 space-y-3 font-mono text-xs">
            <span className="text-red-400 font-bold text-xs uppercase block flex items-center space-x-1.5">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <span>Downstream Ripple Effect Breakdown</span>
            </span>

            <p className="text-stone-200 font-sans text-xs leading-relaxed">
              {simulationResult.cascadeDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">Impacted Downstream Episodes:</span>
                <div className="flex flex-wrap gap-1">
                  {simulationResult.impactedChapters.map(ch => (
                    <span key={ch} className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold text-[10px]">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-purple-400 font-bold block uppercase">Impacted Character States:</span>
                <div className="flex flex-wrap gap-1">
                  {simulationResult.impactedCharacters.map(char => (
                    <span key={char} className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold text-[10px]">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Smallest Safe Restoration Path */}
          <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-xl text-xs font-mono text-emerald-300 space-y-1">
            <span className="font-bold text-[10px] uppercase text-emerald-400 block">✓ Smallest Safe Canon Restoration Path</span>
            <p className="font-sans text-xs text-stone-200">{simulationResult.safeCorrectionPath}</p>
          </div>
        </div>
      )}
    </div>
  );
}
