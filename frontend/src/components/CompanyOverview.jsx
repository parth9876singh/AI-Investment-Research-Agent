import React from "react";

/**
 * CompanyOverview Component
 * 
 * Renders a visual card containing the company's description overview
 * and its business model/revenue streams with clear, high-contrast typography.
 * 
 * @param {string} companyOverview - Text describing the company.
 * @param {string} businessModel - Text describing the business model.
 */
export default function CompanyOverview({ companyOverview, businessModel }) {
  if (!companyOverview && !businessModel) return null;

  return (
    <div className="w-full bg-slate-950/40 border border-white/10 backdrop-blur-2xl rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:border-white/20 transition-all duration-300 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Company Overview Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3h13.5m-13.5 0v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21h1.5m2.25 0H15m3.75 0h.008v.008H18.75V21Zm-13.5 0h.008v.008H5.25V21Z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Company Overview</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-200 font-normal">
            {companyOverview || "Company overview details are currently unavailable."}
          </p>
        </div>

        {/* Business Model Section */}
        <div className="space-y-3 md:border-l md:border-slate-800/60 md:pl-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Business Model & Revenue Streams</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-200 font-normal">
            {businessModel || "Business model analysis is currently unavailable."}
          </p>
        </div>

      </div>
    </div>
  );
}
