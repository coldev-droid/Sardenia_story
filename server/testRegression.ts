import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";

// Force regression test environment flag before any imports so the safety check knows we are running tests!
process.env.IS_RUNNING_REGRESSION_TESTS = "true";

// 1. Create temporary isolated directories using mkdtemp
const tmpBase = os.tmpdir();
const testSagaDataDir = fs.mkdtempSync(path.join(tmpBase, "saga_data_test_"));
const testManuscriptDir = fs.mkdtempSync(path.join(tmpBase, "manuscript_test_"));

// Set environment override paths so internal modules can look up directories correctly if they fall back
process.env.SAGA_DATA_DIR_TEST = testSagaDataDir;
process.env.MANUSCRIPT_DIR_TEST = testManuscriptDir;

// 2. Assert resolved test paths cannot equal or contain production paths
const prodSagaDataDir = path.resolve(process.cwd(), "saga_data");
const prodManuscriptDir = path.resolve(process.cwd(), "canonical-source/manuscript");

if (testSagaDataDir === prodSagaDataDir || testSagaDataDir.startsWith(prodSagaDataDir)) {
  throw new Error("Security violation: testSagaDataDir cannot equal or be within production saga_data directory.");
}
if (testManuscriptDir === prodManuscriptDir || testManuscriptDir.startsWith(prodManuscriptDir)) {
  throw new Error("Security violation: testManuscriptDir cannot equal or be within production manuscript directory.");
}

// 3. Import production types and classes, but NOT global production state or orchestrators!
import {
  AutopilotOrchestrator,
  CheckpointManager,
  WatchdogCheckpoint,
  WatchdogState,
  ContinuationJob,
  AutopilotStorageAdapter,
  AutopilotProvider,
  InspectorResult,
  MOCK_PASSING_INSPECTORS,
  signInspectorResult
} from "./autopilotWatchdog";

const INSPECTOR_NAMES_MOCK = [
  "Historical Auditor",
  "Myth Auditor",
  "Geographic Auditor",
  "Canon Auditor",
  "Mineralogical Auditor",
  "Sibling Bond Auditor",
  "Maritime Navigation Auditor",
  "Language and Dialect Auditor",
  "Structural Pacing Auditor",
  "Archaeological Accuracy Auditor",
  "Physical Damage & Wear Auditor",
  "Dialogue Naturalism Auditor",
  "Continuity Chronology Auditor",
  "Emotional Tension Auditor",
  "Amulet Architecture Auditor",
  "Natural World Senses Auditor",
  "Local Integration Auditor",
  "Action Sequencing Auditor",
  "Nautical Mechanism Auditor",
  "Prose Style & Tone Auditor"
];

// Local test state & queue
let localTestState: WatchdogState;
let localTestQueue: ContinuationJob[];

// Standard initial state template for test setup
const initialCheckpointBackup: WatchdogCheckpoint = {
  checkpointId: "sha256:b03e01_su_gorropu_acoustic_gate_locked",
  timestamp: new Date().toISOString(),
  bookId: "Book_III",
  chapterId: "Chapter_41",
  sceneId: "Scene_01",
  sagaPosition: "Book III — Episode B03-E01 (Chapter 41 Locked) → B03-E02 (Enqueued)",
  wordCount: 4380,
  sha256Hash: crypto.createHash("sha256").update("b03e01_su_gorropu_acoustic_gate_locked_4380_words").digest("hex"),
  verifiedScore: 9.85,
  qualityPassed: true,
  activeTeam: ["Geronimo", "Katia", "Maris", "Veerle", "Inga", "André"],
  amuletsRecovered: ["True Amulet #01 (S'Urtzu Obsidian Flake)", "True Amulet #02 (Su Tempiesu Megaron Basalt Key)"],
  activeConsequences: [
    "Su Tempiesu megaron spring stabilizes 784Hz acoustic backbone across Central Sardinia",
    "Acoustic channel locked on Su Gorropu chasm for Book III opening"
  ],
  inspectorResults: MOCK_PASSING_INSPECTORS
};

