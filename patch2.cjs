const fs = require('fs');
let code = fs.readFileSync('src/components/EvidenceCompletenessGate.tsx', 'utf8');

// Insert imports for recharts if not present
if (!code.includes('BarChart')) {
  code = code.replace(
    "import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';",
    "import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ShieldAlert, BarChart2 } from 'lucide-react';\nimport { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ReferenceLine } from 'recharts';"
  );
}

// Add state for regions
code = code.replace(
  "const stats = useMemo(() => {",
  "const [regions, setRegions] = React.useState<any[]>([]);\n  React.useEffect(() => {\n    fetch('/15_regional_coverage.json').then(res => res.json()).then(data => setRegions(data)).catch(() => {});\n  }, []);\n\n  const stats = useMemo(() => {"
);

// Add the chart
const chartCode = `
        {/* Heritage Site Regional Registration Chart */}
        <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 shadow-inner mt-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-orange-400" /> Heritage Site Regional Registration
          </h3>
          <p className="text-stone-400 text-sm mb-6">Visualizing regional distribution to ensure all areas meet the mandatory research baseline.</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regions} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#44403c" vertical={false} />
                <XAxis dataKey="name" stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 12}} angle={-45} textAnchor="end" />
                <YAxis stroke="#a8a29e" tick={{fill: '#a8a29e', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#292524'}}
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#f5f5f4' }}
                />
                <ReferenceLine y={10} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Mandatory Research Baseline (10)', fill: '#ef4444', fontSize: 12 }} />
                <Bar dataKey="sites" radius={[4, 4, 0, 0]}>
                  {regions.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.sites >= 10 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
`;

code = code.replace(
  '<div className="space-y-4 pt-4">',
  chartCode + '\n        <div className="space-y-4 pt-4">'
);

fs.writeFileSync('src/components/EvidenceCompletenessGate.tsx', code);
console.log('EvidenceCompletenessGate.tsx patched successfully');
