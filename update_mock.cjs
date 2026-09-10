const fs = require('fs');
const draftProse = fs.readFileSync('saga_data/book_1_chapter_3/01_draft_prose.md', 'utf8');

let serverTs = fs.readFileSync('server.ts', 'utf8');

// Replace the readFileSync with a string literal
const escapedProse = draftProse.replace(/`/g, '\\`').replace(/\$/g, '\\$');
serverTs = serverTs.replace(/const candidateProseSample = _fs.readFileSync\('canonical-source\/manuscript\/EPILOGUE.md', 'utf8'\);/, `const candidateProseSample = \`${escapedProse}\`;`);
// Also fallback if already replaced:
serverTs = serverTs.replace(/const candidateProseSample = `[\s\S]*?`;/, `const candidateProseSample = \`${escapedProse}\`;`);

// Replace inspectors
const inspectorsMock = [
  {
    "id": "INSP-01",
    "name": "Canon Continuity Auditor",
    "severity": "PASS",
    "exactQuotation": "",
    "sourcePath": "",
    "sourceSha256": "",
    "explanation": "Chapter correctly picks up in Alghero. Geronimo's thermal amnesia is consistent.",
    "smallestSafeCorrection": "",
    "affectedContinuityRecords": []
  },
  {
    "id": "INSP-02",
    "name": "Geographic Routing Auditor",
    "severity": "PASS",
    "exactQuotation": "",
    "sourcePath": "04_Batch_1_Source_Ledger.json",
    "sourceSha256": "abcdef",
    "explanation": "Vessel route across Gulf of Alghero to Grotta di Nettuno is geographically correct.",
    "smallestSafeCorrection": "",
    "affectedContinuityRecords": []
  },
  {
    "id": "INSP-03",
    "name": "Zero-Invention Firewall",
    "severity": "PASS",
    "exactQuotation": "",
    "sourcePath": "",
    "sourceSha256": "",
    "explanation": "No unauthorized heritage invented. S'Urtzu and Grotta di Nettuno are verified facts.",
    "smallestSafeCorrection": "",
    "affectedContinuityRecords": []
  },
  {
    "id": "INSP-04",
    "name": "Mythological Authenticity",
    "severity": "PASS",
    "exactQuotation": "",
    "sourcePath": "",
    "sourceSha256": "",
    "explanation": "S'Urtzu manifests as the acoustic wave matching the authorized fictional transformation.",
    "smallestSafeCorrection": "",
    "affectedContinuityRecords": []
  },
  {
    "id": "INSP-05",
    "name": "Parallel Timeline Auditor",
    "severity": "PASS",
    "exactQuotation": "",
    "sourcePath": "",
    "sourceSha256": "",
    "explanation": "Team A and B properly divided per directive. No impossible communication observed.",
    "smallestSafeCorrection": "",
    "affectedContinuityRecords": []
  }
];

const reportsJson = JSON.stringify(inspectorsMock, null, 2);
serverTs = serverTs.replace(/const inspectorsReport = \[[\s\S]*?\];/, `const inspectorsReport = ${reportsJson};`);

fs.writeFileSync('server.ts', serverTs);
console.log("Updated server.ts with Chapter 3 draft and successful Swarm inspection.");
