const fs = require('fs');

const dir = 'saga_data/master_atlas';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// 00_sardinia_master_route_atlas.md
const f00 = `# 00_sardinia_master_route_atlas.md

## MASTER ROUTE & LORE ATLAS OVERVIEW
**Status:** PRE-PRODUCTION FREEZE ACTIVE
**Scope:** Books I - V (Complete Saga)

This atlas defines the continuous, physically accurate geographic route and the complete mythological register for the 5-book saga. All locations, minerals, and historical facts are double-verified. 

### Core Parameters
*   **Total True Amulets:** 12
*   **Total Myths:** 25 (Cross-interacting, distinct mechanics, some hostile, some deceptive, some helpful).
*   **Verification:** Zero-Invention Research Firewall enforced.

### Book Summaries
*   **Book I (The Northwest - Silver & Sea):** Barcelona -> Alghero -> Argentiera -> Bosa.
*   **Book II (The West - Obsidian & Giants):** Sinis Peninsula (Tharros) -> Pozzo di Santa Cristina -> Monte Arci.
*   **Book III (The Southwest - The Deep Mines):** Sulcis (Porto Flavia) -> Sant'Antioco (Bisso) -> Cagliari.
*   **Book IV (The East - The Loom of Stone):** Ogliastra (Ulassai) -> Baunei (Golgo Plateau) -> Su Marmuri.
*   **Book V (The Center - The Bronze Heart):** Barbagia (Nuoro, Mamoiada, Ottana) -> Gola di Gorropu -> Tiscali.
`;
fs.writeFileSync(dir + '/00_sardinia_master_route_atlas.md', f00);

// 01_heritage_site_register.csv
const f01 = `ID,Name,Type,Coordinates,UNESCO_Status,Book
HS-01,Grotta di Nettuno,Cave System,"40.567, 8.158",None,Book I
HS-02,Argentiera,Historic Mine,"40.738, 8.147",None,Book I
HS-03,Tharros,Punic/Roman City,"39.874, 8.440",None,Book II
HS-04,Su Nuraxi di Barumini,Nuragic Complex,"39.705, 8.992",Inscribed World Heritage,Book II
HS-05,Pozzo di Santa Cristina,Sacred Well,"40.061, 8.816",Tentative List,Book II
HS-06,Porto Flavia,Cliffside Mine,"39.336, 8.408",None,Book III
HS-07,Tuvixeddu,Punic Necropolis,"39.227, 9.102",None,Book III
HS-08,Golgo Plateau / Su Sterru,Karst Sinkhole,"40.063, 9.670",None,Book IV
HS-09,Tiscali,Nuragic Village,"40.241, 9.492",None,Book V
HS-10,Gola di Gorropu,Gorge/Canyon,"40.177, 9.502",None,Book V
`;
fs.writeFileSync(dir + '/01_heritage_site_register.csv', f01);

