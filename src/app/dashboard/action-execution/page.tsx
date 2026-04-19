"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, ServerCog } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Badge, Section, classNames } from "@/components/dashboard/ui";
import { caseStatusLabel, getDashboardCopy } from "@/lib/i18n/dashboard";
import { localizedWorkflowSteps, workflowSteps } from "@/lib/workflow/agent";

export default function PacketPreparationPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const { result, status, activeStep, triggerNextStep } = useDashboard();
  const displayWorkflowSteps = localizedWorkflowSteps(language);

  useEffect(() => {
    if (!result && status !== "running") {
      router.push("/dashboard/rescue-path");
    }
  }, [result, status, router]);

  async function handleNextStep() {
    await triggerNextStep("packet-preparation-completed", {
      artifacts: result?.artifacts.map((artifact) => artifact.kind),
    });
    router.push("/dashboard/final-status");
  }

  const activeIndex = activeStep
    ? workflowSteps.findIndex((step) => step.id === activeStep)
    : -1;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-950">{copy.packet.title}</h1>
        <p className="mt-2 text-slate-600">
          {copy.packet.copy}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section eyebrow={copy.packet.timelineEyebrow} title={copy.packet.timelineTitle}>
          <div className="mt-4 space-y-5">
            {displayWorkflowSteps.map((step, index) => {
              const completed =
                status === "complete" || (status === "running" && index < activeIndex);
              const active = status === "running" && activeStep === step.id;

              return (
                <div className="flex gap-4" key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={classNames(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition-colors",
                        completed
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                          : active
                            ? "animate-pulse border-sky-300 bg-sky-100 text-sky-800"
                            : "border-slate-200 bg-slate-50 text-slate-400",
                      )}
                    >
                      {completed ? <CheckCircle className="h-5 w-5" /> : index + 1}
                    </div>
                    {index < workflowSteps.length - 1 ? (
                      <div
                        className={classNames(
                          "my-2 h-8 w-px",
                          completed ? "bg-emerald-200" : "bg-slate-200",
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className={classNames(
                          "text-base font-semibold",
                          completed || active ? "text-slate-950" : "text-slate-500",
                        )}
                      >
                        {step.label}
                      </h3>
                      {active ? <Badge tone="blue">{copy.common.running}</Badge> : null}
                      {completed ? <Badge tone="good">{copy.status.done}</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section eyebrow={copy.packet.readinessEyebrow} title={copy.packet.readinessTitle}>
          {!result ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
              <ServerCog className="mb-3 h-8 w-8 animate-spin" />
              <p>{copy.packet.awaiting}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-900">
                    {caseStatusLabel(language, result.readinessCheck.status)}
                  </span>
                  <Badge tone={result.readinessCheck.shouldEscalate ? "danger" : result.readinessCheck.readyToSubmit ? "good" : "warn"}>
                    {result.readinessCheck.readyToSubmit
                      ? copy.packet.ready
                      : result.readinessCheck.shouldEscalate
                        ? copy.packet.escalate
                        : copy.packet.missingItems}
                  </Badge>
                </div>
                <ul className="space-y-2 text-sm leading-6 text-slate-700">
                  {result.readinessCheck.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="text-sm font-bold text-amber-950">
                  {copy.packet.missingRequirements}
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-900">
                  {result.readinessCheck.missingDocuments.length > 0
                    ? result.readinessCheck.missingDocuments.join(", ")
                    : copy.common.noMissingRequirement}
                </p>
              </div>
            </div>
          )}
        </Section>
      </div>

      {result ? (
        <Section eyebrow={copy.packet.artifactsEyebrow} title={copy.packet.artifactsTitle}>
          <div className="grid gap-4">
            {result.artifacts.map((artifact) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                key={artifact.id}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{artifact.label}</span>
                  <Badge tone={artifact.status === "blocked" ? "danger" : "good"}>
                    {artifact.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{artifact.summary}</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  {artifact.content}
                </pre>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={() => router.push("/dashboard/rescue-path")}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {copy.packet.back}
        </button>

        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status !== "complete"}
          onClick={handleNextStep}
          type="button"
        >
          {copy.packet.next}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
