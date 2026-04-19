"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Loader2,
  PlayCircle,
  RefreshCw,
  SearchCheck,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section, StatCard } from "@/components/dashboard/ui";
import {
  caseStatusLabel,
  getDashboardCopy,
  noticeTypeLabel,
} from "@/lib/i18n/dashboard";

export default function RescuePathPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const {
    reviewNotice,
    result,
    status,
    liveGuidanceStatus,
    liveGuidance,
    liveGuidanceError,
    runWorkflow,
    verifyLiveGuidance,
    triggerNextStep,
  } = useDashboard();

  useEffect(() => {
    if (!reviewNotice) {
      router.push("/dashboard/intake");
    }
  }, [reviewNotice, router]);

  async function handleNextStep() {
    await triggerNextStep("rescue-path-completed", "Calculated optimal rescue path.", {
      status: result?.rescuePath.status,
      blocker: result?.blockerAssessment.blockerType,
    });
    router.push("/dashboard/action-execution");
  }

  if (!reviewNotice) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-950">{copy.rescue.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          {copy.rescue.copy}
        </p>
      </div>

      {!result && status !== "running" ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-20 text-center shadow-inner">
          <PlayCircle className="mb-6 h-16 w-16 text-emerald-500" />
          <h2 className="mb-2 text-xl font-bold text-slate-950">
            {copy.rescue.readyTitle}
          </h2>
          <p className="mb-8 max-w-lg text-center text-slate-600">
            {copy.rescue.readyCopy}
          </p>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-8 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600"
            onClick={runWorkflow}
            type="button"
          >
            {copy.rescue.run}
          </button>
        </div>
      ) : null}

      {status === "running" ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-24 text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-900">
            {copy.rescue.readingTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {copy.rescue.readingCopy}
          </p>
        </div>
      ) : null}

      {result && status === "complete" ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
            <StatCard
              className="min-h-36 p-5"
              helper={copy.rescue.statNoticeHelper}
              label={copy.rescue.statNoticeType}
              value={noticeTypeLabel(language, result.parsedNotice.noticeType)}
            />
            <StatCard
              className="min-h-36 p-5"
              helper={copy.rescue.statDeadlineHelper}
              label={copy.rescue.statDeadline}
              value={result.parsedNotice.deadlineDate ?? copy.common.verify}
            />
            <StatCard
              className="min-h-36 p-5"
              helper={copy.rescue.statBlockerHelper}
              label={copy.rescue.statBlocker}
              value={result.blockerAssessment.label}
            />
            <StatCard
              className="min-h-36 p-5"
              helper={copy.rescue.statStatusHelper}
              label={copy.rescue.statStatus}
              value={caseStatusLabel(language, result.finalStatus)}
            />
          </div>

          <Section
            className="p-6 sm:p-7"
            eyebrow={copy.rescue.decisionEyebrow}
            title={copy.rescue.decisionTitle}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,0.42fr)] xl:items-start">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                <Badge tone={result.blockerAssessment.urgency === "urgent" || result.blockerAssessment.urgency === "overdue" ? "danger" : "warn"}>
                  {result.blockerAssessment.urgency.toUpperCase()}
                </Badge>
                <Badge tone={result.readinessCheck.shouldEscalate ? "danger" : "good"}>
                  {caseStatusLabel(language, result.rescuePath.status).toUpperCase()}
                </Badge>
                <Badge tone="blue">{result.rescuePath.pathType.replaceAll("_", " ")}</Badge>
                </div>
                <p className="text-lg leading-8 text-slate-800">{result.rescuePath.summary}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <div className="text-sm font-bold text-emerald-950">
                  {copy.rescue.nextAction}
                </div>
                <p className="mt-2 text-base leading-7 text-emerald-950">
                  {result.blockerAssessment.nextAction}
                </p>
              </div>
            </div>
          </Section>

          <Section
            className="p-6 sm:p-7"
            eyebrow={copy.rescue.guidanceEyebrow}
            title={copy.rescue.guidanceTitle}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    tone={
                      liveGuidanceStatus === "success"
                        ? liveGuidance?.status === "verified"
                          ? "good"
                          : "warn"
                        : liveGuidanceStatus === "error"
                          ? "danger"
                          : "neutral"
                    }
                  >
                    {liveGuidanceStatus === "success"
                      ? liveGuidance?.status.toUpperCase()
                      : liveGuidanceStatus.toUpperCase()}
                  </Badge>
                  {liveGuidance?.sources.length ? (
                    <Badge tone="blue">
                      {liveGuidance.sources.length}{" "}
                      {liveGuidance.sources.length === 1
                        ? copy.common.source
                        : copy.common.sources}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {copy.rescue.guidanceCopy}
                </p>
              </div>
              <button
                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={liveGuidanceStatus === "loading"}
                onClick={verifyLiveGuidance}
                type="button"
              >
                {liveGuidanceStatus === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : liveGuidanceStatus === "success" ? (
                  <RefreshCw className="h-5 w-5" />
                ) : (
                  <SearchCheck className="h-5 w-5" />
                )}
                {liveGuidanceStatus === "success"
                  ? copy.rescue.refreshGuidance
                  : copy.rescue.verifyGuidance}
              </button>
            </div>

            {liveGuidanceStatus === "loading" ? (
              <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
                {copy.rescue.searching}
              </div>
            ) : null}

            {liveGuidanceStatus === "error" ? (
              <div className="mt-5 flex gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{liveGuidanceError ?? copy.rescue.guidanceFailed}</span>
              </div>
            ) : null}

            {liveGuidanceStatus === "success" && liveGuidance ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-bold text-slate-950">
                    {copy.rescue.verificationSummary}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {liveGuidance.summary}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    {copy.rescue.query}: {liveGuidance.query}
                  </div>
                </div>

                {liveGuidance.sources.length > 0 ? (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {liveGuidance.sources.map((source) => (
                      <article
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                        key={source.url}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <a
                              className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:text-emerald-700"
                              href={source.finalUrl || source.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              {source.title}
                            </a>
                            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                              {source.siteName ?? new URL(source.url).hostname}
                            </div>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {source.excerpt || source.description || source.snippet}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : null}

                {liveGuidance.caveats.length > 0 ? (
                  <ul className="space-y-2 text-xs leading-5 text-slate-500">
                    {liveGuidance.caveats.map((caveat) => (
                      <li key={caveat}>{caveat}</li>
                    ))}
                  </ul>
                ) : null}

                {liveGuidance.errors.length > 0 ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                    {liveGuidance.errors.join(" ")}
                  </div>
                ) : null}
              </div>
            ) : null}
          </Section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <Section
              className="p-6"
              eyebrow={copy.rescue.findingsEyebrow}
              title={copy.rescue.findingsTitle}
            >
              <ul className="space-y-3 text-sm leading-6 text-slate-700">
                {result.blockerAssessment.findings.map((finding) => (
                  <li className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={finding}>
                    {finding}
                  </li>
                ))}
              </ul>
            </Section>

            <Section
              className="p-6"
              eyebrow={copy.rescue.planEyebrow}
              title={copy.rescue.planTitle}
            >
              <ol className="space-y-3 text-sm leading-6 text-slate-700">
                {result.rescuePath.steps.map((step, index) => (
                  <li className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3" key={step}>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
              onClick={() => router.push("/dashboard/coverage-analysis")}
              type="button"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {copy.rescue.recheck}
            </button>

            <button
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600 sm:w-auto"
              onClick={handleNextStep}
              type="button"
            >
              {copy.rescue.preparePacket}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
