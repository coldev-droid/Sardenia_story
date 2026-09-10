const fs = require('fs');

// 1. Create the Epilogue Markdown file
const epilogueContent = `# Epilogue: The Quiet Earth

The Mistral winds blew across the Capo Caccia cliffs, much as they had months ago, but the world beneath them was different. The global tectonic grid had been stabilized. The Obsidian Eye was buried deep beneath the Antarctic ice, sealed within the final Janas node. 

Geronimo stood at the edge of the limestone drop, staring out at the Mediterranean. His scarred hands rested in the pockets of his heavy coat. Katia stood a few paces behind him, the silence between them no longer heavy with impending danger, but with the shared weight of what they had survived.

The Sentinels were fractured, their leadership dismantled in the icy wastes. The group had disbanded to the four corners of the globe to protect the secret of the nodes.

They were ghosts now. But the Earth was quiet.

*END OF MANUSCRIPT.*
`;
fs.writeFileSync('canonical-source/manuscript/EPILOGUE.md', epilogueContent);

// 2. Update server.ts
let code = fs.readFileSync('server.ts', 'utf8');

const epilogueObj = `  {
    chapterId: "EPILOGUE",
    title: "Epilogue: The Quiet Earth",
    characterLocations: { Geronimo: "Capo Caccia (Sardinia)", Katia: "Capo Caccia (Sardinia)", Veerle: "Grid-dark", Maris: "Grid-dark", Inga: "Grid-dark", André: "Grid-dark" },
    inventoryAndCustody: { "Obsidian Eye": "Sealed in Antarctica", Custody: "None" },
    healthAndStatus: { Katia: "Healing", Geronimo: "At peace, scarred" },
    relationshipStatus: { "Group": "Disbanded for protection, bound by history" },
    amuletState: "Obsidian Eye (Dormant, Sealed)",
    hazards: []
  }`;

code = code.replace(/  \}\n\];/g, '  },\n' + epilogueObj + '\n];');

code = code.replace(/  \{ id: "G030", name: "Chapter 30 Candidate", date: "2026-09-02", status: "PENDING_HUMAN_APPROVAL", approver: "Awaiting Author", hash: manuscriptSha256 \}/, 
`  { id: "G030", name: "Chapter 30 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B03_C30_PROSE") },
  { id: "G_EPI", name: "Epilogue Final", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("EPILOGUE_PROSE") }`);

code = code.replace(/unitId: "B03_C30",\n  globalId: "G030",\n  title: "Book III Chapter 30: The Final Node",/, `unitId: "EPILOGUE",\n  globalId: "G_EPI",\n  title: "Epilogue: The Quiet Earth",`);
code = code.replace(/nextChapterEligible: "EPILOGUE",/, `nextChapterEligible: "NONE",`);
code = code.replace(/status: "LOCKED_BY_SWARM",/, `status: "MANUSCRIPT_COMPLETE",`);

code = code.replace(/canonical-source\/manuscript\/BOOK_03_C30\.md/g, 'canonical-source/manuscript/EPILOGUE.md');

fs.writeFileSync('server.ts', code);
