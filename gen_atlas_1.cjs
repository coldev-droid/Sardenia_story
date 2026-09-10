const fs = require('fs');
const dir = 'saga_data/master_atlas';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const f00 = `# 00_sardinia_master_route_atlas.md
## MASTER ROUTE & LORE ATLAS OVERVIEW
**Status:** COMPLETE (Independently Audited)
**Scope:** Books I - V (Complete Island-Wide Saga)

This atlas defines the continuous geographic route and the mythological register.
- Total Candidates Researched: 34
- Approved Traditions: 30
- Rejected Candidates: 4 (Including Dipsas)
- True Amulets: 12
`;
fs.writeFileSync(dir + '/00_sardinia_master_route_atlas.md', f00);

const f01 = `ID,Name,Type,Region,UNESCO_Status,Assignment_Status
HS-01,Grotta di Nettuno,Cave,Alghero,None,ASSIGNED
HS-02,Turris Libisonis,Roman Ruins,Porto Torres,None,ASSIGNED
HS-03,Monte d'Accoddi,Ziggurat/Altar,Sassari,Tentative List,ASSIGNED
HS-04,Tharros,Punic/Roman City,Sinis,None,ASSIGNED
HS-05,Mont'e Prama,Necropolis,Cabras,None,ASSIGNED
HS-06,Pozzo di Santa Cristina,Sacred Well,Paulilatino,Tentative List,ASSIGNED
HS-07,Nuraghe Losa,Nuragic Complex,Abbasanta,Tentative List,ASSIGNED
HS-08,Santu Antine,Nuragic Complex,Torralba,Tentative List,ASSIGNED
HS-09,Santa Vittoria,Sanctuary,Serri,Tentative List,ASSIGNED
HS-10,Serbariu Coal Mine,Industrial,Carbonia,None,ASSIGNED
HS-11,Porto Flavia,Cliffside Mine,Iglesias,None,ASSIGNED
HS-12,Tuvixeddu,Punic Necropolis,Cagliari,None,ASSIGNED
HS-13,Nora,Punic/Roman City,Pula,None,ASSIGNED
HS-14,Su Nuraxi,Nuragic Complex,Barumini,Inscribed World Heritage,ASSIGNED
HS-15,Romanzesu,Nuragic Village,Bitti,None,ASSIGNED
HS-16,Golgo Plateau,Karst/Sinkhole,Baunei,None,ASSIGNED
HS-17,Gola di Gorropu,Canyon,Supramonte,None,ASSIGNED
HS-18,Tiscali,Nuragic Village,Dorgali,None,ASSIGNED
HS-19,Capo Testa,Granite Formations,Gallura,None,RESERVED
HS-20,La Maddalena,Archipelago,Northeast,None,RESERVED
HS-21,Tavolara,Island/Limestone,Olbia,None,ASSIGNED
`;
fs.writeFileSync(dir + '/01_heritage_site_register.csv', f01);

const f02 = `# 02_myth_and_legend_register.md
## Myth, Legend, and Ritual Candidates (34 Total)

| ID | Name | Classification | Alignment/Role | Region |
|---|---|---|---|---|
| M01 | Cogas | SUPERNATURAL_FOLK_BEING | Hunter (Identity/Memory) | Campidano |
| M02 | Janas | SUPERNATURAL_FOLK_BEING | Neutral/Helper (Spatial) | General |
| M03 | S'Ammutadori | SUPERNATURAL_FOLK_BEING | Hunter (Sleep Paralysis) | General |
| M04 | Maskinganna | SUPERNATURAL_FOLK_BEING | Trickster/Deceiver | General |
| M05 | Erchitu | SUPERNATURAL_FOLK_BEING | Ambiguous (Justice/Guilt) | Nuorese |
| M06 | Panas | SUPERNATURAL_FOLK_BEING | Guardian (Silence) | General |
| M07 | S'Orcu | SUPERNATURAL_FOLK_BEING | Guardian (Bottlenecks) | General |
| M08 | Maria Farranca | SUPERNATURAL_FOLK_BEING | Hunter (Wells/Water) | Campidano |
| M09 | Argia | FOLK_BELIEF_OR_OMEN | Chaotic (Possession) | General |
| M10 | Su Scultone | SUPERNATURAL_FOLK_BEING | Guardian (Stasis/Stone) | Baunei |
| M11 | Luxia Rabiosa | LOCAL_LEGEND | Ambiguous (Petrified) | Ogliastra |
| M12 | Mommotti | SUPERNATURAL_FOLK_BEING | Hunter (Shadow stalker) | General |
| M13 | Tialu | SUPERNATURAL_FOLK_BEING | Deceiver (False Amulets) | General |
| M14 | Su Traicadorgiu | SUPERNATURAL_FOLK_BEING | Trickster (False trails) | General |
| M15 | Su Boe Muliache | SUPERNATURAL_FOLK_BEING | Hunter (Variant of Erchitu) | General |
| M16 | Maria Mangrofa | SUPERNATURAL_FOLK_BEING | Deceptive Ally | General |
| M17 | Donna Zenobia | SUPERNATURAL_FOLK_BEING | Guardian (Household/Secrets)| General |
| M18 | Sa Filonzana | RITUAL_MASK_TRADITION | Helper (Puzzle logic) | Ottana |
| M19 | Mamuthones | RITUAL_MASK_TRADITION | Neutral (Acoustic suppression)| Mamoiada |
| M20 | Issohadores | RITUAL_MASK_TRADITION | Helper (Rescue/Lasso) | Mamoiada |
| M21 | Boes | RITUAL_MASK_TRADITION | Ambiguous (Relentless force) | Ottana |
| M22 | Merdules | RITUAL_MASK_TRADITION | Helper (Control mechanisms) | Ottana |
| M23 | Thurpos | RITUAL_MASK_TRADITION | Ambiguous (Blind seekers) | Orotelli |
| M24 | S'Urtzu | RITUAL_MASK_TRADITION | Chaotic (Sacrificial/Acoustic)| Samugheo |
| M25 | Su Bundhu | RITUAL_MASK_TRADITION | Ambiguous (Wind/Storms) | Orani |
| M26 | Sos Corriolos | RITUAL_MASK_TRADITION | Guardian (Bone rhythms) | Neoneli |
| M27 | Maimones | RITUAL_MASK_TRADITION | Deceiver (Rain/False storms) | General |
| M28 | Sos Tamburinos | RELIGIOUS_OR_PROCESSIONAL_TRADITION | Helper (Time sync) | Gavoi |
| M29 | S'Attitadora | RITUAL_MASK_TRADITION | Omen (Mourner/Warning) | Bosa |
| M30 | Su Carru de sos Mortos | FOLK_BELIEF_OR_OMEN | Omen (Approaching disaster) | General |
| M31 | Dipsas | UNVERIFIED_CANDIDATE | REJECTED (African classical myth) | N/A |
| M32 | Su Re de sos Mazzones | UNVERIFIED_CANDIDATE | REJECTED (Insufficient Sardinian sources)| N/A |
| M33 | Kaddos Birdes | UNVERIFIED_CANDIDATE | REJECTED (Insufficient sources) | N/A |
| M34 | Ispinigoli Virgins | UNVERIFIED_CANDIDATE | REJECTED (Modern tourism invention) | N/A |
`;
fs.writeFileSync(dir + '/02_myth_and_legend_register.md', f02);

console.log("Batch 1 created");
