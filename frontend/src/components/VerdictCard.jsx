import React from "react";

/**
 * VerdictCard Component
 * 
 * Shows the final investment decision, confidence score, and reasoning
 * with dynamic theme coloring depending on the verdict.
 * 
 * @param {object} decision - The decision object: { decision, confidence, reasoning }.
 */
export default function VerdictCard({ decision }) {
  if (!decision) return null;

  const { decision: verdict, confidence, reasoning } = decision;

  // Configuration map for color schemes and badges
  const config = {
    INVEST: {
      bg: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30",
      text: "text-emerald-400",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      shadow: "shadow-emerald-950/20 hover:shadow-emerald-500/5",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
    },
    PASS: {
      bg: "from-rose-500/10 to-red-500/5 border-rose-500/30",
      text: "text-rose-400",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      shadow: "shadow-rose-950/20 hover:shadow-rose-500/5",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
    WATCH: {
      bg: "from-amber-500/10 to-orange-500/5 border-amber-500/30",
      text: "text-amber-400",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      shadow: "shadow-amber-950/20 hover:shadow-amber-500/5",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
  };

  const currentConfig = config[verdict] || config.WATCH;

  return (
    <div className={`w-full bg-gradient-to-br ${currentConfig.bg} border rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md transition-all duration-300 ${currentConfig.shadow}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`${currentConfig.text} p-2 rounded-xl bg-slate-900/50 border border-slate-800`}>
            {currentConfig.icon}
          </div>
          <div>
            <span className={`text-[10px] tracking-widest uppercase font-bold text-slate-300`}>Final recommendation</span>
            <h2 className={`text-3xl font-extrabold tracking-tight ${currentConfig.text}`}>
              {verdict}
            </h2>
          </div>
        </div>

        {/* Confidence Percentage Badge */}
        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] tracking-widest uppercase font-bold text-slate-300 mb-1">Confidence</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm border ${currentConfig.badgeBg}`}>
            <span className="font-bold">{confidence}%</span>
            <div className="w-12 h-1.5 bg-slate-950/40 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${verdict === "INVEST" ? "bg-emerald-400" : verdict === "PASS" ? "bg-rose-400" : "bg-amber-400"}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-5">
        <h4 className="text-sm font-bold text-slate-200 mb-2.5">Analysis Verdict Reasoning</h4>
        <p className="text-sm md:text-base leading-relaxed text-slate-200 font-normal">
          {reasoning}
        </p>
      </div>
    </div>
  );
}
