const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

if (!appTsx.includes('RagMemoryEngine')) {
    appTsx = appTsx.replace(
        `import { DataIntegrityGauge } from './components/DataIntegrityGauge';`,
        `import { DataIntegrityGauge } from './components/DataIntegrityGauge';\nimport { RagMemoryEngine } from './components/RagMemoryEngine';`
    );

    appTsx = appTsx.replace(
        `setActiveTab] = useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths' | 'orchestrator' | 'atlas' | 'relationships' | 'minerals' | 'timelines' | 'heritage' | 'gateways'>('factory');`,
        `setActiveTab] = useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths' | 'orchestrator' | 'atlas' | 'relationships' | 'minerals' | 'timelines' | 'heritage' | 'gateways' | 'rag'>('factory');`
    );

    appTsx = appTsx.replace(
        `<button onClick={() => setActiveTab('orchestrator')} className={\`px-4 py-3 flex items-center gap-2 border-b-2 font-medium transition-colors \${activeTab === 'orchestrator' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800'}\`}><Zap className="w-4 h-4" /> Swarm Engine</button>`,
        `<button onClick={() => setActiveTab('orchestrator')} className={\`px-4 py-3 flex items-center gap-2 border-b-2 font-medium transition-colors \${activeTab === 'orchestrator' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800'}\`}><Zap className="w-4 h-4" /> Swarm Engine</button>\n          <button onClick={() => setActiveTab('rag')} className={\`px-4 py-3 flex items-center gap-2 border-b-2 font-medium transition-colors \${activeTab === 'rag' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800'}\`}><BrainCircuit className="w-4 h-4" /> Vector RAG</button>`
    );
    
    appTsx = appTsx.replace(
        `import { Shield, FileText, Code2, AlertTriangle, Play, BookOpen, Activity, GitCommit, GitBranch, ArrowRight, ShieldCheck, Database, FileCheck, Compass, Users, Map, Clock, Building, Key, MapPin, Search, Zap, X } from 'lucide-react';`,
        `import { Shield, FileText, Code2, AlertTriangle, Play, BookOpen, Activity, GitCommit, GitBranch, ArrowRight, ShieldCheck, Database, FileCheck, Compass, Users, Map, Clock, Building, Key, MapPin, Search, Zap, X, BrainCircuit } from 'lucide-react';`
    );

    appTsx = appTsx.replace(
        `{activeTab === 'orchestrator' && (<div className="px-6 pb-8"><SwarmOrchestrator /></div>)}`,
        `{activeTab === 'orchestrator' && (<div className="px-6 pb-8"><SwarmOrchestrator /></div>)}\n      {activeTab === 'rag' && (<div className="px-6 pt-6 pb-8"><RagMemoryEngine /></div>)}`
    );

    fs.writeFileSync('src/App.tsx', appTsx);
}
