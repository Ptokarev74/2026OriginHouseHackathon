"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, RefreshCw } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section } from "@/components/dashboard/ui";

export default function FinalStatusPage() {
  const router = useRouter();
  const { result, status, triggerNextStep, setMode } = useDashboard();

  useEffect(() => {
    if (!result && status !== "running" && status !== "complete") {
      router.push("/dashboard/action-execution");
    }
  }, [result, status, router]);

  async function handleRestart() {
    await triggerNextStep("final-status-completed", {
      finalStatus: result?.finalStatus,
    });
    setMode("sample");
    router.push("/dashboard/intake");
  }

  if (!result) return null;

  const statusTone = result.finalStatus === "escalation_needed"
    ? "danger"
    : result.finalStatus === "ready_to_submit"
      ? "good"
      : "warn";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Final Status</h1>
          <p className="mt-2 text-slate-600">
            Review the rescue result and print a case summary for follow-up.
          </p>
        </div>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => window.print()}
          type="button"
        >
          <Printer className="h-5 w-5" />
          Print Summary
        </button>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Rescue outcome
            </div>
            <h2 className="mt-1 text-3xl font-bold text-emerald-950">
              {result.finalStatus === "ready_to_submit"
                ? "Ready to submit"
                : result.finalStatus === "escalation_needed"
                  ? "Escalation needed"
                  : "Awaiting documents"}
            </h2>
          </div>
          <Badge tone={statusTone}>{result.finalStatus.replaceAll("_", " ").toUpperCase()}</Badge>
        </div>

        <p className="text-lg leading-relaxed text-slate-800">{result.outcomeSummary}</p>

        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-emerald-950">Next steps</h3>
          <ul className="space-y-3">
            {result.patientInstructions.map((instruction, index) => (
              <li
                className="flex items-start gap-3 rounded-lg border border-emerald-100/50 bg-white/80 p-4 shadow-sm"
                key={instruction}
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <span className="leading-relaxed text-slate-800">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Section eyebrow="Reference File" title="Printable rescue summary" className="print-summary">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Medicaid notice rescue summary
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This summary is generated from fictional or locally pasted text for a frontend demo.
            </p>
          </div>
          <Badge tone="neutral">Informational only</Badge>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-950">
              Notice summary
            </h3>
            <p className="text-sm leading-6 text-slate-700">
              {result.parsedNotice.documentSummary}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-950">
              Reviewed details
            </h3>
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">Notice:</dt>
                <dd className="text-right font-medium">
                  {result.parsedNotice.noticeType.replaceAll("_", " ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">Deadline:</dt>
                <dd className="text-right font-medium">
                  {result.parsedNotice.deadlineDate ?? "Verify manually"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">Blocker:</dt>
                <dd className="text-right font-medium">{result.blockerAssessment.label}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">Status:</dt>
                <dd className="text-right font-medium">
                  {result.finalStatus.replaceAll("_", " ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">Risk language</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {result.parsedNotice.riskLanguage.map((item) => (
                <li className="list-disc" key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">Missing items</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {(result.readinessCheck.missingDocuments.length > 0
                ? result.readinessCheck.missingDocuments
                : ["No targeted missing requirement remains in the demo packet."]
              ).map((item) => (
                <li className="list-disc" key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">Readiness checks</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {result.readinessCheck.checks.map((check) => (
                <li className="list-disc" key={check}>{check}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="rounded-lg border border-amber-200/50 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          This prototype interprets notices and prepares next steps. It does not determine Medicaid eligibility, provide legal advice, submit paperwork, contact agencies, store real sensitive information, or replace a human reviewer.
        </p>
      </Section>

      <div className="no-print flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => router.push("/dashboard/action-execution")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Packet
        </button>

        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          onClick={handleRestart}
          type="button"
        >
          Restart Workflow
          <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>
    </div>
  );
}
