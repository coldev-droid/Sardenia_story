import fs from 'fs';

let serverFile = fs.readFileSync('server.ts', 'utf8');

// Replace candidateProseSample
serverFile = serverFile.replace(
  /const candidateProseSample = `[\s\S]*?`;/,
  `import _fs from 'fs';\nconst candidateProseSample = _fs.readFileSync('canonical-source/manuscript/BOOK_01_C01.md', 'utf8');`
);

// Update Unit and Global IDs
serverFile = serverFile.replace(/"B02_C01"/g, '"B01_C01"');
serverFile = serverFile.replace(/"G031"/g, '"G001"');
serverFile = serverFile.replace(/Book II Chapter 1/g, 'Book I Chapter 1');
serverFile = serverFile.replace(/B02_C02/g, 'B01_C02');

// Word count check
serverFile = serverFile.replace(/164 words/g, '3187 words'); // approx

fs.writeFileSync('server.ts', serverFile);
