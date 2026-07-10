import React, { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import LoadingSteps from "./components/LoadingSteps.jsx";
import VerdictCard from "./components/VerdictCard.jsx";
import KeyFactorsList from "./components/KeyFactorsList.jsx";
import FinancialSummary from "./components/FinancialSummary.jsx";
import SentimentSummary from "./components/SentimentSummary.jsx";
import CompanyOverview from "./components/CompanyOverview.jsx";
import ResearchSkeleton from "./components/ResearchSkeleton.jsx";
import FinancialMetricsGrid from "./components/FinancialMetricsGrid.jsx";
import Lightfall from "./components/Lightfall.jsx";

const EXAMPLE_COMPANIES = [
  { name: "Tesla", ticker: "TSLA" },
  { name: "Apple", ticker: "AAPL" },
  { name: "Nvidia", ticker: "NVDA" },
  { name: "Microsoft", ticker: "MSFT" }
];

export default function App() {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = (name) => {
    setResult(null);
    setError(null);
    setCompanyName(name);
    setIsLoading(true);
  };

  const handleComplete = (finalResult) => {
    setIsLoading(false);
    setResult(finalResult);
    console.log("[App] Workflow complete. Final state:", finalResult);
  };

  const handleError = (err) => {
    setIsLoading(false);
    setError(err?.message || "An unexpected error occurred during research. Please check the backend connectivity.");
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Solid background base layer (matched to user's specified backgroundColor) */}
      <div className="fixed inset-0 -z-20 bg-[#0A29FF]" />

      {/* Interactive WebGL shader backdrop rain */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-100">
        <Lightfall
          colors={['#A6C8FF', '#5227FF', '#FF9FFC']}
          backgroundColor="#0A29FF"
          speed={0.5}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.5}
          opacity={1}
          mouseInteraction={true}
          mouseStrength={0.5}
          mouseRadius={1}
          color1="#A6C8FF"
          color2="#5227FF"
          color3="#FF9FFC"
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col items-center z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM5.045 4.338a.75.75 0 0 1 1.06 0l1.061 1.06A.75.75 0 1 1 6.106 6.46L5.045 5.398a.75.75 0 0 1 0-1.06Zm9.91 0a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.75 10a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 2.75 10Zm12.5 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.045 15.662a.75.75 0 0 1 1.06 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06Zm9.91 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15Z" clipRule="evenodd" />
            </svg>
            Powered by LangGraph & Gemini 2.5
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Investment Research Agent
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Submit a company name to run an autonomous multi-step research workflow analyzing financial fundamentals and market sentiment.
          </p>
        </div>

        {/* Search Bar & Example Chips Container */}
        <div className="w-full mb-10 flex flex-col items-center">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {/* Example Ticker/Company Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-fade-in">
            <span className="text-xs text-slate-500 mr-1 font-medium">Examples:</span>
            {EXAMPLE_COMPANIES.map((company) => (
              <button
                key={company.ticker}
                type="button"
                onClick={() => !isLoading && handleSearch(company.name)}
                disabled={isLoading}
                className="preset-btn"
              >
                {company.name} <span className="text-[10px] text-slate-600 font-mono font-bold">({company.ticker})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-lg mb-10 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-4 animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
            </svg>
            <div>
              <h4 className="font-bold text-base">Error Conducting Research</h4>
              <p className="text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Steps & Skeleton Preview Stack */}
        {isLoading && (
          <div className="w-full space-y-12 animate-fade-in">
            {/* Steps Timeline Card */}
            <LoadingSteps
              companyName={companyName}
              onComplete={handleComplete}
              onError={handleError}
            />
            {/* Shimmering Dashboard Skeleton previewing the output structure */}
            <div className="w-full">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 pl-1 select-none">
                Previewing layout structure...
              </div>
              <ResearchSkeleton />
            </div>
          </div>
        )}

        {/* Results Presentation Dashboard */}
        {result && (
          <div className="w-full space-y-6 md:space-y-8 animate-fade-in-up">
            {/* Warning if the company ticker is NONE */}
            {result.ticker === "NONE" && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span>
                  <strong>Limited financial data:</strong> We could not resolve a public stock exchange ticker for <em>"{companyName}"</em>. Financial analysis was completed based on general historical profiles.
                </span>
              </div>
            )}

            {/* Verdict Card (Full Width) */}
            <VerdictCard decision={result.decision} />

            {/* Company Overview Card (Full Width) */}
            <CompanyOverview 
              companyOverview={result.companyOverview} 
              businessModel={result.businessModel} 
            />

            {/* Financial Metrics Grid (Full Width) */}
            <FinancialMetricsGrid financialData={result.financialData} />

            {/* Grid Layout for Fundamentals, Sentiment, and Key Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column: Financial Summary */}
              <div className="h-full">
                <FinancialSummary financialAnalysis={result.financialAnalysis} />
              </div>

              {/* Right Column: Sentiment Summary & Key Factors stacked */}
              <div className="space-y-6 md:space-y-8">
                <SentimentSummary sentimentAnalysis={result.sentimentAnalysis} />
                <KeyFactorsList keyFactors={result.decision?.keyFactors} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="w-full border-t border-white/10 bg-slate-950/50 backdrop-blur-md py-6 text-center text-xs text-slate-500 px-4 z-10">
        <p className="max-w-2xl mx-auto leading-relaxed">
          © {new Date().getFullYear()} AI Investment Analyst. All rights reserved.
        </p>
        <p className="max-w-2xl mx-auto mt-1 text-slate-600 uppercase tracking-widest font-semibold text-[10px]">
          Disclaimer: This is not financial advice. For educational purposes only.
         </p>
      </footer>
    </div>
  );
}