const initialTestStateTemplate: WatchdogState = {
  projectId: "sardinia-myths-39410",
  autopilotEnabled: true,
  currentState: "IDLE",
  currentBookId: "Book_III",
  currentChapterId: "Chapter_41",
  currentSceneId: "Scene_01",
  retryCount: 0,
  activeBlockers: [],
  activeCheckpoint: { ...initialCheckpointBackup },
  lease: null,
  heartbeat: null,
  nextScheduledJobId: null,
  stopReason: "NORMAL_WORK_UNIT_COMPLETED",
  safetyLimits: {
    maxCostPerDayUSD: 15.00,
    maxCostSeriesUSD: 75.00,
    maxTokensPerDay: 500000,
    maxTokensSeries: 10000000,
    currentCostTodayUSD: 0,
    totalCostSeriesUSD: 0,
    currentTokensToday: 0,
    totalTokensSeries: 0,
    currentCallsThisHour: 0,
    maxCallsPerHour: 30,
    maxRetries: 5,
    maxChaptersPerRun: 12,
    approvedModelProviders: ["gemini-3.8-flash"],
    bookBreakdown: [],
    modelBreakdown: []
  },
  auditHistory: []
};

// Isolated test storage adapter
class TestStorageAdapter implements AutopilotStorageAdapter {
  getManuscriptPath(bookId: string, chapterId: string): string {
    let bNum = "01";
    if (bookId.includes("III") || bookId.includes("3")) bNum = "03";
    else if (bookId.includes("II") || bookId.includes("2")) bNum = "02";
    else if (bookId.includes("IV") || bookId.includes("4")) bNum = "04";
    else if (bookId.includes("V") || bookId.includes("5")) bNum = "05";

    let cStr = chapterId.replace("Chapter_", "").replace("C", "");
    const cNum = parseInt(cStr, 10);
    const cStrPadded = isNaN(cNum) ? cStr : String(cNum).padStart(2, '0');

    return path.join(testManuscriptDir, `BOOK_${bNum}_C${cStrPadded}.md`);
  }

  ensureDataDir(): void {
    if (!fs.existsSync(testSagaDataDir)) {
      fs.mkdirSync(testSagaDataDir, { recursive: true });
    }
  }

  loadStateFromDisk(): WatchdogState {
    const file = path.join(testSagaDataDir, "watchdog_state.json");
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
    return { ...initialTestStateTemplate };
  }

  saveStateToDisk(state: WatchdogState): void {
    this.ensureDataDir();
    const file = path.join(testSagaDataDir, "watchdog_state.json");
    fs.writeFileSync(file, JSON.stringify(state, null, 2), "utf-8");
  }

  loadQueueFromDisk(): ContinuationJob[] {
    const file = path.join(testSagaDataDir, "continuation_queue.json");
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, "utf-8"));
    }
    return [];
  }

  saveQueueToDisk(queue: ContinuationJob[]): void {
    this.ensureDataDir();
    const file = path.join(testSagaDataDir, "continuation_queue.json");
    fs.writeFileSync(file, JSON.stringify(queue, null, 2), "utf-8");
  }

  getAuditQuarantineDir(): string {
    return path.join(testManuscriptDir, "audit_quarantine");
  }
}

const storageAdapter = new TestStorageAdapter();

// Mock provider with configurable behaviors
class MockTestProvider implements AutopilotProvider {
  generateProseFn?: (workerId: string) => Promise<{ prose: string; status: "SUCCESS" | "FAILED" }>;
  evaluateProseFn?: (prose: string) => Promise<{
    results: InspectorResult[];
    factualAudit: { passed: boolean; evidence: string };
    continuityAudit: { passed: boolean; evidence: string };
  }>;

  async generateProse(workerId: string) {
    if (this.generateProseFn) {
      return await this.generateProseFn(workerId);
    }
    return { prose: "", status: "FAILED" as const };
  }

  async evaluateProse(prose: string) {
    if (this.evaluateProseFn) {
      return await this.evaluateProseFn(prose);
    }
    return {
      results: [],
      factualAudit: { passed: false, evidence: "No evaluation mock set" },
      continuityAudit: { passed: false, evidence: "No evaluation mock set" }
    };
  }
}

const mockProvider = new MockTestProvider();

