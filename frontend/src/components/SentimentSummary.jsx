import React from "react";

/**
 * SentimentSummary Component
 * 
 * Displays market/news sentiment analysis, featuring a sentiment badge, 
 * summary text, and theme tags.
 * 
 * @param {object} sentimentAnalysis - Sentiment analysis object: { sentiment, summary, keyThemes }.
 */
export default function SentimentSummary({ sentimentAnalysis }) {
  if (!sentimentAnalysis) return null;

  const { sentiment = "neutral", summary, keyThemes = [] } = sentimentAnalysis;

  // Configuration for sentiment badges
  const sentimentBadges = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    negative: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-750",
    mixed: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  };

  const badgeClass = sentimentBadges[sentiment.toLowerCase()] || sentimentBadges.neutral;

  return (
    <div className="w-full glass-card p-6">
      {/* Header with Title & Badge */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379L12 21l3.12-3.138a48.428 48.428 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Market Sentiment Analysis</h3>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${badgeClass}`}>
          {sentiment}
        </span>
      </div>

      {/* Summary Description */}
      <div className="mb-6">
        <p className="text-sm leading-relaxed text-slate-200 font-normal">
          {summary}
        </p>
      </div>

      {/* Sentiment Themes (Tags) */}
      <div className="pt-4 border-t border-white/10">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">Key News Themes</h4>
        {keyThemes.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No major themes identified.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keyThemes.map((theme, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 text-xs bg-white/5 border border-white/10 text-slate-200 rounded-lg font-normal hover:border-indigo-500/40 hover:text-indigo-300 transition-colors duration-200"
              >
                 {theme}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
