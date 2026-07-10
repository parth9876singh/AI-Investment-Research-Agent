import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Helper to initialize the LangChain model client.
 * Automatically detects if the API key is a Google Gemini key (starts with "AQ." or "AIzaSy")
 * and initializes the native ChatGoogleGenerativeAI client, otherwise defaults to standard ChatOpenAI.
 * 
 * @param {object} options - Optional overrides.
 * @returns {object} Configured LangChain model instance.
 */
export function getModel(options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && (apiKey.startsWith("AQ.") || apiKey.startsWith("AIzaSy"))) {
    console.log("[getModel] Gemini API key detected (AQ./AIza prefix). Initializing native ChatGoogleGenerativeAI client...");
    
    // Destructure model overrides if passed.
    // Note: ChatGoogleGenerativeAI uses 'model' instead of 'modelName'.
    const { modelName, model, ...rest } = options;
    let selectedModel = modelName || model || "gemini-3.5-flash";
    
    // Strip "models/" prefix if present since the native Google SDK handles bare model names
    if (selectedModel.startsWith("models/")) {
      selectedModel = selectedModel.replace("models/", "");
    }
    
    return new ChatGoogleGenerativeAI({
      apiKey,
      model: selectedModel,
      temperature: 0,
      maxRetries: 2,
      ...rest,
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
