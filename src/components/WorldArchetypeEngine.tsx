import React, { useState } from 'react';
import { 
  Globe2, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Layers, 
  Check, 
  Flame,
  Zap,
  Info
} from 'lucide-react';

export interface WorldArchetype {
  id: string;
  name: string;
  genre: string;
  icon: string;
  description: string;
  primarySetting: string;
  keyRuleFirewalls: string[];
  activeLexicon: string[];
  suggestedAmuletsOrArtifacts: string[];
  samplePacingProfile: { tensionPeak: number; sensoryFocus: string };
}

const PRESET_ARCHETYPES: WorldArchetype[] = [
  {
    id: "ARCH-SARDINIA",
    name: "Sardinia Mythos & Immutable Heritage",
    genre: "Sardinian Mythological Thriller",
    icon: "🏝️",
    description: "Verified Sardinian archaeology, nuragic monuments, mineralogy, and traditional myths (Cogas, Scultone, Accabadora) re-awakened by 12 authentic mineral amulets.",
    primarySetting: "Mediterranean / Sardinia (Alghero, Capo Caccia, Barbagia, Nuraghe Santu Antine)",
    keyRuleFirewalls: [
      "Zero Invention Firewall (Strict real history & mineral check)",
      "Exactly 12 True Amulets Limit",
      "Dog Perceptions: Strict Non-Magical Animals (Mia & Tina)",
      "Locked Biological Sibling Canon (Geronimo, Veerle, Katia)"
    ],
    activeLexicon: ["Domus de Janas", "Nuraghe", "Accabadora", "Sentina", "Accabaddora", "Su Murtarolu"],
    suggestedAmuletsOrArtifacts: ["S'Urtzu Obsidiana", "Silver Halite Soluble Amulet", "Monte Arci Obsidian Tear"],
    samplePacingProfile: { tensionPeak: 88, sensoryFocus: "Acoustic resonance, damp sea caves, obsidian coldness" }
  },
  {
    id: "ARCH-CYBERPUNK",
    name: "Neo-Tokyo Cybernetics & Neural Noir",
    genre: "Cyberpunk / Tech Noir",
    icon: "🏙️",
    description: "High-tech low-life neon metropolis featuring neural interfaces, corporate espionage, rogue AI swarms, and synthetic bio-enhancements.",
    primarySetting: "Neo-Shinjuku Under-Spire (Sector 07), Chrome Docks & Orbital Relay",
    keyRuleFirewalls: [
      "No Unthrottled AI God-Mode",
      "Neural Overdrive Latency & Memory Corruption Limits",
      "Corporate Ownership Legal Firewalls"
    ],
    activeLexicon: ["Neuro-Jack", "Sub-Dermal Fiber", "ICE Breaker", "Corpo-Vault", "Synapse Leak"],
    suggestedAmuletsOrArtifacts: ["Quantum Keycard Delta", "Corrupted AI Core Chip", "Optic Cloaking Prism"],
    samplePacingProfile: { tensionPeak: 95, sensoryFocus: "Rain-slicked neon reflections, buzzing server racks, metallic ozone" }
  },
  {
    id: "ARCH-ELDRITCH",
    name: "Lovecraftian Deep-Sea Exploration",
    genre: "Eldritch Horror / Nautical Gothic",
    icon: "🐙",
    description: "Nineteenth-century oceanic expedition investigating abyssal trenches, forgotten sunken monoliths, and cosmic horror madness.",
    primarySetting: "Challenger Deep Abyssal Trench & The SS Endeavour III Research Vessel",
    keyRuleFirewalls: [
      "Sanity Degradation Barometer Enforcement",
      "Realistic Pressure Mechanics & Nautical Physics",
      "Ancient Entity Non-Human Speech Rules"
    ],
    activeLexicon: ["Abyssal Trench", "Sub-Surface Pressure", "Non-Euclidean Geometry", "Bioluminescent Spores"],
    suggestedAmuletsOrArtifacts: ["Sunken Basalt Relic", "Phosphor Leviathan Tooth", "Void Compass"],
    samplePacingProfile: { tensionPeak: 92, sensoryFocus: "Crushing ocean pressure, muffled sonar pings, salt air" }
  },
  {
    id: "ARCH-SPACE-OPERA",
    name: "Quantum Frontier Space Opera",
    genre: "Hard Sci-Fi / Space Opera",
    icon: "🚀",
    description: "Interstellar diplomacy, dark-matter propulsion, wormhole navigation, and ancient alien megastructure exploration.",
    primarySetting: "Kepler-186f Orbital Ring & The Dyson Swarm Station",
    keyRuleFirewalls: [
      "Relativistic Time-Dilation Rules",
      "Reactor Heat Dissipation Constraints",
      "Zero-G Physics & Inertial Compensation Rules"
    ],
    activeLexicon: ["Wormhole Gate", "Tachyon Burst", "Dyson Swarm", "Gravity Well", "Sub-Light Thruster"],
    suggestedAmuletsOrArtifacts: ["Singularity Drive Key", "Alien Star-Chart Crystal", "Chronos Relic"],
    samplePacingProfile: { tensionPeak: 85, sensoryFocus: "Humming reactor core, starlight glare, recycled oxygen" }
  }
];