function cleanupDirs() {
  try {
    if (fs.existsSync(testSagaDataDir)) {
      fs.rmSync(testSagaDataDir, { recursive: true, force: true });
    }
    if (fs.existsSync(testManuscriptDir)) {
      fs.rmSync(testManuscriptDir, { recursive: true, force: true });
    }
  } catch (err) {
    // Tolerate leftovers if forced/locked
    console.warn("Leftover temporary files could not be fully deleted:", err);
  }
}

function resetTestState() {
  storageAdapter.ensureDataDir();
  const qDir = storageAdapter.getAuditQuarantineDir();
  if (!fs.existsSync(qDir)) {
    fs.mkdirSync(qDir, { recursive: true });
  }

  // Perform a deep copy of initialTestStateTemplate using JSON parsing to avoid any shared array/object references across scenarios
  localTestState = JSON.parse(JSON.stringify(initialTestStateTemplate));
  localTestState.auditHistory = [];
  localTestQueue = [];

  storageAdapter.saveStateToDisk(localTestState);
  storageAdapter.saveQueueToDisk(localTestQueue);

  // Ensure Chapter 41 manuscript exists with exactly 4380 words
  const c41File = storageAdapter.getManuscriptPath("Book_III", "Chapter_41");
  const c41Dir = path.dirname(c41File);
  if (!fs.existsSync(c41Dir)) {
    fs.mkdirSync(c41Dir, { recursive: true });
  }
  const dummyWord = "word ".repeat(4380);
  fs.writeFileSync(c41File, dummyWord.trim(), "utf-8");

  // Clean up any generated files in the test folder
  const c42File = storageAdapter.getManuscriptPath("Book_III", "Chapter_42");
  if (fs.existsSync(c42File)) {
    fs.unlinkSync(c42File);
  }
  const c43File = storageAdapter.getManuscriptPath("Book_III", "Chapter_43");
  if (fs.existsSync(c43File)) {
    fs.unlinkSync(c43File);
  }
}

