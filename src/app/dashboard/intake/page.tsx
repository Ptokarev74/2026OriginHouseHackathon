"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Database,
  FileScan,
  FileText,
  ImageIcon,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Section, classNames } from "@/components/dashboard/ui";
import type { FileMessageTone } from "@/components/dashboard/DashboardContext";
import { contactMethodLabel, getDashboardCopy } from "@/lib/i18n/dashboard";

function fileMessageClasses(tone: FileMessageTone) {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-950";
  }
  if (tone === "error") {
    return "border-rose-200 bg-rose-50 text-rose-950";
  }
  if (tone === "warn") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border-sky-200 bg-sky-50 text-sky-950";
}

function fileMessageMarker(tone: FileMessageTone) {
  if (tone === "success") return "bg-emerald-500";
  if (tone === "error") return "bg-rose-500";
  if (tone === "warn") return "bg-amber-500";

  return "bg-sky-500";
}

export default function IntakePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = getDashboardCopy(language);
  const defaultLanguagePreference =
    language === "so" ? "Soomaali" : language === "es" ? "Espanol" : "English";
  const extractingTextLabel =
    language === "so"
      ? "Qoraal ayaa laga soo saaraya..."
      : language === "es"
        ? "Extrayendo texto..."
        : "Extracting text...";
  const {
    mode,
    setMode,
    sampleCases,
    selectedCase,
    updateSelectedCase,
    uploadText,
    updateUploadText,
    fileMessage,
    fileMessageTone,
    ocrState,
    uploadSourceKind,
    handleFile,
    reviewNotice,
    triggerNextStep,
  } = useDashboard();

  const isExtracting = ocrState.status === "extracting";
  const isOcrText =
    uploadSourceKind === "pdf_ocr" || uploadSourceKind === "image_ocr";

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
        <h1 className="text-3xl font-bold text-slate-950">{copy.intake.title}</h1>
        <p className="mt-2 text-slate-600">
          {copy.intake.copy}
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
            <div className="text-lg font-semibold text-slate-950">
              {copy.intake.sampleTitle}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {copy.intake.sampleCopy}
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
            <div className="text-lg font-semibold text-slate-950">
              {copy.intake.uploadTitle}
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            {copy.intake.uploadCopy}
          </p>
        </button>
      </div>

      {mode === "sample" ? (
        <Section eyebrow={copy.intake.demoEyebrow} title={copy.intake.choosePacket}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="case-select">
                {copy.intake.sampleCase}
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
                {copy.intake.packetContents}
              </div>
              <dl className="space-y-4 text-sm">
                <div className="border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">{copy.intake.notice}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">{selectedCase.notice.title}</dd>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">{copy.intake.supportingDocs}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {selectedCase.supportingDocuments.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">{copy.intake.preference}</dt>
                  <dd className="mt-1 font-semibold text-slate-950">
                    {selectedCase.preferences.languagePreference ??
                      defaultLanguagePreference} /{" "}
                    {contactMethodLabel(
                      language,
                      selectedCase.preferences.contactMethod ?? "SMS",
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>
      ) : (
        <Section eyebrow={copy.intake.yourNotice} title={copy.intake.provideText}>
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <FileText className="h-4 w-4 text-slate-500" />
                {copy.intake.pasteText}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {copy.intake.pasteTextCopy}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <UploadCloud className="h-4 w-4 text-slate-500" />
                {copy.intake.uploadTxt}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {copy.intake.uploadTxtCopy}
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                <FileScan className="h-4 w-4 text-emerald-700" />
                {copy.intake.ocr}
              </div>
              <p className="mt-2 text-xs leading-5 text-emerald-900">
                {copy.intake.ocrCopy}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="upload-text">
                {isOcrText ? copy.intake.extractedText : copy.intake.noticeContent}
              </label>
              {isOcrText ? (
                <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  {copy.intake.ocrReady}
                </div>
              ) : null}
              <textarea
                className="min-h-[300px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isExtracting}
                id="upload-text"
                onChange={(event) => updateUploadText(event.target.value)}
                placeholder={copy.intake.placeholder}
                value={uploadText}
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="file-upload">
                  {copy.intake.uploadFile}
                </label>
                <input
                  accept=".txt,.pdf,.png,.jpg,.jpeg,text/plain,application/pdf,image/png,image/jpeg"
                  className="block w-full text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:font-semibold file:text-white transition hover:file:bg-slate-800"
                  disabled={isExtracting}
                  id="file-upload"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFile(file);
                    event.currentTarget.value = "";
                  }}
                  type="file"
                />
                <div className="mt-4 grid gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    {copy.intake.txtFiles}
                  </div>
                  <div className="flex items-center gap-2">
                    <FileScan className="h-4 w-4 text-slate-400" />
                    {copy.intake.pdfFiles}
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-slate-400" />
                    {copy.intake.imageFiles}
                  </div>
                </div>
                {isExtracting ? (
                  <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-sky-950">
                      <Loader2 className="h-4 w-4 animate-spin text-sky-700" />
                      {ocrState.label ?? extractingTextLabel}
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-sky-600 transition-all"
                        style={{
                          width: `${Math.round(Math.max(0.04, ocrState.progress) * 100)}%`,
                        }}
                      />
                    </div>
                    {ocrState.detail ? (
                      <p className="mt-2 text-xs leading-5 text-sky-900">{ocrState.detail}</p>
                    ) : null}
                  </div>
                ) : null}
                {fileMessage ? (
                  <div
                    className={classNames(
                      "mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm leading-6",
                      fileMessageClasses(fileMessageTone),
                    )}
                  >
                    <span
                      className={classNames(
                        "mt-2 h-2 w-2 shrink-0 rounded-full",
                        fileMessageMarker(fileMessageTone),
                      )}
                    />
                    {fileMessage}
                  </div>
                ) : null}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm">
                {copy.intake.ocrLocal}
              </div>
            </div>
          </div>
        </Section>
      )}

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button
          className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!reviewNotice || isExtracting}
          onClick={handleNextStep}
          type="button"
        >
          {copy.intake.analyzeNotice}
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-disabled:opacity-50" />
        </button>
      </div>
    </div>
  );
}
