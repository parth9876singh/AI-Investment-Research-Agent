/**
 * Simple in-memory cache for investment research reports.
 * Caches reports by company name (case-insensitive) with a Time-To-Live (TTL).
 */
class ReportCache {
  constructor(ttlMs = 15 * 60 * 1000) { // 15 minutes default TTL
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  /**
   * Retrieves a cached report.
   * @param {string} companyName - The target company name.
   * @returns {object|null} The cached report state, or null if expired or missing.
   */
  get(companyName) {
    if (!companyName) return null;
    const key = companyName.trim().toLowerCase();
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      console.log(`[Cache] Cache expired for: "${key}"`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Cache HIT for: "${key}"`);
    return entry.data;
  }

  /**
   * Caches a report.
   * @param {string} companyName - The target company name.
   * @param {object} data - The report data.
   */
  set(companyName, data) {
    if (!companyName || !data) return;
    const key = companyName.trim().toLowerCase();
    console.log(`[Cache] Caching report for: "${key}"`);
    this.cache.set(key, {
      timestamp: Date.now(),
      data
    });
  }

  /**
   * Clears the cache.
   */
  clear() {
    this.cache.clear();
  }
}

export const reportCache = new ReportCache();