async function runTests() {
  console.log("=====================================================================");
  console.log("🚀 STARTING AUTOPILOT WATCHDOG REGRESSION TEST SUITE (FULLY ISOLATED)");
  console.log("=====================================================================");

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(` ✅ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(` ❌ FAIL: ${message}`);
      failedTests++;
    }
  }

  // Pre-clean folders
  cleanupDirs();

  // -----------------------------------------------------------------
  // SCENARIO 1: Simulate a 333-word chapter (Below 3500 threshold)
  // -----------------------------------------------------------------
  console.log("\n--- Scenario 1: 333-word short draft ---");
  resetTestState();

  const shortDraft = "word ".repeat(333).trim();
  mockProvider.generateProseFn = async () => ({ prose: shortDraft, status: "SUCCESS" });
  mockProvider.evaluateProseFn = async (prose: string) => {
    const results = INSPECTOR_NAMES_MOCK.map((name) => ({
      name,
      score: 8.0,
      status: "FAIL" as const,
      evidence: "Failing quality gate check: word count is below threshold."
    }));
    return {
      results,
      factualAudit: { passed: false, evidence: "Failing word count" },
      continuityAudit: { passed: false, evidence: "Failing word count" }
    };
  };

  try {
    const testOrchestrator = new AutopilotOrchestrator(
      storageAdapter,
      mockProvider,
      localTestState,
      localTestQueue
    );

    const res = await testOrchestrator.executeAutopilotCycle("test-runner");
    
    assert(res.success === false, "Autopilot cycle should return success = false");
    assert(localTestState.currentState === "REPAIR_SCENE", "Watchdog should transition to REPAIR_SCENE");
    assert(localTestState.activeCheckpoint.checkpointId === initialCheckpointBackup.checkpointId, "Previous checkpoint must be preserved");
    
    const hasNextJob = localTestQueue.some(j => j.chapterId === "Chapter_43");
    assert(!hasNextJob, "Continuation job for Chapter 43 must NOT be enqueued");

    const lastAudit = localTestState.auditHistory[0];
    assert(lastAudit.detail.includes("INVALID_WORD_COUNT"), "Failed gates (INVALID_WORD_COUNT) should be logged");

    const quarantineDir = storageAdapter.getAuditQuarantineDir();
    const quarantinedFiles = fs.readdirSync(quarantineDir);
    assert(quarantinedFiles.length > 0, "Failing draft must be placed in audit_quarantine");

  } catch (err: any) {
    console.error("Scenario 1 crashed:", err);
    failedTests++;
  }

  // -----------------------------------------------------------------
  // SCENARIO 2: Provider failure (Gemini API returns error or no prose)
  // -----------------------------------------------------------------
  console.log("\n--- Scenario 2: Provider generation failure ---");
  resetTestState();

  mockProvider.generateProseFn = async () => ({ prose: "", status: "FAILED" });
  mockProvider.evaluateProseFn = async (prose: string) => {
    const results = INSPECTOR_NAMES_MOCK.map((name) => ({
      name,
      score: 5.0,
      status: "FAIL" as const,
      evidence: "Generation failed."
    }));
    return {
      results,
      factualAudit: { passed: false, evidence: "Generation failed" },
      continuityAudit: { passed: false, evidence: "Generation failed" }
    };
  };

  try {
    const testOrchestrator = new AutopilotOrchestrator(
      storageAdapter,
      mockProvider,
      localTestState,
      localTestQueue
    );

    const res = await testOrchestrator.executeAutopilotCycle("test-runner");
    
    assert(res.success === false, "Autopilot cycle should return success = false on provider failure");
    assert(localTestState.currentState === "REPAIR_SCENE", "Watchdog should transition to REPAIR_SCENE on provider failure");
    assert(localTestState.activeCheckpoint.checkpointId === initialCheckpointBackup.checkpointId, "Previous checkpoint must be preserved on provider failure");
    
    const hasNextJob = localTestQueue.some(j => j.chapterId === "Chapter_43");
    assert(!hasNextJob, "Continuation job for Chapter 43 must NOT be enqueued on provider failure");

    const lastAudit = localTestState.auditHistory[0];
    assert(lastAudit.detail.includes("PROVIDER_GENERATION_FAILED"), "Failed gates (PROVIDER_GENERATION_FAILED) should be logged");

  } catch (err: any) {
    console.error("Scenario 2 crashed:", err);
    failedTests++;
  }

  // -----------------------------------------------------------------
  // SCENARIO 3: Bounded retries limit exceeded
  // -----------------------------------------------------------------
  console.log("\n--- Scenario 3: Bounded retries limit exceeded ---");
  resetTestState();
  localTestState.retryCount = 5; // Limit is 5, so next failure should block

  mockProvider.generateProseFn = async () => ({ prose: "Short prose", status: "SUCCESS" });
  mockProvider.evaluateProseFn = async (prose: string) => {
    const results = INSPECTOR_NAMES_MOCK.map((name) => ({
      name,
      score: 8.0,
      status: "FAIL" as const,
      evidence: "Failing retry limit evaluation."
    }));
    return {
      results,
      factualAudit: { passed: false, evidence: "Failing retry limit" },
      continuityAudit: { passed: false, evidence: "Failing retry limit" }
    };
  };

  try {
    const testOrchestrator = new AutopilotOrchestrator(
      storageAdapter,
      mockProvider,
      localTestState,
      localTestQueue
    );

    const res = await testOrchestrator.executeAutopilotCycle("test-runner");
    
    assert(res.success === false, "Autopilot should return success = false");
    assert(localTestState.currentState === "BLOCKED_HUMAN_REQUIRED", "Watchdog should transition to BLOCKED_HUMAN_REQUIRED on retry limit exceeded");
    assert(localTestState.activeBlockers.some(b => b.includes("RETRY_LIMIT_EXCEEDED")), "RETRY_LIMIT_EXCEEDED blocker should be active");

  } catch (err: any) {
    console.error("Scenario 3 crashed:", err);
    failedTests++;
  }

  // -----------------------------------------------------------------
  // SCENARIO 4: Fully compliant generation (3500-5500 words, passes all)
  // -----------------------------------------------------------------
  console.log("\n--- Scenario 4: Fully compliant narrative chapter ---");
  resetTestState();

  // Create a 4200-word draft
  const compliantDraft = "The limestone chasm of Su Gorropu rose like a cathedral of the ancient gods. ".repeat(300); // 4200 words
  mockProvider.generateProseFn = async () => ({ prose: compliantDraft, status: "SUCCESS" });
  mockProvider.evaluateProseFn = async (prose: string) => {
    const normalizedProse = prose.trim().replace(/\r\n/g, "\n");
    const manuscriptHash = crypto.createHash("sha256").update(normalizedProse).digest("hex");
    const results = INSPECTOR_NAMES_MOCK.map((name, idx) => {
      const score = 9.5 + (idx % 6) * 0.1; // 9.5 to 10.0
      const finalScore = parseFloat(score.toFixed(2));
      const sig = signInspectorResult(name, finalScore, "PASS", manuscriptHash);
      return {
        name,
        inspectorId: name,
        score: finalScore,
        status: "PASS" as const,
        evidence: `Verified ${name} against compliant draft.`,
        manuscriptHash,
        signature: sig
      };
    });
    return {
      results,
      factualAudit: { passed: true, evidence: "Factual verified." },
      continuityAudit: { passed: true, evidence: "Continuity verified." }
    };
  };

  try {
    const testOrchestrator = new AutopilotOrchestrator(
      storageAdapter,
      mockProvider,
      localTestState,
      localTestQueue
    );

    const res = await testOrchestrator.executeAutopilotCycle("test-runner");
    
    assert(res.success === true, "Autopilot cycle should succeed for a fully compliant chapter");
    assert(localTestState.currentState === "IDLE", "Watchdog should transition back to IDLE state");
    
    // Check that new checkpoint has been committed
    assert(localTestState.activeCheckpoint.checkpointId !== initialCheckpointBackup.checkpointId, "Active checkpoint must be updated to new Chapter 42 checkpoint");
    assert(localTestState.activeCheckpoint.checkpointId.startsWith("sha256:"), "Checkpoint ID must be a full SHA-256 string");
    assert(localTestState.activeCheckpoint.checkpointId.length === 71, "Checkpoint ID must have 'sha256:' plus 64 hex chars (length 71)");
    assert(localTestState.activeCheckpoint.wordCount === 4200, "Checkpoint word count must be exactly 4200 words");
    assert(localTestState.activeCheckpoint.qualityPassed === true, "New checkpoint must have qualityPassed = true");

    // Check continuation queue contains next job (Chapter 43)
    const hasNextJob = localTestQueue.some(j => j.chapterId === "Chapter_43" && j.status === "QUEUED");
    assert(hasNextJob, "Continuation job for Chapter 43 should be successfully enqueued in localTestQueue");

    // Check manuscript file is saved to disk and exists
    const c42File = storageAdapter.getManuscriptPath("Book_III", "Chapter_42");
    assert(fs.existsSync(c42File), `Approved manuscript file must exist at ${c42File}`);

    // Verify verifyCheckpoint() successfully validates the new checkpoint from the disk file!
    const isCpValid = CheckpointManager.verifyCheckpoint(localTestState.activeCheckpoint);
    assert(isCpValid === true, "verifyCheckpoint must return true for the committed Chapter 42 checkpoint from disk file");

  } catch (err: any) {
    console.error("Scenario 4 crashed:", err);
    failedTests++;
  }

  // -----------------------------------------------------------------
  // SCENARIO 5: Production build safety
  // -----------------------------------------------------------------
  console.log("\n--- Scenario 5: Production build safety ---");
  try {
    const watchdogContent = fs.readFileSync(path.resolve("server", "autopilotWatchdog.ts"), "utf-8");
    assert(!watchdogContent.includes("setTestMockProvider"), "setTestMockProvider must be absent from production code.");
    assert(!watchdogContent.includes("activeTestMockProvider"), "activeTestMockProvider must be absent from production code.");
  } catch (err: any) {
    console.error("Scenario 5 crashed:", err);
    failedTests++;
  }

  // Clean up directories at the end of the test suite
  cleanupDirs();

  console.log("\n=====================================================================");
  console.log("📊 REGRESSION TEST SUITE RESULTS:");
  console.log(`Passed: ${passedTests} / Failed: ${failedTests}`);
  console.log("=====================================================================");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("Unhandled test suite runner exception:", err);
  process.exit(1);
});
