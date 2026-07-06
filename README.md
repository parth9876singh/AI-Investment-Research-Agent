# AI Investment Research Agent

An autonomous, multi-agent financial research dashboard powered by **LangGraph**, **React**, **Tailwind CSS**, and **Express**. The system performs real-time fundamental financial analysis and news sentiment tracking to synthesize institutional-grade investment decisions.

---

## 🎨 Features & Overview
The **AI Investment Research Agent** is a full-stack, autonomous stock analysis system. It takes a company name as input, runs a multi-step research workflow in the background, and makes an investment recommendation (**INVEST**, **PASS**, or **WATCH**) supported by data-driven reasoning.

### Key Features:
- **Verdict & Confidence**: Clear color-coded recommendation and a confidence gauge (0-100%).
- **Company Overview & Business Model**: Contextual descriptions of the target company's business model, value proposition, and revenue streams.
- **Stock Indicators Dashboard**: Live financial metrics shown directly (Price, Market Cap, Return on Equity, Return on Assets, Beta, and Valuation multiples).
- **Fundamentals Analysis**: Financial health score (0-10), strengths, and warning red flags.
- **Sentiment Tracker**: Overall public sentiment badges (positive, negative, mixed, neutral) with key trending themes.
- **Live Checklist Timeline**: Server-Sent Events (SSE) progress bar displaying background steps.

---

## 🏗️ System Architecture & Workflow

The backend utilizes **LangGraph** (`StateGraph`) to manage stateful, multi-step agent actions. It is structured to run as many steps as possible via deterministic APIs and combine all cognitive reasoning into a **single, final LLM call** to reduce latency and prevent API rate-limiting.

```mermaid
graph TD
    Start([START]) --> Resolve[1. resolveCompanyNode]
    
    subgraph Parallel API Fetching
        Resolve --> FetchFin[2. fetchFinancialsNode]
        Resolve --> FetchNews[3. fetchNewsNode]
    end
    
    FetchFin --> PassFin[4. analyzeFinancialsNode - Pass-Through]
    FetchNews --> PassSent[5. analyzeSentimentNode - Pass-Through]
    
    PassFin --> Synth[6. synthesizeDecisionNode]
    PassSent --> Synth
    
    Synth --> End([END])
    
    classDef api fill:#1e293b,stroke:#4f46e5,stroke-width:2px,color:#f8fafc;
    classDef llm fill:#312e81,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef flow fill:#0f172a,stroke:#334155,stroke-width:1px,color:#94a3b8;
    
    class Resolve,FetchFin,FetchNews api;
    class Synth llm;
    class PassFin,PassSent flow;
```

### 1. Company Ticker Resolution (`resolveCompanyNode`)
- Resolves search queries (e.g. `"Tesla"`) to public stock symbols.
- Hits **Finnhub's Symbol Lookup API** first, falling back to **FMP's stable search endpoints** (symbol & name searches) if unconfigured or restricted.
- **US Market Prioritization**: Filters search results to prioritize standard tickers (symbols without dots, like `TSLA` instead of `TSLA.NE`), preventing subscription restriction issues (`402/403` errors) common with international exchanges.

### 2. Parallel API Data Fetching (`fetchFinancialsNode` & `fetchNewsNode`)
- Runs in parallel using `Promise.all`:
  - **Financial Fundamentals**: Fetches real-time company profile and key valuation metrics (current price, market cap, return on assets, return on equity, etc.) from **FMP (Financial Modeling Prep) stable APIs**.
  - **Market News**: Searches for the latest news articles using **Tavily Search API** with a dedicated `"news"` filter to retrieve publication dates, headlines, and content snippets.

### 3. Pass-Through Nodes (`analyzeFinancialsNode` & `analyzeSentimentNode`)
- Set up as deterministic pass-through nodes. They forward the raw data to state variables without initiating separate LLM calls, saving API costs and reducing request concurrency.

### 4. Consolidated Analysis & Decision Synthesis (`synthesizeDecisionNode`)
- Performs the **single LLM call** for the entire workflow.
- Receives the raw financials, news snippets, and metadata.
- Uses `ChatOpenAI` with `.withStructuredOutput(FullAnalysisSchema)` to analyze fundamentals, score financial health, determine news sentiment themes, choose a final recommendation (`INVEST`, `PASS`, or `WATCH`), and outline key factors with detailed reasoning.

---

## ⚡ Key Optimizations & Trade-offs

### What We Chose and Why:
* **Single LLM Call instead of Multiple Agents**: We consolidated the financial analysis, news analysis, and decision synthesis into a single final LLM prompt. This saves **70% of latency** (reducing loads from 12+ seconds to ~3 seconds) and completely prevents Gemini rate-limiting (`429`) errors.
* **Finnhub Ticker Lookup & US Filtering**: Replaced LLM ticker matching with direct Finnhub/FMP API resolution. We filtered out dot-suffixed tickers (e.g. `TSLA.NE`) to prioritize US mainboards, preventing FMP subscription restriction errors.
* **In-Memory SSE Replay Cache**: Implemented a 15-minute TTL cache. For cache hits, the server replays the SSE chunks with an 80ms interval. This lets the frontend progress checklist animate smoothly before instantly showing the cached dashboard in under 500ms.
* **Simplifying Zod Schema Constraints**: Removed Zod `.refine()` regex checks on textual descriptions, enforcing length constraints in the prompt instead. This avoids validation loops and unnecessary retries.

