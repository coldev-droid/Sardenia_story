const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

content = content.replace(/\.catch\(err => \{\s*if \(err\.status === 429[\s\S]*?throw err;\s*\}\)/g, '');

fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
