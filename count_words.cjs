const fs = require('fs');
const p1 = fs.readFileSync('ch1_p1.md', 'utf8');
const p2 = fs.readFileSync('ch1_p2.md', 'utf8');
const p3 = fs.readFileSync('ch1_p3.md', 'utf8');
const text = p1 + '\n\n' + p2 + '\n\n' + p3;
const words = text.replace(/[#*]/g, '').trim().split(/\s+/).filter(w => w.length > 0).length;
console.log('Words:', words);
