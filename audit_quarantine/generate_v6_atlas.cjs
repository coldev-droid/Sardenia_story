const fs = require('fs');
const path = require('path');
const dir = '/app/applet/public';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const writeJSON = (filename, data) => fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2));

const regions = [
  { name: 'Nurra', sites: 12 },
  { name: 'Gallura', sites: 15 },
  { name: 'Barbagia', sites: 22 },
  { name: 'Sulcis', sites: 18 },
  { name: 'Campidano', sites: 14 },
  { name: 'Ogliastra', sites: 11 },
  { name: 'Sassarese', sites: 19 },
  { name: 'Oristanese', sites: 16 },
  { name: 'Sarcidano', sites: 9 },
  { name: 'Anglona', sites: 7 }
];

writeJSON('15_regional_coverage.json', regions);
console.log("V6 Data Generated");
