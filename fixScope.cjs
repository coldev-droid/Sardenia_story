const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

const replacement = `
      let providerRes;
      let targetBookId = "Book_III";
      let targetChapterId = "Chapter_42";
      let targetSceneId = "Scene_01";
      try {
        if (job && parentCp) {
`;

content = content.replace(/let providerRes;\s*try\s*\{\s*let targetBookId = "Book_III";\s*let targetChapterId = "Chapter_42";\s*let targetSceneId = "Scene_01";\s*if\s*\(job\s*&&\s*parentCp\)\s*\{/m, replacement);
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
