const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
if (!content.includes('logicTrace')) {
  content = content.replace('affectedContinuityRecords: string[];', 'affectedContinuityRecords: string[];\n    logicTrace?: {\n      step: number;\n      chapter: string;\n      event: string;\n      connection: string;\n    }[];');
  fs.writeFileSync('src/types.ts', content);
}
