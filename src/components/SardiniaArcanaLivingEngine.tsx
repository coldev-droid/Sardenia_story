import React, { useState } from 'react';
import { 
  Sparkles, 
  Globe2, 
  Flame, 
  Eye, 
  QrCode, 
  Compass, 
  Cpu, 
  Layers, 
  GitBranch, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Feather, 
  Volume2, 
  BookOpen, 
  Heart, 
  HelpCircle,
  Share2,
  Lock
} from 'lucide-react';

export interface MagicDnaFormula {
  place: string;
  emotion: string;
  memory: string;
  price: string;
  transformation: string;
}

export interface MagicEchoItem {
  id: string;
  bookPageSymbol: string;
  audioFrequencyNote: string;
  digitalMemoryUnlocked: string;
  globalCommunityProgress: number; // percentage
  status: 'ACTIVE_RESONANCE' | 'LOCKED_PUZZLE' | 'SOLVED_GLOBAL';
}

export function SardiniaArcanaLivingEngine() {
  const [activeLayer, setActiveLayer] = useState<'memory' | 'magic_dna' | 'second_story' | 'reader_passport' | 'alive_island' | 'echoes'>('magic_dna');

  // Magic DNA State Generator
  const [magicFormula, setMagicFormula] = useState<MagicDnaFormula>({
    place: "Moonlit Pozzo Sacro di Santa Cristina (Subterranean Keyhole Stairwell)",
    emotion: "Grief for an ancient lineage loss combined with quiet determination",
    memory: "The childhood recollection of cold olive-oil lamps during power blackouts",
    price: "Permanently surrendering the exact sound of a sibling's laughter",
    transformation: "The silver halite water crystallizes into a floating, resonant guidance needle"
  });

  const [generatedSpellOutput, setGeneratedSpellOutput] = useState<string | null>(null);

  // Magic Echoes State
  const [echoes] = useState<MagicEchoItem[]>([
    {
      id: "ECHO-01",
      bookPageSymbol: "Carved Spiral Shell (Book I, Page 42)",
      audioFrequencyNote: "784 Hz (Resonant Subterranean Whistle)",
      digitalMemoryUnlocked: "Secret Diary Page of André regarding early Sentina maritime logs",
      globalCommunityProgress: 88,
      status: 'ACTIVE_RESONANCE'
    },
    {
      id: "ECHO-02",
      bookPageSymbol: "Double-Horned Bronze Archer Helmet (Book II, Page 118)",
      audioFrequencyNote: "432 Hz (Nuragic Bronze Tuning Fork)",
      digitalMemoryUnlocked: "AR Portal: 360-degree Nuraghe Santu Antine Interior Chamber",
      globalCommunityProgress: 64,
      status: 'ACTIVE_RESONANCE'
    },
    {
      id: "ECHO-03",
      bookPageSymbol: "Obsidian Tear Stele (Book III, Page 204)",
      audioFrequencyNote: "528 Hz (Volcanic Glass Solfeggio Tone)",
      digitalMemoryUnlocked: "Unlocks Companion Chapter 3.5: Inga's Hidden Mineral Diary",
      globalCommunityProgress: 35,
      status: 'LOCKED_PUZZLE'
    }
  ]);

  const handleSynthesizeMagic = () => {
    setGeneratedSpellOutput(
      `[SARDINIA ARCANA MAGIC DNA SYNTHESIS]\nFormula: Magic = Place (${magicFormula.place}) + Emotion (${magicFormula.emotion}) + Memory (${magicFormula.memory}) + Price (${magicFormula.price}) + Transformation (${magicFormula.transformation})\n\nOutcome: Near the water surface at Santa Cristina, grief turns the cold halite solution into a suspended crystal needle. Cost paid: One shared sibling memory safely transferred into stone.`
    );
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Engine Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-stone-100 shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Sardinia Arcana — Living Storyworld Engine</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                LIVING MYTHOLOGY PLATFORM
              </span>
            </div>
            <p className="text-xs text-stone-400">An evolving, 5-layer transmedia storyworld connecting book prose, reader QR passports, magic DNA formulas, and living island memory.</p>
          </div>
        </div>

        {/* Layer Selector Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveLayer('magic_dna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeLayer === 'magic_dna' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Magic DNA Formula
          </button>
          <button
            onClick={() => setActiveLayer('echoes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeLayer === 'echoes' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Magic Echoes & QR
          </button>
          <button
            onClick={() => setActiveLayer('alive_island')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeLayer === 'alive_island' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Conscious Island Memory
          </button>
          <button
            onClick={() => setActiveLayer('second_story')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${activeLayer === 'second_story' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Invisible Second Story
          </button>
        </div>
      </div>

      {/* Layer 1: Magic DNA Engine */}
      {activeLayer === 'magic_dna' && (
        <div className="space-y-5">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>The Magic DNA Formula</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Magic = Place + Emotion + Memory + Price + Transformation
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Guarantees that every supernatural event possesses psychological depth, emotional stakes, strict limits, and persistent consequences rather than random spells.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1.5 bg-stone-950 p-3 rounded-xl border border-stone-800">
              <label className="text-amber-400 font-bold block">1. Sacred Place / Monument</label>
              <input
                type="text"
                value={magicFormula.place}
                onChange={(e) => setMagicFormula({ ...magicFormula, place: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 bg-stone-950 p-3 rounded-xl border border-stone-800">
              <label className="text-purple-400 font-bold block">2. Human Emotion State</label>
              <input
                type="text"
                value={magicFormula.emotion}
                onChange={(e) => setMagicFormula({ ...magicFormula, emotion: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 bg-stone-950 p-3 rounded-xl border border-stone-800">
              <label className="text-blue-400 font-bold block">3. Anchor Memory</label>
              <input
                type="text"
                value={magicFormula.memory}
                onChange={(e) => setMagicFormula({ ...magicFormula, memory: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 bg-stone-950 p-3 rounded-xl border border-stone-800">
              <label className="text-red-400 font-bold block">4. Sacrificial Price / Limitation</label>
              <input
                type="text"
                value={magicFormula.price}
                onChange={(e) => setMagicFormula({ ...magicFormula, price: e.target.value })}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs font-mono">
            <label className="text-emerald-400 font-bold block">5. Physical Transformation Outcome</label>
            <input
              type="text"
              value={magicFormula.transformation}
              onChange={(e) => setMagicFormula({ ...magicFormula, transformation: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleSynthesizeMagic}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-100 font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Synthesize Magic Event & Verify DNA Balance</span>
            </button>
          </div>

          {generatedSpellOutput && (
            <div className="bg-stone-950 p-4 rounded-xl border border-amber-500/50 font-mono text-xs text-amber-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {generatedSpellOutput}
            </div>
          )}
        </div>
      )}

      {/* Layer 2: Signature Innovation — Magic Echoes & Reader QR Passports */}
      {activeLayer === 'echoes' && (
        <div className="space-y-4">
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Magic Echoes Transmedia Loop (Book → Audio → Digital Memory → Global Discovery)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                GLOBAL READER NETWORK
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Printed sigils and illustrations in physical books trigger spatial audio frequencies, unlocking hidden digital companion memories and collective reader puzzle milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {echoes.map((echo) => (
              <div key={echo.id} className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{echo.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${echo.status === 'ACTIVE_RESONANCE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {echo.status}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-xs text-stone-100">{echo.bookPageSymbol}</h4>

                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-purple-400 flex items-center space-x-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{echo.audioFrequencyNote}</span>
                    </div>
                    <p className="text-stone-300 text-[11px] font-sans leading-snug pt-1">
                      {echo.digitalMemoryUnlocked}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-stone-800/80 pt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                    <span>Global Reader Solving Progress</span>
                    <span className="text-emerald-400 font-bold">{echo.globalCommunityProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${echo.globalCommunityProgress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Living Island Memory */}
      {activeLayer === 'alive_island' && (
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 border-b border-stone-800 pb-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Sardinia as a Conscious Entity (Wind, Sea Foam, Stone & Dreams)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-2">
              <span className="text-amber-400 font-bold block">1. Environmental Speech Channels</span>
              <p className="text-stone-300 leading-relaxed font-sans text-[11px]">
                The island communicates through Maestrale wind velocity, limestone cave acoustics, tide rhythms, and dog behavioral shifts (Mia & Tina sensing low-frequency vibration).
              </p>
            </div>

            <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-2">
              <span className="text-purple-400 font-bold block">2. The Island's Dream Mechanics</span>
              <p className="text-stone-300 leading-relaxed font-sans text-[11px]">
                The revolutionary twist: Sardinia is dreaming its ancient inhabitants and modern explorers—and reader engagement provides the telluric focus that keeps the world alive.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Layer 4: Invisible Second Story */}
      {activeLayer === 'second_story' && (
        <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3 text-xs font-mono">
          <div className="flex items-center space-x-2 text-amber-400 border-b border-stone-800 pb-2 font-bold">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Encoded Symbology & Background Messages</span>
          </div>

          <p className="text-stone-300 leading-relaxed font-sans text-xs">
            Every chapter contains a dual narrative: the surface adventure understood immediately, and a hidden sub-layer encoded through weather patterns, animal behaviors, mineral colors, and repeating song lyrics.
          </p>

          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
            <span className="text-emerald-400 font-bold block">Example Encoded Layer:</span>
            <span className="text-stone-200 font-serif">"The wind always turns 12 degrees West before an amulet resonates near halite deposits."</span>
          </div>
        </div>
      )}
    </div>
  );
}
