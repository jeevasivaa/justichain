
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getLegalAdvice(query: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        systemInstruction: "You are a helpful and empathetic legal advisor. Your goal is to provide clear, simple, and actionable legal information to users who may be in distress. Specialize in general public law, focusing on citizen rights. Do not provide financial or medical advice. Explain legal concepts in plain language, avoiding jargon. Structure your answers with clear headings and bullet points. If a user's query is outside your scope, politely state that you cannot help and suggest they consult a qualified professional. You must be concise.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error getting legal advice from Gemini API:", error);
    return "I'm sorry, but I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
}
