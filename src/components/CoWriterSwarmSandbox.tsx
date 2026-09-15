import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  GitBranch, 
  Check, 
  Copy, 
  RefreshCw, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Flame,
  MessageSquare,
  ShieldAlert,
  BookMarked,
  Search,
  ShieldCheck
} from 'lucide-react';

export interface AgentSuggestion {
  id: string;
  agentName: string;
  agentRole: string;
  targetParagraph: string;
  originalText: string;
  proposedText: string;
  rationale: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface StoryBranchOption {
  branchId: string;
  title: string;
  tone: 'ACTION_HIGH_STAKES' | 'EMOTIONAL_CONFRONTATION' | 'STEALTH_MYSTERY';
  summary: string;
  predictedTension: number;
  canonImpact: string;
}

export interface LexiconTerm {
  term: string;
  phonetic: string;
  meaning: string;
  category: 'MYTHOLOGICAL_BEING' | 'SACRED_MONUMENT' | 'RITUAL_ARTIFACT' | 'SARDINIAN_DIALECT';
  approvedUsage: string;
  prohibitedMisuse: string;
}

const SARDINIAN_LEXICON: LexiconTerm[] = [
  {
    term: "Domus de Janas",
    phonetic: "[DOH-moos deh YAH-nas]",
    meaning: "Prehistoric rock-cut chamber tombs ('House of the Fairies/Witches').",
    category: "SACRED_MONUMENT",
    approvedUsage: "Used strictly for verified Neolithic rock-cut tombs.",
    prohibitedMisuse: "Do not use for modern caves or nuraghe towers."
  },
  {
    term: "Cogas / Brujas",
    phonetic: "[KOH-gas]",
    meaning: "Shape-shifting demonic spirits in Sardinian folklore, associated with blood and nocturnal whispers.",
    category: "MYTHOLOGICAL_BEING",
    approvedUsage: "Awakened by specific mineral amulets; retains traditional blood/animal folklore.",
    prohibitedMisuse: "Do not depict as modern fantasy witches with spell books."
  },
  {
    term: "Su Murtarolu",
    phonetic: "[soo moor-tah-ROH-loo]",
    meaning: "Traditional Sardinian obsidian chisel or sacred cutting stone used in ancient rituals.",
    category: "RITUAL_ARTIFACT",
    approvedUsage: "Used exclusively for ancient obsidian working near Monte Arci.",
    prohibitedMisuse: "Do not describe as metal or steel blade."
  },
  {
    term: "Su Scultone",
    phonetic: "[soo skool-TOH-neh]",
    meaning: "Legendary dragon/serpent myth associated with Baunei and karst gorges.",
    category: "MYTHOLOGICAL_BEING",
    approvedUsage: "Serpentine guardian myth manifesting through subterranean limestone resonance.",
    prohibitedMisuse: "Do not depict as winged western dragon."
  },
  {
    term: "Accabadora",
    phonetic: "[ah-kah-bah-DOH-rah]",
    meaning: "Historical figure in rural Sardinian tradition who performed mercy-endings with an olive-wood hammer.",
    category: "SARDINIAN_DIALECT",
    approvedUsage: "Refers respectfully to historical mercy rituals and olive-wood artifacts.",
    prohibitedMisuse: "Do not depict as malicious murderer or cartoon villain."
  }
];

const SAMPLE_SUGGESTIONS: AgentSuggestion[] = [
  {
    id: "SUGG-101",
    agentName: "Geographic Auditor Agent",
    agentRole: "Geography & Topography",
    targetParagraph: "Paragraph 14 (Grotta di Nettuno transit)",
    originalText: "The team jumped directly into the deep sea trench from the cliff top without equipment.",
    proposedText: "The team descended Escala del Cabirol's 654 steps, securing safety harnesses near the sea-level cave entrance.",
    rationale: "Fixes physical impossibility & sea-level karst topography firewall rule.",
    status: 'PENDING'
  },
  {
    id: "SUGG-102",
    agentName: "Sensory Stylist Agent",
    agentRole: "Prose & Atmosphere",
    targetParagraph: "Paragraph 22 (Acoustic resonance scene)",
    originalText: "The cave echoed loudly with strange mineral noises.",
    proposedText: "A low, metallic hum vibrated through the wet limestone walls, making the salt water in their flasks tremble in recursive circles.",
    rationale: "Elevates tactile and acoustic sensory depth score by +18 points.",
    status: 'PENDING'
  },
  {
    id: "SUGG-103",
    agentName: "Canon Continuity Agent",
    agentRole: "Character Canon & Animals",
    targetParagraph: "Paragraph 30 (Dog perception scene)",
    originalText: "Mia and Tina glowed softly, barking at the magical electromagnetic spectrum.",
    proposedText: "Mia and Tina paced restlessly on the wooden deck, growling low at the hull's deep physical vibration.",
    rationale: "Enforces Dog Magic Forbidden rule (dogs remain strictly non-magical animals).",
    status: 'PENDING'
  }
];

const BRANCH_OPTIONS: StoryBranchOption[] = [
  {
    branchId: "BRANCH-A",
    title: "Branch A: High-Stakes Action (Cave Flooding Escape)",
    tone: "ACTION_HIGH_STAKES",
    summary: "High-tide surge threatens the Escala del Cabirol exit; Katia and Maris must rig a pulley line using maritime cables while André navigates the Sentina close to shore.",
    predictedTension: 96,
    canonImpact: "Tests Katia's engineering intuition and André's boat handling under severe wave action."
  },
  {
    branchId: "BRANCH-B",
    title: "Branch B: Emotional Confrontation (Sibling Secret Unveiling)",
    tone: "EMOTIONAL_CONFRONTATION",
    summary: "Veerle confronts Geronimo regarding missing childhood memories connected to Monte Arci obsidian, revealing early family project journals.",
    predictedTension: 84,
    canonImpact: "Deepens biological sibling bond canon (Geronimo, Veerle, Katia) without breaking trust."
  },
  {
    branchId: "BRANCH-C",
    title: "Branch C: Stealth & Mineral Puzzles (Decoy Halite Extraction)",
    tone: "STEALTH_MYSTERY",
    summary: "Inga performs chemical salinity tests on the candidate amulet, discovering it dissolves in salt water—proving it to be a false decoy before activation.",
    predictedTension: 89,
    canonImpact: "Exposes decoy false amulet mechanics and prevents wasted mineral activation energy."
  }
];

export function CoWriterSwarmSandbox() {
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>(SAMPLE_SUGGESTIONS);
  const [selectedBranch, setSelectedBranch] = useState<StoryBranchOption>(BRANCH_OPTIONS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAction = (id: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-lg text-stone-100">Automated Multi-Agent Swarm Co-Writer Sandbox</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AUTOPILOT MODULE 3
              </span>
            </div>
            <p className="text-xs text-stone-400">Real-time co-writer suggestions, inline prose refinements, and alternative plot branching simulation.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-stone-950 p-2 rounded-xl border border-stone-800 text-stone-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Swarm Status: <strong className="text-emerald-400">3 Active Inline Suggestions</strong></span>
        </div>
      </div>

      {/* Inline Agent Suggestions Arena */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Swarm Agent Co-Writer Suggestions</span>
          </div>
          <span className="text-[10px] font-mono text-stone-400">
            Review & Approve Inline Prose Refinements
          </span>
        </div>

        <div className="space-y-3">
          {suggestions.map((sugg) => (
            <div 
              key={sugg.id}
              className={`p-4 rounded-xl border transition ${
                sugg.status === 'ACCEPTED'
                  ? 'bg-emerald-950/20 border-emerald-800/80'
                  : sugg.status === 'REJECTED'
                  ? 'bg-stone-950/40 border-stone-800/50 opacity-60'
                  : 'bg-stone-950 border-stone-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-800/60">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{sugg.agentName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-400">
                    {sugg.agentRole}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-stone-500">{sugg.targetParagraph}</span>
                  {sugg.status !== 'PENDING' && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${sugg.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'}`}>
                      {sugg.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3 text-xs font-mono">
                <div className="bg-red-950/20 p-2.5 rounded border border-red-900/40 space-y-1">
                  <span className="text-[10px] text-red-400 font-bold block uppercase">Original Text</span>
                  <p className="text-stone-300 line-through leading-relaxed">{sugg.originalText}</p>
                </div>
                <div className="bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Proposed Swarm Refinement</span>
                  <p className="text-stone-100 font-semibold leading-relaxed">{sugg.proposedText}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <p className="text-[11px] font-mono text-stone-400 italic">
                  Rationale: <span className="text-stone-300">{sugg.rationale}</span>
                </p>

                {sugg.status === 'PENDING' && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleAction(sugg.id, 'ACCEPTED')}
                      className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-stone-100 font-mono font-bold text-xs transition flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Refinement</span>
                    </button>
                    <button
                      onClick={() => handleAction(sugg.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sardinian Dialect & Mythic Terminology Lexicon Check Tool */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>Sardinian Dialect & Mythic Terminology Lexicon Check</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHENTIC ANCIENT SARDINIAN TONE ENFORCED</span>
          </span>
        </div>

        <p className="text-xs text-stone-400 font-sans">
          The co-writer swarm cross-references all draft paragraphs against this verified Sardinian lexicon before outputting candidate prose.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {SARDINIAN_LEXICON.map((item) => (
            <div key={item.term} className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-amber-300">{item.term}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-400">
                    {item.category}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-stone-500">{item.phonetic}</div>
                <p className="text-[11px] text-stone-300 leading-snug">{item.meaning}</p>
              </div>

              <div className="space-y-1 border-t border-stone-800/80 pt-2 text-[10px] font-mono">
                <div className="text-emerald-400 flex items-start space-x-1">
                  <span className="font-bold shrink-0">✓ Approved:</span>
                  <span className="text-stone-300">{item.approvedUsage}</span>
                </div>
                <div className="text-red-400 flex items-start space-x-1">
                  <span className="font-bold shrink-0">✕ Prohibited:</span>
                  <span className="text-stone-400">{item.prohibitedMisuse}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Story Branching Sandbox */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-stone-200">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <span>Alternative Plot Branching & Narrative Simulation</span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 font-bold">3 BRANCH PATHS READY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BRANCH_OPTIONS.map((branch) => {
            const isSelected = selectedBranch.branchId === branch.branchId;
            return (
              <div
                key={branch.branchId}
                onClick={() => setSelectedBranch(branch)}
                className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-purple-950/30 border-purple-500/80 shadow-md ring-1 ring-purple-500/30' 
                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">{branch.tone}</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{branch.predictedTension}% Tension</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs text-stone-100">{branch.title}</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed font-sans">{branch.summary}</p>
                </div>

                <div className="border-t border-stone-800/80 pt-2 text-[10px] font-mono text-stone-400">
                  Canon Impact: <span className="text-stone-200">{branch.canonImpact}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Branch Confirmation Footbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-800/80 text-xs font-mono text-stone-300">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Selected Plot Path: <strong className="text-purple-300">{selectedBranch.title}</strong></span>
          </div>
          <button 
            onClick={() => handleCopy(selectedBranch.summary, selectedBranch.branchId)}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-stone-200 transition flex items-center space-x-1.5 text-[11px]"
          >
            <Copy className="w-3.5 h-3.5 text-amber-400" />
            <span>{copiedId === selectedBranch.branchId ? 'Copied Branch Brief!' : 'Copy Plot Branch Brief'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
