const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');
content = content.replace(/failed_BOOK_03_C42_\$\{Date\.now\(\)\}\.md/g, 'failed_${targetBookId}_${targetChapterId}_${Date.now()}.md');
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
