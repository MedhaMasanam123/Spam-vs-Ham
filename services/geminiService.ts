import { GoogleGenAI } from "@google/genai";
import type { ClassificationResult, Reference } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const classifyMessage = async (message: string): Promise<ClassificationResult> => {
  try {
    const prompt = `
      Analyze the following SMS message and classify it as either 'Spam' or 'Ham'.
      - 'Spam' messages are typically unsolicited, commercial, or malicious.
      - 'Ham' messages are legitimate, personal, or expected communications.

      Use your knowledge and web search to determine the classification.
      
      Provide a confidence probability score from 0.0 to 1.0.

      SMS Message: "${message}"

      IMPORTANT: You must return your response *only* in a valid JSON format, with no surrounding text or markdown.
      The JSON object must contain two keys: "classification" (string, either "Spam" or "Ham") and "probability" (number).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const rawText = response.text.trim();
    // Regex to find JSON content inside a markdown code block (e.g., ```json ... ```)
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = rawText.match(jsonRegex);
    
    // Extract the JSON string, whether it's wrapped in markdown or not
    const jsonText = match ? match[1] : rawText;

    const parsedResult = JSON.parse(jsonText);
    
    const references: Reference[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web?.uri && !!web.title) || [];

    // Basic validation
    if (
      (parsedResult.classification === 'Spam' || parsedResult.classification === 'Ham') &&
      typeof parsedResult.probability === 'number' &&
      parsedResult.probability >= 0 &&
      parsedResult.probability <= 1
    ) {
      return {
        ...parsedResult,
        references,
      } as ClassificationResult;
    } else {
      throw new Error('Received invalid data structure from API.');
    }

  } catch (error) {
    console.error("Error classifying message with Gemini API:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the AI's response. The model may have returned an invalid format.");
    }
    throw new Error("Failed to classify the message. The AI model may be temporarily unavailable.");
  }
};