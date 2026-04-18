"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";

const TRACES: Record<string, string[]> = {
  "/dashboard/intake": [
    "Identified target demographic from active mode.",
    "Checking local preferences mapping: distance, language, transportation.",
    "No conflicting constraints found in extracted baseline."
  ],
  "/dashboard/coverage-analysis": [
    "Parsing notice snippet against local domain rules.",
    "Detected 'Medicare Coverage' terms with high confidence.",
    "Identified potential access flags within text.",
    "Compiled standard verification questions for identified signals."
  ],
  "/dashboard/provider-matching": [
    "Filtered local demo providers by radius constraint.",
    "Applied specialty matching algorithm.",
    "Ranked candidates by availability, cost signal, and Medicare participation.",
    "Selected top matches for review."
  ],
  "/dashboard/action-execution": [
    "Executing local simulated workflow steps sequentially.",
    "Verifying action dependencies and simulated API latency.",
    "Building sequence payload for final status generation."
  ],
  "/dashboard/final-status": [
    "Aggregating workflow artifacts into print-ready schema.",
    "Summarizing provider outreach steps for human action.",
    "Generating final timeline of requested next steps."
  ]
};

export function ReasoningTrace() {
  const pathname = usePathname();
  const traces = TRACES[pathname] || ["Awaiting active context..."];

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 shadow-inner h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 text-teal-400">
        <BrainCircuit className="w-5 h-5" />
        <h3 className="font-semibold text-xs tracking-wider uppercase">Agentic Reasoning Trace</h3>
      </div>
      <div className="space-y-4 text-xs font-mono text-slate-300">
        {traces.map((trace, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-slate-600 mt-0.5">{`[${String(i + 1).padStart(2, '0')}]`}</span>
            <span className="leading-relaxed">{trace}</span>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t border-slate-800/50">
          <div className="flex gap-3 text-teal-500 items-center">
            <span className="animate-pulse">&gt;</span>
            <span className="animate-pulse">Awaiting manual intervention...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
