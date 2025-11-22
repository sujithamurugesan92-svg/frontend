import { GoogleGenAI } from "@google/genai";
import { Deal, Contact } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to simulate AI delay for demo purposes
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateEmailDraft = async (
  contactName: string,
  topic: string,
  tone: 'Professional' | 'Friendly' | 'Urgent'
): Promise<string> => {
  // Check if key exists. If not, return demo content to prevent app crash/freeze
  if (!process.env.API_KEY) {
    await mockDelay(1500);
    return `[DEMO MODE - No API Key Detected]\n\nSubject: ${topic} - Inquiry\n\nHi ${contactName},\n\nI hope you're having a great week. I wanted to reach out regarding ${topic}. Given our recent discussions, I believe we can provide significant value here.\n\nLet me know if you have 10 minutes to chat this week.\n\nBest,\nThe Nexus Team`;
  }

  try {
    const prompt = `
      Write a short, ${tone.toLowerCase()} email to ${contactName}.
      The email is regarding: ${topic}.
      Keep it concise (under 150 words).
      Sign it off as "The Nexus Team".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: The AI service is currently unavailable. Please check your connection or API key.";
  }
};

export const summarizeNotes = async (notes: string): Promise<string> => {
  if (!process.env.API_KEY) {
    await mockDelay(1500);
    return `[DEMO MODE]\n\nHere is a summary of your notes:\n\n• Key discussion point regarding project scope identified.\n• Action item assigned to the design team for next Tuesday.\n• Budget constraints were reviewed and approved.`;
  }

  try {
    const prompt = `
      Summarize the following meeting notes into 3 clear, actionable bullet points.
      
      Notes:
      ${notes}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not summarize notes.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to summarize text at this time.";
  }
};

export const suggestNextAction = async (deal: Deal, contact?: Contact): Promise<string> => {
  if (!process.env.API_KEY) {
    await mockDelay(1500);
    return `[DEMO MODE] Based on the deal stage "${deal.stage}", I recommend scheduling a follow-up call with ${contact?.name || 'the client'} to address any technical questions before sending the final contract.`;
  }

  try {
    const contactInfo = contact ? `Contact: ${contact.name} (${contact.company})` : 'Unknown Contact';
    const prompt = `
      Acting as a sales coach, suggest the SINGLE best next step for this deal.
      
      Deal Context:
      Title: ${deal.title}
      Value: $${deal.value}
      Current Stage: ${deal.stage}
      ${contactInfo}
      
      Keep the suggestion under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not suggest action.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to generate suggestions.";
  }
};