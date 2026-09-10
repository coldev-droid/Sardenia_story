import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export function ChecksumValidationLogs() {
  const [computedHashes, setComputedHashes] = useState<Record<string, string>>({});
  const [pastedHashes, setPastedHashes] = useState<Record<string, string>>({
    '01_Batch_1_Locations.json': '',
    '02_Batch_1_Myths.json': '',
    '03_Batch_1_Routes.json': '',
    '04_Batch_1_Source_Ledger.json': '',
    '05_Batch_1_Chapter_Matrix.json': ''
  });

  useEffect(() => {
    const fetchAsText = async (url: string) => {
      try {
        const res = await fetch(url);
        return await res.text();
      } catch (e) {
        return '';
      }
    };

    Promise.all([
      fetchAsText('/01_Batch_1_Locations.json'),
      fetchAsText('/02_Batch_1_Myths.json'),
      fetchAsText('/03_Batch_1_Routes.json'),
      fetchAsText('/04_Batch_1_Source_Ledger.json'),
      fetchAsText('/05_Batch_1_Chapter_Matrix.json')
    ]).then(([locsRaw, mythsRaw, routesRaw, claimsRaw, matrixRaw]) => {
      const rawMap = {
        '01_Batch_1_Locations.json': locsRaw,
        '02_Batch_1_Myths.json': mythsRaw,
        '03_Batch_1_Routes.json': routesRaw,
        '04_Batch_1_Source_Ledger.json': claimsRaw,
        '05_Batch_1_Chapter_Matrix.json': matrixRaw
      };

      const computeHashes = async () => {
        const hashes: Record<string, string> = {};
        const encoder = new TextEncoder();
        for (const [key, content] of Object.entries(rawMap)) {
          if (content) {
            const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(content));
            const hashArray = Array.from(new Uint8Array(buffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            hashes[key] = hashHex;
          }
        }
        setComputedHashes(hashes);
      };
      computeHashes();
    });
  }, []);

  return (
    <section className="bg-stone-950 p-6 rounded-xl border border-stone-800 shadow-inner">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-400" /> ChecksumValidationLogs
      </h3>
      <p className="text-stone-400 text-sm mb-4">Input SHA-256 hashes for Batch 1 files to visually compare against computed hashes for data integrity assurance.</p>
      <div className="grid grid-cols-1 gap-4">
        {Object.keys(pastedHashes).map(filename => {
          const match = pastedHashes[filename] === computedHashes[filename];
          const isFilled = pastedHashes[filename].length > 0;
          return (
            <div key={filename} className="flex flex-col gap-2 p-4 bg-stone-900 rounded-lg border border-stone-700">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-stone-300">{filename}</span>
                {isFilled && match && <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-800 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> MATCH</span>}
                {isFilled && !match && <span className="bg-rose-900/30 text-rose-400 px-2 py-1 rounded text-xs border border-rose-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> MISMATCH</span>}
              </div>
              <div className="flex gap-2 items-center">
                <input 
                  type="text" 
                  placeholder="Paste SHA-256 hash here..." 
                  value={pastedHashes[filename]}
                  onChange={(e) => setPastedHashes({...pastedHashes, [filename]: e.target.value.trim()})}
                  className="flex-1 bg-stone-950 border border-stone-700 text-stone-300 text-sm font-mono p-2 rounded focus:outline-none focus:border-amber-500 transition-colors"
                />
                <div className="text-xs text-stone-500 font-mono w-64 truncate" title={computedHashes[filename]}>
                  System: {computedHashes[filename] || 'Computing...'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
