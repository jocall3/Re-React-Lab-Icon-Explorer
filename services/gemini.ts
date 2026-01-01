
import { GoogleGenAI, Chat } from "@google/genai";
import { ANALYZER_PROMPT } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
  private chat: Chat;

  constructor() {
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: ANALYZER_PROMPT,
      },
    });
  }

  async sendMessage(message: string) {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I encountered an error while processing your request. Please try again.";
    }
  }
}

export const geminiService = new GeminiService();
