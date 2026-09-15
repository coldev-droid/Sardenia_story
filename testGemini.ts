import { GoogleGenAI } from "@google/genai";
async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: "gemma-4-31b-it",
      config: {
        systemInstruction: "You are a helpful assistant.",
        responseMimeType: "application/json"
      },
      contents: "Return JSON { \"status\": \"ok\" }"
    });
    console.log(res.text);
  } catch (err) {
    console.error(err);
  }
}
test();
