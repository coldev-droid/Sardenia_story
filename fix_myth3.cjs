const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split('\\n');
let out = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('</button>') && lines[i+1] && lines[i+1].includes('{myth.desc}</p>')) {
        out.push(lines[i]); // Keep the </button>
        i += 3; // Skip the next 3 lines (the duplicated p, div, and closing div)
    } else {
        out.push(lines[i]);
    }
}
fs.writeFileSync('src/App.tsx', out.join('\\n'));
