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
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section, StatCard } from "@/components/dashboard/ui";

export default function RescuePathPage() {
  const router = useRouter();
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
    await triggerNextStep("rescue-path-completed", {
      status: result?.rescuePath.status,
      blocker: result?.blockerAssessment.blockerType,
    });
    router.push("/dashboard/action-execution");
  }

  if (!reviewNotice) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-950">Rescue Path</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Run the local rescue agent to identify the blocker, urgency, status, and next action.
        </p>
      </div>

      {!result && status !== "running" ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-20 text-center shadow-inner">
          <PlayCircle className="mb-6 h-16 w-16 text-emerald-500" />
          <h2 className="mb-2 text-xl font-bold text-slate-950">Ready to run rescue agent</h2>
          <p className="mb-8 max-w-lg text-center text-slate-600">
            The agent will read the notice, classify the exact blocker, choose the rescue path, and check readiness.
          </p>
          <button
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-8 py-3 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600"
            onClick={runWorkflow}
            type="button"
          >
            Run Rescue Agent
          </button>
        </div>
      ) : null}

      {status === "running" ? (
        <div className="flex min-h-[26rem] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-24 text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-900">Reading notice packet...</h2>
          <p className="mt-2 text-sm text-slate-500">
            Extracting deadline, risk language, missing requirements, and readiness.
          </p>
        </div>
      ) : null}

      {result && status === "complete" ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
            <StatCard
              className="min-h-36 p-5"
              helper="Extracted from the notice packet"
              label="Notice type"
              value={result.parsedNotice.noticeType.replaceAll("_", " ")}
            />
            <StatCard
              className="min-h-36 p-5"
              helper="Response date to confirm"
              label="Deadline"
              value={result.parsedNotice.deadlineDate ?? "Verify"}
            />
            <StatCard
              className="min-h-36 p-5"
              helper="Exact blocker putting coverage at risk"
              label="Blocker"
              value={result.blockerAssessment.label}
            />
            <StatCard
              className="min-h-36 p-5"
              helper="Agent readiness status"
              label="Status"
              value={result.finalStatus.replaceAll("_", " ")}
            />
          </div>

          <Section className="p-6 sm:p-7" eyebrow="Decision" title="Rescue path identified">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(14rem,0.42fr)] xl:items-start">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <Badge tone={result.blockerAssessment.urgency === "urgent" || result.blockerAssessment.urgency === "overdue" ? "danger" : "warn"}>
                    {result.blockerAssessment.urgency.toUpperCase()}
                  </Badge>
                  <Badge tone={result.readinessCheck.shouldEscalate ? "danger" : "good"}>
                    {result.rescuePath.status.replaceAll("_", " ").toUpperCase()}
                  </Badge>
                  <Badge tone="blue">{result.rescuePath.pathType.replaceAll("_", " ")}</Badge>
                </div>
                <p className="text-lg leading-8 text-slate-800">{result.rescuePath.summary}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                <div className="text-sm font-bold text-emerald-950">Next action</div>
                <p className="mt-2 text-base leading-7 text-emerald-950">
                  {result.blockerAssessment.nextAction}
                </p>
              </div>
            </div>
          </Section>

          <Section className="p-6 sm:p-7" eyebrow="Live Guidance" title="Public-web verification">
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
                      {liveGuidance.sources.length} SOURCE
                      {liveGuidance.sources.length === 1 ? "" : "S"}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  TinyFish checks fresh public sources for guidance related to the blocker,
                  missing requirements, deadlines, and escalation path.
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
                {liveGuidanceStatus === "success" ? "Refresh Guidance" : "Verify Guidance"}
              </button>
            </div>

            {liveGuidanceStatus === "loading" ? (
              <div className="mt-5 rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
                Searching public-web guidance and extracting the strongest sources...
              </div>
            ) : null}

            {liveGuidanceStatus === "error" ? (
              <div className="mt-5 flex gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{liveGuidanceError ?? "Live guidance verification failed."}</span>
              </div>
            ) : null}

            {liveGuidanceStatus === "success" && liveGuidance ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="text-sm font-bold text-slate-950">Verification summary</div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {liveGuidance.summary}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    Query: {liveGuidance.query}
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
            <Section className="p-6" eyebrow="Blocker Evidence" title="Findings">
              <ul className="space-y-3 text-sm leading-6 text-slate-700">
                {result.blockerAssessment.findings.map((finding) => (
                  <li className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={finding}>
                    {finding}
                  </li>
                ))}
              </ul>
            </Section>

            <Section className="p-6" eyebrow="Plan" title="Required rescue steps">
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
              Recheck Fields
            </button>

            <button
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600 sm:w-auto"
              onClick={handleNextStep}
              type="button"
            >
              Prepare Packet
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
