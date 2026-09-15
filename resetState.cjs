const fs = require('fs');
let content = JSON.parse(fs.readFileSync('saga_data/watchdog_state.json', 'utf8'));
const nowStr = new Date().toISOString();
content.currentState = "IDLE";
content.lease = null;
content.activeBlockers = [];
content.retryCount = 0;
content.stopReason = "NORMAL_WORK_UNIT_COMPLETED";
if (content.heartbeat) {
  content.heartbeat.lastHeartbeatAt = nowStr;
  content.heartbeat.status = "HEALTHY";
  content.heartbeat.currentAction = "Idle standing by";
}
fs.writeFileSync('saga_data/watchdog_state.json', JSON.stringify(content, null, 2), 'utf8');
console.log("State reset to IDLE successfully with fresh heartbeat timestamp:", nowStr);
