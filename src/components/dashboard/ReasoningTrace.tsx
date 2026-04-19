"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

export function ReasoningTrace() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language).trace;
  const traces =
    copy.items[pathname as keyof typeof copy.items] || [copy.fallback];

  return (
    <div className="h-full overflow-y-auto rounded-lg border border-slate-800/90 bg-slate-950/95 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-300">
        <BrainCircuit className="h-5 w-5" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">
          {copy.title}
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
            <span className="animate-pulse">{copy.awaiting}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
