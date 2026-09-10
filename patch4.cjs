const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert imports
if (!code.includes('import { SourceDomainDistribution }')) {
  code = code.replace(
    "import { EvidenceCompletenessGate } from './components/EvidenceCompletenessGate';",
    "import { EvidenceCompletenessGate } from './components/EvidenceCompletenessGate';\nimport { SourceDomainDistribution } from './components/SourceDomainDistribution';"
  );
}

// Replace evidence tab
code = code.replace(
  "{activeTab === 'evidence' && (<EvidenceCompletenessGate />)}",
  "{activeTab === 'evidence' && (<div className=\"flex flex-col gap-0 pb-8\"><EvidenceCompletenessGate /><div className=\"px-6\"><SourceDomainDistribution /></div></div>)}"
);

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx patched for SourceDomainDistribution successfully');
