import { fetchCompanyFinancials } from "../../services/financialData.js";

/**
 * Node to fetch financial data for the resolved stock ticker.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Partial state update with the fetched financialData.
 */
export async function fetchFinancialsNode(state) {
  const ticker = state.ticker;

  if (!ticker || ticker === "NONE") {
    console.log("[fetchFinancialsNode] Ticker is NONE or undefined. Skipping financial data fetch.");
    return { financialData: null };
  }

  console.log(`[fetchFinancialsNode] Fetching financials for ticker: "${ticker}"`);

  try {
    const result = await fetchCompanyFinancials(ticker);
    return { 
      financialData: result,
      // If FMP returned a cleaner companyName, we can also update state.companyName
      companyName: result.companyName || state.companyName
    };
  } catch (error) {
    console.error(`[fetchFinancialsNode] Failed to fetch financial data for "${ticker}":`, error.message);
    // Return null financialData to allow workflow to continue gracefully
    return { financialData: null };
  }
}
