const fs = require('fs');
const dir = '/app/applet/public';

try {
  let myths = JSON.parse(fs.readFileSync(`${dir}/05_myths.json`));
  myths.forEach(m => {
    if (m.name.includes('Myth Concept')) m.status = 'INVALID_PROCEDURAL_PLACEHOLDER';
  });
  fs.writeFileSync(`${dir}/05_myths.json`, JSON.stringify(myths, null, 2));

  let claims = JSON.parse(fs.readFileSync(`${dir}/11_double_verified_source_ledger.json`));
  claims.forEach(c => {
    if (c.claim.includes('Comprehensive claim detailing')) c.status = 'INVALID_PROCEDURAL_PLACEHOLDER';
  });
  fs.writeFileSync(`${dir}/11_double_verified_source_ledger.json`, JSON.stringify(claims, null, 2));
} catch (e) {
  console.error("Failed to invalidate files:", e);
}