export function WorldArchetypeEngine() {
  const [selectedArchetype, setSelectedArchetype] = useState<WorldArchetype>(PRESET_ARCHETYPES[0]);
  const [customGenre, setCustomGenre] = useState('');
  const [customSetting, setCustomSetting] = useState('');
  const [customRule, setCustomRule] = useState('');
  const [customRulesList, setCustomRulesList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'firewalls'>('presets');

  const handleAddCustomRule = () => {
    if (customRule.trim()) {
      setCustomRulesList([...customRulesList, customRule.trim()]);
      setCustomRule('');
    }
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-400">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-lg text-stone-100">Universal Niche & World-Building Archetype Engine</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AUTOPILOT MODULE 1
              </span>
            </div>
            <p className="text-xs text-stone-400">Configure genre-specific worldbuilding rules, fact firewalls, lexicons, and pacing profiles for any topic or niche.</p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeTab === 'presets' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Presets ({PRESET_ARCHETYPES.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeTab === 'custom' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Custom Genre Builder
          </button>
          <button
            onClick={() => setActiveTab('firewalls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeTab === 'firewalls' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Active Firewalls
          </button>
        </div>
      </div>

      {/* Preset Archetypes Cards */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_ARCHETYPES.map((arch) => {
            const isSelected = selectedArchetype.id === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => setSelectedArchetype(arch)}
                className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-amber-950/30 border-amber-500/80 shadow-lg ring-1 ring-amber-500/30' 
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{arch.icon}</span>
                      <h3 className="font-serif font-bold text-sm text-stone-100">{arch.name}</h3>
                    </div>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                        <Check className="w-3 h-3" />
                        <span>ACTIVE ARCHETYPE</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400/90 font-semibold">{arch.genre}</div>
                  <p className="text-xs text-stone-300 leading-relaxed">{arch.description}</p>
                </div>

                <div className="space-y-2 border-t border-stone-800/80 pt-3">
                  <div className="text-[10px] font-mono text-stone-400 flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">Setting: {arch.primarySetting}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {arch.activeLexicon.slice(0, 4).map((lex) => (
                      <span key={lex} className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                        {lex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Genre Builder Tab */}
      {activeTab === 'custom' && (
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <Sliders className="w-4 h-4" />
            <h3 className="font-serif font-bold text-sm text-stone-200">Define Custom World & Genre Constraints</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5">
              <label className="text-stone-400 block">Genre Title / Niche Name</label>
              <input
                type="text"
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder="e.g. Victorian Steam-Tech Detective"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-stone-400 block">Primary World Setting & Coordinates</label>
              <input
                type="text"
                value={customSetting}
                onChange={(e) => setCustomSetting(e.target.value)}
                placeholder="e.g. Fog-shrouded London Docks, 1888"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-mono text-stone-400 block">Add Fact-Checking Rules & Genre Firewalls</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
                placeholder="e.g. Steam engines cannot exceed 200 PSI without copper alloy failure"
                className="flex-1 bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddCustomRule}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-100 text-xs font-mono font-bold rounded-lg transition"
              >
                + Add Rule
              </button>
            </div>
            {customRulesList.length > 0 && (
              <div className="space-y-1 pt-2">
                {customRulesList.map((r, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-stone-900 p-2 rounded border border-stone-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Selected Archetype & Rule Firewalls Summary */}
      <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ACTIVE GENRE FIREWALLS: {selectedArchetype.name}</span>
          </div>
          <span className="text-[10px] font-mono text-stone-400">
            {selectedArchetype.keyRuleFirewalls.length} Rules Enforced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          {selectedArchetype.keyRuleFirewalls.map((rule, idx) => (
            <div key={idx} className="flex items-start space-x-2 bg-stone-900/80 p-2 rounded border border-stone-800">
              <span className="text-amber-400 font-bold">#{idx + 1}</span>
              <span className="text-stone-200">{rule}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-400 pt-2 border-t border-stone-800/60 gap-2">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Pacing Tension Peak: <strong className="text-amber-400">{selectedArchetype.samplePacingProfile.tensionPeak}%</strong></span>
          </div>
          <div className="text-stone-300">
            Sensory Focus: <strong className="text-emerald-300">{selectedArchetype.samplePacingProfile.sensoryFocus}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
