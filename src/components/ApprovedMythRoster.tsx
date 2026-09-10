import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, X } from 'lucide-react';

export const ApprovedMythRoster: React.FC = () => {
  const [myths, setMyths] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [selectedMyth, setSelectedMyth] = useState<any | null>(null);

  useEffect(() => {
    fetch('/02_Batch_1_Myths.json')
      .then(res => res.json())
      .then(data => setMyths(data))
      .catch(() => {});
    
    fetch('/04_Batch_1_Source_Ledger.json')
      .then(res => res.json())
      .then(data => setClaims(data))
      .catch(() => {});
  }, []);

  const getMythStatusColor = (myth: any) => {
    // Determine overall status based on ledger if needed, or default
    return "bg-emerald-950/40 border-emerald-900/50 text-emerald-300"; // Default Approved for this roster
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl">
        <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Approved Myth Roster
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myths.map(myth => (
            <div 
              key={myth.id} 
              className="bg-stone-950 p-5 rounded-xl border border-stone-800 hover:border-amber-500/50 cursor-pointer transition shadow"
              onClick={() => setSelectedMyth(myth)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase font-mono text-stone-500">{myth.id}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">Approved</span>
              </div>
              <h3 className="text-lg font-bold text-stone-100 font-serif mb-1">{myth.name}</h3>
              <p className="text-xs text-stone-400 line-clamp-2">{myth.traditionalBehavior}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedMyth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-stone-800 flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-amber-500 mb-1 block">{selectedMyth.id}</span>
                <h2 className="text-2xl font-serif font-bold text-stone-100">{selectedMyth.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedMyth(null)}
                className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500 mb-1">Traditional Behavior</h4>
                  <p className="text-sm text-stone-300 leading-relaxed">{selectedMyth.traditionalBehavior}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500 mb-1">Fictional Transformation</h4>
                  <p className="text-sm text-stone-300 leading-relaxed italic border-l-2 border-amber-900 pl-3">{selectedMyth.fictionalTransformation}</p>
                </div>
              </div>

              {/* DEDICATED EVIDENCE SECTION */}
              <div className="pt-6 border-t border-stone-800">
                <h3 className="text-lg font-bold font-serif text-stone-200 flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-indigo-400" /> Linked Evidence Records
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {claims.filter(c => c.entityId === selectedMyth.id).length > 0 ? (
                    claims.filter(c => c.entityId === selectedMyth.id).map(claim => {
                      let bgClass = "bg-stone-950 border-stone-800";
                      let textClass = "text-stone-400";
                      let statusLabel = claim.status;
                      
                      if (claim.auditorVerdict === 'PASS_INDEPENDENTLY_VERIFIED') {
                        bgClass = "bg-emerald-950/20 border-emerald-900/50";
                        textClass = "text-emerald-400";
                        statusLabel = "Approved";
                      } else if (claim.auditorVerdict === 'FAIL' || claim.auditorVerdict === 'REJECTED') {
                        bgClass = "bg-rose-950/20 border-rose-900/50";
                        textClass = "text-rose-400";
                        statusLabel = "Rejected";
                      } else if (claim.auditorVerdict === 'DISPUTED' || claim.status === 'DISPUTED') {
                        bgClass = "bg-amber-950/20 border-amber-900/50";
                        textClass = "text-amber-400";
                        statusLabel = "Disputed";
                      }

                      return (
                        <div key={claim.id} className={`p-4 rounded-xl border ${bgClass} space-y-2`}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-stone-500">{claim.id}</span>
                            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${textClass} border-current`}>
                              {statusLabel}
                            </span>
                          </div>
                          <p className="text-sm text-stone-200">{claim.claim}</p>
                          <div className="flex items-center gap-4 text-xs font-mono text-stone-500 pt-2 border-t border-stone-800/50">
                            <span>Sources: {claim.sources?.length || 0}</span>
                            <span>Auditor: {claim.auditorVerdict}</span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm text-stone-500 italic">No heritage claims linked to this myth entity.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
