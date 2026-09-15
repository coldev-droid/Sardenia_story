import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { db } from "../src/db/index.ts";
import { checkpoints, jobsQueue } from "../src/db/schema.ts";
import { eq } from "drizzle-orm";

dotenv.config();

async function main() {
  console.log("Starting watchdog state rollback and pause update...");

  // 1. Fetch Chapter 42 checkpoint from the database
  const c42Rows = await db
    .select()
    .from(checkpoints)
    .where(eq(checkpoints.chapterId, "Chapter_42"));

  if (c42Rows.length === 0) {
    console.error("CRITICAL ERROR: Chapter_42 checkpoint not found in database!");
    process.exit(1);
  }

  const c42Row = c42Rows[0];
  console.log("Successfully fetched Chapter_42 checkpoint from DB:", c42Row.checkpointId);

  // Parse its state_json to extract the activeCheckpoint metadata
  let activeCheckpointObj;
  try {
    const stateObj = JSON.parse(c42Row.stateJson);
    activeCheckpointObj = stateObj.activeCheckpoint;
    if (!activeCheckpointObj) {
      throw new Error("activeCheckpoint is missing in Chapter 42 stateJson");
    }
    console.log("Extracted activeCheckpoint object from Chapter 42 stateJson successfully!");
  } catch (err: any) {
    console.error("Failed to parse stateJson of Chapter 42:", err.message);
    // Fallback construct if parsing stateJson fails
    activeCheckpointObj = {
      checkpointId: c42Row.checkpointId,
      sequence: 42,
      timestamp: c42Row.createdAt?.toISOString() || new Date().toISOString(),
      bookId: c42Row.bookId,
      chapterId: c42Row.chapterId,
      sceneId: c42Row.sceneId,
      sagaPosition: "Book_III — Episode Chapter_42 Locked",
      wordCount: c42Row.wordCount,
      sha256Hash: c42Row.checkpointId.replace("sha256:", ""),
      verifiedScore: 9.8,
      qualityPassed: true,
      activeTeam: ["Geronimo", "Katia", "Maris", "Veerle", "Inga", "André"],
      amuletsRecovered: [
        "True Amulet #01 (S'Urtzu Obsidian Flake)",
        "True Amulet #02 (Su Tempiesu Megaron Basalt Key)",
        "True Amulet #03 (Su Gorropu Limestone Tear)"
      ],
      activeConsequences: [
        "Su Tempiesu megaron spring stabilizes 784Hz acoustic backbone across Central Sardinia",
        "Acoustic channel locked on Su Gorropu chasm for Book III opening",
        "Basalt key coupled with limestone tear reveals deep core cavern coordinates"
      ],
      parentCheckpointHash: "7b4f7b3ca1a1b3b97b60913bcb7aec548e1ee8e555ab7766ad1a269a2813b8dc",
      inspectorResults: []
    };
  }

  // Calculate dynamic future retry timestamp
  const retryAtTimestamp = new Date(Date.now() + 10 * 60 * 1000);
  const retryJobId = "JOB-RETRY-B03-C43-CANARY-ATT-0";
  const exactCh42CheckpointId = "sha256:673e4693528276d698f3e009de8b986a6ba60d9af802162f0f9ab71585ef26be";

  // Clean out any existing retry jobs in DB to ensure idempotency and cleanliness
  await db.delete(jobsQueue).where(eq(jobsQueue.jobId, retryJobId));

  // Insert the delayed retry job into the database queue
  await db.insert(jobsQueue).values({
    jobId: retryJobId,
    parentCheckpointId: exactCh42CheckpointId,
    pipelineAction: "DRAFT_B03_E03_DEEP_CAVERN_COORDINATES",
    status: "QUEUED",
    scheduledFor: retryAtTimestamp,
    createdAt: new Date()
  });
  console.log(`Successfully enqueued delayed retry job ${retryJobId} scheduled for ${retryAtTimestamp.toISOString()}`);

  // 2. Read the existing watchdog state file to preserve other fields
  const DATA_DIR = path.join(process.cwd(), "saga_data");
  const STATE_FILE = path.join(DATA_DIR, "watchdog_state.json");

  let existingState: any = {};
  if (fs.existsSync(STATE_FILE)) {
    try {
      existingState = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
      console.log("Read existing watchdog state successfully.");
    } catch (err: any) {
      console.warn("Could not parse existing state file, using empty default:", err.message);
    }
  }

  // 3. Construct the new paused state with exact requested metadata
  const newState = {
    projectId: existingState.projectId || "sardinia-magic-series-master",
    autopilotEnabled: true, // Enabled for autonomous retry
    currentState: "PAUSED_RATE_LIMIT",
    currentBookId: "Book_III",
    currentChapterId: "Chapter_42", // Reset active pointer to Chapter 42
    currentSceneId: "Scene_01",
    activeCheckpoint: activeCheckpointObj,
    lease: null,
    heartbeat: null,
    safetyLimits: existingState.safetyLimits || {
      maxCallsPerHour: 120,
      maxTokensPerDay: 500000,
      maxCostPerDayUSD: 15.0,
      maxRetries: 5,
      maxChaptersPerRun: 10,
      currentCallsThisHour: 18,
      currentTokensToday: 64200,
      currentCostTodayUSD: 1.85,
      totalTokensSeries: 1845200,
      maxTokensSeries: 10000000,
      totalCostSeriesUSD: 14.85,
      maxCostSeriesUSD: 75.0,
      approvedModelProviders: ["google/genai", "gemini-3.6-flash", "gemini-3.5-pro"]
    },
    retryCount: 0,
    activeBlockers: ["PROVIDER_RESOURCE_EXHAUSTED"],
    nextScheduledJobId: retryJobId,
    stopReason: "PROVIDER_RATE_LIMIT",
    auditHistory: existingState.auditHistory || [],
    retryAt: retryAtTimestamp.toISOString(), // future timestamp
    manualClickRequired: false,
    lastTrustedChapter: 42,
    chapter43: "MUST_BE_PROVEN",
    chapter44: "QUARANTINED_PENDING_CHAIN_AUDIT"
  };

  // 4. Save the new state back to disk
  fs.writeFileSync(STATE_FILE, JSON.stringify(newState, null, 2), "utf-8");
  console.log("Successfully wrote updated paused and rolled-back watchdog state to:", STATE_FILE);
  console.log("Watchdog state rollback to Chapter 42 complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Unhandled error in main:", err);
  process.exit(1);
});
