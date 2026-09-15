import { RealAutopilotProvider } from "./server/autopilotWatchdog";

async function test() {
  const provider = new RealAutopilotProvider();
  console.log("Calling generateProse...");
  try {
    const result = await provider.generateProse("test-worker");
    console.log("Result status:", result.status);
    console.log("Prose length:", result.prose.length);
    console.log("Prose snippet:", result.prose.substring(0, 500));
  } catch (err) {
    console.error("generateProse failed with error:", err);
  }
}

test();
