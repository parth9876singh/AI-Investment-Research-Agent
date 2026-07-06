/**
 * Node to analyze sentiment.
 * Consolidated: This is now a pass-through node. News sentiment analysis is executed
 * in a single unified LLM call in synthesizeDecisionNode to prevent rate-limit 429 errors
 * and reduce token latency.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Empty update (pass-through).
 */
export async function analyzeSentimentNode(state) {
  console.log(`[analyzeSentimentNode] Pass-through: Skipping separate sentiment LLM analysis for "${state.companyName || state.topic}".`);
  return {};
}
