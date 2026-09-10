const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('ApprovedMythRoster')) {
  code = code.replace(
    "import { SourceDomainDistribution } from './components/SourceDomainDistribution';",
    "import { SourceDomainDistribution } from './components/SourceDomainDistribution';\nimport { ApprovedMythRoster } from './components/ApprovedMythRoster';\nimport { StatusLegend } from './components/StatusLegend';"
  );
}

// Add the 'myths' to the activeTab state
code = code.replace(
  "useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence'>('factory')",
  "useState<'factory' | 'delta' | 'sentinel' | 'inspectors' | 'prose' | 'audit' | 'evidence' | 'myths'>('factory')"
);

// Add the button to the header
const mythButton = `
            <button
              onClick={() => setActiveTab('myths')}
              className={\`px-3 py-1.5 rounded-lg text-xs font-semibold transition \${activeTab === 'myths' ? 'bg-amber-600 text-stone-100' : 'text-stone-400 hover:text-stone-200'}\`}
            >
              Myth Roster
            </button>
          </div>
`;
code = code.replace("          </div>\n          <button\n            onClick={fetchStatus}", mythButton + "          <button\n            onClick={fetchStatus}");

// Render the myths tab
const mythsContent = `
      {activeTab === 'myths' && (
        <div className="flex flex-col gap-0 pb-8 px-6 pt-6">
          <ApprovedMythRoster />
          <StatusLegend />
        </div>
      )}
`;
code = code.replace("      {activeTab === 'evidence' && (<div className=\"flex flex-col gap-0 pb-8\"><EvidenceCompletenessGate /><div className=\"px-6\"><SourceDomainDistribution /></div></div>)}", "      {activeTab === 'evidence' && (<div className=\"flex flex-col gap-0 pb-8\"><EvidenceCompletenessGate /><div className=\"px-6\"><SourceDomainDistribution /></div></div>)}\n" + mythsContent);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for Myths tab successfully');
