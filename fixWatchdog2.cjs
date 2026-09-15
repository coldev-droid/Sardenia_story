const fs = require('fs');
let content = fs.readFileSync('server/autopilotWatchdog.ts', 'utf8');

const regexOldPrompt = /const partPrompt = `Write the complete[\s\S]*?Go straight into the prose\.`;/m;

const newPrompt = "const targetBook = promptParams?.bookId || 'Book_III';\n        const targetChap = promptParams?.chapterId || 'Chapter_42';\n        const partPrompt = `Write the complete, highly detailed ${targetChap.replace('_', ' ')} of the Sardinia saga (Book: ${targetBook}).\\n\\nActive Team: Geronimo, Katia, Maris, Veerle, Inga, André.\\n\\nThis is a rich, authentic, and detailed narrative about their continued adventure, strictly adhering to the chronological and geographical requirements.\\n\\nIncorporate detailed Sardinian folklore, authentic geology, and logical progression from the previous events.\\n\\nEnsure highly descriptive prose in the Macenzy house voice (slow pacing, deep sensory details, mathematical structure).\\n\\nWrite exactly 3900 words of beautiful, high-quality narrative prose. Ensure no meta-talk, summaries, or title headers. Go straight into the prose.`;";

content = content.replace(regexOldPrompt, newPrompt);
fs.writeFileSync('server/autopilotWatchdog.ts', content, 'utf8');
