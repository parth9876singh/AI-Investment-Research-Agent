import axios from "axios";

/**
 * Fetches company profile and key metrics from Financial Modeling Prep (FMP) API stable endpoints.
 * Returns null profile and keyMetrics if FMP API fails or is unconfigured (Strictly real APIs only).
 * 
 * @param {string} companyNameOrTicker - Ticker symbol (e.g. "AAPL") or Company Name (e.g. "Apple").
 * @returns {Promise<object>} Combined profile and metrics data.
 */
export async function fetchCompanyFinancials(companyNameOrTicker) {
  const apikey = process.env.FMP_API_KEY;
  const cleanInput = companyNameOrTicker.trim();
  let ticker = cleanInput.toUpperCase();

  // Axios config with 8-second timeout
  const axiosConfig = {
    timeout: 8000,
  };

  // 1. Resolve ticker symbol if input is not 1-5 uppercase characters
  const isTickerPattern = /^[A-Z-]{1,5}$/.test(ticker);
  if (!isTickerPattern && apikey && !apikey.includes("your_")) {
    try {
      console.log(`[fetchCompanyFinancials] Resolving ticker for name: "${cleanInput}" via FMP stable search...`);
      const searchUrl = `https://financialmodelingprep.com/stable/search-symbol?query=${encodeURIComponent(cleanInput)}&limit=3&apikey=${apikey}`;
      const searchResponse = await axios.get(searchUrl, axiosConfig);
      
      if (searchResponse.data && searchResponse.data.length > 0) {
        ticker = searchResponse.data[0].symbol;
        console.log(`[fetchCompanyFinancials] Resolved "${cleanInput}" to ticker: "${ticker}"`);
      } else {
        ticker = cleanInput.toUpperCase();
      }
    } catch (searchError) {
      console.error(`[fetchCompanyFinancials] Failed to resolve symbol for name "${cleanInput}":`, searchError.message);
      ticker = cleanInput.toUpperCase();
    }
  }

  // 2. Attempt fetching from FMP API (if key is set and isn't placeholder)
  const isKeyConfigured = apikey && !apikey.includes("your_");
  if (isKeyConfigured) {
    const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${ticker}&apikey=${apikey}`;
    const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics?symbol=${ticker}&limit=1&apikey=${apikey}`;

    try {
      console.log(`[fetchCompanyFinancials] Fetching financial data for ticker: "${ticker}" via FMP stable API...`);
      const [profileRes, metricsRes] = await Promise.all([
        axios.get(profileUrl, axiosConfig).catch(err => {
          console.error(`[fetchCompanyFinancials] Profile fetch failed: ${err.message}`);
          return { data: [] };
        }),
        axios.get(metricsUrl, axiosConfig).catch(err => {
          console.error(`[fetchCompanyFinancials] Key metrics fetch failed: ${err.message}`);
          return { data: [] };
        })
      ]);

      const profile = (profileRes.data && profileRes.data.length > 0) ? profileRes.data[0] : null;
      const keyMetrics = (metricsRes.data && metricsRes.data.length > 0) ? metricsRes.data[0] : null;

      return {
        symbol: ticker,
        companyName: profile?.companyName || cleanInput,
        profile,
        keyMetrics
      };
    } catch (error) {
      console.warn(`[fetchCompanyFinancials] FMP API request failed: ${error.message}. Returning empty fundamentals dataset.`);
    }
  }

  // 3. Fallback: Return empty fundamentals structure (real APIs only, no simulated LLM generation)
  return {
    symbol: ticker,
    companyName: cleanInput,
    profile: null,
    keyMetrics: null
  };
}
