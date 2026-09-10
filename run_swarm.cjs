const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-3.6-flash"; // or gemini-3.6-flash

async function runSwarm() {
  console.log("🚀 Initializing Swarm for Book 1, Chapter 3...");
  const dir = 'saga_data/book_1_chapter_3';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Load Context
  console.log("Loading rules and direction guide...");
  const rules = fs.readFileSync('AGENTS.md', 'utf8');
  let directionGuide = "";
  try {
    directionGuide = fs.readFileSync(`${dir}/00_chapter_direction_guide.md`, 'utf8');
  } catch (e) {
    console.error("Direction guide missing. Run start_ch3.cjs first.");
    process.exit(1);
  }

  // PASS A: Drafting
  console.log("📝 Generating Draft Prose (Writer Agent)...");
  const writerPrompt = `
You are the Writer Agent for the Colabe Manuscript Factory.
Read the following strict rules:
${rules.substring(0, 4000)} // Truncated for token limits, assuming they know the gist

Read the direction guide for Chapter 3:
${directionGuide}

Write Book I, Chapter 3. Provide between 1000 and 1500 words. Maintain the suspense, follow the strict Zero-Invention firewall (use the provided facts), and respect the parallel team rule as outlined in the guide.
Output ONLY the raw markdown prose.
`;
  
  let draftProse = "";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: writerPrompt,
      config: { temperature: 0.7 }
    });
    draftProse = response.text;
    fs.writeFileSync(`${dir}/01_draft_prose.md`, draftProse);
    console.log("✅ Draft saved to 01_draft_prose.md");
  } catch (e) {
    console.error("Failed to generate draft:", e);
    process.exit(1);
  }

  // PASS B: Swarm Inspectors
  console.log("🔍 Running Swarm Inspectors (5 sample inspectors)...");
  
  const inspectors = [
    { id: "INSP-01", name: "Canon Continuity Auditor", focus: "Ensure previous chapter constraints and relationships are maintained." },
    { id: "INSP-02", name: "Geographic Routing Auditor", focus: "Verify physical travel, locations, and time taken." },
    { id: "INSP-03", name: "Zero-Invention Firewall", focus: "Ensure no historical people, places, or artifacts are invented." },
    { id: "INSP-04", name: "Mythological Authenticity", focus: "Verify the myth behavior (S'Urtzu) matches the authorized fictional transformation." },
    { id: "INSP-05", name: "Parallel Timeline Auditor", focus: "Ensure Teams A and B are logically separated and actions are distinct." }
  ];

  const reports = [];
  
  for (const insp of inspectors) {
    console.log(`Running Inspector: ${insp.name}...`);
    const prompt = `
You are an adversarial inspector: ${insp.name}.
Your focus: ${insp.focus}

Review the following draft for Chapter 3:
${draftProse}

Provide a JSON report with exactly these keys:
{
  "id": "${insp.id}",
  "name": "${insp.name}",
  "severity": "PASS" | "WARNING" | "FAIL",
  "exactQuotation": "A quote from the text that is problematic, or empty if PASS",
  "explanation": "Why it passes or fails",
  "smallestSafeCorrection": "How to fix it, or empty if PASS"
}
Output strictly valid JSON.
`;
    
    try {
      const res = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      reports.push(JSON.parse(res.text));
    } catch (e) {
      console.error(`Inspector ${insp.id} failed:`, e);
    }
  }

  fs.writeFileSync(`${dir}/02_inspectors_report.json`, JSON.stringify(reports, null, 2));
  console.log("✅ Inspectors report saved.");

  // Update server.ts mock data
  console.log("🔄 Updating server.ts with generated data...");
  let serverTs = fs.readFileSync('server.ts', 'utf8');
  
  // Replace candidateProseSample
  const escapedProse = draftProse.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  serverTs = serverTs.replace(/const candidateProseSample = `[\s\S]*?`;/, `const candidateProseSample = \`${escapedProse}\`;`);
  
  // Replace inspectors report
  const reportsJson = JSON.stringify(reports, null, 2);
  serverTs = serverTs.replace(/const inspectorsReport = \[[\s\S]*?\];/, `const inspectorsReport = ${reportsJson};`);
  
  fs.writeFileSync('server.ts', serverTs);
  console.log("✅ server.ts updated!");
  
  // Rebuild
  console.log("⚙️ Rebuilding server.cjs...");
  const { execSync } = require('child_process');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log("🎉 Swarm generation complete! Restart your dev server to see changes.");
}

runSwarm();
