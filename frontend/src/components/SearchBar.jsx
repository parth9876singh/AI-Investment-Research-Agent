import React, { useState } from "react";

/**
 * SearchBar Component
 * 
 * A premium, modern search bar with glassmorphism effects, focus states, 
 * micro-animations, and loading states.
 * 
 * @param {function} onSearch - Callback triggered on search submit.
 * @param {boolean} isLoading - Loading state to disable inputs.
 */
export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && onSearch && !isLoading) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="search-form"
      >
        {/* Search Icon */}
        <div className="pl-4 pr-2 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
          placeholder="Enter a company name (e.g. Tesla, Apple)"
          className="flex-1 w-full bg-transparent border-0 outline-none ring-0 focus:ring-0 px-2 py-3 text-base text-slate-100 placeholder-slate-500 disabled:text-slate-500 disabled:placeholder-slate-600 transition-colors"
        />

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-200 active:scale-[0.98] disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-md hover:shadow-indigo-500/20"
        >
          {isLoading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-4 w-4 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Researching...</span>
            </>
          ) : (
            <span>Research</span>
          )}
        </button>
      </form>
      
      {/* Decorative prompt helper */}
      <p className="mt-3 text-center text-xs text-slate-500 pointer-events-none">
        Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px]">Enter ↵</kbd> or click Research to initiate the agent workflow.
      </p>
    </div>
  );
}
