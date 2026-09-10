const fs = require('fs');
let code = fs.readFileSync('src/components/AuditDashboard.tsx', 'utf8');

// Rename the chart and update the label
code = code.replace(
  '<BarChart2 className="w-5 h-5 text-orange-400" /> Regional Coverage',
  '<BarChart2 className="w-5 h-5 text-orange-400" /> Heritage Site Regional Registration'
);

code = code.replace(
  "label={{ position: 'top', value: 'Min. Threshold (10)', fill: '#ef4444', fontSize: 12 }}",
  "label={{ position: 'top', value: 'Mandatory Research Baseline (10)', fill: '#ef4444', fontSize: 12 }}"
);

fs.writeFileSync('src/components/AuditDashboard.tsx', code);
console.log('AuditDashboard.tsx patched successfully');