### What We Left Out:
* **Database Caching**: Left out Redis/MongoDB database caching in favor of in-memory caching to minimize setup dependencies for local developers.
* **Recursive Charting**: Excluded deep historical charting (e.g., 5-year candle graphs) to focus the scope on fundamental indicators and textual analysis.

---

## 📂 Project Structure

```
AI Investment/
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   │   ├── nodes/
│   │   │   │   ├── resolveCompany.js      # Finnhub/FMP ticker resolution
│   │   │   │   ├── fetchFinancials.js     # FMP profile & metrics fetch
│   │   │   │   ├── fetchNews.js           # Tavily news fetch
│   │   │   │   ├── analyzeFinancials.js   # Pass-through node
│   │   │   │   ├── analyzeSentiment.js    # Pass-through node
│   │   │   │   └── synthesizeDecision.js  # Unified LLM call
│   │   │   ├── graph.js                   # LangGraph StateGraph definition
│   │   │   ├── schemas.js                 # Zod Output Schemas (FullAnalysisSchema)
│   │   │   └── model.js                   # LLM client constructor (Gemini/OpenAI router)
│   │   ├── services/
│   │   │   ├── financialData.js           # FMP stable client
│   │   │   ├── newsData.js                # Tavily search client
│   │   │   ├── tickerLookup.js            # Finnhub lookup client
│   │   │   └── cache.js                   # Report cache manager
│   │   ├── routes/
│   │   │   └── research.js                # Express router (POST / & GET /stream)
│   │   └── index.js                       # Server entrypoint & middlewares
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── SearchBar.jsx              # Search input & preset example chips
    │   │   ├── LoadingSteps.jsx           # SSE subscriber & timeline progress indicator
    │   │   ├── ResearchSkeleton.jsx       # Shimmer loading skeleton preview
    │   │   ├── VerdictCard.jsx            # Dynamic rating & confidence gauge card
    │   │   ├── KeyFactorsList.jsx         # Clean numbered item list
    │   │   ├── FinancialSummary.jsx       # Health bar gauge, strengths, & warnings
    │   │   └── SentimentSummary.jsx       # Sentiment badge & tag themes card
    │   ├── App.jsx                        # Layout composer & state controller
    │   └── index.css                      # Tailwind import & animation configurations
    ├── index.html
    └── package.json
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000

# LLM Provider Key (OpenAI "sk-..." or Gemini "AQ...")
OPENAI_API_KEY=AQ.Ab8RN6Kj...

# Financial Modeling Prep Key
FMP_API_KEY=dyu1cUfa...

# Tavily News Search Key
TAVILY_API_KEY=tvly-dev-Dnv...

# Finnhub Symbol Lookup Key (Optional, falls back to FMP if empty)
FINNHUB_API_KEY=your_finnhub_key
```

---

## 🚀 How to Run

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📊 Example Runs

### Example 1: Tesla, Inc. (`TSLA`)
- **Symbol**: `TSLA` (NASDAQ Global Select)
- **Overview**: Tesla, Inc. designs, develops, manufactures, and sells fully electric vehicles, energy generation systems, and storage products worldwide.
- **Business Model**: Generates revenue primarily by selling electric cars, regulatory credits, energy storage batteries (Powerwall, Megapack), solar panels, and subscriptions for FSD.
- **Financial Health Score**: `8/10`
- **Sentiment**: `Positive` (News highlights FSD progress and international deliveries).
- **Verdict**: `INVEST` (85% Confidence)
- **Key Factors**: High return on capital, market dominance in EVs, strong cash reserves.

### Example 2: Apple Inc. (`AAPL`)
- **Symbol**: `AAPL` (NASDAQ)
- **Overview**: Apple Inc. designs, manufactures, and markets consumer smartphones, tablets, computers, and wearable accessories.
- **Business Model**: Sells premium consumer hardware (iPhone, Mac, iPad, Watch) and high-margin services subscriptions (iCloud, Apple Music, Apple Pay, App Store cut).
- **Financial Health Score**: `9/10`
- **Sentiment**: `Mixed` (Concerns over hardware stagnation balanced by growth in AI services).
- **Verdict**: `INVEST` (90% Confidence)
- **Key Factors**: Extraordinary ROE/ROA, massive services moat, stable consumer ecosystem.

---

## 🔮 Future Improvements
1. **Dynamic Historical Charting**: Integrate lightweight trading charts (e.g., TradingView charts or Chart.js) using historical stock quote candles.
2. **Key Competitor Comparison**: Fetch competitor financials in parallel and present a comparison table (e.g., compare `TSLA`'s valuation multiples directly to `BYD` and `F`).
3. **Web Sandbox Search Fallback**: Implement search fallbacks if Tavily API hits limits, allowing web scraping of Yahoo Finance or Google News pages.
