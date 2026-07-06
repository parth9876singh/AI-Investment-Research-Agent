import axios from "axios";

/**
 * Resolves a company name into its stock ticker symbol using Finnhub Symbol Lookup.
 * Falls back to Financial Modeling Prep (FMP) Search if Finnhub fails or is unconfigured.
 * Prioritizes US tickers (symbols without dots) to avoid restricted international exchange 402/403 errors.
 * 
 * @param {string} companyName - The name of the company to look up.
 * @returns {Promise<string>} The resolved stock ticker symbol, or "NONE" if not found.
 */
export async function resolveTicker(companyName) {
  if (!companyName || typeof companyName !== "string") {
    return "NONE";
  }

  const cleanName = companyName.trim();
  const finnhubKey = process.env.FINNHUB_API_KEY;
  const fmpKey = process.env.FMP_API_KEY;

  const axiosConfig = { timeout: 8000 };

  // 1. Attempt Finnhub lookup if key is configured
  if (finnhubKey && !finnhubKey.includes("your_")) {
    try {
      console.log(`[resolveTicker] Querying Finnhub for "${cleanName}"...`);
      const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(cleanName)}&token=${finnhubKey}`;
      const response = await axios.get(url, axiosConfig);

      if (response.data && response.data.result && response.data.result.length > 0) {
        // Prioritize symbols without a dot (US main exchanges)
        const usResult = response.data.result.find(item => item.symbol && !item.symbol.includes("."));
        const symbol = usResult ? usResult.symbol : response.data.result[0].symbol;
        console.log(`[resolveTicker] Finnhub resolved "${cleanName}" to ticker: "${symbol}"`);
        return symbol.toUpperCase();
      }
    } catch (error) {
      console.warn(`[resolveTicker] Finnhub lookup failed: ${error.message}. Trying FMP fallback...`);
    }
  }

  // 2. Fallback to FMP search if Finnhub fails or is unconfigured
  if (fmpKey && !fmpKey.includes("your_")) {
    try {
      console.log(`[resolveTicker] Querying FMP stable search-symbol for "${cleanName}"...`);
      const url = `https://financialmodelingprep.com/stable/search-symbol?query=${encodeURIComponent(cleanName)}&limit=10&apikey=${fmpKey}`;
      const response = await axios.get(url, axiosConfig);

      if (response.data && response.data.length > 0) {
        // Prioritize symbols without a dot (US main exchanges)
        const usResult = response.data.find(item => item.symbol && !item.symbol.includes("."));
        const symbol = usResult ? usResult.symbol : response.data[0].symbol;
        console.log(`[resolveTicker] FMP search-symbol resolved "${cleanName}" to ticker: "${symbol}"`);
        return symbol.toUpperCase();
      }

      // If search-symbol is empty, try search-name
      console.log(`[resolveTicker] FMP search-symbol returned empty. Trying search-name for "${cleanName}"...`);
      const nameUrl = `https://financialmodelingprep.com/stable/search-name?query=${encodeURIComponent(cleanName)}&limit=10&apikey=${fmpKey}`;
      const nameResponse = await axios.get(nameUrl, axiosConfig);

      if (nameResponse.data && nameResponse.data.length > 0) {
        // Prioritize symbols without a dot (US main exchanges)
        const usResult = nameResponse.data.find(item => item.symbol && !item.symbol.includes("."));
        const symbol = usResult ? usResult.symbol : nameResponse.data[0].symbol;
        console.log(`[resolveTicker] FMP search-name resolved "${cleanName}" to ticker: "${symbol}"`);
        return symbol.toUpperCase();
      }
    } catch (error) {
      console.warn(`[resolveTicker] FMP fallback lookup failed: ${error.message}`);
    }
  }

  console.warn(`[resolveTicker] Could not resolve ticker for "${cleanName}" using Finnhub or FMP.`);
  return "NONE";
}
