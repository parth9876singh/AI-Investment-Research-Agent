import React from "react";

/**
 * FinancialSummary Component
 * 
 * Displays the financial health score as a visual gauge, along with
 * a textual summary, strengths, and red flags.
 * 
 * @param {object} financialAnalysis - Financial analysis object: { healthScore, summary, strengths, redFlags }.
 */
export default function FinancialSummary({ financialAnalysis }) {
  if (!financialAnalysis) return null;

  const { healthScore, summary, strengths = [], redFlags = [] } = financialAnalysis;

  // Determine health color based on score
  const getScoreColor = (score) => {
    if (score >= 7.5) return "bg-emerald-500 text-emerald-400 border-emerald-500/20";
    if (score >= 4.5) return "bg-amber-500 text-amber-400 border-amber-500/20";
    return "bg-rose-500 text-rose-400 border-rose-500/20";
  };

  const getScoreBarGradient = (score) => {
    if (score >= 7.5) return "from-emerald-500 to-teal-400";
    if (score >= 4.5) return "from-amber-500 to-orange-400";
    return "from-rose-600 to-red-400";
  };

  const colorClass = getScoreColor(healthScore);
  const gradientClass = getScoreBarGradient(healthScore);

  return (
    <div className="w-full bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all duration-300">
      {/* Title & Health Score */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v16.5M12 3v16.5m8.25-16.5v16.5M2.25 18H21.75" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Financial Analysis</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Health Score</span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-opacity-10 border ${colorClass.split(" ")[1]} ${colorClass.split(" ")[2]}`}>
            {healthScore}/10
          </span>
        </div>
      </div>

      {/* Visual Health Gauge Bar */}
      <div className="w-full h-2.5 bg-slate-950/60 rounded-full mb-6 overflow-hidden border border-slate-900">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
          style={{ width: `${healthScore * 10}%` }}
        />
      </div>

      {/* Financial Executive Summary */}
      <div className="mb-6">
        <p className="text-sm leading-relaxed text-slate-200 font-normal">
          {summary}
        </p>
      </div>

      {/* Grid of Strengths & Red Flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800/80">
        {/* Strengths (Pros) */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4.13-5.69Z" clipRule="evenodd" />
            </svg>
            Key Strengths
          </h4>
          {strengths.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No notable strengths identified.</p>
          ) : (
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-200 font-normal">
                  <span className="text-emerald-400 shrink-0 mt-0.5 font-bold">✓</span>
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Red Flags (Cons) */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            Red Flags
          </h4>
          {redFlags.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No major red flags identified.</p>
          ) : (
            <ul className="space-y-2">
              {redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-200 font-normal">
                  <span className="text-rose-400 shrink-0 mt-0.5 font-bold">⚠</span>
                  <span className="leading-relaxed">{flag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
