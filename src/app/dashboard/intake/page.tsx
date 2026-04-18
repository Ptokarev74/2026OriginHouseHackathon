"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, classNames } from "@/components/dashboard/ui";
import { ArrowRight, UploadCloud, Database } from "lucide-react";

export default function IntakePage() {
  const router = useRouter();
  const { 
    mode, setMode, 
    sampleCases, selectedCase, updateSelectedCase,
    uploadText, updateUploadText, fileMessage, handleFile,
    reviewCase, triggerNextStep 
  } = useDashboard();

  async function handleNextStep() {
    await triggerNextStep("intake-completed", { mode, selectedCaseId: selectedCase?.id });
    router.push("/dashboard/coverage-analysis");
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-950">Intake</h1>
        <p className="text-slate-600 mt-2">
          Select a sample case or supply your own Medicare notices to begin the automated rescue workflow.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => setMode("sample")}
          className={classNames(
            "rounded-lg border p-5 text-left transition relative overflow-hidden group",
            mode === "sample"
              ? "border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500/50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <Database className={classNames("w-5 h-5", mode === "sample" ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
            <div className="font-semibold text-slate-950 text-lg">Sample Data</div>
          </div>
          <p className="text-sm leading-6 text-slate-600">Use fictional local data to see the full workflow quickly.</p>
        </button>

        <button
          onClick={() => setMode("upload")}
          className={classNames(
            "rounded-lg border p-5 text-left transition relative overflow-hidden group",
            mode === "upload"
              ? "border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500/50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <UploadCloud className={classNames("w-5 h-5", mode === "upload" ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
            <div className="font-semibold text-slate-950 text-lg">Upload Documents</div>
          </div>
          <p className="text-sm leading-6 text-slate-600">Paste text or upload a .txt file for local browser review.</p>
        </button>
      </div>

      {mode === "sample" ? (
        <Section eyebrow="Demo Path" title="Try a sample Medicare case">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block" htmlFor="case-select">
                Select Case Profile
              </label>
              <select
                id="case-select"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                value={selectedCase.id}
                onChange={(e) => updateSelectedCase(e.target.value)}
              >
                {sampleCases.map((sc) => (
                  <option key={sc.id} value={sc.id}>{sc.label}</option>
                ))}
              </select>
              <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100 text-sm leading-6 text-slate-600">
                {selectedCase.description}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Current Constraints
              </div>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between gap-3 border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Max radius</dt>
                  <dd className="font-semibold text-slate-950">{selectedCase.preferences.maxDistanceMiles} mi</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Language</dt>
                  <dd className="font-semibold text-slate-950">{selectedCase.preferences.languagePreference ?? "Any"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Transit</dt>
                  <dd className="font-semibold text-slate-950">{selectedCase.preferences.transportationNeeded ? "Required" : "N/A"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>
      ) : (
        <Section eyebrow="Your Documents" title="Provide Medicare Text">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block" htmlFor="upload-text">
                Document Content
              </label>
              <textarea
                id="upload-text"
                className="min-h-[300px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Paste Medicare notices, plan letters, referral notes, discharge instructions, or provider letters here."
                value={uploadText}
                onChange={(e) => updateUploadText(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <label className="text-sm font-semibold text-slate-700 block mb-2" htmlFor="file-upload">
                  Upload .txt File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.pdf,text/plain,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:font-semibold file:text-white file:cursor-pointer hover:file:bg-slate-800 transition"
                />
                {fileMessage && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 flex items-start gap-2">
                    <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                    {fileMessage}
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                PDFs are not parsed in this local prototype. Please extract and paste plain text from PDFs to analyze.
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* FOOTER ACTIONS */}
      <div className="pt-6 border-t border-slate-200 flex justify-end">
        <button
          onClick={handleNextStep}
          disabled={!reviewCase}
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Coverage Details
          <ArrowRight className="w-5 h-5 group-disabled:opacity-50 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
