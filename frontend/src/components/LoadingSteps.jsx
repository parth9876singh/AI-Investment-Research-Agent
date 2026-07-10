import React, { useEffect, useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STEPS = [
  { id: "resolveCompany", label: "Resolving company" },
  { id: "fetchFinancials", label: "Fetching financials" },
  { id: "fetchNews", label: "Fetching news" },
  { id: "synthesizeDecision", label: "Making decision" },
];

/**
 * LoadingSteps Component
 * 
 * Subscribes to the backend SSE stream, manages the checklist progress,
 * and renders a beautiful timeline of the agent's workflow execution.
 * 
 * @param {string} companyName - Target company name.
 * @param {function} onComplete - Callback triggered when the decision is synthesized.
 * @param {function} onError - Optional callback for error tracking.
 */
export default function LoadingSteps({ companyName, onComplete, onError }) {
  const [stepStatuses, setStepStatuses] = useState({
    resolveCompany: "running", // First step starts running immediately
    fetchFinancials: "idle",
    fetchNews: "idle",
    synthesizeDecision: "idle",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const accumulatedState = useRef({});
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!companyName) return;

    // Reset states
    setErrorMsg(null);
    accumulatedState.current = { companyName };
    setStepStatuses({
      resolveCompany: "running",
      fetchFinancials: "idle",
      fetchNews: "idle",
      synthesizeDecision: "idle",
    });

    const streamUrl = `${API_BASE_URL}/api/research/stream?companyName=${encodeURIComponent(companyName)}`;
    console.log(`[LoadingSteps] Connecting to SSE: ${streamUrl}`);

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        if (event.data === "[DONE]") {
          console.log("[LoadingSteps] Stream completed ([DONE])");
          es.close();
          if (onComplete) {
            onComplete(accumulatedState.current);
          }
          return;
        }

        const chunk = JSON.parse(event.data);
        console.log("[LoadingSteps] Received chunk:", chunk);

        // A chunk is an object with the node name as a key: e.g. { "resolveCompany": { "ticker": "TSLA" } }
        const nodeNames = Object.keys(chunk);
        if (nodeNames.length === 0) return;

        nodeNames.forEach((nodeName) => {
          const payload = chunk[nodeName];
          // Accumulate variables into state
          accumulatedState.current = {
            ...accumulatedState.current,
            ...payload,
          };

          // Mark node step as completed
          setStepStatuses((prev) => {
            const next = { ...prev };
            next[nodeName] = "completed";

            // Determine subsequent active steps
            if (nodeName === "resolveCompany") {
              next.fetchFinancials = "running";
              next.fetchNews = "running";
            } else if (nodeName === "fetchFinancials" || nodeName === "fetchNews") {
              // Wait until BOTH fetchFinancials and fetchNews are completed before starting synthesizeDecision
              const financialsDone = nodeName === "fetchFinancials" ? true : prev.fetchFinancials === "completed";
              const newsDone = nodeName === "fetchNews" ? true : prev.fetchNews === "completed";
              if (financialsDone && newsDone) {
                next.synthesizeDecision = "running";
              }
            }

            return next;
          });
        });
      } catch (err) {
        console.error("[LoadingSteps] Error parsing SSE message:", err);
      }
    };

    es.onerror = (err) => {
      console.error("[LoadingSteps] SSE Connection error:", err);
      setErrorMsg("Failed to connect or stream was interrupted. Please try again.");
      es.close();
      if (onError) {
        onError(err);
      }
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("[LoadingSteps] SSE connection cleaned up");
      }
    };
  }, [companyName]);

  return (
    <div className="w-full max-w-lg mx-auto glass-card p-6 md:p-8">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold text-slate-100">AI Analyst Agent</h3>
        <p className="text-xs text-slate-400 mt-1">
          Running structured multi-agent research workflow for <span className="text-indigo-400 font-medium">"{companyName}"</span>
        </p>
      </div>

      {errorMsg ? (
        <div className="p-4 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <div>
            <p className="font-semibold">Workflow Error</p>
            <p className="text-slate-400 mt-0.5">{errorMsg}</p>
          </div>
        </div>
      ) : null}

      {/* Checklist Timeline */}
      <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        {STEPS.map((step) => {
          const status = stepStatuses[step.id];

          return (
            <div key={step.id} className="relative flex items-center group">
              {/* Timeline Indicator Badge */}
              <div
                className={`absolute -left-8 w-6.5 h-6.5 rounded-full flex items-center justify-center border text-xs font-semibold transition-all duration-300 ${
                  status === "completed"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] scale-110"
                    : status === "running"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)] scale-105 animate-pulse"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {status === "completed" ? (
                  // Checkmark Icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : status === "running" ? (
                  // Pulse dot
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                ) : (
                  // Idle small dot
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>

              {/* Text Label */}
              <div className="flex-1 pl-3">
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    status === "completed"
                      ? "text-slate-300"
                      : status === "running"
                      ? "text-indigo-400 font-semibold"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
                
                {status === "running" ? (
                  <span className="inline-flex ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 animate-pulse">
                    Active
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
