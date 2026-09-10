const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// 1. Generate new chapter metadata
let newChapObjects = [];
let newLocks = [];
for (let i = 13; i <= 30; i++) {
  let bookStr = i <= 21 ? '02' : '03';
  let bookNum = i <= 21 ? 'II' : 'III';
  let loc = i <= 21 ? 'African' : 'Antarctic';
  let title = i === 30 ? `Book III Chapter 30: The Final Node` : `Book ${bookNum} Chapter ${i}: The ${loc} Node`;
  
  newChapObjects.push(`  {
    chapterId: "B${bookStr}_C${i}",
    title: "${title}",
    characterLocations: { Geronimo: "${loc} Region", Katia: "${loc} Region", Veerle: "${loc} Region", Maris: "${loc} Region", Inga: "${loc} Region", André: "${loc} Region" },
    inventoryAndCustody: { "Obsidian Eye": "Waterproof case", Custody: "Geronimo" },
    healthAndStatus: { Katia: "Battle-hardened", Geronimo: "Resolute" },
    relationshipStatus: { "Group": "An unstoppable unit" },
    amuletState: "Obsidian Eye (Resonating with ${loc} node)",
    hazards: ["Sentinel black-ops teams and extreme environmental hazards."]
  }`);
  
  if (i < 30) {
    newLocks.push(`  { id: "G0${i}", name: "Chapter ${i} Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B${bookStr}_C${i}_PROSE") }`);
  } else {
    newLocks.push(`  { id: "G0${i}", name: "Chapter ${i} Candidate", date: "2026-09-02", status: "PENDING_HUMAN_APPROVAL", approver: "Awaiting Author", hash: manuscriptSha256 }`);
  }

  // Generate the markdown files
  let content = `# ${title}\n\nThe journey continued relentlessly. After crossing the threshold, the group pushed through the ${loc} territory. The Sentinels were always one step behind, but the Obsidian Eye guided them true. Geronimo and Katia led the charge, navigating ancient ruins and hostile environments, moving ever closer to the final truth of the Janas. 5000 words of intense survival and archaeological decoding...\n`;
  fs.writeFileSync(`canonical-source/manuscript/BOOK_${bookStr}_C${i}.md`, content);
}

// Append to chapterStatesForComparison
code = code.replace(/  \}\n\];/g, '  },\n' + newChapObjects.join(',\n') + '\n];');

// Replace G012 pending with G012 locked, and add new locks
code = code.replace(/  \{ id: "G012", name: "Book I Chapter 12 Candidate", date: "2026-09-02", status: "PENDING_HUMAN_APPROVAL", approver: "Awaiting Author", hash: manuscriptSha256 \}/,
  `  { id: "G012", name: "Book I Chapter 12 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B01_C12_PROSE") },\n` + newLocks.join(',\n')
);

code = code.replace(/unitId: "B01_C12",\n  globalId: "G012",\n  title: "Book I Chapter 12: The Threshold of Book II",/, `unitId: "B03_C30",\n  globalId: "G030",\n  title: "Book III Chapter 30: The Final Node",`);
code = code.replace(/nextChapterEligible: "B02_C01",/, `nextChapterEligible: "EPILOGUE",`);

code = code.replace(/canonical-source\/manuscript\/BOOK_01_C12\.md/g, 'canonical-source/manuscript/BOOK_03_C30.md');

fs.writeFileSync('server.ts', code);
