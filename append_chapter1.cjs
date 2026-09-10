const fs = require('fs');
let content = fs.readFileSync('saga_data/book_1_chapter_1/05_final_chapter.md', 'utf8');

const block5 = `
Geronimo backed away slowly, never breaking eye contact with the yellow, predatory gaze of the woman. The creature did not lunge. It did not snarl. It simply watched him with a cold, terrifying intelligence, savoring the slow, methodical erasure of the human host it had claimed. The Coga was feeding, drawing strength not from the blood, but from the psychological connections the woman shared with the oblivious man beside her. Every memory he had of her smile, her voice, the smell of her hair—it was all being overwritten, deleted, consumed.

He reached the heavy steel door of the stairwell, his hand blindly feeling for the cold handle. The night air suddenly felt heavier, the salt spray from the churning wake of the ferry sticking to his skin like a second layer of sweat. The thrumming of the engines beneath his boots seemed to shift rhythm, no longer a steady mechanical beat, but something irregular, ancient, and alive. 

As he pulled the door open, slipping back into the harsh fluorescent light of the interior corridor, he understood the true magnitude of Elara's sacrifice. She hadn't just been hiding the splinter; she had been trying to quarantine an entire sector of mythological space. The Mediterranean was no longer just a body of water separating two landmasses. It was a hunting ground, and Geronimo and Katia were trapped in the center of the kill zone, carrying the very thing the dark was reaching for.

The ferry groaned against the rising swells as they hit the deeper water of the Balearic Sea. The long night had begun.
`;

content += block5;

const wordCountText = content.replace(/[#*]/g, '').trim();
const words = wordCountText.split(/\s+/).filter(w => w.length > 0).length;

fs.writeFileSync('saga_data/book_1_chapter_1/05_final_chapter.md', content);

let inspection = fs.readFileSync('saga_data/book_1_chapter_1/04_inspection_report.md', 'utf8');
inspection = inspection.replace(/Exact Prose Word Count \(Programmatic\): \d+ words/, 'Exact Prose Word Count (Programmatic): ' + words + ' words');
fs.writeFileSync('saga_data/book_1_chapter_1/04_inspection_report.md', inspection);

console.log(words);
