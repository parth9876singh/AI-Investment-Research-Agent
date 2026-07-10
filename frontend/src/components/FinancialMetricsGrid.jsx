import React from "react";

/**
 * Helper to format large financial values into human-readable strings (e.g. Billions, Trillions)
 */
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  const absNum = Math.abs(num);
  if (absNum >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (absNum >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (absNum >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

/**
 * Helper to format percentages (converts fractions to percentage if < 1)
 */
function formatPercent(val) {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  const percent = Math.abs(val) < 1 ? val * 100 : val;
  return `${percent.toFixed(2)}%`;
}

/**
 * FinancialMetricsGrid Component
 * Renders a stock dashboard grid displaying key numbers and valuation metrics.
 */
export default function FinancialMetricsGrid({ financialData }) {
  if (!financialData) return null;

  const { profile = {}, keyMetrics = {}, symbol } = financialData;

  const price = profile?.price;
  const changes = profile?.changes !== undefined ? profile.changes : profile?.change;
  const changePercentage = profile?.changePercentage;
  const marketCap = profile?.mktCap || profile?.marketCap;
  const beta = profile?.beta;
  const range = profile?.range;
  const exchange = profile?.exchange;
  const industry = profile?.industry;

  const roe = keyMetrics?.returnOnEquity;
  const roa = keyMetrics?.returnOnAssets;
  const debtToEquity = keyMetrics?.debtToEquity !== undefined ? keyMetrics.debtToEquity : keyMetrics?.netDebtToEBITDA;
  
  const peRatio = keyMetrics?.peRatio;
  const evToSales = keyMetrics?.evToSales || keyMetrics?.priceToSalesRatio;
  const pbRatio = keyMetrics?.pbRatio || keyMetrics?.evToEBITDA;

  const isPositiveChange = changes >= 0;
  const changeColor = isPositiveChange ? "text-emerald-400" : "text-rose-400";
  const changeSign = isPositiveChange ? "+" : "";

  return (
    <div className="w-full glass-card p-6 md:p-8 animate-fade-in-up">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400">Key Metrics</span>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Stock Profile & Valuation Indicators</h3>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {symbol || "N/A"}
          </span>
        </div>
      </div>

      {/* Grid of Key Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Metric 1: Stock Price */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Share Price</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {price ? `$${price.toFixed(2)}` : "N/A"}
            </div>
            {changes !== undefined && (
              <div className={`text-[11px] font-semibold mt-0.5 ${changeColor}`}>
                {changeSign}{changes.toFixed(2)} ({changePercentage ? `${changePercentage.toFixed(2)}%` : changeSign + formatPercent(changes / price)})
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Market Cap */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Market Cap</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {formatNumber(marketCap)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {exchange || "Public Exchange"}
            </div>
          </div>
        </div>

        {/* Metric 3: Return on Equity (ROE) */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Return on Equity (ROE)</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {formatPercent(roe)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Profits relative to equity
            </div>
          </div>
        </div>

        {/* Metric 4: Return on Assets (ROA) */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Return on Assets (ROA)</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {formatPercent(roa)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Asset utilization efficiency
            </div>
          </div>
        </div>

        {/* Metric 5: Volatility (Beta) */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Volatility (Beta)</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {beta ? beta.toFixed(2) : "N/A"}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {beta > 1 ? "Higher Volatility" : beta < 1 ? "Lower Volatility" : "Stable market beta"}
            </div>
          </div>
        </div>

        {/* Metric 6: Valuation Indicators */}
        <div className="metric-pill">
          <span className="text-[10px] tracking-wider uppercase font-bold text-slate-400">Valuation Multiple</span>
          <div className="mt-2.5">
            <div className="text-lg md:text-xl font-extrabold text-slate-100">
              {peRatio ? `P/E: ${peRatio.toFixed(1)}x` : evToSales ? `EV/S: ${evToSales.toFixed(1)}x` : "N/A"}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">
              {pbRatio ? `EV/EBITDA: ${pbRatio.toFixed(1)}x` : `D/E: ${debtToEquity ? debtToEquity.toFixed(2) : "N/A"}`}
            </div>
          </div>
        </div>

      </div>

      {/* Profile Details Footer */}
      {range && industry && (
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div>
            <span className="font-bold text-slate-400 mr-1.5">52-Week Trading Range:</span>
            <span className="font-mono text-slate-200">{range}</span>
          </div>
          <div className="md:text-right">
            <span className="font-bold text-slate-400 mr-1.5">Industry Listing:</span>
            <span className="text-slate-200">{industry}</span>
          </div>
        </div>
      )}
    </div>
  );
}
