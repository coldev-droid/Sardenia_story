import { DbAdapter } from './dbAdapter.ts';
import { AutopilotOrchestrator, loadStateFromDisk } from './autopilotWatchdog.ts';
import * as fs from 'fs';

async function startWorker() {
  const workerId = "sardinia-worker-node-" + Math.floor(Math.random() * 1000);
  console.log(`[Worker] Started worker process ${workerId}`);
  
  while (true) {
    try {
      // Load watchdog state to verify autopilot is enabled and worker can claim jobs
      const state = loadStateFromDisk();
      const workerMayClaimStoryJob = state.currentState !== "PAUSED_RATE_LIMIT";

      if (!state.autopilotEnabled || !workerMayClaimStoryJob) {
        // Autopilot is disabled, or standard story jobs are blocked due to rate limits.
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }

      const job = await DbAdapter.getNextJob(workerId);
      if (job) {
        console.log(`[Worker] Claimed job ${job.jobId} for checkpoint ${job.parentCheckpointId}`);
        fs.appendFileSync('worker.log', `[Worker] Claimed job ${job.jobId}\n`);
        
        // Fetch parent checkpoint to understand context
        const parentCp = await DbAdapter.getCheckpoint(String(job.parentCheckpointId || ""));
        
        // Now run the cycle
        try {
            const result = await AutopilotOrchestrator.executeAutopilotCycle(workerId, job, parentCp);
            
            if (result.success) {
              await DbAdapter.completeJob(job.jobId as string, job.fencingToken as number);
              console.log(`[Worker] Completed job ${job.jobId}`);
              fs.appendFileSync('worker.log', `[Worker] Completed job ${job.jobId}\n`);
            } else {
              await DbAdapter.failJob(job.jobId as string, job.fencingToken as number);
              console.log(`[Worker] Failed job ${job.jobId}: ${result.message}`);
              fs.appendFileSync('worker.log', `[Worker] Failed job ${job.jobId}: ${result.message}\n`);
            }
        } catch(err: any) {
            console.error("[Worker] executeAutopilotCycle threw error:", err);
            fs.appendFileSync('worker.log', `[Worker] Error for ${job.jobId}: ${err?.message}\n${err?.stack}\n`);
            await DbAdapter.failJob(job.jobId as string, job.fencingToken as number);
        }
      } else {
        // No job found, sleep briefly
        await new Promise(res => setTimeout(res, 2000));
      }
    } catch (err: any) {
      console.error("[Worker] Error in job loop:", err);
      fs.appendFileSync('worker.log', `[Worker] Error in job loop: ${err?.message}\n${err?.stack}\n`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}
startWorker();
