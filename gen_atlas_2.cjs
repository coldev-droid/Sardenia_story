const fs = require('fs');
const dir = 'saga_data/master_atlas';

const f03 = `# 03_historical_people_and_artists.md
## Historical Anchors
*   **Grazia Deledda (1871–1936):** Nobel laureate writer. Documented works provide keys to the Erchitu and Panas myths in Book V.
*   **Maria Lai (1919–2013):** Artist from Ulassai. "Legarsi alla montagna" event used as a blueprint for Katia solving the Stone Loom.
*   **Giovanni Lilliu (1914–2012):** Archaeologist who excavated Su Nuraxi. Field notes guide the team.
*   **Costantino Nivola (1911–1988):** Sculptor from Orani. Sand-casting techniques mirror amulet creation.
*   **Eleonora d'Arborea (1340-1404):** Judike of Arborea. Her *Carta de Logu* (legal code) provides a historical cipher in Book II.
`;
fs.writeFileSync(dir + '/03_historical_people_and_artists.md', f03);

const f04 = `# 04_caves_nature_and_spiritual_places.md
## Geological & Spiritual Locations
1.  **Grotta di Nettuno (Alghero):** Sea-level karst cave.
2.  **Pozzo di Santa Cristina (Paulilatino):** Nuragic sacred well with precise lunar alignment. 
3.  **Golgo Plateau & Su Sterru (Baunei):** A 270m deep karst sinkhole.
4.  **Gola di Gorropu (Supramonte):** One of Europe's deepest canyons.
5.  **Domus de Janas (Various):** Rock-cut pre-Nuragic tombs used as spatial conduits.
`;
fs.writeFileSync(dir + '/04_caves_nature_and_spiritual_places.md', f04);

const f05 = `# 05_mineral_mine_and_amulet_register.md
## 12 True Amulets & Verified Minerals
1.  **Amulet 1:** Obsidian (Monte Arci)
2.  **Amulet 2:** Native Silver (Argentiera)
3.  **Amulet 3:** Bisso / Sea Silk (Sant'Antioco)
4.  **Amulet 4:** Galena / Lead (Porto Flavia / Carbonia)
5.  **Amulet 5:** Malachite / Copper (Funtana Raminosa)
6.  **Amulet 6:** Red Coral (Alghero)
7.  **Amulet 7:** Trachyte (Fordongianus)
8.  **Amulet 8:** Basalt (Giara di Gesturi)
9.  **Amulet 9:** Granite (Gallura - retrieved via proxy/trade)
10. **Amulet 10:** Fluorite (Silius)
11. **Amulet 11:** Limestone Breccia (Capo Caccia)
12. **Amulet 12:** Bronze Alloy (Santu Antine metallurgy)
`;
fs.writeFileSync(dir + '/05_mineral_mine_and_amulet_register.md', f05);

const f06 = `# 06_five_book_geographic_route.md
## The Complete Island-Wide Path

**BOOK I (Northwest):** Barcelona -> Balearic Sea -> Gulf of Alghero (Grotta di Nettuno) -> Argentiera -> Porto Torres (Turris Libisonis) -> Sassari (Monte d'Accoddi) -> Castelsardo -> Bosa.
**BOOK II (West & Center):** Bosa -> Sinis Peninsula (Tharros) -> Cabras (Mont'e Prama) -> Losa -> Santu Antine -> Pozzo di Santa Cristina -> Monte Arci.
**BOOK III (Southwest):** Monte Arci -> Carbonia (Serbariu mines) -> Porto Flavia -> Sant'Antioco -> Pula (Nora) -> Cagliari (Tuvixeddu).
**BOOK IV (South Central & East):** Cagliari -> Barumini (Su Nuraxi) -> Marmilla -> Ogliastra (Ulassai) -> Baunei -> Golgo Plateau (Su Sterru).
**BOOK V (Center & Northeast):** Baunei -> Orgosolo -> Nuoro -> Mamoiada/Ottana -> Supramonte (Gorropu, Tiscali) -> Bitti (Romanzesu) -> Olbia (Tavolara).
`;
fs.writeFileSync(dir + '/06_five_book_geographic_route.md', f06);

console.log("Batch 2 created");
