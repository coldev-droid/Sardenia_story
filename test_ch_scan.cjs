const fs = require('fs');
const path = require('path');

const manuscriptDir = path.join(process.cwd(), 'canonical-source/manuscript');
for (let ch = 1; ch <= 10; ch++) {
  const fName = "BOOK_I_CHAPTER_" + ch + "_FINAL";
  const folderPath = path.join(manuscriptDir, fName);
  const finalPath = path.join(folderPath, '05_final_chapter.md');
  if (fs.existsSync(finalPath)) {
    const text = fs.readFileSync(finalPath, 'utf8');
    console.log(`Chapter ${ch}: ${text.split(/\s+/).length} words`);
  } else {
    console.log(`Chapter ${ch}: Not found`);
  }
}
