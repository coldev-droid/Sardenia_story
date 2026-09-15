import fs from 'fs';
import path from 'path';
import { db } from '../src/db/index.ts';
import { checkpoints, jobsQueue, inspectorReports } from '../src/db/schema.ts';

async function run() {
  console.log("Migrating state...");
  try {
    const queueData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'saga_data', 'watchdog_queue.json'), 'utf8'));
    for (const job of queueData) {
      // Need to handle timestamps and insertion
      await db.insert(jobsQueue).values({
        jobId: job.jobId,
        parentCheckpointId: job.checkpointId, // from existing structure
        pipelineAction: job.pipelineAction,
        status: job.status,
        createdAt: new Date(job.createdAt || Date.now()),
        scheduledFor: new Date(job.scheduledFor || Date.now()),
      }).onConflictDoNothing();
    }
    console.log("Queue migrated.");
  } catch (e) { console.error(e); }

  console.log("Done");
  process.exit(0);
}
run();
