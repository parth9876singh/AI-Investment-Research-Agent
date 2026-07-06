import { ChatOpenAI } from "@langchain/openai";

/**
 * Helper to initialize the ChatOpenAI client.
 * Automatically detects if the API key is a Google Gemini key (starts with "AQ.")
 * and configures the correct baseURL and model to avoid authentication and routing errors.
 * 
 * @param {object} options - Optional overrides.
 * @returns {ChatOpenAI} Configured LangChain model instance.
 */
export function getModel(options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && (apiKey.startsWith("AQ.") || apiKey.startsWith("AIzaSy"))) {
    console.log("[getModel] Gemini API key detected (AQ./AIza prefix). Re-routing to Google Gemini compatibility endpoint.");
    
    return new ChatOpenAI({
      apiKey,
      modelName: "models/gemini-3.5-flash", // Replaces gpt-4o-mini for Gemini API calls
      temperature: 0,
      maxRetries: 2,
      configuration: {
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      },
      ...options,
    });
  }

  // Default standard OpenAI config
  return new ChatOpenAI({
    apiKey,
    modelName: "gpt-4o-mini",
    temperature: 0,
    maxRetries: 2,
    ...options,
  });
}
