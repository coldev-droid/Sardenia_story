const fs = require('fs');
let code = fs.readFileSync('src/components/AuditDashboard.tsx', 'utf8');

// Extract the SourceDomainDistribution section
const regex = /\{\/\* Source Domain Distribution Component \*\/\}.*?<\/section>/s;
code = code.replace(regex, '');

fs.writeFileSync('src/components/AuditDashboard.tsx', code);
console.log('AuditDashboard.tsx patched successfully (removed duplicate SourceDomainDistribution)');
