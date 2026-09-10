const fs = require('fs');

const ch5path = 'canonical-source/manuscript/BOOK_I_CHAPTER_5_FINAL/05_final_chapter.md';
if (fs.existsSync(ch5path)) {
    const text = fs.readFileSync(ch5path, 'utf8');
    let serverTs = fs.readFileSync('server.ts', 'utf8');
    const escaped = text.substring(0, 5000).replace(/`/g, '\\`').replace(/\$/g, '\\$');
    serverTs = serverTs.replace(/const candidateProseSample = `[\s\S]*?`;/, `const candidateProseSample = \`${escaped}\`;`);
    fs.writeFileSync('server.ts', serverTs);
}
