const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The broken code block is:
/*
                  </button>
                    <p className="text-xs text-stone-400 leading-relaxed">{myth.desc}</p>
                    <div className="text-[10px] text-teal-500/80 font-semibold uppercase tracking-wider">{myth.status}</div>
                  </div>
*/

code = code.replace(/                  <\/button>\n                    <p className="text-xs text-stone-400 leading-relaxed">\{myth\.desc\}<\/p>\n                    <div className="text-\[10px\] text-teal-500\/80 font-semibold uppercase tracking-wider">\{myth\.status\}<\/div>\n                  <\/div>/g, '                  </button>');

fs.writeFileSync('src/App.tsx', code);
