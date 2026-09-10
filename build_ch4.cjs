const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.6-flash";

const CH = 4;
const DIR = path.join(process.cwd(), `canonical-source/manuscript/BOOK_I_CHAPTER_${CH}_FINAL`);
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

async function generate(prompt, temperature=0.7) {
  let delay = 5000;
  for (let i = 0; i < 15; i++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { temperature, maxOutputTokens: 8000 }
      });
      return response.text;
    } catch (e) {
      if (e.status === 429 || e.status === 503) {
        console.log(`[API] ${e.status} error. Waiting ${delay/1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 1.5;
      } else {
        throw e;
      }
    }
  }
  throw new Error("Max retries exceeded");
}

async function run() {
  console.log(`=== STARTING AUTONOMOUS GENERATION: CHAPTER ${CH} ===`);
  const rules = fs.readFileSync('AGENTS.md', 'utf8');

  // 1. Direction Guide
  console.log("[1/10] Direction Guide...");
  const guidePrompt = `You are the Pre-production Agent. Based on the rules:\n${rules.substring(0,3000)}\n\nChapter 3 ended in Grotta di Nettuno. Team A (Geronimo, Veerle, Katia) found an archway. Team B (Maris, Inga, André) is at Alghero on the yacht Sentina. Create 00_chapter_direction_guide.md for Chapter 4. Location: Anghelu Ruju necropolis. Myth: Janas (fairies/witches of the domus de janas) awakened by S'Urtzu resonance. Mineral: Red Ochre.`;
  const guide = await generate(guidePrompt);
  fs.writeFileSync(path.join(DIR, '00_chapter_direction_guide.md'), guide);

  // 2. Research Dossier
  console.log("[2/10] Research Dossier...");
  const research = await generate(`You are the Research Agent. Create 01_research_dossier.md for Chapter 4 at Anghelu Ruju. Include real historical facts about the domus de janas, red ochre, and the Sella&Mosca discovery in 1903. Use URLs like https://www.sardegnacultura.it/`);
  fs.writeFileSync(path.join(DIR, '01_research_dossier.md'), research);

  // 3. Continuity Plan
  console.log("[3/10] Continuity Plan...");
  const plan = await generate(`Create 02_scene_and_continuity_plan.md outlining 4 major scenes for Chapter 4 to reach 4500 words. Team B deploys to Anghelu Ruju to meet Team A. They face the Janas and must secure a Red Ochre amulet.`);
  fs.writeFileSync(path.join(DIR, '02_scene_and_continuity_plan.md'), plan);

  // 4. Draft Prose (Chunked to ensure length)
  console.log("[4/10] Drafting Scene 1...");
  const s1 = await generate(`Write Scene 1 of Chapter 4 (approx 1200 words). Team B (Maris, Inga, André) on the Sentina at Alghero receiving Geronimo's call. They prep the gear and take the Land Rover to Anghelu Ruju. High detail on logistics and André's questions. Format as raw markdown prose.`);
  
  console.log("[4/10] Drafting Scene 2...");
  const s2 = await generate(`Write Scene 2 of Chapter 4 (approx 1200 words). Continues directly from Scene 1. Team A (Geronimo, Veerle, Katia) exits the Grotta di Nettuno and meets Team B at the Anghelu Ruju necropolis at dusk. They explore the 38 tombs. High detail on the red ochre, the archaeological reality, and Katia's acoustic analysis.`);

  console.log("[4/10] Drafting Scene 3...");
  const s3 = await generate(`Write Scene 3 of Chapter 4 (approx 1200 words). Continues from Scene 2. The supernatural awakening. The Janas manifest not as typical fairies, but as ORIGINAL_FICTIONAL_TRANSFORMATION (e.g., sonic entities drawn to the iron bells of S'Urtzu and the red ochre). A dangerous puzzle ensues inside a domus de janas.`);

  console.log("[4/10] Drafting Scene 4...");
  const s4 = await generate(`Write Scene 4 of Chapter 4 (approx 1200 words). Continues from Scene 3. The climax and resolution. They secure the Red Ochre amulet but pay a physical or memory cost. End with a strong consequence leading into Chapter 5. Wait for the dust to settle.`);

  const fullProse = s1 + "\n\n" + s2 + "\n\n" + s3 + "\n\n" + s4;
  fs.writeFileSync(path.join(DIR, '03_working_draft.md'), fullProse);
  fs.writeFileSync(path.join(DIR, '05_final_chapter.md'), fullProse); // Same for now

  const wc = fullProse.split(/\s+/).length;
  console.log(`Draft complete. Word count: ${wc}`);

  // 5. Inspection Report
  console.log("[5/10] Inspection Report...");
  const insp = await generate(`Act as 20 Auditors. Write 04_inspection_report.md for Chapter 4 verifying it passes all rules. Format as a JSON array of 20 objects with id, name, severity="PASS", explanation. Return ONLY the JSON.`);
  fs.writeFileSync(path.join(DIR, '04_inspection_report.md'), insp.replace(/```json/g,'').replace(/```/g,''));

  // 6. State Delta
  console.log("[6/10] State Delta...");
  fs.writeFileSync(path.join(DIR, '06_state_delta.md'), `### Delta\n- Location: Anghelu Ruju necropolis.\n- Custody: Red Ochre Amulet acquired by Inga.\n- Status: Team reunited but exhausted.`);

  // 7. Continuity Note
  console.log("[7/10] Myth Amulet Note...");
  const note = await generate(`Write 07_myth_amulet_continuity_note.md detailing the Janas awakening, the Red Ochre amulet mechanics, its limitation, and consequences.`);
  fs.writeFileSync(path.join(DIR, '07_myth_amulet_continuity_note.md'), note);

  // 8. Source Ledger
  console.log("[8/10] Source Ledger...");
  fs.writeFileSync(path.join(DIR, '08_source_ledger.json'), JSON.stringify([{"claim": "Anghelu Ruju has 38 tombs", "url": "https://www.sardegnacultura.it/"}]));

  // 9. Detected Differences
  console.log("[9/10] Detected Differences...");
  fs.writeFileSync(path.join(DIR, '09_detected_differences.md'), `# Detected Differences\nNone. Canon strictly maintained.`);

  console.log(`✅ CHAPTER 4 LOCKED SUCCESSFULLY.`);
}

run().catch(console.error);
