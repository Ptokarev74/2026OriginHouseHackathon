"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, Badge, classNames } from "@/components/dashboard/ui";
import { ArrowLeft, ArrowRight, PlayCircle, Loader2 } from "lucide-react";

export default function ProviderMatchingPage() {
  const router = useRouter();
  const { reviewCase, result, status, runWorkflow, triggerNextStep } = useDashboard();

  useEffect(() => {
    if (!reviewCase) {
      router.push("/dashboard/intake");
    }
  }, [reviewCase, router]);

  async function handleNextStep() {
    await triggerNextStep("provider-matching-completed", { providers: result?.rankedProviders });
    router.push("/dashboard/action-execution");
  }

  if (!reviewCase) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-950">Provider Matching</h1>
        <p className="text-slate-600 mt-2">
          Run our automated algorithm to rank local provider options by specialty, availability, and Medicare coverage fit.
        </p>
      </div>

      {!result && status !== "running" && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-lg border border-slate-200 shadow-inner">
          <PlayCircle className="w-16 h-16 text-teal-400 mb-6" />
          <h2 className="text-xl font-bold text-slate-950 mb-2">Ready for Matching</h2>
          <p className="text-slate-600 max-w-lg text-center mb-8">
            Click below to simulate our ranking algorithm against local fictional demo data. It weighs distance, language, and specialty match.
          </p>
          <button
            onClick={runWorkflow}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-teal-500 hover:-translate-y-0.5"
          >
            Run Matching Algorithm
          </button>
        </div>
      )}

      {status === "running" && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-slate-200">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-slate-900">Crunching local data...</h2>
          <p className="text-slate-500 text-sm mt-2">Evaluating distance, coverage overlap, and availability.</p>
        </div>
      )}

      {result && status === "complete" && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <Section eyebrow="Results" title="Providers that may fit your coverage">
            {result.rankedProviders.length === 0 ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                No local provider options matched the current specialty, Medicare fit, distance, language, and new-patient filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
                      <th className="border-b border-slate-200 px-4 py-3 rounded-tl-lg">Provider</th>
                      <th className="border-b border-slate-200 px-4 py-3">Score</th>
                      <th className="border-b border-slate-200 px-4 py-3">Access</th>
                      <th className="border-b border-slate-200 px-4 py-3">Languages</th>
                      <th className="border-b border-slate-200 px-4 py-3 rounded-tr-lg">Why ranked here</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rankedProviders.map((provider, index) => (
                      <tr className={classNames("align-top transition-colors hover:bg-slate-50")} key={provider.id}>
                        <td className="border-b border-slate-100 px-4 py-5">
                          <div className="font-semibold text-slate-950 text-base">{provider.name}</div>
                          <div className="text-slate-500 mt-1">{provider.specialty}</div>
                          {index === 0 && (
                            <div className="mt-3">
                              <Badge tone="good">Top local option</Badge>
                            </div>
                          )}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-5">
                          <div className="text-3xl font-bold tracking-tight text-teal-700">{provider.score}</div>
                          <div className="text-slate-400 text-xs font-semibold mt-1">/ 100</div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-5 text-slate-700 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {provider.distanceMiles.toFixed(1)} miles
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {provider.availabilityDays} day wait
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {provider.estimatedCostLevel} cost signal
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            {provider.telehealth ? "Telehealth listed" : "In person"}
                          </div>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-5 text-slate-700">
                          {provider.languages.join(", ")}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-5">
                          <ul className="space-y-2 text-slate-600 list-disc ml-4">
                            {provider.explanation.map((item) => (
                              <li key={item} className="pl-1">{item}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard/coverage-analysis")}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Recalibrate
            </button>

            <button
              onClick={handleNextStep}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-500"
            >
              Execute Action Plan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
