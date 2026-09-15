const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');
content = content.replace('async function withRetry(fn, maxRetries = 3) {', 'async function withRetry(fn, maxRetries = 10) {');
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
