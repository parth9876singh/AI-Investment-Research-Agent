/**
 * Node to analyze financials. 
 * Consolidated: This is now a pass-through node. Financial analysis is executed
 * in a single unified LLM call in synthesizeDecisionNode to prevent rate-limit 429 errors
 * and reduce token latency.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Empty update (pass-through).
 */
export async function analyzeFinancialsNode(state) {
  console.log(`[analyzeFinancialsNode] Pass-through: Skipping separate financial LLM analysis for "${state.companyName || state.topic}".`);
  return {};
}
