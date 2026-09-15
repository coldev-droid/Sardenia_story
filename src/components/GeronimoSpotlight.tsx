import React from 'react';
import { User, Anchor, Compass, Shield, Cpu, Activity, MapPin, Heart, BookOpen, Key, Sparkles, CheckCircle2 } from 'lucide-react';

export function GeronimoSpotlight() {
  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 shadow-md">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif font-bold text-xl text-stone-100">Geronimo in Sardinia — Character Dossier</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                LOCKED CANON ENTITY
              </span>
            </div>
            <p className="text-xs text-stone-400">Expedition Leader, Barcelona Software Engineer & Owner of the Vessel Sentina</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-lg bg-stone-950 border border-stone-800 text-amber-400 font-bold flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Capo Caccia & Alghero Coast</span>
          </span>
        </div>
      </div>

      {/* Main Grid Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Card & Immutable Identity (5 Cols) */}
        <div className="lg:col-span-5 bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-stone-900 aspect-[3/4] flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent z-10" />
              <div className="z-20 space-y-2">
                <span className="text-xs font-mono text-amber-400 font-bold tracking-widest uppercase">Lead Protagonist</span>
                <h3 className="font-serif font-bold text-2xl text-stone-100">Geronimo</h3>
                <p className="text-xs text-stone-300 font-sans italic max-w-xs mx-auto">
                  "Thinking in systems, dependencies, and subterranean signals along the Sardinian coastline."
                </p>
              </div>
            </div>

            {/* Locked Identity Tags */}
            <div className="space-y-2 text-xs font-mono">
              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase block">Profession & Aptitude</span>
                <p className="text-stone-200 font-sans text-xs">
                  Software Programmer & Systems Architect. Approaches ancient puzzles through recursive logic without hacking ancient lore.
                </p>
              </div>

              <div className="bg-stone-900 p-3 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Biological Family Links</span>
                <p className="text-stone-200 font-sans text-xs">
                  Brother to Katia and Veerle. Work partner to Maris. Business partner to André in Barcelona.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-[10px] font-mono text-amber-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero-Invention Rule Verified: All traits aligned with canonical relationship matrix.</span>
          </div>
        </div>

        {/* Right Column: Active Story State & 5-Book Evolution (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-sm text-amber-400 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Current Status in Book I & II</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Vessel & Command</span>
                <span className="font-bold text-stone-100 block">Sentina Anchorage</span>
                <p className="text-[11px] text-stone-400 font-sans">Anchored off Capo Caccia cliffs; monitoring 784Hz subterranean radio signals.</p>
              </div>

              <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Physical Condition</span>
                <span className="font-bold text-amber-400 block">Monte Arci Palm Scar</span>
                <p className="text-[11px] text-stone-400 font-sans">Resonates when near volcanic glass obsidian matrices.</p>
              </div>

              <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Non-Magical Canines</span>
                <span className="font-bold text-stone-100 block">Mia & Tina</span>
                <p className="text-[11px] text-stone-400 font-sans">Natural protective senses on deck; strictly non-supernatural behavior.</p>
              </div>

              <div className="bg-stone-900 p-3.5 rounded-lg border border-stone-800 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Amulet Custody</span>
                <span className="font-bold text-emerald-400 block">True Amulet #01 (S'Urtzu)</span>
                <p className="text-[11px] text-stone-400 font-sans">Obsidian flake recovered in Capo Caccia cave system.</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
            <h4 className="font-serif font-bold text-sm text-stone-100 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Geronimo's 5-Book Evolution Track</span>
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex items-start justify-between">
                <div>
                  <span className="font-bold text-amber-400">Book I: The Radio Signals</span>
                  <p className="text-stone-300 font-sans text-[11px]">Discovers 784Hz electromagnetic pulse in Grotta di Nettuno.</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">LOCKED</span>
              </div>

              <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex items-start justify-between">
                <div>
                  <span className="font-bold text-amber-400">Book II: Monte Arci Memory Wall</span>
                  <p className="text-stone-300 font-sans text-[11px]">Resonates with obsidian glass wall, uncovering lost Nuragic records.</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">ACTIVE</span>
              </div>

              <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 flex items-start justify-between">
                <div>
                  <span className="font-bold text-amber-400">Books III–V: The 12-Amulet Convergence</span>
                  <p className="text-stone-300 font-sans text-[11px]">Leads parallel team through Santa Cristina, Baunei chasms, and Santu Antine.</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">PLANNED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
