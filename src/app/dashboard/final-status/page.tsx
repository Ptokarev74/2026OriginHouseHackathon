"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, Badge } from "@/components/dashboard/ui";
import { ArrowLeft, Printer, RefreshCw } from "lucide-react";

export default function FinalStatusPage() {
  const router = useRouter();
  const { result, status, triggerNextStep, setMode } = useDashboard();

  useEffect(() => {
    if (!result && status !== "running" && status !== "complete") {
      router.push("/dashboard/action-execution");
    }
  }, [result, status, router]);

  async function handleNextStep() {
    await triggerNextStep("final-status-completed", { finalStatus: result?.finalStatus });
    // Keep it here or restart
    setMode("sample");
    router.push("/dashboard/intake");
  }

  if (!result) return null;

  const topProviders = result.rankedProviders.slice(0, 3);
  const provider = result.selectedProvider;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Final Status</h1>
          <p className="text-slate-600 mt-2">
            Review the final suggested next steps and a print-ready summary of your care continuity plan.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Printer className="w-5 h-5" />
          Print Summary
        </button>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Suggested next steps
            </div>
            <h2 className="mt-1 text-3xl font-bold text-emerald-950">
              {result.finalStatus === "next_steps_ready"
                ? "Summary ready for verification"
                : "Manual review recommended"}
            </h2>
          </div>
          <Badge tone={result.finalStatus === "next_steps_ready" ? "good" : "warn"}>
            {result.finalStatus.replaceAll("_", " ").toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-slate-800 leading-relaxed text-lg">{result.outcomeSummary}</p>
        
        {provider && (
          <div className="mt-5 rounded-lg bg-white/90 border border-emerald-100 p-5 shadow-sm">
            <div className="font-bold text-slate-950 text-lg">
              Top Provider Option: <span className="text-teal-700">{provider.name}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Ranking is based on local demo data evaluating specialty ({provider.specialty}), distance ({provider.distanceMiles.toFixed(1)}mi) and availability. 
              Always confirm plan participation, new-patient status, costs, and availability directly with the provider office before booking.
            </p>
          </div>
        )}
        
        <div className="mt-6">
          <h3 className="font-bold text-emerald-950 mb-3 text-lg">Next steps to take</h3>
          <ul className="space-y-3">
            {result.patientInstructions.map((instruction, idx) => (
              <li className="flex gap-3 items-start bg-white/80 p-4 rounded-lg border border-emerald-100/50 shadow-sm" key={idx}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-slate-800 leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Section eyebrow="Reference File" title="Printable Summary View" className="print-summary">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Medicare paperwork review</h2>
          </div>
          <Badge tone="neutral">Informational only</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
            <h3 className="font-bold text-slate-950 border-b border-slate-200 pb-2 mb-3">Document summary</h3>
            <p className="text-sm leading-6 text-slate-700">
              {result.parsedCase.documentSummary}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
            <h3 className="font-bold text-slate-950 border-b border-slate-200 pb-2 mb-3">Reviewed details</h3>
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between"><dt className="font-semibold text-slate-500">Coverage:</dt><dd className="text-right font-medium">{result.parsedCase.medicareCoverageType}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold text-slate-500">Date:</dt><dd className="text-right font-medium">{result.parsedCase.deadlineDate ?? "Verify manually"}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold text-slate-500">Specialty:</dt><dd className="text-right font-medium">{result.parsedCase.specialtyNeeded}</dd></div>
              <div className="flex justify-between"><dt className="font-semibold text-slate-500">ZIP:</dt><dd className="text-right font-medium">{result.parsedCase.locationZip}</dd></div>
            </dl>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="font-bold text-slate-950 mb-3">Possible issue flags</h3>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-4 marker:text-slate-300">
              {result.coverageAssessment.findings.slice(0, 5).map((finding) => (
                <li key={finding}>{finding}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="font-bold text-slate-950 mb-3">Top provider options</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              {topProviders.length > 0 ? (
                topProviders.map((prov) => (
                  <li key={prov.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="font-semibold text-slate-900">{prov.name}</div>
                    <div className="text-xs text-slate-500 mt-1">Score: {prov.score}/100 • {prov.distanceMiles.toFixed(1)} mi</div>
                  </li>
                ))
              ) : (
                <li className="text-slate-500 italic">No local provider match in the demo dataset.</li>
              )}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="font-bold text-slate-950 mb-3">Verification Questions</h3>
            <ul className="space-y-2 text-sm text-slate-700 list-disc pl-4 marker:text-slate-300">
              {result.coverageAssessment.verificationQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="rounded-lg bg-amber-50 border border-amber-200/50 p-4 text-sm leading-relaxed text-amber-950 flex gap-3 items-start">
          <span className="text-amber-500 mt-0.5">ℹ️</span>
          This summary is from a frontend-only prototype. It does not determine Medicare eligibility, benefits, plan status, provider acceptance, or appointment availability. Confirm details directly before taking action.
        </p>
      </Section>

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center no-print">
        <button
          onClick={() => router.push("/dashboard/action-execution")}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Timeline
        </button>

        <button
          onClick={handleNextStep}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Restart Workflow
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}
