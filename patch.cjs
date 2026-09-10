const fs = require('fs');
let code = fs.readFileSync('src/components/ApprovedMythRoster.tsx', 'utf8');

code = code.replace(
  '<div className="space-y-3">',
  '<div className="space-y-3 max-h-64 overflow-y-auto pr-2">'
);

fs.writeFileSync('src/components/ApprovedMythRoster.tsx', code);
console.log('Patched scrollable section.');
