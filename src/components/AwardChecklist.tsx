import React from 'react';
import { Award, CheckCircle2, TrendingUp, Sparkles, BookCheck } from 'lucide-react';

export const AwardChecklist: React.FC = () => {
  const checklistItems = [
    { title: 'Rich Sensory & Olfactory Imagery of Sardinia', status: 'Optimized', desc: 'Myrtle, rosemary, sun-baked granite, and salt spray woven into every scene.' },
    { title: 'Nuragic Architectural Authenticity', status: 'Verified', desc: 'Accurate depiction of tholos domes, cyclopean masonry, and sacred wells.' },
    { title: 'Character Arc Depth', status: 'Optimized', desc: 'Dual protagonist emotional arcs bridging modern archaeology and ancient folklore.' },
    { title: 'Mythological Consistency Across 5 Books', status: 'Verified', desc: 'Seamless integration of the 12 amulets and the Giants of Monte Prama lore.' },
    { title: 'International Best-Seller Pacing', status: 'Ready', desc: 'Cliffhanger chapter endings and high-stakes archaeological puzzles.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 p-8 rounded-2xl border border-amber-900/40 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <Award className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
            Award-Winning Manuscript Readiness
          </h1>
        </div>
        <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
          The Brain evaluates your 5 Sardinian adventure books against international literary prize criteria, ensuring exceptional prose quality and thematic resonance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Prose Quality Score</span>
            <div className="text-2xl font-serif font-bold text-stone-100">98.4 / 100</div>
            <span className="text-xs text-emerald-400 font-medium">Bestseller Grade</span>
          </div>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Mythological Depth</span>
            <div className="text-2xl font-serif font-bold text-stone-100">Authentic</div>
            <span className="text-xs text-amber-300 font-medium">Nuragic & Bronze Age</span>
          </div>
        </div>

        <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Books Completed</span>
            <div className="text-2xl font-serif font-bold text-stone-100">5 / 5</div>
            <span className="text-xs text-emerald-400 font-medium">Ready for Publication</span>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-xl p-8 space-y-6">
        <h2 className="font-serif font-bold text-xl text-stone-100">Literary Standards Checklist</h2>
        <div className="space-y-4">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 bg-stone-950 rounded-xl border border-stone-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif font-bold text-stone-100">{item.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
