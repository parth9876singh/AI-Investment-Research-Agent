import { resolveTicker } from "../../services/tickerLookup.js";

/**
 * Node to resolve a company name into its stock ticker symbol using Finnhub.
 * Replaces LLM-based ticker lookup with a direct, fast API query.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Partial state update with the resolved ticker and companyName.
 */
export async function resolveCompanyNode(state) {
  // Use state.companyName, fallback to state.topic
  const companyName = state.companyName || state.topic;
  
  if (!companyName) {
    console.log("[resolveCompanyNode] No company name or topic provided. Skipping resolution.");
    return { ticker: "NONE", status: "company_resolution_skipped" };
  }

  console.log(`[resolveCompanyNode] Resolving ticker for company: "${companyName}" via Finnhub API...`);

  try {
    const ticker = await resolveTicker(companyName);
    console.log(`[resolveCompanyNode] Resolved ticker: "${ticker}"`);

    return { 
      ticker,
      companyName: state.companyName || companyName,
      status: `resolved_company_${ticker}`
    };
  } catch (error) {
    console.error("[resolveCompanyNode] Error resolving company ticker:", error);
    // Graceful fallback to NONE
    return { 
      ticker: "NONE", 
      companyName: state.companyName || companyName,
      status: "resolution_failed" 
    };
  }
}
