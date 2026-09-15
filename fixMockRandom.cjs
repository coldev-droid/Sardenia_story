const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

content = content.replace(/const text = Array\.from\(\{length: 4000\}\)\.map\(\(_, i\) => "Sardinia"\)\.join\(" "\);/g, 'const text = Array.from({length: 4000}).map((_, i) => "Sardinia " + Math.random()).join(" ");');
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