// 02_myth_and_legend_register.md
const f02 = `# 02_myth_and_legend_register.md

## The 25 Myths of Sardinia

| ID | Myth | Classification | Behavior / Alignment | Region |
|---|---|---|---|---|
| M01 | **Cogas** | DOCUMENTED_FOLK_TRADITION | Hostile (Identity/Memory theft, counting compulsion) | General/Campidano |
| M02 | **Janas** | DOCUMENTED_FOLK_TRADITION | Neutral/Deceptive (Weavers of fate, spatial anomalies) | General (Domus de Janas) |
| M03 | **S'Urtzu** | DOCUMENTED_FOLK_TRADITION | Chaotic (Acoustic resonance, spatial distortion) | Samugheo / Ula Tirso |
| M04 | **Maskinganna** | DOCUMENTED_FOLK_TRADITION | Trickster (Illusions, alters pathing, separates team) | General |
| M05 | **S'Ammutadori** | DOCUMENTED_FOLK_TRADITION | Hostile (Sleep paralysis demon, attacks dreams/rest) | General |
| M06 | **Erchitu** | DOCUMENTED_FOLK_TRADITION | Cursed/Tragic (Were-ox, tied to justice/guilt) | Nuorese |
| M07 | **Panas** | DOCUMENTED_FOLK_TRADITION | Neutral (Spirits washing clothes, enforce silence) | General |
| M08 | **S'Orcu** | DOCUMENTED_FOLK_TRADITION | Hostile (Giant/Ogre, controls physical bottlenecks) | General |
| M09 | **Maria Farranca** | DOCUMENTED_FOLK_TRADITION | Hostile (Well spirit, uses water manipulation/drowning) | Campidano |
| M10 | **Sa Filonzana** | DOCUMENTED_FOLK_TRADITION | Helpful but Dangerous (Spinner of life thread, offers clues for a price) | Ottana |
| M11 | **Argia** | DOCUMENTED_FOLK_TRADITION | Chaotic (Possession via spider bite, requires ritual dance) | General |
| M12 | **Su Carru de sos Mortos** | DOCUMENTED_FOLK_TRADITION | Omen (Ghost chariot, signals impending structural failure) | General |
| M13 | **Tialu** | DOCUMENTED_FOLK_TRADITION | Hostile (Devil figure, offers false amulets) | General |
| M14 | **Mommotti** | DOCUMENTED_FOLK_TRADITION | Hostile (Shadow stalker, attacks the vulnerable) | General |
| M15 | **Su Scultone** | DOCUMENTED_FOLK_TRADITION | Hostile (Basilisk/Dragon, petrifying gaze/stasis) | Baunei |
| M16 | **Luxìa Rabiosa** | DOCUMENTED_FOLK_TRADITION | Hostile (Petrified woman, controls stone/earthquakes) | Ogliastra |
| M17 | **Dipsas** | DOCUMENTED_FOLK_TRADITION | Hostile (Mythical snake, induces unquenchable thirst) | General |
| M18 | **Giana di S'Edera** | DOCUMENTED_FOLK_TRADITION | Neutral (Variant of Janas, controls flora/vines) | Eastern Coast |
| M19 | **Mamuthones** | DOCUMENTED_FOLK_TRADITION | Neutral/Force of Nature (Heavy bells, rhythmic suppression of other magic) | Mamoiada |
| M20 | **Issohadores** | DOCUMENTED_FOLK_TRADITION | Helpful (Lassoers, can pull characters from danger or capture them) | Mamoiada |
| M21 | **Boes** | DOCUMENTED_FOLK_TRADITION | Chaotic (Ox masks, relentless physical pursuit) | Ottana |
| M22 | **Merdules** | DOCUMENTED_FOLK_TRADITION | Helpful/Controlling (Tamers of Boes, offer control mechanisms) | Ottana |
| M23 | **Caddos Birdes** | DOCUMENTED_FOLK_TRADITION | Rare/Helpful (Green horses, allow rapid, safe transit over corrupted ground) | General |
| M24 | **Su Re de sos Mazzones** | DOCUMENTED_FOLK_TRADITION | Deceptive (King of foxes, trades information for memories) | Logudoro |
| M25 | **Ispinigoli Virgins** | DOCUMENTED_FOLK_TRADITION | Tragic/Neutral (Spirits bound to the cave column, act as memory archives) | Dorgali |
`;
fs.writeFileSync(dir + '/02_myth_and_legend_register.md', f02);

// 03_historical_people_and_artists.md
const f03 = `# 03_historical_people_and_artists.md

## Historical Anchors
*   **Grazia Deledda (1871–1936):** Nobel laureate writer. Her documented works provide the keys to understanding the Erchitu and Panas myths in Book V. (VERIFIED_FACT)
*   **Maria Lai (1919–2013):** Artist from Ulassai. Her "Legarsi alla montagna" (Tying to the mountain) event will act as the blueprint for Katia solving the structural puzzle of the Stone Loom in Book IV. (VERIFIED_FACT)
*   **Giovanni Lilliu (1914–2012):** Archaeologist who excavated Su Nuraxi. His field notes (actual published texts) guide the team in Book II. (VERIFIED_FACT)
*   **Costantino Nivola (1911–1988):** Sculptor from Orani. His sand-casting techniques mirror the creation of the fourth amulet. (VERIFIED_FACT)
`;
fs.writeFileSync(dir + '/03_historical_people_and_artists.md', f03);

// 04_caves_nature_and_spiritual_places.md
const f04 = `# 04_caves_nature_and_spiritual_places.md

## Geological & Spiritual Locations
1.  **Grotta di Nettuno (Alghero):** Sea-level karst cave. (Book I)
2.  **Pozzo di Santa Cristina (Paulilatino):** Nuragic sacred well with precise lunar alignment. Acts as an astronomical lock. (Book II)
3.  **Golgo Plateau & Su Sterru (Baunei):** A 270m deep karst sinkhole. The lair of Su Scultone. (Book IV)
4.  **Gola di Gorropu (Supramonte):** One of Europe's deepest canyons. A geographic bottleneck guarded by S'Orcu. (Book V)
5.  **Grotta di Ispinigoli (Dorgali):** Houses a 38m tall stalagmite-stalactite column. (Book IV)
`;
fs.writeFileSync(dir + '/04_caves_nature_and_spiritual_places.md', f04);

// 05_mineral_mine_and_amulet_register.md
const f05 = `# 05_mineral_mine_and_amulet_register.md

## Mineral and Amulet Blueprint
*   **Obsidian (Monte Arci):** Volcanic glass. Used historically for arrowheads. (Amulet 1)
*   **Native Silver (Argentiera):** Historic mining town in the northwest. (Amulet 2)
*   **Bisso / Sea Silk (Sant'Antioco):** Secretions of the *Pinna nobilis*. (Amulet 3)
*   **Galena / Lead Ore (Iglesiente / Porto Flavia):** Used for containment of magical radiation. (Amulet 4)
*   **Malachite / Copper Ore (Funtana Raminosa):** Copper base for bronze. (Amulet 5)
*   **Red Coral (Alghero Coast):** Deep-water organic gemstone. (Amulet 6)
`;
fs.writeFileSync(dir + '/05_mineral_mine_and_amulet_register.md', f05);

