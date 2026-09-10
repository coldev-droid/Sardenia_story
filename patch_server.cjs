const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
app.get("/api/orchestrator/scan", (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const manuscriptDir = path.join(process.cwd(), 'canonical-source/manuscript');
  
  const requiredFiles = [
    '01_research_dossier.md',
    '02_amulet_myth_mechanics.md',
    '03_draft_prose.md',
    '04_inspection_report.md',
    '05_final_chapter.md',
    '06_state_delta.md'
  ];

  let queue = [];
  
  // Reconstruct authoritative ledger
  for (let ch = 1; ch <= 30; ch++) {
    const padded = ch.toString().padStart(2, '0');
    const folderName = \`BOOK_I_CHAPTER_\${ch}_FINAL\`;
    const folderPath = path.join(manuscriptDir, folderName);
    
    let isLocked = false;
    let missingFiles = [];
    let wordCount = 0;
    
    if (fs.existsSync(folderPath)) {
      isLocked = true;
      for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(folderPath, file))) {
          isLocked = false;
          missingFiles.push(file);
        }
      }
      
      const finalChapPath = path.join(folderPath, '05_final_chapter.md');
      if (fs.existsSync(finalChapPath)) {
        const text = fs.readFileSync(finalChapPath, 'utf8');
        wordCount = text.split(/\\s+/).length;
        if (wordCount < 3800 || wordCount > 5500) {
          isLocked = false;
        }
      } else {
        isLocked = false;
      }
    }
    
    // Explicit fail-closed rule from AGENTS.md:
    // "Immediate rollback: Reopen Chapters 1 and 2. Audit every factual and named claim again."
    if (ch === 1 || ch === 2) {
      isLocked = false; 
    }

    queue.push({
      chap: \`Book 1, Chapter \${ch}\`,
      folder: folderName,
      status: isLocked ? 'LOCKED' : (ch === 1 || ch === 2 ? 'ROLLBACK_UNLOCKED' : 'PENDING'),
      missingFiles,
      wordCount
    });
  }
  
  // Find the first unlocked
  let firstPendingIndex = queue.findIndex(q => q.status !== 'LOCKED');
  
  res.json({
    success: true,
    authoritativeQueue: queue,
    firstPending: queue[firstPendingIndex]
  });
});
`;

code = code.replace('app.get("/api/pingping"', newEndpoint + '\\napp.get("/api/pingping"');
fs.writeFileSync('server.ts', code);
