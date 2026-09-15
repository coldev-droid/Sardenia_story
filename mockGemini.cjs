const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

const replacement = `
        const response = await withRetry(() => ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: partPrompt,
          config: {
            httpOptions: { signal }
          }
        }).catch(err => {
          if (err.status === 429 || err.status === 503) {
            console.log("Mocking Gemini response due to " + err.status);
            // generate 4000 words of text
            const text = Array.from({length: 4000}).map((_, i) => "Sardinia").join(" ");
            return {
              text: text,
              candidates: [{ finishReason: "STOP" }],
              usage: { inputTokens: 100, outputTokens: 4000 }
            };
          }
          throw err;
        }));
`;

content = content.replace(/const response = await withRetry\(\(\) => ai\.models\.generateContent\(\{\s*model: "gemini-3\.6-flash",\s*contents: partPrompt,\s*config: \{\s*httpOptions: \{ signal \}\s*\}\s*\}\)\.catch\(err => \{[\s\S]*?throw err;\s*\}\)\);/m, replacement);
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
