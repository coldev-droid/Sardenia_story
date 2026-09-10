const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace('\\napp.get("/api/pingping"', '\napp.get("/api/pingping"');
fs.writeFileSync('server.ts', code);
