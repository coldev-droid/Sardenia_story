import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const PacingController: React.FC = () => {
  const [intensity, setIntensity] = useState(50);
  
  const generateData = (weight: number) => {
    const baseData = [10, 15, 8, 25, 12, 40, 20, 60, 30, 80];
    return baseData.map((val, i) => ({
      segment: `Seg ${i + 1}`,
      conflict: Math.min(100, Math.max(5, val + (weight - 50) * (i * 0.15)))
    }));
  };

  const data = generateData(intensity);

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-xl space-y-6">
      <div className="flex justify-between items-center border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-serif font-bold text-lg text-stone-200">Pacing Influence & Conflict Density</h3>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-indigo-950/50 text-indigo-300 rounded-full border border-indigo-900">
          Weight: {intensity}%
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-stone-500 font-mono">
          <span>Atmospheric Build</span>
          <span>Maximum Carnage</span>
        </div>
        <input 
          type="range" 
          min="0" max="100" 
          value={intensity} 
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <p className="text-xs text-stone-400 text-center pt-2">
          Drag to dynamically adjust the conflict density weighting for the next chapter generation.
        </p>
      </div>

      <div className="h-48 w-full bg-stone-950 rounded-xl border border-stone-800 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConflict" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis dataKey="segment" stroke="#57534e" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#57534e" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#e7e5e4', borderRadius: '8px' }}
              itemStyle={{ color: '#818cf8', fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ color: '#a8a29e', fontSize: '10px', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="conflict" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorConflict)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
