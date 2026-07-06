import React from "react";

/**
 * ResearchSkeleton Component
 * 
 * Renders a visual skeleton placeholder of the results dashboard 
 * using animated shimmer states. Shown to the user during the research phase.
 */
export default function ResearchSkeleton() {
  return (
    <div className="w-full space-y-6 md:space-y-8 animate-fade-in pointer-events-none opacity-60">
      {/* Verdict Card Skeleton */}
      <div className="w-full bg-slate-900/25 border border-slate-850 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/50 animate-shimmer shrink-0" />
            <div className="space-y-2">
              <div className="w-24 h-3 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-40 h-7 bg-slate-800/50 rounded animate-shimmer" />
            </div>
          </div>
          <div className="space-y-2 flex flex-col items-start md:items-end">
            <div className="w-16 h-3 bg-slate-800/50 rounded animate-shimmer" />
            <div className="w-28 h-6 bg-slate-800/50 rounded animate-shimmer" />
          </div>
        </div>
        <div className="border-t border-slate-850 pt-5 space-y-3">
          <div className="w-32 h-4 bg-slate-800/50 rounded animate-shimmer" />
          <div className="w-full h-3 bg-slate-800/50 rounded animate-shimmer" />
          <div className="w-11/12 h-3 bg-slate-800/50 rounded animate-shimmer" />
          <div className="w-4/5 h-3 bg-slate-800/50 rounded animate-shimmer" />
        </div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column: Financials Skeleton */}
        <div className="bg-slate-900/25 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800/50 animate-shimmer" />
              <div className="w-36 h-4 bg-slate-800/50 rounded animate-shimmer" />
            </div>
            <div className="w-20 h-4 bg-slate-800/50 rounded animate-shimmer" />
          </div>
          
          <div className="w-full h-2.5 bg-slate-800/50 rounded-full animate-shimmer" />

          <div className="space-y-2">
            <div className="w-full h-3 bg-slate-800/50 rounded animate-shimmer" />
            <div className="w-11/12 h-3 bg-slate-800/50 rounded animate-shimmer" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-850">
            <div className="space-y-2">
              <div className="w-20 h-3 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-full h-2.5 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-5/6 h-2.5 bg-slate-800/50 rounded animate-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-full h-2.5 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-5/6 h-2.5 bg-slate-800/50 rounded animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Right Column: Sentiment & Factors Skeletons */}
        <div className="space-y-6 md:space-y-8">
          {/* Sentiment Summary Skeleton */}
          <div className="bg-slate-900/25 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800/50 animate-shimmer" />
                <div className="w-44 h-4 bg-slate-800/50 rounded animate-shimmer" />
              </div>
              <div className="w-16 h-5 bg-slate-800/50 rounded-full animate-shimmer" />
            </div>

            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-800/50 rounded animate-shimmer" />
              <div className="w-11/12 h-3 bg-slate-800/50 rounded animate-shimmer" />
            </div>

            <div className="pt-4 border-t border-slate-850 space-y-3">
              <div className="w-28 h-3.5 bg-slate-800/50 rounded animate-shimmer" />
              <div className="flex flex-wrap gap-2">
                <div className="w-16 h-5 bg-slate-800/50 rounded-lg animate-shimmer" />
                <div className="w-20 h-5 bg-slate-800/50 rounded-lg animate-shimmer" />
                <div className="w-14 h-5 bg-slate-800/50 rounded-lg animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Key Factors Skeleton */}
          <div className="bg-slate-900/25 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800/50 animate-shimmer" />
              <div className="w-36 h-4 bg-slate-800/50 rounded animate-shimmer" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800/50 animate-shimmer shrink-0" />
                <div className="w-full h-3 bg-slate-800/50 rounded animate-shimmer" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800/50 animate-shimmer shrink-0" />
                <div className="w-11/12 h-3 bg-slate-800/50 rounded animate-shimmer" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-800/50 animate-shimmer shrink-0" />
                <div className="w-4/5 h-3 bg-slate-800/50 rounded animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
