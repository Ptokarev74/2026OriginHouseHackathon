"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  Search, 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";
import { DashboardProvider, useDashboard } from "@/components/dashboard/DashboardContext";
import { ReasoningTrace } from "@/components/dashboard/ReasoningTrace";
import { classNames } from "@/components/dashboard/ui";

const NAV_STEPS = [
  { name: "Intake", href: "/dashboard/intake", icon: FileText },
  { name: "Coverage Analysis", href: "/dashboard/coverage-analysis", icon: Search },
  { name: "Provider Matching", href: "/dashboard/provider-matching", icon: Stethoscope },
  { name: "Action Execution", href: "/dashboard/action-execution", icon: Activity },
  { name: "Final Status", href: "/dashboard/final-status", icon: CheckCircle2 },
];

function Sidebar() {
  const pathname = usePathname();
  const { status } = useDashboard();

  return (
    <nav className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col hidden lg:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-teal-400 mb-2">
          <ShieldAlert className="w-6 h-6" />
          <h1 className="font-bold text-lg text-white">Rescue Ops</h1>
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          Coverage-to-Care
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {NAV_STEPS.map((step, index) => {
          const isActive = pathname === step.href;
          const Icon = step.icon;
          
          return (
            <Link
              key={step.name}
              href={step.href}
              className={classNames(
                "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-teal-500/10 text-teal-300"
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon 
                className={classNames(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"
                )} 
              />
              <span className="truncate">{index + 1}. {step.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>Workflow Status:</span>
          <span className={classNames(
            "font-semibold",
            status === "idle" ? "text-slate-400" :
            status === "running" ? "text-sky-400 animate-pulse" : "text-emerald-400"
          )}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen bg-[#f7f9f6] overflow-hidden text-slate-950 font-sans">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Topbar for mobile */}
          <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2 text-teal-400">
              <ShieldAlert className="w-5 h-5" />
              <span className="font-bold">Rescue Ops</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto flex gap-6 flex-col xl:flex-row h-full">
              {/* Primary Content Left/Center */}
              <div className="flex-1 min-w-0 pb-20">
                {children}
              </div>
              
              {/* Right Agentic Feedback Sidebar (Reasoning Trace) */}
              <div className="w-full xl:w-80 shrink-0 h-64 xl:h-full pb-10 xl:pb-0">
                <ReasoningTrace />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
