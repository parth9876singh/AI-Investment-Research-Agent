import { fetchCompanyNews } from "../../services/newsData.js";

/**
 * Node to fetch news articles for the company using Tavily Search API.
 * 
 * @param {object} state - Current agent state.
 * @returns {Promise<object>} Partial state update with the fetched newsData.
 */
export async function fetchNewsNode(state) {
  const companyName = state.companyName || state.topic;

  if (!companyName) {
    console.log("[fetchNewsNode] No company name or topic available. Skipping news fetch.");
    return { newsData: [] };
  }

  console.log(`[fetchNewsNode] Fetching news for company: "${companyName}"`);

  try {
    const result = await fetchCompanyNews(companyName);
    return { newsData: result };
  } catch (error) {
    console.error(`[fetchNewsNode] Failed to fetch news data for "${companyName}":`, error.message);
    // Return empty array to allow workflow to continue gracefully
    return { newsData: [] };
  }
}
