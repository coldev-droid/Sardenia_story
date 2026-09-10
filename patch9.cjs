const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importsToAdd = `
import { MasterRouteAtlas } from './components/MasterRouteAtlas';
import { CharacterRelationshipMonitor } from './components/CharacterRelationshipMonitor';
import { DecoyMineralValidator } from './components/DecoyMineralValidator';
import { ParallelTimelineTracker } from './components/ParallelTimelineTracker';
import { HeritageLifecycleBoard } from './components/HeritageLifecycleBoard';
import { SwarmOrchestrator } from './components/SwarmOrchestrator';
import { ContinuityGateways } from './components/ContinuityGateways';
`;

code = code.replace(
  "import { StatusLegend } from './components/StatusLegend';",
  "import { StatusLegend } from './components/StatusLegend';\n" + importsToAdd
);

// Update activeTab types to include the new tabs
code = code.replace(
  "useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths'>('factory')",
  "useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths' | 'orchestrator' | 'atlas' | 'relationships' | 'minerals' | 'timelines' | 'heritage' | 'gateways'>('factory')"
);

// We need to add the buttons in a clean way so it doesn't clutter the header.
// I'll group the new "High-End System Extensions" into a scrollable nav below the main header, or replace the main nav with a better flex wrap.
code = code.replace(
  'className="flex items-center space-x-2 bg-stone-900 p-1.5 rounded-xl border border-stone-800 shadow-inner"',
  'className="flex flex-wrap gap-2 items-center bg-stone-900 p-1.5 rounded-xl border border-stone-800 shadow-inner"'
);

const newButtons = `
            <button onClick={() => setActiveTab('orchestrator')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'orchestrator' ? 'bg-emerald-600 text-stone-100' : 'text-emerald-500/70 hover:text-emerald-400'}\`}>Swarm Orchestrator</button>
            <button onClick={() => setActiveTab('heritage')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'heritage' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Heritage Board</button>
            <button onClick={() => setActiveTab('timelines')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'timelines' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Split Timelines</button>
            <button onClick={() => setActiveTab('minerals')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'minerals' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Decoy Minerals</button>
            <button onClick={() => setActiveTab('gateways')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'gateways' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Continuity Gates</button>
            <button onClick={() => setActiveTab('atlas')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'atlas' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Route Atlas</button>
            <button onClick={() => setActiveTab('relationships')} className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'relationships' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}>Relationships</button>
`;

code = code.replace(
  "            <button\n              onClick={() => setActiveTab('myths')}",
  newButtons + "\n            <button\n              onClick={() => setActiveTab('myths')}"
);

const newViews = `
      {activeTab === 'orchestrator' && (<div className="px-6 pb-8"><SwarmOrchestrator /></div>)}
      {activeTab === 'heritage' && (<div className="px-6 pb-8"><HeritageLifecycleBoard /></div>)}
      {activeTab === 'timelines' && (<div className="px-6 pb-8"><ParallelTimelineTracker /></div>)}
      {activeTab === 'minerals' && (<div className="px-6 pb-8"><DecoyMineralValidator /></div>)}
      {activeTab === 'gateways' && (<div className="px-6 pb-8"><ContinuityGateways /></div>)}
      {activeTab === 'atlas' && (<div className="px-6 pb-8"><MasterRouteAtlas /></div>)}
      {activeTab === 'relationships' && (<div className="px-6 pb-8"><CharacterRelationshipMonitor /></div>)}
`;

code = code.replace(
  "      {activeTab === 'myths' && (",
  newViews + "\n      {activeTab === 'myths' && ("
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched with all new tools successfully');
