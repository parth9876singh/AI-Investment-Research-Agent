import { Router } from "express";
import { researchGraph } from "../agent/graph.js";
import { reportCache } from "../services/cache.js";

const router = Router();

/**
 * @route   POST /api/research
 * @desc    Execute the full research graph synchronously and return the final state (cached)
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: "Missing 'companyName' in request body." });
    }

    // 1. Check Cache
    const cached = reportCache.get(companyName);
    if (cached) {
      console.log(`[POST /api/research] Cache HIT for: "${companyName}"`);
      return res.json(cached);
    }

    console.log(`[POST /api/research] Cache MISS. Starting research execution for: "${companyName}"`);
    const result = await researchGraph.invoke({ companyName });
    
    // 2. Write to Cache
    reportCache.set(companyName, result);
    
    return res.json(result);
  } catch (error) {
    console.error("[POST /api/research] Execution failed:", error);
    return res.status(500).json({
      error: "Internal Server Error during research execution",
      details: error.message || error,
    });
  }
});

/**
 * @route   GET /api/research/stream
 * @desc    Stream research graph progress via Server-Sent Events (SSE) (cached)
 * @access  Public
 */
router.get("/stream", async (req, res) => {
  const { companyName } = req.query;

  if (!companyName) {
    return res.status(400).json({ error: "Missing 'companyName' query parameter." });
  }

  // Set up Server-Sent Events headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no" // Prevents buffering in Nginx/proxies
  });

  // 1. Check Cache for Streaming
  const cached = reportCache.get(companyName);
  if (cached) {
    console.log(`[GET /api/research/stream] Cache HIT. Replaying chunks for: "${companyName}"`);
    
    // Generate individual replayed chunks so the checklist animates smoothly
    const replayChunks = [
      { resolveCompany: { ticker: cached.ticker, companyName: cached.companyName, status: "cache_hit" } },
      { fetchFinancials: { financialData: cached.financialData } },
      { fetchNews: { newsData: cached.newsData } },
      { analyzeFinancials: { financialAnalysis: cached.financialAnalysis } },
      { analyzeSentiment: { sentimentAnalysis: cached.sentimentAnalysis } },
      { synthesizeDecision: { 
          companyOverview: cached.companyOverview, 
          businessModel: cached.businessModel, 
          decision: cached.decision 
      } }
    ];

    for (const chunk of replayChunks) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      if (res.flush) res.flush();
      // Introduce a small 80ms sleep to let the UI render ticks beautifully
      await new Promise(r => setTimeout(r, 80));
    }

    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  // Keep-alive heartbeat interval (every 15 seconds) to prevent connection drop
  const heartbeat = setInterval(() => {
    res.write(":\n\n");
  }, 15000);

  console.log(`[GET /api/research/stream] Cache MISS. Starting stream for: "${companyName}"`);

  const abortController = new AbortController();

  req.on("close", () => {
    console.log(`[GET /api/research/stream] Connection closed by client. Aborting stream for: "${companyName}"`);
    abortController.abort();
    clearInterval(heartbeat);
  });

  // Buffer to accumulate state for caching
  const accumulated = { companyName };

  try {
    const stream = await researchGraph.stream(
      { companyName },
      { signal: abortController.signal }
    );

    for await (const chunk of stream) {
      // Send the chunk as an SSE data event
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      if (res.flush) res.flush();

      // Accumulate chunk data
      const nodeName = Object.keys(chunk)[0];
      if (nodeName && chunk[nodeName]) {
        Object.assign(accumulated, chunk[nodeName]);
      }
    }

    console.log(`[GET /api/research/stream] Stream finished. Caching results for: "${companyName}"`);
    
    // Save the accumulated result into the cache
    reportCache.set(companyName, accumulated);

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    if (error.name === "AbortError" || abortController.signal.aborted) {
      console.log(`[GET /api/research/stream] Stream aborted for: "${companyName}"`);
    } else {
      console.error(`[GET /api/research/stream] Streaming error for "${companyName}":`, error);
      res.write(`data: ${JSON.stringify({ error: error.message || "Streaming error occurred" })}\n\n`);
    }
  } finally {
    clearInterval(heartbeat);
    if (!res.writableEnded) {
      res.end();
    }
  }
});

export default router;
