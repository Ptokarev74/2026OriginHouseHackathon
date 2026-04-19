"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  FileSearch,
  FileText,
  PackageCheck,
  ShieldAlert,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { DashboardProvider, useDashboard } from "@/components/dashboard/DashboardContext";
import { ReasoningTrace } from "@/components/dashboard/ReasoningTrace";
import { classNames } from "@/components/dashboard/ui";
import { dashboardCopy } from "@/lib/i18n/dashboard";

function Sidebar() {
  const pathname = usePathname();
  const { status } = useDashboard();
  const { language } = useLanguage();
  const copy = dashboardCopy[language];
  const navSteps = [
    { name: copy.nav.intake, href: "/dashboard/intake", icon: FileText },
    { name: copy.nav.analysis, href: "/dashboard/coverage-analysis", icon: FileSearch },
    { name: copy.nav.rescuePath, href: "/dashboard/rescue-path", icon: ShieldAlert },
    { name: copy.nav.packetPrep, href: "/dashboard/action-execution", icon: PackageCheck },
    { name: copy.nav.finalStatus, href: "/dashboard/final-status", icon: CheckCircle2 },
  ];

  return (
    <nav
      aria-label={copy.nav.primary}
      className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex"
    >
      <div className="border-b border-slate-800 p-6">
        <div className="mb-2 flex items-center gap-2 text-emerald-300">
          <ShieldAlert className="h-6 w-6" />
          <h1 className="text-lg font-bold text-white">Notice-to-Rescue</h1>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {copy.appSubtitle}
        </p>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navSteps.map((step, index) => {
          const isActive = pathname === step.href;
          const Icon = step.icon;

          return (
            <Link
              className={classNames(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-400/10 text-emerald-200"
                  : "hover:bg-slate-800 hover:text-white",
              )}
              href={step.href}
              key={step.name}
            >
              <Icon
                className={classNames(
                  "h-5 w-5 shrink-0",
                  isActive
                    ? "text-emerald-300"
                    : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              <span className="truncate">
                {index + 1}. {step.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3">
          <LanguageSwitcher compact />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{copy.shell.agentStatus}</span>
          <span
            className={classNames(
              "font-semibold",
              status === "idle"
                ? "text-slate-400"
                : status === "running"
                  ? "animate-pulse text-sky-400"
                  : "text-emerald-400",
            )}
          >
            {copy.status[status]}
          </span>
        </div>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen overflow-hidden bg-[#f6f8fb] font-sans text-slate-950">
        <Sidebar />

        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4 text-white lg:hidden">
            <div className="flex items-center gap-2 text-emerald-300">
              <Activity className="h-5 w-5" />
              <span className="font-bold">Notice-to-Rescue</span>
            </div>
            <LanguageSwitcher compact />
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 2xl:p-10">
            <div className="mx-auto grid min-h-full w-full max-w-[1500px] gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] 2xl:max-w-[1580px] 2xl:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="min-w-0 pb-16 sm:pb-20">{children}</div>

              <aside className="h-56 w-full pb-10 sm:h-64 xl:sticky xl:top-0 xl:h-[calc(100vh-4rem)] xl:pb-0 2xl:h-[calc(100vh-5rem)]">
                <ReasoningTrace />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
