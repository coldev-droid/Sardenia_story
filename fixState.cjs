const fs = require('fs');
let content = JSON.parse(fs.readFileSync('saga_data/watchdog_state.json', 'utf8'));
content.activeBlockers = [];
content.retryCount = 0;
content.currentState = "IDLE";
content.stopReason = null;
fs.writeFileSync('saga_data/watchdog_state.json', JSON.stringify(content, null, 2), 'utf8');
