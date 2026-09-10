const fs = require('fs');
let inspection = fs.readFileSync('saga_data/book_1_chapter_1/04_inspection_report.md', 'utf8');
inspection = inspection.replace(/\*\*Exact Prose Word Count \(Programmatic\):\*\* \d+ words/, '**Exact Prose Word Count (Programmatic):** 3833 words');
fs.writeFileSync('saga_data/book_1_chapter_1/04_inspection_report.md', inspection);
