import { FullAnalysisSchema } from "../schemas.js";
import { getModel } from "../model.js";

/**
 * Node to perform the single, consolidated Gemini LLM call.
 * Analyzes the raw financials and news in parallel, and outputs a structured
 * JSON object containing financial analysis, news sentiment, and the final investment decision.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Full analysis and decision updates.
 */
export async function synthesizeDecisionNode(state) {
  const companyName = state.companyName || state.topic;
  const ticker = state.ticker || "N/A";
  const financialData = state.financialData;
  const newsData = state.newsData || [];

  console.log(`[synthesizeDecisionNode] Initiating unified LLM analysis and decision synthesis for: "${companyName}"...`);

  // Default fallback payload in case of failure
  const fallbackResult = {
    companyOverview: `No overview available for ${companyName}.`,
    businessModel: `No business model details available for ${companyName}.`,
    financialAnalysis: {
      healthScore: 0,
      summary: `Failed to compile financial analysis for ${companyName}.`,
      redFlags: ["Financial data analysis unavailable"],
      strengths: []
    },
    sentimentAnalysis: {
      sentiment: "neutral",
      summary: `Failed to compile market sentiment for ${companyName}.`,
      keyThemes: ["Sentiment analysis unavailable"]
    },
    decision: {
      decision: "WATCH",
      confidence: 50,
      reasoning: `Analysis could not be fully completed due to an internal system error. Please review manual indicators for ${companyName}.`,
      keyFactors: ["System processing failure"]
    }
  };

  try {
    const model = getModel();
    const structuredModel = model.withStructuredOutput(FullAnalysisSchema);

    const systemPrompt = `You are a senior investment analyst and investment committee chair.
Your task is to analyze a target company using the provided raw financial fundamentals data and recent news articles.
You must output a single, fully structured JSON report containing the following fields:

- companyOverview: A clean, informative summary of the company description, mission, history, and current market standing (2-3 sentences).
- businessModel: A clear, insightful explanation of the company's business model (how it generates revenue, its primary products or services, target customers, and competitive advantage) (3-4 sentences).

And the following three sections:

1. financialAnalysis:
   - healthScore: A rating from 0 (poor) to 10 (excellent) representing the company's financial strength and stability. If no financial profile or key metrics are present, this should be 0.
   - summary: A concise executive summary of the financial health of the company.
   - redFlags: An array of key financial concerns (e.g. high debt, low margins, high valuation multiples).
   - strengths: An array of financial pros (e.g. solid cash flow, strong ROE, market leadership).

2. sentimentAnalysis:
   - sentiment: The overall mood of the news (must be one of: "positive", "neutral", "negative", "mixed").
   - summary: A brief summary of the public sentiment and major news angles.
   - keyThemes: An array of key themes, trends, or major threads identified from the headlines.

3. decision:
   - decision: Your ultimate recommendation (must be one of: "INVEST", "PASS", "WATCH").
   - confidence: A percentage rating (0-100) reflecting your confidence.
   - reasoning: A detailed explanation (must be AT LEAST 3 sentences) referencing specific figures (like price, multiples, ratios, or sentiment indicators) from the data.
   - keyFactors: The top 3-5 factors that drove this final decision.

Be objective, detailed, and quantitative in your evaluations.`;

    const formattedNews = newsData.length > 0 
      ? newsData.map((item, idx) => `[Article #${idx + 1}] Title: ${item.title}\nSnippet: ${item.snippet}`).join("\n\n")
      : "No news articles found.";

    const userPrompt = `Company: ${companyName}
Ticker: ${ticker}

--- RAW FINANCIAL DATA ---
${financialData ? JSON.stringify(financialData, null, 2) : "No financial data available (private company or API limit reached)."}

--- RAW NEWS ARTICLES ---
${formattedNews}`;

    console.log("[synthesizeDecisionNode] Calling LLM...");
    const response = await structuredModel.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    console.log("[synthesizeDecisionNode] Consolidated LLM analysis successfully completed.");
    
    return {
      companyOverview: response.companyOverview || fallbackResult.companyOverview,
      businessModel: response.businessModel || fallbackResult.businessModel,
      financialAnalysis: response.financialAnalysis || fallbackResult.financialAnalysis,
      sentimentAnalysis: response.sentimentAnalysis || fallbackResult.sentimentAnalysis,
      decision: response.decision || fallbackResult.decision
    };
  } catch (error) {
    console.error("[synthesizeDecisionNode] Consolidated LLM invocation failed:", error);
    return fallbackResult;
  }
}