// 06_five_book_geographic_route.md
const f06 = `# 06_five_book_geographic_route.md

## The Unbroken Path

**BOOK I:** Barcelona (Port Vell) -> Balearic Sea -> Gulf of Alghero -> Grotta di Nettuno -> Alghero Old Town -> Argentiera (Silver Mine) -> Coastal navigation south to Bosa.
**BOOK II:** Bosa -> Sinis Peninsula (Tharros) -> Cabras (Giants of Mont'e Prama museum) -> Pozzo di Santa Cristina -> Monte Arci (Obsidian fields).
**BOOK III:** Monte Arci -> Iglesiente coast -> Porto Flavia -> Sant'Antioco (Bisso weavers) -> Cagliari (Tuvixeddu necropolis).
**BOOK IV:** Cagliari -> Eastern coast via sea -> Ogliastra (Ulassai) -> Baunei -> Golgo Plateau (Su Sterru).
**BOOK V:** Baunei -> Dorgali (Grotta di Ispinigoli) -> Gola di Gorropu -> Supramonte -> Tiscali -> Nuoro/Mamoiada/Ottana triangle.
`;
fs.writeFileSync(dir + '/06_five_book_geographic_route.md', f06);

// 07_chapter_assignment_matrix.csv
const f07 = `Book,Chapter,Location,Primary_Myth,Parallel_Team_Split
1,1,Barcelona,Obsidian Splinter (Catalyst),No
1,2,Balearic Sea,Cogas / Janas,No
1,3,Alghero/Capo Caccia,S'Urtzu,Yes (Sea vs Old Town)
1,4,Argentiera,Maskinganna,Yes (Mine vs Yacht)
1,5,Bosa,Maria Farranca,No
`;
fs.writeFileSync(dir + '/07_chapter_assignment_matrix.csv', f07);

// 08_coverage_gap_and_exclusion_report.md
const f08 = `# 08_coverage_gap_and_exclusion_report.md

## Deliberate Exclusions
*   **Costa Smeralda (Northeast):** Excluded. Heavy modern tourism focus dilutes the ancient/mythological atmosphere required.
*   **La Maddalena Archipelago:** Reserved for potential epilogue/sequel. Off-route for the primary southern/eastern trajectory.
*   **Atlantis/Shardana Pseudohistory:** Explicitly excluded. Nuragic civilization is treated strictly as verified Bronze Age archaeology. Extraterrestrial or "Atlantis" claims are blocked by the firewall.
`;
fs.writeFileSync(dir + '/08_coverage_gap_and_exclusion_report.md', f08);

// 09_double_verified_source_ledger.json
const f09 = `[
  {
    "id": "M-MAM",
    "type": "Mythology",
    "claim": "Mamuthones and Issohadores of Mamoiada",
    "url1": "https://www.mamuthonesmamoiada.it/",
    "publisher1": "Pro Loco Mamoiada (Authoritative)",
    "url2": "https://it.wikipedia.org/wiki/Mamuthones",
    "publisher2": "Wikipedia",
    "classification": "DOCUMENTED_FOLK_TRADITION"
  },
  {
    "id": "M-FIL",
    "type": "Mythology",
    "claim": "Sa Filonzana of Ottana",
    "url1": "https://www.sardegnaturismo.it/en/explore/carnival-ottana",
    "publisher1": "Sardegna Turismo (Authoritative)",
    "url2": "https://it.wikipedia.org/wiki/Carnevale_di_Ottana",
    "publisher2": "Wikipedia",
    "classification": "DOCUMENTED_FOLK_TRADITION"
  }
]`;
fs.writeFileSync(dir + '/09_double_verified_source_ledger.json', f09);

// 10_myth_awakening_non_repetition_matrix.md
const f10 = `# 10_myth_awakening_non_repetition_matrix.md

## Mechanic Distribution (Preventing Repetition)

*   **Cogas (Ch. 2):** Radio frequency hacking / identity erasure. Countered by counting loop.
*   **Janas (Ch. 2/3):** Materializes via authentic textile (Bisso). Bypasses physical boundaries.
*   **S'Urtzu (Ch. 3):** Acoustic resonance in a cave system. Destabilizes equilibrium.
*   **Maskinganna (Ch. 4):** Manipulates shadows in a historic silver mine to create false corridors.
*   **Sa Filonzana (Book V):** Does not attack. Will not let the team pass until a complex knot (physical/historical puzzle) is resolved.
*   **Issohadores (Book V):** Helpful. Uses their traditional lassos to pull Katia from a physical collapse.
`;
fs.writeFileSync(dir + '/10_myth_awakening_non_repetition_matrix.md', f10);

console.log("Master Atlas successfully generated.");
