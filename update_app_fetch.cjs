const fs = require('fs');
let content = fs.readFileSync('/app/applet/src/App.tsx', 'utf8');

content = content.replace(
  "fetchAsText('/11_double_verified_source_ledger.json')",
  "fetchAsText('/Batch_1_Northwest_Nurra_Source_Ledger.json')"
);
content = content.replace(
  "fetchAsText('/10_chapter_assignment_matrix.csv')",
  "fetchAsText('/Batch_1_Northwest_Nurra_Chapter_Matrix.csv')"
);
content = content.replace(
  "fetchAsText('/05_myths.json')",
  "fetchAsText('/Batch_1_Northwest_Nurra_Myths.json')"
);
content = content.replace(
  "fetchAsText('/14_internal_audit_report.md')",
  "fetchAsText('/Batch_1_Northwest_Nurra_Audit.md')"
);
content = content.replace(
  "fetchAsText('/15_regional_coverage.json')",
  "fetchAsText('/Batch_1_Northwest_Nurra_Regional.json')"
);

fs.writeFileSync('/app/applet/src/App.tsx', content);
