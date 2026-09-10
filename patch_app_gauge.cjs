const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = "import { ContinuityGateways } from './components/ContinuityGateways';\nimport { DataIntegrityGauge } from './components/DataIntegrityGauge';\n";
code = code.replace("import { ContinuityGateways } from './components/ContinuityGateways';", importStr);

const headerTarget = `          <div>
            <h1 className="text-lg font-serif font-bold text-stone-100">Colabe Autopilot Manuscript Factory</h1>
            <span className="text-xs text-amber-400 font-medium">Fail-Closed State Machine • 20 Adversarial Inspectors • Human Promotion Gate</span>
          </div>
        </div>`;

const newHeader = headerTarget + `\n        <div className="hidden md:flex ml-auto mr-4">\n          <DataIntegrityGauge />\n        </div>`;
code = code.replace(headerTarget, newHeader);

fs.writeFileSync('src/App.tsx', code);
