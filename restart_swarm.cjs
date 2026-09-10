const { execSync } = require('child_process');
try {
  // kill the existing swarm engine
  execSync('pkill -f swarm_engine.cjs');
} catch (e) {
  // it might not be running
}
