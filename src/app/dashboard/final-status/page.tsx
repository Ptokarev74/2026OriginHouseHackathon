"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section } from "@/components/dashboard/ui";
import {
  caseStatusLabel,
  finalStatusHeadline,
  getDashboardCopy,
  noticeTypeLabel,
} from "@/lib/i18n/dashboard";

export default function FinalStatusPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const { result, status, triggerNextStep, setMode } = useDashboard();

  useEffect(() => {
    if (!result && status !== "running" && status !== "complete") {
      router.push("/dashboard/action-execution");
    }
  }, [result, status, router]);

  async function handleRestart() {
    await triggerNextStep("final-status-completed", "Reached final rescue status.", {
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
          <h1 className="text-3xl font-bold text-slate-950">{copy.final.title}</h1>
          <p className="mt-2 text-slate-600">
            {copy.final.copy}
          </p>
        </div>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => window.print()}
          type="button"
        >
          <Printer className="h-5 w-5" />
          {copy.final.print}
        </button>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {copy.final.outcome}
            </div>
            <h2 className="mt-1 text-3xl font-bold text-emerald-950">
              {finalStatusHeadline(language, result.finalStatus)}
            </h2>
          </div>
          <Badge tone={statusTone}>
            {caseStatusLabel(language, result.finalStatus).toUpperCase()}
          </Badge>
        </div>

        <p className="text-lg leading-relaxed text-slate-800">{result.outcomeSummary}</p>

        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-emerald-950">
            {copy.final.nextSteps}
          </h3>
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

      <Section
        eyebrow={copy.final.referenceEyebrow}
        title={copy.final.referenceTitle}
        className="print-summary"
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              {copy.final.summaryTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {copy.final.summaryCopy}
            </p>
          </div>
          <Badge tone="neutral">{copy.common.informationalOnly}</Badge>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-950">
              {copy.final.noticeSummary}
            </h3>
            <p className="text-sm leading-6 text-slate-700">
              {result.parsedNotice.documentSummary}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-950">
              {copy.final.reviewedDetails}
            </h3>
            <dl className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">{copy.final.notice}</dt>
                <dd className="text-right font-medium">
                  {noticeTypeLabel(language, result.parsedNotice.noticeType)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">{copy.final.deadline}</dt>
                <dd className="text-right font-medium">
                  {result.parsedNotice.deadlineDate ?? copy.common.verifyManually}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">{copy.final.blocker}</dt>
                <dd className="text-right font-medium">{result.blockerAssessment.label}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-semibold text-slate-500">{copy.final.status}</dt>
                <dd className="text-right font-medium">
                  {caseStatusLabel(language, result.finalStatus)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">{copy.final.riskLanguage}</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {result.parsedNotice.riskLanguage.map((item) => (
                <li className="list-disc" key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">{copy.final.missingItems}</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {(result.readinessCheck.missingDocuments.length > 0
                ? result.readinessCheck.missingDocuments
                : [copy.common.noMissingRequirement]
              ).map((item) => (
                <li className="list-disc" key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-bold text-slate-950">{copy.final.readinessChecks}</h3>
            <ul className="space-y-2 pl-4 text-sm text-slate-700 marker:text-slate-300">
              {result.readinessCheck.checks.map((check) => (
                <li className="list-disc" key={check}>{check}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="rounded-lg border border-amber-200/50 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
          {copy.final.disclaimer}
        </p>
      </Section>

      <div className="no-print flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => router.push("/dashboard/action-execution")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {copy.final.back}
        </button>

        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          onClick={handleRestart}
          type="button"
        >
          {copy.final.restart}
          <RefreshCw className="h-5 w-5 transition-transform duration-500 group-hover:rotate-180" />
        </button>
      </div>
    </div>
  );
}
