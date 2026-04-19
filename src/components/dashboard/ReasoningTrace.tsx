"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";

const TRACES: Record<string, string[]> = {
  "/dashboard/intake": [
    "Loaded local sample notice packets and current intake mode.",
    "Preparing notice text, case status letter, and verification documents for parsing.",
    "No real documents leave the browser in this prototype.",
  ],
  "/dashboard/coverage-analysis": [
    "Extracting notice type, response date, program context, and risk language.",
    "Classifying missing verification and deadline signals.",
    "Preparing editable fields before the rescue agent runs.",
  ],
  "/dashboard/rescue-path": [
    "Reading unstructured notice text with deterministic local rules.",
    "Identifying the exact blocker putting coverage at risk.",
    "Choosing document rescue, deadline rescue, renewal completion, or escalation.",
  ],
  "/dashboard/action-execution": [
    "Generating plain-language explanation and missing-requirements checklist.",
    "Building simulated submission and escalation packets.",
    "Checking whether documents are present or human review is needed.",
  ],
  "/dashboard/final-status": [
    "Aggregating rescue artifacts into a print-ready case summary.",
    "Setting final case status from readiness and escalation checks.",
    "Preparing patient next steps for follow-up outside this prototype.",
  ],
};

export function ReasoningTrace() {
  const pathname = usePathname();
  const traces = TRACES[pathname] || ["Awaiting active notice context..."];

  return (
    <div className="h-full overflow-y-auto rounded-lg border border-slate-800/90 bg-slate-950/95 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-300">
        <BrainCircuit className="h-5 w-5" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">
          Agent Reasoning Trace
        </h3>
      </div>
      <div className="space-y-3.5 font-mono text-xs text-slate-300">
        {traces.map((trace, index) => (
          <div className="flex items-start gap-3" key={trace}>
            <span className="mt-0.5 text-slate-600">
              [{String(index + 1).padStart(2, "0")}]
            </span>
            <span className="leading-relaxed">{trace}</span>
          </div>
        ))}
        <div className="mt-6 border-t border-slate-800/50 pt-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <span className="animate-pulse">&gt;</span>
            <span className="animate-pulse">Awaiting next workflow step...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
