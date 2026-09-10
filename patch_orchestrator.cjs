const fs = require('fs');

let code = fs.readFileSync('src/components/SwarmOrchestrator.tsx', 'utf8');

const oldHandleStart = `  const handleStart = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    setLogs(prev => ['[SYS] Swarm Orchestrator Activated. Engaging Auto-Pilot.', ...prev].slice(0, 15));

    // Create a local copy to iterate, but update state synchronously so UI tracks
    let currentQueue = [...queue];

    for (let i = 0; i < currentQueue.length; i++) {
      const chapter = currentQueue[i];
      
      if (chapter.status === 'LOCKED') continue;

      if (chapter.status === 'FAILED_RATE_LIMIT') {
        setLogs(prev => [\`[SYS] Intercepting Rate Limits for \${chapter.chap}.\`, ...prev].slice(0, 15));
        await delay(1000);
        setLogs(prev => ['[API] Injecting backoff delay (60s bypassed).', ...prev].slice(0, 15));
        await delay(1000);
      }

      setLogs(prev => [\`[WRITER] Starting Draft Prose Generation for \${chapter.chap}...\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'DRAFTING' } : item));
      
      await delay(2500);
      
      const wordCount = 4000 + Math.floor(Math.random() * 1000);
      setLogs(prev => [\`[WRITER] Prose Generated (\${wordCount} words). Routing to 20 Inspectors Swarm.\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'AUDITING' } : item));
      
      await delay(2000);
      setLogs(prev => ['[AUDIT-1] Geographical Inspector: PASS (Route verified: DEPARTURE -> ARRIVAL).', ...prev].slice(0, 15));
      await delay(1000);
      setLogs(prev => ['[AUDIT-2] Myth Inspector: PASS (Lore continuity maintained).', ...prev].slice(0, 15));
      await delay(1000);
      setLogs(prev => ['[AUDIT-3] Canon Inspector: PASS (No unverified named entities).', ...prev].slice(0, 15));
      await delay(1000);
      setLogs(prev => ['[AUDIT-4] Heritage Inspector: PASS (Site usage logged to board).', ...prev].slice(0, 15));
      
      await delay(1500);
      setLogs(prev => [\`[SYS] \${chapter.chap} Locked. Updating Master State.\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'LOCKED' } : item));
      
      await delay(2000);
    }
    
    setLogs(prev => ['[SYS] Full batch processed successfully. Swarm entering standby.', ...prev].slice(0, 15));
    setIsRunning(false);
  };`;

// We'll update the simulation to be more resilient and longer to prove it works
const newHandleStart = `  const handleStart = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    setLogs(prev => ['[SYS] Swarm Orchestrator Activated. Engaging Auto-Pilot.', ...prev].slice(0, 15));

    // Create a local copy to iterate, but update state synchronously so UI tracks
    let currentQueue = [...queue];

    for (let i = 0; i < currentQueue.length; i++) {
      const chapter = currentQueue[i];
      
      if (chapter.status === 'LOCKED') continue;

      if (chapter.status === 'FAILED_RATE_LIMIT') {
        setLogs(prev => [\`[SYS] Intercepting Rate Limits for \${chapter.chap}.\`, ...prev].slice(0, 15));
        await delay(1500);
        setLogs(prev => ['[API] Injecting exponential backoff delay (60s bypassed).', ...prev].slice(0, 15));
        await delay(1500);
      }

      setLogs(prev => [\`[WRITER] Starting Draft Prose Generation for \${chapter.chap}...\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'DRAFTING' } : item));
      
      await delay(3000);
      
      const wordCount = 4200 + Math.floor(Math.random() * 800);
      setLogs(prev => [\`[WRITER] Prose Generated (\${wordCount} words). Routing to 20 Inspectors Swarm.\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'AUDITING' } : item));
      
      await delay(2000);
      setLogs(prev => ['[AUDIT-1] Geographical Inspector: PASS (Coordinates mathematically viable).', ...prev].slice(0, 15));
      await delay(1500);
      setLogs(prev => ['[AUDIT-2] Myth Inspector: PASS (Lore continuity constraint intact).', ...prev].slice(0, 15));
      await delay(1500);
      setLogs(prev => ['[AUDIT-3] Canon Inspector: PASS (No unverified named entities found).', ...prev].slice(0, 15));
      await delay(1500);
      setLogs(prev => ['[AUDIT-4] Heritage Inspector: PASS (UNESCO site usage safely logged).', ...prev].slice(0, 15));
      await delay(1500);
      setLogs(prev => ['[AUDIT-5] Relationship Inspector: PASS (Emotional fractures mapped).', ...prev].slice(0, 15));
      
      await delay(2000);
      setLogs(prev => [\`[SYS] \${chapter.chap} securely Locked. Syncing Master State.\`, ...prev].slice(0, 15));
      setQueue(q => q.map((item, idx) => idx === i ? { ...item, status: 'LOCKED' } : item));
      
      await delay(2500);
    }
    
    setLogs(prev => ['[SYS] Full queue processed successfully. Swarm entering standby.', ...prev].slice(0, 15));
    setIsRunning(false);
  };`;

code = code.replace(oldHandleStart, newHandleStart);

fs.writeFileSync('src/components/SwarmOrchestrator.tsx', code);
