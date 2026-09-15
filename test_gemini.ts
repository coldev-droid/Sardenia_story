import { GoogleGenAI } from "@google/genai";

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API key:", apiKey ? "DEFINED" : "UNDEFINED");
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } }
    });
    console.log("Calling gemini-3.6-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Hello! This is a test."
    });
    console.log("Success! Response text:", response.text);
  } catch (err) {
    console.error("Test failed with error:", err);
  }
}

test();
