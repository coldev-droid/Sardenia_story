const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const brokenStr = `                  </button>
                    <p className="text-xs text-stone-400 leading-relaxed">{myth.desc}</p>
                    <div className="text-[10px] text-teal-500/80 font-semibold uppercase tracking-wider">{myth.status}</div>
                  </div>`;

if (code.includes(brokenStr)) {
    code = code.replace(brokenStr, '                  </button>');
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed via exact string");
} else {
    // try to fix manually by removing lines matching that.
    console.log("Could not find exact string. Here is the context:");
    const lines = code.split('\\n');
    let out = [];
    let skip = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('</button>') && lines[i+1] && lines[i+1].includes('{myth.desc}</p>')) {
            out.push(lines[i]);
            i += 3; // skip the next 3 lines
        } else {
            out.push(lines[i]);
        }
    }
    fs.writeFileSync('src/App.tsx', out.join('\\n'));
    console.log("Fixed via manual loop");
}
