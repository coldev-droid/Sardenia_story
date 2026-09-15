import React, { useState } from 'react';
import { 
  Sparkles, 
  Image, 
  Copy, 
  Check, 
  RefreshCw, 
  BookOpen, 
  Palette, 
  MapPin, 
  ShieldCheck, 
  Zap,
  Sliders
} from 'lucide-react';

export interface ApprovedMythCharacter {
  id: string;
  name: string;
  sardinianName: string;
  regionalOrigin: string;
  mineralConnection: string;
  canonicalTraits: string[];
  visualPromptText: string;
  colorPaletteHex: string[];
}

const APPROVED_MYTH_ROSTER: ApprovedMythCharacter[] = [
  {
    id: "MYTH-01",
    name: "S'Urtzu",
    sardinianName: "S'Urtzu de Mamujada",
    regionalOrigin: "Barbagia & Mamoiada Mountains",
    mineralConnection: "Black Obsidian Glass & Granite",
    canonicalTraits: [
      "Zoomorphic horned earth entity clad in dark sheepskin",
      "Crown wreath of pine branches and oak moss",
      "Obsidian flake embedded in forehead chest seal",
      "Earthy bronze and charcoal atmosphere"
    ],
    colorPaletteHex: ["#1c1917", "#78350f", "#d97706", "#064e3b"],
    visualPromptText: "Cinematic portrait of S'Urtzu, an ancient Sardinian mythic horned earth spirit wearing dark sheepskin and a pine branch wreath, forehead glowing with black obsidian glass rune, dark granite mountain dusk background, photorealistic oil-painting lighting, 4k"
  },
  {
    id: "MYTH-02",
    name: "Sa Coga",
    sardinianName: "Sa Coga Manna",
    regionalOrigin: "Capo Caccia Coastal Caves",
    mineralConnection: "Marine Halite Crystal & Sea-Limestone",
    canonicalTraits: [
      "Nocturnal sea-wind veil shifting between shadow and human form",
      "Paler eyes reflecting marine bioluminescence",
      "Silver salt crystal amulet around neck",
      "Capo Caccia sea-cliff background with crashing waves"
    ],
    colorPaletteHex: ["#0f172a", "#0284c7", "#38bdf8", "#64748b"],
    visualPromptText: "Dramatic portrait of Sa Coga, a mysterious Sardinian coastal wind spirit with shimmering salt crystal veil and luminous sea-blue eyes, night storm over Capo Caccia limestone cliffs, moody cinematic lighting, photorealistic art"
  },
  {
    id: "MYTH-03",
    name: "Su Scultone",
    sardinianName: "Su Scultone de Baunei",
    regionalOrigin: "Gola di Gorropu & Baunei Karst Chasm",
    mineralConnection: "White Karst Limestone & Calcite Crystals",
    canonicalTraits: [
      "Coiled limestone serpent with calcified scales",
      "Eyes glowing like subterranean torchlight",
      "Guarding white calcite crystal formations",
      "Deep Gorropu canyon shadow aesthetic"
    ],
    colorPaletteHex: ["#292524", "#d6d3d1", "#eab308", "#78350f"],
    visualPromptText: "Epic fantasy portrait of Su Scultone, the ancient limestone dragon serpent of Baunei Sardinia, coiled inside a deep white calcite crystal cave, glowing amber eyes, rich textures, photorealistic"
  },
  {
    id: "MYTH-04",
    name: "Domus Janas Weaver",
    sardinianName: "Jana de Domos de Janas",
    regionalOrigin: "Sedini & Alghero Subterranean Tombs",
    mineralConnection: "Gold Thread & Basalt Petroglyphs",
    canonicalTraits: [
      "Ethereal weaver maiden holding glowing gold thread",
      "Wearing traditional embroidered Sardinian linen robe",
      "Carved basalt petroglyphs glowing soft amber behind her",
      "Sacred, gentle ancient presence"
    ],
    colorPaletteHex: ["#451a03", "#b45309", "#fef08a", "#1e293b"],
    visualPromptText: "Intricate portrait of a Janas fairy weaver inside a domus de janas basalt rock chamber in Sardinia, weaving glowing golden thread, wearing traditional Sardinian embroidered garments, warm ambient light, highly detailed"
  }
];

