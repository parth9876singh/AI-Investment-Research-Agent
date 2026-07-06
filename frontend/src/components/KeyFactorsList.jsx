import React from "react";

/**
 * KeyFactorsList Component
 * 
 * Renders a structured card containing a list of the primary factors 
 * behind the investment decision.
 * 
 * @param {Array<string>} keyFactors - List of key decision factors.
 */
export default function KeyFactorsList({ keyFactors }) {
  if (!keyFactors || !Array.isArray(keyFactors) || keyFactors.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:border-slate-700/60 transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24c-1.133.094-1.976 1.057-1.976 2.192V16.5A2.25 2.25 0 0 0 8.85 18.75h1.683" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-slate-200">Key Decision Factors</h3>
      </div>

      <ul className="space-y-3.5">
        {keyFactors.map((factor, index) => (
          <li 
            key={index} 
            className="flex items-start gap-3 group text-sm text-slate-200 transition-colors duration-200"
          >
            {/* Custom Bullet Indicator */}
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-mono text-indigo-400 font-bold group-hover:border-indigo-500/30 group-hover:bg-indigo-950/20 transition-all duration-300 mt-0.5 shrink-0">
              {index + 1}
            </span>
            <span className="leading-relaxed font-normal">
              {factor}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
