const fs = require('fs');

let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

// 1. Add retry helper
const retryHelper = `
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if ((err.status === 503 || err.status === 429 || err.status === 500) && attempt < maxRetries) {
        console.warn(\`[Retry] API returned \${err.status}, retrying attempt \${attempt}...\`);
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 2000));
        continue;
      }
      throw err;
    }
  }
}
`;

content = content.replace('export interface AutopilotProvider {', retryHelper + '\nexport interface AutopilotProvider {');

// 2. Add promptParams to generateProse interface
content = content.replace('generateProse(workerId: string, signal?: AbortSignal): Promise<{', 'generateProse(workerId: string, signal?: AbortSignal, promptParams?: any): Promise<{');
content = content.replace('async generateProse(workerId: string, signal?: AbortSignal): Promise<{', 'async generateProse(workerId: string, signal?: AbortSignal, promptParams?: any): Promise<{');

// 3. Use withRetry in generateProse
content = content.replace(/const response = await ai\.models\.generateContent\(\{/g, 'const response = await withRetry(() => ai.models.generateContent({');
// Fix the closing bracket for generateContent calls
content = content.replace(/contents: partPrompt,\n\s*config: \{\n\s*httpOptions: \{ signal \}\n\s*\}\n\s*\}\);/g, 'contents: partPrompt,\n          config: {\n            httpOptions: { signal }\n          }\n        }));');

// 4. Dynamic prompt in generateProse
const oldPrompt = "const partPrompt = `Write the complete, highly detailed Chapter 42 of the Sardinia saga: 'Into the Depths of Su Gorropu Chasm'.\\n\\nActive Team: Geronimo, Katia, Maris, Veerle, Inga, André.\\n\\nThis is a rich, authentic, and detailed narrative about their deep descent into the spectacular limestone chasm of Su Gorropu.\\n\\nIncorporate detailed Sardinian folklore, authentic geology (damp limestone cliffs, wet moss, iron ore), the megaron basalt key, and the search for the Su Gorropu Limestone Tear.\\n\\nEnsure highly descriptive prose in the Macenzy house voice (slow pacing, deep sensory details, mathematical structure).\\n\\nWrite exactly 3900 words of beautiful, high-quality narrative prose. Ensure no meta-talk, summaries, or title headers. Go straight into the prose.`;";

const newPrompt = "const targetBook = promptParams?.bookId || 'Book_III';\n        const targetChap = promptParams?.chapterId || 'Chapter_42';\n        const partPrompt = `Write the complete, highly detailed ${targetChap.replace('_', ' ')} of the Sardinia saga (Book: ${targetBook}).\\n\\nActive Team: Geronimo, Katia, Maris, Veerle, Inga, André.\\n\\nThis is a rich, authentic, and detailed narrative about their continued adventure, strictly adhering to the chronological and geographical requirements.\\n\\nIncorporate detailed Sardinian folklore, authentic geology, and logical progression from the previous events.\\n\\nEnsure highly descriptive prose in the Macenzy house voice (slow pacing, deep sensory details, mathematical structure).\\n\\nWrite exactly 3900 words of beautiful, high-quality narrative prose. Ensure no meta-talk, summaries, or title headers. Go straight into the prose.`;";

content = content.replace(oldPrompt, newPrompt);

// 5. Use withRetry in evaluateProseWithSwarm
content = content.replace(/const response = await ai\.models\.generateContent\(\{\n\s*model: "gemini-3\.6-flash",\n\s*config: \{\n\s*systemInstruction: systemPrompt,\n\s*responseMimeType: "application\/json"\n\s*\},\n\s*contents: userPrompt\n\s*\}\);/g, `const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json"
        },
        contents: userPrompt
      }));`);

// 6. Update executeAutopilotCycle signature (instance and static)
content = content.replace('async executeAutopilotCycle(workerId: string = "sardinia-worker-node-01"): Promise<{', 'async executeAutopilotCycle(workerId: string = "sardinia-worker-node-01", job: any = null, parentCp: any = null): Promise<{');
content = content.replace('static async executeAutopilotCycle(workerId: string = "sardinia-worker-node-01") {', 'static async executeAutopilotCycle(workerId: string = "sardinia-worker-node-01", job: any = null, parentCp: any = null) {');
content = content.replace('return productionOrchestrator.executeAutopilotCycle(workerId);', 'return productionOrchestrator.executeAutopilotCycle(workerId, job, parentCp);');

// 7. Update generateProse call to pass context
content = content.replace('providerRes = await this.provider.generateProse(workerId, abortController.signal);', `
        let targetBookId = "Book_III";
        let targetChapterId = "Chapter_42";
        let targetSceneId = "Scene_01";
        if (job && parentCp) {
           targetBookId = parentCp.book_id || "Book_III";
           const seq = parseInt(parentCp.sequence || "41", 10);
           targetChapterId = \`Chapter_\${seq + 1}\`;
        }
        const promptParams = { bookId: targetBookId, chapterId: targetChapterId };
        providerRes = await this.provider.generateProse(workerId, abortController.signal, promptParams);
`);

// 8. Update commitChapterTransaction call to use dynamic variables
content = content.replace(/"Book_III",\n\s*"Chapter_42",\n\s*"Scene_01",/g, 'targetBookId,\n          targetChapterId,\n          targetSceneId,');

fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
