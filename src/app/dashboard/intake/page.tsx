"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Database, UploadCloud } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, classNames } from "@/components/dashboard/ui";

export default function IntakePage() {
  const router = useRouter();
  const {
    mode,
    setMode,
    sampleCases,
    selectedCase,
    updateSelectedCase,
    uploadText,
    updateUploadText,
    fileMessage,
    handleFile,
    reviewNotice,
    triggerNextStep,
  } = useDashboard();

  async function handleNextStep() {
    await triggerNextStep("intake-completed", {
      mode,
      selectedCaseId: selectedCase?.id,
    });
    router.push("/dashboard/coverage-analysis");
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-950">Intake</h1>
        <p className="mt-2 text-slate-600">
          Select a fictional Medicaid notice packet or paste local notice text to begin the rescue workflow.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className={classNames(
            "group relative overflow-hidden rounded-lg border p-5 text-left transition",
            mode === "sample"
              ? "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500/50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
          )}
          onClick={() => setMode("sample")}
          type="button"
        >
          <div className="mb-2 flex items-center gap-3">
            <Database
              className={classNames(
                "h-5 w-5",
                mode === "sample"
                  ? "text-emerald-600"
                  : "text-slate-400 group-hover:text-slate-600",
              )}
            />
            <div className="text-lg font-semibold text-slate-950">Sample Packets</div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Use fictional notices to see blocker detection, readiness checks, and packet preparation.
          </p>
        </button>

        <button
          className={classNames(
            "group relative overflow-hidden rounded-lg border p-5 text-left transition",
            mode === "upload"
              ? "border-emerald-500 bg-emerald-50 shadow-md ring-1 ring-emerald-500/50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm",
          )}
          onClick={() => setMode("upload")}
          type="button"
        >
          <div className="mb-2 flex items-center gap-3">
            <UploadCloud
              className={classNames(
                "h-5 w-5",
                mode === "upload"
                  ? "text-emerald-600"
                  : "text-slate-400 group-hover:text-slate-600",
              )}
            />
            <div className="text-lg font-semibold text-slate-950">Paste or Upload</div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Paste Medicaid notice text or upload a .txt file for local browser review.
          </p>
        </button>
      </div>

      {mode === "sample" ? (
        <Section eyebrow="Demo Path" title="Choose a notice packet">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="case-select">
                Sample case
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                id="case-select"
                onChange={(event) => updateSelectedCase(event.target.value)}
                value={selectedCase.id}
              >
                {sampleCases.map((sampleCase) => (
                  <option key={sampleCase.id} value={sampleCase.id}>
                    {sampleCase.label}
                  </option>
                ))}
              </select>
              <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {selectedCase.description}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Packet contents
              </div>
              <dl className="space-y-4 text-sm">
                <div className="border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Notice</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{selectedCase.notice.title}</dd>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Supporting docs</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {selectedCase.supportingDocuments.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Preference</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {selectedCase.preferences.languagePreference ?? "English"} /{" "}
                    {selectedCase.preferences.contactMethod ?? "SMS"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>
      ) : (
        <Section eyebrow="Your Notice" title="Provide Medicaid notice text">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="upload-text">
                Notice content
              </label>
              <textarea
                className="min-h-[300px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                id="upload-text"
                onChange={(event) => updateUploadText(event.target.value)}
                placeholder="Paste Medicaid closure, renewal, termination, action-required, or case status letter text here."
                value={uploadText}
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="file-upload">
                  Upload .txt file
                </label>
                <input
                  accept=".txt,.pdf,text/plain,application/pdf"
                  className="block w-full text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:font-semibold file:text-white transition hover:file:bg-slate-800"
                  id="file-upload"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  type="file"
                />
                {fileMessage ? (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                    <span className="mt-0.5 shrink-0 text-amber-500">!</span>
                    {fileMessage}
                  </div>
                ) : null}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
                PDFs are not parsed in this local prototype. Extract and paste text from PDFs to analyze.
              </div>
            </div>
          </div>
        </Section>
      )}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!reviewNotice}
          onClick={handleNextStep}
          type="button"
        >
          Analyze Notice
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-disabled:opacity-50" />
        </button>
      </div>
    </div>
  );
}
