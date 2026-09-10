const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newChapters = `  },
  {
    chapterId: "B01_C09",
    title: "Book I Chapter 9: The Macomer Junction",
    characterLocations: { Geronimo: "Macomer rail junction", Katia: "Macomer rail junction", Veerle: "Macomer rail junction", Maris: "Macomer rail junction", Inga: "Macomer rail junction", André: "Macomer rail junction" },
    inventoryAndCustody: { "Obsidian Eye": "Waterproof case (Reacting to basalt)", Custody: "Geronimo" },
    healthAndStatus: { Katia: "Hyper-vigilant", Geronimo: "Hands recovering, alert" },
    relationshipStatus: { "Group": "Paranoid but coordinated in transit" },
    amuletState: "Obsidian Eye (Pulsing, drawn to magnetic fields)",
    hazards: ["The tactical rail retreat leads to a bottleneck. The group is forced to abandon the main train line and move entirely off-grid into the Barbagia region to evade Sentinel checkpoints."]
  },
  {
    chapterId: "B01_C10",
    title: "Book I Chapter 10: The Nuragic Interior",
    characterLocations: { Geronimo: "Barbagia wilderness", Katia: "Barbagia wilderness", Veerle: "Barbagia wilderness", Maris: "Barbagia wilderness", Inga: "Barbagia wilderness", André: "Barbagia wilderness" },
    inventoryAndCustody: { "Obsidian Eye": "Uncased (Mapping constellations)", Custody: "Geronimo" },
    healthAndStatus: { Katia: "Fatigued by driving", Geronimo: "Focused on the relic" },
    relationshipStatus: { "Inga & Geronimo": "Forming a scientific/mythic thesis" },
    amuletState: "Obsidian Eye (Projecting star maps)",
    hazards: ["Harsh terrain and isolation in the true Sardinian interior. The group realizes the ancient nuraghi are electromagnetic nodes, turning the landscape itself into a massive puzzle."]
  },
  {
    chapterId: "B01_C11",
    title: "Book I Chapter 11: The Giants of Mont'e Prama",
    characterLocations: { Geronimo: "Sinis dry riverbed", Katia: "Sinis slot canyon", Veerle: "Sinis slot canyon", Maris: "Sinis dry riverbed", Inga: "Sinis slot canyon", André: "Sinis slot canyon" },
    inventoryAndCustody: { "Obsidian Eye": "Used as physical wedge", Custody: "Geronimo" },
    healthAndStatus: { Katia: "Adrenaline spiked", André: "Physical exertion maxed" },
    relationshipStatus: { "Group": "Operating as a seamless combat unit" },
    amuletState: "Obsidian Eye (Physically marred, structurally sound)",
    hazards: ["A Sentinel drone and strike team ambush. The group uses the physical density of the Obsidian Eye to trigger a canyon collapse, burying the pursuit in a brutal display of environmental tactics."]
  },
  {
    chapterId: "B01_C12",
    title: "Book I Chapter 12: The Threshold of Book II",
    characterLocations: { Geronimo: "Southern Ridge", Katia: "Southern Ridge", Veerle: "Southern Ridge", Maris: "Southern Ridge", Inga: "Southern Ridge", André: "Southern Ridge" },
    inventoryAndCustody: { "Obsidian Eye": "Waterproof case (Projecting south)", Custody: "Geronimo" },
    healthAndStatus: { Katia: "Exhausted but determined", Geronimo: "Scarred, resolute" },
    relationshipStatus: { "Group": "Fully committed to the path, point of no return" },
    amuletState: "Obsidian Eye (Projecting beam toward Africa)",
    hazards: ["A massive regional lockdown is initiated by the Sentinels. The group must find illegal passage across the Mediterranean to Africa, marking the definitive end of their old lives."]
  }
];`;

code = code.replace(/  \}\n\];/g, newChapters);

code = code.replace(
  /\{ id: "G008", name: "Book I Chapter 8 Candidate", date: "2026-09-02", status: "PENDING_HUMAN_APPROVAL", approver: "Awaiting Author", hash: manuscriptSha256 \}/,
  `{ id: "G008", name: "Book I Chapter 8 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B01_C08_PROSE") },
  { id: "G009", name: "Book I Chapter 9 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B01_C09_PROSE") },
  { id: "G010", name: "Book I Chapter 10 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B01_C10_PROSE") },
  { id: "G011", name: "Book I Chapter 11 Lock", date: "2026-09-02", status: "LOCKED", approver: "Swarm Engine", hash: sha256("B01_C11_PROSE") },
  { id: "G012", name: "Book I Chapter 12 Candidate", date: "2026-09-02", status: "PENDING_HUMAN_APPROVAL", approver: "Awaiting Author", hash: manuscriptSha256 }`
);

code = code.replace(/unitId: "B01_C08",\n  globalId: "G008",\n  title: "Book I Chapter 8: The Photograph at the Harbour Wall",/, `unitId: "B01_C12",\n  globalId: "G012",\n  title: "Book I Chapter 12: The Threshold of Book II",`);
code = code.replace(/nextChapterEligible: "B01_C09",/, `nextChapterEligible: "B02_C01",`);

code = code.replace(/const candidateProseSample = _fs.readFileSync\('canonical-source\/manuscript\/BOOK_01_C08.md', 'utf8'\);/, `const candidateProseSample = _fs.readFileSync('canonical-source/manuscript/BOOK_01_C12.md', 'utf8');`);

fs.writeFileSync('server.ts', code);
