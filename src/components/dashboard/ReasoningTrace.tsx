"use client";

import React, { useEffect, useRef } from "react";
import { BrainCircuit } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export function ReasoningTrace() {
  const { language } = useLanguage();
  const copy = getDashboardCopy(language).trace;
  const { traceEvents, status } = useDashboard();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [traceEvents]);

  const displayEvents = traceEvents.length > 0 ? traceEvents : [];

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto rounded-lg border border-slate-800/90 bg-slate-950/95 p-4 shadow-sm scroll-smooth"
    >
      <div className="mb-4 flex flex-col gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-emerald-300">
          <BrainCircuit className="h-5 w-5" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">
            {copy.title}
          </h3>
        </div>
      </div>
      
      <div className="space-y-3.5 font-mono text-xs text-slate-300 flex flex-col">
        {displayEvents.length === 0 && (
          <div className="flex items-start gap-3">
            <span className="leading-relaxed opacity-60">{copy.fallback}</span>
          </div>
        )}
        
        {displayEvents.map((event, index) => (
          <div className="flex items-start gap-3" key={event.id}>
            <span className="mt-0.5 min-w-[28px] text-slate-600">
              [{String(index + 1).padStart(2, "0")}]
            </span>
            <div className="flex flex-col">
              <span className="leading-relaxed font-semibold text-slate-200">{event.stepName}</span>
              <span className="leading-relaxed opacity-80">{event.message}</span>
            </div>
          </div>
        ))}
        
        {status === "running" && (
          <div className="mt-6 border-t border-slate-800/50 pt-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <span className="animate-pulse">&gt;</span>
              <span className="animate-pulse">{copy.awaiting}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
