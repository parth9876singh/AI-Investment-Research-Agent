import axios from "axios";

/**
 * Fetches recent news articles for a given company name using the Tavily Search API.
 * 
 * @param {string} companyName - The name of the company to search news for.
 * @returns {Promise<Array<object>>} List of news items: { title, snippet, url, publishedDate }.
 */
export async function fetchCompanyNews(companyName) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY environment variable is not defined.");
  }

  if (!companyName || typeof companyName !== "string") {
    throw new Error("A valid company name must be provided.");
  }

  const query = `${companyName} recent news business finance`;
  console.log(`Searching recent news for: "${companyName}" via Tavily...`);

  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      {
        query,
        topic: "news",
        search_depth: "basic",
        max_results: 10,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        timeout: 10000, // 10-second timeout
      }
    );

    const searchResults = response.data?.results || [];

    return searchResults.map((result) => ({
      title: result.title || "No Title",
      snippet: result.content || result.snippet || "",
      url: result.url || "",
      publishedDate: result.published_date || null,
    }));
  } catch (error) {
    console.error(`Error retrieving news for "${companyName}":`, error.message);
    throw new Error(`News search failed for "${companyName}": ${error.message}`);
  }
}
