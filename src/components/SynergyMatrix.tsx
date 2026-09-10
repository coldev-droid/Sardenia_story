import React from 'react';
import { GitMerge } from 'lucide-react';

const myths = ['Janas', 'Surbile', 'Mamuthone', 'Scultone', 'Cogas', 'Mommotti'];

// Resonance based on current chapter events (The Book That Forgot Fire & Ferry transit)
const synergyData = {
  'Janas': { 'Surbile': 0, 'Mamuthone': 0, 'Scultone': -2, 'Cogas': -1, 'Mommotti': 0 },
  'Surbile': { 'Janas': 0, 'Mamuthone': 0, 'Scultone': 0, 'Cogas': 0, 'Mommotti': 0 }, // UNTESTED
  'Mamuthone': { 'Janas': 0, 'Surbile': 0, 'Scultone': -1, 'Cogas': -2, 'Mommotti': -1 },
  'Scultone': { 'Janas': -2, 'Surbile': 0, 'Mamuthone': -1, 'Cogas': 0, 'Mommotti': 2 },
  'Cogas': { 'Janas': -1, 'Surbile': 0, 'Mamuthone': -2, 'Scultone': 0, 'Mommotti': 1 }, 
  'Mommotti': { 'Janas': 0, 'Surbile': 0, 'Mamuthone': -1, 'Scultone': 2, 'Cogas': 1 },
};

const getCellColor = (val: number) => {
  if (val === 2) return 'bg-teal-500/20 text-teal-400 border-teal-900/50';
  if (val === 1) return 'bg-teal-950/20 text-teal-500 border-stone-800';
  if (val === -1) return 'bg-orange-950/20 text-orange-500 border-stone-800';
  if (val === -2) return 'bg-red-500/20 text-red-400 border-red-900/50';
  return 'bg-stone-900 text-stone-600 border-stone-800';
};

const getCellLabel = (val: number) => {
  if (val === 2) return '++';
  if (val === 1) return '+';
  if (val === -1) return '-';
  if (val === -2) return '--';
  return '0';
};

export const SynergyMatrix: React.FC = () => {
  return (
    <div className="bg-stone-900 rounded-2xl border border-teal-900/50 p-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <GitMerge className="w-5 h-5 text-teal-400" />
        <h3 className="font-serif font-bold text-lg text-teal-300">Mythic Synergy Matrix (Active Event: CH1)</h3>
      </div>
      <p className="text-xs text-stone-400">Maps positive/negative resonance between mythic pairs based on current chapter events (e.g. Cogas and Surbile align due to identity/blood-theft mechanics). (Row = Actor, Column = Target)</p>
      
      <div className="overflow-x-auto pt-2">
        <table className="w-full text-center border-collapse text-xs font-mono">
          <thead>
            <tr>
              <th className="p-2 border border-stone-800 bg-stone-950 text-stone-500"></th>
              {myths.map(m => (
                <th key={m} className="p-2 border border-stone-800 bg-stone-950 text-stone-300">{m.substring(0,3)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myths.map(row => (
              <tr key={row}>
                <th className="p-2 border border-stone-800 bg-stone-950 text-stone-300 text-left">{row}</th>
                {myths.map(col => {
                  if (row === col) return <td key={col} className="p-2 border border-stone-800 bg-stone-950/50 text-stone-700">-</td>;
                  const val = (synergyData as any)[row][col];
                  return (
                    <td key={col} className={`p-2 border font-bold ${getCellColor(val)}`}>
                      {getCellLabel(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-2 px-2">
        <span className="text-teal-400">++ Strong Synergy</span>
        <span className="text-red-400">-- Direct Opposition</span>
      </div>
    </div>
  );
};
