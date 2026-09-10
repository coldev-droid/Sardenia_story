const fs = require('fs');

const dir = 'saga_data/book_1_chapter_3';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const f00 = `# 00_chapter_direction_guide.md

## 1. Previous-chapter continuity
- **Location:** Offshore approach to the Gulf of Alghero.
- **Characters:** Geronimo, Maris, Katia, Veerle, Inga, André, Mia, Tina.
- **Item custody:** Obsidian Splinter (lead box), Bisso/Sea Silk fabric piece.
- **Vehicle condition:** Sentina sustained minor electrical damage and requires sensor recalibration.
- **Memory:** Geronimo suffers thermal amnesia.
- **Immediate next action:** Make port in Alghero and investigate the Bisso conduit.

## 2. Myth Continuity Note
- **Obsidian Splinter:** Active, causing thermal amnesia.
- **Cogas:** Repelled in Chapter 2, but aware of the team.
- **Janas:** Dormant within the Bisso fabric.

## 3. New myth direction
- **Myth to introduce/awaken:** S'Urtzu (or a similar Sardinian masked figure/carnival myth, often associated with chaos, nature, and sacrifice). 
- **Original Fictional Transformation:** S'Urtzu manifests not as a physical man in skins, but as an uncontrollable acoustic resonance within the limestone caves of Capo Caccia, causing sudden, violent spatial disorientation and equipment failure. It is awakened when the Bisso is brought near the caves.

## 4. Location intelligence dossier
- **Gulf of Alghero:** The entry point.
- **Porto di Alghero:** The physical marina where the Sentina must dock.
- **Capo Caccia / Grotta di Nettuno:** Massive limestone promontory protecting the gulf. We will approach by sea, respecting real geography (the cave entrance is at sea level).
- **Alghero Old Town (L'Alguer):** Known for its Catalan heritage, cobblestone streets, and defensive walls.

## 5. Local human integration
- The harbormaster at Porto di Alghero (ordinary, non-magical).
- Local fishermen who report strange behavior in the tides or currents (attributable to the myths).

---
## STRATEGIC SUBGROUP DIVISION (Enforcing Parallel Team Rule)
The Vanguard must split for the first time.

**Team A (The Artifact / Myth Confrontation):** Geronimo, Katia, Veerle.
- **Objective:** Take the Bisso to Capo Caccia / Grotta di Nettuno by small tender to investigate the Janna conduit and the source of the resonance.
- **Risk:** Confronting the S'Urtzu acoustic resonance.

**Team B (The Mineral / Operational Repair):** Maris, Inga, André.
- **Objective:** Secure the Sentina in Porto di Alghero, repair the electrical systems, and locate a specific verified mineral or metallurgical component in the old town needed to reinforce the containment of the Obsidian Splinter.
- **Risk:** The Cogas attempting to compromise the yacht while it is stationary.
`;

fs.writeFileSync(dir + '/00_chapter_direction_guide.md', f00);
console.log("Chapter 3 Direction Guide created.");
