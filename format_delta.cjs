const fs = require('fs');

const delta = `
# CHAPTER 1 STATE DELTA

## LOCATION / GEOGRAPHY
* **Previous State:** Barcelona (El Raval) -> Open Mediterranean -> Porto Torres (Sardinia).
* **New State:** Exclusively Barcelona (El Raval -> Gothic Quarter -> Drassanes Reials -> Port Vell terminal -> Ferry gangway). The chapter ends precisely as the vessel leaves the breakwater.

## ARTIFACT STATUS
* **Previous State:** Unclear distinction between the full amulet and the piece they possessed.
* **New State:** They strictly possess an *Obsidian Splinter* acting as a resonance key/lens. The true Eye remains firmly buried at Monte d'Accoddi.
* **Mechanic Delta:** The splinter does not just cause cold; it erases the *memory of thermodynamics* (localized thermal amnesia).

## THREAT VECTORS (COGAS)
* **Previous State:** Cogas appeared at the end of a rapid crossing as physical threats attacking the ship.
* **New State:** Cogas are already aboard at departure. They are identity thieves. The primary horror mechanic is established when a passenger's identity is entirely overwritten, deleting their self-perception in the dark glass of the deck.

## SICKLE ACQUISITION
* **Previous State:** Katia merely produced it.
* **New State:** Katia explicitly states she acquired the toothless Villacidro *faciola* from a black-market archivist in Marseille prior to arriving in Barcelona. The mechanic is explained as a base-seven cognitive paradox trap.
`;

fs.writeFileSync('saga_data/book_1_chapter_1/06_state_delta.md', delta);
console.log('Delta generated.');
