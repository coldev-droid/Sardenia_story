const fs = require('fs');
let code = fs.readFileSync('src/components/AuditDashboard.tsx', 'utf8');

// Replace ChecksumValidationLogs with an import and a usage
if (!code.includes('import { ChecksumValidationLogs }')) {
  code = code.replace(
    "import React, { useState, useEffect, useMemo } from 'react';",
    "import React, { useState, useEffect, useMemo } from 'react';\nimport { ChecksumValidationLogs } from './ChecksumValidationLogs';"
  );
}

// Extract the large section and replace it with <ChecksumValidationLogs />
const regex = /\{\/\* Checksum Validation Logs Component \*\/\}.*?<\/section>/s;
code = code.replace(regex, '<ChecksumValidationLogs />');

fs.writeFileSync('src/components/AuditDashboard.tsx', code);
console.log('AuditDashboard.tsx patched successfully');
