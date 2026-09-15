import { GoogleGenAI } from "@google/genai";
async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.list();
    for await (const model of res) {
      console.log(model.name);
    }
  } catch (err) {
    console.error(err);
  }
}
test();