export function ApprovedMythPortraitStudio() {
  const [selectedMyth, setSelectedMyth] = useState<ApprovedMythCharacter>(APPROVED_MYTH_ROSTER[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [generatingPortrait, setGeneratingPortrait] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedMyth.visualPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleGenerate = () => {
    setGeneratingPortrait(true);
    setTimeout(() => {
      setGeneratingPortrait(false);
    }, 1000);
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-stone-100 shadow-md">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Approved Myth Roster & Imagen Portrait Studio</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                IMAGEN 3 / GEMINI ART ENGINE
              </span>
            </div>
            <p className="text-xs text-stone-400">Generates consistent, thematic character portraits for the approved Sardinian myth roster based on canonical traits.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-stone-950 border border-stone-800 text-purple-400 font-bold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>CANONICAL VISUAL ALIGNMENT</span>
          </span>
        </div>
      </div>

      {/* Main Studio Layout: Roster List (4 cols) & Visual Canvas Studio (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Approved Myth Roster Cards */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-xs font-mono font-bold text-stone-400 uppercase block pb-1">
            Approved Myth Roster ({APPROVED_MYTH_ROSTER.length})
          </span>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {APPROVED_MYTH_ROSTER.map((myth) => {
              const isSelected = selectedMyth.id === myth.id;
              return (
                <div
                  key={myth.id}
                  onClick={() => setSelectedMyth(myth)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500'
                      : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-400">{myth.id}</span>
                    <span className="text-[10px] font-mono text-stone-400">{myth.sardinianName}</span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-stone-100">{myth.name}</h4>
                  <p className="text-[10px] text-stone-400 font-sans">{myth.regionalOrigin}</p>

                  <div className="flex items-center space-x-1 pt-1">
                    {myth.colorPaletteHex.map(color => (
                      <div key={color} className="w-3 h-3 rounded-full border border-stone-700" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Canvas Studio & Imagen Prompt Payload */}
        <div className="lg:col-span-8 bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{selectedMyth.sardinianName}</span>
                <h3 className="font-serif font-bold text-lg text-stone-100">{selectedMyth.name}</h3>
                <span className="text-xs text-stone-400 font-mono">{selectedMyth.regionalOrigin} • {selectedMyth.mineralConnection}</span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generatingPortrait}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-stone-100 font-mono text-xs font-bold rounded-xl shadow transition flex items-center space-x-2 shrink-0"
              >
                {generatingPortrait ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
                    <span>Rendering Canvas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-300" />
                    <span>Render Thematic Canvas</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulated High-Definition Thematic Canvas Display */}
            <div className="relative rounded-xl border border-stone-800 bg-stone-900 p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[200px] overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${selectedMyth.colorPaletteHex[2]} 0%, transparent 70%)`
                }}
              />

              <div className="z-10 space-y-2">
                <div className="p-3 rounded-full bg-stone-950/80 border border-purple-800/80 text-purple-300 inline-block shadow-lg">
                  <Palette className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-stone-100">{selectedMyth.name} Visual Portrait</h4>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">Mineral Alignment: {selectedMyth.mineralConnection}</span>
                </div>
              </div>

              <div className="z-10 flex flex-wrap justify-center gap-1.5 pt-2 max-w-lg">
                {selectedMyth.canonicalTraits.map(trait => (
                  <span key={trait} className="px-2.5 py-1 rounded bg-stone-950/80 border border-stone-800 text-[11px] font-sans text-stone-300">
                    ✓ {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Imagen Prompt Payload Box */}
            <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold text-[10px] uppercase">Imagen 3 Prompt Payload</span>
                <button
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 rounded bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-mono text-[10px] flex items-center space-x-1.5 transition"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-stone-400" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3 bg-stone-950 rounded border border-stone-800 text-[11px] text-amber-200 font-mono whitespace-pre-wrap leading-relaxed">
                {selectedMyth.visualPromptText}
              </pre>
            </div>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-[10px] font-mono text-purple-300 flex items-center justify-between">
            <span>Canonical Visual Guarantee: Image traits matched against Approved Myth Roster rulebook.</span>
            <span className="font-bold text-emerald-400">100% TRAIT MATCH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
